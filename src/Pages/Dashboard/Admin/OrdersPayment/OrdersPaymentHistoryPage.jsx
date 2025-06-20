import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../Assets/Icons/AllIcons";
import { Link } from "react-router-dom";
import { useGet } from "../../../../Hooks/useGet";
import { LoaderLogin } from "../../../../Components/Components";
import { useTranslation } from "react-i18next";

const OrdersPaymentHistory = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchOrdersPaymentHistory,
    loading: loadingOrdersPaymentHistory,
    data: dataOrdersPaymentHistory,
  } = useGet({
    url: `${apiUrl}/admin/payment/history`,
  });
  const [ordersPaymentHistory, setOrdersPaymentHistory] = useState([]);

  // Fetch Orders Payment History when the component mounts or when refetch is called
  useEffect(() => {
    refetchOrdersPaymentHistory();
  }, [refetchOrdersPaymentHistory]); // Empty dependency array to only call refetch once on mount
  const { t, i18n } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const ordersPaymentHistoryPerPage = 20; // Limit to 20 ordersPaymentHistory per page

  // Calculate total number of pages
  const totalPages = Math.ceil(
    ordersPaymentHistory.length / ordersPaymentHistoryPerPage
  );

  // Get the ordersPaymentHistory for the current page
  const currentOrdersPaymentHistory = ordersPaymentHistory.slice(
    (currentPage - 1) * ordersPaymentHistoryPerPage,
    currentPage * ordersPaymentHistoryPerPage
  );

  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Update OrdersPayment History when `data` changes
  useEffect(() => {
    if (dataOrdersPaymentHistory && dataOrdersPaymentHistory.orders) {
      setOrdersPaymentHistory(dataOrdersPaymentHistory.orders);
    }
    console.log("OrdersPaymentHistory", ordersPaymentHistory);
  }, [dataOrdersPaymentHistory]); // Only run this effect when `data` changes

   const headers = [
    t('SL'),
    t('Name'),
    t('Phone'),
    t('TotalOrder'),
    t('Resipt'),
    t('OrderNum'),
    t('OrderDate'),
    t('Price'),
    t('Tax')
  ];
  return (
    <div className="flex items-start justify-start w-full overflow-x-scroll pb-28 scrollSection">
      {loadingOrdersPaymentHistory ? (
        <>
          <div className="mx-auto">
            <LoaderLogin />
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full">
          <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
            <thead className="w-full">
              <tr className="w-full border-b-2">
                {headers.map((name, index) => (
                  <th
                    className="min-w-[120px] sm:w-[8%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3"
                    key={index}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-full">
              {ordersPaymentHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-xl text-center text-mainColor font-TextFontMedium"
                  >
                    {t("NotFindOrdersPaymenthistory")}
                  </td>
                </tr>
              ) : (
                currentOrdersPaymentHistory.map(
                  (
                    paymentHistory,
                    index // Example with two rows
                  ) => (
                    <tr className="w-full border-b-2" key={index}>
                      <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {(currentPage - 1) * ordersPaymentHistoryPerPage +
                          index +
                          1}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory?.user?.name || "-"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory?.user?.phone || "-"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory?.user?.order_amount || "-"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        <div className="flex justify-center">
                          <img
                            src={paymentHistory?.receipt_link}
                            className="border-2 rounded-full bg-mainColor border-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                            alt="Photo"
                          />
                        </div>
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory?.order_number || "-"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory?.order_date ? (
                          <>
                            {paymentHistory.order_date}
                            <br />
                            {paymentHistory.date}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory?.amount || "0"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {paymentHistory.tax?.amount || "0"}
                        {paymentHistory.tax?.type === "precentage" && " %"}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
          {ordersPaymentHistory.length > 0 && (
            <div className="flex flex-wrap items-center justify-center my-6 gap-x-4">
              {currentPage !== 1 && (
                <button
                  type="button"
                  className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  {t("Prev")}
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px - 4 py - 2 mx - 1 text - lg font - TextFontSemiBold rounded - full duration - 300 ${
                      currentPage === page
                        ? "bg-mainColor text-white"
                        : " text-mainColor"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              {totalPages !== currentPage && (
                <button
                  type="button"
                  className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {t("Next")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPaymentHistory;
