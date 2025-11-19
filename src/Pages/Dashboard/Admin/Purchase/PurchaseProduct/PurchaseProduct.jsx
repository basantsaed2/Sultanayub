import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Link } from "react-router-dom";
import {
    AddButton,
    StaticLoader,
    Switch,
    TitlePage,
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useDelete } from "../../../../../Hooks/useDelete";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { t } from "i18next";

const PurchaseProduct = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const {
        refetch: refetchPurchaseProduct,
        loading: loadingPurchaseProduct,
        data: dataPurchaseProduct,
    } = useGet({
        url: `${apiUrl}/admin/purchase_product`,
    });
    const { deleteData, loadingDelete, responseDelete } = useDelete();
    const { changeState, loadingChange, responseChange } = useChangeState();

    const [PurchaseProducts, setPurchaseProducts] = useState([]);
    const [openDelete, setOpenDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const PurchaseProductsPerPage = 20;

    const totalPages = Math.ceil(PurchaseProducts.length / PurchaseProductsPerPage);

    const currentPurchaseProducts = PurchaseProducts.slice(
        (currentPage - 1) * PurchaseProductsPerPage,
        currentPage * PurchaseProductsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Update PurchaseProducts when `data` changes
    useEffect(() => {
        if (dataPurchaseProduct && dataPurchaseProduct.products) {
            setPurchaseProducts(dataPurchaseProduct.products);
        }
    }, [dataPurchaseProduct]);

    // Change PurchaseProduct status
    const handleChangeStatus = async (id, name, status) => {
        const response = await changeState(
            `${apiUrl}/admin/purchase_product/status/${id}`,
            `${name} Changed Status.`,
            { status }
        );

        if (response) {
            setPurchaseProducts((prevPurchaseProducts) =>
                prevPurchaseProducts.map((PurchaseProduct) =>
                    PurchaseProduct.id === id ? { ...PurchaseProduct, status: status } : PurchaseProduct
                )
            );
        }
    };

    useEffect(() => {
        refetchPurchaseProduct();
    }, [refetchPurchaseProduct]);

    const handleOpenDelete = (item) => {
        setOpenDelete(item);
    };

    const handleCloseDelete = () => {
        setOpenDelete(null);
    };

    // Delete PurchaseProduct
    const handleDelete = async (id, name) => {
        const success = await deleteData(
            `${apiUrl}/admin/purchase_product/delete/${id}`,
            `${name} Deleted Success.`
        );

        if (success) {
            setPurchaseProducts(PurchaseProducts.filter((PurchaseProduct) => PurchaseProduct.id !== id));
        }
    };

    const headers = [
        t("SL"),
        t("Name"),
        t("Purchase Category"),
        t("Status"),
        t("Action"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
            {loadingPurchaseProduct || loadingChange || loadingDelete ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className='flex flex-col items-center justify-between md:flex-row'>
                        <div className='w-full md:w-1/2'>
                            <TitlePage text={t('Purchase Product')} />
                        </div>
                        <div className='flex justify-end w-full py-4 md:w-1/2'>
                            <Link to='add'>
                                <AddButton Text={t("Add")} />
                            </Link>
                        </div>
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
                            {PurchaseProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="text-xl text-center text-mainColor font-TextFontMedium "
                                    >
                                        {t("No Purchase Products Found")}
                                    </td>
                                </tr>
                            ) : (
                                currentPurchaseProducts.map((PurchaseProduct, index) => (
                                    <tr className="w-full border-b-2" key={index}>
                                        <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {(currentPage - 1) * PurchaseProductsPerPage + index + 1}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {PurchaseProduct?.name || "-"}
                                        </td>
                                          <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {PurchaseProduct.category || "-"}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <Switch
                                                checked={PurchaseProduct.status === 1}
                                                handleClick={() => {
                                                    handleChangeStatus(
                                                        PurchaseProduct.id,
                                                        PurchaseProduct.name,
                                                        PurchaseProduct.status === 1 ? 0 : 1
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link to={`edit/${PurchaseProduct.id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenDelete(PurchaseProduct.id)}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                                {openDelete === PurchaseProduct.id && (
                                                    <Dialog
                                                        open={true}
                                                        onClose={handleCloseDelete}
                                                        className="relative z-10"
                                                    >
                                                        <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                                            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                                                <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                                                                    <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                                                        <Warning
                                                                            width="28"
                                                                            height="28"
                                                                            aria-hidden="true"
                                                                        />
                                                                        <div className="flex items-center">
                                                                            <div className="mt-2 text-center">
                                                                                {t("You will delete")} {PurchaseProduct.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                        <button
                                                                            className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                                                            onClick={() =>
                                                                                handleDelete(PurchaseProduct.id, PurchaseProduct.name)
                                                                            }
                                                                        >
                                                                            {t("Delete")}
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            data-autofocus
                                                                            onClick={handleCloseDelete}
                                                                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                                                                        >
                                                                            {t("Cancel")}
                                                                        </button>
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

                    {PurchaseProducts.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center my-6 gap-x-4">
                            {currentPage !== 1 && (
                                <button
                                    type="button"
                                    className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Prev
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
                                    Next
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PurchaseProduct;