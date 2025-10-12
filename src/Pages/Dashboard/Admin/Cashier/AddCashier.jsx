import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    TextInput,
    TitlePage,
} from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { IoArrowBack } from "react-icons/io5"; // Import back icon from react-icons
import Select from "react-select";

const AddCashier = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchBranch, loading: loadingBranch, data: dataBranch } = useGet({
        url: `${apiUrl}/admin/cashier`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/cashier/add`,
    });
    const { t, i18n } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    const [branches, setBranches] = useState([]);
    const [name, setName] = useState("");
    const [active, setActive] = useState(0);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Fetch branches on component mount
    useEffect(() => {
        refetchBranch();
    }, [refetchBranch]);

    // Update branches state when dataBranch is available
    useEffect(() => {
        if (dataBranch && dataBranch.branches) {
            const branchOptions = dataBranch.branches.map((branch) => ({
                value: branch.id,
                label: branch.name,
            }));
            setBranches(branchOptions);
        }
    }, [dataBranch]);

    // Reset form fields after successful submission
    useEffect(() => {
        if (!loadingPost && response) {
            handleBack()
        }
    }, [response, loadingPost]);

    // Toggle active state
    const handleActive = () => {
        setActive((prev) => (prev === 0 ? 1 : 0));
    };

    // Reset form
    const handleReset = () => {
        setName("");
        setSelectedBranch(null);
        setActive(0);
    };

    // Handle form submission
    const handleAdd = (e) => {
        e.preventDefault();

        if (!name) {
            auth.toastError(t("CashierNameRequired"));
            return;
        }

        if (!selectedBranch) {
            auth.toastError(t("BranchRequired"));
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("branch_id", selectedBranch.value);
        formData.append("status", active);

        postData(formData, t("CashierAddedSuccess"));
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1); // Navigate back one step in history
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
        singleValue: (provided) => ({
            ...provided,
            color: "#333",
        }),
    };

    return (
        <>
            {loadingPost || loadingBranch ? (
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
                            <TitlePage text={t("Add Cashier")} />
                        </div>
                    </div>
                    <form className="p-2" onSubmit={handleAdd}>
                        <div className="flex flex-wrap items-center justify-start w-full gap-4 mb-4 sm:flex-col lg:flex-row">
                            {/* Cashier Name */}
                            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("CashierName")}:
                                </span>
                                <TextInput
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("CashierName")}
                                />
                            </div>

                            {/* Branch Selection */}
                            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Branch")}:
                                </span>
                                <Select
                                    options={branches}
                                    value={selectedBranch}
                                    onChange={setSelectedBranch}
                                    placeholder={t("SelectBranch")}
                                    styles={customStyles}
                                    isSearchable
                                    className="w-full"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="sm:w-full xl:w-[30%] flex items-start justify-start gap-x-1 pt-8">
                                <div className="flex items-center justify-start gap-x-3">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("ActiveCashier")}:
                                    </span>
                                    <Switch handleClick={handleActive} checked={active} />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end w-full gap-x-4">
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
                                    text={t("Submit")}
                                    rounded="rounded-full"
                                    handleClick={handleAdd}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default AddCashier;