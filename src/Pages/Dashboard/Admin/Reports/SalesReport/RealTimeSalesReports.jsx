import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { useGet } from '../../../../../Hooks/useGet'; // Adjusted path based on file location
import { StaticLoader } from '../../../../../Components/Components'; // Assuming StaticLoader is available

const RealTimeSalesReports = () => {
    const { t } = useTranslation();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // 1. Fetch Branches List
    const { data: listData, loading: loadingList } = useGet({
        url: `${apiUrl}/admin/reports/lists_report`
    });

    const branches = listData?.branches || [];

    // State for selected branch
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const salesUrl = selectedBranchId
        ? `${apiUrl}/admin/reports/instate_order_report?branch_id=${selectedBranchId}`
        : null;

    const { data: salesData, loading: loadingSales } = useGet({
        url: salesUrl
    });

    // Prepare Options for Select
    const branchOptions = branches.map(branch => ({
        value: branch.id,
        label: branch.name
    }));

    // Render Logic
    const hasData = !!salesData;

    const Card = ({ title, value, colorClass = "bg-white", textClass = "text-gray-800" }) => (
        <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 ${colorClass}`}>
            <h3 className={`text-sm font-medium opacity-80 mb-2 ${textClass}`}>{t(title)}</h3>
            <p className={`text-2xl font-bold ${textClass}`}>
                {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
                {(typeof value === 'number' && title !== 'Total Orders Count') ? ` ${t('EGP')}` : ''}
            </p>
        </div>
    );

    return (
        <div className="p-6 md:p-8 space-y-8 pb-20">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t("Real Time Sales Report")}</h1>
                    <p className="text-gray-500 mt-1">{t("Monitor your branch performance live")}</p>
                </div>

                {/* Branch Selector */}
                <div className="w-full md:w-72">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Select Branch")}</label>
                    <Select
                        options={branchOptions}
                        value={branchOptions.find(opt => opt.value === selectedBranchId) || null}
                        onChange={(opt) => setSelectedBranchId(opt ? opt.value : '')}
                        placeholder={t("All Branches")} // Or specific placeholder if "All" isn't supported by API logic directly without ID
                        isLoading={loadingList}
                        classNamePrefix="react-select"
                        isClearable
                    />
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {!selectedBranchId ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-xl text-gray-500 font-medium">{t("Please select a branch to view data")}</p>
                    </div>
                ) : loadingSales ? (
                    <div className="flex justify-center items-center h-64">
                        <StaticLoader />
                    </div>
                ) : salesData ? (
                    <div className="w-full space-y-6">
                        {/* Key Metrics - Highlighted */}
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card title="Total Orders Revenue" value={salesData.total_orders} colorClass="bg-mainColor" textClass="text-white" />
                            <Card title="Total Orders Count" value={salesData.count_orders} colorClass="bg-blue-600" textClass="text-white" />
                            <Card title="Average Order Value" value={salesData.avg_orders || 0} colorClass="bg-purple-600" textClass="text-white" />
                        </div>

                        <div className="border-t border-gray-200 lg:col-span-3 xl:col-span-4 my-2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {/* Breakdown */}
                            <Card title="Delivery" value={salesData.delivery} />
                            <Card title="Take Away" value={salesData.take_away} />
                            <Card title="Dine In" value={salesData.dine_in} />
                            <Card title="Online Mobile" value={salesData.online_mobile} />
                            <Card title="Online Web" value={salesData.online_web} />
                            <Card title="Discount" value={salesData.discount} colorClass="bg-red-50 border-red-100" textClass="text-red-700" />

                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">{t("No data available for this branch")}</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default RealTimeSalesReports;
