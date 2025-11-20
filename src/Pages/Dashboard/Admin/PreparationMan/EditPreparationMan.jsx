import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    PasswordInput,
    TextInput,
    TitlePage,
} from "../../../../Components/Components";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useGet } from "../../../../Hooks/useGet";
import Select from 'react-select';

const EditPreparationMan = () => {
    const { preparationManId } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const { 
        refetch: refetchPreparationMan, 
        loading: loadingPreparationMan, 
        data: dataPreparationMan 
    } = useGet({
        url: `${apiUrl}/admin/preparation_man/item/${preparationManId}`,
    });

    const {
        refetch: refetchBranches,
        loading: loadingBranches,
        data: dataBranches,
    } = useGet({
        url: `${apiUrl}/admin/preparation_man/lists`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/preparation_man/update/${preparationManId}`,
    });

    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [branches, setBranches] = useState([]);

    // Set form fields when preparation man data is available
    useEffect(() => {
        if (dataPreparationMan && dataPreparationMan.data) {
            const preparationMan = dataPreparationMan.data;

            setName(preparationMan.name || "");
            setStatus(preparationMan.status || 1);
            
            // Set selected branch after branches are loaded
            if (preparationMan?.branch.id && branches.length > 0) {
                const foundBranch = branches.find(
                    branch => branch.value === preparationMan.branch.id
                );
                setSelectedBranch(foundBranch || null);
            }
        }
    }, [dataPreparationMan, branches]);

    // Update branches dropdown when data changes
    useEffect(() => {
        if (dataBranches && dataBranches.branches) {
            const branchOptions = dataBranches.branches.map((branch) => ({
                value: branch.id,
                label: branch.name,
            }));
            setBranches(branchOptions);

            // Set selected branch after options are loaded
            if (dataPreparationMan && dataPreparationMan.preparation_man) {
                const currentPreparationMan = dataPreparationMan.preparation_man;
                if (currentPreparationMan.branch_id) {
                    const foundBranch = branchOptions.find(
                        branch => branch.value === currentPreparationMan.branch_id
                    );
                    setSelectedBranch(foundBranch || null);
                }
            }
        }
    }, [dataBranches, dataPreparationMan]);

    useEffect(() => {
        refetchPreparationMan();
        refetchBranches();
    }, [refetchPreparationMan, refetchBranches]);

    // Navigate back after successful submission
    useEffect(() => {
        if (!loadingPost && response) {
            handleBack();
        }
    }, [response, loadingPost]);

    // Toggle status
    const handleStatus = () => {
        setStatus((prev) => (prev === 1 ? 0 : 1));
    };

    // Handle branch selection change
    const handleBranchChange = (selectedOption) => {
        setSelectedBranch(selectedOption);
    };

    // Reset form to original values
    const handleReset = () => {
        if (dataPreparationMan && dataPreparationMan.data) {
            const preparationMan = dataPreparationMan.data;

            setName(preparationMan.name || "");
            setStatus(preparationMan.status || 1);
            
            // Reset selected branch
            if (preparationMan.branch?.id && branches.length > 0) {
                const foundBranch = branches.find(
                    branch => branch.value === preparationMan.branch?.id
                );
                setSelectedBranch(foundBranch || null);
            } else {
                setSelectedBranch(null);
            }
        }
    };

    // Handle form submission
    const handleUpdate = (e) => {
        e.preventDefault();

        if (!name) {
            auth.toastError(t("Enter Preparation Man Name"));
            return;
        }

        if (!selectedBranch) {
            auth.toastError(t("Select Branch"));
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("status", status);
        formData.append("branch_id", selectedBranch.value);
        
        // Only append password if it's provided (for update)
        if (password) {
            formData.append("password", password);
        }

        postData(formData, t("Preparation Man Updated Success"));
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
            borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
            '&:hover': {
                borderColor: state.isFocused ? '#3B82F6' : '#9CA3AF'
            }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
                backgroundColor: '#EFF6FF'
            }
        })
    };

    return (
        <>
            {loadingPost || loadingPreparationMan || loadingBranches ? (
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
                            <TitlePage text={t("Edit Preparation Man")} />
                        </div>
                    </div>
                    <form className="p-2" onSubmit={handleUpdate}>
                        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {/* Name */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Name")}:
                                </span>
                                <TextInput
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("Enter Name")}
                                />
                            </div>

                            {/* Password (Optional for update) */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Password")} ({t("Optional")}):
                                </span>
                                <PasswordInput
                                    value={password}
                                    backgound="bg-white"
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("Enter New Password")}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {t("Leave blank to keep current password")}
                                </p>
                            </div>

                            {/* Branch */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Branch")}:
                                </span>
                                <Select
                                    value={selectedBranch}
                                    onChange={handleBranchChange}
                                    options={branches}
                                    placeholder={t("Select Branch")}
                                    isClearable
                                    isSearchable
                                    styles={selectStyles}
                                    className="w-full"
                                    noOptionsMessage={() => t("No branches available")}
                                />
                            </div>

                            {/* Status */}
                            <div className="w-full flex items-start justify-start gap-x-1 pt-8">
                                <div className="flex items-center justify-start gap-x-3">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("Active")}:
                                    </span>
                                    <Switch handleClick={handleStatus} checked={status} />
                                </div>
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

export default EditPreparationMan;