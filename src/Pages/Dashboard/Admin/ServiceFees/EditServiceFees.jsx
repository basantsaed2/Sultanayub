import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    TitlePage,
} from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Select from "react-select";

// AmountInput component moved outside to prevent re-renders
const AmountInput = ({ value, onChange, placeholder, className, type }) => (
    <div className="relative w-full">
        <input
            type="number"
            step={type === "percentage" ? "0.01" : "0.01"}
            min="0"
            max={type === "percentage" ? "100" : undefined}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border-2 border-mainColor rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor ${className}`}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-thirdColor font-TextFontMedium">
            {type === "percentage" ? "%" : "$"}
        </span>
    </div>
);

const EditServiceFees = () => {
    const { serviceFeeId } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Fetch service fee data
    const { refetch: refetchServiceFeeItem, loading: loadingServiceFeeItem, data: dataServiceFeeItem } = useGet({
        url: `${apiUrl}/admin/service_fees/item/${serviceFeeId}`,
    });

    // Fetch branches list
    const { refetch: refetchData, loading: loadingData, data: data } = useGet({
        url: `${apiUrl}/admin/service_fees/lists`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/service_fees/update/${serviceFeeId}`,
    });

    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [amount, setAmount] = useState("");
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [type, setType] = useState("fixed"); // "percentage" or "fixed"

    // Fetch data on component mount
    useEffect(() => {
        refetchData();
        refetchServiceFeeItem();
    }, [refetchData, refetchServiceFeeItem, serviceFeeId]);

    // Update branches state when data is available
    useEffect(() => {
        if (data) {
            if (data.branches) {
                const branchOptions = data.branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                }));
                setBranches(branchOptions);
            }
        }
    }, [data]);

    // Set form fields when service fee data is available - FIXED VERSION
    useEffect(() => {
        if (dataServiceFeeItem && dataServiceFeeItem.service_fees && branches.length > 0) {
            const serviceFee = dataServiceFeeItem.service_fees;

            // Set amount
            setAmount(serviceFee.amount?.toString() || "");

            // Handle type - based on your data, "value" means fixed amount
            let serviceFeeType = "fixed"; // default
            if (serviceFee.type === "precentage" || serviceFee.type === "percentage") {
                serviceFeeType = "percentage";
            } else if (serviceFee.type === "value" || serviceFee.type === "fixed") {
                serviceFeeType = "fixed";
            }
            setType(serviceFeeType);

            // Set selected branches
            if (serviceFee.branches && serviceFee.branches.length > 0) {
                const branchSelections = branches.filter(branch =>
                    serviceFee.branches.some(serviceFeeBranch =>
                        serviceFeeBranch.id === branch.value
                    )
                );
                setSelectedBranches(branchSelections);
            }
        }
    }, [dataServiceFeeItem]);

    // Navigate back after successful submission
    useEffect(() => {
        if (!loadingPost && response) {
            handleBack();
        }
    }, [response, loadingPost]);

    // Handle branch selection
    const handleBranchChange = (selectedOptions) => {
        setSelectedBranches(selectedOptions || []);
    };

    // Handle type change
    const handleTypeChange = (selectedType) => {
        setType(selectedType);
    };

    // Reset form to original values
    const handleReset = () => {
        if (dataServiceFeeItem) {
            const serviceFee = dataServiceFeeItem;

            setAmount(serviceFee.amount?.toString() || "");

            // Handle type
            let serviceFeeType = "fixed";
            if (serviceFee.type === "precentage" || serviceFee.type === "percentage") {
                serviceFeeType = "percentage";
            } else if (serviceFee.type === "value" || serviceFee.type === "fixed") {
                serviceFeeType = "fixed";
            }
            setType(serviceFeeType);

            // Reset selected branches
            if (serviceFee.branches && serviceFee.branches.length > 0 && branches.length > 0) {
                const branchSelections = branches.filter(branch =>
                    serviceFee.branches.some(serviceFeeBranch =>
                        serviceFeeBranch.id === branch.value
                    )
                );
                setSelectedBranches(branchSelections);
            } else {
                setSelectedBranches([]);
            }
        }
    };

    // Handle form submission
    const handleUpdate = (e) => {
        e.preventDefault();

        if (!amount) {
            auth.toastError(t("Amount is required"));
            return;
        }

        if (selectedBranches.length === 0) {
            auth.toastError(t("At least one branch is required"));
            return;
        }

        // Validate amount based on type
        if (type === "percentage") {
            const percentageValue = parseFloat(amount);
            if (percentageValue < 0 || percentageValue > 100) {
                auth.toastError(t("Percentage must be between 0 and 100"));
                return;
            }
        } else {
            const fixedValue = parseFloat(amount);
            if (fixedValue < 0) {
                auth.toastError(t("Amount must be positive"));
                return;
            }
        }

        const formData = new FormData();
        // Send the correct type to API - "precentage" for percentage, "value" for fixed
        const apiType = type === "percentage" ? "precentage" : "value";
        formData.append("type", apiType);
        formData.append("amount", amount);

        // Add branches
        selectedBranches.forEach((branch, index) => {
            formData.append(`branches[${index}]`, branch.value);
        });

        postData(formData, t("Service Fee Updated Successfully"));
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Custom styles for react-select
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: "#9E090F",
            borderRadius: "8px",
            padding: "6px",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#9E090F",
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#9E090F" : state.isFocused ? "#E6F0FA" : "white",
            color: state.isSelected ? "white" : "black",
            "&:hover": {
                backgroundColor: "#E6F0FA",
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#E6F0FA",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "#9E090F",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "#9E090F",
            ':hover': {
                backgroundColor: '#9E090F',
                color: 'white',
            },
        }),
    };

    return (
        <>
            {loadingPost || loadingData || loadingServiceFeeItem ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <section>
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-x-2">
                            <button
                                onClick={handleBack}
                                className="text-mainColor hover:text-red-700 transition-colors"
                                title={t("Back")}
                            >
                                <IoArrowBack size={24} />
                            </button>
                            <TitlePage text={t("Edit Service Fee")} />
                        </div>
                    </div>

                    <form className="p-2" onSubmit={handleUpdate}>
                        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {/* Type Selection - Radio Buttons */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-3">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Type")}:
                                </span>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="percentage"
                                            checked={type === "percentage"}
                                            onChange={() => handleTypeChange("percentage")}
                                            className="w-4 h-4 text-mainColor focus:ring-mainColor border-mainColor"
                                        />
                                        <span className="text-lg font-TextFontMedium text-thirdColor">
                                            {t("Percentage")}
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="fixed"
                                            checked={type === "fixed"}
                                            onChange={() => handleTypeChange("fixed")}
                                            className="w-4 h-4 text-mainColor focus:ring-mainColor border-mainColor"
                                        />
                                        <span className="text-lg font-TextFontMedium text-thirdColor">
                                            {t("Fixed Amount")}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {type === "percentage" ? t("Percentage") : t("Amount")}:
                                </span>
                                <AmountInput
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={
                                        type === "percentage"
                                            ? t("Enter percentage")
                                            : t("Enter amount")
                                    }
                                    className="pr-12"
                                    type={type}
                                />
                                {type === "percentage" && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t("Enter value between 0 and 100")}
                                    </p>
                                )}
                            </div>

                            {/* Branch Selection */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Branches")}:
                                </span>
                                <Select
                                    options={branches}
                                    value={selectedBranches}
                                    onChange={handleBranchChange}
                                    placeholder={t("Select Branches")}
                                    styles={customStyles}
                                    isMulti
                                    isSearchable
                                    className="w-full"
                                    noOptionsMessage={() => t("No branches available")}
                                />
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end w-full gap-x-4 mt-6">
                            <div>
                                <StaticButton
                                    text={t("Reset")}
                                    handleClick={handleReset}
                                    bgColor="bg-transparent"
                                    Color="text-mainColor"
                                    border="border-2"
                                    borderColor="border-mainColor"
                                    rounded="rounded-full"
                                />
                            </div>
                            <div>
                                <SubmitButton
                                    text={t("Update")}
                                    rounded="rounded-full"
                                    handleClick={handleUpdate}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default EditServiceFees;