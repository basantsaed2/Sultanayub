import { useEffect, useState, useRef } from "react";
import { useGet } from "../../../../Hooks/useGet";
import { LoaderLogin, SearchBar } from "../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../Assets/Icons/AllIcons";
import { useDelete } from "../../../../Hooks/useDelete";
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../Assets/Icons/AnotherIcons/WarningIcon";
import ToggleItems from "./ToggleItems";
import { useTranslation } from "react-i18next";

const ProductPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchProducts,
    loading: loadingProducts,
    data: dataProducts,
  } = useGet({
    url: `${apiUrl}/admin/product`,
  });
  const { deleteData, loadingDelete } = useDelete();
  const [showLayer, setShowLayer] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [openDescriptionView, setOpenDescriptionView] = useState(null);
  const [openAddonsView, setOpenAddonsView] = useState(null);
  const [openVariationsView, setOpenVariationsView] = useState(null);
  const [openExcludesView, setOpenExcludesView] = useState(null);
  const [openExtraView, setOpenExtraView] = useState(null);
  const { t, i18n } = useTranslation();

  const [openDelete, setOpenDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const productsPerPage = 20; // Limit to 20 products per page

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get the products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    if (dataProducts && dataProducts.products) {
      setProducts(dataProducts.products);
      setFilteredProducts(dataProducts.products);
    }

    console.log("dataProducts", dataProducts);
    console.log("products", products);
  }, [dataProducts]);

  const handleFilterData = (e) => {
    const text = e.target.value;
    setTextSearch(text);

    if (!products || !Array.isArray(products)) {
      console.error("Invalid products data:", products);
      return;
    }

    if (text === "") {
      setFilteredProducts(products); // Reset if input is empty
    } else {
      console.log("Filtering for text:", text);

      const filter = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredProducts(filter); // Update state
      console.log("Filtered products:", filter); // Debugging
    }
  };

  // handle page change
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
  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };
  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  // Delete Product
  const handleDelete = async (id, name) => {
    const success = await deleteData(
      `${apiUrl}/admin/product/delete/${id}`,
      `${name} Deleted Success.`
    );

    if (success) {
      setProducts(products.filter((product) => product.id !== id));
    }
    console.log("products", products);
  };

  //show layer

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setShowLayer(true);
  };

  const closeLayer = () => {
    setShowLayer(false);
    setSelectedProductId(null);
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
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // const headers = [
  //   "#",
  //   "Name",
  //   "Price",
  //   "Image",
  //   "Category",
  //   "Discount",
  //   "Action",
  // ];

  const headers = [
    t("#"),
    t("Name"),
    t("Price"),
    t("Image"),
    t("Category"),
    t("Discount"),
    t("Action"),
  ];
  return (
    <>
      <div className="relative flex flex-col w-full gap-y-3">
        {/* Search Order */}
        <div className="sm:w-full lg:w-[70%] xl:w-[30%] mt-4">
          <SearchBar
            placeholder={t("Search by Order ID Order Status")}
            value={textSearch}
            handleChange={handleFilterData}
          />
        </div>

        {/* Scroll Controls */}
        {showScrollHint && (
          <div className="sticky top-0 z-20 flex items-center justify-between py-2 mb-2 bg-white shadow-sm">
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

            {filteredProducts.length > 0 && (
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
                      className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${
                        currentPage === page
                          ? "bg-mainColor text-white"
                          : " text-mainColor"
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

        {/* Table Container - Simplified structure */}
        <div
          className="relative w-full overflow-x-auto pb-28"
          ref={tableContainerRef}
        >
          {loadingProducts || loadingDelete ? (
            <LoaderLogin />
          ) : (
            <>
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
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base"
                      >
                        {t("Notfindproducts")}
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map(
                      (
                        product,
                        index // Example with two rows
                      ) => (
                        <tr className="border-b-2" key={index}>
                          <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                            {(currentPage - 1) * productsPerPage + index + 1}
                          </td>
                          <td
                            onClick={() => handleProductClick(product.id)}
                            className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base"
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
                          <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                            {product.category?.name
                              ? product.category?.name
                              : product.sub_category?.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                            {product.discount?.name || "-"}
                          </td>

                          <td className="px-4 py-3 text-center">
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
                              {openDelete === product.id && (
                                <Dialog
                                  open={true}
                                  onClose={handleCloseDelete}
                                  className="relative z-10"
                                >
                                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                          <Warning
                                            width="28"
                                            height="28"
                                            aria-hidden="true"
                                          />
                                          <div className="flex items-center">
                                            <div className="mt-2 text-center">
                                              You will delete product{" "}
                                              {product?.name || "-"}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                          <button
                                            className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                            onClick={() =>
                                              handleDelete(
                                                product.id,
                                                product.name
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

                              {openDescriptionView === product.id && (
                                <Dialog
                                  open={true}
                                  onClose={handleCloseDescriptionView}
                                  className="relative z-10"
                                >
                                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                                        {/* Permissions List */}
                                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                                          <ul className="p-4 shadow-md rounded-xl">
                                            <li className="mx-4 text-lg capitalize list-disc text-mainColor lg:text-xl font-TextFontSemiBold">
                                              {product?.description}
                                            </li>
                                          </ul>
                                        </div>

                                        {/* Dialog Footer */}
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

                              {openAddonsView === product.id && (
                                <Dialog
                                  open={true}
                                  onClose={handleCloseAddonsView}
                                  className="relative z-10"
                                >
                                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                                        {/* Permissions List */}
                                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                                          {product.addons.length === 0 ? (
                                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                                              No Addons available for this
                                              product.
                                            </div>
                                          ) : (
                                            product.addons.map(
                                              (addon, index) => {
                                                const displayIndex = index + 1;
                                                return (
                                                  <div
                                                    key={index}
                                                    className="flex items-center justify-center px-4 py-3 duration-300 shadow-md sm:w-full lg:w-5/12 xl:w-3/12 hover:shadow-none rounded-xl bg-gray-50"
                                                  >
                                                    <span className="text-lg capitalize text-mainColor lg:text-xl font-TextFontSemiBold">
                                                      {displayIndex}.{" "}
                                                      {addon.name}
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          )}
                                        </div>

                                        {/* Dialog Footer */}
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

                              {openVariationsView === product.id && (
                                <Dialog
                                  open={true}
                                  onClose={handleCloseVariationsView}
                                  className="relative z-10"
                                >
                                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                                        {/* Permissions List */}
                                        <div className="flex flex-col items-start justify-start w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                                          {product.variations.length === 0 ? (
                                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                                                                                         {t("NoVariationsavailableforthisproduct")}

                                            </div>
                                          ) : (
                                            product.variations.map(
                                              (variation, index) => {
                                                const displayIndex = index + 1;
                                                return (
                                                  <>
                                                    <div
                                                      key={index}
                                                      className="flex items-start justify-start p-2 shadow-md sm:w-full lg:w-auto rounded-xl bg-mainColor "
                                                    >
                                                      <div className="flex flex-col items-start justify-start w-full gap-3">
                                                        <span className="text-lg text-white capitalize lg:text-xl font-TextFontSemiBold">
                                                          {displayIndex}.{" "}
                                                          {variation.name}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    {variation.options.map(
                                                      (option, indexOption) => {
                                                        return (
                                                          <div
                                                            className="flex flex-wrap items-start justify-start w-full gap-5"
                                                            key={`${option.id}-${indexOption}`}
                                                          >
                                                            <div className="">
                                                              <span>
                                                              {t("optionName")}:{" "}
                                                                {option.name}
                                                              </span>
                                                            </div>
                                                            <div className="">
                                                              <span>
                                                              {t("optionPrice")}:{" "}
                                                                {option.price}
                                                              </span>
                                                            </div>
                                                            <div className="">
                                                              <span>
                                                              {t("optionpoints")}:{" "}
                                                                {option.points}
                                                              </span>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </>
                                                );
                                              }
                                            )
                                          )}
                                        </div>

                                        {/* Dialog Footer */}
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

                              {openExcludesView === product.id && (
                                <Dialog
                                  open={true}
                                  onClose={handleCloseExcludesView}
                                  className="relative z-10"
                                >
                                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                                        {/* Permissions List */}
                                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                                          {product.excludes.length === 0 ? (
                                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                                                                                       {t("NoExcludesavailableforthisproduct")}

                                            </div>
                                          ) : (
                                            product.excludes.map(
                                              (exclude, index) => {
                                                const displayIndex = index + 1;
                                                return (
                                                  <div
                                                    key={index}
                                                    className="flex items-center justify-center px-4 py-3 duration-300 shadow-md sm:w-full lg:w-5/12 xl:w-3/12 hover:shadow-none rounded-xl bg-gray-50"
                                                  >
                                                    <span className="text-lg capitalize text-mainColor lg:text-xl font-TextFontSemiBold">
                                                      {displayIndex}.{" "}
                                                      {exclude.name}
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          )}
                                        </div>

                                        {/* Dialog Footer */}
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

                              {openExtraView === product.id && (
                                <Dialog
                                  open={true}
                                  onClose={handleCloseExtraView}
                                  className="relative z-10"
                                >
                                  <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                      <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-4xl">
                                        {/* Permissions List */}
                                        <div className="flex flex-wrap items-center justify-center w-full gap-4 px-4 my-4 sm:p-6 sm:pb-4">
                                          {product.extra.length === 0 ? (
                                            <div className="w-full my-4 text-lg text-center text-gray-500 font-TextFontSemiBold">
                                                                                        {t("Noextraavailableforthisproduct")}.

                                            </div>
                                          ) : (
                                            product.extra.map((ext, index) => {
                                              const displayIndex = index + 1;
                                              return (
                                                <div
                                                  key={index}
                                                  className="flex items-center justify-center px-4 py-3 duration-300 shadow-md sm:w-full lg:w-5/12 xl:w-3/12 hover:shadow-none rounded-xl bg-gray-50"
                                                >
                                                  <span className="text-lg capitalize text-mainColor lg:text-xl font-TextFontSemiBold">
                                                    {displayIndex}. {ext.name}
                                                  </span>
                                                </div>
                                              );
                                            })
                                          )}
                                        </div>

                                        {/* Dialog Footer */}
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
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
                {showLayer && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full h-[80vh] overflow-y-auto">
                      <button
                        onClick={closeLayer}
                        className="absolute text-xl font-bold text-red-600 top-3 right-3"
                      >
                        ×
                      </button>
                      <ToggleItems id={selectedProductId} />
                    </div>
                  </div>
                )}
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
