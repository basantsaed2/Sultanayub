import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet";
import {
  DropDown,
  LoaderLogin,
  SearchBar,
  SubmitButton,
  TextInput,
} from "../../../../../Components/Components";
import { FaClock, FaUser } from "react-icons/fa";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useAuth } from "../../../../../Context/Auth";
import { useDispatch } from "react-redux";
import { removeCanceledOrder } from "../../../../../Store/CreateSlices";
import { useSelector } from "react-redux"; // Add this import
import { FaFileInvoice, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const DetailsOrderPage = () => {
  const StatusRef = useRef(null);
  const { orderId } = useParams();
  const location = useLocation();
  const pathOrder = location.pathname;
  const orderNumPath = pathOrder.split("/").pop();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchDetailsOrder,
    loading: loadingDetailsOrder,
    data: dataDetailsOrder,
  } = useGet({ url: `${apiUrl}/admin/order/order/${orderNumPath}` });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/order/delivery`,
  });
  const { t, i18n } = useTranslation();

  const { changeState, loadingChange, responseChange } = useChangeState();
  const [detailsData, setDetailsData] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [deliveriesFilter, setDeliveriesFilter] = useState([]);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showReason, setShowReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isOpenOrderStatus, setIsOpenOrderStatus] = useState(false);

  const [orderStatusName, setOrderStatusName] = useState("");
  const [searchDelivery, setSearchDelivery] = useState("");

  const [preparationTime, setPreparationTime] = useState({});

  const [orderNumber, setOrderNumber] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);

  const auth = useAuth();

  const [openReceipt, setOpenReceipt] = useState(null);
  const [openOrderNumber, setOpenOrderNumber] = useState(null);
  const [openDeliveries, setOpenDeliveries] = useState(null);
  // State to hold computed values
  const [permission, setPermission] = useState([]);
  const dispatch = useDispatch();
  const canceledOrders = useSelector((state) => state.canceledOrders); // Add this line

  useEffect(() => {
    // Only remove if the order exists in canceled orders
    console.log("canceledOrders", orderId);
    const orderExists = canceledOrders.orders.includes(orderId);
    console.log("orderExists", orderExists);
    if (orderExists) {
      dispatch(removeCanceledOrder(orderId));
    }
    refetchDetailsOrder();
  }, [orderId, location.pathname, dispatch, canceledOrders.orders]);

  useEffect(() => {
    const computedPermission =
      auth?.userState?.user_positions?.roles?.map((role) => role.role) || [];
    const ACTIONS =
      auth?.userState?.user_positions?.roles?.map((role) => role.action) || [];
    setPermission(computedPermission);

    // Log the computed values
    auth.userState.user_positions.roles.forEach((role, index) => {
      console.log(`Role #${index + 1}: ${role.role} | Actions: ${role.action}`);
    });
  }, [auth?.userState?.user_positions?.roles]);
  useEffect(() => {
    refetchDetailsOrder();
  }, [orderNumPath]);

  useEffect(() => {
    refetchDetailsOrder(); // Refetch data when the component mounts or orderId or path changes
  }, [refetchDetailsOrder, orderId, location.pathname]);

  useEffect(() => {
    if (dataDetailsOrder && dataDetailsOrder?.order) {
      setDetailsData(dataDetailsOrder?.order);
      setOrderStatusName(dataDetailsOrder?.order?.order_status);
      const formattedOrderStatus = dataDetailsOrder?.order_status.map(
        (status) => ({ name: status })
      );

      setOrderStatus(formattedOrderStatus); // Update state with the transformed data
      setDeliveries(dataDetailsOrder?.deliveries);
      setDeliveriesFilter(dataDetailsOrder?.deliveries);
      setPreparationTime(dataDetailsOrder?.preparing_time);
    }

    console.log("dataDetailsOrder", dataDetailsOrder); // Refetch data when the component mounts
    console.log("detailsData", detailsData); // Refetch data when the component mounts
    console.log("OrderStatus", orderStatus); // Refetch data when the component mounts
  }, [dataDetailsOrder]);
  useEffect(() => {
    console.log("orderId", orderId); // Refetch data when the component mounts
  }, [orderId]);

  const timeString = dataDetailsOrder?.order?.date || "";
  const [olderHours, olderMinutes] = timeString.split(":").map(Number); // Extract hours and minutes as numbers
  const dateObj = new Date();
  dateObj.setHours(olderHours, olderMinutes);

  const dayString = dataDetailsOrder?.order?.order_date || "";
  const [olderyear, olderMonth, olderDay] = dayString.split("-").map(Number); // Extract year, month, and day as numbers
  const dayObj = new Date();
  dayObj.setFullYear(olderyear);
  dayObj.setMonth(olderMonth - 1); // Months are zero-based in JavaScript Date
  dayObj.setDate(olderDay);

  // Create a new Date object for the current date and time
  const time = new Date();

  // Extract time components using Date methods
  const day = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  // If you need to modify the time object (not necessary here):
  time.setDate(day);
  time.setHours(hour);
  time.setMinutes(minute);
  time.setSeconds(second);

  // Create an object with the extracted time values
  const initialTime = {
    currentDay: day,
    currentHour: hour,
    currentMinute: minute,
    currentSecond: second,
  };

  const handleChangeDeliveries = (e) => {
    const value = e.target.value.toLowerCase(); // Normalize input value
    setSearchDelivery(value);

    const filterDeliveries = deliveries.filter(
      (delivery) =>
        (delivery.f_name + " " + delivery.l_name).toLowerCase().includes(value) // Concatenate and match
    );

    setDeliveriesFilter(filterDeliveries);

    console.log("filterDeliveries", filterDeliveries);
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
      setDeliveriesFilter(deliveries);
    }
    console.log("response", response);
  }, [response]);

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
    console.log("hasOrderPermission", hasOrderPermission);
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

  // const handleSelectOrderStatus = (selectedOption) => {
  //   console.log("selectedOption", selectedOption);

  //   // Check if user has Order role
  //   const hasOrderRole = auth.userState.user_positions.roles?.some(
  //     (role) => role.role === "Order"
  //   );

  //   // Define the normal order flow progression
  //   const statusFlow = ['pending', 'processing', 'out_for_delivery', 'delivered','cancel','refund','returned','faild_to_deliver'];

  //   const currentStatus = detailsData?.order_status;
  //   const targetStatus = selectedOption.name;

  //   // Check if this is a backward transition
  //   const currentIndex = statusFlow.indexOf(currentStatus);
  //   const targetIndex = statusFlow.indexOf(targetStatus);
  //   const isBackwardTransition = currentIndex >= 0 && targetIndex >= 0 && targetIndex < currentIndex;

  //   // Define status transition rules and required permissions
  //   const statusPermissions = {
  //     // Basic status changes (require 'status' action)
  //     pending: {
  //       forwardActions: ['all', 'status'],
  //       backwardActions: ['all', 'back_status']
  //     },
  //     processing: {
  //       forwardActions: ['all', 'status'],
  //       backwardActions: ['all', 'back_status']
  //     },
  //     out_for_delivery: {
  //       forwardActions: ['all', 'status'],
  //       backwardActions: ['all', 'back_status']
  //     },
  //     delivered: {
  //       actions: ['all', 'back_status'], // Can't go forward from delivered
  //       allowedFrom: ['out_for_delivery']
  //     },
  //     canceled: {
  //       actions: ['all', 'back_status'],
  //       allowedFrom: ['pending', 'processing', 'out_for_delivery'],
  //       requiresReason: true
  //     },
  //     // Admin-only status changes
  //     refund: { actions: ['all'] },
  //     returned: { actions: ['all'] },
  //     faild_to_deliver: { actions: ['all'] }
  //   };

  //   // Check if the transition is allowed
  //   let hasPermission = false;
  //   if (hasOrderRole && statusPermissions[targetStatus]) {
  //     // Determine required actions based on transition direction
  //     let requiredActions;
  //     if (isBackwardTransition) {
  //       requiredActions = statusPermissions[targetStatus]?.backwardActions || ['all', 'back_status'];
  //     } else {
  //       // For forward transitions, use forwardActions if defined, otherwise default to status
  //       requiredActions = statusPermissions[targetStatus]?.forwardActions || ['all', 'status'];
  //     }

  //     // Check if user has required action permissions
  //     const hasActionPermission = auth.userState.user_positions.roles?.some(
  //       (role) => role.role === "Order" &&
  //         requiredActions.some(action =>
  //           role.action === 'all' || role.action.includes(action)
  //         )
  //     );

  //     // Check if transition from current status is allowed
  //     const isTransitionAllowed = !statusPermissions[targetStatus].allowedFrom ||
  //       statusPermissions[targetStatus].allowedFrom.includes(currentStatus);

  //     hasPermission = hasActionPermission && isTransitionAllowed;
  //   }

  //   if (hasPermission) {
  //     if (statusPermissions[targetStatus]?.requiresReason) {
  //       setShowCancelModal(true);
  //       setOrderStatusName(targetStatus);
  //     }
  //     else if (targetStatus === 'refund') {
  //       setShowRefundModal(true);
  //     } else {
  //       // setShowReason(false);
  //       handleChangeStaus(detailsData.id, '', targetStatus, '');
  //     }
  //   } else {
  //     let errorMessage = "You don't have permission to change the order status";
  //     auth.toastError(errorMessage);
  //   }
  // };

  const handleSelectOrderStatus = (selectedOption) => {
    console.log("selectedOption", selectedOption);

    const targetStatus = selectedOption.name;

    // Define status transition rules
    const statusPermissions = {
      canceled: { requiresReason: true },
      refund: {},
    };

    if (statusPermissions[targetStatus]?.requiresReason) {
      setShowCancelModal(true);
      setOrderStatusName(targetStatus);
    } else if (targetStatus === "refund") {
      setShowRefundModal(true);
    } else {
      handleChangeStaus(detailsData.id, "", targetStatus, "");
    }
  };

  const handleOrderNumber = (id) => {
    if (!orderNumber) {
      auth.toastError(t("please set your order Number"));
      return;
    }

    handleChangeStaus(id, orderNumber, "processing", "");
    setOpenOrderNumber(null);
  };

  // Move handleChangeStaus outside the function
  const handleChangeStaus = async (
    orderId,
    orderNumber,
    orderStatus,
    reason
  ) => {
    try {
      const responseStatus = await changeState(
        `${apiUrl}/admin/order/status/${orderId}`,
        `Changed Status Successes.`,
        {
          order_status: orderStatus,
          order_number: orderNumber,
          ...(orderStatus === "canceled" && { admin_cancel_reason: reason }), // Send reason if canceled
        }
      );

      if (responseStatus) {
        refetchDetailsOrder(); // Refetch the order details after successful status change
        setShowReason(false);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      if (error?.response?.data?.errors === "You can't change status") {
        setShowStatusModal(true);
      }
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setPreparationTime((prevTime) => {
        if (!prevTime) return prevTime;

        const { days, hours, minutes, seconds } = prevTime;

        // Calculate the next time
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

        // Stop the countdown if time reaches zero
        if (
          newDays <= 0 &&
          newHours <= 0 &&
          newMinutes <= 0 &&
          newSeconds <= 0
        ) {
          clearInterval(countdown);
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

    // Clear interval on unmount
    return () => clearInterval(countdown);
  }, []); // Dependency array is empty to ensure the effect runs only once

  let totalAddonPrice = 0;
  let totalItemPrice = 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (StatusRef.current && !StatusRef.current.contains(event.target)) {
        setIsOpenOrderStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {loadingDetailsOrder || loadingPost || loadingChange ? (
        <div className="mx-auto">
          <LoaderLogin />
        </div>
      ) : (
        <>
          {detailsData.length === 0 ? (
            <div className="mx-auto">
              <LoaderLogin />
            </div>
          ) : (
            <div className="flex items-start justify-between w-full gap-3 mb-24 sm:flex-col lg:flex-row">
              {/* Left Section */}
              <div className="sm:w-full lg:w-8/12">
                <div className="w-full p-2 bg-white shadow-md rounded-xl ">
                  {detailsData.length === 0 ? (
                    <div>
                      <LoaderLogin />
                    </div>
                  ) : (
                    <div className="w-full">
                      {/* Header */}
                      <div className="w-full px-2 py-4 rounded-lg shadow md:px-4 lg:px-4">
                        {/* Header */}
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
                                  to={`/dashboard/orders/details/${Number(orderNumPath) - 1
                                    }`}
                                  className="w-6/12 px-1 py-1 text-sm text-center text-white transition-all duration-300 ease-in-out border-2 rounded-lg md:text-md bg-mainColor border-mainColor hover:bg-white hover:text-mainColor"
                                >
                                  {"<<"} {t("PrevOrder")}
                                </Link>
                                <Link
                                  to={`/dashboard/orders/details/${Number(orderNumPath) + 1
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
                                    ? "text-green-700 bg-green-100" // Green text with light green bg
                                    : "text-blue-700 bg-blue-100" // Adjust for delivery (blue as example)
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
                                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                  {t("Order")} #
                                </th>
                                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left uppercase border-gray-300">
                                  {t("Products")}
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
                                                {addon.addon.name}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {t("Price")}:{" "}
                                                {addon.addon.price}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {t("Count")}: {addon.count || 0}
                                              </div>
                                            </div>
                                          )
                                        )
                                      ) : (
                                        <span className="text-gray-500">-</span>
                                      )}
                                    </td>

                                    {/* Excludes Column: Name */}
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

                                    {/* Notes Column: Styled Card for Product Notes */}
                                    <td className="px-2 py-1 whitespace-normal">
                                      {order.product.map((prod, prodIndex) => (
                                        <div
                                          key={`note-${prodIndex}`}
                                          className="mb-3"
                                        >
                                          {prod.notes ? (
                                            <div className="relative p-2 text-sm text-gray-700 border-l-4 border-red-400 rounded-md shadow-sm bg-red-50">
                                              <div className="flex items-start">
                                                <p className="line-clamp-3">
                                                  {prod.notes}
                                                </p>
                                              </div>
                                            </div>
                                          ) : (
                                            <span className="text-gray-500">
                                              {t("No notes")}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="flex flex-col p-2 my-2 gap-y-1">
                        <p className="flex items-center justify-between w-full">
                          {(detailsData?.order_details || []).forEach(
                            (orderDetail) => {
                              // Sum extras prices
                              orderDetail.extras.forEach((extraItem) => {
                                totalItemPrice += extraItem.price;
                              });

                              // Sum product prices (price * count)
                              orderDetail.product.forEach((productItem) => {
                                totalItemPrice +=
                                  productItem.product.price * productItem.count;
                              });

                              // Sum variations' options prices
                              // orderDetail.variations.forEach((variation) => {
                              //   variation.options.forEach((optionItem) => {
                              //     totalItemPrice += optionItem.price;
                              //   });
                              // });
                            }
                          )}
                          {/* Display total items price */}
                          {t("ItemsPrice")}:<span>{totalItemPrice}</span>
                        </p>

                        <p className="flex items-center justify-between w-full">
                          {t("Tax/VAT")}:
                          <span>{detailsData?.total_tax || 0}</span>
                        </p>
                        <p className="flex items-center justify-between w-full">
                          {(detailsData?.order_details || []).forEach(
                            (orderDetail) => {
                              orderDetail.addons.forEach((addonItem) => {
                                // Add the price of each addon to the total
                                totalAddonPrice +=
                                  addonItem.addon.price * addonItem.count;
                              });
                            }
                          )}

                          <span>{t("AddonsPrice")}:</span>
                          <span>{totalAddonPrice}</span>
                        </p>
                        <p className="flex items-center justify-between w-full">
                          {t("Subtotal")}:
                          <span>{totalItemPrice + totalAddonPrice}</span>
                        </p>
                        <p className="flex items-center justify-between w-full">
                          {t("ExtraDiscount")}:{" "}
                          <span>{detailsData?.total_discount || 0}</span>
                        </p>
                        <p className="flex items-center justify-between w-full">
                          {t("CouponDiscount")}:
                          <span> {detailsData?.coupon_discount || 0}</span>
                        </p>
                        <p className="flex items-center justify-between w-full">
                          {t("DeliveryFee")}:
                          <span> {detailsData?.address?.zone?.price || 0}</span>
                        </p>
                        <p className="flex items-center justify-between w-full text-lg font-TextFontSemiBold">
                          {t("Total")}:<span>{detailsData?.amount}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className="sm:w-full lg:w-4/12">
                <div className="w-full p-4 bg-white shadow-md rounded-xl">
                  <div className="flex items-center text-lg gap-x-2 font-TextFontSemiBold">
                    <span>
                      <FaUser className="text-mainColor" />
                    </span>
                    {t("Customer Information")}
                  </div>
                  <p className="text-sm">
                    {t("Name")}: {detailsData?.user?.f_name || "-"}{" "}
                    {detailsData?.user?.l_name || "-"}
                  </p>
                  <p className="text-sm">
                    {t("Orders")}: {detailsData?.user?.count_orders || "-"}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    {t("Contact")}:
                    {detailsData?.user?.phone && (
                      <a
                        href={`https://wa.me/${detailsData.user.phone.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-black transition duration-200 hover:text-green-600"
                      >
                        <FaWhatsapp className="w-5 h-5 text-green-600" />
                        {detailsData.user.phone}
                      </a>
                    )}
                  </p>
                  <p className="text-sm">
                    {t("Email")}: {detailsData?.user?.email || "-"}
                  </p>

                  {detailsData.order_type === "delivery" && (
                    <>
                      <p className="text-sm">
                        {t("BuildNum")}:{" "}
                        {detailsData?.address?.building_num || "-"}
                      </p>
                      <p className="text-sm">
                        {t("Floor")}: {detailsData?.address?.floor_num || "-"}
                      </p>
                      <p className="text-sm">
                        {t("House")}: {detailsData?.address?.apartment || "-"}
                      </p>
                      <p className="text-sm">
                        {t("Road")}: {detailsData?.address?.street || "-"}
                      </p>
                      <p className="pb-2 text-sm text-center">
                        {detailsData?.address?.address || "-"}
                      </p>
                      {detailsData?.address?.additional_data ||
                        ("" && (
                          <p className="pt-2 text-sm text-center border-t-2">
                            {detailsData?.address?.additional_data || "-"}
                          </p>
                        ))}
                      {detailsData?.address?.map && (
                        <p className="text-sm line-clamp-3">
                          {t("LocationMap")}:
                          <a
                            href={detailsData?.address?.map}
                            className="ml-1 underline text-mainColor font-TextFontMedium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {detailsData?.address?.map?.length > 30
                              ? `${detailsData?.address?.map?.slice(0, 30)}...`
                              : detailsData?.address?.map}
                          </a>
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="w-full p-4 mt-4 bg-white shadow-md rounded-xl">
                  <div className="flex flex-col gap-y-2">
                    <span className="text-lg font-TextFontSemiBold">
                      {t("Change Order Status")}
                    </span>

                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Define status order for comparison */}
                        {(() => {
                          const statusOrder = [
                            "pending",
                            "processing",
                            "confirmed",
                            "out_for_delivery",
                            "delivered",
                            // 'canceled',
                            // 'refund',
                            // 'returned',
                            // 'faild_to_deliver'
                          ];
                          // ccccccccc
                          const currentStatus = detailsData?.order_status;
                          const currentIndex =
                            statusOrder.indexOf(currentStatus);

                          // Define all possible statuses
                          const allStatuses = [
                            {
                              name: "pending",
                              label: "Pending",
                              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                            },
                            {
                              name: "processing",
                              label: "Accept",
                              icon: "M5 13l4 4L19 7",
                            },
                            {
                              name: "confirmed",
                              label: "Processing",
                              icon: "M5 13l4 4L19 7",
                            },
                            {
                              name: "out_for_delivery",
                              label: "Out for Delivery",
                              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                            },
                            {
                              name: "delivered",
                              label: "Delivered",
                              icon: "M5 13l4 4L19 7",
                            },
                            {
                              name: "faild_to_deliver",
                              label: "Failed to Deliver",
                              icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                            },
                            {
                              name: "returned",
                              label: "Returned",
                              icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                            },
                            {
                              name: "canceled",
                              label: "Canceled",
                              icon: "M6 18L18 6M6 6l12 12",
                            },
                            {
                              name: "refund",
                              label: "Refund",
                              icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
                            },
                          ];

                          // Filter statuses based on current status
                          const filteredStatuses = allStatuses.filter(
                            (status) => {
                              if (currentStatus === "delivered") {
                                // Exclude 'canceled' and 'returned' when status is 'delivered'
                                return !["canceled"].includes(status.name);
                              } else if (currentStatus === "canceled") {
                                // Exclude 'delivered', 'faild_to_deliver', and 'returned' when status is 'canceled'
                                return ![
                                  "delivered",
                                  "faild_to_deliver",
                                  "returned",
                                ].includes(status.name);
                              } else if (currentStatus === "refund") {
                                // Exclude 'delivered', 'faild_to_deliver', and 'returned' when status is 'canceled'
                                return !["canceled"].includes(status.name);
                              }
                              return true; // Include all statuses for other cases
                            }
                          );

                          return filteredStatuses.map((status) => {
                            const statusIndex = statusOrder.indexOf(
                              status.name
                            );
                            const isCurrent = currentStatus === status.name;
                            const isPrevious =
                              statusIndex !== -1 && currentIndex > statusIndex;
                            const isNext =
                              statusIndex !== -1 && currentIndex < statusIndex;

                            const isCancel = status.name === "canceled";
                            const isReturn = status.name === "returned";
                            const isFailed = status.name === "faild_to_deliver";

                            // Determine if button should be disabled
                            let isDisabled = false;

                            // For normal flow statuses
                            if (statusOrder.includes(status.name)) {
                              // Enable if exactly one step forward or backward (except pending)
                              isDisabled = !(
                                statusIndex === currentIndex + 1 ||
                                (statusIndex === currentIndex - 1 &&
                                  status.name !== "pending")
                              );
                            }
                            // For returned status
                            else if (isReturn) {
                              isDisabled = ![
                                "out_for_delivery",
                                "delivered",
                              ].includes(currentStatus);
                            }
                            // For failed delivery status
                            else if (isFailed) {
                              isDisabled = currentStatus !== "out_for_delivery";
                            }

                            return (
                              <button
                                key={status.name}
                                onClick={() =>
                                  !isDisabled &&
                                  handleSelectOrderStatus({ name: status.name })
                                }
                                disabled={isDisabled}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all relative
              ${isCurrent
                                    ? "bg-blue-100 border-blue-500 text-blue-900 shadow-md"
                                    : isPrevious
                                      ? "bg-green-50 border-green-300 text-green-800"
                                      : isDisabled
                                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                                  }
            `}
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={status.icon}
                                  />
                                </svg>
                                {status.label}

                                {/* Checkmark for completed statuses */}
                                {isPrevious && (
                                  <span className="absolute text-green-500 top-2 right-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}

                                {/* Current status indicator */}
                                {isCurrent && (
                                  <span className="absolute top-0 right-0 flex w-3 h-3 -mt-1 -mr-1">
                                    <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex w-3 h-3 bg-blue-500 rounded-full"></span>
                                  </span>
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Reason Input Modal */}
                    {showReason && (
                      <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {t("Enter Cancel Reason")}:
                        </label>
                        <input
                          type="text"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Enter reason for cancellation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              setShowReason(false);
                              setCancelReason("");
                            }}
                            className="px-4 py-2 text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            {t("Cancel")}
                          </button>
                          <button
                            onClick={() => {
                              if (!cancelReason.trim()) {
                                auth.toastError(
                                  t("Please enter a cancellation reason")
                                );
                                return;
                              }
                              handleChangeStaus(
                                detailsData.id,
                                "",
                                orderStatusName,
                                cancelReason
                              );
                              setCancelReason("");
                            }}
                            className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            {t("Confirm Cancellation")}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show existing cancellation reasons if they exist */}
                    {detailsData.order_status === "canceled" && (
                      <div className="p-4 mt-4 bg-gray-100 rounded-lg">
                        {detailsData.admin_cancel_reason && (
                          <div className="mb-3">
                            <p className="font-medium text-gray-800">
                              {t("Admin Cancellation Reason")}:
                            </p>
                            <p className="text-gray-600">
                              {detailsData.admin_cancel_reason}
                            </p>
                          </div>
                        )}
                        {detailsData.customer_cancel_reason && (
                          <div>
                            <p className="font-medium text-gray-800">
                              {t("Customer Cancellation Reason")}:
                            </p>
                            <p className="text-gray-600">
                              {detailsData.customer_cancel_reason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Cancel Reason Modal */}
                    <Dialog
                      open={showCancelModal}
                      onClose={() => setShowCancelModal(false)}
                      className="relative z-50"
                    >
                      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {t("Cancel Order")}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {t("Confirm Cancellation")}                            </p>
                          </div>

                          <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-mainColor focus:ring-mainColor"
                            rows={3}
                          />

                          <div className="flex justify-end mt-4 space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCancelModal(false);
                                setCancelReason("");
                              }}
                              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              {t("Cancel")}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!cancelReason.trim()) {
                                  auth.toastError(
                                    t("Please enter a cancellation reason")
                                  );
                                  return;
                                }
                                handleChangeStaus(
                                  detailsData.id,
                                  "",
                                  orderStatusName,
                                  cancelReason
                                );
                                setShowCancelModal(false);
                                setCancelReason("");
                              }}
                              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              {t("Confirm Cancellation")}
                            </button>
                          </div>
                        </DialogPanel>
                      </div>
                    </Dialog>

                    {/* Refund Confirmation Modal */}
                    <Dialog
                      open={showRefundModal}
                      onClose={() => setShowRefundModal(false)}
                      className="relative z-50"
                    >
                      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {t("Confirm Refund")}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {t('Are you sure you want to refund this order?')}
                            </p>
                          </div>

                          <div className="flex justify-end mt-4 space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowRefundModal(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              {t("No, Cancel")}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleChangeStaus(
                                  detailsData.id,
                                  "",
                                  "refund",
                                  ""
                                );
                                setShowRefundModal(false);
                              }}
                              className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-mainColor hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {t("Yes, Refund")}
                            </button>
                          </div>
                        </DialogPanel>
                      </div>
                    </Dialog>
                  </div>
                </div>

                <div className="p-4 mt-4 bg-white rounded-lg shadow-sm order-status-history">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 history-title">
                    {t("Order Status History")}
                  </h3>
                  <div className="space-y-4 timeline">
                    {dataDetailsOrder.log_order.map((log, index) => (
                      <div
                        key={log.id}
                        className={`timeline-item relative pl-6 ${index === 0 ? "first-item" : ""
                          }`}
                      >
                        {/* Timeline marker */}
                        <div className="absolute left-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow timeline-marker top-2"></div>

                        {/* Timeline content */}
                        <div className="p-3 rounded-lg timeline-content bg-gray-50">
                          <div className="flex items-center gap-2 mb-1 status-change">
                            <span className="px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded from-status">
                              {log.from_status === "processing"
                                ? "Accepted"
                                : log.from_status === "confirmed"
                                  ? "Processing"
                                  : log.from_status.replace(/_/g, " ")}
                            </span>
                            <span className="text-gray-400 arrow">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                              </svg>
                            </span>

                            <span className="px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded from-status">
                              {log.to_status === "processing"
                                ? "Accepted"
                                : log.to_status === "confirmed"
                                  ? "Processing"
                                  : log.to_status.replace(/_/g, " ")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 meta-info">
                            <span className="changed-by">
                              {t("Changed by")}:{" "}
                              <span className="font-medium">
                                {log.admin.name}
                              </span>
                            </span>
                            <span className="change-date">
                              {new Date(log.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Timeline connector (except for last item) */}
                        {index !== dataDetailsOrder.log_order.length - 1 && (
                          <div className="timeline-connector absolute left-[5px] top-5 bottom-0 w-px bg-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food Preparation Time */}
                {(detailsData.order_status === "pending" ||
                  detailsData.order_status === "confirmed" ||
                  detailsData.order_status === "processing" ||
                  detailsData.order_status === "out_for_delivery") && (
                    <div className="w-full p-4 mt-4 bg-white shadow-md rounded-xl">
                      <h3 className="text-lg font-TextFontSemiBold">
                        {t("Food Preparation Time")}
                      </h3>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-500" />
                        {preparationTime ? (
                          <>
                            <span
                              className={
                                olderHours +
                                  preparationTime.hours -
                                  initialTime.currentHour <=
                                  0 ||
                                  olderDay +
                                  preparationTime.days -
                                  initialTime.currentDay <=
                                  0
                                  ? "text-red-500"
                                  : "text-cyan-400"
                              }
                            >
                              {olderHours +
                                preparationTime.hours -
                                initialTime.currentHour <=
                                0 ? (
                                <>
                                  {olderDay +
                                    preparationTime.days -
                                    initialTime.currentDay}
                                  d{" "}
                                  {initialTime.currentHour -
                                    (olderHours + preparationTime.hours)}
                                  h{" "}
                                  {olderMinutes +
                                    preparationTime.minutes -
                                    initialTime.currentMinute}
                                  m {preparationTime.seconds}s Over
                                </>
                              ) : (
                                <>
                                  {initialTime.currentDay - olderDay}d{" "}
                                  {preparationTime.hours}h{" "}
                                  {olderMinutes +
                                    preparationTime.minutes -
                                    initialTime.currentMinute}
                                  m {preparationTime.seconds}s Left
                                </>
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">
                            {t("Preparing time not available")}
                          </span>
                        )}
                      </div>
                      {/* <span>preparationTime.hours: {preparationTime?.hours}</span>
                                                               <br />
                                                               <span>olderHours: {olderHours}</span>
                                                               <br />
                                                               <span>currentHour: {initialTime?.currentHour}</span>
                                                               <br />
                                                               <span>preparationTime.minutes: {preparationTime?.minutes}</span>
                                                               <br />
                                                               <span>olderMinutes: {olderMinutes}</span>
                                                               <br />
                                                               <span>currentMinute: {initialTime?.currentMinute}</span> */}
                    </div>
                  )}

                {detailsData.delivery_id !== null && (
                  <div className="w-full p-4 mt-2 bg-white shadow-md rounded-xl">
                    <div className="flex items-center text-lg gap-x-2 font-TextFontSemiBold">
                      <span>
                        <FaUser className="text-mainColor" />
                      </span>
                      {t("DeliveryMan")}
                    </div>
                    <p className="text-sm">
                      {t("Name")}: {detailsData?.delivery?.f_name || "-"}{" "}
                      {detailsData?.delivery?.l_name || "-"}
                    </p>
                    <p className="text-sm">
                      {t('Orders')}: {detailsData?.delivery?.count_orders || "-"}
                    </p>
                    <p className="text-sm">
                      {t("Contact")}: {detailsData?.delivery?.phone || "-"}
                    </p>
                    <p className="text-sm">
                      {t("Email")}: {detailsData?.delivery?.email || "-"}
                    </p>
                  </div>
                )}
              </div>

              {/* Processing Order Modal */}
              {showStatusModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    {/* Background overlay */}
                    <div
                      className="fixed inset-0 transition-opacity"
                      aria-hidden="true"
                      onClick={() => setShowStatusModal(false)}
                    >
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    {/* Modal container */}
                    <span
                      className="hidden sm:inline-block sm:align-middle sm:h-screen"
                      aria-hidden="true"
                    >
                      &#8203;
                    </span>

                    {/* Modal content */}
                    <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              className="w-6 h-6 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                              {t("Order in Use by Another Person")}
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                {t("Someone else is currently working on this order. Please wait until they finish before proceeding to avoid conflicts or duplication.")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => setShowStatusModal(false)}
                          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-mainColor hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {t("Ok")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DetailsOrderPage;
