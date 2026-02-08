import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DateInput } from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaWallet, FaExclamationCircle } from "react-icons/fa";

/**
 * CashierShiftReport Component
 * 
 * Enhanced UI with pagination, glassmorphism, and smooth transitions.
 * Fetches summary report and detailed shift data via POST.
 */
const CashierShiftReport = () => {
    const { t } = useTranslation();
    const auth = useAuth();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // State for filters
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // State for report data
    const [reports, setReports] = useState([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State for row expansion and detailed data storage
    const [expandedDate, setExpandedDate] = useState(null);
    const [shiftsByDate, setShiftsByDate] = useState({});

    // usePost hook for the main reports summary
    const { postData: fetchReports, loadingPost: loadingReports, response: reportsResponse } = usePost({
        url: `${apiUrl}/admin/reports/cashier_reports`,
        type: true // application/json
    });

    // usePost hook for the shift detailed data
    const { postData: fetchShifts, loadingPost: loadingShifts, response: shiftsResponse } = usePost({
        url: `${apiUrl}/admin/reports/shifts_data`,
        type: true // application/json
    });

    // Update reports list when summary response changes
    useEffect(() => {
        if (reportsResponse?.data?.data) {
            // Filter out the summary row (null date) as requested by user
            const filteredReports = reportsResponse.data.data.filter(report => report.date);
            setReports(filteredReports);
            setCurrentPage(1); // Reset to first page on new data
        }
    }, [reportsResponse]);

    // Update shifts detailed data when shifts response changes
    useEffect(() => {
        if (shiftsResponse?.data?.data && expandedDate) {
            setShiftsByDate(prev => ({
                ...prev,
                [expandedDate]: shiftsResponse.data.data
            }));
        }
    }, [shiftsResponse, expandedDate]);

    // Pagination Logic
    const paginatedReports = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return reports.slice(start, start + itemsPerPage);
    }, [reports, currentPage]);

    const totalPages = Math.ceil(reports.length / itemsPerPage);

    const handleGenerateReport = async () => {
        const payload = {};
        if (fromDate) payload.from_date = fromDate;
        if (toDate) payload.to_date = toDate;

        await fetchReports(payload);

        // Reset expansion state when new report is generated
        setExpandedDate(null);
        setShiftsByDate({});
    };

    const toggleRow = async (date) => {
        if (!date) {
            auth.toastError(t("Cannot expand summary row without specific date"));
            return;
        }

        if (expandedDate === date) {
            setExpandedDate(null);
            return;
        }

        setExpandedDate(date);

        // If data for this date is not already fetched, fetch it
        if (!shiftsByDate[date]) {
            await fetchShifts({ date: date || "" });
        }
    };

    return (
        <div className="w-full min-h-screen p-2 md:p-4 space-y-8 bg-[#f8fafc]/50">
            {/* Header with Glassmorphism */}
            <div className="flex flex-col gap-2 p-2 md:p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white">
                <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <span className="p-2 md:p-3 bg-mainColor/10 rounded-xl text-mainColor">
                        <FaCalendarAlt size={24} />
                    </span>
                    {t("Cashier Shift Report")}
                </h1>
            </div>

            {/* Filters Section - Premium Design */}
            <div className="p-2 md:p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 transition-all hover:shadow-2xl hover:shadow-gray-200/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t("From Date")}</label>
                        <DateInput
                            placeholder={t("Select Date")}
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            borderColor="mainColor"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t("To Date")}</label>
                        <DateInput
                            placeholder={t("Select Date")}
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            borderColor="mainColor"
                        />
                    </div>
                </div>
                <div className="w-full flex mt-6">
                    <button
                        onClick={handleGenerateReport}
                        disabled={loadingReports}
                        className={`group relative flex items-center justify-center w-full sm:w-auto py-3.5 px-10 rounded-xl font-bold transition-all duration-300 transform active:scale-95 ${loadingReports
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-mainColor text-white hover:bg-mainColor/90 shadow-lg shadow-mainColor/25 hover:-translate-y-0.5"
                            }`}
                    >
                        {loadingReports ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                {t("Processing...")}
                            </div>
                        ) : (
                            <span className="flex items-center gap-2">
                                {t("Generate Report")}
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="px-8 py-6 font-bold text-gray-600 uppercase tracking-wider text-xs text-start">{t("Date")}</th>
                                <th className="px-6 py-6 font-bold text-gray-600 uppercase tracking-wider text-xs text-start">{t("Start Amount")}</th>
                                <th className="px-6 py-6 font-bold text-gray-600 uppercase tracking-wider text-xs text-start">{t("Total Orders")}</th>
                                <th className="px-6 py-6 font-bold text-gray-600 uppercase tracking-wider text-xs text-start">{t("Expenses")}</th>
                                <th className="px-6 py-6 font-bold text-gray-600 uppercase tracking-wider text-xs text-start">{t("Actual Total")}</th>
                                <th className="px-8 py-6 font-bold text-gray-600 uppercase tracking-wider text-xs text-start">{t("Actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loadingReports ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-mainColor/20 border-t-mainColor rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-medium animate-pulse">{t("Aggregating shift data... Please wait")}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : reports.length > 0 ? (
                                paginatedReports.map((report, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr
                                            className={`group transition-all duration-200 ${report.date ? 'cursor-pointer hover:bg-gray-50/80' : 'bg-gray-50/50 brightness-95'} ${expandedDate === report.date ? 'bg-mainColor/[0.03]' : ''}`}
                                            onClick={() => toggleRow(report.date)}
                                        >
                                            <td className="px-8 py-5 text-start">
                                                <div className="flex items-center gap-3">
                                                    {report.date ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-800">{report.date}</span>
                                                            <span className="text-[11px] text-gray-400 font-semibold uppercase">{t("Daily Summary")}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-mainColor italic font-bold">
                                                            <FaExclamationCircle />
                                                            <span>{t("Initial Aggregated Data")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-start font-medium text-gray-600 tabular-nums">
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{Number(report.start_amount || 0).toLocaleString()}</span>
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase letter-spacing-[1px]">{t("EGP")}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-start">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-green-600 text-sm">{Number(report.total_orders || 0).toLocaleString()}</span>
                                                    <span className="text-[9px] font-bold text-green-300 uppercase tabular-nums">{t("EGP")}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-start">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-red-500 text-sm">{Number(report.expenses || 0).toLocaleString()}</span>
                                                    <span className="text-[9px] font-bold text-red-300 uppercase tracking-tighter">{t("EGP")}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-start">
                                                <div className="inline-flex flex-col px-4 py-1.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors duration-200 border border-gray-100">
                                                    <span className="font-extrabold text-gray-900 text-sm tabular-nums">{Number(report.actual_total || 0).toLocaleString()}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t("EGP")}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-start">
                                                {report.date ? (
                                                    <div className="flex justify-start items-center">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${expandedDate === report.date ? 'bg-mainColor text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-mainColor group-hover:text-white'}`}>
                                                            <FaChevronDown size={14} className="transition-transform duration-300" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 bg-gray-200 text-gray-400 text-[10px] font-bold rounded-full inline-block uppercase">
                                                        {t("Read Only")}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>

                                        {/* Shift Details Sub-table with Animation */}
                                        {expandedDate === report.date && (
                                            <tr>
                                                <td colSpan="6" className="p-0 border-none">
                                                    <div className="p-4 sm:p-8 bg-gray-50/50 rounded-b-2xl border-l-4 sm:border-x-4 border-mainColor sm:mx-4 my-2 overflow-hidden animate-[slideDown_0.3s_ease-out]">
                                                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                                                            <h3 className="text-lg sm:text-xl font-black text-gray-800 flex items-center gap-3">
                                                                <span className="w-2 h-8 bg-mainColor rounded-full"></span>
                                                                {t("Detailed Shifts for")} <span className="text-mainColor">{report.date}</span>
                                                            </h3>
                                                            <div className="flex flex-col sm:flex-row gap-4">
                                                                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 flex-1">
                                                                    <FaShoppingCart className="text-green-500" />
                                                                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">{t("Total Orders")}:</span>
                                                                    <span className="font-black text-gray-800 tabular-nums">{Number(report.total_orders).toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 flex-1">
                                                                    <FaMoneyBillWave className="text-mainColor" />
                                                                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">{t("Day Actual")}:</span>
                                                                    <span className="font-black text-gray-800 tabular-nums">{Number(report.actual_total).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {loadingShifts ? (
                                                            <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-2xl border border-dashed border-gray-200">
                                                                <div className="flex gap-2">
                                                                    <div className="w-3 h-3 bg-mainColor rounded-full animate-bounce"></div>
                                                                    <div className="w-3 h-3 bg-mainColor rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                                    <div className="w-3 h-3 bg-mainColor rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                                </div>
                                                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t("Syncing shift records")}</span>
                                                            </div>
                                                        ) : shiftsByDate[report.date]?.length > 0 ? (
                                                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/40">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-[#1e293b] text-white">
                                                                        <tr>
                                                                            <th className="px-6 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Shift ID")}</th>
                                                                            <th className="px-6 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Start Shift")}</th>
                                                                            <th className="px-6 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("End Shift")}</th>
                                                                            <th className="px-4 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Orders Count")}</th>
                                                                            <th className="px-5 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Start Amount")}</th>
                                                                            <th className="px-5 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Total Orders")}</th>
                                                                            <th className="px-5 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Expenses")}</th>
                                                                            <th className="px-6 py-4 font-bold uppercase tracking-tighter text-xs text-start">{t("Actual Total")}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {shiftsByDate[report.date].map((shift) => (
                                                                            <tr key={shift.id} className="hover:bg-mainColor/[0.02] transition duration-150 group/row">
                                                                                <td className="px-6 py-4 whitespace-nowrap text-start">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover/row:bg-mainColor/10 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover/row:text-mainColor transition-colors">#{shift.id}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-4 text-start">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                                        <span className="text-sm font-bold text-gray-800 whitespace-nowrap">{shift.start_time || shift.start_shift}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-4 text-start">
                                                                                    {(shift.end_time || shift.end_shift) ? (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                                                            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">{shift.end_time || shift.end_shift}</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                                                            <span className="text-xs text-green-600 font-black tracking-wider uppercase italic">{t("Ongoing")}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-4 text-start">
                                                                                    <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-gray-100 font-bold text-gray-800 border border-gray-200">{shift.count_orders || 0}</span>
                                                                                </td>
                                                                                <td className="px-5 py-4 font-bold text-gray-700 tabular-nums text-start">
                                                                                    {Number(shift.start_amount || 0).toLocaleString()}
                                                                                </td>
                                                                                <td className="px-5 py-4 font-bold text-green-700 tabular-nums text-start">
                                                                                    {Number(shift.total_orders || 0).toLocaleString()}
                                                                                </td>
                                                                                <td className="px-5 py-4 font-bold text-red-600 tabular-nums text-start">
                                                                                    {Number(shift.expenses || 0).toLocaleString()}
                                                                                </td>
                                                                                <td className="px-6 py-4 font-black text-gray-900 text-sm tabular-nums text-start">
                                                                                    {Number(shift.actual_total || 0).toLocaleString()}
                                                                                    <span className="text-mainColor mx-1">{t("EGP")}</span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-3">
                                                                <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                                    <FaExclamationCircle size={32} />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-gray-800 font-bold">{t("No Record Found")}</span>
                                                                    <span className="text-gray-400 text-xs font-medium">{t("Shift data synchronization may still be in progress for this date")}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                                <FaWallet size={48} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-xl font-bold text-gray-800">{t("No Analysis Found")}</h3>
                                                <p className="text-gray-400 text-sm font-medium leading-relaxed">{t("Adjust your date filters or select a different period to generate the performance analysis report")}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Enhanced Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm font-bold text-gray-500">
                            {t("Showing")} <span className="text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, reports.length)}</span> {t("of")} <span className="text-gray-900 font-black">{reports.length}</span> {t("daily reports")}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentPage(msg => Math.max(1, msg - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-white hover:text-mainColor disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
                            >
                                <FaChevronDown className="rotate-90" />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${currentPage === page
                                            ? "bg-mainColor text-white shadow-lg shadow-mainColor/25 scale-110 z-10"
                                            : "bg-white text-gray-500 border border-gray-100 hover:border-mainColor/30 hover:text-mainColor"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(msg => Math.min(totalPages, msg + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-white hover:text-mainColor disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
                            >
                                <FaChevronDown className="-rotate-90" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations in Inline CSS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .tracking-tighter { letter-spacing: -0.05em; }
                .tracking-widest { letter-spacing: 0.1em; }
                .letter-spacing-\[1px\] { letter-spacing: 1px; }
            `}} />
        </div>
    );
};

export default CashierShiftReport;
