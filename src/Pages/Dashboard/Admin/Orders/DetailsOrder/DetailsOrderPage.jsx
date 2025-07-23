import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet"; // تأكد أن المسار صحيح
import {
  DropDown,
  LoaderLogin,
  SearchBar,
  SubmitButton,
  TextInput,
} from "../../../../../Components/Components"; // تأكد أن المسار صحيح
import { FaClock, FaUser } from "react-icons/fa";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { usePost } from "../../../../../Hooks/usePostJson"; // تأكد أن المسار صحيح
import { useChangeState } from "../../../../../Hooks/useChangeState"; // تأكد أن المسار صحيح
import { useAuth } from "../../../../../Context/Auth"; // تأكد أن المسار صحيح
import { useDispatch } from "react-redux";
import { removeCanceledOrder } from "../../../../../Store/CreateSlices"; // تأكد أن المسار صحيح
import { useSelector } from "react-redux";
import { FaFileInvoice, FaWhatsapp, FaCopy } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const DetailsOrderPage = () => {
  const StatusRef = useRef(null);
  const { orderId } = useParams();
  const location = useLocation();
  const pathOrder = location.pathname.split("/").pop(); // استخدام pathOrder مباشرة من هنا

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const selectedLanguage = useSelector(state => state.language?.selected ?? 'en');

  // استدعاء useGet
  const {
    refetch: refetchDetailsOrder,
    loading: loadingDetailsOrder,
    data: dataDetailsOrder,
  } = useGet({ url: `${apiUrl}/admin/order/order/${pathOrder}?locale=${selectedLanguage}` });

  // باقي الـ Hooks
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/order/delivery`,
  });
  const { t} = useTranslation();

  const { changeState, loadingChange } = useChangeState();
  const [detailsData, setDetailsData] = useState(null); // ابدأ بـ null بدلاً من [] لتوضيح حالة عدم وجود بيانات بعد
  const [orderStatus, setOrderStatus] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [deliveriesFilter, setDeliveriesFilter] = useState([]);
  // const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showReason, setShowReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isOpenOrderStatus, setIsOpenOrderStatus] = useState(false);

  const [orderStatusName, setOrderStatusName] = useState("");
  const [searchDelivery, setSearchDelivery] = useState("");

  const [preparationTime, setPreparationTime] = useState(null); // ابدأ بـ null لتوضيح أن الوقت لم يُحدد بعد

  const [orderNumber, setOrderNumber] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);

  const auth = useAuth();

  const [openReceipt, setOpenReceipt] = useState(null);
  const [openOrderNumber, setOpenOrderNumber] = useState(null);
  const [openDeliveries, setOpenDeliveries] = useState(null);

  const [permission, setPermission] = useState([]);
  const dispatch = useDispatch();
  const canceledOrders = useSelector((state) => state.canceledOrders);

  // === بداية التعديلات ===

  // 1. دمج useEffects جلب البيانات
  useEffect(() => {
    // إزالة الطلب من قائمة الطلبات الملغاة في Redux إذا كان موجودًا
    // يفضل مراجعة هذا المنطق: هل يجب إزالة الطلب بمجرد زيارته؟
    // أم بعد عملية إلغاء ناجحة تتم من خلال هذا المكون؟
    if (orderId && canceledOrders.orders.includes(orderId)) {
      dispatch(removeCanceledOrder(orderId));
    }

    // جلب بيانات الطلب بناءً على orderId أو pathOrder أو اللغة المختارة
    console.log("DetailsOrderPage: Triggering refetch for Order ID:", orderId, "Path:", pathOrder, "Language:", selectedLanguage);
    refetchDetailsOrder();

  }, [orderId, pathOrder, selectedLanguage, refetchDetailsOrder, dispatch, canceledOrders.orders]); // Dependencies: عندما يتغير أي من هذه، يتم جلب البيانات مرة أخرى

  // 2. تحديث state المكونات بناءً على dataDetailsOrder
  useEffect(() => {
    if (dataDetailsOrder) {
        // التحقق من وجود بيانات الطلب داخل dataDetailsOrder
        if (dataDetailsOrder?.order) {
            setDetailsData(dataDetailsOrder.order);
            setOrderStatusName(dataDetailsOrder.order.order_status);

            // تحويل حالات الطلب (order_status) لتناسب مكون DropDown
            const formattedOrderStatus = (dataDetailsOrder.order_status || []).map(
                (status) => ({ name: status })
            );
            setOrderStatus(formattedOrderStatus);

            setDeliveries(dataDetailsOrder.deliveries || []);
            setDeliveriesFilter(dataDetailsOrder.deliveries || []);
            setPreparationTime(dataDetailsOrder.preparing_time || { days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
            // لو dataDetailsOrder موجودة بس مفيهاش "order"، معناها مفيش طلب بالـ ID ده أو فاضي
            setDetailsData(null); // عشان نعرض رسالة "لا توجد بيانات"
            setPreparationTime(null); // صفر الوقت كمان
        }
    } else {
        // لو dataDetailsOrder نفسها null أو undefined
        setDetailsData(null);
        setPreparationTime(null);
    }
    console.log("DetailsOrderPage: dataDetailsOrder updated:", dataDetailsOrder);
  }, [dataDetailsOrder]);

  // 3. تحديث أذونات المستخدم
  useEffect(() => {
    const computedPermission =
      auth?.userState?.user_positions?.roles?.map((role) => role.role) || [];
    // لا يتم استخدام ACTIONS حالياً، لكن يمكنك الاحتفاظ بها إذا لزم الأمر
    // const ACTIONS = auth?.userState?.user_positions?.roles?.map((role) => role.action) || [];
    setPermission(computedPermission);

    // Logging للتتبع
    auth.userState.user_positions.roles.forEach((role, index) => {
      console.log(`Role #${index + 1}: ${role.role} | Actions: ${role.action}`);
    });
  }, [auth?.userState?.user_positions?.roles]);


  // 4. عداد الوقت لـ preparationTime (تم تعديل الـ dependency)
  useEffect(() => {
    // لا تبدأ العداد إذا لم يكن preparationTime مهيئًا بقيم صحيحة
    if (!preparationTime || (preparationTime.days === 0 && preparationTime.hours === 0 && preparationTime.minutes === 0 && preparationTime.seconds === 0)) {
        console.log("Countdown not started: preparationTime is null or zero.", preparationTime);
        return;
    }

    console.log("Countdown started with:", preparationTime);
    const countdownInterval = setInterval(() => {
      setPreparationTime((prevTime) => {
        if (!prevTime) { // التحقق من وجود prevTime لتجنب الأخطاء
          clearInterval(countdownInterval);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        let { days, hours, minutes, seconds } = prevTime;

        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }

        // إيقاف العداد عندما يصل الوقت إلى الصفر أو أقل
        if (newDays <= 0 && newHours <= 0 && newMinutes <= 0 && newSeconds <= 0) {
          clearInterval(countdownInterval);
          console.log("Countdown finished.");
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    // دالة التنظيف لضمان إيقاف الـ interval عند إلغاء تحميل المكون أو تغيير الـ dependency
    return () => {
        console.log("Clearing countdown interval.");
        clearInterval(countdownInterval);
    };
  }, [preparationTime]); // <=== dependency مهمة: العداد سيعاد تشغيله إذا تغيرت preparationTime

  // === نهاية التعديلات ===

  // دالة لتغيير حالة الطلب (نقلتها هنا لتكون متاحة بشكل صحيح)
  const handleChangeStaus = useCallback(async (
    orderId,
    orderNumber,
    orderStatus,
    reason
  ) => {
    try {
      const responseStatus = await changeState(
        `${apiUrl}/admin/order/status/${orderId}`,
        t("Changed Status Successfully."), // رسالة نجاح مترجمة
        {
          order_status: orderStatus,
          order_number: orderNumber,
          ...(orderStatus === "canceled" && { admin_cancel_reason: reason }),
        }
      );

      if (responseStatus) {
        refetchDetailsOrder(); // جلب البيانات المحدثة بعد تغيير الحالة بنجاح
        setShowReason(false); // إخفاء حقل السبب إذا كان ظاهرًا
        setShowCancelModal(false); // إغلاق مودال الإلغاء
        setShowRefundModal(false); // إغلاق مودال الاسترجاع
        setOpenOrderNumber(null); // إغلاق مودال رقم الطلب
      }
    } catch (error) {
      console.error("Error changing status:", error);
      if (error?.response?.data?.errors === "You can't change status") {
        setShowStatusModal(true); // إظهار مودال الخطأ للمستخدم
      }
      auth.toastError(t("Failed to change status.")); // رسالة خطأ عامة
    }
  }, [apiUrl, changeState, refetchDetailsOrder, auth, t]); // إضافة الـ dependencies لـ useCallback

  // باقي الدوال كما هي
  const timeString = dataDetailsOrder?.order?.date || "";
  const [olderHours, olderMinutes] = timeString.split(":").map(Number);
  const dateObj = new Date();
  if (!isNaN(olderHours) && !isNaN(olderMinutes)) {
    dateObj.setHours(olderHours, olderMinutes);
  }


  const dayString = dataDetailsOrder?.order?.order_date || "";
  const [olderyear, olderMonth, olderDay] = dayString.split("-").map(Number);
  const dayObj = new Date();
  if (!isNaN(olderyear) && !isNaN(olderMonth) && !isNaN(olderDay)) {
    dayObj.setFullYear(olderyear);
    dayObj.setMonth(olderMonth - 1);
    dayObj.setDate(olderDay);
  }

  const time = new Date();
  const day = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const initialTime = {
    currentDay: day,
    currentHour: hour,
    currentMinute: minute,
    currentSecond: second,
  };

  const handleChangeDeliveries = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchDelivery(value);

    const filterDeliveries = deliveries.filter(
      (delivery) =>
        (delivery.f_name + " " + delivery.l_name).toLowerCase().includes(value)
    );
    setDeliveriesFilter(filterDeliveries);
  };

  const handleAssignDelivery = (deliveryID, orderID, deliveryNumber) => {
    const formData = new FormData();
    formData.append("delivery_id", deliveryID);
    formData.append("order_id", orderID);
    formData.append("order_number", deliveryNumber);

    postData(formData, t("Delivery has Assigned"));
  };

  useEffect(() => {
    if (response && response.status === 200) {
      setOrderStatusName("out_for_delivery");
      setSearchDelivery("");
      setOpenDeliveries(false);
      // بعد تعيين الدليفري، يجب أن تحدث بيانات الطلب لتعكس التغيير
      refetchDetailsOrder();
    }
    console.log("postData response", response);
  }, [response, refetchDetailsOrder]); // أضف refetchDetailsOrder هنا

  const handleOpenReceipt = (id) => {
    setOpenReceipt(id);
  };

  const handleCloseReceipt = () => {
    setOpenReceipt(null);
  };

  const handleOpenOrderNumber = (orderId) => {
    setOpenOrderNumber(orderId);
  };
  const handleCloseOrderNumber = () => {
    setOpenOrderNumber(null);
  };

  const handleOpenDeliviers = (deliveryId) => {
    setOpenDeliveries(deliveryId);
  };

  const handleCloseDeliveries = () => {
    setOpenDeliveries(null);
  };

  const handleOpenOrderStatus = () => {
    const hasOrderPermission = auth.userState.user_positions.roles?.some(
      (perm) => perm.role === "Order"
    );
    const hasValidAction = auth.userState.user_positions.roles?.some(
      (action) => action.action === "all" || action.action === "back_status"
    );

    if (hasOrderPermission && hasValidAction) {
      setIsOpenOrderStatus(!isOpenOrderStatus);
    } else {
      auth.toastError(
        t("You don't have permission to change the order status")
      );
    }
  };

  const handleOpenOptionOrderStatus = () => setIsOpenOrderStatus(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      auth.toastSuccess(t("Phone number copied!")); // استخدام auth.toastSuccess()
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      auth.toastError(t("Failed to copy phone number."));
    });
  };

  const handleSelectOrderStatus = (selectedOption) => {
    const targetStatus = selectedOption.name;

    const statusPermissions = {
      canceled: { requiresReason: true },
      refund: { requiresConfirmation: true }, // أضفت requiresConfirmation للـ refund
      // أضف حالات أخرى هنا إذا كانت تتطلب سلوكًا خاصًا
    };

    setIsOpenOrderStatus(false); // إغلاق الـ dropdown بعد الاختيار

    if (targetStatus === "refund") {
        setShowRefundModal(true); // إظهار مودال التأكيد للاسترجاع
    } else if (statusPermissions[targetStatus]?.requiresReason) {
        setShowCancelModal(true);
        setOrderStatusName(targetStatus); // لتحديد نوع الإلغاء (canceled)
    } else if (targetStatus === "processing" && !detailsData?.order_number) {
        // لو الحالة "processing" ومفيش order_number، افتح مودال إدخال الرقم
        handleOpenOrderNumber(detailsData.id);
    } else {
        // للحالات العادية التي لا تتطلب سبب أو تأكيد إضافي
        handleChangeStaus(detailsData.id, detailsData?.order_number || "", targetStatus, "");
    }
  };


  const handleOrderNumber = () => {
    if (!orderNumber) {
      auth.toastError(t("Please set your order number"));
      return;
    }
    handleChangeStaus(detailsData.id, orderNumber, "processing", "");
  };

  let totalAddonPrice = 0;
  let totalItemPrice = 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (StatusRef.current && !StatusRef.current.contains(event.target)) {
        setIsOpenOrderStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // === بداية الـ JSX (محتوى الـ UI) ===
  return (
    <>
      {/* Debug Info: هذا الجزء للإصلاح المؤقت فقط، يمكنك إزالته بعد التأكد من حل المشكلة */}
      <div style={{ position: 'fixed', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
          <p><strong>Debugging Info:</strong></p>
          <p>loadingDetailsOrder: {loadingDetailsOrder ? 'True' : 'False'}</p>
          <p>detailsData (is null?): {detailsData === null ? 'True' : 'False'}</p>
          <p>detailsData.length: {detailsData ? Object.keys(detailsData).length : 0}</p> {/* لتحقق إذا كان object وليس array */}
          <p>dataDetailsOrder (exists): {!!dataDetailsOrder ? 'True' : 'False'}</p>
          {dataDetailsOrder?.order ? <p>dataDetailsOrder.order (exists): True</p> : <p>dataDetailsOrder.order (exists): False</p>}
          <p>orderStatusName: {orderStatusName}</p>
          <p>Preparation Time: {preparationTime ? `${preparationTime.hours || 0}:${preparationTime.minutes || 0}:${preparationTime.seconds || 0}` : 'N/A'}</p>
          <p>Loading any Post/Change: {loadingPost || loadingChange ? 'True' : 'False'}</p>
      </div>
      {/* نهاية Debug Info */}


      {/* Loader الرئيسي: يظهر أثناء جلب البيانات أو إرسال طلبات POST/Change */}
      {(loadingDetailsOrder || loadingPost || loadingChange) ? (
        <div className="mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
          <LoaderLogin />
        </div>
      ) : (
        <>
          {/* عرض رسالة "لا توجد بيانات" إذا لم يتم العثور على تفاصيل الطلب */}
          {detailsData === null ? ( // تحقق من أن detailsData أصبحت null بعد المعالجة
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
              <p className="text-xl text-gray-600 font-TextFontBold">
                {t("No order details found or order does not exist.")}
              </p>
            </div>
          ) : (
            // عرض تفاصيل الطلب إذا كانت البيانات متاحة
            <div className="flex items-start justify-between w-full gap-3 mb-24 sm:flex-col lg:flex-row">
              {/* Left Section */}
              <div className="sm:w-full lg:w-8/12">
                <div className="w-full p-2 bg-white shadow-md rounded-xl ">
                  {/* هنا لا تحتاج لـ LoaderLogin آخر، لأننا بالفعل تجاوزنا مرحلة التحميل الرئيسية */}
                  <div className="w-full">
                    {/* Header */}
                    <div className="w-full px-2 py-4 rounded-lg shadow md:px-4 lg:px-4">
                      <div className="flex flex-col items-start justify-between pb-2 border-b border-gray-300">
                        <div className="w-full">
                          <div className="flex flex-wrap items-center justify-between w-full">
                            <h1 className="text-2xl text-gray-800 font-TextFontMedium">
                              {t("Order")}{" "}
                              <span className="text-mainColor">
                                #{detailsData?.id || ""}
                              </span>
                            </h1>
                            <div className="flex items-center justify-center gap-2 sm:w-full lg:w-6/12">
                              <Link
                                to={`/dashboard/orders/details/${Number(pathOrder) - 1
                                  }`}
                                className="w-6/12 px-1 py-1 text-sm text-center text-white transition-all duration-300 ease-in-out border-2 rounded-lg md:text-md bg-mainColor border-mainColor hover:bg-white hover:text-mainColor"
                              >
                                {"<<"} {t("PrevOrder")}
                              </Link>
                              <Link
                                to={`/dashboard/orders/details/${Number(pathOrder) + 1
                                  }`}
                                className="w-6/12 px-1 py-1 text-sm text-center text-white transition-all duration-300 ease-in-out border-2 rounded-lg md:text-md bg-mainColor border-mainColor hover:bg-white hover:text-mainColor"
                              >
                                {t("NextOrder")} {">>"}
                              </Link>
                            </div>
                          </div>
                          {detailsData?.address && (
                            <p className="mt-1 text-sm text-gray-700">
                              <span className="font-TextFontSemiBold">
                                {t("Zone")}:
                              </span>{" "}
                              {detailsData?.address?.zone?.zone || ""}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-gray-700">
                            <span className="font-TextFontSemiBold">
                              {t("Branch")}:
                            </span>{" "}
                            {detailsData?.branch?.name || ""}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            <span className="font-TextFontSemiBold">
                              {t("OrderTime")}:
                            </span>{" "}
                            {detailsData?.date || ""}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            <span className="font-TextFontSemiBold">
                              {t("OrderDate")}:
                            </span>{" "}
                            {detailsData?.order_date || ""}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            <span className="font-TextFontSemiBold">
                              {t("Schedule")}:
                            </span>{" "}
                            {detailsData?.schedule?.name || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Order Information */}
                      <div className="flex items-start justify-center w-full gap-4 sm:flex-col xl:flex-row">
                        <div className="p-2 bg-white rounded-md shadow-md sm:w-full xl:w-6/12">
                          <p className="text-gray-800 text-md">
                            <span className="font-TextFontSemiBold text-mainColor">
                              {t("Status")}:
                            </span>{" "}
                            {detailsData?.order_status || ""}
                          </p>
                          <p className="text-gray-800 text-md">
                            <span className="font-TextFontSemiBold text-mainColor">
                              {t("PaymentMethod")}:
                            </span>{" "}
                            {detailsData?.payment_method?.name || ""}
                          </p>
                          {detailsData?.payment_method?.name ===
                            "Visa Master Card" && (
                              <>
                                <p className="text-gray-800 text-md">
                                  <span className="font-TextFontSemiBold text-mainColor">
                                    {t("PaymentStatus")}:
                                  </span>{" "}
                                  {detailsData?.status_payment || ""}
                                </p>
                                <p className="text-gray-800 text-md">
                                  <span className="font-TextFontSemiBold text-mainColor">
                                    {t("Transaction ID")}:
                                  </span>{" "}
                                  {detailsData?.transaction_id || ""}
                                </p>
                              </>
                            )}
                        </div>
                        <div className="p-2 bg-white rounded-md shadow-md sm:w-full xl:w-6/12">
                          <p className="text-gray-800 text-md">
                            <span className="font-TextFontSemiBold text-mainColor">
                              {t("OrderType")}:
                            </span>{" "}
                            <span
                              className={`px-2 py-1 rounded-full text-md ${detailsData?.order_type === "take_away"
                                ? "text-green-700 bg-green-100"
                                : "text-blue-700 bg-blue-100"
                                }`}
                            >
                              {detailsData?.order_type || ""}
                            </span>{" "}
                          </p>
                          <p className="text-gray-800 text-md">
                            <span className="font-TextFontSemiBold text-mainColor">
                              {t("OrderNote")}:
                            </span>{" "}
                            {detailsData?.notes || "No Notes"}
                          </p>
                          {detailsData?.payment_method?.id !== 2 && (
                            <p className="text-gray-800 text-md">
                              <span className="font-TextFontSemiBold text-mainColor">
                                {t("OrderRecipt")}:
                              </span>
                              {detailsData?.receipt ? (
                                <>
                                  <span
                                    className="ml-2 underline cursor-pointer text-mainColor font-TextFontMedium"
                                    onClick={() =>
                                      handleOpenReceipt(detailsData.id)
                                    }
                                  >
                                    {t("Receipt")}
                                  </span>

                                  {openReceipt === detailsData.id && (
                                    <Dialog
                                      open={true}
                                      onClose={handleCloseReceipt}
                                      className="relative z-10"
                                    >
                                      <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                          <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                                            <div className="flex items-center justify-center w-full p-5">
                                              <img
                                                src={
                                                  detailsData?.receipt
                                                    ? `data:image/jpeg;base64,${detailsData?.receipt}`
                                                    : ""
                                                }
                                                className="max-h-[80vh] object-center object-contain shadow-md rounded-2xl"
                                                alt="Receipt"
                                              />
                                            </div>
                                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-3">
                                              <button
                                                type="button"
                                                onClick={handleCloseReceipt}
                                                className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md bg-mainColor font-TextFontMedium sm:mt-0 sm:w-auto"
                                              >
                                                {t("Close")}
                                              </button>
                                            </div>
                                          </DialogPanel>
                                        </div>
                                      </div>
                                    </Dialog>
                                  )}
                                </>
                              ) : (
                                <span className="ml-2 text-gray-800 underline text-md font-TextFontMedium">
                                  {t("NoRecipt")}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Combined Orders Table */}
                    <div className="p-2 my-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Table Header */}
                      <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        {t("Order Items")}
                      </h2>

                      {/* Table wrapped in a horizontal scroll container */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gradient-to-r from-[#9E090F] to-[#D1191C] text-white">
                            <tr>
                              <th className="px-2 py-2 max-w-[30px] text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                #
                              </th>
                              <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                {t("Products")}
                              </th>
                              <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                {t("variation")}
                              </th>
                              <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                {t("Addons")}
                              </th>
                              <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                {t("Excludes")}
                              </th>
                              <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                {t("Extra")}
                              </th>
                              <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase">
                                {t("Notes")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(detailsData?.order_details || []).map(
                              (order, orderIndex) => (
                                <tr
                                  key={`order-${orderIndex}`}
                                  className="hover:bg-gray-50"
                                >
                                  {/* Order Number Column */}
                                  <td className="px-2 py-1 font-semibold whitespace-normal border-r border-gray-300">
                                    {orderIndex + 1}
                                  </td>

                                  {/* Products Column: Name, Price, Quantity */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.product.map((prod, prodIndex) => (
                                      <div
                                        key={`prod-${prodIndex}`}
                                        className="mb-3"
                                      >
                                        <div className="font-semibold text-gray-800">
                                          {prod.product.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {t("Price")}: {prod.product.price}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {t("Qty")}: {prod.count}
                                        </div>
                                      </div>
                                    ))}
                                  </td>

                                  {/* Variations Column: Name and Type */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.variations &&
                                      order.variations.length > 0 ? (
                                      order.variations.map(
                                        (variation, varIndex) => (
                                          <div
                                            key={`variation-${varIndex}`}
                                            className="mb-3"
                                          >
                                            <div className="font-semibold text-gray-800">
                                              {variation.variation?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {t("Type")}:{" "}
                                              {variation.options &&
                                                variation.options.length > 0 ? (
                                                variation.options.map(
                                                  (option, optIndex) => (
                                                    <span
                                                      key={`option-${optIndex}`}
                                                      className="mr-1"
                                                    >
                                                      {option.name}
                                                      {optIndex <
                                                        variation.options
                                                          .length -
                                                        1
                                                        ? ", "
                                                        : ""}
                                                    </span>
                                                  )
                                                )
                                              ) : (
                                                <span>-</span>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>

                                  {/* Addons Column: Name, Price, Count */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.addons &&
                                      order.addons.length > 0 ? (
                                      order.addons.map(
                                        (addon, addonIndex) => (
                                          <div
                                            key={`addon-${addonIndex}`}
                                            className="mb-3"
                                          >
                                            <div className="font-semibold text-gray-800">
                                              {addon.addon?.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {t("Price")}: {addon.price}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {t("Qty")}: {addon.count}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>

                                  {/* Excludes Column */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.excludes &&
                                      order.excludes.length > 0 ? (
                                      order.excludes.map(
                                        (exclude, excludeIndex) => (
                                          <div
                                            key={`exclude-${excludeIndex}`}
                                            className="mb-3"
                                          >
                                            <div className="font-semibold text-gray-800">
                                              {exclude.name}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>

                                  {/* Extra Column */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.extra && order.extra.length > 0 ? (
                                      order.extra.map((extra, extraIndex) => (
                                        <div
                                          key={`extra-${extraIndex}`}
                                          className="mb-3"
                                        >
                                          <div className="font-semibold text-gray-800">
                                            {extra.name}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {t("Price")}: {extra.price}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>

                                  {/* Notes Column */}
                                  <td className="px-3 py-1 whitespace-normal">
                                    <span className="text-gray-500">
                                      {order.notes || "-"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                            {/* Calculation Row */}
                            <tr>
                              <td colSpan="6" className="text-right px-3 py-2 font-bold text-gray-800">
                                {t("Subtotal")}:
                              </td>
                              <td className="px-3 py-2 text-gray-800">
                                {detailsData?.sub_total_price || "0.00"} {t("JOD")}
                              </td>
                            </tr>
                            {detailsData?.delivery_fees > 0 && (
                                <tr>
                                <td colSpan="6" className="text-right px-3 py-2 font-bold text-gray-800">
                                    {t("Delivery Fees")}:
                                </td>
                                <td className="px-3 py-2 text-gray-800">
                                    {detailsData?.delivery_fees || "0.00"} {t("JOD")}
                                </td>
                                </tr>
                            )}
                            {detailsData?.discount_value > 0 && (
                                <tr>
                                <td colSpan="6" className="text-right px-3 py-2 font-bold text-gray-800">
                                    {t("Discount")}:
                                </td>
                                <td className="px-3 py-2 text-gray-800">
                                    -{detailsData?.discount_value || "0.00"} {t("JOD")}
                                </td>
                                </tr>
                            )}
                            <tr className="bg-gray-100">
                              <td colSpan="6" className="text-right px-3 py-2 font-bold text-gray-900 text-lg">
                                {t("Total")}:
                              </td>
                              <td className="px-3 py-2 text-gray-900 text-lg font-bold">
                                {detailsData?.total_price || "0.00"} {t("JOD")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="sm:w-full lg:w-4/12">
                <div className="p-2 bg-white shadow-md rounded-xl">
                  {/* Customer Information */}
                  <div className="p-2 my-2 bg-white rounded-md shadow-md">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      {t("Customer Information")}
                    </h2>
                    <p className="text-gray-800 text-md">
                      <span className="font-TextFontSemiBold text-mainColor">
                        <FaUser className="inline-block mb-1" /> {t("Name")}:
                      </span>{" "}
                      {detailsData?.user?.f_name || ""}{" "}
                      {detailsData?.user?.l_name || ""}
                    </p>
                    <p className="text-gray-800 text-md">
                      <span className="font-TextFontSemiBold text-mainColor">
                        {t("Phone")}:
                      </span>{" "}
                      {detailsData?.user?.phone || ""}
                      <span
                        className="ml-2 cursor-pointer"
                        onClick={() => copyToClipboard(detailsData?.user?.phone || "")}
                      >
                        <FaCopy className="inline-block text-gray-600 hover:text-mainColor" />
                      </span>
                      <a
                        href={`https://wa.me/${detailsData?.user?.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        <FaWhatsapp className="inline-block" />
                      </a>
                    </p>
                    <p className="text-gray-800 text-md">
                      <span className="font-TextFontSemiBold text-mainColor">
                        {t("Email")}:
                      </span>{" "}
                      {detailsData?.user?.email || ""}
                    </p>
                  </div>

                  {/* Delivery Information (conditional) */}
                  {detailsData?.delivery && (
                    <div className="p-2 my-2 bg-white rounded-md shadow-md">
                      <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        {t("Delivery Information")}
                      </h2>
                      <p className="text-gray-800 text-md">
                        <span className="font-TextFontSemiBold text-mainColor">
                          <FaUser className="inline-block mb-1" /> {t("Name")}:
                        </span>{" "}
                        {detailsData?.delivery?.f_name || ""}{" "}
                        {detailsData?.delivery?.l_name || ""}
                      </p>
                      <p className="text-gray-800 text-md">
                        <span className="font-TextFontSemiBold text-mainColor">
                          {t("Phone")}:
                        </span>{" "}
                        {detailsData?.delivery?.phone || ""}
                      </p>
                      <p className="text-gray-800 text-md">
                        <span className="font-TextFontSemiBold text-mainColor">
                          {t("Email")}:
                        </span>{" "}
                        {detailsData?.delivery?.email || ""}
                      </p>
                    </div>
                  )}

                  {/* Address Information (conditional) */}
                  {detailsData?.address && (
                    <div className="p-2 my-2 bg-white rounded-md shadow-md">
                      <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        {t("Address Information")}
                      </h2>
                      <p className="text-gray-800 text-md">
                        <span className="font-TextFontSemiBold text-mainColor">
                          {t("Address")}:
                        </span>{" "}
                        {detailsData?.address?.address || ""}
                      </p>
                      <p className="text-gray-800 text-md">
                        <span className="font-TextFontSemiBold text-mainColor">
                          {t("Building")}:
                        </span>{" "}
                        {detailsData?.address?.building || ""}
                      </p>
                      <p className="text-gray-800 text-md">
                        <span className="font-TextFontSemiBold text-mainColor">
                          {t("Flat")}:
                        </span>{" "}
                        {detailsData?.address?.flat || ""}
                      </p>
                    </div>
                  )}

                  {/* Preparation Time */}
                  <div className="p-2 my-2 bg-white rounded-md shadow-md">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      {t("Preparation Time")}
                    </h2>
                    <p className="text-gray-800 text-md">
                      <span className="font-TextFontSemiBold text-mainColor">
                        <FaClock className="inline-block mb-1" /> {t("Remaining Time")}:
                      </span>{" "}
                      {preparationTime ? (
                        `${preparationTime.days || 0}d ${preparationTime.hours || 0}h ${preparationTime.minutes || 0}m ${preparationTime.seconds || 0}s`
                      ) : (
                        t("Not Available")
                      )}
                    </p>
                  </div>

                  {/* Order Actions */}
                  <div className="p-2 my-2 bg-white rounded-md shadow-md">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      {t("Order Actions")}
                    </h2>
                    {/* Order Status Dropdown */}
                    <div className="relative" ref={StatusRef}>
                      <DropDown
                        label={t("Change Order Status")}
                        options={orderStatus}
                        onSelect={handleSelectOrderStatus}
                        isOpen={isOpenOrderStatus}
                        onToggle={handleOpenOrderStatus}
                        onOpen={handleOpenOptionOrderStatus}
                        selectedOption={{ name: orderStatusName }}
                      />
                    </div>
                    {/* Assign Delivery Button */}
                    <SubmitButton
                      name={t("Assign Delivery")}
                      onClick={() => handleOpenDeliviers(detailsData.id)}
                      className="mt-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {/* Refund Confirmation Modal */}
      <Dialog
        open={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-4 data-[leave]:opacity-0 sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaFileInvoice className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {t("Confirm Refund")}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t("Are you sure you want to refund this order? This action cannot be undone.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                  onClick={() => {
                    handleChangeStaus(detailsData.id, "", "refund", "");
                    setShowRefundModal(false);
                  }}
                >
                  {t("Confirm")}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setShowRefundModal(false)}
                >
                  {t("Cancel")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Cancel Order Modal */}
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-4 data-[leave]:opacity-0 sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaFileInvoice className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {t("Reason for Cancelation")}
                    </h3>
                    <div className="mt-2">
                      <TextInput
                        placeholder={t("Enter reason")}
                        type="text"
                        name="cancel_reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                  onClick={() => {
                    if (cancelReason.trim()) {
                      handleChangeStaus(detailsData.id, "", orderStatusName, cancelReason);
                      setShowCancelModal(false);
                      setCancelReason("");
                    } else {
                      auth.toastError(t("Reason cannot be empty."));
                    }
                  }}
                >
                  {t("Confirm")}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                  }}
                >
                  {t("Cancel")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Assign Delivery Modal */}
      <Dialog
        open={openDeliveries === detailsData.id}
        onClose={handleCloseDeliveries}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-4 data-[leave]:opacity-0 sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaUser className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {t("Assign Delivery")}
                    </h3>
                    <div className="mt-2">
                      <SearchBar
                        label={t("Search Delivery")}
                        value={searchDelivery}
                        onChange={handleChangeDeliveries}
                      />
                      <div className="max-h-60 overflow-y-auto mt-2 border rounded-md p-2">
                        {deliveriesFilter.length > 0 ? (
                          deliveriesFilter.map((delivery) => (
                            <div
                              key={delivery.id}
                              className="flex items-center justify-between p-2 my-1 border rounded-md"
                            >
                              <span>{delivery.f_name} {delivery.l_name}</span>
                              <button
                                className="bg-mainColor text-white px-3 py-1 rounded-md text-sm hover:opacity-90"
                                onClick={() => handleAssignDelivery(delivery.id, detailsData.id, detailsData.order_number)}
                              >
                                {t("Assign")}
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">{t("No deliveries found.")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={handleCloseDeliveries}
                >
                  {t("Close")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Order Number Modal (for 'processing' status if no order_number) */}
      <Dialog
        open={openOrderNumber === detailsData.id}
        onClose={handleCloseOrderNumber}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-4 data-[leave]:opacity-0 sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaFileInvoice className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {t("Enter Order Number")}
                    </h3>
                    <div className="mt-2">
                      <TextInput
                        placeholder={t("Order Number")}
                        type="text"
                        name="order_number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                  onClick={handleOrderNumber}
                >
                  {t("Confirm")}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={handleCloseOrderNumber}
                >
                  {t("Cancel")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Show Status Modal (Error) */}
      <Dialog
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-4 data-[leave]:opacity-0 sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaFileInvoice className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {t("Status Change Error")}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t("You cannot change the status to this option.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                  onClick={() => setShowStatusModal(false)}
                >
                  {t("Ok")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DetailsOrderPage;