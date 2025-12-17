import React, { useEffect, useRef, useState } from "react";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useDelete } from "../../../../../Hooks/useDelete";
import { StaticLoader, Switch } from "../../../../../Components/Components";
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import SearchBar from "../../../../../Components/AnotherComponents/SearchBar";
import * as XLSX from 'xlsx'; // Import the XLSX library for export

const CustomersPage = ({ refetch, setUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const {
    refetch: refetchCustomer,
    loading: loadingCustomer,
    data: dataCustomer,
  } = useGet({
    url: `${apiUrl}/admin/customer`,
  });
  const { changeState, loadingChange, responseChange } = useChangeState();
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [openDelete, setOpenDelete] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { t, i18n } = useTranslation();

  // --- NEW STATE FOR SELECTIVE EXPORT ---
  const [selectedCustomerIds, setSelectedCustomerIds] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false); // Controls checkbox visibility
  // --------------------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 20;

  // Search functionality (remains the same)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer?.f_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.l_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.phone?.includes(searchTerm) ||
        customer?.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    setCurrentPage(1);
    // Clear selection when search changes to avoid selecting non-visible rows
    setSelectedCustomerIds(new Set());
  }, [searchTerm, customers]);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUserNameClick = (customer) => {
    navigate(`customer/${customer.id}`, {
      state: {
        customerData: customer
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    refetchCustomer();
  }, [refetchCustomer, refetch]);

  useEffect(() => {
    if (dataCustomer && dataCustomer.customers) {
      setCustomers(dataCustomer.customers);
      setFilteredCustomers(dataCustomer.customers);
      // Ensure selection is cleared on initial load or full data refresh
      setSelectedCustomerIds(new Set());
    }
  }, [dataCustomer]);

  // --- EXPORT/SELECTION LOGIC ---

  const toggleSelectionMode = () => {
    // Toggle the mode and clear selection when turning off
    setIsSelectionMode(prev => !prev);
    setSelectedCustomerIds(new Set());
  };

  const isCustomerSelected = (customerId) => selectedCustomerIds.has(customerId);

  const handleSelectOne = (customerId) => {
    setSelectedCustomerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    // We only select/deselect customers visible on the current page/filter
    const currentVisibleIds = filteredCustomers.map(c => c.id);
    const allSelected = currentVisibleIds.every(id => selectedCustomerIds.has(id));

    setSelectedCustomerIds(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Deselect all
        currentVisibleIds.forEach(id => newSet.delete(id));
      } else {
        // Select all
        currentVisibleIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleExportSelectedToExcel = () => {
    if (selectedCustomerIds.size === 0) {
      alert(t("Please select at least one customer to export."));
      return;
    }

    // Get the selected data from the full customer list
    const selectedData = customers.filter(c => selectedCustomerIds.has(c.id));

    // Map the data to the desired Excel/CSV format
    const exportData = selectedData.map(c => ({
      [t("Code")]: c.code || '',
      [t("Name")]: `${c.f_name || ''} ${c.l_name || ''}`,
      [t("Email")]: c.email || '',
      [t("Phone")]: c.phone || '',
      [t("Due Status")]: c.due_status === 1 ? t('Active') : t('Inactive'),
      [t("Total Order")]: c.orders_count || 0,
      [t("Total Order Amount")]: c.orders_sum_amount || 0,
      [t("Status")]: c.status === 1 ? t('Active') : t('Inactive'),
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("Customers"));

    // Generate and download Excel file
    XLSX.writeFile(wb, "Selected_Customers.xlsx");

    // Optionally exit selection mode after successful export
    setIsSelectionMode(false);
    setSelectedCustomerIds(new Set());
  };
  // --------------------------------------

  const handleChangeStaus = async (id, name, status) => {
    // ... (Your existing status change logic)
    const response = await changeState(
      `${apiUrl}/admin/customer/status/${id}`,
      `${name} Changed Status.`,
      { status }
    );

    if (response) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === id ? { ...customer, status: status } : customer
        )
      );
    }
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };

  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  const handleDelete = async (id, name) => {
    // ... (Your existing delete logic)
    const success = await deleteData(
      `${apiUrl}/admin/customer/delete/${id}`,
      `${name} Deleted Success.`
    );

    if (success) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      setUpdate(!refetch);
    }
  };

  // Dynamically build headers based on selection mode
  let headers = [];
  if (isSelectionMode) {
    // Add the Select All checkbox header only if in selection mode
    const isAllVisibleSelected = filteredCustomers.length > 0 && filteredCustomers.every(c => selectedCustomerIds.has(c.id));
    headers.push(
      <input
        type="checkbox"
        checked={isAllVisibleSelected}
        onChange={handleSelectAll}
        className="form-checkbox h-5 w-5 text-mainColor rounded cursor-pointer"
        title={t("Select All")}
      />
    );
  }

  headers = headers.concat([
    t("SL"),
    t("Image"),
    t("Code"),
    t("Name"),
    t("Email"),
    t("Phone"),
    t("Due Status"),
    t("Total Order"),
    t("Total Order Amount"),
    t("Status"),
    t("Action"),
  ]);

  return (
    <div className="flex flex-col items-start justify-start w-full overflow-x-scroll pb-28 scrollSection">

      {/* Action Bar: Search and Export Buttons */}
      <div className="flex flex-wrap items-center justify-between w-full mb-6 gap-4">
        {/* Search Bar */}
        <div className="max-w-md w-full sm:w-auto">
          <SearchBar
            value={searchTerm}
            handleChange={handleSearchChange}
            placeholder={t("Search customers...")}
            bgColor="bg-white"
            textColor="mainColor"
            pr="4"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {t("Found")} {filteredCustomers.length} {t("customers matching")} "{searchTerm}"
            </p>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex space-x-3">
          {isSelectionMode ? (
            <>
              <button
                type="button"
                onClick={handleExportSelectedToExcel}
                disabled={selectedCustomerIds.size === 0}
                className={`px-4 py-2 text-sm font-TextFontSemiBold text-white rounded-lg transition duration-150 ${selectedCustomerIds.size > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {t("Export Selected")} ({selectedCustomerIds.size})
              </button>
              <button
                type="button"
                onClick={toggleSelectionMode}
                className="px-4 py-2 text-sm font-TextFontSemiBold text-gray-700 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-150"
              >
                {t("Cancel Selection")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={toggleSelectionMode}
              className="px-4 py-2 text-sm font-TextFontSemiBold text-white rounded-lg bg-red-600 hover:bg-red-700 transition duration-150"
            >
              {t("Export Customers")}
            </button>
          )}
        </div>
      </div>


      <div className="flex items-start justify-start w-full">
        {loadingCustomer || loadingChange || loadingDelete ? (
          <div className="flex items-center justify-center w-full h-56">
            <StaticLoader />
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
              <thead className="w-full">
                <tr className="w-full border-b-2">
                  {headers.map((content, index) => (
                    <th
                      className="min-w-[50px] sm:w-[5%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3"
                      key={index}
                    >
                      {/* Render content directly (Checkbox or string) */}
                      {content}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="text-xl text-center text-mainColor font-TextFontMedium "
                    >
                      {searchTerm ? t("No customers found matching your search") : t("NotfindCustomers")}
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer, index) => (
                    <tr className="w-full border-b-2" key={customer.id}>

                      {/* --- CONDITIONAL CHECKBOX CELL --- */}
                      {isSelectionMode && (
                        <td className="min-w-[50px] sm:w-[5%] lg:w-[5%] py-2 text-center">
                          <input
                            type="checkbox"
                            checked={isCustomerSelected(customer.id)}
                            onChange={() => handleSelectOne(customer.id)}
                            className="form-checkbox h-5 w-5 text-mainColor rounded cursor-pointer"
                          />
                        </td>
                      )}
                      {/* --------------------------------- */}

                      <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {(currentPage - 1) * customersPerPage + index + 1}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 overflow-hidden">
                        <div className="flex justify-center">
                          <img
                            src={customer.image_link}
                            className="rounded-full bg-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                            alt="Photo"
                          />
                        </div>
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {customer?.code || "-"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        <button
                          onClick={() => handleUserNameClick(customer)}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
                        >
                          {customer?.f_name + " " + customer?.l_name || "-"}
                        </button>
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {customer?.email || "-"}
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        {customer?.phone || "-"}
                      </td>
                      <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${customer?.due_status === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {customer?.due_status === 1 ? t('Active') : t('Inactive')}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center lg:text-base">
                        <span className="px-2 py-1 text-blue-500 rounded-md bg-cyan-200">
                          {customer?.orders_count || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center lg:text-base">
                        <span className="px-2 py-1 text-blue-500 rounded-md bg-cyan-200">
                          {customer?.orders_sum_amount || "-"}
                        </span>
                      </td>
                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                        <Switch
                          checked={customer.status}
                          handleClick={() => {
                            handleChangeStaus(
                              customer.id,
                              customer?.f_name + " " + customer?.l_name,
                              customer.status === 1 ? 0 : 1
                            );
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`edit/${customer.id}`}>
                            <EditIcon />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(customer.id)}
                          >
                            <DeleteIcon />
                          </button>
                          {openDelete === customer.id && (
                            // ... (Delete Dialog code remains the same)
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
                                          {t("Youwilldeletecustomer")}{" "}
                                          {customer?.f_name +
                                            " " +
                                            customer?.l_name || "-"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                      <button
                                        className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                        onClick={() =>
                                          handleDelete(
                                            customer.id,
                                            customer?.f_name +
                                            " " +
                                            customer?.l_name
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination remains the same */}
            {filteredCustomers.length > 0 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;