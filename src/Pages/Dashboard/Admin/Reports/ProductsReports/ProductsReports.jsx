import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../../../../Hooks/useGet';
import { DateInput, StaticLoader } from '../../../../../Components/Components';

const ProductsReports = () => {
    const { t } = useTranslation();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Filter States
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [sort, setSort] = useState('desc');

    // Selected Category for Modal
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Construct URL with query params
    const getUrl = () => {
        const params = new URLSearchParams();
        if (sort) params.append('sort', sort);
        if (fromDate) params.append('from', fromDate);
        if (toDate) params.append('to', toDate);
        return `${apiUrl}/admin/reports/product_report?${params.toString()}`;
    };

    const { data, loading, refetch } = useGet({
        url: getUrl()
    });

    const reportData = data?.data || [];

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(reportData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = reportData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleApplyFilters = () => {
        refetch();
    };

    const handleShowProducts = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    return (
        <div className="w-full p-2 md:p-6 mb-20">
            <h1 className="mb-4 text-2xl font-bold text-mainColor">{t('Products Report')}</h1>

            {/* Filters Section */}
            <div className="p-4 mb-6 rounded-lg bg-gray-50">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-full md:w-1/4">
                        <DateInput
                            placeholder={t("From Date")}
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="w-full md:w-1/4">
                        <DateInput
                            placeholder={t("To Date")}
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="w-full md:w-1/4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">{t("Sort")}</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
                        >
                            <option value="asc">{t("Ascending")}</option>
                            <option value="desc">{t("Descending")}</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <button
                            onClick={handleApplyFilters}
                            className="w-full px-6 py-2.5 text-white bg-mainColor rounded-xl hover:bg-opacity-90 transition-colors"
                        >
                            {t("Apply")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Data Table */}
            {loading ? (
                <StaticLoader />
            ) : reportData.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                    {t("No data found")}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="overflow-x-auto bg-white rounded-xl shadow">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-thirdColor font-bold">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">{t("Category")}</th>
                                    <th className="px-6 py-4">{t("Products Count")}</th>
                                    <th className="px-6 py-4">{t("Total Price")}</th>
                                    <th className="px-6 py-4">{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{startIndex + index + 1}</td>
                                        <td className="px-6 py-4 font-semibold text-mainColor">{item.category}</td>
                                        <td className="px-6 py-4">{item.products_count}</td>
                                        <td className="px-6 py-4 font-mono">{item.products_price}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleShowProducts(item)}
                                                className="px-4 py-2 text-sm font-medium text-mainColor underline bg-secondaryColor rounded-lg hover:bg-opacity-90"
                                            >
                                                {t("Show Products")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                {t("<")}
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-mainColor text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                {t(">")}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Products Modal */}
            {isModalOpen && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-mainColor">
                                {selectedCategory.category} - {t("Products")}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 border-b">{t("ID")}</th>
                                        <th className="px-4 py-3 border-b">{t("Product Name")}</th>
                                        <th className="px-4 py-3 border-b">{t("Price")}</th>
                                        <th className="px-4 py-3 border-b">{t("Count")}</th>
                                        <th className="px-4 py-3 border-b">{t("Total")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedCategory.products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-500">{product.id}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{product.price}</td>
                                            <td className="px-4 py-3 text-gray-600">{product.count}</td>
                                            <td className="px-4 py-3 font-semibold text-mainColor">
                                                {(parseFloat(product.price || 0) * parseFloat(product.count || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 font-bold">
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-right text-gray-700">{t("Total")}:</td>
                                        <td className="px-4 py-3 text-mainColor">{selectedCategory.products_count}</td>
                                        <td className="px-4 py-3 text-mainColor">{selectedCategory.products_price}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                {t("Close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsReports;
