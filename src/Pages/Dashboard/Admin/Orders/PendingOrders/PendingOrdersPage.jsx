import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { LoaderLogin, SearchBar } from '../../../../../Components/Components';
import { BiSolidShow } from 'react-icons/bi';
import { FaFileInvoice } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaCopy, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../../../../Context/Auth"; // Make sure to import useAuth if required

const PendingOrdersPage = () => {
  const auth = useAuth();

  const ordersPending = useSelector((state) => state.ordersPending);
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
    if (Array.isArray(ordersPending.data)) {
      setFilteredOrders(ordersPending.data)
      console.log('ordersPending', ordersPending.data);
    } else {
      console.log('ordersPending data is not an array or is undefined');
    }
  }, [ordersPending.data]);

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
    'SL',
    'Order ID',
    'Delivery Date',
    'Customer Info',
    'Branch',
    "Total Price",
    "Payment Method",
    'Order Status',
    "Operations Status",
    "Operations Admin",
    'Order Type',
    'Actions'
  ];
  return (
    <>
      <div className="w-full flex flex-col gap-y-3 relative">
        {/* Search Order */}
        <div className="sm:w-full lg:w-[70%] xl:w-[30%] mt-4">
          <SearchBar
            placeholder="Search by Order ID, User Name,Phone"
            value={textSearch}
            handleChange={handleFilterData}
          />
        </div>

        {/* Scroll Controls */}
        {showScrollHint && (
          <div className="sticky top-0 z-20 bg-white py-2 flex justify-between items-center shadow-sm mb-2">
            <button
              onClick={() => scrollTable('left')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {filteredOrders.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-x-4">
                  {currentPage !== 1 && (
                    <button type='button' className='text-lg px-4 py-2 rounded-xl bg-mainColor text-white font-TextFontMedium' onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
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
                    <button type='button' className='text-lg px-4 py-2 rounded-xl bg-mainColor text-white font-TextFontMedium' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                  )}
                </div>
              )}

            <button
              onClick={() => scrollTable('right')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
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
          className="w-full pb-28 overflow-x-auto relative"
          ref={tableContainerRef}
        >
          {ordersPending.loading ? (
            <LoaderLogin />
          ) : (
            <>
              <table className="w-full min-w-[1200px]" ref={tableRef}>
                <thead className="sticky top-0 bg-white z-10">
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
                        className="py-4 text-center text-mainColor text-lg font-TextFontMedium"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    currentFilteredOrders.map((order, index) => (
                      <tr key={index} className="border-b">
                        {/* Row Index */}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
                          {(currentPage - 1) * filteredOrdersPerPage + index + 1}
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
                          <Link
                            to={`/dashboard/orders/details/${order.id}`}
                            className="text-secoundColor underline hover:text-mainColor text-xl font-TextFontMedium transition ease-in-out duration-200"
                          >
                            {order.id}
                          </Link>
                        </td>

                        {/* Order Date */}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
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
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
                          <div>{`${order.user?.f_name || "N/A"} ${order.user?.l_name || "-"}`}</div>
                          <div className="flex items-center justify-center gap-2">
                            {order.user?.phone ? (
                              <>
                                <FaWhatsapp className="w-5 h-5 text-green-600" />
                                <a
                                  href={`https://wa.me/${order.user.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-black hover:text-green-600 transition duration-200"
                                >
                                  {order.user.phone}
                                </a>
                              </>
                            ) : (
                              <span>No Phone</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-sm lg:text-base">
                          <span className="text-cyan-500 bg-cyan-200 rounded-md px-2 py-1">
                            {order.branch?.name || "-"} / {order.address?.zone.zone || "-"}
                          </span>
                        </td>

                        {/* Order Amount */}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
                          {order?.amount || 0}
                        </td>

                        {/* payment method*/}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
                          {order?.payment_method?.name || '-'}
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
                            {order?.order_status || '-'}
                          </span>
                        </td>

                        {/* Status Operations */}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
                          {order.operation_status || "-"}
                        </td>
                        {/* Admin Operations */}
                        <td className="px-4 py-2 text-center text-thirdColor text-sm lg:text-base">
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
                              className="border-mainColor border-2 p-2 rounded-md "
                            >
                              <BiSolidShow className="text-xl text-mainColor" />
                            </Link>
                            <Link
                              to={`/dashboard/orders/invoice/${order.id}`}
                              aria-label="View Invoice"
                              className="border-green-400 border-2 p-2 rounded-md "
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

export default PendingOrdersPage