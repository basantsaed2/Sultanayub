import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    TextInput,
    TitlePage,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useGet } from "../../../../../Hooks/useGet";
import Select from 'react-select';

const AddMaterialList = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({ url: `${apiUrl}/admin/material_product`, });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/material_product/add`,
    });
    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);

    useEffect(() => {
        refetchList();
    }, [refetchList]);

    useEffect(() => {
        if (dataList && dataList.categories) {
            // Format categories for react-select
            const options = dataList.categories.map(category => ({
                value: category.id, // category_id
                label: category.name
            }));
            setCategoryOptions(options);
        }
    }, [dataList]);

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

    // Reset form
    const handleReset = () => {
        setName("");
        setSelectedCategory(null);
        setStatus(1);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            auth.toastError(t("Please select a category"));
            return;
        }

        if (!name) {
            auth.toastError(t("Enter Material Product Name"));
            return;
        }

        const formData = new FormData();
        formData.append("category_id", selectedCategory.value); // category_id from select
        formData.append("name", name);
        formData.append("description", description);
        formData.append("status", status);

        postData(formData, t("Material Product Added Success"));
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Custom styles for react-select
    const customStyles = {
        control: (base, state) => ({
            ...base,
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
            borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
            }
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff'
            }
        })
    };

    return (
        <>
            {loadingPost ? (
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
                            <TitlePage text={t("Add Material Product")} />
                        </div>
                    </div>
                    <form className="p-2" onSubmit={handleSubmit}>
                        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {/* Name */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Product Name")}:
                                </span>
                                <TextInput
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("Enter Product Name")}
                                />
                            </div>

                            {/* Description */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Product Description")}:
                                </span>
                                <TextInput
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t("Enter Product Description")}
                                />
                            </div>

                            {/* Category Select */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Material Category")}:
                                </span>
                                <Select
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    placeholder={t("Select Material Category")}
                                    isSearchable
                                    styles={customStyles}
                                    isLoading={loadingList}
                                    className="w-full"
                                    required
                                    noOptionsMessage={() => t("No categories available")}
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
                                    text={t("Submit")}
                                    rounded="rounded-full"
                                    handleClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default AddMaterialList;