import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  StaticLoader,
  Switch,
  TitlePage,
  TextInput,
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useAuth } from "../../../../../Context/Auth";
import { t } from "i18next";
import { IoArrowBack } from "react-icons/io5";

const GroupModuleProducts = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { groupId } = useParams();
  const location = useLocation();
  const auth = useAuth();
  
  const {
    refetch: refetchGroupProducts,
    loading: loadingGroupProducts,
    data: dataGroupProducts,
  } = useGet({
    url: `${apiUrl}/admin/group_price/${groupId}`,
  });

  const { changeState: changePrice, loadingChange: loadingPriceChange } = useChangeState();
  const { changeState: changeStatus, loadingChange: loadingStatusChange } = useChangeState();

  const [products, setProducts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceValue, setPriceValue] = useState("");
  const [loadingActions, setLoadingActions] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Calculate total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Get the products for the current page
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Update products when data changes
  useEffect(() => {
    if (dataGroupProducts && dataGroupProducts.products) {
      setProducts(dataGroupProducts.products);
      
      // Set group name from navigation state
      const navGroupName = location.state?.groupName;
      if (navGroupName) {
        setGroupName(navGroupName);
      }
    }
  }, [dataGroupProducts, location.state]);

  // Fetch products on mount and when groupId changes
  useEffect(() => {
    if (groupId) {
      refetchGroupProducts();
    }
  }, [refetchGroupProducts, groupId]);

  // Save price changes using useChangeState hook
  const handleSavePrice = async (productId, productName) => {
    if (!priceValue || isNaN(priceValue) || parseFloat(priceValue) < 0) {
      auth.toastError(t("Please enter a valid price"));
      return;
    }

    setLoadingActions(prev => ({ ...prev, [`price_${productId}`]: true }));

    // Use URL parameters for price update
    const url = `${apiUrl}/admin/group_price/price?product_id=${productId}&group_product_id=${groupId}&price=${parseFloat(priceValue)}`;

    try {
      const success = await changePrice(url, `${productName} price updated successfully`);

      if (success) {
        // Update local state
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.product_id === productId
              ? { ...product, price: parseFloat(priceValue) }
              : product
          )
        );
        setEditingPrice(null);
        setPriceValue("");
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error("Error updating price:", error);
    } finally {
      setLoadingActions(prev => ({ ...prev, [`price_${productId}`]: false }));
    }
  };

  // Change product status using useChangeState hook
  const handleChangeStatus = async (productId, productName, currentStatus) => {
    const newStatus = !currentStatus;
    
    setLoadingActions(prev => ({ ...prev, [`status_${productId}`]: true }));

    // Use URL parameters for status update
    const url = `${apiUrl}/admin/group_price/status?product_id=${productId}&group_product_id=${groupId}&status=${newStatus ? 1 : 0}`;

    try {
      const success = await changeStatus(url, `${productName} status updated successfully`);

      if (success) {
        // Update local state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.product_id === productId 
              ? { ...product, status: newStatus } 
              : product
          )
        );
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error("Error updating status:", error);
    } finally {
      setLoadingActions(prev => ({ ...prev, [`status_${productId}`]: false }));
    }
  };

  // Start editing price
  const handleEditPrice = (product) => {
    setEditingPrice(product.product_id);
    setPriceValue(product.price.toString());
  };

  // Cancel editing price
  const handleCancelEdit = () => {
    setEditingPrice(null);
    setPriceValue("");
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  const headers = [
    t("SL"),
    t("Product Name"),
    t("Price"),
    t("Status"),
    t("Change Price"),
  ];

  return (
    <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
      {loadingGroupProducts ? (
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
              <TitlePage text={`${t("Group Module")}: ${groupName}`} />
            </div>
            <div className="flex justify-end w-full py-4 md:w-1/2">
              <span className="text-lg font-TextFontMedium text-thirdColor">
                {t("Group ID")}: {groupId}
              </span>
            </div>
          </div>

          {/* Products Count */}
          <div className="my-4">
            <p className="text-lg font-TextFontMedium text-mainColor">
              {t("Total Products")}: {products.length}
            </p>
          </div>

          {/* Products Table */}
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
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-xl text-center text-mainColor font-TextFontMedium"
                  >
                    {t("No products found for this group")}
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr className="w-full border-b-2" key={product.product_id}>
                    <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {(currentPage - 1) * productsPerPage + index + 1}
                    </td>
                    <td className="min-w-[200px] sm:min-w-[150px] sm:w-3/12 lg:w-3/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {product?.product_name || "-"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {editingPrice === product.product_id ? (
                        <TextInput
                          type="number"
                          step="0.01"
                          min="0"
                          value={priceValue}
                          onChange={(e) => setPriceValue(e.target.value)}
                          placeholder="Enter price"
                          className="w-24 text-center"
                        />
                      ) : (
                        `${product?.price || "0"} EGP`
                      )}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <Switch
                        checked={product.status === true}
                        handleClick={() => {
                          handleChangeStatus(
                            product.product_id,
                            product.product_name,
                            product.status
                          );
                        }}
                        disabled={loadingActions[`status_${product.product_id}`]}
                      />
                      {loadingActions[`status_${product.product_id}`] && (
                        <span className="text-xs text-gray-500">Updating...</span>
                      )}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[120px] px-4 py-3 text-center">
                      {editingPrice === product.product_id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSavePrice(product.product_id, product.product_name)}
                            className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                            disabled={loadingActions[`price_${product.product_id}`]}
                          >
                            {loadingActions[`price_${product.product_id}`] ? t("Saving...") : t("Save")}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                            disabled={loadingActions[`price_${product.product_id}`]}
                          >
                            {t("Cancel")}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditPrice(product)}
                          className="px-3 py-1 text-sm text-white bg-mainColor rounded hover:bg-red-700 transition-colors"
                        >
                          {t("Change Price")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {products.length > 0 && (
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

export default GroupModuleProducts;