import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../Assets/Icons/AllIcons";
import { Link } from "react-router-dom";
import {
  AddButton,
  StaticLoader,
  Switch,
  TitlePage,
} from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { useChangeState } from "../../../../Hooks/useChangeState";
import { useDelete } from "../../../../Hooks/useDelete";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { t } from "i18next";

const CashierMan = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchCashier,
    loading: loadingCashier,
    data: dataCashier,
  } = useGet({
    url: `${apiUrl}/admin/cashier_man`,
  });
  const { deleteData, loadingDelete } = useDelete();
  const { changeState, loadingChange } = useChangeState();
  const { changeState: changeLogoutStatus, loadingChange: loadingChangeLogout } = useChangeState();

  const [cashiersMan, setCashiersMan] = useState([]);
  const [openDelete, setOpenDelete] = useState(null);
  const [openRoles, setOpenRoles] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const cashiersManPerPage = 20;

  const totalPages = Math.ceil(cashiersMan.length / cashiersManPerPage);

  const currentCashiersMan = cashiersMan.slice(
    (currentPage - 1) * cashiersManPerPage,
    currentPage * cashiersManPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (dataCashier && dataCashier.cashier_men) {
      setCashiersMan(dataCashier.cashier_men);
    }
  }, [dataCashier]);

  useEffect(() => {
    refetchCashier();
  }, [refetchCashier]);

  const handleChangeStatus = async (id, name, status) => {
    const response = await changeState(
      `${apiUrl}/admin/cashier_man/status/${id}`,
      `${name} Changed Status.`,
      { status }
    );

    if (response) {
      setCashiersMan((prevCashiers) =>
        prevCashiers.map((cashier) =>
          cashier.id === id ? { ...cashier, status } : cashier
        )
      );
    }
  };

  // Change logout status function
  const handleChangeLogout = async (id, name, currentLogoutStatus) => {
    const response = await changeLogoutStatus(
      `${apiUrl}/admin/cashier_man/logout/${id}`,
      `${name} ${currentLogoutStatus ? 'Logged Out' : 'Logged In'} Successfully`,
      { logout: currentLogoutStatus ? 0 : 1 } // Toggle logout status
    );

    if (response) {
      setCashiersMan((prevCashiers) =>
        prevCashiers.map((cashier) =>
          cashier.id === id ? { ...cashier, login: currentLogoutStatus ? 0 : 1 } : cashier
        )
      );
    }
  };

  const handleDelete = async (id, name) => {
    const success = await deleteData(
      `${apiUrl}/admin/cashier_man/delete/${id}`,
      `${name} Deleted Success.`
    );

    if (success) {
      setCashiersMan(cashiersMan.filter((cashier) => cashier.id !== id));
      handleCloseDelete();
    }
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(id);
  };
  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  const handleOpenRoles = (cashier) => {
    setOpenRoles(cashier);
  };
  const handleCloseRoles = () => {
    setOpenRoles(null);
  };

  const headers = [
    t("SL"),
    t("Name"),
    t("Cashier"), // Changed from "Name" to "Cashier"
    t("Manager"),
    t("Branch"),
    t("Image"),
    t("Shift Number"),
    t("Report Permission"),
    t("Take Away"),
    t("Dine In"),
    t("Delivery"),
    t("Real Order"),
    t("Online Order"),
    t("Discount Perimission"),
    t("Void Order"),
    t("Service Fees"),
    t("Total Tax"),
    t("Enter Amount"),
    t("Status"),
    t("Roles"),
    t("Action"),
  ];

  return (
    <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
      {loadingCashier || loadingChange || loadingDelete || loadingChangeLogout ? (
        <div className="flex items-center justify-center w-full h-56">
          <StaticLoader />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="w-full md:w-1/2">
              <TitlePage text={t("Cashier Man Table")} />
            </div>
            <div className="flex justify-end w-full py-4 md:w-1/2">
              <Link to="add">
                <AddButton Text={t("Add Cashier Man")} />
              </Link>
            </div>
          </div>
          <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
            <thead className="w-full">
              <tr className="w-full border-b-2">
                {headers.map((name, index) => (
                  <th
                    className="min-w-[120px] sm:w-[8%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3"
                    key={index}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-full">
              {cashiersMan.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-xl text-center text-mainColor font-TextFontMedium"
                  >
                    {t("No cashiers found")}
                  </td>
                </tr>
              ) : (
                currentCashiersMan.map((cashier, index) => (
                  <tr className="w-full border-b-2" key={cashier.id}>
                    <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {(currentPage - 1) * cashiersManPerPage + index + 1}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {cashier?.user_name || "-"}
                    </td>
                    <td className="min-w-[200px] sm:min-w-[150px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span>{cashier?.cashier?.name || "-"}</span>
                        {(cashier.login == 1) && (
                          <button
                            type="button"
                            onClick={() => handleChangeLogout(cashier.id, cashier.user_name, cashier.login)}
                            className="px-3 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors font-TextFontMedium"
                          >
                            {t("Logout")}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {cashier?.manger === 1 ? "Cashier & Manager" : "Cashier"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {cashier?.branch?.name || "-"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {cashier.image_link && cashier.image_link !== "https://bcknd.food2go.online/storage" ? (
                        <img
                          src={cashier.image_link}
                          alt={cashier.user_name}
                          className="w-12 h-12 rounded-full mx-auto object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {cashier?.shift_number || "-"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {cashier?.report || "-"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.take_away === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.dine_in === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.delivery === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.real_order === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.online_order === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.discount_perimission === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.void_order === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.service_fees === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.total_tax === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      {cashier.enter_amount === 1 ? "✔" : "✘"}
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <Switch
                        checked={cashier.status === 1}
                        handleClick={() => {
                          handleChangeStatus(
                            cashier.id,
                            cashier.user_name,
                            cashier.status === 1 ? 0 : 1
                          );
                        }}
                      />
                    </td>
                    <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl">
                      <button
                        type="button"
                        onClick={() => handleOpenRoles(cashier)}
                        className="text-mainColor hover:text-red-700 transition-colors underline"
                      >
                        {t("View Roles")}
                      </button>
                    </td>
                    <td className="min-w-[120px] sm:min-w-[100px] px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`edit/${cashier.id}`}>
                          <EditIcon />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(cashier.id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                    {/* Delete Dialog */}
                    {openDelete === cashier.id && (
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
                                    {t("You will delete")} {cashier.user_name}
                                  </div>
                                </div>
                              </div>
                              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                  onClick={() =>
                                    handleDelete(cashier.id, cashier.user_name)
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
                    {/* Roles Dialog */}
                    {openRoles && openRoles.id === cashier.id && (
                      <Dialog
                        open={true}
                        onClose={handleCloseRoles}
                        className="relative z-10"
                      >
                        <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-md">
                              <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                <h2 className="text-xl font-TextFontSemiBold text-mainColor mb-4">
                                  {t("Roles for")} {cashier.user_name}
                                </h2>
                                <div className="w-full">
                                  {cashier.roles && cashier.roles.length > 0 ? (
                                    <ul className="space-y-2">
                                      {cashier.roles.map((role, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center justify-between p-3 bg-gray-100 rounded-md text-base font-TextFontRegular text-thirdColor"
                                        >
                                          <span>
                                            {role.roles
                                              ? t(
                                                role.roles
                                                  .replace("_", " ")
                                                  .toLowerCase()
                                              )
                                              : "-"}
                                          </span>
                                          <span className="text-green-600">✔</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-base font-TextFontRegular text-thirdColor">
                                      {t("No Roles Assigned")}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  onClick={handleCloseRoles}
                                  className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontMedium sm:w-auto"
                                >
                                  {t("Close")}
                                </button>
                              </div>
                            </DialogPanel>
                          </div>
                        </div>
                      </Dialog>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {cashiersMan.length > 0 && (
            <div className="flex flex-wrap items-center justify-center my-6 gap-x-4">
              {currentPage !== 1 && (
                <button
                  type="button"
                  className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page ? "bg-mainColor text-white" : "text-mainColor"
                    }`}
                >
                  {page}
                </button>
              ))}
              {totalPages !== currentPage && (
                <button
                  type="button"
                  className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CashierMan;