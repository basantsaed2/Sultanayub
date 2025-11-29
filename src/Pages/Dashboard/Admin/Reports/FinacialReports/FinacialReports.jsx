import React, { useEffect, useState } from "react";
import { usePost } from "../../../../../Hooks/usePostJson";
import { DateInput } from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import Select from 'react-select';

const FinacialReports = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/reports/financial_reports` });
  const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({
    url: `${apiUrl}/admin/reports/lists_report`
  });

  const [cashierMans, setCashierMans] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [financialAccounts, setFinancialAccounts] = useState([]);

  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCashierId, setSelectedCashierId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedCashierManId, setSelectedCashierManId] = useState(null);
  const [selectedFinancialId, setSelectedFinancialId] = useState(null);

  const { t } = useTranslation();

  // Extract full report data
  const reportData = response?.data || null;

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

  const prepareOptions = (data, labelKey = 'name') => {
    const options = data.map(item => ({
      value: item.id,
      label: item[labelKey] || item.user_name || `ID: ${item.id}`
    }));
    return [{ value: 'all', label: 'All' }, ...options];
  };

  const cashierManOptions = prepareOptions(cashierMans, 'user_name');
  const cashierOptions = prepareOptions(cashiers);
  const branchOptions = prepareOptions(branches);
  const financialOptions = prepareOptions(financialAccounts);

  const handleGenerateReport = () => {
    const formData = new FormData();
    if (fromDate) formData.append("from", fromDate);
    if (toDate) formData.append("to", toDate);
    if (selectedCashierId && selectedCashierId !== 'all') formData.append("cashier_id", selectedCashierId);
    if (selectedBranchId && selectedBranchId !== 'all') formData.append("branch_id", selectedBranchId);
    if (selectedCashierManId && selectedCashierManId !== 'all') formData.append("cashier_man_id", selectedCashierManId);
    if (selectedFinancialId && selectedFinancialId !== 'all') formData.append("financial_id", selectedFinancialId);

    postData(formData);
  };

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedCashierId(null);
    setSelectedBranchId(null);
    setSelectedCashierManId(null);
    setSelectedFinancialId(null);
  };

  return (
    <div className="p-6 w-full space-y-8 pb-32">
      <h1 className="text-3xl font-bold text-mainColor">Financial Report</h1>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-mainColor">Filters</h2>
        <div className="w-full flex flex-col gap-4 md:flex-row mb-4">
          <DateInput placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} borderColor="mainColor" />
          <DateInput placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} borderColor="mainColor" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cashier</label>
            <Select options={cashierOptions} onChange={(opt) => setSelectedCashierId(opt?.value || null)} isClearable placeholder="Select Cashier" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <Select options={branchOptions} onChange={(opt) => setSelectedBranchId(opt?.value || null)} isClearable placeholder="Select Branch" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cashier Man</label>
            <Select options={cashierManOptions} onChange={(opt) => setSelectedCashierManId(opt?.value || null)} isClearable placeholder="Select Cashier Man" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial Account</label>
            <Select options={financialOptions} onChange={(opt) => setSelectedFinancialId(opt?.value || null)} isClearable placeholder="Select Account" />
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleGenerateReport} className="px-6 py-3 bg-mainColor text-white rounded-lg font-medium hover:bg-opacity-90">
            Generate Report
          </button>
          <button onClick={handleResetFilters} className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600">
            Reset Filters
          </button>
        </div>
      </div>

      {loadingPost && <p className="text-center text-gray-600 text-lg">Loading report...</p>}

      {/* Full Report Display */}
      {
        reportData && (
          <div className="space-y-8">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-900">{reportData.order_count}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-800">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-900">{reportData.total_amount.toFixed(2)} EGP</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
                <p className="text-3xl font-bold text-red-900">{reportData.expenses_total} EGP</p>
              </div>
            </div>

            {/* Financial Accounts Breakdown */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h2 className="text-xl font-bold p-4 bg-mainColor text-white">Financial Accounts Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Delivery</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Take Away</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Dine In</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Net Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.financial_accounts.map((acc) => {
                      const net = (acc.total_amount_delivery || 0) + (acc.total_amount_take_away || 0) + (acc.total_amount_dine_in || 0);
                      return (
                        <tr key={acc.financial_id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{acc.financial_name}</td>
                          <td className={`px-4 py-3 text-right ${acc.total_amount_delivery < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {acc.total_amount_delivery.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 text-right ${acc.total_amount_take_away < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {acc.total_amount_take_away.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 text-right ${acc.total_amount_dine_in < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {acc.total_amount_dine_in.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 text-right font-bold ${net < 0 ? 'text-red-700' : 'text-green-700'}`}>
                            {net.toFixed(2)} EGP
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h2 className="text-xl font-bold p-4 bg-red-600 text-white">Expenses</h2>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportData.expenses.map((exp, i) => (
                    <div key={i} className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600">Account</p>
                      <p className="font-semibold text-lg">{exp.financial_account}</p>
                      <p className="text-2xl font-bold text-red-700">{exp.total} EGP</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Online Orders - Paid vs Unpaid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Paid Online Orders */}
              <div className="bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold p-4 bg-green-600 text-white">Paid Online Orders</h2>
                <div className="p-6 space-y-4">
                  {reportData.online_order.paid.length > 0 ? (
                    reportData.online_order.paid.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{item.payment_method}</p>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{item.amount.toFixed(2)} EGP</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No paid online orders</p>
                  )}
                </div>
              </div>

              {/* Unpaid Online Orders */}
              <div className="bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold p-4 bg-orange-600 text-white">Unpaid / Cash on Delivery</h2>
                <div className="p-6 space-y-4">
                  {reportData.online_order.un_paid.length > 0 ? (
                    reportData.online_order.un_paid.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-orange-50 p-4 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{item.payment_method}</p>
                        </div>
                        <p className="text-2xl font-bold text-orange-700">{item.amount.toFixed(2)} EGP</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No unpaid online orders</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )
      }

      {
        !loadingPost && !reportData && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-2xl">No report generated yet</p>
            <p>Select filters and click "Generate Report"</p>
          </div>
        )
      }
    </div >
  );
};

export default FinacialReports;