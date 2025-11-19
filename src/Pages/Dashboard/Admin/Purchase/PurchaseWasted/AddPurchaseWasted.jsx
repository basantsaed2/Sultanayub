import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    TextInput,
    TitlePage,
    UploadInput,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useGet } from "../../../../../Hooks/useGet";
import Select from 'react-select';

const AddPurchaseWasted = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const {
        refetch: refetchPurchaseWasted,
        loading: loadingPurchaseWasted,
        data: purchaseData,
    } = useGet({
        url: `${apiUrl}/admin/wasted`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/wasted/add`,
    });

    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category_id: "",
        product_id: "",
        store_id: "",
        quintity: "",
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        refetchPurchaseWasted();
    }, [refetchPurchaseWasted]);

    // Update data when purchaseData changes
    useEffect(() => {
        if (purchaseData) {
            // Set categories
            if (purchaseData.categories) {
                const categoryOptions = purchaseData.categories.map(category => ({
                    value: category.id,
                    label: category.name,
                }));
                setCategories(categoryOptions);
            }

            // Set products
            if (purchaseData.products) {
                setProducts(purchaseData.products);
            }

            // Set stores
            if (purchaseData.stores) {
                const storeOptions = purchaseData.stores.map(store => ({
                    value: store.id,
                    label: store.name,
                }));
                setStores(storeOptions);
            }

            // Set financials
            if (purchaseData.financials) {
                const financialOptions = purchaseData.financials.map(financial => ({
                    value: financial.id,
                    label: financial.name,
                }));
                setFinancials(financialOptions);
            }
        }
    }, [purchaseData]);

    // Filter products when category changes
    useEffect(() => {
        if (selectedCategory && products.length > 0) {
            const filtered = products.filter(product =>
                product.category_id === selectedCategory.value
            );
            const productOptions = filtered.map(product => ({
                value: product.id,
                label: product.name,
            }));
            setFilteredProducts(productOptions);

            // Reset product selection when category changes
            setSelectedProduct(null);
            setFormData(prev => ({ ...prev, product_id: "" }));
        } else {
            setFilteredProducts([]);
        }
    }, [selectedCategory, products]);

    // Navigate back after successful submission
    useEffect(() => {
        if (!loadingPost && response) {
            handleBack();
        }
    }, [response, loadingPost]);

    // Handle category selection change
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setFormData(prev => ({
            ...prev,
            category_id: selectedOption ? selectedOption.value : ""
        }));
    };

    // Handle product selection change
    const handleProductChange = (selectedOption) => {
        setSelectedProduct(selectedOption);
        setFormData(prev => ({
            ...prev,
            product_id: selectedOption ? selectedOption.value : ""
        }));
    };

    // Handle store selection change
    const handleStoreChange = (selectedOption) => {
        setSelectedStore(selectedOption);
        setFormData(prev => ({
            ...prev,
            store_id: selectedOption ? selectedOption.value : ""
        }));
    };

    // Handle input change for simple fields
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Reset form
    const handleReset = () => {
        setFormData({
            category_id: "",
            product_id: "",
            store_id: "",
            quintity: "",
        });
        setSelectedCategory(null);
        setSelectedProduct(null);
        setSelectedStore(null);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.category_id) {
            auth.toastError(t("Please select a category"));
            return;
        }
        if (!formData.product_id) {
            auth.toastError(t("Please select a product"));
            return;
        }
        if (!formData.store_id) {
            auth.toastError(t("Please select a store"));
            return;
        }
        if (!formData.quintity || formData.quintity <= 0) {
            auth.toastError(t("Please enter a valid quantity"));
            return;
        }

        const submitData = new FormData();
        submitData.append("category_id", formData.category_id);
        submitData.append("product_id", formData.product_id);
        submitData.append("store_id", formData.store_id);
        submitData.append("quantity", formData.quintity);

        postData(submitData, t("Purchase Wasted Added Successfully"));
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
            padding: '0.25rem',
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
            {loadingPost || loadingPurchaseWasted ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <section className="pb-32">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-x-2">
                            <button
                                onClick={handleBack}
                                className="text-mainColor hover:text-red-700 transition-colors"
                                title={t("Back")}
                            >
                                <IoArrowBack size={24} />
                            </button>
                            <TitlePage text={t("Add Purchase Wasted")} />
                        </div>
                    </div>
                    <form className="p-2" onSubmit={handleSubmit}>
                        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {/* Category */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Category")}:
                                </span>
                                <Select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    options={categories}
                                    placeholder={t("Select Category")}
                                    isClearable
                                    isSearchable
                                    styles={selectStyles}
                                    className="w-full"
                                    noOptionsMessage={() => t("No categories available")}
                                />
                            </div>

                            {/* Product */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Product")}:
                                </span>
                                <Select
                                    value={selectedProduct}
                                    onChange={handleProductChange}
                                    options={filteredProducts}
                                    placeholder={selectedCategory ? t("Select Product") : t("Select category first")}
                                    isClearable
                                    isSearchable
                                    styles={selectStyles}
                                    className="w-full"
                                    isDisabled={!selectedCategory}
                                    noOptionsMessage={() => t("No products available for this category")}
                                />
                            </div>

                            {/* Store */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Store")}:
                                </span>
                                <Select
                                    value={selectedStore}
                                    onChange={handleStoreChange}
                                    options={stores}
                                    placeholder={t("Select Store")}
                                    isClearable
                                    isSearchable
                                    styles={selectStyles}
                                    className="w-full"
                                    noOptionsMessage={() => t("No stores available")}
                                />
                            </div>

                            {/* Quantity */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Quantity")}:
                                </span>
                                <TextInput
                                    type="number"
                                    value={formData.quintity}
                                    onChange={(e) => handleInputChange("quintity", e.target.value)}
                                    placeholder={t("Enter Quantity")}
                                    min="1"
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

export default AddPurchaseWasted;