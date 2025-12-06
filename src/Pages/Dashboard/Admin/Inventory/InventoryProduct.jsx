import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TitlePage, StaticLoader, SubmitButton, StaticButton } from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { t } from "i18next";

const InventoryProduct = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const auth = useAuth();

    const { data: storesData, loading: loadingStores } = useGet({
        url: `${apiUrl}/admin/inventory/product/lists`,
    });

    const { postData: loadStocks, loading: loadingStocks, response: rawStocksData } = usePost({
        url: `${apiUrl}/admin/inventory/product`,
    });

    const { postData: modifyQuantity, loading: loadingModifyQty } = usePost({
        url: `${apiUrl}/admin/inventory/product/modify_stocks`,
    });

    const { postData: modifyActual, loading: loadingModifyActual } = usePost({
        url: `${apiUrl}/admin/inventory/product/modify_actual`,
    });

    const [selectedStore, setSelectedStore] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const storeOptions = (storesData?.stores || []).map(store => ({
        value: store.id,
        label: store.name,
    }));

    // Load stocks when store changes
    useEffect(() => {
        if (selectedStore) {
            loadStocks({ store_id: selectedStore.value });
            setStocks([]); // Clear previous
            setSelectedRows([]);
        }
    }, [selectedStore]);

    // CRITICAL: Extract stocks correctly from Axios response
    useEffect(() => {
        if (rawStocksData && rawStocksData.data.stocks && Array.isArray(rawStocksData.data.stocks)) {
            setStocks(rawStocksData.data.stocks.map(item => ({
                ...item,
                isEdited: false
            })));
        } else if (rawStocksData && !rawStocksData.data.stocks) {
            console.warn("No stocks found or invalid response:", responseData);
            setStocks([]);
        }
    }, [rawStocksData]);

    // Rest of your handlers (unchanged)
    const handleInputChange = (id, field, value) => {
        setStocks(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value, isEdited: true } : item
            )
        );
    };

    const toggleRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedRows(selectedRows.length === stocks.length ? [] : stocks.map(s => s.id));
    };

    const saveQuantity = async () => {
        const selected = stocks.filter(s => selectedRows.includes(s.id));
        if (selected.length === 0) return auth.toastError(t("Select at least one row"));

        const formData = new FormData();
        selected.forEach((item, i) => {
            formData.append(`stocks[${i}][id]`, item.id);
            formData.append(`stocks[${i}][quantity]`, item.quantity || 0);
        });

        const success = await modifyQuantity(formData);
        if (success) {
            auth.toastSuccess(t("Quantity updated"));
            setSelectedRows([]);
        }
    };

    const saveActualQuantity = async () => {
        const selected = stocks.filter(s => selectedRows.includes(s.id));
        if (selected.length === 0) return auth.toastError(t("Select at least one row"));

        const formData = new FormData();
        selected.forEach((item, i) => {
            formData.append(`stocks[${i}][id]`, item.id);
            formData.append(`stocks[${i}][actual_quantity]`, item.actual_quantity || 0);
        });

        const success = await modifyActual(formData);
        if (success) {
            auth.toastSuccess(t("Actual quantity updated"));
            setSelectedRows([]);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <TitlePage text={t("Inventory Products")} />

            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <label className="block text-xl font-medium mb-4 text-thirdColor">
                    {t("Select Store")} <span className="text-red-500">*</span>
                </label>
                <Select
                    value={selectedStore}
                    onChange={setSelectedStore}
                    options={storeOptions}
                    isLoading={loadingStores}
                    placeholder={t("Choose a store...")}
                    isClearable
                    className="text-lg"
                />
            </div>

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
                    {t("No products found in this store")}
                </div>
            ) : (
                <>
                    {selectedRows.length > 0 && (
                        <div className="mb-6 p-5 bg-blue-50 border border-blue-300 rounded-xl flex justify-between items-center flex-wrap gap-4">
                            <span className="font-semibold text-blue-900">
                                {selectedRows.length} {t("items selected")}
                            </span>
                            <div className="flex gap-3">
                                <StaticButton
                                    text={loadingModifyQty ? t("Saving...") : t("Update Quantity")}
                                    handleClick={saveQuantity}
                                    bgColor="bg-blue-600 hover:bg-blue-700"
                                />
                                <StaticButton
                                    text={loadingModifyActual ? t("Saving...") : t("Update Actual Qty")}
                                    handleClick={saveActualQuantity}
                                    bgColor="bg-green-600 hover:bg-green-700"
                                />
                                <StaticButton
                                    text={t("Cancel")}
                                    handleClick={() => setSelectedRows([])}
                                    bgColor="bg-gray-300"
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.length === stocks.length && stocks.length > 0}
                                                onChange={selectAll}
                                                className="w-5 h-5 rounded border-gray-300"
                                            />
                                        </th>
                                        <th className="p-4 text-center text-mainColor font-medium">{t("Product")}</th>
                                        <th className="p-4 text-center text-mainColor font-medium">{t("Category")}</th>
                                        <th className="p-4 text-center text-mainColor font-medium">{t("Unit")}</th>
                                        <th className="p-4 text-center text-mainColor font-medium">{t("Quantity")}</th>
                                        <th className="p-4 text-center text-mainColor font-medium">{t("Actual Qty")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`border-b transition ${selectedRows.includes(item.id) ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                        >
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(item.id)}
                                                    onChange={() => toggleRow(item.id)}
                                                    className="w-5 h-5 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="p-4 text-center font-medium text-gray-800">
                                                {item.product || "—"}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {item.category || "—"}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {item.unit || "—"}
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="number"
                                                    value={item.quantity || 0}
                                                    onChange={(e) => handleInputChange(item.id, "quantity", e.target.value)}
                                                    className="w-24 px-3 py-2 border rounded-lg text-center font-medium border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="number"
                                                    value={item.actual_quantity || 0}
                                                    onChange={(e) => handleInputChange(item.id, "actual_quantity", e.target.value)}
                                                    className="w-24 px-3 py-2 border rounded-lg text-center font-medium border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
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

export default InventoryProduct;