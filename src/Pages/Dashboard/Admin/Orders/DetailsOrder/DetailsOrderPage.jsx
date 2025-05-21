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
import { useDispatch } from 'react-redux';
import { removeCanceledOrder } from '../../../../../Store/CreateSlices';
import { useSelector } from 'react-redux'; // Add this import
import { FaFileInvoice, FaWhatsapp } from "react-icons/fa";

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
    console.log("canceledOrders", orderId)
    const orderExists = canceledOrders.orders.includes(orderId);
    console.log("orderExists", orderExists)
    if (orderExists) {
      dispatch(removeCanceledOrder(orderId));
    }
    refetchDetailsOrder();
  }, [orderId, location.pathname, dispatch, canceledOrders.orders]);

  useEffect(() => {
    const computedPermission = auth?.userState?.user_positions?.roles?.map((role) => role.role) || [];
    const ACTIONS = auth?.userState?.user_positions?.roles?.map((role) => role.action) || [];
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

    postData(formData, "Delivery has Assigned");
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
      auth.toastError("You don't have permission to change the order status");
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
    } else if (targetStatus === 'refund') {
      setShowRefundModal(true);
    } else {
      handleChangeStaus(detailsData.id, '', targetStatus, '');
    }
  };

  const handleOrderNumber = (id) => {
    if (!orderNumber) {
      auth.toastError("please set your order Number");
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
            <div className="w-full flex sm:flex-col lg:flex-row items-start justify-between gap-3 mb-24">
              {/* Left Section */}
              <div className="sm:w-full lg:w-8/12">
                <div className="w-full bg-white rounded-xl shadow-md p-2 ">
                  {detailsData.length === 0 ? (
                    <div>
                      <LoaderLogin />
                    </div>
                  ) : (
                    <div className="w-full">
                      {/* Header */}
                      <div className="w-full px-2 md:px-4 lg:px-4 py-4 shadow rounded-lg">
                        {/* Header */}
                        <div className="flex flex-col justify-between items-start border-b border-gray-300 pb-2">
                          <div className="w-full">
                            <div className="w-full flex flex-wrap items-center justify-between">
                              <h1 className="text-2xl font-TextFontMedium text-gray-800">
                                Order{" "}
                                <span className="text-mainColor">
                                  #{detailsData?.id || ""}
                                </span>
                              </h1>
                              <div className="sm:w-full lg:w-6/12 flex items-center justify-center gap-2">
                                <Link
                                  to={`/dashboard/orders/details/${Number(orderNumPath) - 1}`}
                                  className="w-6/12 text-center text-sm md:text-md text-white bg-mainColor border-2 border-mainColor px-1 py-1 rounded-lg transition-all ease-in-out duration-300  hover:bg-white hover:text-mainColor"
                                >
                                  {"<<"} Prev Order
                                </Link>
                                <Link
                                  to={`/dashboard/orders/details/${Number(orderNumPath) + 1}`}
                                  className="w-6/12 text-center text-sm md:text-md text-white bg-mainColor border-2 border-mainColor px-1 py-1 rounded-lg transition-all ease-in-out duration-300  hover:bg-white hover:text-mainColor"
                                >
                                  Next Order {">>"}
                                </Link>
                              </div>
                            </div>
                            {
                              detailsData?.address &&
                              <p className="text-sm text-gray-700 mt-1">
                                <span className="font-TextFontSemiBold">Zone:</span>{" "}
                                {detailsData?.address?.zone?.zone || ""}
                              </p>
                            }
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-TextFontSemiBold">Branch:</span>{" "}
                              {detailsData?.branch?.name || ""}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-TextFontSemiBold">Order Time:</span>{" "}
                              {detailsData?.date || ""}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-TextFontSemiBold">Order Date:</span>{" "}
                              {detailsData?.order_date || ""}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-TextFontSemiBold">Schedule:</span>{" "}
                              {detailsData?.schedule?.name || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Order Information */}
                        <div className="w-full flex sm:flex-col xl:flex-row justify-center items-start gap-4">
                          <div className="sm:w-full xl:w-6/12  bg-white p-2 shadow-md rounded-md">
                            <p className="text-md text-gray-800">
                              <span className="font-TextFontSemiBold text-mainColor">Status:</span>{" "}
                              {detailsData?.order_status || ""}
                            </p>
                            <p className="text-md text-gray-800">
                              <span className="font-TextFontSemiBold text-mainColor">Payment Method:</span>{" "}
                              {detailsData?.payment_method?.name || ""}
                            </p>
                             <p className="text-md text-gray-800">
                              <span className="font-TextFontSemiBold text-mainColor">Payment Status:</span>{" "}
                              {detailsData?.status_payment || ""}
                            </p>
                          </div>
                          <div className="sm:w-full xl:w-6/12   bg-white p-2 shadow-md rounded-md">
                            <p className="text-md text-gray-800">
                              <span className="font-TextFontSemiBold text-mainColor">Order Type:</span>{" "}
<span
                                className={`px-2 py-1 rounded-full text-md ${detailsData?.order_type === "take_away"
                                  ? "text-green-700 bg-green-100" // Green text with light green bg
                                  : "text-blue-700 bg-blue-100" // Adjust for delivery (blue as example)
                                  }`}
                              >
                                {detailsData?.order_type || ""}
                              </span>                            </p>
                            <p className="text-md text-gray-800">
                              <span className="font-TextFontSemiBold text-mainColor">Order Note:</span>{" "}
                              {detailsData?.notes || "No Notes"}
                            </p>
                            {detailsData?.payment_method?.id !== 2 && (
                              <p className="text-md text-gray-800">
                                <span className="font-TextFontSemiBold text-mainColor">Order Recipt:</span>
                                {detailsData?.receipt ? (
                                  <>
                                    <span
                                      className="text-mainColor font-TextFontMedium ml-2 underline cursor-pointer"
                                      onClick={() => handleOpenReceipt(detailsData.id)}
                                    >
                                      Receipt
                                    </span>

                                    {openReceipt === detailsData.id && (
                                      <Dialog
                                        open={true}
                                        onClose={handleCloseReceipt}
                                        className="relative z-10"
                                      >
                                        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                                              <div className="w-full flex justify-center items-center p-5">
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
                                                  className="inline-flex w-full justify-center rounded-md bg-mainColor px-6 py-3 text-sm font-TextFontMedium text-white sm:mt-0 sm:w-auto"
                                                >
                                                  Close
                                                </button>
                                              </div>
                                            </DialogPanel>
                                          </div>
                                        </div>
                                      </Dialog>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-md text-gray-800 font-TextFontMedium ml-2 underline">
                                    No Recipt
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Combined Orders Table */}
                      <div className="bg-white shadow-lg rounded-lg p-2 my-3 border border-gray-200">
                        {/* Table Header */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Items</h2>

                        {/* Table wrapped in a horizontal scroll container */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-[#9E090F] to-[#D1191C] text-white">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-gray-300">
                                  Order #
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-gray-300">
                                  Products
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-gray-300">
                                  Addons
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-gray-300">
                                  Excludes
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                  Extra
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(detailsData?.order_details || []).map((order, orderIndex) => (
                                <tr key={`order-${orderIndex}`} className="hover:bg-gray-50">
                                  {/* Order Number Column */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300 font-semibold">
                                    {orderIndex + 1}
                                  </td>

                                  {/* Products Column: Name, Price, and Quantity */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.product.map((prod, prodIndex) => (
                                      <div key={`prod-${prodIndex}`} className="mb-3">
                                        <div className="font-semibold text-gray-800">
                                          {prod.product.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          Price: {prod.product.price}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          Qty: {prod.count}
                                        </div>
                                      </div>
                                    ))}
                                  </td>

                                  {/* Addons Column: Just Name */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.addons && order.addons.length > 0 ? (
                                      order.addons.map((addon, addonIndex) => (
                                        <div key={`addon-${addonIndex}`} className="mb-3">
                                          <div className="font-semibold text-gray-800">
                                            {addon.addon.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Price: {addon.addon.price}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Count: {addon.count || 0}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>

                                  {/* Excludes Column: Just Name */}
                                  <td className="px-2 py-1 whitespace-normal border-r border-gray-300">
                                    {order.excludes && order.excludes.length > 0 ? (
                                      order.excludes.map((exclude, excludeIndex) => (
                                        <div key={`exclude-${excludeIndex}`} className="mb-3">
                                          <div className="font-semibold text-gray-800">
                                            {exclude.name}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>

                                  {/* Variations Column: Name and Type */}
                                  <td className="px-2 py-1 whitespace-normal">
                                    {order.variations && order.variations.length > 0 ? (
                                      order.variations.map((variation, varIndex) => (
                                        <div key={`variation-${varIndex}`} className="mb-3">
                                          <div className="font-semibold text-gray-800">
                                            {variation.variation?.name}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Type:{" "}
                                            {variation.options && variation.options.length > 0 ? (
                                              variation.options.map((option, optIndex) => (
                                                <span key={`option-${optIndex}`} className="mr-1">
                                                  {option.name}
                                                  {optIndex < variation.options.length - 1 ? ", " : ""}
                                                </span>
                                              ))
                                            ) : (
                                              <span>-</span>
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="my-2 flex flex-col gap-y-1 p-2">
                        <p className="w-full flex items-center justify-between">
                          {(detailsData?.order_details || []).forEach((orderDetail) => {
                            // Sum extras prices
                            orderDetail.extras.forEach((extraItem) => {
                              totalItemPrice += extraItem.price;
                            });

                            // Sum product prices (price * count)
                            orderDetail.product.forEach((productItem) => {
                              totalItemPrice += productItem.product.price * productItem.count;
                            });

                            // Sum variations' options prices
                            orderDetail.variations.forEach((variation) => {
                              variation.options.forEach((optionItem) => {
                                totalItemPrice += optionItem.price;
                              });
                            });
                          })}
                          {/* Display total items price */}
                          Items Price:<span>{totalItemPrice}</span>
                        </p>

                        <p className="w-full flex items-center justify-between">
                          Tax / VAT:<span>{detailsData?.total_tax || 0}</span>
                        </p>
                        <p className="w-full flex items-center justify-between">
                          {(detailsData?.order_details || []).forEach((orderDetail) => {
                            orderDetail.addons.forEach((addonItem) => {
                              // Add the price of each addon to the total
                              totalAddonPrice += addonItem.addon.price * addonItem.count;
                            });
                          })}

                          <span>Addons Price:</span>
                          <span>{totalAddonPrice}</span>
                        </p>
                        <p className="w-full flex items-center justify-between">
                          Subtotal:
                          <span>{totalItemPrice + totalAddonPrice}</span>
                        </p>
                        <p className="w-full flex items-center justify-between">
                          Extra Discount: <span>{detailsData?.total_discount || 0}</span>
                        </p>
                        <p className="w-full flex items-center justify-between">
                          Coupon Discount:
                          <span> {detailsData?.coupon_discount || 0}</span>
                        </p>
                        <p className="w-full flex items-center justify-between">
                          Delivery Fee:
                          <span> {detailsData?.address?.zone?.price || 0}</span>
                        </p>
                        <p className="w-full flex items-center justify-between font-TextFontSemiBold text-lg">
                          Total:<span>{detailsData?.amount}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className="sm:w-full lg:w-4/12">

                <div className="w-full bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-x-2 text-lg font-TextFontSemiBold">
                    <span>
                      <FaUser className="text-mainColor" />
                    </span>
                    Customer Information
                  </div>
                  <p className="text-sm">
                    Name: {detailsData?.user?.f_name || "-"}{" "}
                    {detailsData?.user?.l_name || "-"}
                  </p>
                  <p className="text-sm">
                    Orders: {detailsData?.user?.count_orders || "-"}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    Contact:
                    {detailsData?.user?.phone && (
                      <a
                        href={`https://wa.me/${detailsData.user.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-black hover:text-green-600 transition duration-200"
                      >
                        <FaWhatsapp className="w-5 h-5 text-green-600" />
                        {detailsData.user.phone}
                      </a>
                    )}
                  </p>
                  <p className="text-sm">
                    Email: {detailsData?.user?.email || "-"}
                  </p>

                  {detailsData.order_type === "delivery" && (
                    <>
                      <p className="text-sm">
                        Build Num: {detailsData?.address?.building_num || "-"}
                      </p>
                      <p className="text-sm">
                        Floor: {detailsData?.address?.floor_num || "-"}
                      </p>
                      <p className="text-sm">
                        House: {detailsData?.address?.apartment || "-"}
                      </p>
                      <p className="text-sm">
                        Road: {detailsData?.address?.street || "-"}
                      </p>
                      <p className="text-sm pb-2 text-center">
                        {detailsData?.address?.address || "-"}
                      </p>
                      {detailsData?.address?.additional_data ||
                        ("" && (
                          <p className="text-sm border-t-2 text-center pt-2">
                            {detailsData?.address?.additional_data || "-"}
                          </p>
                        ))}
                      {detailsData?.address?.map && (
                        <p className="text-sm line-clamp-3">
                          Location Map:
                          <a
                            href={detailsData?.address?.map}
                            className="ml-1 text-mainColor font-TextFontMedium underline"
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

                <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4">
                  <div className="flex flex-col gap-y-2">
                    <span className="font-TextFontSemiBold text-lg">
                      Change Order Status
                    </span>

                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Define status order for comparison */}
                        {(() => {
                          const statusOrder = [
                            'pending',
                            'processing',
                            'confirmed',
                            'out_for_delivery',
                            'delivered',
                            // 'canceled',
                            // 'refund',
                            // 'returned',
                            // 'faild_to_deliver'
                          ];
// ccccccccc
                          const currentStatus = detailsData?.order_status;
                          const currentIndex = statusOrder.indexOf(currentStatus);

                          // Define all possible statuses
                          const allStatuses = [
                            { name: 'pending', label: 'Pending', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { name: 'processing', label: 'Accept', icon: 'M5 13l4 4L19 7' },
                            { name: 'confirmed', label: 'Processing', icon: 'M5 13l4 4L19 7' },
                            { name: 'out_for_delivery', label: 'Out for Delivery', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                            { name: 'delivered', label: 'Delivered', icon: 'M5 13l4 4L19 7' },
                            { name: 'faild_to_deliver', label: 'Failed to Deliver', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                            { name: 'returned', label: 'Returned', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                            { name: 'canceled', label: 'Canceled', icon: 'M6 18L18 6M6 6l12 12' },
                            { name: 'refund', label: 'Refund', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                          ];

                          // Filter statuses based on current status
                          const filteredStatuses = allStatuses.filter(status => {
                            if (currentStatus === 'delivered') {
                              // Exclude 'canceled' and 'returned' when status is 'delivered'
                              return !['canceled'].includes(status.name);
                            } else if (currentStatus === 'canceled') {
                              // Exclude 'delivered', 'faild_to_deliver', and 'returned' when status is 'canceled'
                              return !['delivered', 'faild_to_deliver', 'returned'].includes(status.name);
                            }
                            else if (currentStatus === 'refund') {
                              // Exclude 'delivered', 'faild_to_deliver', and 'returned' when status is 'canceled'
                              return !['canceled'].includes(status.name);
                            }
                            return true; // Include all statuses for other cases
                          });

                          return filteredStatuses.map((status) => {
                            const statusIndex = statusOrder.indexOf(status.name);
                            const isCurrent = currentStatus === status.name;
                            const isPrevious = statusIndex !== -1 && currentIndex > statusIndex;
                            const isNext = statusIndex !== -1 && currentIndex < statusIndex;

                            const isCancel = status.name === 'canceled';
                            const isReturn = status.name === 'returned';
                            const isFailed = status.name === 'faild_to_deliver';

                            // Determine if button should be disabled
                            let isDisabled = false;

                            // For normal flow statuses
                            if (statusOrder.includes(status.name)) {
                              // Enable if exactly one step forward or backward (except pending)
                              isDisabled = !(
                                (statusIndex === currentIndex + 1) ||
                                (statusIndex === currentIndex - 1 && status.name !== 'pending')
                              );
                            }
                            // For returned status
                            else if (isReturn) {
                              isDisabled = !['out_for_delivery', 'delivered'].includes(currentStatus);
                            }
                            // For failed delivery status
                            else if (isFailed) {
                              isDisabled = currentStatus !== 'out_for_delivery';
                            }

                            return (
                              <button
                                key={status.name}
                                onClick={() => !isDisabled && handleSelectOrderStatus({ name: status.name })}
                                disabled={isDisabled}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all relative
              ${isCurrent ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-md' :
                                    isPrevious ? 'bg-green-50 border-green-300 text-green-800' :
                                      isDisabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' :
                                        'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}
            `}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
                                </svg>
                                {status.label}

                                {/* Checkmark for completed statuses */}
                                {isPrevious && (
                                  <span className="absolute top-2 right-2 text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}

                                {/* Current status indicator */}
                                {isCurrent && (
                                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
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
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Enter Cancel Reason:
                        </label>
                        <input
                          type="text"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Enter reason for cancellation"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              setShowReason(false);
                              setCancelReason("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (!cancelReason.trim()) {
                                auth.toastError("Please enter a cancellation reason");
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
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Confirm Cancellation
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show existing cancellation reasons if they exist */}
                    {detailsData.order_status === "canceled" && (
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        {detailsData.admin_cancel_reason && (
                          <div className="mb-3">
                            <p className="font-medium text-gray-800">Admin Cancellation Reason:</p>
                            <p className="text-gray-600">{detailsData.admin_cancel_reason}</p>
                          </div>
                        )}
                        {detailsData.customer_cancel_reason && (
                          <div>
                            <p className="font-medium text-gray-800">Customer Cancellation Reason:</p>
                            <p className="text-gray-600">{detailsData.customer_cancel_reason}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Cancel Reason Modal */}
                    <Dialog open={showCancelModal} onClose={() => setShowCancelModal(false)} className="relative z-50">
                      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Cancel Order</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Please provide a reason for cancellation
                            </p>
                          </div>

                          <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-mainColor focus:ring-mainColor"
                            rows={3}
                          />

                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCancelModal(false);
                                setCancelReason("");
                              }}
                              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!cancelReason.trim()) {
                                  auth.toastError("Please enter a cancellation reason");
                                  return;
                                }
                                handleChangeStaus(detailsData.id, "", orderStatusName, cancelReason);
                                setShowCancelModal(false);
                                setCancelReason("");
                              }}
                              className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              Confirm Cancellation
                            </button>
                          </div>
                        </DialogPanel>
                      </div>
                    </Dialog>

                    {/* Refund Confirmation Modal */}
                    <Dialog open={showRefundModal} onClose={() => setShowRefundModal(false)} className="relative z-50">
                      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Confirm Refund</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Are you sure you want to refund this order?
                            </p>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowRefundModal(false)}
                              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              No, Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleChangeStaus(detailsData.id, "", "refund", "");
                                setShowRefundModal(false);
                              }}
                              className="rounded-md border border-transparent bg-mainColor px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Yes, Refund
                            </button>
                          </div>
                        </DialogPanel>
                      </div>
                    </Dialog>
                  </div>
                </div>

                <div className="order-status-history p-4 bg-white rounded-lg shadow-sm mt-4">
                  <h3 className="history-title text-lg font-semibold text-gray-800 mb-4">Order Status History</h3>
                  <div className="timeline space-y-4">
                    {dataDetailsOrder.log_order.map((log, index) => (
                      <div key={log.id} className={`timeline-item relative pl-6 ${index === 0 ? 'first-item' : ''}`}>
                        {/* Timeline marker */}
                        <div className="timeline-marker absolute left-0 top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>

                        {/* Timeline content */}
                        <div className="timeline-content bg-gray-50 p-3 rounded-lg">
                          <div className="status-change flex items-center gap-2 mb-1">
                            <span className="from-status px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                              {log.from_status === "processing" ? "Accepted" :
                                log.from_status === "confirmed" ? "Processing" :
                                  log.from_status.replace(/_/g, ' ')}
                            </span>
                            <span className="arrow text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                              </svg>
                            </span>

                            <span className="from-status px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                              {log.to_status === "processing" ? "Accepted" :
                                log.to_status === "confirmed" ? "Processing" :
                                  log.to_status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="meta-info flex justify-between items-center text-xs text-gray-500">
                            <span className="changed-by">Changed by: <span className="font-medium">{log.admin.name}</span></span>
                            <span className="change-date">
                              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4">
                      <h3 className="text-lg font-TextFontSemiBold">
                        Food Preparation Time
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
                            Preparing time not available
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
                  <div className="w-full bg-white rounded-xl shadow-md p-4 mt-2">
                    <div className="flex items-center gap-x-2 text-lg font-TextFontSemiBold">
                      <span>
                        <FaUser className="text-mainColor" />
                      </span>
                      Delivery Man
                    </div>
                    <p className="text-sm">
                      Name: {detailsData?.delivery?.f_name || "-"}{" "}
                      {detailsData?.delivery?.l_name || "-"}
                    </p>
                    <p className="text-sm">
                      Orders: {detailsData?.delivery?.count_orders || "-"}
                    </p>
                    <p className="text-sm">
                      Contact: {detailsData?.delivery?.phone || "-"}
                    </p>
                    <p className="text-sm">
                      Email: {detailsData?.delivery?.email || "-"}
                    </p>
                  </div>
                )}

              </div>

              {/* Processing Order Modal */}
              {showStatusModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              className="h-6 w-6 text-red-600"
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
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              Order in Use by Another Person
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Someone else is currently working on this order. Please wait until they finish before proceeding to avoid conflicts or duplication.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => setShowStatusModal(false)}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mainColor text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Ok
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
