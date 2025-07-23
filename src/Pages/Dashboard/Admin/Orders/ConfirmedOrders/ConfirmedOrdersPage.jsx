// ConfirmedOrdersPage.jsx
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { LoaderLogin, SearchBar } from "../../../../../Components/Components";
import { BiSolidShow } from "react-icons/bi";
import { FaFileInvoice, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useGet } from "../../../../../Hooks/useGet";

const ConfirmedOrdersPage = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  const userRole = localStorage.getItem("role") || "admin";
  const ordersRedux = useSelector((state) => state.ordersProcessing);
  const [ordersData, setOrdersData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const apiEndpoint =
    userRole === "branch"
      ? `${apiUrl}/branch/online_order`
      : null;

  const {
    data: dataBranch,
    loading: loadingBranch,
    refetch: refetchBranch,
  } = useGet({
    url: apiEndpoint,
    enabled: userRole === "branch",
  });

  useEffect(() => {
    if (userRole === "branch") {
      if (!loadingBranch) {
        const confirmedOrders = Array.isArray(dataBranch?.confirmed)
          ? dataBranch.confirmed
          : [];
        setOrdersData(confirmedOrders);
        setFilteredOrders(confirmedOrders);
        setIsDataLoaded(true);
      }
    } else {
      const confirmed = Array.isArray(ordersRedux.data)
        ? ordersRedux.data.filter((o) => o.order_status === "confirmed")
        : [];
      setOrdersData(confirmed);
      setFilteredOrders(confirmed);
      setIsDataLoaded(true);
    }
  }, [userRole, dataBranch, loadingBranch, ordersRedux.data]);

  const handleFilterData = (e) => {
    const text = e.target.value.trim();
    setTextSearch(text);

    if (!Array.isArray(ordersData)) return;

    if (text === "") {
      setFilteredOrders(ordersData);
    } else {
      const filtered = ordersData.filter(
        (order) =>
          order.id.toString().startsWith(text) ||
          (order.user?.f_name || "").toLowerCase().includes(text.toLowerCase()) ||
          (order.user?.phone || "").toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const filteredOrdersPerPage = 20;
  const totalPages = Math.ceil(filteredOrders.length / filteredOrdersPerPage);
  const currentFilteredOrders = filteredOrders.slice(
    (currentPage - 1) * filteredOrdersPerPage,
    currentPage * filteredOrdersPerPage
  );

  const tableContainerRef = useRef(null);
  const tableRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current && tableContainerRef.current) {
        const hasScroll =
          tableRef.current.scrollWidth > tableContainerRef.current.clientWidth;
        setShowScrollHint(hasScroll);
      }
    };
    checkScroll();
    const timeoutId = setTimeout(checkScroll, 500);
    const resizeObserver = new ResizeObserver(checkScroll);
    if (tableContainerRef.current) resizeObserver.observe(tableContainerRef.current);
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [filteredOrders, currentPage]);

  const scrollTable = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = 300;
      tableContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const headers = [
    t("sl"),
    t("orderId"),
    t("deliveryDate"),
    t("customerInfo"),
    t("branch"),
    t("totalPrice"),
    t("orderStatus"),
    t("orderType"),
    t("actions"),
  ];

  const isLoading = userRole === "branch" ? loadingBranch || !isDataLoaded : ordersRedux.loading;

  return (
    <div className="relative flex flex-col w-full gap-y-3">
      <div className="sm:w-full lg:w-[70%] xl:w-[30%] mt-4">
        <SearchBar
          placeholder={t("SearchOrderStatus")}
          value={textSearch}
          handleChange={handleFilterData}
        />
      </div>

      {showScrollHint && (
        <div className="sticky top-0 z-20 flex items-center justify-between py-2 mb-2 bg-white shadow-sm">
          <button onClick={() => scrollTable("left")} className="p-2 bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {filteredOrders.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              {currentPage !== 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 text-white rounded-xl bg-mainColor">
                  Prev
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 mx-1 rounded-full ${currentPage === page ? "bg-mainColor text-white" : "text-mainColor"}`}
                >
                  {page}
                </button>
              ))}
              {currentPage !== totalPages && (
                <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 text-white rounded-xl bg-mainColor">
                  Next
                </button>
              )}
            </div>
          )}

          <button onClick={() => scrollTable("right")} className="p-2 bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <div className="relative w-full overflow-x-auto pb-28" ref={tableContainerRef}>
        {isLoading ? (
          <LoaderLogin />
        ) : (
          <table className="w-full min-w-[1200px]" ref={tableRef}>
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b-2">
                {headers.map((name, index) => (
                  <th key={index} className="px-4 py-2 text-center text-mainColor">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="py-4 text-center text-mainColor">
                    {t("Noordersfound")}
                  </td>
                </tr>
              ) : (
                currentFilteredOrders.map((order, index) => (
                  <tr key={index} className="border-b">
                    <td className="text-center">{(currentPage - 1) * filteredOrdersPerPage + index + 1}</td>
                    <td className="text-center">
                      <Link to={`/dashboard/orders/details/${order.id}`} className="text-secoundColor hover:text-mainColor underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="text-center">
                      {order?.created_at
                        ? new Date(order.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </td>
                    <td className="text-center">
                      <div>{`${order.user?.f_name || "N/A"} ${order.user?.l_name || "-"}`}</div>
                      <div className="flex justify-center items-center gap-2">
                        {order.user?.phone ? (
                          <>
                            <FaWhatsapp className="text-green-600" />
                            <a
                              href={`https://wa.me/${order.user.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {order.user.phone}
                            </a>
                          </>
                        ) : (
                          <span>{t("NoPhone")}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">{order.branch?.name || "-"} / {order.address?.zone.zone || "-"}</td>
                    <td className="text-center">{order?.amount || 0}</td>
                    <td className="text-center">{order?.payment_method?.name || "-"}</td>
                    <td className="text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-sm ${order?.order_type === 'delivery'
                          ? 'bg-green-300 text-green-500'
                          : order?.order_type === 'pickup'
                          ? 'bg-blue-300 text-blue-500'
                          : 'bg-gray-200 text-gray-500'}`}
                      >
                        {order?.order_type || '-'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/dashboard/orders/details/${order.id}`} className="p-2 border-2 rounded-md border-mainColor">
                          <BiSolidShow className="text-xl text-mainColor" />
                        </Link>
                        <Link to={`/dashboard/orders/invoice/${order.id}`} className="p-2 border-2 rounded-md border-green-400">
                          <FaFileInvoice className="text-xl text-green-400" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ConfirmedOrdersPage;