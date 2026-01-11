import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import Select from 'react-select';

const CashierShortage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [reportUrl, setReportUrl] = useState(`${apiUrl}/admin/cashier_gap`);

    const { refetch: refetchReport, loading: loadingReport, data: reportData } = useGet({
        url: reportUrl
    });

    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({
        url: `${apiUrl}/admin/cashier_gap/lists`
    });

    const [cashiers, setCashiers] = useState([]);
    const [cashierMen, setCashierMen] = useState([]);

    // Filter states
    const [selectedCashierId, setSelectedCashierId] = useState(null);
    const [selectedCashierManId, setSelectedCashierManId] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const { t } = useTranslation();

    // Extract gaps data
    const gapsData = reportData?.gaps || [];

    // Calculate pagination
    const totalPages = Math.ceil(gapsData.length / itemsPerPage);
    const currentGaps = gapsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        refetchList();
    }, [refetchList]);

    useEffect(() => {
        if (dataList) {
            setCashiers(dataList.cashiers || []);
            setCashierMen(dataList.cashier_men || []);
        }
    }, [dataList]);

    // Reset page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [gapsData.length]);

    const prepareOptions = (data, labelKey = 'name') => {
        const options = data.map(item => ({
            value: item.id,
            label: item[labelKey] || item.user_name || `ID: ${item.id}`
        }));
        return options;
    };

    const cashierOptions = prepareOptions(cashiers, 'name');
    const cashierManOptions = prepareOptions(cashierMen, 'user_name');

    const handleGenerateReport = () => {
        let url = `${apiUrl}/admin/cashier_gap`;
        const params = [];
        if (selectedCashierId) params.push(`cashier_id=${selectedCashierId}`);
        if (selectedCashierManId) params.push(`cashier_man_id=${selectedCashierManId}`);

        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }
        setReportUrl(url);
    };

    const handleResetFilters = () => {
        setSelectedCashierId(null);
        setSelectedCashierManId(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPaginationNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            if (totalPages > 1) rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="w-full p-6 pb-32 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold text-mainColor">{t("Cashier Shortage")}</h1>
            </div>

            {/* Filters */}
            <div className="p-6 rounded-lg shadow-sm bg-gray-50">
                <h2 className="mb-4 text-xl font-semibold text-mainColor">{t("Filters")}</h2>
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">{t("Cashier")}</label>
                        <Select
                            options={cashierOptions}
                            onChange={(opt) => setSelectedCashierId(opt?.value || null)}
                            isClearable
                            placeholder={t("Select Cashier")}
                            value={cashierOptions.find(opt => opt.value === selectedCashierId) || null}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">{t("Cashier Man")}</label>
                        <Select
                            options={cashierManOptions}
                            onChange={(opt) => setSelectedCashierManId(opt?.value || null)}
                            isClearable
                            placeholder={t("Select Cashier Man")}
                            value={cashierManOptions.find(opt => opt.value === selectedCashierManId) || null}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={handleGenerateReport} className="px-6 py-3 font-medium text-white rounded-lg bg-mainColor hover:bg-opacity-90">
                        {t("Generate Report")}
                    </button>
                    <button onClick={handleResetFilters} className="px-6 py-3 font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600">
                        {t("Reset Filters")}
                    </button>
                </div>
            </div>

            {loadingReport && <p className="text-lg text-center text-gray-600">{t("Loading report...")}</p>}

            {/* Gaps Table */}
            {gapsData && gapsData.length > 0 && (
                <div className="space-y-4">
                    <div className="overflow-hidden bg-white rounded-lg shadow">
                        <h2 className="p-4 text-xl font-bold text-white bg-mainColor">{t("Cashier Shortage Records")}</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">{t("No.")}</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">{t("Amount")}</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">{t("Cashier")}</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">{t("Cashier Man")}</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">{t("Date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentGaps.map((gap, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{index + 1}</td>
                                            <td className="px-4 py-3 text-red-600 font-bold">{gap.amount}</td>
                                            <td className="px-4 py-3">{gap.cashier}</td>
                                            <td className="px-4 py-3">{gap.cashier_man}</td>
                                            <td className="px-4 py-3">{gap.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-700">
                                {t("Showing")}{" "}
                                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                {" to "}
                                <span className="font-medium">
                                    {Math.min(currentPage * itemsPerPage, gapsData.length)}
                                </span>
                                {" of "}
                                <span className="font-medium">{gapsData.length}</span>
                                {" results"}
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentPage === 1
                                        ? "text-gray-400 cursor-not-allowed bg-gray-50 border border-gray-200"
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {t("Previous")}
                                </button>

                                {getPaginationNumbers().map((pageNumber, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                                        disabled={pageNumber === '...'}
                                        className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-all ${pageNumber === currentPage
                                            ? "bg-mainColor text-white"
                                            : pageNumber === '...'
                                                ? "text-gray-500 cursor-default"
                                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentPage === totalPages
                                        ? "text-gray-400 cursor-not-allowed bg-gray-50 border border-gray-200"
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!loadingReport && (!gapsData || gapsData.length === 0) && (
                <div className="py-20 text-center text-gray-500">
                    <p className="text-2xl">{t("No shortage records found")}</p>
                    <p>{t('Select filters and click "Generate Report"')}</p>
                </div>
            )}
        </div>
    );
};

export default CashierShortage;
