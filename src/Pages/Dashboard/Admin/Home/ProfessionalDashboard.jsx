import React, { useMemo } from 'react';
import DashboardKpiCards from './Charts/DashboardKpiCards';
import StandardLineChart from './Charts/StandardLineChart';
import OrderTypeDistributionChart from './Charts/OrderTypeDistributionChart';
import HourlySalesBarChart from './Charts/HourlySalesBarChart';
import TopProductsBarChart from './Charts/TopProductsBarChart';
import SimplePieChart from './Charts/SimplePieChart';
import { generateMockDashboardData } from './Charts/mockData';

const ProfessionalDashboard = ({ realData }) => {
    // Merge real data with mock data where real data is missing
    const data = useMemo(() => {
        const mock = generateMockDashboardData();
        const baseData = {
            kpis: realData?.kpis || mock.kpis,
            timeSeries: realData?.timeSeries || mock.timeSeries,
            orderTypes: realData?.orderTypes || mock.orderTypes,
            hourlySales: realData?.hourlySales || mock.hourlySales,
            topProducts: realData?.topProducts || mock.topProducts,
            topPayments: realData?.topPayments || mock.topPayments,
            topBranches: realData?.topBranches || mock.topBranches,
        };

        // Create enriched labels that include order counts for financial charts
        const enrichedFinancialLabels = baseData.timeSeries.labels.map((label, index) => {
            const count = baseData.timeSeries.orders[index] || 0;
            return `${label} (${count} Orders)`;
        });

        return {
            ...baseData,
            enrichedFinancialLabels
        };
    }, [realData]);

    return (
        <div className="w-full flex flex-col gap-8 p-6 bg-gray-50/50 min-h-screen">
            {/* Header / KPIs */}
            <DashboardKpiCards kpis={data.kpis} />

            {/* Main Time Series Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StandardLineChart
                    title="# of Orders"
                    labels={data.timeSeries.labels}
                    data={data.timeSeries.orders}
                    color="#9E090F"
                />
                <StandardLineChart
                    title="Net Sales"
                    labels={data.enrichedFinancialLabels}
                    data={data.timeSeries.netSales}
                    color="#10b981"
                    unit="$"
                />
                <StandardLineChart
                    title="Net Payments"
                    labels={data.enrichedFinancialLabels}
                    data={data.timeSeries.netPayments}
                    color="#3b82f6"
                    unit="$"
                />
                <StandardLineChart
                    title="Return Amount"
                    labels={data.enrichedFinancialLabels}
                    data={data.timeSeries.returns}
                    color="#ef4444"
                    unit="$"
                />
                <StandardLineChart
                    title="Discount Amount"
                    labels={data.enrichedFinancialLabels}
                    data={data.timeSeries.discounts}
                    color="#f59e0b"
                    unit="$"
                />
            </div>

            {/* Secondary Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OrderTypeDistributionChart
                    labels={data.orderTypes.labels}
                    dineIn={data.orderTypes.dineIn}
                    delivery={data.orderTypes.delivery}
                    takeaway={data.orderTypes.takeaway}
                />
                <HourlySalesBarChart
                    labels={data.hourlySales.labels}
                    orders={data.hourlySales.orders}
                />
            </div>

            {/* Top Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <TopProductsBarChart
                        labels={data.topProducts.labels}
                        values={data.topProducts.orders_count}
                    />
                </div>
                <div className="lg:col-span-1">
                    <SimplePieChart
                        title="Top Payments"
                        labels={data.topPayments.labels}
                        values={data.topPayments.values}
                    />
                </div>
                <div className="lg:col-span-1">
                    <SimplePieChart
                        title="Top Branches"
                        labels={data.topBranches.labels}
                        values={data.topBranches.values}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDashboard;
