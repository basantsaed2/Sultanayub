import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet";
import { usePost } from "../../../../../Hooks/usePostJson";
import { StaticLoader } from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";

const SinglePageDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    
    // Get customer data from navigation state
    const [customerData] = useState(location.state?.customerData);
    
    const {
        refetch: refetchCustomerDetails,
        loading: loadingCustomerDetails,
        data: dataCustomerDetails,
    } = useGet({
        url: `${apiUrl}/admin/customer/customer_singl_page/${userId}`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/customer/single_page_filter/${userId}`,
    });

    // State for date filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState(null);

    // Use response to update filtered data
    useEffect(() => {
        if (response && !loadingPost) {
            setFilteredData(response?.data || null);
        }
    }, [response, loadingPost]);

    // Apply date filter
    const handleFilter = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            return;
        }

        const filterData = {
            from_date: startDate,
            to_date: endDate
        };

        await postData(filterData);
    };

    // Clear filters
    const handleClearFilter = () => {
        setStartDate("");
        setEndDate("");
        setFilteredData(null);
        refetchCustomerDetails();
    };

    // Use filtered data or original data
    const displayData = filteredData || dataCustomerDetails;
    
    // Handle different data structures from both APIs
    const ordersToDisplay = displayData?.orders || [];
    
    // Calculate totals based on available data
    const totalOrders = ordersToDisplay.length;
    
    // Total amount - prefer API provided total_amount, otherwise calculate from orders
    const totalAmount = displayData?.total_amount !== undefined 
        ? displayData.total_amount 
        : ordersToDisplay.reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

    // Get user info from both possible sources
    const userInfo = displayData?.user_info || customerData;
    
    // Get due amount (from first API)
    const dueAmount = dataCustomerDetails?.due || 0;
    
    // Get order_due data (from first API)
    const orderDue = dataCustomerDetails?.order_due || [];
    
    // Get paid_debt data (from first API)
    const paidDebt = dataCustomerDetails?.paid_debt || [];

    // Calculate total paid debt
    const totalPaidDebt = paidDebt.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

    // Get greatest product from both possible sources
    const greatestProduct = displayData?.greatest_product || dataCustomerDetails?.greatest_product;

    useEffect(() => {
        refetchCustomerDetails();
    }, [userId]);

    if (loadingCustomerDetails && !customerData) {
        return (
            <div className="flex items-center justify-center w-full h-56">
                <StaticLoader />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 mb-6 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
            >
                {t("Back")}
            </button>

            {/* Customer Info Section */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-mainColor">
                    {t("CustomerInformation")}
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {userInfo?.f_name} {userInfo?.l_name}
                            </h3>
                            <p className="text-gray-600">{userInfo?.email}</p>
                            <p className="text-gray-600">{userInfo?.phone}</p>
                            {userInfo?.phone_2 && (
                                <p className="text-gray-600">{userInfo.phone_2}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <p><strong>{t("Code")}:</strong> {userInfo?.code || displayData?.code || "-"}</p>
                        <p><strong>{t("TotalOrders")}:</strong> {totalOrders}</p>
                        <p><strong>{t("TotalAmount")}:</strong> ${totalAmount.toFixed(2)}</p>
                        <p><strong>{t("Points")}:</strong> {userInfo?.points || 0}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <p><strong className="text-red-600">{t("DueAmount")}:</strong> ${dueAmount.toFixed(2)}</p>
                        <p><strong className="text-green-600">{t("TotalPaidDebt")}:</strong> ${totalPaidDebt.toFixed(2)}</p>
                        <p><strong>{t("PendingOrdersDue")}:</strong> {orderDue.length}</p>
                    </div>

                    {greatestProduct && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-blue-800">{t("FavoriteProduct")}:</p>
                            <div className="flex items-center space-x-3 mt-2">
                                <img
                                    src={greatestProduct.image}
                                    alt={greatestProduct.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div>
                                    <p className="font-medium">{greatestProduct.name}</p>
                                    {greatestProduct.description && (
                                        <p className="text-sm text-gray-600 mt-1">{greatestProduct.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Financial Summary Section */}
            {(dueAmount > 0 || orderDue.length > 0 || paidDebt.length > 0) && (
                <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-mainColor">{t("FinancialSummary")}</h3>
                    
                    {/* Order Due Section */}
                    {orderDue.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-red-700 mb-2">{t("PendingOrderPayments")}:</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left">{t("OrderNumber")}</th>
                                            <th className="px-3 py-2 text-left">{t("Amount")}</th>
                                            <th className="px-3 py-2 text-left">{t("Cashier")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDue.map((order, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-3 py-2">{order.order_number}</td>
                                                <td className="px-3 py-2">${order.amount}</td>
                                                <td className="px-3 py-2">{order.cashier || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {/* Payment History */}
                    {paidDebt.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-green-700 mb-2">{t("PaymentHistory")}:</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left">{t("Date")}</th>
                                            <th className="px-3 py-2 text-left">{t("Amount")}</th>
                                            <th className="px-3 py-2 text-left">{t("ProcessedBy")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paidDebt.map((payment, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-3 py-2">
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-2">${payment.amount}</td>
                                                <td className="px-3 py-2">
                                                    {payment.cashier || payment.admin || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Date Filter Section */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-xl font-semibold">{t("FilterOrdersByDate")}</h3>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">{t("StartDate")}</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">{t("EndDate")}</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="flex items-end space-x-2">
                        <button
                            onClick={handleFilter}
                            disabled={loadingPost}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {loadingPost ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{t("Loading...")}</span>
                                </div>
                            ) : (
                                t("Filter")
                            )}
                        </button>
                        <button
                            onClick={handleClearFilter}
                            disabled={loadingPost}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            {t("Clear")}
                        </button>
                    </div>
                </div>
                
                {/* Filter Status Indicator */}
                {filteredData && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700">
                            <strong>{t("FilteredResults")}:</strong> {t("Showing")} {totalOrders} {t("orders")} | 
                            <strong> {t("TotalAmount")}:</strong> ${totalAmount.toFixed(2)}
                            {startDate && endDate && (
                                <span className="block text-sm mt-1">
                                    {t("From")}: {startDate} {t("To")}: {endDate}
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-semibold">
                        {t("OrderHistory")} ({totalOrders})
                    </h3>
                    {filteredData && (
                        <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                            {t("Filtered")}
                        </span>
                    )}
                </div>
                
                {loadingPost ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center">
                            <StaticLoader />
                            <p className="mt-2 text-gray-600">{t("LoadingFilteredOrders")}</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {ordersToDisplay.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-lg text-gray-500">{t("NoOrdersFound")}</p>
                                {filteredData && (
                                    <p className="mt-2 text-sm text-gray-400">
                                        {t("NoOrdersInDateRange")}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">{t("OrderNumber")}</th>
                                        <th className="px-4 py-3 text-left">{t("Date")}</th>
                                        <th className="px-4 py-3 text-left">{t("Time")}</th>
                                        <th className="px-4 py-3 text-left">{t("Type")}</th>
                                        <th className="px-4 py-3 text-left">{t("Branch")}</th>
                                        <th className="px-4 py-3 text-left">{t("Amount")}</th>
                                        <th className="px-4 py-3 text-left">{t("Status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersToDisplay.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{order.order_number}</td>
                                            <td className="px-4 py-3">{order.date}</td>
                                            <td className="px-4 py-3">{order.time}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                                    order.order_type === 'delivery' 
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : order.order_type === 'take_away'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : order.order_type === 'dine_in'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.order_type === 'application'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.order_type?.replace(/_/g, ' ') || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{order.branch || "-"}</td>
                                            <td className="px-4 py-3 font-semibold">${order.amount}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                    order.order_status === 'delivered' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.order_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : order.order_status === 'canceled'
                                                        ? 'bg-red-100 text-red-800'
                                                        : order.order_status === 'out_for_delivery'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePageDetails;