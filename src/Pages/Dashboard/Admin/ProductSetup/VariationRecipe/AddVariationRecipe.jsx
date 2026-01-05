import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IoArrowBack, IoAddCircle, IoTrash, IoSave } from "react-icons/io5";
import { useGet } from "../../../../../Hooks/useGet";
import { usePost } from "../../../../../Hooks/usePostJson";
import { toast } from "react-toastify";
import { LoaderLogin } from "../../../../../Components/Components";

const AddVariationRecipe = () => {
    const { productId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const selectedLanguage = useSelector((state) => state.language?.selected ?? "en");
    const productName = location.state?.productName || "";
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Fetch Variations and Options
    const { data: variationsData, loading: loadingVariations } = useGet({
        url: `${apiUrl}/admin/variation_recipe/view_variations/${productId}?locale=${selectedLanguage}`,
    });

    // Fetch form data (categories, products, units)
    const { data: formData, loading: loadingForm } = useGet({
        url: `${apiUrl}/admin/variation_recipe/lists?locale=${selectedLanguage}`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/variation_recipe/add`, // Verify if this endpoint supports bulk
    });

    const [storeCategories, setStoreCategories] = useState([]);
    const [storeProducts, setStoreProducts] = useState([]);
    const [units, setUnits] = useState([]);

    // State to hold recipes for each option: { [optionId]: [recipe1, recipe2] }
    const [recipesByOption, setRecipesByOption] = useState({});

    useEffect(() => {
        if (formData) {
            setStoreCategories(formData.store_categories || []);
            setStoreProducts(formData.store_products || []);
            setUnits(formData.units || []);
        }
    }, [formData]);

    useEffect(() => {
        if (response) {
            toast.success(t("Recipes added successfully"));
            navigate(-1);
        }
    }, [response, navigate, t]);

    // Helper to create a new empty recipe object
    const createEmptyRecipe = () => ({
        store_category_id: "",
        store_product_id: "",
        unit_id: "",
        weight: "",
        status: 1,
    });

    // Add a recipe row for a specific option
    const addRecipeRow = (optionId) => {
        setRecipesByOption(prev => ({
            ...prev,
            [optionId]: [...(prev[optionId] || []), createEmptyRecipe()]
        }));
    };

    // Remove a recipe row
    const removeRecipeRow = (optionId, index) => {
        setRecipesByOption(prev => ({
            ...prev,
            [optionId]: prev[optionId].filter((_, i) => i !== index)
        }));
    };

    // Update a recipe field
    const updateRecipeField = (optionId, index, field, value) => {
        setRecipesByOption(prev => {
            const updatedRecipes = [...(prev[optionId] || [])];
            updatedRecipes[index] = { ...updatedRecipes[index], [field]: value };
            return { ...prev, [optionId]: updatedRecipes };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        let payloadIndex = 0;

        if (!variationsData?.variations) return;

        // Flatten options list to map to 'variations' array in payload
        variationsData.variations.forEach(variation => {
            variation.options?.forEach(option => {
                const recipes = recipesByOption[option.id];
                if (recipes && recipes.length > 0) {
                    // Set variations[i][id] to Option ID
                    formDataToSend.append(`variations[${payloadIndex}][id]`, variation.id);

                    recipes.forEach((recipe, rIndex) => {
                        formDataToSend.append(`variations[${payloadIndex}][options][${rIndex}][store_category_id]`, recipe.store_category_id);
                        formDataToSend.append(`variations[${payloadIndex}][options][${rIndex}][store_product_id]`, recipe.store_product_id);
                        formDataToSend.append(`variations[${payloadIndex}][options][${rIndex}][unit_id]`, recipe.unit_id);
                        formDataToSend.append(`variations[${payloadIndex}][options][${rIndex}][weight]`, recipe.weight);
                        formDataToSend.append(`variations[${payloadIndex}][options][${rIndex}][status]`, recipe.status);
                        // Reciepe ID is required by backend, send 0 for new
                        formDataToSend.append(`variations[${payloadIndex}][options][${rIndex}][id]`, option.id);
                    });

                    payloadIndex++;
                }
            });
        });

        if (payloadIndex === 0) {
            toast.warn(t("Please add at least one recipe"));
            return;
        }

        postData(formDataToSend);
    };

    if (loadingVariations || loadingForm || loadingPost) return <LoaderLogin />;

    return (
        <div className="w-full flex flex-col gap-y-3 p-4">
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white rounded-xl shadow-sm text-mainColor hover:bg-mainColor hover:text-white transition-all"
                >
                    <IoArrowBack size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">
                    {t("Add Recipes")} {productName && <span>- <span className="text-mainColor">{productName}</span></span>}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {variationsData?.variations?.map((variation) => (
                    <div key={variation.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <h2 className="text-lg font-bold text-gray-700">{variation.name}</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            {variation.options?.map((option) => (
                                <div key={option.id} className="border-l-4 border-mainColor pl-4 ml-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-800">{option.name}</h3>
                                        <button
                                            type="button"
                                            onClick={() => addRecipeRow(option.id)}
                                            className="text-sm flex items-center gap-1 text-mainColor hover:underline"
                                        >
                                            <IoAddCircle size={18} /> {t("Add Recipe")}
                                        </button>
                                    </div>

                                    {/* Recipes List for this Option */}
                                    <div className="flex flex-col gap-3">
                                        {recipesByOption[option.id]?.map((recipe, idx) => (
                                            <div key={idx} className="flex flex-wrap items-end gap-3 p-3 bg-gray-50 rounded border animate-fade-in relative pr-10">
                                                {/* Fields */}
                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="text-xs text-gray-500 mb-1 block">{t("Category")}</label>
                                                    <select
                                                        value={recipe.store_category_id}
                                                        onChange={(e) => updateRecipeField(option.id, idx, "store_category_id", e.target.value)}
                                                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-mainColor focus:outline-none"
                                                        required
                                                    >
                                                        <option value="">{t("Select")}</option>
                                                        {storeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="text-xs text-gray-500 mb-1 block">{t("Product")}</label>
                                                    <select
                                                        value={recipe.store_product_id}
                                                        onChange={(e) => updateRecipeField(option.id, idx, "store_product_id", e.target.value)}
                                                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-mainColor focus:outline-none"
                                                        required
                                                    >
                                                        <option value="">{t("Select")}</option>
                                                        {storeProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex-1 min-w-[100px]">
                                                    <label className="text-xs text-gray-500 mb-1 block">{t("Unit")}</label>
                                                    <select
                                                        value={recipe.unit_id}
                                                        onChange={(e) => updateRecipeField(option.id, idx, "unit_id", e.target.value)}
                                                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-mainColor focus:outline-none"
                                                        required
                                                    >
                                                        <option value="">{t("Select")}</option>
                                                        {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-[100px]">
                                                    <label className="text-xs text-gray-500 mb-1 block">{t("Weight")}</label>
                                                    <input
                                                        type="number"
                                                        value={recipe.weight}
                                                        onChange={(e) => updateRecipeField(option.id, idx, "weight", e.target.value)}
                                                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-mainColor focus:outline-none"
                                                        placeholder="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-[100px]">
                                                    <label className="text-xs text-gray-500 mb-1 block">{t("Status")}</label>
                                                    <select
                                                        value={recipe.status}
                                                        onChange={(e) => updateRecipeField(option.id, idx, "status", e.target.value)}
                                                        className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-mainColor focus:outline-none"
                                                    >
                                                        <option value={1}>{t("Active")}</option>
                                                        <option value={0}>{t("Inactive")}</option>
                                                    </select>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeRecipeRow(option.id, idx)}
                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                >
                                                    <IoTrash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!recipesByOption[option.id] || recipesByOption[option.id].length === 0) && (
                                            <p className="text-sm text-gray-400 italic">{t("No recipes added yet")}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </form>

            <div className="fixed bottom-6 right-6">
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-mainColor text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-all font-bold text-lg"
                >
                    <IoSave size={24} />
                    {t("Save All Changes")}
                </button>
            </div>
        </div>
    );
};

export default AddVariationRecipe;
