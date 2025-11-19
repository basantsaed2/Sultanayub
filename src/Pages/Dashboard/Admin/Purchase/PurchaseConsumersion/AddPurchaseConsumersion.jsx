import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
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

const AddPurchaseConsumersion = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const {
        refetch: refetchLists,
        loading: loadingLists,
        data: dataLists,
    } = useGet({
        url: `${apiUrl}/admin/purchase_consumersion/lists`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/purchase_consumersion/add`,
    });

    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        refetchLists();
    }, [refetchLists]);

    useEffect(() => {
        if (dataLists) {
            // Set branches
            if (dataLists.branches) {
                const branchOptions = dataLists.branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                }));
                setBranches(branchOptions);
            }

            // Set stores
            if (dataLists.stores) {
                const storeOptions = dataLists.stores.map((store) => ({
                    value: store.id,
                    label: store.name,
                }));
                setStores(storeOptions);
            }

            // Set categories
            if (dataLists.categories) {
                const categoryOptions = dataLists.categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                }));
                setCategories(categoryOptions);
            }

            // Set products
            if (dataLists.products) {
                const productOptions = dataLists.products.map((product) => ({
                    value: product.id,
                    label: product.name,
                    category_id: product.category_id
                }));
                setProducts(productOptions);
            }
        }
    }, [dataLists]);

    useEffect(() => {
        if (selectedCategory && products.length > 0) {
            const filtered = products.filter(product =>
                product.category_id === selectedCategory.value
            );
            setFilteredProducts(filtered);
            setSelectedProduct(null);
        } else {
            setFilteredProducts(products);
        }
    }, [selectedCategory, products]);

    useEffect(() => {
        if (!loadingPost && response) {
            handleBack();
        }
    }, [response, loadingPost]);

    // Handle branch selection change
    const handleBranchChange = (selectedOption) => {
        setSelectedBranch(selectedOption);
    };

    // Handle store selection change
    const handleStoreChange = (selectedOption) => {
        setSelectedStore(selectedOption);
    };

    // Handle category selection change
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setFormData(prev => ({ 
            ...prev, 
            category_id: selectedOption ? selectedOption.value : "" 
        }));

        // Check if currently selected product belongs to the new category
        if (selectedProduct && selectedOption) {
            const productBelongsToNewCategory = products.some(
                product => product.id === selectedProduct.value && product.category_id === selectedOption.value
            );
            
            // If product doesn't belong to new category, remove it
            if (!productBelongsToNewCategory) {
                setSelectedProduct(null);
                auth.toastInfo(t("Product selection cleared because it doesn't belong to the selected category"));
            }
        } else if (selectedProduct && !selectedOption) {
            // If category is cleared, also clear product
            setSelectedProduct(null);
        }
    };

    // Handle product selection change
    const handleProductChange = (selectedOption) => {
        setSelectedProduct(selectedOption);
    };

    // Handle quantity change
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Handle date change
    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!selectedBranch) {
            auth.toastError(t("Please Select Branch"));
            return;
        }
        if (!selectedCategory) {
            auth.toastError(t("Please Select Category"));
            return;
        }
        if (!selectedProduct) {
            auth.toastError(t("Please Select Product"));
            return;
        }
        if (!selectedStore) {
            auth.toastError(t("Please Select Store"));
            return;
        }
        if (!quantity || quantity <= 0) {
            auth.toastError(t("Please Enter Valid Quantity"));
            return;
        }
        if (!date) {
            auth.toastError(t("Please Select Date"));
            return;
        }

        const formData = new FormData();
        formData.append("branch_id", selectedBranch.value);
        formData.append("category_id", selectedCategory.value);
        formData.append("product_id", selectedProduct.value);
        formData.append("store_id", selectedStore.value);
        formData.append("quintity", quantity);
        formData.append("date", date);

        postData(formData, t("Purchase Consumersion Added Success"));
    };

    const handleReset = () => {
        setSelectedBranch(null);
        setSelectedStore(null);
        setSelectedCategory(null);
        setSelectedProduct(null);
        setQuantity("");
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleBack = () => {
        navigate(-1);
    };

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
            {loadingPost || loadingLists ? (
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
                            <TitlePage text={t("Add Purchase Consumersion")} />
                        </div>
                    </div>

                    <form className="p-2" onSubmit={handleSubmit}>
                        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {/* Branch */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">{t("Branch")}:</span>
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

                            {/* Store */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">{t("Store")}:</span>
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

                            {/* Category */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">{t("Category")}:</span>
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
                                <span className="text-xl font-TextFontRegular text-thirdColor">{t("Product")}:</span>
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

                            {/* Quantity */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">{t("Quantity")}:</span>
                                <TextInput
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    placeholder={t("Enter Quantity")}
                                    min="1"
                                />
                            </div>

                            {/* Date */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">{t("Date")}:</span>
                                <TextInput
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>

                        {/* Submit & Reset */}
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

export default AddPurchaseConsumersion;