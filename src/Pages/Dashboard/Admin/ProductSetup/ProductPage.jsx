import { useEffect, useState, useRef } from "react";
import { useGet } from "../../../../Hooks/useGet";
import { useDelete } from "../../../../Hooks/useDelete";
import { LoaderLogin, SearchBar ,Switch} from "../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../Assets/Icons/AllIcons";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../Assets/Icons/AnotherIcons/WarningIcon";
import ToggleItems from "./ToggleItems";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useChangeState } from "../../../../Hooks/useChangeState";

const ProductPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const selectedLanguage = useSelector((state) => state.language?.selected ?? "en");
  const { t } = useTranslation();
  const { changeState } = useChangeState();
  const navigate = useNavigate();

  // State for main tabs
  const [activeTab, setActiveTab] = useState("products"); // "products" or "categories"
  // State for toggling category product lists
  const [expandedCategories, setExpandedCategories] = useState({});
  // State for toggling category status dialog
  const [openCategoryToggle, setOpenCategoryToggle] = useState(null);

  // Fetch products
  const {
    refetch: refetchProducts,
    loading: loadingProducts,
    data: dataProducts,
  } = useGet({
    url: `${apiUrl}/admin/product?locale=${selectedLanguage}`,
  });

  // Fetch categories
  const {
    refetch: refetchCategories,
    loading: loadingCategories,
    data: dataCategories,
  } = useGet({
    url: `${apiUrl}/admin/category?locale=${selectedLanguage}`,
  });

  const { changeState: changeFavoritePos, loadingChange, responseChange } = useChangeState();

  const { deleteData, loadingDelete } = useDelete();
  const [showLayer, setShowLayer] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Add state for price editing
  const [openPriceEdit, setOpenPriceEdit] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [loadingPriceUpdate, setLoadingPriceUpdate] = useState(false);

  const [openDescriptionView, setOpenDescriptionView] = useState(null);
  const [openAddonsView, setOpenAddonsView] = useState(null);
  const [openVariationsView, setOpenVariationsView] = useState(null);
  const [openExcludesView, setOpenExcludesView] = useState(null);
  const [openExtraView, setOpenExtraView] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Calculate total pages for products (used in "Products" tab)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    if (dataProducts && dataProducts.products) {
      setProducts(dataProducts.products);
      setFilteredProducts(dataProducts.products);
    }
  }, [dataProducts]);

  useEffect(() => {
    if (dataCategories && dataCategories.categories) {
      setCategories(dataCategories.categories);
    }
  }, [dataCategories]);

  useEffect(() => {
    refetchProducts();
    refetchCategories();
  }, [refetchProducts, refetchCategories, selectedLanguage]);

  const handleChangeStaus = async (id, name, favourite) => {
    const response = await changeFavoritePos(
      `${apiUrl}/admin/product/favourite/${id}`,
      `${name} Changed Status.`,
      { favourite }
    );

    if (response) {
      setProducts((prevProduct) =>
        prevProduct.map((product) =>
          product.id === id ? { ...product, favourite: favourite } : product
        )
      );
    }
  };

  const handleFilterData = (e) => {
    const text = e.target.value;
    setTextSearch(text);

    if (activeTab === "products") {
      if (!products || !Array.isArray(products)) {
        console.error("Invalid products data:", products);
        return;
      }
      if (text === "") {
        setFilteredProducts(products);
      } else {
        const filter = products.filter((product) =>
          product.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filter);
      }
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDescriptionView = (productId) => {
    setOpenDescriptionView(productId);
  };
  const handleOpenAddonsView = (productId) => {
    setOpenAddonsView(productId);
  };
  const handleOpenVariationsView = (productId) => {
    setOpenVariationsView(productId);
  };
  const handleOpenExcludesView = (productId) => {
    setOpenExcludesView(productId);
  };
  const handleOpenExtraView = (productId) => {
    setOpenExtraView(productId);
  };

  const handleCloseDescriptionView = () => {
    setOpenDescriptionView(null);
  };
  const handleCloseAddonsView = () => {
    setOpenAddonsView(null);
  };
  const handleCloseVariationsView = () => {
    setOpenVariationsView(null);
  };
  const handleCloseExcludesView = () => {
    setOpenExcludesView(null);
  };
  const handleCloseExtraView = () => {
    setOpenExtraView(null);
  };

  // Price edit handlers
  const handleOpenPriceEdit = (product) => {
    setOpenPriceEdit(product);
    setNewPrice(product?.price?.toString() || "");
  };

  const handleClosePriceEdit = () => {
    setOpenPriceEdit(null);
    setNewPrice("");
  };

  const handlePriceUpdate = async () => {
    if (!openPriceEdit || !newPrice) return;

    const success = await changeState(
      `${apiUrl}/admin/product/update_price/${openPriceEdit.id}?price=${newPrice}`,
      "Price updated successfully",
      {} // empty data object since you're using query params
    );

    if (success) {
      // Update local state
      const updatedProducts = products.map(product =>
        product.id === openPriceEdit.id
          ? { ...product, price: parseFloat(newPrice) }
          : product
      );

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      handleClosePriceEdit();
    }
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };
  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  const handleDelete = async (id, name) => {
    const success = await deleteData(
      `${apiUrl}/admin/product/delete/${id}`,
      `${name} Deleted Success.`
    );
    if (success) {
      setProducts(products.filter((product) => product.id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
    }
  };

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setShowLayer(true);
  };

  // Navigate to Recipes page
  const handleViewRecipes = (productId, productName) => {
    navigate(`recipes/${productId}`, {
      state: {
        productId: productId,
        productName: productName
      }
    });
  };

  const closeLayer = () => {
    setShowLayer(false);
    setSelectedProductId(null);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleOpenCategoryToggle = (categoryId) => {
    setOpenCategoryToggle(categoryId);
  };

  const handleCloseCategoryToggle = () => {
    setOpenCategoryToggle(null);
  };

  const tableContainerRef = useRef(null);
  const tableRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current && tableContainerRef.current) {
        const tableWidth = tableRef.current.scrollWidth;
        const containerWidth = tableContainerRef.current.clientWidth;
        const hasScroll = tableWidth >= containerWidth;
        setShowScrollHint(hasScroll);
      }
    };

    checkScroll();
    const timeoutId = setTimeout(checkScroll, 500);
    const resizeObserver = new ResizeObserver(checkScroll);

    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [filteredProducts, currentPage]);

  const scrollTable = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = 300;
      tableContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const headers = [
    t("#"),
    t("Name"),
    t("Price"),
    t("Image"),
    t("Category"),
    t("Favorite POS"),
    t("Recipes"),
    t("Discount"),
    t("Action"),
  ];

  return (
    <>
      <div className="relative flex flex-col w-full gap-y-3">
        {/* Main Tabs */}
        <div className="w-full flex gap-4 mb-4">
          <button
            className={`px-4 py-2 text-lg font-TextFontMedium rounded-md ${activeTab === "products"
              ? "bg-mainColor text-white"
              : "bg-gray-100 text-mainColor"
              }`}
            onClick={() => {
              setActiveTab("products");
              setExpandedCategories({});
              setFilteredProducts(products);
              setCurrentPage(1);
            }}
          >
            {t("Products")}
          </button>
          <button
            className={`px-4 py-2 text-lg font-TextFontMedium rounded-md ${activeTab === "categories"
              ? "bg-mainColor text-white"
              : "bg-gray-100 text-mainColor"
              }`}
            onClick={() => {
              setActiveTab("categories");
              setCurrentPage(1);
            }}
          >
            {t("Categories")}
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === "products" && (
          <div className="sm:w-full lg:w-[70%] xl:w-[30%] mt-4">
            <SearchBar
              placeholder={t("Search by Product Name")}
              value={textSearch}
              handleChange={handleFilterData}
            />
          </div>
        )}

        {/* Scroll Controls */}
        {showScrollHint && (
          <div className="sticky top-0 z-10 flex items-center justify-between py-2 mb-2 bg-white shadow-sm">
            <button
              onClick={() => scrollTable("left")}
              className="p-2 transition bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {(activeTab === "products" && currentProducts.length) > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-4">
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
                        : "text-mainColor"
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
            <button
              onClick={() => scrollTable("right")}
              className="p-2 transition bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="relative w-full overflow-x-auto pb-28"
          ref={tableContainerRef}
        >
          {loadingProducts || loadingDelete || loadingCategories ? (
            <LoaderLogin />
          ) : (
            <>
              {activeTab === "products" ? (
                <>
                  {/* Product Table */}
                  <table className="w-full min-w-[1200px]" ref={tableRef}>
                    <thead className="sticky top-0 z-10 bg-white">
                      <tr className="border-b-2">
                        {headers.map((name, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 min-w-[120px] text-mainColor text-center font-TextFontSemiBold text-sm lg:text-base whitespace-nowrap"
                          >
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base"
                          >
                            {t("Notfindproducts")}
                          </td>
                        </tr>
                      ) : (
                        currentProducts.map((product, index) => (
                          <tr className="border-b-2" key={index}>
                            <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                              {(currentPage - 1) * productsPerPage + index + 1}
                            </td>
                            <td
                              onClick={() => handleProductClick(product.id)}
                              className="px-4 py-2 text-sm text-center text-red-800 lg:text-base underline cursor-pointer"
                            >
                              {product.name}
                            </td>
                            <td
                              className="px-4 py-2 text-sm text-center text-red-800 lg:text-base underline cursor-pointer"
                              onClick={() => handleOpenPriceEdit(product)}
                            >
                              {product?.price || "-"}
                            </td>
                            <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                              <div className="flex justify-center">
                                <img
                                  src={product.image_link}
                                  className="rounded-full bg-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                                  alt="Photo"
                                />
                              </div>
                            </td>
                            <td onClick={() => handleOpenCategoryToggle(product.category_id)} className="px-4 py-2 text-sm text-center text-red-800 lg:text-base underline">
                              {product.category?.name || product.sub_category?.name || "-"}
                            </td>
                            <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                              <Switch
                                checked={product.favourite}
                                handleClick={() => {
                                  handleChangeStaus(
                                    product.id,
                                    product?.name,
                                    product.favourite === 1 ? 0 : 1
                                  );
                                }}
                              />
                            </td>
                            <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleViewRecipes(product.id, product.name)}
                                className="text-mainColor hover:text-red-700 transition-colors underline text-sm sm:text-base"
                              >
                                {t("View Recipes")}
                              </button>
                            </td>
                            <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                              {product.discount?.name || "-"}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Link to={`edit/${product.id}`}>
                                  <EditIcon />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(product.id)}
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
                </>
              ) : (
                <>
                  <div className="w-full">
                    {categories.map((category, index) => (
                      <div key={category.id} className="border-b">
                        <div className="flex items-center justify-between px-4 py-3">
                          <button
                            className="w-full text-lg font-TextFontSemiBold text-left text-mainColor bg-gray-50 hover:bg-gray-100"
                            onClick={() => toggleCategory(category.id)}
                          >
                            {category.name}
                            <span className="float-right">
                              {expandedCategories[category.id] ? "−" : "+"}
                            </span>
                          </button>
                          <button
                            onClick={() => handleOpenCategoryToggle(category.id)}
                            className="px-4 py-2 ml-4 text-sm text-white rounded-md bg-mainColor font-TextFontMedium hover:bg-mainColor-dark"
                          >
                            {t("Branches")}
                          </button>
                        </div>
                        {expandedCategories[category.id] && (
                          <div className="p-4">
                            <table className="w-full min-w-[1200px]">
                              <thead className="bg-white">
                                <tr className="border-b-2">
                                  {headers.map((name, index) => (
                                    <th
                                      key={index}
                                      className="px-4 py-2 min-w-[120px] text-mainColor text-center font-TextFontSemiBold text-sm lg:text-base whitespace-nowrap"
                                    >
                                      {name}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {products
                                  .filter(
                                    (product) =>
                                      product.category?.id === category.id ||
                                      product.sub_category?.id === category.id
                                  )
                                  .length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={7}
                                      className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base"
                                    >
                                      {t("No products in this category")}
                                    </td>
                                  </tr>
                                ) : (
                                  products
                                    .filter(
                                      (product) =>
                                        product.category?.id === category.id ||
                                        product.sub_category?.id === category.id
                                    )
                                    .map((product, index) => (
                                      <tr className="border-b-2" key={index}>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                          {index + 1}
                                        </td>
                                        <td
                                          onClick={() => handleProductClick(product.id)}
                                          className="px-4 py-2 text-sm text-center text-red-800 lg:text-base underline cursor-pointer"
                                        >
                                          {product.name}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                          {product?.price || "-"}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                          <div className="flex justify-center">
                                            <img
                                              src={product.image_link}
                                              className="rounded-full bg-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                                              alt="Photo"
                                            />
                                          </div>
                                        </td>
                                        <td onClick={() => handleOpenCategoryToggle(product.category_id)} className="px-4 py-2 text-sm text-center text-red-800 lg:text-base underline">
                                          {product.category?.name ||
                                            product.sub_category?.name ||
                                            "-"}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                                          {product.discount?.name || "-"}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                            <Link to={`edit/${product.id}`}>
                                              <EditIcon />
                                            </Link>
                                            <button
                                              type="button"
                                              onClick={() => handleOpenDelete(product.id)}
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
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Dialogs */}
              {showLayer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full h-[80vh] overflow-y-auto">
                    <button
                      onClick={closeLayer}
                      className="absolute text-xl font-bold text-red-600 top-3 right-3"
                    >
                      ×
                    </button>
                    <ToggleItems id={selectedProductId} type="product" />
                  </div>
                </div>
              )}
              {openCategoryToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full h-[80vh] overflow-y-auto">
                    <button
                      onClick={handleCloseCategoryToggle}
                      className="absolute text-xl font-bold text-red-600 top-3 right-3"
                    >
                      ×
                    </button>
                    <ToggleItems id={openCategoryToggle} type="category" />
                  </div>
                </div>
              )}
              {openDelete && (
                <Dialog open={true} onClose={handleCloseDelete} className="relative z-10">
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                          <Warning width="28" height="28" aria-hidden="true" />
                          <div className="mt-2 text-center">
                            {t("You will delete product")} {products.find((p) => p.id === openDelete)?.name || "-"}
                          </div>
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                            onClick={() =>
                              handleDelete(
                                openDelete,
                                products.find((p) => p.id === openDelete)?.name
                              )
                            }
                          >
                            {t("Delete")}
                          </button>
                          <button
                            type="button"
                            data-autofocus
                            onClick={handleCloseDelete}
                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                          >
                            {t("Cancel")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}

              {/* Price Edit Modal */}
              {openPriceEdit && (
                <Dialog open={true} onClose={handleClosePriceEdit} className="relative z-10">
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-md">
                        <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                              <h3 className="text-lg font-medium leading-6 text-gray-900 font-TextFontSemiBold">
                                {t("Update Price")}
                              </h3>
                              <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                  {t("Update price for")}: <strong>{openPriceEdit.name}</strong>
                                </p>
                                <div className="mt-4">
                                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    {t("New Price")}
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="price"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor sm:text-sm"
                                    placeholder="Enter new price"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            disabled={loadingPriceUpdate || !newPrice}
                            onClick={handlePriceUpdate}
                            className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-mainColor border border-transparent rounded-md shadow-sm hover:bg-mainColor-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingPriceUpdate ? t("Updating...") : t("Update Price")}
                          </button>
                          <button
                            type="button"
                            disabled={loadingPriceUpdate}
                            onClick={handleClosePriceEdit}
                            className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {t("Cancel")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
              {openDescriptionView && (
                <Dialog
                  open={true}
                  onClose={handleCloseDescriptionView}
                  className="relative z-10"
                >
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                          <ul className="p-4 shadow-md rounded-xl">
                            <li className="mx-4 text-lg capitalize list-disc text-mainColor lg:text-xl font-TextFontSemiBold">
                              {products.find((p) => p.id === openDescriptionView)?.description}
                            </li>
                          </ul>
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            onClick={handleCloseDescriptionView}
                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontMedium sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                          >
                            {t("Close")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
              {openAddonsView && (
                <Dialog
                  open={true}
                  onClose={handleCloseAddonsView}
                  className="relative z-10"
                >
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                          {products.find((p) => p.id === openAddonsView)?.addons
                            ?.length === 0 ? (
                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                              {t("No Addons available for this product.")}
                            </div>
                          ) : (
                            products
                              .find((p) => p.id === openAddonsView)
                              ?.addons.map((addon, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-center px-4 py-3 duration-300 shadow-md sm:w-full lg:w-5/12 xl:w-3/12 hover:shadow-none rounded-xl bg-gray-50"
                                >
                                  <span className="text-lg capitalize text-mainColor lg:text-xl font-TextFontSemiBold">
                                    {index + 1}. {addon.name}
                                  </span>
                                </div>
                              ))
                          )}
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            onClick={handleCloseAddonsView}
                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontMedium sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                          >
                            {t("Close")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
              {openVariationsView && (
                <Dialog
                  open={true}
                  onClose={handleCloseVariationsView}
                  className="relative z-10"
                >
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                        <div className="flex flex-col items-start justify-start w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                          {products.find((p) => p.id === openVariationsView)?.variations
                            ?.length === 0 ? (
                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                              {t("No Variations available for this product.")}
                            </div>
                          ) : (
                            products
                              .find((p) => p.id === openVariationsView)
                              ?.variations.map((variation, index) => (
                                <div
                                  key={index}
                                  className="flex items-start justify-start p-2 shadow-md sm:w-full lg:w-auto rounded-xl bg-mainColor"
                                >
                                  <div className="flex flex-col items-start justify-start w-full gap-3">
                                    <span className="text-lg text-white capitalize lg:text-xl font-TextFontSemiBold">
                                      {index + 1}. {variation.name}
                                    </span>
                                    {variation.options.map((option, indexOption) => (
                                      <div
                                        className="flex flex-wrap items-start justify-start w-full gap-5"
                                        key={`${option.id}-${indexOption}`}
                                      >
                                        <div>
                                          <span>{t("Option Name")}: {option.name}</span>
                                        </div>
                                        <div>
                                          <span>{t("Option Price")}: {option.price}</span>
                                        </div>
                                        <div>
                                          <span>{t("Option Points")}: {option.points}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            onClick={handleCloseVariationsView}
                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontMedium sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                          >
                            {t("Close")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
              {openExcludesView && (
                <Dialog
                  open={true}
                  onClose={handleCloseExcludesView}
                  className="relative z-10"
                >
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                          {products.find((p) => p.id === openExcludesView)?.excludes
                            ?.length === 0 ? (
                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                              {t("No Excludes available for this product.")}
                            </div>
                          ) : (
                            products
                              .find((p) => p.id === openExcludesView)
                              ?.excludes.map((exclude, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-center px-4 py-3 duration-300 shadow-md sm:w-full lg:w-5/12 xl:w-3/12 hover:shadow-none rounded-xl bg-gray-50"
                                >
                                  <span className="text-lg capitalize text-mainColor lg:text-xl font-TextFontSemiBold">
                                    {index + 1}. {exclude.name}
                                  </span>
                                </div>
                              ))
                          )}
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            onClick={handleCloseExcludesView}
                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontMedium sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                          >
                            {t("Close")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
              {openExtraView && (
                <Dialog
                  open={true}
                  onClose={handleCloseExtraView}
                  className="relative z-10"
                >
                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                          {products.find((p) => p.id === openExtraView)?.extra?.length ===
                            0 ? (
                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                              {t("No extra available for this product.")}
                            </div>
                          ) : (
                            products
                              .find((p) => p.id === openExtraView)
                              ?.extra.map((ext, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-center px-4 py-3 duration-300 shadow-md sm:w-full lg:w-5/12 xl:w-3/12 hover:shadow-none rounded-xl bg-gray-50"
                                >
                                  <span className="text-lg capitalize text-mainColor lg:text-xl font-TextFontSemiBold">
                                    {index + 1}. {ext.name}
                                  </span>
                                </div>
                              ))
                          )}
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            onClick={handleCloseExtraView}
                            className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontMedium sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                          >
                            {t("Close")}
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;