import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TitlePage, StaticLoader, SubmitButton, StaticButton } from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { t } from "i18next";

const InventoryMaterial = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const auth = useAuth();

    // Fetch stores for dropdown
    const { data: storesData, loading: loadingStores } = useGet({
        url: `${apiUrl}/admin/inventory/material/lists`,
    });

    // Load stocks
    const { postData: loadStocks, loading: loadingStocks, response: stocksData } = usePost({
        url: `${apiUrl}/admin/inventory/material`,
    });

    // Modify quantity & actual_quantity
    const { postData: modifyQuantity, loading: loadingModifyQty } = usePost({
        url: `${apiUrl}/admin/inventory/material/modify_stocks`,
    });

    const { postData: modifyActual, loading: loadingModifyActual } = usePost({
        url: `${apiUrl}/admin/inventory/material/modify_actual`,
    });

    const [selectedStore, setSelectedStore] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    // Store options for React Select
    const storeOptions = (storesData?.stores || []).map(store => ({
        value: store.id,
        label: store.name,
    }));

    // Load stocks when store changes
    useEffect(() => {
        if (selectedStore) {
            loadStocks({ store_id: selectedStore.value });
        }
    }, [selectedStore]);

    // Update stocks state
    useEffect(() => {
        if (stocksData && stocksData.data?.stocks && !loadingStocks && selectedStore) {
            setStocks(stocksData.data.stocks.map(item => ({ ...item, isEdited: false })));
        }
    }, [stocksData, loadingStocks, selectedStore]);

    // Handle input change
    const handleInputChange = (id, field, value) => {
        setStocks(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, [field]: value, isEdited: true }
                    : item
            )
        );
    };

    // Toggle row selection
    const toggleRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Select all
    const selectAll = () => {
        if (selectedRows.length === stocks.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(stocks.map(s => s.id));
        }
    };

    // Save Quantity for selected rows
    const saveQuantity = async () => {
        const selectedStocks = stocks
            .filter(s => selectedRows.includes(s.id))
            .map(s => ({ id: s.id, quantity: s.quantity }));

        if (selectedStocks.length === 0) {
            auth.toastError(t("Please select at least one row"));
            return;
        }

        const formData = new FormData();
        selectedStocks.forEach((item, i) => {
            formData.append(`stocks[${i}][id]`, item.id);
            formData.append(`stocks[${i}][quantity]`, item.quantity);
        });

        const success = await modifyQuantity(formData);
        if (success) {
            auth.toastSuccess(t("Quantity updated successfully"));
            setSelectedRows([]);
        }
    };

    // Save Actual Quantity
    const saveActualQuantity = async () => {
        const selectedStocks = stocks
            .filter(s => selectedRows.includes(s.id))
            .map(s => ({ id: s.id, actual_quantity: s.actual_quantity }));

        if (selectedStocks.length === 0) {
            auth.toastError(t("Please select at least one row"));
            return;
        }

        const formData = new FormData();
        selectedStocks.forEach((item, i) => {
            formData.append(`stocks[${i}][id]`, item.id);
            formData.append(`stocks[${i}][actual_quantity]`, item.actual_quantity);
        });

        const success = await modifyActual(formData);
        if (success) {
            auth.toastSuccess(t("Actual quantity updated successfully"));
            setSelectedRows([]);
        }
    };

    const selectStyles = {
        control: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            padding: "0.5rem",
            borderColor: "#D1D5DB",
            boxShadow: "none",
            "&:hover": { borderColor: "#9CA3AF" },
        }),
    };

    return (
        <div className="p-4 w-full">
            <TitlePage text={t("Inventory Materials")} />

            {/* Store Selector */}
            <div className="mb-8 bg-white shadow-lg rounded-2xl p-6">
                <label className="block text-xl font-medium text-thirdColor mb-3">
                    {t("Select Store")} <span className="text-red-500">*</span>
                </label>
                <Select
                    value={selectedStore}
                    onChange={setSelectedStore}
                    options={storeOptions}
                    placeholder={t("Choose a store...")}
                    isLoading={loadingStores}
                    isClearable
                    styles={selectStyles}
                    className="text-lg"
                />
            </div>

            {/* Loading or No Data */}
            {loadingStocks ? (
                <div className="flex justify-center py-20">
                    <StaticLoader />
                </div>
            ) : !selectedStore ? (
                <div className="text-center py-20 text-gray-500 text-xl">
                    {t("Please select a store to view inventory")}
                </div>
            ) : stocks.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xl">
                    {t("No materials found in this store")}
                </div>
            ) : (
                <>
                    {/* Bulk Actions */}
                    {selectedRows.length > 0 && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                            <span className="text-lg font-medium text-blue-900">
                                {selectedRows.length} {t("items selected")}
                            </span>
                            <div className="flex gap-3">
                                <StaticButton
                                    text={loadingModifyQty ? t("Saving...") : t("Update Quantity")}
                                    handleClick={saveQuantity}
                                    disabled={loadingModifyQty}
                                />
                                <StaticButton
                                    text={loadingModifyActual ? t("Saving...") : t("Update Actual Qty")}
                                    handleClick={saveActualQuantity}
                                    disabled={loadingModifyActual}
                                    bgColor="bg-green-600 hover:bg-green-700"
                                />
                                <StaticButton
                                    text={t("Cancel")}
                                    handleClick={() => setSelectedRows([])}
                                    bgColor="bg-gray-300"
                                    Color="text-gray-700"
                                />
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.length === stocks.length && stocks.length > 0}
                                                onChange={selectAll}
                                                className="w-5 h-5 rounded border-gray-300"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-center text-mainColor font-medium">{t("Material")}</th>
                                        <th className="px-6 py-4 text-center text-mainColor font-medium">{t("Category")}</th>
                                        <th className="px-6 py-4 text-center text-mainColor font-medium">{t("Unit")}</th>
                                        <th className="px-6 py-4 text-center text-mainColor font-medium">{t("Quantity")}</th>
                                        <th className="px-6 py-4 text-center text-mainColor font-medium">{t("Actual Quantity")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`border-b hover:bg-gray-50 ${selectedRows.includes(item.id) ? "bg-blue-50" : ""}`}
                                        >
                                            <td className="text-center py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(item.id)}
                                                    onChange={() => toggleRow(item.id)}
                                                    className="w-5 h-5 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="text-center py-4 font-medium text-gray-800">{item.material}</td>
                                            <td className="text-center py-4 text-gray-600">{item.category}</td>
                                            <td className="text-center py-4 text-gray-600">{item.unit}</td>
                                            <td className="text-center py-4">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleInputChange(item.id, "quantity", e.target.value)}
                                                    className={`w-24 px-3 py-2 border rounded-lg text-center font-medium ${item.isEdited ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                                                />
                                            </td>
                                            <td className="text-center py-4">
                                                <input
                                                    type="number"
                                                    value={item.actual_quantity}
                                                    onChange={(e) => handleInputChange(item.id, "actual_quantity", e.target.value)}
                                                    className={`w-24 px-3 py-2 border rounded-lg text-center font-medium ${item.isEdited ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InventoryMaterial;