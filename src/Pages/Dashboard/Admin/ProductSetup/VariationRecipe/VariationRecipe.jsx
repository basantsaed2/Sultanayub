import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AddButton, LoaderLogin } from "../../../../../Components/Components";
import { IoArrowBack } from "react-icons/io5";

const VariationRecipe = () => {
    const { optionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const selectedLanguage = useSelector((state) => state.language?.selected ?? "en");
    const productName = location.state?.productName || "";

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const { refetch, loading, data } = useGet({
        url: `${apiUrl}/admin/variation_recipe/view_recipes/${optionId}?locale=${selectedLanguage}`,
    });

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        if (data && data.recipes) {
            setRecipes(data.recipes);
        }
    }, [data]);

    const headers = [
        t("ID"),
        t("Weight"),
        t("Status"),
        t("Variation"),
        t("Option"),
        t("Store Category"),
        t("Store Product"),
        t("Unit"),
    ];

    if (loading) {
        return <LoaderLogin />;
    }

    return (
        <div className="w-full flex flex-col gap-y-3 p-4">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm text-mainColor hover:bg-mainColor hover:text-white transition-all">
                        <IoArrowBack size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t("Variation Recipe")} {productName && <span>- <span className="text-mainColor">{productName}</span></span>}
                    </h1>
                </div>
            </div>

            <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b-2">
                        <tr>
                            {headers.map((name, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-center text-sm font-semibold text-mainColor uppercase tracking-wider"
                                >
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {recipes.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                                    {t("No recipes found")}
                                </td>
                            </tr>
                        ) : (
                            recipes.map((recipe, index) => (
                                <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.id}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.weight}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${recipe.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {recipe.status === 1 ? t("Active") : t("Inactive")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.variation}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.option}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.store_category?.name || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.store_product?.name || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {recipe.unit?.name || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VariationRecipe;
