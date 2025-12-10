import React, { useEffect, useState } from "react";
import { TitlePage, StaticLoader } from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { t } from "i18next";
import { FiEye, FiUser, FiCalendar, FiDollarSign, FiInfo, FiX, FiAlertTriangle } from "react-icons/fi";

const VoidList = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const { data, loading } = useGet({
        url: `${apiUrl}/admin/order/void_orders`,
    });

    const orders = data?.orders || [];
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-EG", {
            style: "currency",
            currency: "EGP",
        }).format(amount);
    };

    return (
        <div className="p-6 w-full">
            <TitlePage text={t("Void Orders")} />

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <StaticLoader />
                </div>
            )}

            {/* Empty State */}
            {!loading && orders.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <FiInfo size={60} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600">{t("No voided orders found")}</h3>
                </div>
            )}

            {/* Table */}
            {!loading && orders.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-red-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left">{t("Order No.")}</th>
                                    <th className="px-6 py-4 text-left">{t("Date")}</th>
                                    <th className="px-6 py-4 text-left">{t("Branch")}</th>
                                    <th className="px-6 py-4 text-left">{t("Amount")}</th>
                                    <th className="px-6 py-4 text-left">{t("Void Reason")}</th>
                                    <th className="px-6 py-4 text-left">{t("Void")}</th>
                                    <th className="px-6 py-4 text-center">{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-red-50 cursor-pointer transition"
                                        onClick={() => openModal(order)}
                                    >
                                        <td className="px-6 py-5 font-bold text-red-700">
                                            #{order.order_number}
                                        </td>
                                        <td className="px-6 py-5 text-gray-700">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-5 font-medium">
                                            {order.branch?.name || "—"}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-red-600">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${order.void_reason
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {order.void_reason || t("Not specified")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-medium text-gray-800">
                                                {order.void || t("-")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(order);
                                                }}
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                        <div className="flex justify-between">
                            <p className="font-semibold">
                                {t("Total Voided Orders")}: <span className="text-red-600">{orders.length}</span>
                            </p>
                            <p className="font-semibold">
                                {t("Total Lost Amount")}:
                                <span className="text-red-600 ml-2">
                                    {formatCurrency(orders.reduce((sum, o) => sum + o.amount, 0))}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-red-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Order Details #{selectedOrder.order_number}</h2>
                                <p className="text-red-100">Voided Order</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-red-700 rounded-lg transition"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Basic Info</h3>
                                    <div className="space-y-3">
                                        <DetailRow label={t("Order ID")} value={selectedOrder.id} />
                                        <DetailRow label={t("Order Number")} value={selectedOrder.order_number} />
                                        <DetailRow label={t("Created At")} value={formatDate(selectedOrder.created_at)} />
                                        <DetailRow label={t("Amount")} value={formatCurrency(selectedOrder.amount)} bold />
                                        <DetailRow label={t("Type")} value={selectedOrder.type} />
                                        <DetailRow
                                            label={t("Order Type")}
                                            value={selectedOrder.order_type === "take_away" ? "Take Away" : "Delivery"}
                                        />
                                        <DetailRow label={t("Source")} value={selectedOrder.source?.toUpperCase()} />
                                        <DetailRow label={t("Status")} value={selectedOrder.order_status} badge />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Void Information</h3>
                                    <div className="space-y-3">
                                        <DetailRow
                                            label={t("Void Reason")}
                                            value={selectedOrder.void_reason || t("Not provided")}
                                            highlight={!!selectedOrder.void_reason}
                                        />
                                        <DetailRow
                                            label={t("Void")}
                                            value={selectedOrder.void || t("-")}
                                            highlight
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Customer & Location</h3>
                                    <div className="space-y-3">
                                        <DetailRow label={t("Customer Name")} value={`${selectedOrder.user?.f_name || ""} ${selectedOrder.user?.l_name || ""}`.trim() || "—"} />
                                        <DetailRow label={t("Phone")} value={selectedOrder.user?.phone || "—"} />
                                        <DetailRow label={t("Branch")} value={selectedOrder.branch?.name || "—"} />
                                        <DetailRow label={t("Zone")} value={selectedOrder.address?.zone?.zone || "—"} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Payment & Delivery</h3>
                                    <div className="space-y-3">
                                        <DetailRow label={t("Payment Method")} value={selectedOrder.payment_method?.name || "—"} />
                                        <DetailRow label={t("Delivery Man")} value={selectedOrder.delivery?.name || "—"} />
                                        <DetailRow label={t("Schedule")} value={selectedOrder.schedule?.name || "—"} />
                                        <DetailRow label={t("Transaction ID")} value={selectedOrder.transaction_id || "—"} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Other Info</h3>
                                    <div className="space-y-3">
                                        <DetailRow label={t("Points Earned")} value={selectedOrder.points} />
                                        <DetailRow label={t("Rate")} value={selectedOrder.rate ? `${selectedOrder.rate}/5` : "—"} />
                                        <DetailRow label={t("Rejected Reason")} value={selectedOrder.rejected_reason || "—"} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-8 py-5 border-t text-right">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
                            >
                                {t("Close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value, bold = false, highlight = false, badge = false }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-600 font-medium">{label}:</span>
        <span
            className={`font-semibold ${bold ? "text-lg text-red-600" : highlight ? "text-red-700" : "text-gray-900"
                } ${badge ? "px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm" : ""}`}
        >
            {value || "—"}
        </span>
    </div>
);

export default VoidList;