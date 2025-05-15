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

  const [showReason, setShowReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isOpenOrderStatus, setIsOpenOrderStatus] = useState(false);

  const [orderStatusName, setOrderStatusName] = useState("");
  const [searchDelivery, setSearchDelivery] = useState("");

  const [preparationTime, setPreparationTime] = useState({});

  const [orderNumber, setOrderNumber] = useState("");

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

  const handleSelectOrderStatus = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    const hasOrderPermission = auth.userState.user_positions.roles?.some(
      (perm) => perm.role === "Order"
    );
    console.log("hasOrderPermission", hasOrderPermission);
    const hasValidAction = auth.userState.user_positions.roles?.some(
      (action) => action.action === "all" || action.action === "back_status"
    );

    if (hasOrderPermission && hasValidAction) {
      if (selectedOption.name === 'canceled') {
        setShowReason(true)
        setOrderStatusName(selectedOption.name);
      } else {
        setShowReason(false);
        setOrderStatusName(selectedOption.name);
        handleChangeStaus(detailsData.id, '', selectedOption.name, '');
      }
    } else {
      auth.toastError("You don't have permission to change the order status");
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
                              <span className="text-green-600 font-TextFontSemiBold ml-1">
                                {detailsData?.payment_status || ""}
                              </span>
                            </p>
                          </div>
                          <div className="sm:w-full xl:w-6/12   bg-white p-2 shadow-md rounded-md">
                            <p className="text-md text-gray-800">
                              <span className="font-TextFontSemiBold text-mainColor">Order Type:</span>{" "}
                              {detailsData?.order_type || ""}
                            </p>
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
                                  Variations
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

                {/* Order Setup */}
                <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4">
                  <div className="flex flex-col gap-y-2">
                    <span className="font-TextFontSemiBold">
                      Change Order Status
                    </span>

                    {/* Status buttons in flex-col layout */}
                    <div className="flex flex-col gap-3">
                      {/* Status Buttons Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Pending */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'pending' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'pending'
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </button>

                        {/* Accept/Processing */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'processing' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'processing'
                              ? 'bg-blue-100 border-blue-400 text-blue-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>

                        {/* Out for Delivery */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'out_for_delivery' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'out_for_delivery'
                              ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Out for Delivery
                        </button>

                        {/* Delivered */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'delivered' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'delivered'
                              ? 'bg-green-100 border-green-400 text-green-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Delivered
                        </button>

                        {/* Canceled */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'canceled' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'canceled'
                              ? 'bg-red-100 border-red-400 text-red-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Canceled
                        </button>

                        {/* Refund */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'refund' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'refund'
                              ? 'bg-pink-100 border-pink-400 text-pink-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Refund
                        </button>

                        {/* Returned */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'returned' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'returned'
                              ? 'bg-purple-100 border-purple-400 text-purple-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Returned
                        </button>

                        {/* Failed to Deliver */}
                        <button
                          onClick={() => handleSelectOrderStatus({ name: 'faild_to_deliver' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${detailsData?.order_status === 'faild_to_deliver'
                              ? 'bg-orange-100 border-orange-400 text-orange-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Failed to Deliver
                        </button>
                      </div>
                    </div>


                    {/* <DropDown
                      ref={StatusRef}
                      handleOpen={handleOpenOrderStatus}
                      stateoption={orderStatusName}
                      openMenu={isOpenOrderStatus}
                      handleOpenOption={handleOpenOptionOrderStatus}
                      onSelectOption={(selectedOption) =>
                        handleSelectOrderStatus(selectedOption)
                      } // Pass selected option
                      options={orderStatus}
                    /> */}

                    {openOrderNumber === detailsData?.id && (
                      <Dialog
                        open={true}
                        onClose={handleCloseOrderNumber}
                        className="relative z-10"
                      >
                        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                              {/* Permissions List */}
                              <div className="w-full flex flex-col items-start justify-center gap-4 my-4 px-4 sm:p-6 sm:pb-4">
                                <span>Order Number:</span>
                                {/* <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center"> */}
                                <TextInput
                                  value={orderNumber} // Access category_name property
                                  onChange={(e) =>
                                    setOrderNumber(e.target.value)
                                  }
                                  placeholder="Order Number"
                                />
                                {/* </div> */}
                              </div>

                              {/* Dialog Footer */}
                              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-3">
                                <button
                                  type="button"
                                  onClick={handleCloseOrderNumber}
                                  className="inline-flex w-full justify-center rounded-md bg-white border-2 px-6 py-3 text-sm font-TextFontMedium text-mainColor sm:mt-0 sm:w-auto"
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOrderNumber(detailsData.id)
                                  }
                                  className="inline-flex w-full justify-center rounded-md bg-mainColor px-6 py-3 text-sm font-TextFontMedium text-white sm:mt-0 sm:w-auto"
                                >
                                  Change Status
                                </button>
                              </div>
                            </DialogPanel>
                          </div>
                        </div>
                      </Dialog>
                    )}
                  </div>

                  {showReason && (
                    <div className="mt-4">
                      <label className="block text-gray-700 text-sm font-medium">
                        Enter Cancel Reason:
                      </label>
                      <input
                        type="text"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Enter reason"
                        className="w-full border-2 rounded-2xl outline-none px-2 py-2 shadow text-2xl text-thirdColor"
                      />
                      <button
                        onClick={() =>
                          handleChangeStaus(
                            detailsData.id,
                            "",
                            "canceled",
                            cancelReason
                          )
                        }
                        className="mt-2 px-4 py-3 rounded-md bg-mainColor text-white text-sm"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  )}

                  {detailsData.order_status === "canceled" && (
                    <div className="mt-4 p-2 border-2 rounded-2xl bg-gray-100 text-gray-800">
                      {/* <span className="font-TextFontSemiBold">Cancellation Details:</span> */}
                      {detailsData.admin_cancel_reason ? (
                        <p className="text-lg">
                          <strong>Rejection Admin Reason:</strong>{" "}
                          {detailsData.admin_cancel_reason}
                        </p>
                      ) : null}
                      {detailsData.customer_cancel_reason ? (
                        <p className="text-lg">
                          <strong>Rejection Customer Reason:</strong>{" "}
                          {detailsData.customer_cancel_reason}
                        </p>
                      ) : null}

                      {/* If all reasons are missing, show "No reason provided" */}
                      {!detailsData.customer_cancel_reason &&
                        !detailsData.admin_cancel_reason && (
                          <p className="mt-2 text-lg text-gray-600">
                            No reason provided
                          </p>
                        )}
                    </div>
                  )}

                  {detailsData.order_type === "delivery" &&
                    (detailsData.order_status === "processing" ||
                      detailsData.order_status === "out_for_delivery") && (
                      <button
                        className="w-full bg-mainColor text-white py-2 rounded-md mt-4"
                        onClick={() => handleOpenDeliviers(detailsData.id)}
                      >
                        Assign Delivery Man
                      </button>
                    )}

                  {openDeliveries === detailsData.id && (
                    <Dialog
                      open={true}
                      onClose={handleCloseDeliveries}
                      className="relative z-10"
                    >
                      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center  text-center sm:items-center sm:p-0">
                          <DialogPanel className="relative sm:w-full sm:max-w-2xl  pt-4 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all ">
                            <div className="mb-2 px-2">
                              <SearchBar
                                placeholder="Search Delivery"
                                value={searchDelivery}
                                handleChange={handleChangeDeliveries}
                              />
                            </div>
                            <div className="px-4 flex flex-col gap-3 max-h-64 overflow-x-scroll scrollPage">
                              {deliveriesFilter.length === 0 ? (
                                <div className="text-center font-TextFontMedium text-mainColor">
                                  Not Found Delivery
                                </div>
                              ) : (
                                deliveriesFilter.map((delivery) => (
                                  <div
                                    className="border-2 flex items-center justify-between border-gray-400 p-2 rounded-2xl"
                                    key={`${delivery.id}-${detailsData.id}`}
                                  >
                                    <span className="font-TextFontRegular text-xl">
                                      {delivery?.f_name || "-"}{" "}
                                      {delivery?.l_name || "-"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAssignDelivery(
                                          delivery.id,
                                          detailsData.id,
                                          detailsData.order_number
                                        )
                                      }
                                      className="mt-3 inline-flex w-full justify-center rounded-md bg-mainColor px-6 py-3 text-sm font-TextFontMedium text-white shadow-sm sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                                    >
                                      Assign
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Dialog Footer */}
                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse">
                              <button
                                type="button"
                                onClick={handleCloseDeliveries}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-mainColor px-6 py-3 text-sm font-TextFontMedium text-white shadow-sm sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                              >
                                Close
                              </button>
                            </div>
                          </DialogPanel>
                        </div>
                      </div>
                    </Dialog>
                  )}
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
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DetailsOrderPage;
