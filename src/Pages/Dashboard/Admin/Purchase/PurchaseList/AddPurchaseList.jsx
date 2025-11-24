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

const AddPurchase = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const {
        refetch: refetchPurchaseData,
        loading: loadingPurchaseData,
        data: purchaseData,
    } = useGet({
        url: `${apiUrl}/admin/purchase/lists`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/purchase/add`,
    });

    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category_id: "",
        product_id: "",
        store_id: "",
        total_coast: "",
        receipt: null,
        quintity: "",
        date: new Date().toISOString().split('T')[0],
        financial: [{ id: "", amount: "" }]
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [financials, setFinancials] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);

    useEffect(() => {
        refetchPurchaseData();
    }, [refetchPurchaseData]);

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

    // Calculate total payment amount and remaining amount
    useEffect(() => {
        const totalPaid = formData.financial.reduce((sum, financial) => {
            const amount = parseFloat(financial.amount) || 0;
            return sum + amount;
        }, 0);

        setTotalPaymentAmount(totalPaid);

        const totalCost = parseFloat(formData.total_coast) || 0;
        const remaining = totalCost - totalPaid;
        setRemainingAmount(remaining);
    }, [formData.financial, formData.total_coast]);

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

    // Handle financial method change with validation
    const handleFinancialChange = (index, field, value) => {
        const totalCost = parseFloat(formData.total_coast) || 0;

        if (field === "amount") {
            const amountValue = parseFloat(value) || 0;

            // Calculate current total without this field
            const currentTotalWithoutThis = formData.financial.reduce((sum, financial, i) => {
                if (i !== index) {
                    return sum + (parseFloat(financial.amount) || 0);
                }
                return sum;
            }, 0);

            // Check if the new amount would exceed total cost
            if (currentTotalWithoutThis + amountValue > totalCost) {
                auth.toastError(t("Total payment amount cannot exceed total cost"));
                return;
            }
        }

        const updatedFinancials = [...formData.financial];
        updatedFinancials[index] = {
            ...updatedFinancials[index],
            [field]: value
        };
        setFormData(prev => ({ ...prev, financial: updatedFinancials }));
    };

    // Auto-fill remaining amount in the first empty payment method
    const autoFillRemainingAmount = () => {
        if (remainingAmount <= 0) return;

        const updatedFinancials = [...formData.financial];
        let filled = false;

        // Find first empty amount field and fill it with remaining amount
        for (let i = 0; i < updatedFinancials.length; i++) {
            if (!updatedFinancials[i].amount || updatedFinancials[i].amount === "") {
                updatedFinancials[i] = {
                    ...updatedFinancials[i],
                    amount: remainingAmount.toFixed(2)
                };
                filled = true;
                break;
            }
        }

        // If no empty field found, add a new one
        if (!filled) {
            updatedFinancials.push({ id: "", amount: remainingAmount.toFixed(2) });
        }

        setFormData(prev => ({ ...prev, financial: updatedFinancials }));
    };

    // Add more financial methods
    const addFinancialMethod = () => {
        setFormData(prev => ({
            ...prev,
            financial: [...prev.financial, { id: "", amount: "" }]
        }));
    };

    // Remove financial method
    const removeFinancialMethod = (index) => {
        if (formData.financial.length > 1) {
            const updatedFinancials = formData.financial.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, financial: updatedFinancials }));
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, receipt: file }));
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
            total_coast: "",
            receipt: null,
            quintity: "",
            date: new Date().toISOString().split('T')[0],
            financial: [{ id: "", amount: "" }]
        });
        setSelectedCategory(null);
        setSelectedProduct(null);
        setSelectedStore(null);
        setTotalPaymentAmount(0);
        setRemainingAmount(0);
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
        if (!formData.total_coast || formData.total_coast <= 0) {
            auth.toastError(t("Please enter a valid total cost"));
            return;
        }
        if (!formData.quintity || formData.quintity <= 0) {
            auth.toastError(t("Please enter a valid quantity"));
            return;
        }
        if (!formData.date) {
            auth.toastError(t("Please select a date"));
            return;
        }

        // Validate financial methods
        const validFinancials = formData.financial.filter(financial =>
            financial.id && financial.amount && financial.amount > 0
        );

        if (validFinancials.length === 0) {
            auth.toastError(t("Please add at least one payment method with amount"));
            return;
        }

        // Check if total payment amount equals total cost
        const totalCost = parseFloat(formData.total_coast);
        const totalPaid = validFinancials.reduce((sum, financial) => {
            return sum + parseFloat(financial.amount);
        }, 0);

        if (Math.abs(totalPaid - totalCost) > 0.01) { // Allow small floating point differences
            auth.toastError(t("Total payment amount must equal total cost"));
            return;
        }

        const submitData = new FormData();
        submitData.append("category_id", formData.category_id);
        submitData.append("product_id", formData.product_id);
        submitData.append("store_id", formData.store_id);
        submitData.append("total_coast", formData.total_coast);
        submitData.append("quintity", formData.quintity);
        submitData.append("date", formData.date);

        if (formData.receipt) {
            submitData.append("receipt", formData.receipt);
        }

        // Add financial methods
        validFinancials.forEach((financial, index) => {
            submitData.append(`financial[${index}][id]`, financial.id);
            submitData.append(`financial[${index}][amount]`, financial.amount);
        });

        postData(submitData, t("Purchase Added Successfully"));
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
            {loadingPost || loadingPurchaseData ? (
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
                            <TitlePage text={t("Add Purchase")} />
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

                            {/* Total Cost */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Total Cost")}:
                                </span>
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    value={formData.total_coast}
                                    onChange={(e) => handleInputChange("total_coast", e.target.value)}
                                    placeholder={t("Enter Total Cost")}
                                    min="0"
                                />
                            </div>

                            {/* Date */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Date")}:
                                </span>
                                <TextInput
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                />
                            </div>

                            {/* Receipt */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Receipt")}:
                                </span>
                                <UploadInput
                                    placeholder={t("Receipt")}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* Financial Methods */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Payment Methods")}:
                                </span>
                                <button
                                    type="button"
                                    onClick={addFinancialMethod}
                                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                                >
                                    {t("Add Payment Method")}
                                </button>
                            </div>

                            {formData.financial.map((financial, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
                                    <div className="flex flex-col gap-y-1">
                                        <span className="text-lg font-TextFontRegular text-thirdColor">
                                            {t("Method")}:
                                        </span>
                                        <Select
                                            value={financials.find(f => f.value === financial.id)}
                                            onChange={(selectedOption) =>
                                                handleFinancialChange(index, "id", selectedOption ? selectedOption.value : "")
                                            }
                                            options={financials}
                                            placeholder={t("Select Payment Method")}
                                            isClearable
                                            isSearchable
                                            styles={selectStyles}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-y-1">
                                        <span className="text-lg font-TextFontRegular text-thirdColor">
                                            {t("Amount")}:
                                        </span>
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            value={financial.amount}
                                            onChange={(e) =>
                                                handleFinancialChange(index, "amount", e.target.value)
                                            }
                                            placeholder={t("Enter Amount")}
                                            min="0"
                                            max={formData.total_coast}
                                        />
                                        {financial.amount && (
                                            <span className="text-sm text-gray-500">
                                                {t("Max available")}: ${(parseFloat(formData.total_coast || 0) - totalPaymentAmount + parseFloat(financial.amount || 0)).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-end">
                                        {formData.financial.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFinancialMethod(index)}
                                                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                                            >
                                                {t("Remove")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                                    disabled={Math.abs(remainingAmount) > 0.01}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default AddPurchase;