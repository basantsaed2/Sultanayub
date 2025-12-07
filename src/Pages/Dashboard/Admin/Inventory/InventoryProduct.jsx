import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TitlePage, StaticLoader } from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { t } from "i18next";
import { FiPackage, FiClock, FiFileText, FiFile, FiDownload } from "react-icons/fi";

// PDF & Export Libraries (WORKING!)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const InventoryProduct = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const auth = useAuth();

    const [activeTab] = useState("count");

    const { data: listsData, loading: loadingLists } = useGet({
        url: `${apiUrl}/admin/inventory/product/lists`,
    });

    const { postData: loadStocks, loading: loadingStocks, response: rawStocksData } = usePost({
        url: `${apiUrl}/admin/inventory/product`,
    });

    const { postData: modifyQuantity } = usePost({ url: `${apiUrl}/admin/inventory/product/modify_stocks` });
    const { postData: modifyActual } = usePost({ url: `${apiUrl}/admin/inventory/product/modify_actual` });

    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editQuantityMode, setEditQuantityMode] = useState(false);
    const [editActualMode, setEditActualMode] = useState(false);

    const storeOptions = (listsData?.stores || []).map(s => ({ value: s.id, label: s.name }));
    const categoryOptions = (listsData?.categories || []).map(c => ({ value: c.id, label: c.name }));
    const filteredProducts = (listsData?.products || [])
        .filter(p => selectedCategory ? p.category_id === selectedCategory.value : true)
        .map(p => ({ value: p.id, label: p.name }));

    useEffect(() => {
        if (selectedStore && selectedProducts.length > 0) {
            const payload = { store_id: selectedStore.value };
            selectedProducts.forEach((p, i) => payload[`products[${i}]`] = p.value);
            loadStocks(payload);
            setSelectedRows([]);
            setEditQuantityMode(false);
            setEditActualMode(false);
        }
    }, [selectedStore, selectedProducts]);

    useEffect(() => {
        const data = rawStocksData?.data?.stocks || rawStocksData?.stocks;
        if (data && Array.isArray(data)) {
            setStocks(data.map(item => ({
                ...item,
                isEdited: false,
                quantity: item.quantity ?? 0,
                actual_quantity: item.actual_quantity ?? 0,
                inability: item.inability ?? null
            })));
        }
    }, [rawStocksData]);

    const toggleRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedRows(selectedRows.length === stocks.length ? [] : stocks.map(s => s.id));
    };

    const handleInputChange = (id, field, value) => {
        setStocks(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value, isEdited: true } : item
            )
        );
    };

    const saveQuantity = async () => {
        const changed = stocks.filter(s => selectedRows.includes(s.id) && s.isEdited);
        if (changed.length === 0) return auth.toastError(t("No changes"));

        const formData = new FormData();
        changed.forEach((item, i) => {
            formData.append(`stocks[${i}][id]`, item.id);
            formData.append(`stocks[${i}][quantity]`, item.quantity);
        });

        const success = await modifyQuantity(formData);
        if (success) {
            auth.toastSuccess(t("Quantity updated"));
            setEditQuantityMode(false);
            setSelectedRows([]);
        }
    };

    const saveActualQuantity = async () => {
        const changed = stocks.filter(s => selectedRows.includes(s.id) && s.isEdited);
        if (changed.length === 0) return auth.toastError(t("No changes"));

        const formData = new FormData();
        changed.forEach((item, i) => {
            formData.append(`stocks[${i}][id]`, item.id);
            formData.append(`stocks[${i}][actual_quantity]`, item.actual_quantity);
        });

        const success = await modifyActual(formData);
        if (success) {
            auth.toastSuccess(t("Actual quantity updated"));
            setEditActualMode(false);
            setSelectedRows([]);
        }
    };

    // EXPORT ONLY SELECTED ROWS (or all if none selected)
    const getExportData = () => selectedRows.length === 0 ? stocks : stocks.filter(s => selectedRows.includes(s.id));

    const exportPDF = () => {
        const data = getExportData();
        const doc = new jsPDF("p", "mm", "a4");
        doc.setFontSize(18);
        doc.text("Inventory Products Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Store: ${selectedStore?.label || "—"}`, 14, 30);
        doc.text(`Exported: ${data.length} item${data.length !== 1 ? "s" : ""}`, 14, 37);

        autoTable(doc, {
            head: [["Product", "Category", "Unit", "Quantity", "Actual Qty", "Quantity Shortage"]],
            body: data.map(s => [
                s.product || "—",
                s.category || "—",
                s.unit || "—",
                s.quantity,
                s.actual_quantity,
                s.inability !== undefined && s.inability !== null ? s.inability.toString() : "—"
            ]),
            startY: 45,
            theme: "grid",
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            styles: { fontSize: 10 },
        });

        doc.save(`inventory_products_${selectedStore?.label || "all"}_${new Date().toISOString().split("T")[0]}.pdf`);
    };

    const exportExcel = () => {
        const data = getExportData();
        const ws = XLSX.utils.json_to_sheet(data.map(s => ({
            Product: s.product || "—",
            Category: s.category || "—",
            Unit: s.unit || "—",
            Quantity: s.quantity,
            "Actual Qty": s.actual_quantity,
            "Quantity Shortage": s.inability ?? "—"
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, `inventory_products_${selectedStore?.label || "all"}_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    const exportCSV = () => {
        const data = getExportData();
        const csv = Papa.unparse(data.map(s => ({
            Product: s.product || "—",
            Category: s.category || "—",
            Unit: s.unit || "—",
            Quantity: s.quantity,
            "Actual Qty": s.actual_quantity,
            "Quantity Shortage": s.inability ?? "—"
        })));
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `inventory_products_${selectedStore?.label || "all"}_${new Date().toISOString().split("T")[0]}.csv`);
    };

    return (
        <div className="p-6 w-full">
            <TitlePage text={t("Inventory Products")} />

            {/* Tabs */}
            <div className="flex gap-8 mb-10 border-b-2 border-gray-200">
                <button className="flex items-center gap-3 pb-4 text-lg font-semibold text-mainColor border-b-4 border-mainColor">
                    <FiPackage size={22} /> {t("Count Stock")}
                </button>
                <button className="flex items-center gap-3 pb-4 text-lg font-semibold text-gray-500">
                    <FiClock size={22} /> {t("History")}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-md p-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">{t("Store")} *</label>
                    <Select value={selectedStore} onChange={setSelectedStore} options={storeOptions} placeholder={t("Select store")} isLoading={loadingLists} isClearable />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">{t("Category")}</label>
                    <Select value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} placeholder={t("All categories")} isClearable />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">{t("Products")} *</label>
                    <Select
                        isMulti
                        value={selectedProducts}
                        onChange={setSelectedProducts}
                        options={filteredProducts}
                        placeholder={t("Select products")}
                        closeMenuOnSelect={false}
                        isDisabled={!selectedStore}
                    />
                    {selectedProducts.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">{selectedProducts.length} {t("selected")}</p>
                    )}
                </div>
            </div>

            {/* Edit Mode & Export */}
            {stocks.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div className="flex gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editQuantityMode}
                                onChange={(e) => {
                                    setEditQuantityMode(e.target.checked);
                                    if (!e.target.checked) setEditActualMode(false);
                                    setSelectedRows([]);
                                }}
                                className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-lg font-medium flex items-center gap-2">
                                <FiPackage /> {t("Edit Quantity")}
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editActualMode}
                                onChange={(e) => {
                                    setEditActualMode(e.target.checked);
                                    if (!e.target.checked) setEditQuantityMode(false);
                                    setSelectedRows([]);
                                }}
                                className="w-6 h-6 text-green-600 rounded focus:ring-green-500"
                            />
                            <span className="text-lg font-medium flex items-center gap-2">
                                <FiPackage /> {t("Edit Actual Qty")}
                            </span>
                        </label>

                        {(editQuantityMode || editActualMode) && selectedRows.length > 0 && (
                            <div className="flex gap-3">
                                {editQuantityMode && (
                                    <button onClick={saveQuantity} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                                        {t("Save Quantity")}
                                    </button>
                                )}
                                {editActualMode && (
                                    <button onClick={saveActualQuantity} className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                                        {t("Save Actual Qty")}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Export Buttons with Selected Count */}
                    <div className="flex items-center gap-4">
                        {selectedRows.length > 0 && (
                            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                                {selectedRows.length} {t("selected")}
                            </span>
                        )}
                        <div className="flex gap-3">
                            <button onClick={exportPDF} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg" title="Download PDF">
                                <FiFileText size={20} />
                            </button>
                            <button onClick={exportExcel} className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg" title="Download Excel">
                                <FiFile size={20} />
                            </button>
                            <button onClick={exportCSV} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg" title="Download CSV">
                                <FiDownload size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            {loadingStocks ? (
                <div className="flex justify-center py-20"><StaticLoader /></div>
            ) : !selectedStore || selectedProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xl bg-gray-50 rounded-2xl">
                    {t("Please select a store and products")}
                </div>
            ) : stocks.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xl bg-gray-50 rounded-2xl">
                    {t("No products found")}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={selectedRows.length === stocks.length} onChange={selectAll} className="w-5 h-5 rounded" />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">{t("Product")}</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">{t("Category")}</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">{t("Unit")}</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">{t("Quantity")}</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">{t("Actual Qty")}</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">{t("Quantity Shortage")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stocks.map((item) => {
                                    const isSelected = selectedRows.includes(item.id);
                                    const canEditQty = editQuantityMode && isSelected;
                                    const canEditActual = editActualMode && isSelected;

                                    return (
                                        <tr key={item.id} className={`hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}>
                                            <td className="px-4 py-5 text-center">
                                                <input type="checkbox" checked={isSelected} onChange={() => toggleRow(item.id)} className="w-5 h-5 rounded" />
                                            </td>
                                            <td className="px-6 py-5 font-medium text-gray-900">{item.product || "—"}</td>
                                            <td className="px-6 py-5 text-gray-600">{item.category || "—"}</td>
                                            <td className="px-6 py-5 text-gray-600">{item.unit || "—"}</td>
                                            <td className="px-6 py-5">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    readOnly={!canEditQty}
                                                    onChange={(e) => handleInputChange(item.id, "quantity", e.target.value)}
                                                    className={`w-28 px-3 py-2 border rounded-lg text-center font-medium transition ${canEditQty ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100 cursor-not-allowed"}`}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <input
                                                    type="number"
                                                    value={item.actual_quantity}
                                                    readOnly={!canEditActual}
                                                    onChange={(e) => handleInputChange(item.id, "actual_quantity", e.target.value)}
                                                    className={`w-28 px-3 py-2 border rounded-lg text-center font-medium transition ${canEditActual ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-100 cursor-not-allowed"}`}
                                                />
                                            </td>
                                            <td className={`px-6 py-5 font-bold text-center ${item.inability >= 0 ? "text-green-600" : item.inability < 0 ? "text-red-600" : "text-gray-500"}`}>
                                                {item.inability !== undefined && item.inability !== null ? item.inability : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryProduct;