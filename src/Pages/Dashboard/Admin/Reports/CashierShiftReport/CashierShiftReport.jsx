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
    url: selectedShiftId ? `${apiUrl}/admin/reports/cashier_report/${selectedShiftId}` : null,
    skip: !selectedShiftId,
  });

  const [shifts, setShifts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [shiftDetails, setShiftDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 20;
  const totalPages = Math.ceil(shifts.length / shiftsPerPage);
  const currentShifts = shifts.slice((currentPage - 1) * shiftsPerPage, currentPage * shiftsPerPage);

  useEffect(() => {
    if (selectedShiftId) refetchOrder();
  }, [selectedShiftId, refetchOrder]);

  useEffect(() => {
    if (dataOrder) {
      setShiftDetails(dataOrder);
    }
  }, [dataOrder]);

  useEffect(() => {
    if (response && !loadingPost) {
      setShifts(response.data?.cashier_shifts || []);
    }
  }, [response]);

  const handleGenerateReport = () => {
    if (fromDate && toDate) {
      postData({ start_date: fromDate, end_date: toDate });
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
    return new Date(dateString).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="p-6 w-full space-y-8">
      <h1 className="text-3xl font-bold text-mainColor">Cashier Shift Report</h1>

      {/* Date Filters */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DateInput placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} borderColor="mainColor" />
          <DateInput placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} borderColor="mainColor" />
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={!fromDate || !toDate}
          className={`px-8 py-3 rounded-lg font-medium transition ${fromDate && toDate
            ? "bg-mainColor text-white hover:bg-opacity-90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Generate Report
        </button>
      </div>

      {/* Shifts Table */}
      {loadingPost ? (
        <p className="text-center text-gray-600">Loading shifts...</p>
      ) : shifts.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-mainColor text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Cashier</th>
                <th className="py-3 px-4 text-left">Shift #</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentShifts.map((shift, index) => (
                <tr key={shift.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{(currentPage - 1) * shiftsPerPage + index + 1}</td>
                  <td className="py-3 px-4 font-medium">
                    {shift.cashier_man?.user_name || "N/A"} ({shift.cashier_man?.role || "N/A"})
                  </td>
                  <td className="py-3 px-4">{shift.cashier_man?.shift_number || "N/A"}</td>
                  <td className="py-3 px-4">{formatDate(shift.start_time)}</td>
                  <td className="py-3 px-4">{formatDate(shift.end_time) || "Ongoing"}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewOrders(shift.id)}
                      className="text-mainColor font-medium hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4 border-t">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${currentPage === page ? "bg-mainColor text-white" : "bg-gray-200"}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : response && shifts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No shifts found for selected date range.</p>
      ) : null}

      {/* Modal - Shift Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-mainColor">Shift Details #{selectedShiftId}</h2>
              <button onClick={closeModal} className="text-3xl text-gray-500 hover:text-gray-800">×</button>
            </div>

            <div className="p-6 space-y-8">
              {loadingOrder ? (
                <p className="text-center text-gray-600 text-lg">Loading shift details...</p>
              ) : shiftDetails ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">{shiftDetails.order_count || 0}</p>
                    </div>
                    <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900">{(shiftDetails.total_amount || 0).toFixed(2)} EGP</p>
                    </div>
                    <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-900">{shiftDetails.expenses_total || 0} EGP</p>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">Net Balance</p>
                      <p className={`text-2xl font-bold ${(shiftDetails.total_amount - (shiftDetails.expenses_total || 0)) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {((shiftDetails.total_amount || 0) - (shiftDetails.expenses_total || 0)).toFixed(2)} EGP
                      </p>
                    </div>
                  </div>

                  {/* Financial Accounts Breakdown */}
                  {shiftDetails.financial_accounts && shiftDetails.financial_accounts.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <h3 className="text-xl font-bold p-4 bg-mainColor text-white">Financial Accounts Summary</h3>
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left">Account</th>
                            <th className="px-4 py-3 text-right">Delivery</th>
                            <th className="px-4 py-3 text-right">Take Away</th>
                            <th className="px-4 py-3 text-right">Dine In</th>
                            <th className="px-4 py-3 text-right font-bold">Net</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shiftDetails.financial_accounts.map(acc => {
                            const net = (acc.total_amount_delivery || 0) + (acc.total_amount_take_away || 0) + (acc.total_amount_dine_in || 0);
                            return (
                              <tr key={acc.financial_id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{acc.financial_name}</td>
                                <td className={`px-4 py-3 text-right ${acc.total_amount_delivery < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {acc.total_amount_delivery.toFixed(2)}
                                </td>
                                <td className={`px-4 py-3 text-right ${acc.total_amount_take_away < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {acc.total_amount_take_away.toFixed(2)}
                                </td>
                                <td className={`px-4 py-3 text-right ${acc.total_amount_dine_in < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {acc.total_amount_dine_in.toFixed(2)}
                                </td>
                                <td className={`px-4 py-3 text-right font-bold ${net < 0 ? 'text-red-700' : 'text-green-700'}`}>
                                  {net.toFixed(2)} EGP
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Expenses */}
                  {shiftDetails.expenses && shiftDetails.expenses.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                      <h3 className="text-xl font-bold text-red-800 mb-4">Expenses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {shiftDetails.expenses.map((exp, i) => (
                          <div key={i} className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Account</p>
                            <p className="font-bold text-lg">{exp.financial_account}</p>
                            <p className="text-2xl font-bold text-red-700">{exp.total} EGP</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Online Orders - Paid vs Unpaid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="text-xl font-bold text-green-800 mb-4">Paid Online Orders</h3>
                      {shiftDetails.online_order?.paid?.length > 0 ? (
                        shiftDetails.online_order.paid.map((p, i) => (
                          <div key={i} className="bg-white p-4 rounded mb-3 shadow">
                            <div className="flex justify-between">
                              <span className="font-medium capitalize">{p.payment_method}</span>
                              <span className="font-bold text-green-700">{p.amount.toFixed(2)} EGP</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-center py-8">No paid online orders</p>
                      )}
                    </div>

                    <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                      <h3 className="text-xl font-bold text-orange-800 mb-4">Unpaid / Cash on Delivery</h3>
                      {shiftDetails.online_order?.un_paid?.length > 0 ? (
                        shiftDetails.online_order.un_paid.map((u, i) => (
                          <div key={i} className="bg-white p-4 rounded mb-3 shadow">
                            <div className="flex justify-between">
                              <span className="font-medium capitalize">{u.payment_method}</span>
                              <span className="font-bold text-orange-700">{u.amount.toFixed(2)} EGP</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-center py-8">No unpaid orders</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 text-lg">No details available for this shift.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierShiftReport;