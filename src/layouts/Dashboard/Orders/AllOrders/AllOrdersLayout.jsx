import { useEffect, useState } from "react";
import { LoaderLogin, TitlePage } from "../../../../Components/Components";
import {
  AllOrdersPage,
  CartsOrderSection,
  SelectDateRangeSection,
} from "../../../../Pages/Pages";
import { useGet } from "../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { OrdersComponent } from "../../../../Store/CreateSlices";

const AllOrdersLayout = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();

  // الحصول على الـ role من localStorage أو تعيين قيمة افتراضية
  const userRole = localStorage.getItem("role") || "admin";

  // حالة محلية لحفظ البيانات
  const [ordersData, setOrdersData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Initialize as false

  // البيانات من Redux (للـ admin فقط)
  const ordersAllCount = useSelector((state) => state.ordersAll?.data || []);
  const ordersAllCountLoading = useSelector((state) => state.ordersAll?.loading || false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // تحديد الـ URL بناءً على الدور (role)
  const apiEndpoint =
    userRole === "branch"
      ? `${apiUrl}/branch/online_order`
      : `${apiUrl}/admin/order/branches`;

  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: apiEndpoint,
    // Add a condition here to skip initial fetch for admin if data is already in Redux,
    // though the current logic handles it by checking userRole
    enabled: userRole === "branch" // Only enable this useGet for branch role
  });

  // Debug: طباعة البيانات للتحقق من الـ structure
  useEffect(() => {
    console.log("=== Debug Info ===");
    console.log("userRole:", userRole);
    console.log("apiEndpoint:", apiEndpoint);
    console.log("dataBranch:", dataBranch);
    console.log("loadingBranch:", loadingBranch);
    console.log("isDataLoaded:", isDataLoaded);
    console.log("================");
  }, [userRole, apiEndpoint, dataBranch, loadingBranch, isDataLoaded]);

  // Effect to refetch data for the branch role
  useEffect(() => {
    if (userRole === "branch") {
      const fetchData = async () => {
        try {
          // Reset dataLoaded state when refetching for branch
          setIsDataLoaded(false);
          await refetchBranch();
          console.log("Refetch completed successfully for branch");
        } catch (error) {
          console.error("Error fetching data for branch:", error);
          // Ensure isDataLoaded is set to true even on error to stop loading
          setIsDataLoaded(true);
        }
      };
      fetchData();
    }
  }, [userRole, refetchBranch]); // Dependency on userRole to trigger on role change

  // تحديث البيانات بناءً على الدور - مع تحسين التحقق
  useEffect(() => {
    if (userRole === "branch") {
      // For branch: Data processing once loading is complete
      if (!loadingBranch) {
        console.log("Branch loading finished, dataBranch:", dataBranch);

        // Always set ordersData to an array, even if dataBranch is null/undefined
        let extractedOrders = [];
        if (dataBranch !== null && dataBranch !== undefined) {
          console.log("Branch data structure:", Object.keys(dataBranch));
          if (Array.isArray(dataBranch.orders)) {
            extractedOrders = dataBranch.orders;
          } else if (Array.isArray(dataBranch.data)) {
            extractedOrders = dataBranch.data;
          } else if (Array.isArray(dataBranch)) {
            extractedOrders = dataBranch;
          } else {
            console.warn("Branch data structure not recognized, setting empty array:", dataBranch);
          }
        } else {
          console.log("Branch dataBranch is null/undefined, setting empty array");
        }
        setOrdersData(extractedOrders);

        // Crucial: Set isDataLoaded to true once loadingBranch is false
        setIsDataLoaded(true);
      }
    } else {
      // For admin: Redux data is already available
      if (Array.isArray(ordersAllCount)) {
        setOrdersData(ordersAllCount);
      } else {
        setOrdersData([]);
      }
      // Ensure isDataLoaded is set to true for admin once Redux data is processed
      setIsDataLoaded(true);
    }
  }, [dataBranch, ordersAllCount, userRole, loadingBranch]); // Add ordersAllCount to dependencies for admin

  // حساب العدادات مع تحسين التحقق من البيانات
  const counters = userRole === "branch"
    ? {
        // Use ordersData (local state) for counters for branch as well after it's set
        ordersAll: Array.isArray(ordersData) ? ordersData.length : 0, // Changed to ordersData
        ordersPending: Array.isArray(dataBranch?.pending) ? dataBranch.pending.length : 0,
        ordersConfirmed: Array.isArray(dataBranch?.confirmed) ? dataBranch.confirmed.length : 0,
        ordersProcessing: Array.isArray(dataBranch?.processing) ? dataBranch.processing.length : 0,
        ordersOutForDelivery: Array.isArray(dataBranch?.out_for_delivery) ? dataBranch.out_for_delivery.length : 0,
        ordersDelivered: Array.isArray(dataBranch?.delivered) ? dataBranch.delivered.length : 0,
        ordersReturned: Array.isArray(dataBranch?.returned) ? dataBranch.returned.length : 0,
        ordersRefund: Array.isArray(dataBranch?.refund) ? dataBranch.refund.length : 0,
        ordersFailed: Array.isArray(dataBranch?.faild_to_deliver) ? dataBranch.faild_to_deliver.length : 0,
        ordersCanceled: Array.isArray(dataBranch?.canceled) ? dataBranch.canceled.length : 0,
        ordersSchedule: Array.isArray(dataBranch?.scheduled) ? dataBranch.scheduled.length : 0,
      }
    : {
        ordersAll: ordersData.length,
        ordersPending: ordersData.filter((order) => order.order_status === "pending").length,
        ordersConfirmed: ordersData.filter((order) => order.order_status === "confirmed").length,
        ordersProcessing: ordersData.filter((order) => order.order_status === "processing").length,
        ordersOutForDelivery: ordersData.filter((order) => order.order_status === "out_for_delivery").length,
        ordersDelivered: ordersData.filter((order) => order.order_status === "delivered").length,
        ordersReturned: ordersData.filter((order) => order.order_status === "returned").length,
        ordersRefund: ordersData.filter((order) => order.order_status === "refund").length,
        ordersFailed: ordersData.filter((order) => order.order_status === "failed_to_deliver").length,
        ordersCanceled: ordersData.filter((order) => order.order_status === "canceled").length,
        ordersSchedule: ordersData.filter((order) => order.order_status === "scheduled").length,
      };

  // تحديد حالة التحميل - مع إضافة timeout للحماية
  // This derivation is cleaner
  const isLoading = userRole === "branch"
    ? loadingBranch || !isDataLoaded // For branch, if still loading from API or data isn't processed yet
    : ordersAllCountLoading; // For admin, rely on Redux loading state

  // Removed the redundant `useEffect` for forcing `isDataLoaded` and the timeout.
  // The primary `useEffect` should be sufficient with the improved logic.

  // Debug info
  console.log("Final Debug Info:", {
    userRole,
    ordersDataLength: ordersData.length,
    isLoading,
    isDataLoaded,
    dataBranchExists: !!dataBranch,
    loadingBranch,
    ordersAllCountLength: ordersAllCount.length,
    apiEndpoint,
    counters
  });

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        <TitlePage text={t("AllOrders")} />
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <LoaderLogin />
          </div>
        ) : (
          <>
            <SelectDateRangeSection
              typPage={"all"}
              branchsData={userRole === "branch" ? dataBranch : dataBranch}
            />
            <CartsOrderSection ordersNum={counters} />
            <AllOrdersPage />
          </>
        )}
      </div>
    </>
  );
};

export default AllOrdersLayout;