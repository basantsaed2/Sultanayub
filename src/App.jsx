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

const App = () => {
  const auth = useAuth();
  const hideSide = auth.hideSidebar;
  const [allCount, setAllCount] = useState(0);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchCountOrders,
    loading,
    data: dataCountOrders,
  } = useGet({
    url: `${apiUrl}/admin/order/count`,
  });
  const { refetch: refetchSong, loading: loadingSong, data: dataSong } = useGet({
    url: `${apiUrl}/admin/settings/notification_sound`,
  });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/order/notification` });
  const ordersAll = useSelector((state) => state.ordersAll.data);
  const newOrders = useSelector((state) => state.newOrders);
  const soundNotification = useSelector((state) => state.soundNotification);

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [orderCounts, setOrderCounts] = useState(0);
  const [orderId, setOrderId] = useState('');

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
      console.log('Fetched song from API At App:', dataSong.notification_sound);
    }
  }, [dataSong, dispatch]);

  const handleClose = () => setIsOpen(false);


  // Update `orderCounts` when a response is received
  useEffect(() => {
    if (response?.data?.new_orders !== undefined) {
      console.log('Response received:', response);
      setOrderCounts(response.data.new_orders);
      setOrderId(response.data.order_id)
    }
  }, [response]);

  // Update `newOrders` in Redux store and play sound
  useEffect(() => {
    if (orderCounts > 0) {
      dispatch(setNewOrders({ count: orderCounts, id: orderId }));

      if (soundNotification && soundNotification.data) {
        const audio = new Audio(soundNotification.data); // Create a new Audio object
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        console.log('Playing sound notification.');
        console.log('audio', audio);
      } else {
        console.log('No sound notification available.');
      }
    }
  }, [orderCounts, soundNotification, dispatch]);

  // Open/close modal based on `newOrders` count
  useEffect(() => {
    setIsOpen(newOrders?.count > 0);
  }, [newOrders]);

  const counters = {
    ordersAll: dataCountOrders?.orders || 0,
    ordersPending: dataCountOrders?.pending || 0,
    ordersConfirmed: dataCountOrders?.confirmed || 0,
    ordersProcessing: dataCountOrders?.processing || 0,
    ordersOutForDelivery: dataCountOrders?.out_for_delivery || 0,
    ordersDelivered: dataCountOrders?.delivered || 0,
    ordersReturned: dataCountOrders?.returned || 0,
    ordersFailed: dataCountOrders?.faild_to_deliver || 0,
    ordersCanceled: dataCountOrders?.canceled || 0,
    ordersSchedule: dataCountOrders?.scheduled || 0,
    ordersRefund: dataCountOrders?.refund || 0,
  };

  useEffect(() => {
    if (dataCountOrders) {
      setAllCount(dataCountOrders.orders);
    }
  }
    , [dataCountOrders]);

  // Poll the notification endpoint every 8 seconds
  useEffect(() => {
    if (!allCount) return; // Exit if ordersAll is not available
    const interval = setInterval(() => {
      console.log("Sending request to notification endpoint...");
      const formData = new FormData();
      formData.append('orders', allCount || 0);
      postData(formData);
    }, 8000);

    return () => clearInterval(interval); // Cleanup interval
  }, [ordersAll, postData, loading, dataCountOrders]);

  useEffect(() => {
    if (loadingPost && response) return; // Exit if ordersAll is not available
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
      <div className="relative w-full flex h-screen overflow-hidden bg-secoundBgColor">
        {/* Sidebar */}
        <div className={`${hideSide ? 'w-60' : 'w-16'} fixed left-0 z-10 duration-300 overflow-hidden`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className={`${hideSide ? 'pl-60' : 'pl-16'} w-full duration-300`}>
          {/* Navbar */}
          <div className="sticky top-0 z-10 bg-secoundBgColor">
            <Navbar />
          </div>

          {/* Main Content Area */}
          <div className="relative w-full px-3 h-full overflow-y-scroll scrollPage">
            <Outlet />
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;
