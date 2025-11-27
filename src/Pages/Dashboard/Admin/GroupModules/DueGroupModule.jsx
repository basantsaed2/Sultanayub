import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { StaticLoader } from "../../../../Components/Components";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../Context/Auth";

const DueGroupModule = () => {
    const { groupId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const auth = useAuth();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const { data, loading, refetch } = useGet({
        url: `${apiUrl}/admin/due_group_module/${groupId}`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/due_group_module/payment`,
    });

    const [dueData, setDueData] = useState(null);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [openDetails, setOpenDetails] = useState(null);

    // Multiple payments
    const [paymentLines, setPaymentLines] = useState([
        { account: null, amount: "" },
    ]);

    useEffect(() => {
        if (data) setDueData(data);
    }, [data]);

    const totalDue = dueData?.due_amount || 0;
    const totalPaid = dueData?.module_payment?.reduce((a, b) => a + b.total, 0) || 0;
    const remaining = totalDue - totalPaid;

    const accountOptions =
        dueData?.financial_account?.map((acc) => ({
            value: acc.id,
            label: acc.name,
        })) || [];

    const currentTotalPaid = paymentLines.reduce((sum, line) => {
        return sum + (parseFloat(line.amount) || 0);
    }, 0);

    const addPaymentLine = () => {
        setPaymentLines([...paymentLines, { account: null, amount: "" }]);
    };

    const removePaymentLine = (index) => {
        setPaymentLines(paymentLines.filter((_, i) => i !== index));
    };

    const updatePaymentLine = (index, field, value) => {
        const updated = [...paymentLines];
        updated[index][field] = value;
        setPaymentLines(updated);
    };

    const handlePay = async () => {
        const validLines = paymentLines.filter(
            (line) => line.account && line.amount && parseFloat(line.amount) > 0
        );

        if (validLines.length === 0) {
            auth.toastError(t("Please add at least one valid payment"));
            return;
        }

        if (currentTotalPaid > remaining) {
            auth.toastError(t("Total amount exceeds remaining due"));
            return;
        }

        const payload = {
            group_product_id: groupId,
            financials: validLines.map((line) => ({
                id: line.account.value,
                amount: parseFloat(line.amount),
            })),
        };

        await postData(payload);
    };

    useEffect(() => {
        if (response && response.status === 200 && !loadingPost) {
            refetch();
            setOpenPaymentModal(false);
            setPaymentLines([{ account: null, amount: "" }]);
        }
    }, [response, loadingPost]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-96">
                <StaticLoader />
            </div>
        );

    return (
        <div className="w-full p-6 pb-32">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-mainColor font-semibold hover:underline flex items-center gap-2"
            >
                ← {t("Back")}
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border border-gray-100">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    {t("Due Payment")} #{groupId}
                </h1>

                <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-gray-600">{t("Total Due")}</p>
                        <p className="text-3xl font-bold text-mainColor">{totalDue.toLocaleString()} EGP</p>
                    </div>
                    <div>
                        <p className="text-gray-600">{t("Paid")}</p>
                        <p className="text-3xl font-bold text-green-600">{totalPaid.toLocaleString()} EGP</p>
                    </div>
                    <div>
                        <p className="text-gray-600">{t("Remaining")}</p>
                        <p className={`text-3xl font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>
                            {remaining.toLocaleString()} EGP
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Payment Button */}
            {remaining > 0 && (
                <div className="text-right mb-8">
                    <button
                        onClick={() => setOpenPaymentModal(true)}
                        className="px-8 py-4 bg-gradient-to-r from-mainColor to-mainColor text-white font-bold rounded-xl hover:shadow-xl transition shadow-lg"
                    >
                        + {t("Add Payment")}
                    </button>
                </div>
            )}

            {/* Payment History Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-mainColor to-mainColor text-white px-8 py-5">
                    <h2 className="text-xl font-bold">{t("Payment History")}</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">{t("Module")}</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">{t("Amount Paid")}</th>
                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">{t("Details")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dueData?.module_payment?.length > 0 ? (
                                dueData.module_payment.map((pay, i) => (
                                    <tr key={pay.id} className="hover:bg-gray-50 transition">
                                        <td className="px-8 py-5 text-gray-600">{i + 1}</td>
                                        <td className="px-8 py-5 font-medium">Module #{pay.id}</td>
                                        <td className="px-8 py-5 font-bold text-green-600">
                                            {pay.total.toLocaleString()} EGP
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => setOpenDetails(pay)}
                                                className="text-mainColor font-semibold hover:underline"
                                            >
                                                {t("View")} →
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-16 text-gray-500">
                                        {t("No payments yet")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payment Modal - Multiple Lines */}
            {openPaymentModal && (
                <Dialog open onClose={() => setOpenPaymentModal(false)}>
                    <DialogBackdrop className="fixed inset-0 bg-black/50" />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <DialogPanel className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                                {t("Add New Payment")}
                            </h2>

                            <div className="mb-6 p-4 bg-gradient-to-r from-mainColor/10 to-mainColor/5 rounded-xl">
                                <p className="text-center text-lg font-semibold text-mainColor">
                                    {t("Remaining Due")}: <span className="text-2xl">{remaining.toLocaleString()} EGP</span>
                                </p>
                                <p className="text-center text-sm text-gray-600 mt-2">
                                    {t("Current Total")}:{" "}
                                    <span className={`font-bold ${currentTotalPaid > remaining ? "text-red-600" : "text-green-600"}`}>
                                        {currentTotalPaid.toLocaleString()} EGP
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                {paymentLines.map((line, index) => (
                                    <div key={index} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("Payment Method")} #{index + 1}
                                            </label>
                                            <Select
                                                value={line.account}
                                                onChange={(val) => updatePaymentLine(index, "account", val)}
                                                options={accountOptions}
                                                placeholder={t("Select account...")}
                                                className="text-base"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        borderRadius: "12px",
                                                        padding: "2px",
                                                        borderColor: "#e5e7eb",
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="w-40">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("Amount")}
                                            </label>
                                            <input
                                                type="number"
                                                value={line.amount}
                                                onChange={(e) => updatePaymentLine(index, "amount", e.target.value)}
                                                placeholder="0"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold focus:border-mainColor"
                                            />
                                        </div>

                                        {paymentLines.length > 1 && (
                                            <button
                                                onClick={() => removePaymentLine(index)}
                                                className="text-red-600 hover:text-red-800 mb-2"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={addPaymentLine}
                                    className="w-full py-3 border-2 border-dashed border-mainColor text-mainColor rounded-xl font-bold hover:bg-mainColor/5 transition"
                                >
                                    + {t("Add Another Payment Method")}
                                </button>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => {
                                        setOpenPaymentModal(false);
                                        setPaymentLines([{ account: null, amount: "" }]);
                                    }}
                                    className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                                >
                                    {t("Cancel")}
                                </button>
                                <button
                                    onClick={handlePay}
                                    disabled={loadingPost || currentTotalPaid === 0 || currentTotalPaid > remaining}
                                    className="flex-1 py-4 bg-gradient-to-r from-mainColor to-mainColor text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50"
                                >
                                    {loadingPost ? t("Saving...") : t("Confirm Payment")} ({currentTotalPaid} EGP)
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}

            {/* Simple Details Modal */}
            {openDetails && (
                <Dialog open onClose={() => setOpenDetails(null)}>
                    <DialogBackdrop className="fixed inset-0 bg-black/50" />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <DialogPanel className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                {t("Payment Details")}
                            </h3>

                            <div className="bg-gradient-to-r from-mainColor/10 to-mainColor/5 rounded-xl p-6 mb-6">
                                <p className="text-gray-600">{t("Total Paid")}</p>
                                <p className="text-4xl font-bold text-mainColor">
                                    {openDetails.total.toLocaleString()} EGP
                                </p>
                            </div>

                            <div className="space-y-4">
                                {openDetails.financials?.map((f, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex justify-between items-center"
                                    >
                                        <span className="font-medium text-gray-800">{f.financial_accounting}</span>
                                        <span className="text-xl font-bold text-mainColor">
                                            {f.amount.toLocaleString()} EGP
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setOpenDetails(null)}
                                className="mt-8 w-full py-4 bg-gradient-to-r from-mainColor to-mainColor text-white rounded-xl font-bold hover:shadow-xl transition"
                            >
                                {t("Close")}
                            </button>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default DueGroupModule;