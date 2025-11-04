import React, { useEffect, useState } from "react";
import { usePost } from "../../../../../Hooks/usePostJson";
import { DateInput } from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";

const CashierShiftReport = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/reports/cashier_reports` });
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const { refetch: refetchOrder, loading: loadingOrder, data: dataOrder } = useGet({
    url: selectedShiftId ? `${apiUrl}/admin/reports/shift_cashier_reports/${selectedShiftId}` : null,
    skip: !selectedShiftId,
  });
  const [shifts, setShifts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [shiftDetails, setShiftDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const shiftPerPage = 20; // Limit to 20 shift per page

  // Calculate total number of pages
  const totalPages = Math.ceil(shifts.length / shiftPerPage);

  // Get the shift for the current page
  const currentShifts = shifts.slice(
    (currentPage - 1) * shiftPerPage,
    currentPage * shiftPerPage
  );

  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (selectedShiftId) {
      refetchOrder();
    }
  }, [selectedShiftId, refetchOrder]);

  useEffect(() => {
    if (dataOrder && dataOrder.shifts_data) {
      setShiftDetails(dataOrder.shifts_data);
    }
  }, [dataOrder]);

  useEffect(() => {
    if (response && !loadingPost) {
      setShifts(response.data?.cashier_shifts);
    }
  }, [response]);

  const handleGenerateReport = () => {
    if (fromDate && toDate) {
      postData({ start_date: fromDate, end_date: toDate });
      setIsModalOpen(false);
    }
  };

  const handleViewOrders = (shiftId) => {
    setSelectedShiftId(shiftId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShiftId(null);
    setShiftDetails(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 w-full mb-20">
      <h1 className="text-2xl font-bold mb-4 text-mainColor">Cashier Shift Report</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <DateInput
          placeholder="From Date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          required={true}
          minDate={false} // No minimum date restriction
          maxDate={toDate || false} // Restrict to toDate if selected, else no restriction
          borderColor="mainColor"
          className="w-full"
        />
        <DateInput
          placeholder="To Date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          required={true}
          minDate={fromDate || false} // Restrict to fromDate if selected, else no restriction
          maxDate={true} // Restrict to current date
          borderColor="mainColor"
          className="w-full"
        />
      </div>
      <button
        onClick={handleGenerateReport}
        disabled={!fromDate || !toDate}
        className={`px-4 py-2 rounded ${fromDate && toDate
          ? "bg-mainColor text-white hover:bg-opacity-90"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Generate Report
      </button>
      {loadingPost && <p className="text-center text-gray-500 mt-4">Loading report data...</p>}
      {shifts && Array.isArray(shifts) && shifts.length > 0 ? (
        <div className="flex flex-col w-full">
          <div className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-mainColor text-white">
                  <th className="py-2 px-4 border-b">Shift</th>
                  <th className="py-2 px-4 border-b">Cashier</th>
                  <th className="py-2 px-4 border-b">Shift Number</th>
                  <th className="py-2 px-4 border-b">Start Time</th>
                  <th className="py-2 px-4 border-b">End Time</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentShifts.map((shift, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{(currentPage - 1) * shiftPerPage + index + 1}</td>
                    <td className="py-2 px-4 border-b">
                      {shift.cashier_man?.user_name || "N/A"} ({shift.cashier_man?.role || "N/A"})
                    </td>
                    <td className="py-2 px-4 border-b">{shift.cashier_man?.shift_number || "N/A"}</td>
                    <td className="py-2 px-4 border-b">{formatDate(shift.start_time)}</td>
                    <td className="py-2 px-4 border-b">{formatDate(shift.end_time)}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleViewOrders(shift.id)}
                        className="text-mainColor hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {shifts.length > 0 && (
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
                    className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page
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
      ) : response && response.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No shift data found for the selected date range.</p>
      ) : null}
      {!fromDate || !toDate ? (
        <p className="text-center text-gray-500 mt-4">
          Please select both From Date and To Date to fetch the report.
        </p>
      ) : null}

      {/* Modal for Shift Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-mainColor">Details for Shift #{selectedShiftId}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ×
              </button>
            </div>
            {loadingOrder ? (
              <p className="text-center text-gray-500">Loading shift details...</p>
            ) : shiftDetails ? (
              <div className="p-4">
                {/* Shift Information */}
                <h3 className="text-lg text-mainColor font-semibold mb-2">Shift Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><strong>Shift ID:</strong> {shiftDetails.shift || "N/A"}</div>
                  <div><strong>Start Time:</strong> {formatDate(shiftDetails.start_time)}</div>
                  <div><strong>End Time:</strong> {formatDate(shiftDetails.end_time)}</div>
                  <div><strong>Total Orders:</strong> {shiftDetails.total_amount_orders || 0}</div>
                  <div><strong>Orders Count:</strong> {shiftDetails.orders_count || 0}</div>
                  <div><strong>Products Items Count:</strong> {shiftDetails.products_items_count || 0}</div>
                  <div><strong>Average Order:</strong> {shiftDetails.avarage_order || 0}</div>
                </div>

                {/* Cashier Information */}
                <h3 className="text-lg text-mainColor font-semibold mb-2">Cashier Information</h3>
                {shiftDetails.cashier_men.map((man,index)=>(
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><strong>Cashier Name:</strong> {man.cashier_man || "N/A"}</div>
                    <div><strong>Total Order:</strong> {man.total_orders || "N/A"}</div>
                    <div><strong>Branch Name:</strong> {man.branch || "N/A"}</div>
                  </div>
                // ) : (
                //   <p>No cashier information available.</p>
                ))}

                {/* Financial Account Total */}
                <h3 className="text-lg text-mainColor font-semibold mb-2">Financial Account Total</h3>
                {shiftDetails.financial_account_total && shiftDetails.financial_account_total.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-200 mb-4">
                    <thead>
                      <tr className="bg-mainColor text-white">
                        <th className="py-2 px-4 border-b">Financial Account</th>
                        <th className="py-2 px-4 border-b">Amount</th>
                        <th className="py-2 px-4 border-b">Orders Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftDetails.financial_account_total.map((account, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{account.financial_account || "N/A"}</td>
                          <td className="py-2 px-4 border-b">{account.amount || 0}</td>
                          <td className="py-2 px-4 border-b">{account.orders?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No financial account total data available.</p>
                )}

                {/* Orders */}
                <h3 className="text-lg text-mainColor font-semibold mb-2">Orders</h3>
                {shiftDetails.orders && shiftDetails.orders.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-200 mb-4">
                    <thead>
                      <tr className="bg-mainColor text-white">
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Order Number</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftDetails.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{order.id}</td>
                          <td className="py-2 px-4 border-b">{order.order_number}</td>
                          <td className="py-2 px-4 border-b">{order.order_type}</td>
                          <td className="py-2 px-4 border-b">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No orders found for this shift.</p>
                )}

                {/* Product Items */}
                <h3 className="text-lg text-mainColor font-semibold mb-2">Product Items</h3>
                {shiftDetails.product_items && shiftDetails.product_items.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-mainColor text-white">
                        <th className="py-2 px-4 border-b">Product ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftDetails.product_items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{item.product_id || "N/A"}</td>
                          <td className="py-2 px-4 border-b">{item.product_item || "N/A"}</td>
                          <td className="py-2 px-4 border-b">{item.count || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No product items found for this shift.</p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No details found for this shift.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierShiftReport;