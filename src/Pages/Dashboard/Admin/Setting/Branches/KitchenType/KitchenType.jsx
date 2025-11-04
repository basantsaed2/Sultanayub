import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGet } from "../../../../../../Hooks/useGet";
import { useDelete } from "../../../../../../Hooks/useDelete";
import { useChangeState } from "../../../../../../Hooks/useChangeState";
import { usePost } from "../../../../../../Hooks/usePostJson";
import { AddButton, StaticButton, StaticLoader, SubmitButton, Switch, TitleSection } from "../../../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../../../Assets/Icons/AllIcons";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Warning from "../../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "primereact/multiselect";
import { IoAddCircleOutline } from "react-icons/io5";

const KitchenType = () => {
    const { branchId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const [branchType, setBranchType] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDelete, setOpenDelete] = useState(null);
    const [openProductModal, setOpenProductModal] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openProductsModal, setOpenProductsModal] = useState(null);
    const typesPerPage = 20;

    // Determine endpoint based on route
    const isBirsta = location.pathname.includes("branch_birsta");
    const endpoint = isBirsta
        ? `${apiUrl}/admin/pos/kitchens/brista?branch_id=${branchId}`
        : `${apiUrl}/admin/pos/kitchens?branch_id=${branchId}`;

    const { refetch: refetchType, loading: loadingType, data: dataType } = useGet({ url: endpoint });
    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({
        url: `${apiUrl}/admin/pos/kitchens/lists`,
    });
    const { deleteData, loadingDelete } = useDelete();
    const { changeState } = useChangeState();
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/pos/kitchens/select_product`,
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(branchType.length / typesPerPage);

    // Get the types for the current page
    const currentTypes = branchType.slice(
        (currentPage - 1) * typesPerPage,
        currentPage * typesPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        refetchType();
        refetchList();
    }, [refetchType, refetchList]);

    useEffect(() => {
        if (dataType && (dataType.kitchens || dataType.brista)) {
            setBranchType(dataType.kitchens || dataType.brista);
        }
    }, [dataType]);

    useEffect(() => {
        if (dataList && dataList.products) {
            setProducts(dataList.products);
            setCategories(dataList.category);
            setFilteredProducts(dataList.products); // Initially show all products
        }
    }, [dataList]);

    // Filter products based on selected categories
    useEffect(() => {
        if (selectedCategories.length > 0) {
            const filtered = products.filter((product) =>
                selectedCategories.some((category) => category.id === product.category_id)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products); // Show all products if no categories selected
        }
    }, [selectedCategories, products]);

    useEffect(() => {
            if (!loadingPost && response) {
            handleCloseProductModal();
            }
        }, [response, loadingPost]);

    const handleChangeStatus = async (id, name, status) => {
        const response = await changeState(
            `${apiUrl}/admin/pos/kitchens/status/${id}`,
            t("StatusChangedSuccess", { name }),
            { status }
        );
        if (response) {
            setBranchType((prev) =>
                prev.map((type) => (type.id === id ? { ...type, status } : type))
            );
        }
    };

    const handleOpenProductsModal = (type) => {
        setOpenProductsModal(type);
    };

    const handleCloseProductsModal = () => {
        setOpenProductsModal(null);
    };

    const handleOpenDelete = (item) => {
        setOpenDelete(item);
    };

    const handleCloseDelete = () => {
        setOpenDelete(null);
    };

    const handleDelete = async (id, name) => {
        const success = await deleteData(
            `${apiUrl}/admin/pos/kitchens/delete/${id}`,
            t("DeletedSuccess", { name })
        );
        if (success) {
            setBranchType(branchType.filter((type) => type.id !== id));
            handleCloseDelete();
        }
    };

    const handleOpenProductModal = (kitchenId) => {
        setOpenProductModal(kitchenId);
        setSelectedProducts([]);
        setSelectedCategories([]);
        setFilteredProducts(products); // Reset to all products when opening modal
    };

    const handleCloseProductModal = () => {
        setOpenProductModal(null);
        setSelectedProducts([]);
        setSelectedCategories([]);
    };

    const handleAddProducts = async () => {
        const formData = new FormData();
        formData.append("kitchen_id", openProductModal);

        // Append product IDs or empty array
        if (selectedProducts.length > 0) {
            selectedProducts.forEach((product, index) => {
                formData.append(`product_id[${index}]`, product.id);
            });
        } else {
            formData.append("product_id[]", ""); // Empty array representation
        }

        // Append category IDs or empty array
        if (selectedCategories.length > 0) {
            selectedCategories.forEach((category, index) => {
                formData.append(`category_id[${index}]`, category.id);
            });
        } else {
            formData.append("category_id[]", ""); // Empty array representation
        }

        postData(
            formData,
            t("ProductsAddedSuccess", { type: t(isBirsta ? "Birsta" : "Kitchen") })
        );
    };

    // Format time to display without seconds if needed
    const formatTimeDisplay = (time) => {
        if (!time) return '-';
        if (time.includes(':')) {
            const parts = time.split(':');
            if (parts[2] === '00') {
                return `${parts[0]}:${parts[1]}`; // Show only HH:MM if seconds are 00
            }
            return time;
        }
        return time;
    };

    const headers = [
        "#",
        t("Name"),
        t("Branch"),
        // t("Type"),
        t("Preparing Time"),
        t("Print Status"),
        t("Print Name"),
        t("Print IP"),
        t("Products"),
        t("Status"),
        t("Action"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll pb-28 scrollSection">
            {loadingType || loadingList || loadingDelete || loadingPost ? (
                <div className="w-full mt-40">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full gap-5">
                    <div className="flex justify-between mt-5">
                        <TitleSection text={t(isBirsta ? "BirstaTypeTable" : "KitchenTypeTable")} />
                        <AddButton handleClick={() => navigate("add")} />
                    </div>
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
                            {branchType.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="text-xl text-center text-mainColor font-TextFontMedium"
                                    >
                                        {t("NotfindTypes")}
                                    </td>
                                </tr>
                            ) : (
                                currentTypes.map((type, index) => (
                                    <tr className="w-full border-b-2" key={index}>
                                        <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {(currentPage - 1) * typesPerPage + index + 1}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {type?.name || "-"}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {type?.branch?.name || "-"}
                                        </td>
                                        {/* <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                type?.type === 'kitchen' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {type?.type || "-"}
                                            </span>
                                        </td> */}
                                        <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {formatTimeDisplay(type?.preparing_time) || "-"}
                                        </td>
                                        <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                type?.print_status === 1 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {type?.print_status === 1 ? t('Active') : t('Inactive')}
                                            </span>
                                        </td>
                                        <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {type?.print_name || "-"}
                                        </td>
                                        <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {type?.print_ip || "-"}
                                        </td>
                                        <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <button
                                                type="button"
                                                className="inline-flex items-center justify-center px-3 py-1 text-sm font-TextFontMedium text-white bg-mainColor rounded-full hover:bg-opacity-80 transition-colors duration-300"
                                                onClick={() => handleOpenProductsModal(type)}
                                            >
                                                {type.products?.length || 0} {t('Products')}
                                            </button>
                                        </td>
                                        {openProductsModal?.id === type.id && (
                                            <Dialog
                                                open={true}
                                                onClose={handleCloseProductsModal}
                                                className="relative z-20"
                                            >
                                                <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                                <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                                        <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-md">
                                                            <div className="px-4 pt-5 pb-4 sm:p-6">
                                                                <DialogTitle as="h3" className="text-lg font-TextFontSemiBold text-mainColor">
                                                                    {t('Products', { name: type.name })}
                                                                </DialogTitle>
                                                                <div className="mt-4 max-h-64 overflow-y-auto">
                                                                    {type.products?.length > 0 ? (
                                                                        type.products.map((product) => (
                                                                            <div
                                                                                key={product.id}
                                                                                className="flex flex-col p-3 mb-2 bg-gray-50 rounded-md border border-gray-200"
                                                                            >
                                                                                <div className="text-sm font-TextFontMedium text-mainColor">
                                                                                    {t('ProductName')}: {product.name}
                                                                                </div>
                                                                                <div className="text-xs text-gray-900">
                                                                                    {t('Description')}: {product.description || t('NoAddress')}
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-sm text-thirdColor">
                                                                            {t('NoProducts')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="px-4 py-3 sm:px-6">
                                                                <button
                                                                    type="button"
                                                                    onClick={handleCloseProductsModal}
                                                                    className="inline-flex justify-center w-full px-6 py-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:w-auto"
                                                                >
                                                                    {t('Close')}
                                                                </button>
                                                            </div>
                                                        </DialogPanel>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        )}
                                        <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <Switch
                                                checked={type.status === 1}
                                                handleClick={() => {
                                                    handleChangeStatus(type.id, type.name, type.status === 1 ? 0 : 1);
                                                }}
                                            />
                                        </td>
                                        <td className="min-w-[150px] px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link to={`edit/${type.id}`} state={{ type, isBirsta }}>
                                                    <EditIcon />
                                                </Link>
                                                <button type="button" onClick={() => handleOpenDelete(type.id)}>
                                                    <DeleteIcon />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenProductModal(type.id)}
                                                    title={t("AddProduct")}
                                                >
                                                    <IoAddCircleOutline className="text-mainColor text-2xl" />
                                                </button>
                                                {openDelete === type.id && (
                                                    <Dialog open={true} onClose={handleCloseDelete} className="relative z-10">
                                                        <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                                            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                                                <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                                                                    <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                                                        <Warning width="28" height="28" aria-hidden="true" />
                                                                        <div className="mt-2 text-center">
                                                                            {t("YouwilldeleteType")} {type?.name || "-"}
                                                                        </div>
                                                                    </div>
                                                                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                        <button
                                                                            className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                                                            onClick={() => handleDelete(type.id, type.name)}
                                                                        >
                                                                            {t("Delete")}
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            data-autofocus
                                                                            onClick={handleCloseDelete}
                                                                            className="inline-flex justify-center w-full px-4 py-3 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                                                                        >
                                                                            {t("Cancel")}
                                                                        </button>
                                                                    </div>
                                                                </DialogPanel>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                )}
                                                {openProductModal === type.id && (
                                                    <Dialog open={true} onClose={handleCloseProductModal} className="relative z-20">
                                                        <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                                        <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                                                            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                                                <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                                                                    <div className="px-6 pt-6 pb-5 sm:p-4">
                                                                        <DialogTitle as="h3" className="text-xl font-TextFontSemiBold text-mainColor mb-4">
                                                                            {t("AddProductsTo", { name: type.name })}
                                                                        </DialogTitle>
                                                                        <div className="flex flex-col gap-4">
                                                                            <div>
                                                                                <label className="block text-sm font-TextFontMedium text-gray-700 mb-1">
                                                                                    {t("SelectCategories")}
                                                                                </label>
                                                                                <MultiSelect
                                                                                    value={selectedCategories}
                                                                                    onChange={(e) => setSelectedCategories(e.value)}
                                                                                    options={categories}
                                                                                    optionLabel="name"
                                                                                    display="chip"
                                                                                    placeholder={t("SelectCategories")}
                                                                                    className="w-full bg-white text-mainColor border border-gray-300 rounded-md focus:ring-2 focus:ring-mainColor focus:border-mainColor"
                                                                                    filter
                                                                                    maxSelectedLabels={3}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-sm font-TextFontMedium text-gray-700 mb-1">
                                                                                    {t("SelectProducts")}
                                                                                </label>
                                                                                <MultiSelect
                                                                                    value={selectedProducts}
                                                                                    onChange={(e) => setSelectedProducts(e.value)}
                                                                                    options={filteredProducts}
                                                                                    optionLabel="name"
                                                                                    display="chip"
                                                                                    placeholder={selectedCategories.length > 0 ? t("SelectProducts") : t("SelectProductsOrCategory")}
                                                                                    className="w-full bg-white text-mainColor border border-gray-300 rounded-md focus:ring-2 focus:ring-mainColor focus:border-mainColor"
                                                                                    filter
                                                                                    maxSelectedLabels={3}
                                                                                    disabled={loadingPost}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="px-6 py-4 sm:flex sm:flex-row-reverse gap-3 bg-gray-50 rounded-b-lg">
                                                                        <SubmitButton
                                                                            text={loadingPost ? t("Submitting") : t("Submit")}
                                                                            rounded="rounded-md"
                                                                            handleClick={handleAddProducts}
                                                                            disabled={loadingPost || !selectedProducts.length}
                                                                            bgColor="bg-mainColor"
                                                                            hoverBgColor="hover:bg-mainColor-dark"
                                                                            Size="text-xl"
                                                                            className="px-6 py-2 text-sm font-TextFontSemiBold"
                                                                        />
                                                                        <StaticButton
                                                                            text={t("Cancel")}
                                                                            handleClick={handleCloseProductModal}
                                                                            bgColor="bg-white"
                                                                            Color="text-gray-900"
                                                                            border="border-2"
                                                                            borderColor="border-gray-300"
                                                                            rounded="rounded-md"
                                                                            Size="text-xl"
                                                                            className="px-6 py-2 text-sm font-TextFontMedium"
                                                                        />
                                                                    </div>
                                                                </DialogPanel>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {branchType.length > 0 && (
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page ? "bg-mainColor text-white" : "text-mainColor"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
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

export default KitchenType;