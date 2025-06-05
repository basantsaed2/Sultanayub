import React, { useEffect } from "react";
import { LoaderLogin, TitlePage } from "../../../../Components/Components";
import {
  AllOrdersPage,
  CartsOrderSection,
  SelectDateRangeSection,
} from "../../../../Pages/Pages";
import { useGet } from "../../../../Hooks/useGet";
import { useSelector } from "react-redux";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useTranslation } from "react-i18next";

const AllOrdersLayout = () => {
  const { t, i18n } = useTranslation();

  const ordersAllCount = useSelector((state) => state.ordersAll.data);
  const ordersAllCountLoading = useSelector((state) => state.ordersAll.loading);
  const ordersPendingCount = useSelector((state) => state.ordersPending.data);
  const ordersConfirmedCount = useSelector(
    (state) => state.ordersConfirmed.data
  );
  const ordersProcessingCount = useSelector(
    (state) => state.ordersProcessing.data
  );
  const ordersOutForDeliveryCount = useSelector(
    (state) => state.ordersOutForDelivery.data
  );
  const ordersDeliveredCount = useSelector(
    (state) => state.ordersDelivered.data
  );
  const ordersReturnedCount = useSelector((state) => state.ordersReturned.data);
  const ordersRefundCount = useSelector((state) => state.ordersRefund.data);
  const ordersFailedCount = useSelector((state) => state.ordersFailed.data);
  const ordersCanceledCount = useSelector((state) => state.ordersCanceled.data);
  const ordersScheduleCount = useSelector((state) => state.ordersSchedule.data);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: `${apiUrl}/admin/order/branches`,
  });

  console.log("orderAllCount", ordersAllCount);
  useEffect(() => {
    refetchBranch(); // Refetch data when the component mounts
  }, [refetchBranch]);

  // const counters = {
  //        ordersAll: ordersAllCount.length,
  //        ordersPending: ordersPendingCount.length,
  //        ordersConfirmed: ordersConfirmedCount.length,
  //        ordersProcessing: ordersProcessingCount.length,
  //        ordersOutForDelivery: ordersOutForDeliveryCount.length,
  //        ordersDelivered: ordersDeliveredCount.length,
  //        ordersReturned: ordersReturnedCount.length,
  //        ordersFailed: ordersFailedCount.length,
  //        ordersCanceled: ordersCanceledCount.length,
  //        ordersSchedule: ordersScheduleCount.length,
  // }
  const counters = {
    ordersAll: ordersAllCount.length,
    ordersPending: ordersAllCount.filter(
      (order) => order.order_status === "pending"
    ).length,
    ordersConfirmed: ordersAllCount.filter(
      (order) => order.order_status === "confirmed"
    ).length,
    ordersProcessing: ordersAllCount.filter(
      (order) => order.order_status === "processing"
    ).length,
    ordersOutForDelivery: ordersAllCount.filter(
      (order) => order.order_status === "out_for_delivery"
    ).length,
    ordersDelivered: ordersAllCount.filter(
      (order) => order.order_status === "delivered"
    ).length,
    ordersReturned: ordersAllCount.filter(
      (order) => order.order_status === "returned"
    ).length,
    ordersRefund: ordersAllCount.filter(
      (order) => order.order_status === "refund"
    ).length,
    ordersFailed: ordersAllCount.filter(
      (order) => order.order_status === "failed_to_deliver"
    ).length,
    ordersCanceled: ordersAllCount.filter(
      (order) => order.order_status === "canceled"
    ).length,
    ordersSchedule: ordersAllCount.filter(
      (order) => order.order_status === "scheduled"
    ).length,
  };

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        <TitlePage text={t("AllOrders")} />
        {loadingBranch || ordersAllCountLoading ? (
          <>
            <div className="flex items-center justify-center w-full">
              <LoaderLogin />
            </div>
          </>
        ) : (
          <>
            <SelectDateRangeSection typPage={"all"} branchsData={dataBranch} />

            <CartsOrderSection ordersNum={counters} />
            <AllOrdersPage />
          </>
        )}
      </div>
    </>
  );
};

export default AllOrdersLayout;
