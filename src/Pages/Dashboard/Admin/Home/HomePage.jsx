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
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchChart,
    loading: loadingChart,
    data: dataCharts,
  } = useGet({
    url: `${apiUrl}/admin/home`,
  });
  const {
    refetch: refetchOrders,
    loading: loadingOrders,
    data: dataOrders,
  } = useGet({
    url: `${apiUrl}/admin/home/orders`,
  });
  const { refetch: refetchBranch, loading: loadingBranch, data: dataBranch } = useGet({
    url: `${apiUrl}/admin/order/branches`
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
    refetchChart();
    refetchBranch();
    refetchOrders();
  }, [refetchChart, refetchBranch , refetchOrders]);

  useEffect(() => {
    if (dataCharts) {
      setDataHome(dataCharts);
      setOrder_statistics(dataCharts.order_statistics)
      setEarning_statistics(dataCharts.earning_statistics)
      setRecent_orders(dataCharts.recent_orders)
      setOffers(dataCharts.offers)
      SetTopSelling(dataCharts.top_selling)
      setTopCustomers(dataCharts.top_customers)
    }
  }, [dataCharts, dataHome, order_statistics]);

  const counters = {
    ordersAll: dataOrders?.orders || 0,
    ordersPending: dataOrders?.pending || 0,
    ordersConfirmed: dataOrders?.confirmed || 0,
    ordersProcessing: dataOrders?.processing || 0,
    ordersOutForDelivery: dataOrders?.out_for_delivery || 0,
    ordersDelivered: dataOrders?.delivered || 0,
    ordersReturned: dataOrders?.returned || 0,
    ordersFailed: dataOrders?.faild_to_deliver || 0,
    ordersCanceled: dataOrders?.canceled || 0,
    ordersSchedule: dataOrders?.scheduled || 0,
  };

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        { (loadingBranch || loadingOrders ) ? (
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
