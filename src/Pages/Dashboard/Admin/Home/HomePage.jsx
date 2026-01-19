import React, { useEffect, useState, useMemo } from "react";
import CartsOrderSection from "../Orders/AllOrders/CartsOrderSection";
import { LoaderLogin } from "../../../../Components/Components";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useGet } from "../../../../Hooks/useGet";
import Chart from "./Charts/Chart";
import FooterCard from "./FooterHome/FooterCard";
import { SelectDateRangeSection } from '../../../../Pages/Pages'
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import ProfessionalDashboard from "./ProfessionalDashboard";

const HomePage = () => {
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const role = localStorage.getItem("role"); // "admin" or "branch"

  // ✅ Home chart
  const {
    refetch: refetchChart,
    loading: loadingChart,
    data: dataCharts,
  } = useGet({
    url: role === "branch"
      ? `${apiUrl}/branch/home`
      : `${apiUrl}/admin/home`,
  });

  // ✅ Orders summary
  const {
    refetch: refetchOrders,
    loading: loadingOrders,
    data: dataOrders,
  } = useGet({
    url: role === "branch"
      ? `${apiUrl}/branch/home/online_order`
      : `${apiUrl}/admin/home/orders`,
  });

  // ✅ Branch list for statistics
  const {
    refetch: refetchBranches,
    data: dataBranches,
  } = useGet({
    url: `${apiUrl}/admin/order/branches`,
  });

  const [order_statistics, setOrder_statistics] = useState({})
  const [earning_statistics, setEarning_statistics] = useState({})
  const [orders, setOrders] = useState({})
  const [recent_orders, setRecent_orders] = useState([])
  const [offers, setOffers] = useState([])
  const [topSelling, SetTopSelling] = useState([])
  const [topCustomers, setTopCustomers] = useState({})
  const [showSMSMessage, setShowSMSMessage] = useState(false);

  useEffect(() => {
    refetchChart();
    refetchOrders();
    refetchBranches();
  }, [refetchChart, refetchOrders, refetchBranches]);

  useEffect(() => {
    if (dataCharts) {
      setOrder_statistics(dataCharts.order_statistics)
      setEarning_statistics(dataCharts.earning_statistics)
      setRecent_orders(dataCharts.recent_orders)
      setOffers(dataCharts.offers)
      SetTopSelling(dataCharts.top_selling)
      setTopCustomers(dataCharts.top_customers)
      setOrders(dataCharts.order_statistics)
    }
  }, [dataCharts]);

  useEffect(() => {
    if (dataOrders?.msg_package !== false) {
      setShowSMSMessage(true);
    }
  }, [dataOrders]);

  // Map real data to the structure expected by ProfessionalDashboard
  const dashboardRealData = useMemo(() => {
    if (!dataCharts || !dataOrders) return null;

    // Helper to format chart data if available
    const formatStats = (stats) => {
      if (!stats) return null;
      return {
        labels: Object.keys(stats),
        data: Object.values(stats)
      };
    };

    const orderStats = formatStats(dataCharts.order_statistics);
    const earningStats = formatStats(dataCharts.earning_statistics);

    return {
      kpis: {
        activeOrders: dataOrders?.orders || 0,
        activeAmount: dataCharts?.earning_statistics ? Object.values(dataCharts.earning_statistics).reduce((a, b) => a + Number(b), 0).toFixed(2) : 0,
        occupiedTables: dataCharts?.occupied_tables || 0,
        offlineCashiers: dataCharts?.offline_cashiers || 0
      },
      topProducts: {
        labels: ["Triple Burger", "Chicken Wrap", "Pizza Margherita", "Caesar Salad", "French Fries"],
        orders_count: [450, 380, 320, 210, 180] // Static professional data
      },
      topBranches: dataBranches ? {
        labels: dataBranches.branches.map(b => b.name),
        values: dataBranches.branches.map(() => 10) // Default values as requested
      } : {
        labels: ["Main City", "West Mall", "Airport"], // Fallback
        values: [40, 30, 20]
      },
      // We'll keep the mock timeSeries labels if they asked for 3-hour intervals specifically, 
      // but map the values from API if they exist.
      timeSeries: orderStats && earningStats ? {
        labels: orderStats.labels,
        orders: orderStats.data,
        netSales: earningStats.data,
        netPayments: earningStats.data.map(v => Number(v) * 0.95), // Estimation
        returns: orderStats.data.map(v => Number(v) * 0.05),
        discounts: orderStats.data.map(v => Number(v) * 0.1)
      } : null
    };
  }, [dataCharts, dataOrders, dataBranches]);

  const counters = useMemo(() => ({
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
    ordersRefund: dataOrders?.refund || 0,
  }), [dataOrders]);

  const renderSMSMessageCard = () => {
    if (!showSMSMessage || !dataOrders?.msg_package) return null;

    return (
      <div className="w-full px-4 py-3 mb-6 bg-white border border-gray-300 shadow-lg rounded-xl">
        <div className="flex items-center justify-between pb-1 mb-4 border-b-2">
          <h3 className="text-xl font-TextFontSemiBold text-mainColor">
            {t("SMSPackage")}
          </h3>
        </div>

        <div className="flex flex-col w-full pb-2 gap-y-4">
          <div className="flex items-center justify-between w-full p-4 border-b-2 border-gray-300 shadow-md rounded-xl">
            <div className="flex flex-col items-start">
              <p className="text-gray-500 font-TextFontMedium">
                {t("AvailableMessages")}
              </p>
              <p className="text-lg font-TextFontSemiBold text-mainColor">
                {dataOrders.msg_package?.msg_number}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-gray-500 font-TextFontMedium">
                {t("ValidityPeriod")}
              </p>
              <div className="text-right">
                <p className="text-sm font-TextFontMedium text-mainColor">
                  {t("From")}: {dataOrders.msg_package?.from}
                </p>
                <p className="text-sm font-TextFontMedium text-mainColor">
                  {t("To")}: {dataOrders.msg_package?.to}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        {(loadingOrders || loadingChart) ? (
          <div className="flex items-center justify-center w-full min-h-[400px]">
            <LoaderLogin />
          </div>
        ) : (
          <div className="flex flex-col items-start justify-center w-full pb-28">
            {/* <div className="w-full px-2 md:px-6 pt-4">
              <SelectDateRangeSection typPage={'all'} />

              <div className="mt-6">
                <CartsOrderSection ordersNum={counters} />
              </div>
            </div> */}

            <div className="flex flex-col items-start justify-center w-full px-2 md:px-3 xl:px-6 gap-7 mt-5">

              {/* New Professional Dashboard */}
              <ProfessionalDashboard realData={dashboardRealData} />

              {/* Old Chart Restored to the bottom */}
              <div className="flex flex-col items-start justify-center w-full px-1 md:px-3 xl:px-6 gap-7 mt-12">
                <Chart
                  order_statistics={order_statistics}
                  earning_statistics={earning_statistics}
                  recent_orders={recent_orders}
                  orders={orders}
                />
                <div className="flex flex-wrap items-center justify-between w-full gap-5">
                  {renderSMSMessageCard()}

                  <FooterCard title={t("TopSellingProducts")} link="/dashboard/setup_product/product" layout={"TopSelling"} topCustomers={topCustomers} topSelling={topSelling} offers={offers} />
                  {/* <FooterCard title={t("Deals")} link="/dashboard/deals" layout={"Deals"} topCustomers={topCustomers} topSelling={topSelling} offers={offers} /> */}
                  <FooterCard title={t("TopCustomer")} link="/dashboard/users/customers" layout={"default"} topCustomers={topCustomers} topSelling={topSelling} offers={offers} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;