import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    TextInput,
    TitlePage,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoEye, IoCash, IoChevronForward, IoChevronBack } from "react-icons/io5";
import { useGet } from "../../../../../Hooks/useGet";
import Select from 'react-select';

const PayExpenses = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchLists, loading: loadingLists, data: dataLists } = useGet({
        url: `${apiUrl}/admin/expenses_list/lists`,
    });

    const { refetch: refetchExpenses, loading: loadingExpenses, data: dataExpenses } = useGet({
        url: `${apiUrl}/admin/expenses_list`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/expenses_list/add`,
    });

    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Form states
    const [expenseId, setExpenseId] = useState("");
    const [branchId, setBranchId] = useState("");
    const [cashierId, setCashierId] = useState("");
    const [cashierManId, setCashierManId] = useState("");
    const [financialAccountId, setFinancialAccountId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    // Options for selects
    const [expenseOptions, setExpenseOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [cashierOptions, setCashierOptions] = useState([]);
    const [cashierManOptions, setCashierManOptions] = useState([]);
    const [financialOptions, setFinancialOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        refetchLists();
        refetchExpenses();
    }, [refetchLists, refetchExpenses]);

    // Set data when APIs return
    useEffect(() => {
        if (dataExpenses && dataExpenses.expenses) {
            setExpenses(dataExpenses.expenses);
        }

        if (dataLists) {
            // Set expenses options
            if (dataLists.expenses) {
                setExpenseOptions(dataLists.expenses.map(exp => ({
                    value: exp.id,
                    label: exp.name
                })));
            }

            // Set branches options
            if (dataLists.branches) {
                setBranchOptions(dataLists.branches.map(branch => ({
                    value: branch.id,
                    label: branch.name
                })));
            }

            // Set cashiers options
            if (dataLists.cashiers) {
                setCashierOptions(dataLists.cashiers.map(cashier => ({
                    value: cashier.id,
                    label: cashier.name
                })));
            }

            // Set cashier man options
            if (dataLists.cashier_man) {
                setCashierManOptions(dataLists.cashier_man.map(cashierMan => ({
                    value: cashierMan.id,
                    label: cashierMan.user_name
                })));
            }

            // Set financial accounts options
            if (dataLists.financial) {
                setFinancialOptions(dataLists.financial.map(financial => ({
                    value: financial.id,
                    label: financial.name
                })));
            }

            // Set categories options
            if (dataLists.categories) {
                setCategoryOptions(dataLists.categories.map(category => ({
                    value: category.id,
                    label: category.name
                })));
            }
        }
    }, [dataExpenses, dataLists]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExpenses = expenses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Handle pay button click (from top button)
    const handlePayClick = () => {
        // Reset form when opening from top button
        setExpenseId("");
        setCategoryId("");
        setAmount("");
        setNote("");
        setBranchId("");
        setCashierId("");
        setCashierManId("");
        setFinancialAccountId("");
        setShowPayModal(true);
    };

    // Handle pay button click from table row
    const handlePayFromTable = (expense) => {
        setSelectedExpense(expense);
        // Auto-fill form with selected expense data
        setExpenseId(expense.expense?.id || "");
        setCategoryId(expense.category?.id || "");
        setAmount(expense.amount || "");
        setNote(expense.note || "");
        setShowPayModal(true);
    };

    // Handle view details click
    const handleViewDetails = (expense) => {
        setSelectedExpense(expense);
        setShowDetailsModal(true);
    };

    // Handle form submission for payment
    const handleSubmitPayment = (e) => {
        e.preventDefault();

        if (!expenseId || !branchId || !cashierId || !cashierManId || !financialAccountId || !categoryId || !amount) {
            auth.toastError(t("Please fill all required fields"));
            return;
        }

        const formData = new FormData();
        formData.append("expense_id", expenseId);
        formData.append("branch_id", branchId);
        formData.append("cashier_id", cashierId);
        formData.append("cahier_man_id", cashierManId);
        formData.append("financial_account_id", financialAccountId);
        formData.append("category_id", categoryId);
        formData.append("amount", amount);
        formData.append("note", note);

        postData(formData, t("Expense Paid Successfully"));
    };

    // Reset form and close modal after successful payment
    useEffect(() => {
        if (!loadingPost && response) {
            setShowPayModal(false);
            handleResetForm();
            refetchExpenses();
        }
    }, [loadingPost, response]);

    // Reset form
    const handleResetForm = () => {
        setExpenseId("");
        setCategoryId("");
        setAmount("");
        setNote("");
        setBranchId("");
        setCashierId("");
        setCashierManId("");
        setFinancialAccountId("");
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Custom styles for react-select with mainColor
    const customStyles = {
        control: (base, state) => ({
            ...base,
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            boxShadow: state.isFocused ? '0 0 0 2px var(--mainColor, #3b82f6)' : 'none',
            borderColor: state.isFocused ? 'var(--mainColor, #3b82f6)' : '#e5e7eb',
            '&:hover': {
                borderColor: state.isFocused ? 'var(--mainColor, #3b82f6)' : '#d1d5db'
            }
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: state.isSelected ? 'var(--mainColor, #3b82f6)' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
                backgroundColor: state.isSelected ? 'var(--mainColor, #3b82f6)' : '#eff6ff'
            }
        })
    };

    // Generate page numbers for pagination
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md mx-1 ${currentPage === i
                        ? 'bg-mainColor text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <>
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between p-2">
                    <div className="flex items-center gap-x-2">
                        <button
                            onClick={handleBack}
                            className="text-mainColor hover:text-red-700 transition-colors"
                            title={t("Back")}
                        >
                            <IoArrowBack size={24} />
                        </button>
                        <TitlePage text={t("Pay Expenses")} />
                    </div>
                    {/* Pay Button - Moved to top right */}
                    <div className="flex items-center gap-4 mt-2">
                        <SubmitButton
                            text={t("Pay Expense")}
                            rounded="rounded-full"
                            handleClick={handlePayClick}
                            icon={<IoCash size={18} className="mr-2" />}
                        />
                    </div>
                </div>

                {/* Expenses Table */}
                <div className="p-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {loadingExpenses ? (
                            <div className="flex items-center justify-center w-full h-56">
                                <StaticLoader />
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-mainColor">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("ID")}
                                                </th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("Expense")}
                                                </th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("Category")}
                                                </th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("Amount")}
                                                </th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("Branch")}
                                                </th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("Note")}
                                                </th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-white uppercase tracking-wider">
                                                    {t("Actions")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentExpenses.map((expense, index) => (
                                                <tr
                                                    key={expense.id}
                                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                        {expense.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                        {expense.expense?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                        {expense.category?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-green-600">
                                                        {expense.amount}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                        {expense.branch?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                        {expense.note || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => handleViewDetails(expense)}
                                                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                                                            >
                                                                <IoEye size={16} />
                                                                {t("Details")}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {expenses.length > 0 && (
                                    <div className="flex flex-col md:flex-row gap-y-2 items-center justify-between p-4 border-t border-gray-200 bg-white">
                                        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                                            <span className="text-sm text-gray-700">
                                                {t("Items per page")}:
                                            </span>
                                            <select
                                                value={itemsPerPage}
                                                onChange={handleItemsPerPageChange}
                                                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-700">
                                                {t("Page")} {currentPage} {t("of")} {totalPages}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-md ${currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-mainColor border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <IoChevronBack size={16} />
                                            </button>

                                            {renderPageNumbers()}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`p-2 rounded-md ${currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-mainColor border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <IoChevronForward size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Pay Modal */}
                {showPayModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                                <h3 className="text-lg font-semibold">{t("Pay Expense")}</h3>
                                <button
                                    onClick={() => setShowPayModal(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleSubmitPayment} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Expense - Selectable */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Expense")} *
                                        </span>
                                        <Select
                                            options={expenseOptions}
                                            value={expenseOptions.find(opt => opt.value === expenseId)}
                                            onChange={(selected) => setExpenseId(selected?.value || "")}
                                            placeholder={t("Select Expense")}
                                            styles={customStyles}
                                            isSearchable
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Category - Selectable */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Category")} *
                                        </span>
                                        <Select
                                            options={categoryOptions}
                                            value={categoryOptions.find(opt => opt.value === categoryId)}
                                            onChange={(selected) => setCategoryId(selected?.value || "")}
                                            placeholder={t("Select Category")}
                                            styles={customStyles}
                                            isSearchable
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Branch */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Branch")} *
                                        </span>
                                        <Select
                                            options={branchOptions}
                                            value={branchOptions.find(opt => opt.value === branchId)}
                                            onChange={(selected) => setBranchId(selected?.value || "")}
                                            placeholder={t("Select Branch")}
                                            styles={customStyles}
                                            isSearchable
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Cashier */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Cashier")} *
                                        </span>
                                        <Select
                                            options={cashierOptions}
                                            value={cashierOptions.find(opt => opt.value === cashierId)}
                                            onChange={(selected) => setCashierId(selected?.value || "")}
                                            placeholder={t("Select Cashier")}
                                            styles={customStyles}
                                            isSearchable
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Cashier Man */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Cashier Man")} *
                                        </span>
                                        <Select
                                            options={cashierManOptions}
                                            value={cashierManOptions.find(opt => opt.value === cashierManId)}
                                            onChange={(selected) => setCashierManId(selected?.value || "")}
                                            placeholder={t("Select Cashier Man")}
                                            styles={customStyles}
                                            isSearchable
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Financial Account */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Financial Account")} *
                                        </span>
                                        <Select
                                            options={financialOptions}
                                            value={financialOptions.find(opt => opt.value === financialAccountId)}
                                            onChange={(selected) => setFinancialAccountId(selected?.value || "")}
                                            placeholder={t("Select Financial Account")}
                                            styles={customStyles}
                                            isSearchable
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Amount")} *
                                        </span>
                                        <TextInput
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder={t("Enter Amount")}
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="w-full flex flex-col items-start justify-center gap-y-1 md:col-span-2">
                                        <span className="text-sm font-TextFontRegular text-thirdColor">
                                            {t("Note")}
                                        </span>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder={t("Enter Note")}
                                            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-mainColor focus:outline-none transition-colors"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end w-full gap-x-4 mt-6 sticky bottom-4 bg-white pt-4 border-t">
                                    <StaticButton
                                        text={t("Cancel")}
                                        handleClick={() => setShowPayModal(false)}
                                        bgColor="bg-transparent"
                                        Color="text-mainColor"
                                        border="border-2"
                                        borderColor="border-mainColor"
                                        rounded="rounded-full"
                                        Size="text-xl"
                                    />
                                    <SubmitButton
                                        text={t("Pay Now")}
                                        rounded="rounded-full"
                                        handleClick={handleSubmitPayment}
                                        loading={loadingPost}
                                        Size="text-xl"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Details Modal */}
                {showDetailsModal && selectedExpense && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg w-full max-w-2xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">{t("Expense Details")}</h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem label={t("ID")} value={selectedExpense.id} />
                                    <DetailItem label={t("Expense")} value={selectedExpense.expense?.name} />
                                    <DetailItem label={t("Category")} value={selectedExpense.category?.name} />
                                    <DetailItem label={t("Amount")} value={selectedExpense.amount} />
                                    <DetailItem label={t("Branch")} value={selectedExpense.branch?.name} />
                                    <DetailItem label={t("Cashier")} value={selectedExpense.cashier?.name} />
                                    <DetailItem label={t("Cashier Man")} value={selectedExpense.cahier_man?.user_name} />
                                    <DetailItem label={t("Financial Account")} value={selectedExpense.financial_account?.name} />
                                    <DetailItem label={t("Admin")} value={selectedExpense.admin?.name} />
                                    <DetailItem label={t("Note")} value={selectedExpense.note || "-"} />
                                </div>
                                <div className="flex justify-end mt-6">
                                    <StaticButton
                                        text={t("Close")}
                                        handleClick={() => setShowDetailsModal(false)}
                                        bgColor="bg-mainColor"
                                        Color="text-white"
                                        rounded="rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

// Helper component for detail items
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-lg text-gray-900">{value}</span>
    </div>
);

export default PayExpenses;