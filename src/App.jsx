import './index.css';
import { Outlet } from 'react-router-dom';
import { useAuth } from './Context/Auth';
import { Navbar, NewOrdersComponent, Sidebar } from './Components/Components';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setNewOrders, setSoundNotification } from './Store/CreateSlices';
import { usePost } from './Hooks/usePostJson';
import { useNavigate } from 'react-router-dom';
import { useGet } from './Hooks/useGet';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();

  // 🔥 Dynamically update the <title>
  useEffect(() => {
    document.title = t('projectName');
  }, [t, i18n.language]);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const auth = useAuth();
  const hideSide = auth.hideSidebar;
  const [allCount, setAllCount] = useState(0);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const role = localStorage.getItem("role"); // read role

  // Count orders endpoint depends on role
  const branchesUrl =
    role === "branch"
      ? `${apiUrl}/branch/online_order/count_orders`
      : `${apiUrl}/admin/order/count`;

  // Notification endpoint depends on role
  const notificationUrl =
    role === "branch"
      ? `${apiUrl}/branch/online_order/notification`
      : `${apiUrl}/admin/order/notification`;

  // Sound notification is always admin (no branch endpoint given)
  const notificationSoundUrl =
    role === "admin"
      ? `${apiUrl}/admin/settings/notification_sound`
      : null;// No sound for branch role

  const {
    refetch: refetchCountOrders,
    loading,
    data: dataCountOrders,
  } = useGet({
    url: branchesUrl,
  });

  const {
    refetch: refetchSong,
    loading: loadingSong,
    data: dataSong,
  } = useGet({
    url: notificationSoundUrl,
  });

  const { postData, loadingPost, response } = usePost({
    url: notificationUrl,
  });

  const newOrders = useSelector((state) => state.newOrders);
  const soundNotification = useSelector((state) => state.soundNotification);

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [orderCounts, setOrderCounts] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [newOrder, setNewOrder] = useState([]);

  const playNotificationSound = (soundUrl) => {
    const audio = new Audio(soundUrl);
    audio.volume = 1.0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          console.log('Audio played successfully');
        })
        .catch(error => {
          console.error('Playback failed:', error);
          setTimeout(() => {
            audio.play().catch(e => console.error('Retry failed:', e));
          }, 1000);
        });
    }
  };

  // Fetch data from the API
  useEffect(() => {
    refetchSong();
  }, [refetchSong]);

  useEffect(() => {
    refetchCountOrders();
  }, [refetchCountOrders]);

  // Update song source when API data is received
  useEffect(() => {
    if (dataSong && dataSong.notification_sound) {
      dispatch(setSoundNotification(dataSong.notification_sound));
    }
  }, [dataSong, dispatch]);

  const handleClose = () => setIsOpen(false);

  // Update `orderCounts` when a response is received
  useEffect(() => {
    if (response?.data?.new_orders !== undefined) {
      setOrderCounts(response.data.new_orders);
      setOrderId(response.data.order_id)
    }
  }, [response]);

  // Update `newOrders` in Redux store and play sound
  useEffect(() => {
    if (orderCounts > 0) {
      dispatch(setNewOrders({ count: orderCounts, id: orderId }));

      if (soundNotification && soundNotification.data) {
        playNotificationSound(soundNotification.data);
      }
    }
  }, [orderCounts, soundNotification, dispatch]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && newOrders?.count > 0) {
        if (soundNotification && soundNotification.data) {
          playNotificationSound(soundNotification.data);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [newOrders, soundNotification]);

  // Open/close modal based on `newOrders` count
  useEffect(() => {
    setIsOpen(newOrders?.count > 0);
  }, [newOrders]);

  useEffect(() => {
    if (dataCountOrders) {
      setAllCount(dataCountOrders.orders);
    }
  }, [dataCountOrders]);

  // Poll the notification endpoint every 8 seconds
  useEffect(() => {
    if (!allCount) return;
    const interval = setInterval(() => {
      const formData = new FormData();
      formData.append('orders', allCount || 0);
      postData(formData);
    }, 8000);

    return () => clearInterval(interval);
  }, [postData, loading, dataCountOrders]);

  useEffect(() => {
    if (loadingPost && response) return;
    refetchCountOrders();
  }, [response]);

  return (
    <PrimeReactProvider>
      {isOpen && (
        <NewOrdersComponent
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
      <div className="relative flex w-full min-h-screen overflow-hidden bg-secoundBgColor">
        {/* Sidebar */}
        <div className={`${hideSide ? 'w-60' : 'w-16'} ${direction === "ltr" ? 'left-0' : 'right-0'} fixed left-0 z-10 duration-300 overflow-hidden`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className={`
        w-full duration-300
        ${direction === "ltr"
            ? (hideSide ? 'pl-60' : 'pl-16')
            : (hideSide ? 'pr-60' : 'pr-16')
          }
      `}>
          {/* Navbar */}
          <div className="sticky top-0 z-10 bg-secoundBgColor">
            <Navbar />
          </div>

          {/* Main Content Area */}
          <div className="relative w-full h-full px-3 overflow-y-scroll scrollPage">
            <Outlet />
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;