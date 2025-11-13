import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    AddButton,
    StaticLoader,
    Switch,
    TitlePage,
} from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { t } from "i18next";

const ManufacturingHistory = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const {
        refetch: refetchManufacturing,
        loading: loadingManufacturing,
        data: dataManufacturing,
    } = useGet({
        url: `${apiUrl}/admin/manufacturing/manufacturing_history`,
    });

    const [Manufacturings, setManufacturings] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const ManufacturingsPerPage = 20;

    const totalPages = Math.ceil(Manufacturings.length / ManufacturingsPerPage);

    const currentManufacturings = Manufacturings.slice(
        (currentPage - 1) * ManufacturingsPerPage,
        currentPage * ManufacturingsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Update Manufacturings when `data` changes
    useEffect(() => {
        if (dataManufacturing && dataManufacturing.maufaturing) {
            setManufacturings(dataManufacturing.maufaturing);
        }
    }, [dataManufacturing]);

    useEffect(() => {
        refetchManufacturing();
    }, [refetchManufacturing]);

    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const headers = [
        t("SL"),
        t("Product"),
        t("Store"),
        t("Quantity"),
        t("Date"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
            {loadingManufacturing ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className='flex flex-col items-center justify-between md:flex-row'>
                        <div className='w-full md:w-1/2'>
                            <TitlePage text={t('Manufacturing History')} />
                        </div>
                        <div className='flex justify-end w-full py-4 md:w-1/2'>
                            <Link to='add'>
                                <AddButton Text={t("Add Manufacturing")} />
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
                            {Manufacturings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="text-xl text-center text-mainColor font-TextFontMedium "
                                    >
                                        {t("No Manufacturing Found")}
                                    </td>
                                </tr>
                            ) : (
                                currentManufacturings.map((manufacturing, index) => (
                                    <tr className="w-full border-b-2" key={manufacturing.id}>
                                        <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {(currentPage - 1) * ManufacturingsPerPage + index + 1}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {manufacturing?.product || "-"}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {manufacturing?.store || "-"}
                                        </td>
                                        <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {manufacturing?.quantity || "0"}
                                        </td>
                                        <td className="min-w-[200px] sm:min-w-[150px] sm:w-3/12 lg:w-3/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {manufacturing?.date ? formatDate(manufacturing.date) : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {Manufacturings.length > 0 && (
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

export default ManufacturingHistory;