import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import {
    StaticLoader,
    Switch,
    TitlePage,
    TextInput,
    AddButton,
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useAuth } from "../../../../../Context/Auth";
import { t } from "i18next";
import { IoArrowBack } from "react-icons/io5";
import { EditIcon, DeleteIcon } from "../../../../../Assets/Icons/AllIcons";

const Recipes = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();

    const {
        refetch: refetchRecipes,
        loading: loadingRecipes,
        data: dataRecipes,
    } = useGet({
        url: `${apiUrl}/admin/recipe/${productId}`,
    });

    const { changeState, loadingChange } = useChangeState();
    const auth = useAuth();

    const [recipes, setRecipes] = useState([]);
    const [productName, setProductName] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 20;

    // Calculate total number of pages
    const totalPages = Math.ceil(recipes.length / recipesPerPage);

    // Get the recipes for the current page
    const currentRecipes = recipes.slice(
        (currentPage - 1) * recipesPerPage,
        currentPage * recipesPerPage
    );

    // Update recipes when data changes
    useEffect(() => {
        if (dataRecipes && dataRecipes.recipe) {
            setRecipes(dataRecipes.recipe);
            
            const navProductName = location.state?.productName;
            if (navProductName) {
                setProductName(navProductName);
            }
        }
    }, [dataRecipes, location.state]);

    // Fetch recipes on mount and when productId changes
    useEffect(() => {
        if (productId) {
            refetchRecipes();
        }
    }, [refetchRecipes, productId]);

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Handle status change
    const handleStatusChange = async (recipeId, recipeName, currentStatus) => {
        const newStatus = currentStatus ? 0 : 1;
        const success = await changeState(
            `${apiUrl}/admin/recipe/status/${recipeId}`,
            `Recipe status updated successfully`,
            { status: newStatus }
        );
        
        if (success) {
            // Update local state
            setRecipes(prev => prev.map(recipe => 
                recipe.id === recipeId 
                    ? { ...recipe, status: newStatus }
                    : recipe
            ));
        }
    };

    // Handle delete
    const handleDelete = async (recipeId, recipeName) => {
        if (window.confirm(`Are you sure you want to delete recipe ${recipeName}?`)) {
            const success = await changeState(
                `${apiUrl}/admin/recipe/delete/${recipeId}`,
                `Recipe deleted successfully`,
                {}
            );
            
            if (success) {
                setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
            }
        }
    };

    const headers = [
        t("#"),
        t("Store Product"),
        t("Store Category"),
        t("Unit"),
        t("Weight"),
        t("Status"),
        t("Actions"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
            {loadingRecipes ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <div className="flex items-center gap-x-2">
                            <button
                                onClick={handleBack}
                                className="text-mainColor hover:text-red-700 transition-colors"
                                title={t("Back")}
                            >
                                <IoArrowBack size={24} />
                            </button>
                            <TitlePage text={`${t("Recipes")}: ${productName}`} />
                        </div>
                        <div className="flex justify-end w-full py-4 md:w-1/2">
                            <Link to="add">
                                <AddButton Text={t("Add Recipe")} />
                            </Link>
                        </div>
                    </div>

                    {/* Recipes Table */}
                    <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
                        <thead className="w-full">
                            <tr className="w-full border-b-2">
                                {headers.map((name, index) => (
                                    <th
                                        className="min-w-[120px] px-4 py-2 text-mainColor text-center font-TextFontSemiBold text-sm lg:text-base whitespace-nowrap"
                                        key={index}
                                    >
                                        {name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {recipes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base"
                                    >
                                        {t("No recipes found for this product")}
                                    </td>
                                </tr>
                            ) : (
                                currentRecipes.map((recipe, index) => (
                                    <tr className="w-full border-b-2" key={recipe.id}>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                            {(currentPage - 1) * recipesPerPage + index + 1}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                            {recipe.store_product?.name || "-"}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                            {recipe.store_category?.name || "-"}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                            {recipe.unit?.name || "-"}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                            {recipe.weight || "0"}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <Switch
                                                checked={recipe.status === 1}
                                                handleClick={() => {
                                                    handleStatusChange(
                                                        recipe.id,
                                                        recipe.store_product?.name,
                                                        recipe.status
                                                    );
                                                }}
                                                disabled={loadingChange}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link 
                                                    to={`edit/${recipe.id}`}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <EditIcon />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(recipe.id, recipe.store_product?.name)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    disabled={loadingChange}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {recipes.length > 0 && (
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
                                    className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${
                                        currentPage === page ? "bg-mainColor text-white" : "text-mainColor"
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

export default Recipes;