import React, { useEffect, useState } from "react";
import {
    StaticLoader,
    Switch,
    TitlePage,
    StaticButton,
    SubmitButton,
    TextInput,
    AddButton,
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { t } from "i18next";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import Select from 'react-select';

const PurchaseTransfer = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const {
        refetch: refetchPurchaseTransfer,
        loading: loadingPurchaseTransfer,
        data: dataPurchaseTransfer,
    } = useGet({
        url: `${apiUrl}/admin/purchase_transfer`,
    });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/purchase_transfer/transfer`,
    });
    const auth = useAuth();

    const [PurchaseTransfers, setPurchaseTransfers] = useState([]);
    const [showTransferDialog, setShowTransferDialog] = useState(false);

    // Transfer form state
    const [transferForm, setTransferForm] = useState({
        from_store_id: "",
        to_store_id: "",
        category_id: "",
        product_id: "",
        quintity: ""
    });

    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedFromStore, setSelectedFromStore] = useState(null);
    const [selectedToStore, setSelectedToStore] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const PurchaseTransfersPerPage = 20;

    const totalPages = Math.ceil(PurchaseTransfers.length / PurchaseTransfersPerPage);

    const currentPurchaseTransfers = PurchaseTransfers.slice(
        (currentPage - 1) * PurchaseTransfersPerPage,
        currentPage * PurchaseTransfersPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Update PurchaseTransfers when `data` changes
    useEffect(() => {
        if (dataPurchaseTransfer) {
            if (dataPurchaseTransfer.purchases) {
                setPurchaseTransfers(dataPurchaseTransfer.purchases);
            }

            // Set stores
            if (dataPurchaseTransfer.stores) {
                const storeOptions = dataPurchaseTransfer.stores.map(store => ({
                    value: store.id,
                    label: store.name,
                }));
                setStores(storeOptions);
            }

            // Set categories
            if (dataPurchaseTransfer.categories) {
                const categoryOptions = dataPurchaseTransfer.categories.map(category => ({
                    value: category.id,
                    label: category.name,
                }));
                setCategories(categoryOptions);
            }

            // Set products
            if (dataPurchaseTransfer.products) {
                setProducts(dataPurchaseTransfer.products);
            }
        }
    }, [dataPurchaseTransfer]);

    useEffect(() => {
        refetchPurchaseTransfer();
    }, [refetchPurchaseTransfer]);

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
            setTransferForm(prev => ({ ...prev, product_id: "" }));
        } else {
            setFilteredProducts([]);
        }
    }, [selectedCategory, products]);

    // Change PurchaseTransfer status
    const handleChangeStatus = async (id, name, status) => {
        const newStatus = status === "approve" ? "reject" : "approve";
        const response = await changeState(
            `${apiUrl}/admin/purchase_transfer/status/${id}`,
            `${name} Status Changed to ${newStatus}.`,
            { status: newStatus }
        );

        if (response) {
            setPurchaseTransfers((prevTransfers) =>
                prevTransfers.map((transfer) =>
                    transfer.id === id ? { ...transfer, status: newStatus } : transfer
                )
            );
        }
    };

    // Get status display text and color
    const getStatusDisplay = (status) => {
        const isApproved = status === "approve";
        return {
            text: isApproved ? t("Approved") : t("Rejected"),
            color: isApproved ? "text-green-600" : "text-red-600",
            bgColor: isApproved ? "bg-green-100" : "bg-red-100"
        };
    };

    // Handle transfer dialog open
    const handleOpenTransferDialog = () => {
        setShowTransferDialog(true);
    };

    // Handle transfer dialog close
    const handleCloseTransferDialog = () => {
        setShowTransferDialog(false);
        resetTransferForm();
    };

    // Reset transfer form
    const resetTransferForm = () => {
        setTransferForm({
            from_store_id: "",
            to_store_id: "",
            category_id: "",
            product_id: "",
            quintity: ""
        });
        setSelectedFromStore(null);
        setSelectedToStore(null);
        setSelectedCategory(null);
        setSelectedProduct(null);
    };

    // Handle from store change
    const handleFromStoreChange = (selectedOption) => {
        setSelectedFromStore(selectedOption);
        setTransferForm(prev => ({
            ...prev,
            from_store_id: selectedOption ? selectedOption.value : ""
        }));
    };

    // Handle to store change
    const handleToStoreChange = (selectedOption) => {
        setSelectedToStore(selectedOption);
        setTransferForm(prev => ({
            ...prev,
            to_store_id: selectedOption ? selectedOption.value : ""
        }));
    };

    // Handle category change
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setTransferForm(prev => ({
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
                setTransferForm(prev => ({ ...prev, product_id: "" }));
                auth.toastInfo(t("Product selection cleared because it doesn't belong to the selected category"));
            }
        } else if (selectedProduct && !selectedOption) {
            // If category is cleared, also clear product
            setSelectedProduct(null);
            setTransferForm(prev => ({ ...prev, product_id: "" }));
        }
    };

    // Handle product change
    const handleProductChange = (selectedOption) => {
        setSelectedProduct(selectedOption);
        setTransferForm(prev => ({
            ...prev,
            product_id: selectedOption ? selectedOption.value : ""
        }));
    };

    // Handle quantity change
    const handleQuantityChange = (e) => {
        setTransferForm(prev => ({
            ...prev,
            quintity: e.target.value
        }));
    };

    // Handle transfer submission
    const handleTransferSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!transferForm.from_store_id) {
            auth.toastError(t("Please select source store"));
            return;
        }
        if (!transferForm.to_store_id) {
            auth.toastError(t("Please select destination store"));
            return;
        }
        if (transferForm.from_store_id === transferForm.to_store_id) {
            auth.toastError(t("Source and destination stores cannot be the same"));
            return;
        }
        if (!transferForm.category_id) {
            auth.toastError(t("Please select category"));
            return;
        }
        if (!transferForm.product_id) {
            auth.toastError(t("Please select product"));
            return;
        }
        if (!transferForm.quintity || transferForm.quintity <= 0) {
            auth.toastError(t("Please enter valid quantity"));
            return;
        }

        const formData = new FormData();
        formData.append("from_store_id", transferForm.from_store_id);
        formData.append("to_store_id", transferForm.to_store_id);
        formData.append("category_id", transferForm.category_id);
        formData.append("product_id", transferForm.product_id);
        formData.append("quintity", transferForm.quintity);

        postData(formData, t("Transfer completed successfully"));

        if (response && !loadingPost) {
            handleCloseTransferDialog();
            refetchPurchaseTransfer();
        }
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

    const headers = [
        t("SL"),
        t("Product"),
        t("Category"),
        t("From Store"),
        t("To Store"),
        t("Quantity"),
        t("Approval"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
            {loadingPurchaseTransfer ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className='flex flex-col items-center justify-between md:flex-row'>
                        <div className='w-full md:w-1/2'>
                            <TitlePage text={t('Purchase Transfer')} />
                        </div>
                        <div className='flex justify-end w-full py-4 md:w-1/2'>
                            <AddButton Text={t("Transfer")} handleClick={handleOpenTransferDialog} />
                        </div>
                    </div>

                    {/* Transfer Dialog */}
                    {showTransferDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-TextFontRegular text-thirdColor">
                                            {t("Transfer Products")}
                                        </h3>
                                        <button
                                            onClick={handleCloseTransferDialog}
                                            className="text-gray-500 hover:text-gray-700 text-2xl"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={handleTransferSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* From Store */}
                                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-lg font-TextFontRegular text-thirdColor">
                                                    {t("From Store")}:
                                                </span>
                                                <Select
                                                    value={selectedFromStore}
                                                    onChange={handleFromStoreChange}
                                                    options={stores}
                                                    placeholder={t("Select Source Store")}
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                    className="w-full"
                                                    noOptionsMessage={() => t("No stores available")}
                                                />
                                            </div>

                                            {/* To Store */}
                                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-lg font-TextFontRegular text-thirdColor">
                                                    {t("To Store")}:
                                                </span>
                                                <Select
                                                    value={selectedToStore}
                                                    onChange={handleToStoreChange}
                                                    options={stores}
                                                    placeholder={t("Select Destination Store")}
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                    className="w-full"
                                                    noOptionsMessage={() => t("No stores available")}
                                                />
                                            </div>

                                            {/* Category */}
                                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-lg font-TextFontRegular text-thirdColor">
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
                                                <span className="text-lg font-TextFontRegular text-thirdColor">
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

                                            {/* Quantity */}
                                            <div className="w-full flex flex-col items-start justify-center gap-y-1 md:col-span-2">
                                                <span className="text-lg font-TextFontRegular text-thirdColor">
                                                    {t("Quantity")}:
                                                </span>
                                                <TextInput
                                                    type="number"
                                                    value={transferForm.quintity}
                                                    onChange={handleQuantityChange}
                                                    placeholder={t("Enter Quantity")}
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex items-center justify-end w-full gap-x-4 mt-6">
                                            <StaticButton
                                                text={t("Cancel")}
                                                handleClick={handleCloseTransferDialog}
                                                bgColor="bg-transparent"
                                                Color="text-mainColor"
                                                border="border-2"
                                                borderColor="border-mainColor"
                                                rounded="rounded-full"
                                            />
                                            <SubmitButton
                                                text={t("Transfer")}
                                                rounded="rounded-full"
                                                handleClick={handleTransferSubmit}
                                                disabled={loadingPost}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
                        <thead className="w-full">
                            <tr className="w-full border-b-2">
                                {headers.map((name, index) => (
                                    <th
                                        className="min-w-[120px] sm:w-[8%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3"
                                        key={index}
                                    >
                                        {name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {PurchaseTransfers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="text-xl text-center text-mainColor font-TextFontMedium "
                                    >
                                        {t("No Purchase Transfer Found")}
                                    </td>
                                </tr>
                            ) : (
                                currentPurchaseTransfers.map((transfer, index) => {
                                    const statusDisplay = getStatusDisplay(transfer.status);

                                    return (
                                        <tr className="w-full border-b-2" key={transfer.id}>
                                            <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                {(currentPage - 1) * PurchaseTransfersPerPage + index + 1}
                                            </td>
                                            <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                {transfer?.product || "-"}
                                            </td>
                                            <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                {transfer?.category || "-"}
                                            </td>
                                            <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                {transfer?.from_store || "-"}
                                            </td>
                                            <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                {transfer?.to_store || "-"}
                                            </td>
                                            <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                {transfer?.quintity || "0"}
                                            </td>
                                            <td className="min-w-[150px] sm:min-w-[120px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Switch
                                                        checked={transfer.status === "approve"}
                                                        handleClick={() => handleChangeStatus(transfer.id, transfer.product, transfer.status)}
                                                        disabled={loadingChange}
                                                    />
                                                    <span className={`text-sm font-medium px-2 py-1 rounded ${statusDisplay.color} ${statusDisplay.bgColor}`}>
                                                        {statusDisplay.text}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {PurchaseTransfers.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center my-6 gap-x-4">
                            {currentPage !== 1 && (
                                <button
                                    type="button"
                                    className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    {t("Prev")}
                                </button>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page
                                            ? "bg-mainColor text-white"
                                            : " text-mainColor"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                            {totalPages !== currentPage && (
                                <button
                                    type="button"
                                    className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    {t("Next")}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PurchaseTransfer;