import React, { useEffect, useState } from "react";
import CartsOrderSection from "../Orders/AllOrders/CartsOrderSection";
import { LoaderLogin } from "../../../../Components/Components";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useGet } from "../../../../Hooks/useGet";
import Chart from "./Charts/Chart";
import FooterCard from "./FooterHome/FooterCard";
import { SelectDateRangeSection } from '../../../../Pages/Pages'
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const HomePage = () => {
                 const {  t,i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchCountOrders,
    loading,
    data: dataCountOrders,
  } = useGet({
    url: `${apiUrl}/admin/order/count`,
  });

  const {
    refetch: refetchChart,
    loading: loadingChart,
    data: dataCharts,
  } = useGet({
    url: `${apiUrl}/admin/home`,
  });
  const [dataHome, setDataHome] = useState([]);
  const [order_statistics, setOrder_statistics] = useState({})
  const [earning_statistics, setEarning_statistics] = useState({})
  const [orders, setOrders] = useState({})
  const [recent_orders, setRecent_orders] = useState([])
  const [offers, setOffers] = useState([])
  const [topSelling, SetTopSelling] = useState([])
  const [topCustomers, setTopCustomers] = useState({})

  useEffect(() => {
    console.log("Fetching Count Orders...");
    refetchCountOrders();
    refetchChart();
  }, [refetchCountOrders, refetchChart]);

  useEffect(() => {
    if (dataCharts) {
      setDataHome(dataCharts);
      setOrder_statistics(dataCharts.order_statistics)
      setEarning_statistics(dataCharts.earning_statistics)
      setRecent_orders(dataCharts.recent_orders)
      setOrders(dataCharts.orders)
      setOffers(dataCharts.offers)
      SetTopSelling(dataCharts.top_selling)
      setTopCustomers(dataCharts.top_customers)


    }
    console.log("fetch data Home", dataHome);
    console.log("fetch data Home", dataCharts);
    console.log("fetch data Home stat order", dataHome.order_statistics);
    console.log("fetch data Home stat earn", dataHome.earning_statistics);
    console.log("fetch data Home stat recent", dataHome.recent_orders);
    console.log("fetch data Home stat order", order_statistics);
    console.log("fetch data Home stat offers", dataHome.offers);
    console.log("fetch data Home stat top_customers", dataHome.top_customers);
    console.log("fetch data Home stat top_selling", dataHome.top_selling);
    // console.log("fetch data Home stat order", dataCharts.orders);

  }, [dataCharts, dataHome, order_statistics]);

  // const counters = {
  //   ordersAll: dataCountOrders?.orders || 0,
  //   ordersPending: dataCountOrders?.pending || 0,
  //   ordersConfirmed: dataCountOrders?.confirmed || 0,
  //   ordersProcessing: dataCountOrders?.processing || 0,
  //   ordersOutForDelivery: dataCountOrders?.out_for_delivery || 0,
  //   ordersDelivered: dataCountOrders?.delivered || 0,
  //   ordersReturned: dataCountOrders?.returned || 0,
  //   ordersFailed: dataCountOrders?.faild_to_deliver || 0,
  //   ordersCanceled: dataCountOrders?.canceled || 0,
  //   ordersSchedule: dataCountOrders?.scheduled || 0,
  // };

  const ordersAllCount = useSelector(state => state.ordersAll.data);
  const ordersAllCountLoading = useSelector(state => state.ordersAll.loading);
  const ordersPendingCount = useSelector(state => state.ordersPending.data);
  const ordersConfirmedCount = useSelector(state => state.ordersConfirmed.data);
  const ordersProcessingCount = useSelector(state => state.ordersProcessing.data);
  const ordersOutForDeliveryCount = useSelector(state => state.ordersOutForDelivery.data);
  const ordersDeliveredCount = useSelector(state => state.ordersDelivered.data);
  const ordersReturnedCount = useSelector(state => state.ordersReturned.data);
  const ordersRefundCount = useSelector(state => state.ordersRefund.data);
  const ordersFailedCount = useSelector(state => state.ordersFailed.data);
  const ordersCanceledCount = useSelector(state => state.ordersCanceled.data);
  const ordersScheduleCount = useSelector(state => state.ordersSchedule.data);

  const { refetch: refetchBranch, loading: loadingBranch, data: dataBranch } = useGet({
         url: `${apiUrl}/admin/order/branches`
  });

  console.log('orderAllCount', ordersAllCount)
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
  ordersPending: ordersAllCount.filter(order => order.order_status === "pending").length,
  ordersConfirmed: ordersAllCount.filter(order => order.order_status === "confirmed").length,
  ordersProcessing: ordersAllCount.filter(order => order.order_status === "processing").length,
  ordersOutForDelivery: ordersAllCount.filter(order => order.order_status === "out_for_delivery").length,
  ordersDelivered: ordersAllCount.filter(order => order.order_status === "delivered").length,
  ordersReturned: ordersAllCount.filter(order => order.order_status === "returned").length,
  ordersRefund: ordersAllCount.filter(order => order.order_status === "refund").length,
  ordersFailed: ordersAllCount.filter(order => order.order_status === "failed_to_deliver").length,
  ordersCanceled: ordersAllCount.filter(order => order.order_status === "canceled").length,
  ordersSchedule: ordersAllCount.filter(order => order.order_status === "scheduled").length,
}

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        {loading && loadingChart ? (
          <>
            <div className="flex items-center justify-center w-full">
              <LoaderLogin />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-start justify-center w-full gap-7 pb-28">
            <SelectDateRangeSection typPage={'all'} branchsData={dataBranch} />

              <CartsOrderSection ordersNum={counters} />

              <div className="flex flex-col items-start justify-center w-full px-4 gap-7">
                <Chart
                  order_statistics={order_statistics}
                  earning_statistics={earning_statistics}
                  recent_orders={recent_orders}
                  orders={orders}
                />
                <div className="flex flex-wrap items-center justify-between w-full gap-5">
                  <FooterCard title={t("TopSellingProducts")} link="/dashboard/setup_product/product" layout={"TopSelling"} topCustomers={topCustomers} topSelling={topSelling} offers={offers} />
                  {/* <FooterCard title={"Most Rated Products"} link="/dashboard/setup_product/product" /> */}
                  <FooterCard title={t("Deals")} link="/dashboard/deals" layout={"Deals"} topCustomers={topCustomers} topSelling={topSelling} offers={offers} />
                  <FooterCard title={t("TopCustomer")} link="/dashboard/users/customers" layout={"default"} topCustomers={topCustomers} topSelling={topSelling} offers={offers} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
