import React, { useEffect, useState } from "react";
import {
    StaticLoader,
    SubmitButton,
    TextInput,
    TitlePage,
    StaticButton,
    PasswordInput
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { IoArrowBack, IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const OrderPercentage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const auth = useAuth();

    const {
        refetch: refetchOrderPercentage,
        loading: loadingOrderPercentage,
        data: dataOrderPercentage,
    } = useGet({
        url: `${apiUrl}/admin/order_precentage`,
    });

    const { changeState, loadingChange } = useChangeState();

    // State variables
    const [percentage, setPercentage] = useState("");
    const [currentPercentage, setCurrentPercentage] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        refetchOrderPercentage();
    }, [refetchOrderPercentage]);

    useEffect(() => {
        if (dataOrderPercentage?.order_precentage) {
            const orderPercentage = dataOrderPercentage.order_precentage;
            setCurrentPercentage(orderPercentage.toString());
            setPercentage(orderPercentage.toString());
        }
    }, [dataOrderPercentage]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!percentage || isNaN(percentage) || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100) {
            auth.toastError(t("Please enter a valid percentage between 1 and 100"));
            return;
        }

        // Use URL parameters for the PUT request
        const url = `${apiUrl}/admin/order_precentage/create_update?order_precentage=${parseFloat(percentage)}&password=${encodeURIComponent(password)}`;

        try {
            const success = await changeState(url, "Order percentage updated successfully");

            if (success) {
                // Update current percentage display
                setCurrentPercentage(percentage);
            }
        } catch (error) {
            // Error is already handled by the hook
            console.error("Error updating order percentage:", error);
        }
    };

    const handleReset = () => {
        // Reset to current value from API
        setPercentage(currentPercentage);
        setPassword("");
    };

    return (
        <div className="flex items-start justify-start w-full p-2 pb-28">
            {loadingOrderPercentage || loadingChange ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <section className="w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 mb-3">
                        <div className="flex items-center gap-x-2">
                            <TitlePage text={t("Order Percentage")} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {/* Percentage Input */}
                        <div className="flex items-start justify-center gap-y-2 mb-6">
                            <label className="text-xl font-TextFontRegular text-thirdColor">
                                {t("Order Percentage")}:
                            </label>
                            <div className="relative w-full max-w-xs">
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    max="100"
                                    value={percentage}
                                    onChange={(e) => setPercentage(e.target.value)}
                                    placeholder={t("Enter percentage (1-100)")}
                                    className="pr-12 text-center text-lg"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-thirdColor font-TextFontMedium">
                                    %
                                </span>
                            </div>
                            {/* Password */}
                            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Password")}:
                                </span>
                                <PasswordInput
                                    backgound="white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("Password")}
                                />
                            </div>
                            <p className="text-sm text-gray-500 font-TextFontLight mt-1">
                                {t("Enter a value between 1 and 100")}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end w-full gap-x-4">
                            <div>
                                <StaticButton
                                    text={t("Reset")}
                                    handleClick={handleReset}
                                    bgColor="bg-transparent"
                                    Color="text-mainColor"
                                    border={"border-2"}
                                    borderColor={"border-mainColor"}
                                    rounded="rounded-full"
                                    disabled={loadingChange}
                                />
                            </div>
                            <div>
                                <SubmitButton
                                    text={t("Update Percentage")}
                                    rounded="rounded-full"
                                    disabled={loadingChange || percentage === currentPercentage}
                                />
                            </div>
                        </div>

                        {/* Helper text when no changes */}
                        {percentage === currentPercentage && currentPercentage && (
                            <p className="text-center text-gray-500 text-sm mt-3">
                                {t("No changes to update")}
                            </p>
                        )}
                    </form>
                </section>
            )}
        </div>
    );
};

export default OrderPercentage;