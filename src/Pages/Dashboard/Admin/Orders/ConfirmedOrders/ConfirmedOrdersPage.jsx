
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { LoaderLogin, SearchBar } from '../../../../../Components/Components';
import { BiSolidShow } from 'react-icons/bi';
import { FaFileInvoice } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaCopy, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../../../../Context/Auth"; // Make sure to import useAuth if required
import { useTranslation } from "react-i18next";

const ConfirmedOrdersPage = () => {
  const auth = useAuth();
 const {  t,i18n } = useTranslation();

  const ordersConfirmed = useSelector((state) => state.ordersProcessing);
  const [textSearch, setTextSearch] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const filteredOrdersPerPage = 20; // Limit to 20 filteredOrders per page

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredOrders.length / filteredOrdersPerPage);

  // Get the filteredOrders for the current page
  const currentFilteredOrders = filteredOrders.slice(
    (currentPage - 1) * filteredOrdersPerPage,
    currentPage * filteredOrdersPerPage
  );

  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  useEffect(() => {
    if (Array.isArray(ordersConfirmed.data)) {
      setFilteredOrders(ordersConfirmed.data)
      console.log('ordersConfirmed', ordersConfirmed.data);
    } else {
      console.log('ordersConfirmed data is not an array or is undefined');
    }
  }, [ordersConfirmed.data]);

  const handleFilterData = (e) => {
    const text = e.target.value.trim();
    setTextSearch(text);

    if (!ordersAll?.data || !Array.isArray(ordersAll.data)) {
      console.error("Invalid orders data:", ordersAll.data);
      return;
    }

    if (text === "") {
      setFilteredOrders(ordersAll.data); // Reset if input is empty
    } else {
      console.log("Filtering for text:", text);

      const filter = ordersAll.data.filter(
        (order) =>
          order.id.toString().startsWith(text) || // Matches if order.id starts with the text
          (order.user?.name || "-")
            .toLowerCase()
            .includes(text.toLowerCase()) || 
             (order.user?.phone || "-")
            .toLowerCase()
            .includes(text.toLowerCase())
      );

      setFilteredOrders(filter); // Update state
      console.log("Filtered orders:", filter); // Debugging
    }
  };

  const tableContainerRef = useRef(null);
  const tableRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current && tableContainerRef.current) {
        const tableWidth = tableRef.current.scrollWidth;
        const containerWidth = tableContainerRef.current.clientWidth;
        const hasScroll = tableWidth > containerWidth;
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
  }, [filteredOrders, currentPage]);

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
  t('sl'),
  t('orderId'),
  t('deliveryDate'),
  t('customerInfo'),
  t('branch'),
  t('totalPrice'),
  t('orderStatus'),
  t('orderType'),
  t('actions'),
];
  return (
    <>
      <div className="relative flex flex-col w-full gap-y-3">
        {/* Search Order */}
        <div className="sm:w-full lg:w-[70%] xl:w-[30%] mt-4">
          <SearchBar
            placeholder={t("SearchOrderStatus")}
            value={textSearch}
            handleChange={handleFilterData}
          />
        </div>

        {/* Scroll Controls */}
        {showScrollHint && (
          <div className="sticky top-0 z-20 flex items-center justify-between py-2 mb-2 bg-white shadow-sm">
            <button
              onClick={() => scrollTable('left')}
              className="p-2 transition bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {filteredOrders.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-4">
                {currentPage !== 1 && (
                  <button type='button' className='px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium' onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page ? 'bg-mainColor text-white' : ' text-mainColor'}`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages !== currentPage && (
                  <button type='button' className='px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                )}
              </div>
            )}

            <button
              onClick={() => scrollTable('right')}
              className="p-2 transition bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Table Container */}
        <div
          className="relative w-full overflow-x-auto pb-28"
          ref={tableContainerRef}
        >
          {ordersConfirmed.loading ? (
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

                {/* Table Body */}
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="py-4 text-lg text-center text-mainColor font-TextFontMedium"
                      >
                          {t("Noordersfound")}
                      </td>
                    </tr>
                  ) : (
                    currentFilteredOrders.map((order, index) => (
                      <tr key={index} className="border-b">
                        {/* Row Index */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          {(currentPage - 1) * filteredOrdersPerPage + index + 1}
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          <Link
                            to={`/dashboard/orders/details/${order.id}`}
                            className="text-xl underline transition duration-200 ease-in-out text-secoundColor hover:text-mainColor font-TextFontMedium"
                          >
                            {order.id}
                          </Link>
                        </td>

                        {/* Order Date */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          {order?.created_at
                            ? new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                            : ''}
                        </td>

                        {/* User Information */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          <div>{`${order.user?.f_name || "N/A"} ${order.user?.l_name || "-"}`}</div>
                          <div className="flex items-center justify-center gap-2">
                            {order.user?.phone ? (
                              <>
                                <FaWhatsapp className="w-5 h-5 text-green-600" />
                                <a
                                  href={`https://wa.me/${order.user.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-black transition duration-200 hover:text-green-600"
                                >
                                  {order.user.phone}
                                </a>
                              </>
                            ) : (
                                <span>{t("NoPhone")}</span>
                            )}
                          </div>
                        </td>
                        {/* Branch */}
                        <td className="px-4 py-2 text-sm text-center lg:text-base">
                          <span className="px-2 py-1 rounded-md text-cyan-500 bg-cyan-200">
                            {order.branch?.name || "-"} / {order.address?.zone.zone || "-"}
                          </span>
                        </td>

                        {/* Order Amount */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          {order?.amount || 0}
                        </td>

                          {/* Order Payment */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          {order?.payment_method?.name || 0}
                        </td>

                        {/* Order Status */}
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`rounded-md px-2 py-1 text-sm ${order?.order_status === 'pending'
                              ? 'bg-amber-200 text-amber-500'
                              : order?.order_status === 'confirmed'
                                ? 'bg-green-200 text-green-500'
                                : order?.order_status === 'canceled'
                                  ? 'bg-red-200 text-red-500'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                          >
                            {order?.order_status === "processing"? "Accept" : '-'}
                          </span>
                        </td>

                        {/* Status Operations */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          {order.operation_status || "-"}
                        </td>
                        {/* Admin Operations */}
                        <td className="px-4 py-2 text-sm text-center text-thirdColor lg:text-base">
                          {order.admin?.name || "-"}
                        </td>

                        {/* Order Type */}
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`rounded-md px-2 py-1 text-sm ${order?.order_type === 'delivery'
                              ? 'bg-green-300 text-green-500'
                              : order?.order_type === 'pickup'
                                ? 'bg-blue-300 text-blue-500'
                                : 'bg-gray-200 text-gray-500'
                              }`}
                          >
                            {order?.order_type || '-'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/dashboard/orders/details/${order.id}`}
                              aria-label="View Details"
                              className="p-2 border-2 rounded-md border-mainColor "
                            >
                              <BiSolidShow className="text-xl text-mainColor" />
                            </Link>
                            <Link
                              to={`/dashboard/orders/invoice/${order.id}`}
                              aria-label="View Invoice"
                              className="p-2 border-2 border-green-400 rounded-md "
                            >
                              <FaFileInvoice className="text-xl text-green-400" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

      </div>

    </>
  )
}

export default ConfirmedOrdersPage