import React, { useEffect, useState } from "react";
import {
  StaticButton,
  StaticLoader,
  SubmitButton,
  TextInput,
  TitlePage,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoEye,
  IoCash,
  IoPencil,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { useGet } from "../../../../../Hooks/useGet";
import Select from "react-select";

const ExpensesPayment = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  // API Calls
  const {
    refetch: refetchLists,
    data: dataLists,
    loading: loadingList,
  } = useGet({
    url: `${apiUrl}/admin/expenses_list/lists`,
  });

  const {
    refetch: refetchExpenses,
    loading: loadingExpenses,
    data: dataExpenses,
  } = useGet({
    url: `${apiUrl}/admin/expenses_list`,
  });

  const { postData: postAdd, loadingPost: loadingAdd } = usePost({
    url: `${apiUrl}/admin/expenses_list/add`,
  });

  // Modals
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const { postData: postUpdate, loadingPost: loadingUpdate } = usePost({
    url:
      selectedExpense && showEditModal
        ? `${apiUrl}/admin/expenses_list/update/${selectedExpense.id}`
        : "",
  });

  const [expenses, setExpenses] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Add Modal - All fields
  const [expenseName, setExpenseName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [cashierId, setCashierId] = useState("");
  const [cashierManId, setCashierManId] = useState("");
  const [financialAccountId, setFinancialAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Edit Modal - Only these
  const [editExpenseName, setEditExpenseName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editFinancialAccountId, setEditFinancialAccountId] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");

  // Options
  const [branchOptions, setBranchOptions] = useState([]);
  const [cashierOptions, setCashierOptions] = useState([]);
  const [cashierManOptions, setCashierManOptions] = useState([]);
  const [financialOptions, setFinancialOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    refetchLists();
    refetchExpenses();
  }, []);

  useEffect(() => {
    if (dataExpenses?.expenses) {
      setExpenses(dataExpenses.expenses);
      // Reset to page 1 when data changes (e.g. after add/edit)
      setCurrentPage(1);
    }
  }, [dataExpenses]);

  useEffect(() => {
    if (dataLists) {
      setBranchOptions(
        dataLists.branches?.map((b) => ({ value: b.id, label: b.name })) || []
      );
      setCashierOptions(
        dataLists.cashiers?.map((c) => ({ value: c.id, label: c.name })) || []
      );
      setCashierManOptions(
        dataLists.cashier_man?.map((cm) => ({
          value: cm.id,
          label: cm.user_name,
        })) || []
      );
      setFinancialOptions(
        dataLists.financial?.map((f) => ({ value: f.id, label: f.name })) || []
      );
      setCategoryOptions(
        dataLists.categories?.map((c) => ({ value: c.id, label: c.name })) || []
      );
    }
  }, [dataLists]);

  // Pagination Logic
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setExpenseName("");
    setBranchId("");
    setCashierId("");
    setCashierManId("");
    setFinancialAccountId("");
    setCategoryId("");
    setAmount("");
    setNote("");
    setShowPayModal(true);
  };

  // Open Edit Modal
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditExpenseName(expense.expense || "");
    setEditCategoryId(expense.category?.id || "");
    setEditFinancialAccountId(expense.financial_account?.id || "");
    setEditAmount(expense.amount || "");
    setEditNote(expense.note || "");
    setShowEditModal(true);
  };

  // Submit Add
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (
      !expenseName ||
      !branchId ||
      !cashierId ||
      !cashierManId ||
      !financialAccountId ||
      !categoryId ||
      !amount
    ) {
      auth.toastError(t("Please fill all required fields"));
      return;
    }

    const formData = new FormData();
    formData.append("expense", expenseName);
    formData.append("branch_id", branchId);
    formData.append("cashier_id", cashierId);
    formData.append("cahier_man_id", cashierManId);
    formData.append("financial_account_id", financialAccountId);
    formData.append("category_id", categoryId);
    formData.append("amount", amount);
    if (note) formData.append("note", note);

    const success = await postAdd(formData, t("Expense Paid Successfully"));
    if (success) {
      setShowPayModal(false);
      refetchExpenses();
    }
  };

  // Submit Edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !editExpenseName ||
      !editCategoryId ||
      !editFinancialAccountId ||
      !editAmount
    ) {
      auth.toastError(t("Please fill all required fields"));
      return;
    }

    const formData = new FormData();
    formData.append("expense", editExpenseName);
    formData.append("category_id", editCategoryId);
    formData.append("financial_account_id", editFinancialAccountId);
    formData.append("amount", editAmount);
    if (editNote) formData.append("note", editNote);

    const success = await postUpdate(
      formData,
      t("Expense Updated Successfully")
    );
    if (success) {
      setShowEditModal(false);
      refetchExpenses();
    }
  };

  // useEffect(() => {
  //     if (selectedExpense && showEditModal) {
  //         postUpdate.url = `${apiUrl}/admin/expenses_list/update/${selectedExpense.id}`;
  //     }
  // }, [selectedExpense, showEditModal]);

  const customStyles = {
    control: (base) => ({
      ...base,
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      padding: "4px",
      "&:hover": { borderColor: "#9E090F" },
      boxShadow: "none",
    }),
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-mainColor hover:text-red-700"
          >
            <IoArrowBack size={28} />
          </button>
          <TitlePage text={t("Pay Expenses")} />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <StaticButton
            text={t("Pay New Expense")}
            icon={<IoCash size={20} className="mr-2" />}
            rounded="rounded-full"
            handleClick={openAddModal}
          />
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="p-4 pb-20 mt-4 bg-white rounded-lg shadow">
        {loadingExpenses || loadingList ? (
          <div className="flex justify-center py-20">
            <StaticLoader />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-white bg-mainColor">
                  <tr>
                    <th className="px-6 py-3 text-center">{t("ID")}</th>
                    <th className="px-6 py-3 text-center">{t("Expense")}</th>
                    <th className="px-6 py-3 text-center">{t("Category")}</th>
                    <th className="px-6 py-3 text-center">{t("Amount")}</th>
                    <th className="px-6 py-3 text-center">{t("Branch")}</th>
                    <th className="px-6 py-3 text-center">{t("Note")}</th>
                    <th className="px-6 py-3 text-center">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentExpenses.map((exp) => (
                    <tr key={exp.id} className="transition hover:bg-gray-50">
                      <td className="px-6 py-4 text-center">{exp.id}</td>
                      <td className="px-6 py-4 font-medium text-center">
                        {exp.expense}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {exp.category?.name || "-"}
                      </td>
                      <td className="px-6 py-4 font-bold text-center text-green-600">
                        {exp.amount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {exp.branch?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {exp.note || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <IoPencil size={22} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExpense(exp);
                              setShowDetailsModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <IoEye size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-between p-4 mt-6 border-t sm:flex-row">
                <div className="mb-4 text-sm text-gray-600 sm:mb-0">
                  {t("Showing")} {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} {t("of")}{" "}
                  {totalItems} {t("entries")}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoChevronBack size={20} />
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                        currentPage === i + 1
                          ? "bg-mainColor text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoChevronForward size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ADD / PAY MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
              <h3 className="text-2xl font-bold text-mainColor">
                {t("Pay New Expense")}
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-3xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSubmitPayment}
              className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
            >
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Expense")} *
                </label>
                <TextInput
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder={t("Enter expense name")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Category")} *
                </label>
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find((o) => o.value === categoryId)}
                  onChange={(o) => setCategoryId(o?.value || "")}
                  styles={customStyles}
                  isSearchable
                  placeholder={t("Select Category")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Branch")} *
                </label>
                <Select
                  options={branchOptions}
                  value={branchOptions.find((o) => o.value === branchId)}
                  onChange={(o) => setBranchId(o?.value || "")}
                  styles={customStyles}
                  isSearchable
                  placeholder={t("Select Branch")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Cashier")} *
                </label>
                <Select
                  options={cashierOptions}
                  value={cashierOptions.find((o) => o.value === cashierId)}
                  onChange={(o) => setCashierId(o?.value || "")}
                  styles={customStyles}
                  isSearchable
                  placeholder={t("Select Cashier")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Cashier Man")} *
                </label>
                <Select
                  options={cashierManOptions}
                  value={cashierManOptions.find(
                    (o) => o.value === cashierManId
                  )}
                  onChange={(o) => setCashierManId(o?.value || "")}
                  styles={customStyles}
                  isSearchable
                  placeholder={t("Select Cashier Man")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Financial Account")} *
                </label>
                <Select
                  options={financialOptions}
                  value={financialOptions.find(
                    (o) => o.value === financialAccountId
                  )}
                  onChange={(o) => setFinancialAccountId(o?.value || "")}
                  styles={customStyles}
                  isSearchable
                  placeholder={t("Select Account")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Amount")} *
                </label>
                <TextInput
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Note")}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-mainColor"
                  placeholder={t("Optional note...")}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t md:col-span-2">
                <StaticButton
                  text={t("Cancel")}
                  handleClick={() => setShowPayModal(false)}
                  bgColor="bg-gray-300"
                  Color="text-gray-700"
                />
                <SubmitButton text={t("Pay Now")} loading={loadingAdd} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-2xl font-bold text-mainColor">
                {t("EditExpense")}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-3xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {t("ExpenseName")} *
                  </label>
                  <TextInput
                    value={editExpenseName}
                    onChange={(e) => setEditExpenseName(e.target.value)}
                    placeholder={t("Enter expense name")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {t("Category")} *
                  </label>
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find(
                      (o) => o.value === editCategoryId
                    )}
                    onChange={(o) => setEditCategoryId(o?.value || "")}
                    styles={customStyles}
                    isSearchable
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {t("Financial Account")} *
                  </label>
                  <Select
                    options={financialOptions}
                    value={financialOptions.find(
                      (o) => o.value === editFinancialAccountId
                    )}
                    onChange={(o) => setEditFinancialAccountId(o?.value || "")}
                    styles={customStyles}
                    isSearchable
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {t("Amount")} *
                  </label>
                  <TextInput
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {t("Note")}
                  </label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-mainColor"
                    placeholder={t("Optionalnote")}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t">
                <StaticButton
                  text={t("Cancel")}
                  handleClick={() => setShowEditModal(false)}
                  bgColor="bg-gray-300"
                  Color="text-gray-700"
                />
                <SubmitButton
                  text={t("UpdateExpense")}
                  loading={loadingUpdate}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetailsModal && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-2xl font-bold text-mainColor">
                {t("Expense Details")}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-3xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <DetailItem label={t("ID")} value={selectedExpense.id} />
              <DetailItem
                label={t("Expense")}
                value={selectedExpense.expense}
              />
              <DetailItem
                label={t("Category")}
                value={selectedExpense.category?.name}
              />
              <DetailItem label={t("Amount")} value={selectedExpense.amount} />
              <DetailItem
                label={t("Branch")}
                value={selectedExpense.branch?.name}
              />
              <DetailItem
                label={t("Cashier")}
                value={selectedExpense.cashier?.name}
              />
              <DetailItem
                label={t("Cashier Man")}
                value={selectedExpense.cahier_man?.user_name}
              />
              <DetailItem
                label={t("Financial Account")}
                value={selectedExpense.financial_account?.name}
              />
              <DetailItem
                label={t("Admin")}
                value={selectedExpense.admin?.name}
              />
              <DetailItem
                label={t("Note")}
                value={selectedExpense.note || "-"}
              />
              <DetailItem
                label={t("CreatedAt")}
                value={new Date(selectedExpense.created_at).toLocaleString()}
              />
            </div>
            <div className="p-5 text-right border-t">
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
      )}
    </>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-lg font-semibold text-gray-900">{value || "-"}</span>
  </div>
);

export default ExpensesPayment;
