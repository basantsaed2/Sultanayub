import { useEffect, useState } from "react";
import { usePost } from "../../../../../Hooks/usePostJson";
import { DateInput } from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import { FaPrint } from "react-icons/fa";

// ===================================================================
// Receipt Formatting Function for Shift Report
// ===================================================================
const formatShiftReceipt = (shiftData, detailsData, t, isRtl) => {
  const formatCurrency = (value) => Number(value || 0).toFixed(2);

  return `
    <div class="receipt-only" dir="${isRtl ? 'rtl' : 'ltr'}">
      <style>
        @page { 
            size: 80mm auto; 
            margin: 0mm; 
        }

        .receipt-only {
            width: 80mm; 
            font-family: sans-serif;
            color: #000;
            background: #fff;
            padding: 3px;
            font-size: 9px; 
        }

        .receipt-only * { 
            box-sizing: border-box; 
        }
        
        .receipt-only .header { 
          text-align: center; 
          margin-bottom: 3px; 
          border-bottom: 2px solid #000; 
          padding-bottom: 3px;
        }
        
        .receipt-only .header h1 { 
          font-size: 12px; 
          font-weight: bold; 
          margin: 0; 
        }
        
        .receipt-only .header p { 
          font-size: 8px; 
          margin: 1px 0 0 0; 
        }
        
        .receipt-only .section-title { 
          font-weight: bold; 
          border-top: 1px solid #000;
          margin-top: 2px;
          margin-bottom: 1px;
          padding-top: 1px;
          display: block;
          font-size: 9px;
        }
        
        .receipt-only .info-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 1px; 
          font-size: 8px;
        }
        
        .receipt-only .info-label { 
          font-weight: bold; 
          flex: 0 0 50%;
        }

        .receipt-only .info-value {
          flex: 0 0 50%;
          text-align: right;
        }

        .receipt-only table { 
          width: 100%; 
          font-size: 8px; 
          border-collapse: collapse; 
          margin: 1px 0;
        }
        
        .receipt-only th { 
          border-bottom: 1px solid #000 !important; 
          padding: 1px 0; 
          text-align: center; 
          font-weight: bold; 
          background: transparent;
          font-size: 8px; 
        }
        
        .receipt-only td { 
          border: none; 
          padding: 1px 1px; 
          font-size: 8px;
        }

        .receipt-only .text-left {
          text-align: left;
        }

        .receipt-only .text-right {
          text-align: right;
        }

        .receipt-only .text-center {
          text-align: center;
        }
        
        .receipt-only .footer { 
          text-align: center; 
          font-size: 8px; 
          margin-top: 2px; 
          padding-top: 1px;
          border-top: 1px solid #000; 
        }

        .receipt-only .amount-positive {
          color: #27ae60;
          font-weight: bold;
        }

        .receipt-only .amount-negative {
          color: #e74c3c;
          font-weight: bold;
        }

        .receipt-only .module-table {
          width: 100%;
          font-size: 7px;
          border-collapse: collapse;
          margin: 1px 0;
        }

        .receipt-only .module-table td {
          padding: 1px 2px;
          border-right: 1px solid #ddd;
        }

        .receipt-only .module-table td:last-child {
          border-right: none;
        }

        .receipt-only .module-header {
          background-color: #f0f0f0;
          font-weight: bold;
          border-bottom: 1px solid #000;
        }

        .receipt-only .module-row {
          border-bottom: 1px dotted #ccc;
        }

        .receipt-only .account-name {
          font-weight: bold;
          font-size: 8px;
          padding: 2px 0;
        }
      </style>

      <div class="header">
        <h1>${t("Shift Report")}</h1>
        <p>${t("Complete Cashier Summary")}</p>
      </div>

      <div class="info-section">
        <span class="section-title">CASHIER INFO</span>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${shiftData.cashier_man?.user_name || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Role:</span>
          <span class="info-value">${shiftData.cashier_man?.role || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Shift #:</span>
          <span class="info-value">${shiftData.cashier_man?.shift_number || "N/A"}</span>
        </div>
      </div>

      <div class="info-section">
        <span class="section-title">TIMING</span>
        <div class="info-row">
          <span class="info-label">Start:</span>
          <span class="info-value">${new Date(shiftData.start_time).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">End:</span>
          <span class="info-value">${shiftData.end_time ? new Date(shiftData.end_time).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }) : "Ongoing"}</span>
        </div>
      </div>

      <div class="info-section">
        <span class="section-title">SHIFT DETAILS</span>
        <div class="info-row">
          <span class="info-label">Free Discount:</span>
          <span class="info-value">${shiftData.free_discount || 0}</span>
        </div>
      </div>

      ${detailsData && detailsData.order_count !== undefined ? `
        <div class="info-section">
          <span class="section-title">SUMMARY</span>
          <div class="info-row">
            <span class="info-label">Order Count:</span>
            <span class="info-value">${detailsData.order_count || 0}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Total Amount:</span>
            <span class="info-value ${detailsData.total_amount < 0 ? 'amount-negative' : 'amount-positive'}">${formatCurrency(detailsData.total_amount || 0)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Expenses Total:</span>
            <span class="info-value amount-negative">-${formatCurrency(detailsData.expenses_total || 0)}</span>
          </div>
        </div>

        ${detailsData.financial_accounts && detailsData.financial_accounts.length > 0 ? `
          <span class="section-title">PAYMENT METHODS BY MODULE</span>
          ${detailsData.financial_accounts.map(acc => {
            const net = (acc.total_amount_delivery || 0) + (acc.total_amount_take_away || 0) + (acc.total_amount_dine_in || 0);
            return `
              <div style="margin-bottom: 2px; border: 1px solid #ddd; padding: 2px;">
                <div class="account-name">${acc.financial_name}</div>
                <table class="module-table">
                  <tr class="module-header">
                    <td style="text-align: center;">Delivery</td>
                    <td style="text-align: center;">Take Away</td>
                    <td style="text-align: center;">Dine In</td>
                    <td style="text-align: center; font-weight: bold;">Total</td>
                  </tr>
                  <tr class="module-row">
                    <td style="text-align: center; ${acc.total_amount_delivery < 0 ? 'color: #e74c3c;' : 'color: #27ae60;'} font-weight: bold;">${formatCurrency(acc.total_amount_delivery || 0)}</td>
                    <td style="text-align: center; ${acc.total_amount_take_away < 0 ? 'color: #e74c3c;' : 'color: #27ae60;'} font-weight: bold;">${formatCurrency(acc.total_amount_take_away || 0)}</td>
                    <td style="text-align: center; ${acc.total_amount_dine_in < 0 ? 'color: #e74c3c;' : 'color: #27ae60;'} font-weight: bold;">${formatCurrency(acc.total_amount_dine_in || 0)}</td>
                    <td style="text-align: center; ${net < 0 ? 'color: #e74c3c;' : 'color: #27ae60;'} font-weight: bold;">${formatCurrency(net)}</td>
                  </tr>
                </table>
              </div>
            `;
          }).join('')}
        ` : ''}

        ${detailsData.expenses && detailsData.expenses.length > 0 ? `
          <span class="section-title">EXPENSES BREAKDOWN</span>
          <table>
            <tbody>
              ${detailsData.expenses.map(exp => `
                <tr>
                  <td class="text-left">${exp.financial_account}</td>
                  <td class="text-right amount-negative">-${formatCurrency(exp.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        ${detailsData.online_order && (detailsData.online_order.paid?.length > 0 || detailsData.online_order.un_paid?.length > 0) ? `
          <span class="section-title">ONLINE ORDERS - PAID</span>
          ${detailsData.online_order.paid && detailsData.online_order.paid.length > 0 ? `
            <table>
              <tbody>
                ${detailsData.online_order.paid.map(p => `
                  <tr>
                    <td class="text-left">${p.payment_method}</td>
                    <td class="text-right amount-positive">${formatCurrency(p.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p style="font-size: 8px; text-align: center;">No paid orders</p>'}

          <span class="section-title">ONLINE ORDERS - UNPAID/COD</span>
          ${detailsData.online_order.un_paid && detailsData.online_order.un_paid.length > 0 ? `
            <table>
              <tbody>
                ${detailsData.online_order.un_paid.map(u => `
                  <tr>
                    <td class="text-left">${u.payment_method}</td>
                    <td class="text-right">${formatCurrency(u.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p style="font-size: 8px; text-align: center;">No unpaid orders</p>'}
        ` : ''}
      ` : ''}

      <div class="footer">
        <div>${new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}</div>
      </div>
    </div>
  `;
};

const CashierShiftReport = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/reports/cashier_reports` });
  const { t, i18n } = useTranslation();

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
  const [isPrinting, setIsPrinting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 15;
  const totalPages = Math.ceil(shifts.length / shiftsPerPage);
  const currentShifts = shifts.slice((currentPage - 1) * shiftsPerPage, currentPage * shiftsPerPage);

  useEffect(() => {
    if (selectedShiftId) refetchOrder();
  }, [selectedShiftId, refetchOrder]);

  useEffect(() => {
    if (dataOrder) {
      setShiftDetails(dataOrder);
      // If printing, print now and reset
      if (isPrinting) {
        const shiftToPrint = shifts.find(s => s.id === selectedShiftId);
        if (shiftToPrint) {
          const isRtl = i18n?.language === 'ar';
          const receiptHtml = formatShiftReceipt(shiftToPrint, dataOrder, t, isRtl);
          
          // Open print window
          const pw = window.open("", "", "width=500,height=600");
          if (pw) {
            pw.document.write("<html><head><title>Shift Report</title></head><body style='margin:0; padding:0;'>");
            pw.document.write(receiptHtml);
            pw.document.write("</body></html>");
            pw.document.close();
            setTimeout(() => { pw.focus(); pw.print(); pw.close(); }, 500);
          }
          setIsPrinting(false);
        }
      }
    }
  }, [dataOrder, isPrinting, selectedShiftId, shifts, t, i18n?.language]);

  useEffect(() => {
    if (response && !loadingPost) {
      setShifts(response.data?.cashier_shifts || []);
    }
  }, [response, loadingPost]);

  const handleGenerateReport = () => {
    if (fromDate) {
      
      const payload = {
        start_date: fromDate,
      }
      if(toDate){
        payload.end_date = toDate;
      }
      postData(payload);
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

  const handlePrintShift = (shiftId) => {
    // Set flag to print after data loads
    setIsPrinting(true);
    // Set the selected shift ID to trigger the useGet hook
    setSelectedShiftId(shiftId);
  };

  return (
    <div className="w-full p-1 space-y-4 p- md:p-6 md:space-y-8">
      <h1 className="text-2xl font-bold md:text-3xl text-mainColor">{t("Cashier Shift Report")}</h1>

      {/* Date Filters */}
      <div className="p-2 rounded-lg shadow-sm md:p-6 bg-gray-50">
        <div className="grid grid-cols-1 gap-3 mb-3 md:gap-6 md:mb-6 md:grid-cols-2">
          <DateInput placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} borderColor="mainColor" />
          <DateInput placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} borderColor="mainColor" />
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={!fromDate}
          className={`w-full md:w-auto px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium transition text-sm md:text-base ${fromDate
            ? "bg-mainColor text-white hover:bg-opacity-90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {t("Generate Report")}
        </button>
      </div>

      {/* Shifts Table */}
      {loadingPost ? (
        <p className="text-center text-gray-600">{t("Loading shifts...")}</p>
      ) : shifts.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 text-white bg-mainColor">
              <tr>
                <th className="px-2 py-2 text-xs text-left md:px-4 md:py-3 md:text-sm">#</th>
                <th className="px-2 py-2 text-xs text-left md:px-4 md:py-3 md:text-sm">{t("Cashier")}</th>
                <th className="hidden px-2 py-2 text-xs text-left md:px-4 md:py-3 md:text-sm sm:table-cell">{t("Shift #")}</th>
                <th className="px-2 py-2 text-xs text-left md:px-4 md:py-3 md:text-sm">{t("Start")}</th>
                <th className="hidden px-2 py-2 text-xs text-left md:px-4 md:py-3 md:text-sm md:table-cell">{t("End")}</th>
                <th className="px-2 py-2 text-xs text-left md:px-4 md:py-3 md:text-sm">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {currentShifts.map((shift, index) => (
                <tr key={shift.id} className="text-xs border-t hover:bg-gray-50 md:text-sm">
                  <td className="px-2 py-2 md:px-4 md:py-3">{(currentPage - 1) * shiftsPerPage + index + 1}</td>
                  <td className="px-2 py-2 font-medium md:px-4 md:py-3">
                    <div>{shift.cashier_man?.user_name || "N/A"}</div>
                    <div className="text-xs text-gray-600">{shift.cashier_man?.role || "N/A"}</div>
                  </td>
                  <td className="hidden px-2 py-2 md:px-4 md:py-3 sm:table-cell">{shift.cashier_man?.shift_number || "N/A"}</td>
                  <td className="px-2 py-2 text-xs md:px-4 md:py-3">{formatDate(shift.start_time)}</td>
                  <td className="hidden px-2 py-2 text-xs md:px-4 md:py-3 md:table-cell">{formatDate(shift.end_time) || "Ongoing"}</td>
                  <td className="px-2 py-2 md:px-4 md:py-3">
                    <div className="flex flex-col gap-1 md:gap-2 sm:flex-row">
                      <button
                        onClick={() => handleViewOrders(shift.id)}
                        className="px-2 py-1 text-xs font-medium text-mainColor hover:underline md:text-sm"
                      >
                        {t("View")}
                      </button>
                      <button
                        onClick={() => handlePrintShift(shift.id)}
                        title={t("Print Shift")}
                        className="p-1 text-white rounded md:p-2 bg-mainColor hover:bg-opacity-90"
                      >
                        <FaPrint size={14} className="md:w-4 md:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-1 px-2 py-2 border-t md:gap-2 md:py-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs bg-gray-200 rounded md:px-4 md:py-2 disabled:opacity-50 md:text-sm"
              >
                {t("Prev")}
              </button>
              
              {/* Pagination Numbers with Ellipsis */}
              {totalPages <= 10 ? (
                // Show all pages if 10 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm ${currentPage === page ? "bg-mainColor text-white" : "bg-gray-200"}`}
                  >
                    {page}
                  </button>
                ))
              ) : (
                // Show with ellipsis if more than 10 pages
                <>
                  {/* First page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm ${currentPage === 1 ? "bg-mainColor text-white" : "bg-gray-200"}`}
                  >
                    1
                  </button>
                  
                  {/* Left ellipsis */}
                  {currentPage > 4 && (
                    <span className="px-2 py-2">...</span>
                  )}
                  
                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (page === 1 || page === totalPages) return false;
                      return Math.abs(page - currentPage) <= 2;
                    })
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm ${currentPage === page ? "bg-mainColor text-white" : "bg-gray-200"}`}
                      >
                        {page}
                      </button>
                    ))}
                  
                  {/* Right ellipsis */}
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 py-2">...</span>
                  )}
                  
                  {/* Last page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm ${currentPage === totalPages ? "bg-mainColor text-white" : "bg-gray-200"}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs bg-gray-200 rounded md:px-4 md:py-2 disabled:opacity-50 md:text-sm"
              >
                {t("Next")}
              </button>
            </div>
          )}
        </div>
      ) : response && shifts.length === 0 ? (
        <p className="text-lg text-center text-gray-500">{t("No shifts found for selected date range")}</p>
      ) : null}

      {/* Modal - Shift Details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black md:p-4 bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-3 bg-white border-b md:p-6">
              <h2 className="text-lg font-bold md:text-2xl text-mainColor">{t("Shift Details")} #{selectedShiftId}</h2>
              <button onClick={closeModal} className="text-2xl text-gray-500 md:text-3xl hover:text-gray-800">×</button>
            </div>

            <div className="p-3 space-y-4 md:p-6 md:space-y-8">
              {loadingOrder ? (
                <p className="text-lg text-center text-gray-600">{t("Loading shift details...")}</p>
              ) : shiftDetails ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-2 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    <div className="p-3 border border-blue-200 rounded-lg md:p-5 bg-blue-50">
                      <p className="text-xs text-blue-800 md:text-sm">{t("Total Orders")}</p>
                      <p className="text-lg font-bold text-blue-900 md:text-2xl">{shiftDetails.order_count || 0}</p>
                    </div>
                    <div className="p-3 border border-green-200 rounded-lg md:p-5 bg-green-50">
                      <p className="text-xs text-green-800 md:text-sm">{t("Total Revenue")}</p>
                      <p className="text-lg font-bold text-green-900 md:text-2xl">{(shiftDetails.total_amount || 0).toFixed(2)} EGP</p>
                    </div>
                    <div className="p-3 border border-red-200 rounded-lg md:p-5 bg-red-50">
                      <p className="text-xs text-red-800 md:text-sm">{t("Total Expenses")}</p>
                      <p className="text-lg font-bold text-red-900 md:text-2xl">{shiftDetails.expenses_total || 0} {t("EGP")}</p>
                    </div>
                    <div className="p-3 border border-purple-200 rounded-lg md:p-5 bg-purple-50">
                      <p className="text-xs text-purple-800 md:text-sm">{t("Net Balance")}</p>
                      <p className={`text-lg md:text-2xl font-bold ${(shiftDetails.total_amount - (shiftDetails.expenses_total || 0)) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {((shiftDetails.total_amount || 0) - (shiftDetails.expenses_total || 0)).toFixed(2)} {t("EGP")}
                      </p>
                    </div>
                  </div>

                  {/* Financial Accounts Breakdown */}
                  {shiftDetails.financial_accounts && shiftDetails.financial_accounts.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                      <h3 className="p-3 text-base font-bold text-white md:p-4 md:text-xl bg-mainColor">{t("Financial Accounts Summary")}</h3>
                      <table className="w-full text-sm">
                        <thead className="text-xs bg-gray-100 md:text-sm">
                          <tr>
                            <th className="px-2 py-2 text-left md:px-4 md:py-3">{t("Account")}</th>
                            <th className="hidden px-2 py-2 text-right md:px-4 md:py-3 sm:table-cell">{t("Delivery")}</th>
                            <th className="hidden px-2 py-2 text-right md:px-4 md:py-3 md:table-cell">{t("Take Away")}</th>
                            <th className="px-4 py-3 text-right">{t("Dine In")}</th>
                            <th className="px-4 py-3 font-bold text-right">{t("Net")}</th>
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
                                  {net.toFixed(2)} {t("EGP")}
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
                    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="mb-4 text-xl font-bold text-red-800">{t("Expenses")}</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {shiftDetails.expenses.map((exp, i) => (
                          <div key={i} className="p-4 bg-white rounded-lg shadow">
                            <p className="text-sm text-gray-600">{t("Account")}</p>
                            <p className="text-lg font-bold">{exp.financial_account}</p>
                            <p className="text-2xl font-bold text-red-700">{exp.total} {t("EGP")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Online Orders - Paid vs Unpaid */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="p-6 border border-green-200 rounded-lg bg-green-50">
                      <h3 className="mb-4 text-xl font-bold text-green-800">{t("Paid Online Orders")}</h3>
                      {shiftDetails.online_order?.paid?.length > 0 ? (
                        shiftDetails.online_order.paid.map((p, i) => (
                          <div key={i} className="p-4 mb-3 bg-white rounded shadow">
                            <div className="flex justify-between">
                              <span className="font-medium capitalize">{p.payment_method}</span>
                              <span className="font-bold text-green-700">{p.amount.toFixed(2)} {t("EGP")}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-8 text-center text-gray-600">{t("No paid online orders")}</p>
                      )}
                    </div>

                    <div className="p-6 border border-orange-200 rounded-lg bg-orange-50">
                      <h3 className="mb-4 text-xl font-bold text-orange-800">{t("Unpaid / Cash on Delivery")}</h3>
                      {shiftDetails.online_order?.un_paid?.length > 0 ? (
                        shiftDetails.online_order.un_paid.map((u, i) => (
                          <div key={i} className="p-4 mb-3 bg-white rounded shadow">
                            <div className="flex justify-between">
                              <span className="font-medium capitalize">{u.payment_method}</span>
                              <span className="font-bold text-orange-700">{u.amount.toFixed(2)} {t("EGP")}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-8 text-center text-gray-600">{t("No unpaid orders")}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-lg text-center text-gray-500">{t("No details available for this shift")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierShiftReport;