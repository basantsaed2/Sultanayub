import React, { useState, useEffect } from "react";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { LoaderLogin, StaticLoader, TitlePage } from "../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { IoSave, IoFastFood, IoBicycle, IoRestaurant, IoPencil, IoClose } from "react-icons/io5";

const PricingProduct = () => {
    const { t } = useTranslation();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // State
    const [activeTab, setActiveTab] = useState("take_away");
    const [products, setProducts] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null); // ID of row currently being edited
    const [editPrice, setEditPrice] = useState(""); // Temporary state for price being edited
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // Constants
    const itemsPerPage = 10;

    // Fetch Data
    const { refetch, loading, data } = useGet({
        url: `${apiUrl}/admin/product_pos_pricing/${activeTab}`,
    });

    // Update Hook
    const { postData, loadingPost } = usePost({
        url: `${apiUrl}/admin/product_pos_pricing/update`,
    });

    useEffect(() => {
        if (data && data.product_pricing) {
            setProducts(data.product_pricing);
            setEditingRowId(null);
            setEditPrice("");
        }
    }, [data, activeTab]);

    // Handle Tab Change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchQuery(""); // Reset search on tab change
    };

    // Filter Logic
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentItems = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEditClick = (product) => {
        setEditingRowId(product.id);
        setEditPrice(product.price);
    };

    const handleCancelClick = () => {
        setEditingRowId(null);
        setEditPrice("");
    };

    const handleUpdate = async (id) => {
        if (!editPrice) return;

        const formData = new FormData();
        formData.append("module", activeTab);
        formData.append("product_id", id);
        formData.append("price", editPrice);

        await postData(formData, t("Price Updated Successfully"));
        refetch();
        setEditingRowId(null);
        setEditPrice("");
    };

    const tabs = [
        { id: "take_away", label: t("Take Away"), icon: <IoFastFood /> },
        { id: "delivery", label: t("Delivery"), icon: <IoBicycle /> },
        { id: "dine_in", label: t("Dine In"), icon: <IoRestaurant /> },
    ];

    return (
        <div className="p-4 md:p-6 w-full min-h-screen bg-gray-50/50 flex flex-col gap-6">
            <TitlePage text={t("Product POS Pricing")} />

            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex flex-wrap gap-4 bg-white p-2 rounded-2xl shadow-sm w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                                ? "bg-mainColor text-white shadow-md"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={t("Search by product name...")}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-80 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Content Content */}
            <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoaderLogin />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto p-4">
                            <table className="w-full min-w-[600px] border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">{t("SL")}</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">{t("Product Name")}</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">{t("Price")}</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">{t("Action")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                {t("No products found")}
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((product, index) => {
                                            const isEditing = editingRowId === product.id;
                                            return (
                                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-lg text-mainColor font-bold">
                                                        {isEditing ? (
                                                            <div className="flex justify-center">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={editPrice}
                                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                                    className="w-32 px-3 py-2 border border-red-400 rounded-lg text-center text-gray-900 font-bold focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all shadow-sm"
                                                                    autoFocus
                                                                />
                                                            </div>
                                                        ) : (
                                                            product.price
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleUpdate(product.id)}
                                                                        disabled={loadingPost}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                                                    >
                                                                        {loadingPost ? <StaticLoader /> : <IoSave size={18} />}
                                                                        <span className="text-sm font-bold">{t("Save")}</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelClick}
                                                                        disabled={loadingPost}
                                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all shadow-sm"
                                                                    >
                                                                        <IoClose size={20} />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleEditClick(product)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all shadow-sm border border-red-200"
                                                                >
                                                                    <IoPencil size={18} />
                                                                    <span className="text-sm font-bold">{t("Update")}</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 py-6 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    {t("Prev")}
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => {
                                        // Simple pagination logic to avoid too many buttons
                                        // Show first, last, current, and neighbors
                                        if (
                                            i + 1 === 1 ||
                                            i + 1 === totalPages ||
                                            (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${currentPage === i + 1
                                                        ? "bg-mainColor text-white"
                                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            );
                                        } else if (
                                            (i + 1 === currentPage - 2 && currentPage > 3) ||
                                            (i + 1 === currentPage + 2 && currentPage < totalPages - 2)
                                        ) {
                                            return <span key={i} className="px-1 text-gray-400">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PricingProduct;
