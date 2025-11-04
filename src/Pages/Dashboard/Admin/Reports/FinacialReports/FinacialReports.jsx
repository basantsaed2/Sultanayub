import React, { useEffect, useState } from "react";
import { usePost } from "../../../../../Hooks/usePostJson";
import { DateInput } from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import { Link } from "react-router-dom";

const FinacialReports = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/reports/financial_report` });
  const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({
    url: `${apiUrl}/admin/reports/lists_report`
  });

  const [cashierMans, setCashierMans] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [financialAccounts, setFinancialAccounts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCashierId, setSelectedCashierId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedCashierManId, setSelectedCashierManId] = useState(null);
  const [selectedFinancialId, setSelectedFinancialId] = useState(null);
  
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  // Calculate total number of pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Get the orders for the current page
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  useEffect(() => {
    refetchList();
  }, [refetchList]);

  useEffect(() => {
    if (dataList) {
      setCashierMans(dataList.cashier_man || []);
      setCashiers(dataList.cashier || []);
      setBranches(dataList.branches || []);
      setFinancialAccounts(dataList.financial_account || []);
    }
  }, [dataList]);

  useEffect(() => {
    if (response && !loadingPost) {
      setOrders(response.data?.financial_accounts || []);
    }
  }, [response]);

  // Prepare options for React Select with "All" option
  const prepareOptions = (data, labelKey = 'name') => {
    const options = data.map(item => ({
      value: item.id,
      label: item[labelKey] || item.user_name || `ID: ${item.id}`
    }));
    
    // Add "All" option at the beginning
    return [{ value: 'all', label: 'All' }, ...options];
  };

  const cashierManOptions = prepareOptions(cashierMans, 'user_name');
  const cashierOptions = prepareOptions(cashiers);
  const branchOptions = prepareOptions(branches);
  const financialOptions = prepareOptions(financialAccounts);

  const handleGenerateReport = () => {
      const formData = new FormData();

      if (fromDate) {
      formData.append("from", fromDate);
      }

      if (toDate) {
      formData.append("to", toDate);
      }
      
      // Only append filter values if they are selected and not "All"
      if (selectedCashierId && selectedCashierId !== 'all') {
        formData.append("cashier_id", selectedCashierId);
      }
      
      if (selectedBranchId && selectedBranchId !== 'all') {
        formData.append("branch_id", selectedBranchId);
      }
      
      if (selectedCashierManId && selectedCashierManId !== 'all') {
        formData.append("cashier_man_id", selectedCashierManId);
      }
      
      if (selectedFinancialId && selectedFinancialId !== 'all') {
        formData.append("financial_id", selectedFinancialId);
      }

      postData(formData);
      setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedCashierId(null);
    setSelectedBranchId(null);
    setSelectedCashierManId(null);
    setSelectedFinancialId(null);
    setOrders([]);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 w-full mb-20">
      <h1 className="text-2xl font-bold mb-4 text-mainColor">Finacial Report</h1>
      
      {/* Filters Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-mainColor">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Date Filters */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              placeholder="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required={true}
              minDate={false}
              maxDate={toDate || false}
              borderColor="mainColor"
              className="w-full"
            />
            <DateInput
              placeholder="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required={true}
              minDate={fromDate || false}
              maxDate={true}
              borderColor="mainColor"
              className="w-full"
            />
          </div>

          {/* Cashier Filter */}
          <div className="w-full flex flex-col items-start justify-center gap-y-1">
            <span className="text-sm font-TextFontRegular text-thirdColor">
              {t("Cashier")}:
            </span>
            <Select
              value={cashierOptions.find(option => option.value === selectedCashierId)}
              onChange={(selectedOption) => setSelectedCashierId(selectedOption?.value || null)}
              options={cashierOptions}
              placeholder={t("Select Cashier")}
              isClearable
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  padding: '2px 4px',
                  backgroundColor: 'white'
                })
              }}
            />
          </div>

          {/* Branch Filter */}
          <div className="w-full flex flex-col items-start justify-center gap-y-1">
            <span className="text-sm font-TextFontRegular text-thirdColor">
              {t("Branch")}:
            </span>
            <Select
              value={branchOptions.find(option => option.value === selectedBranchId)}
              onChange={(selectedOption) => setSelectedBranchId(selectedOption?.value || null)}
              options={branchOptions}
              placeholder={t("Select Branch")}
              isClearable
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  padding: '2px 4px',
                  backgroundColor: 'white'
                })
              }}
            />
          </div>

          {/* Cashier Man Filter */}
          <div className="w-full flex flex-col items-start justify-center gap-y-1">
            <span className="text-sm font-TextFontRegular text-thirdColor">
              {t("Cashier Man")}:
            </span>
            <Select
              value={cashierManOptions.find(option => option.value === selectedCashierManId)}
              onChange={(selectedOption) => setSelectedCashierManId(selectedOption?.value || null)}
              options={cashierManOptions}
              placeholder={t("Select Cashier Man")}
              isClearable
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  padding: '2px 4px',
                  backgroundColor: 'white'
                })
              }}
            />
          </div>

          {/* Financial Account Filter */}
          <div className="w-full flex flex-col items-start justify-center gap-y-1">
            <span className="text-sm font-TextFontRegular text-thirdColor">
              {t("Financial Account")}:
            </span>
            <Select
              value={financialOptions.find(option => option.value === selectedFinancialId)}
              onChange={(selectedOption) => setSelectedFinancialId(selectedOption?.value || null)}
              options={financialOptions}
              placeholder={t("Select Financial Account")}
              isClearable
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  padding: '2px 4px',
                  backgroundColor: 'white'
                })
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2 rounded-md font-medium bg-mainColor text-white hover:bg-opacity-90 transition-colors duration-200"
          >
            Generate Report
          </button>
          
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loadingPost && <p className="text-center text-gray-500 mt-4">Loading orders data...</p>}
      
      {orders && Array.isArray(orders) && orders.length > 0 ? (
        <div className="flex flex-col w-full">
          <div className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-mainColor text-white">
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Financial Name</th>
                  <th className="py-3 px-4 border-b">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 border-b text-center">{(currentPage - 1) * ordersPerPage + index + 1}</td>
                    <td className="py-3 px-4 border-b">{order.financial_name || "N/A"}</td>
                    <td className="py-3 px-4 border-b font-semibold text-green-600">{order.total_amount || 0} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Professional Pagination */}
          {orders.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg">
              {/* Page Info */}
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing{" "}
                  <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span>
                  {" to "}
                  <span className="font-medium">
                    {Math.min(currentPage * ordersPerPage, orders.length)}
                  </span>
                  {" of "}
                  <span className="font-medium">{orders.length}</span>
                  {" results"}
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                {getPaginationNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                    disabled={pageNumber === '...'}
                    className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200 ${
                      pageNumber === currentPage
                        ? "bg-mainColor text-white"
                        : pageNumber === '...'
                        ? "text-gray-500 cursor-default"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : response && orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No orders found</div>
          <p className="text-gray-400">Try adjusting your filters to see more results.</p>
        </div>
      ) : null}

    </div>
  );
};

export default FinacialReports;