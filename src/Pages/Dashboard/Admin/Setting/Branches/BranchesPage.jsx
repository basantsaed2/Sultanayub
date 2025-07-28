import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useDelete } from "../../../../../Hooks/useDelete";
import { StaticLoader, Switch } from "../../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { useTranslation } from "react-i18next";

const BranchesPage = ({ refetch }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchBranches,
    loading: loadingBranches,
    data: dataBranches,
  } = useGet({
    url: `${apiUrl}/admin/branch`,
  });
  const { changeState, loadingChange, responseChange } = useChangeState();
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [branches, setBranches] = useState([]);
  const { t, i18n } = useTranslation();
  const [openDelete, setOpenDelete] = useState(null);
  const [openReasonModal, setOpenReasonModal] = useState(null);
  const [reason, setReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 20;
  const totalPages = Math.ceil(branches.length / branchesPerPage);
  const currentBranches = branches.slice(
    (currentPage - 1) * branchesPerPage,
    currentPage * branchesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    refetchBranches();
  }, [refetchBranches, refetch]);

  const handleChangeStatus = async (id, name, status, reason = "") => {
    const payload = status === 0 ? { status, block_reason: reason } : { status };
    const response = await changeState(
      `${apiUrl}/admin/branch/status/${id}`,
      `${name} Changed Status.`,
      payload
    );

    if (response) {
      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch.id === id ? { ...branch, status } : branch
        )
      );
    }
  };

  const handleOpenReasonModal = (branch) => {
    setOpenReasonModal(branch);
  };

  const handleCloseReasonModal = () => {
    setOpenReasonModal(null);
    setReason("");
  };

  const handleSubmitReason = async () => {
    if (openReasonModal && reason.trim()) {
      await handleChangeStatus(
        openReasonModal.id,
        openReasonModal.name,
        0,
        reason
      );
      handleCloseReasonModal();
    }
  };

  const handleSwitchClick = (branch) => {
    if (branch.status === 1) {
      handleOpenReasonModal(branch);
    } else {
      handleChangeStatus(branch.id, branch.name, 1);
    }
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };

  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  const handleDelete = async (id, name) => {
    const success = await deleteData(
      `${apiUrl}/admin/branch/delete/${id}`,
      `${name} Deleted Success.`
    );

    if (success) {
      setBranches(branches.filter((branch) => branch.id !== id));
    }
  };

  useEffect(() => {
    if (dataBranches && dataBranches.branches) {
      setBranches(dataBranches.branches);
    }
  }, [dataBranches]);

  const headers = [
    t("#"),
    t("Image"),
    t("Name"),
    t("City"),
    t("Address"),
    t("Phone"),
    t("PreparationTime"),
    t("kitchen"),
    t("Brista"),
    t("BranchCategory"),
    t("ActiveBranchPhone"),
    t("Status"),
    t("Action"),
  ];

  return (
    <div className="flex items-start justify-start w-full overflow-x-scroll pb-28 scrollSection">
      {loadingBranches || loadingChange || loadingDelete ? (
        <div className="w-full mt-40">
          <StaticLoader />
        </div>
      ) : (
        <div className="flex flex-col w-full">
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
              {branches.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-xl text-center text-mainColor font-TextFontMedium"
                  >
                    {t("NotfindBranches")}
                  </td>
                </tr>
              ) : (
                currentBranches.map((branch, index) => (
                  <tr className="w-full border-b-2" key={index}>
                    <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {(currentPage - 1) * branchesPerPage + index + 1}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <div className="flex justify-center">
                        <img
                          src={branch.image_link}
                          className="border-2 rounded-full bg-mainColor border-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                          loading="lazy"
                          alt="Photo"
                        />
                      </div>
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {branch?.name || "-"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {branch?.city?.name || "-"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {branch?.address || "-"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {branch?.phone || "-"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {branch?.food_preparion_time || "-"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                      <Link
                        to={`branch_kitchen/${branch.id}`}
                        className="text-xl border-b-2 cursor-pointer text-mainColor border-mainColor font-TextFontSemiBold"
                      >
                        {t("Kitchens")}
                      </Link>
                    </td>
                     <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                      <Link
                        to={`branch_birsta/${branch.id}`}
                        className="text-xl border-b-2 cursor-pointer text-mainColor border-mainColor font-TextFontSemiBold"
                      >
                        {t("Brista")}
                      </Link>
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                      <Link
                        to={`branch_category/${branch.id}`}
                        className="text-xl border-b-2 cursor-pointer text-mainColor border-mainColor font-TextFontSemiBold"
                      >
                        {t("View")}
                      </Link>
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                      <Link
                        to={`branch_category/${branch.id}`}
                        className="text-xl border-b-2 cursor-pointer text-mainColor border-mainColor font-TextFontSemiBold"
                      >
                        {t("View")}
                      </Link>
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {branch?.phone_status === 1 ? "Active" : "Inactive" || "-"}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <Switch
                        checked={branch.status === 1}
                        handleClick={() => handleSwitchClick(branch)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`edit/${branch.id}`}>
                          <EditIcon />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(branch.id)}
                        >
                          <DeleteIcon />
                        </button>
                        {openDelete === branch.id && (
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
                                    <div className="mt-2 text-center">
                                      {t("Youwilldeletebranch")}{" "}
                                      {branch?.name || "-"}
                                    </div>
                                  </div>
                                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                      className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                      onClick={() =>
                                        handleDelete(branch.id, branch.name)
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
          {openReasonModal && (
            <Dialog
              open={true}
              onClose={handleCloseReasonModal}
              className="relative z-10"
              aria-labelledby="reason-modal-title"
              aria-describedby="reason-modal-description"
            >
              <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out" />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                  <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ease-in-out sm:my-8 sm:max-w-lg">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-mainColor/10">
                      <div className="flex items-center gap-3">
                        <h3
                          id="reason-modal-title"
                          className="text-lg font-TextFontSemiBold text-mainColor"
                        >
                          {t("Enter Reason For Deactivation")}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseReasonModal}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor rounded-full"
                        aria-label={t("Close")}
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="px-6 py-5">
                      <p id="reason-modal-description" className="text-sm text-thirdColor">
                        {t("Please Provide Reason")} <span className="font-TextFontMedium">{openReasonModal?.name || "-"}</span>
                      </p>
                      <div className="mt-4">
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className={`w-full p-3 border rounded-md text-sm font-TextFontLight focus:ring-1 focus:ring-mainColor duration-200 ${!reason.trim() ? "border-red-300" : "border-gray-300"
                            }`}
                          rows="4"
                          placeholder={t("Type Reason Here")}
                          aria-describedby="reason-counter"
                          maxLength="500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row-reverse gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={handleSubmitReason}
                        disabled={!reason.trim()}
                        className="inline-flex justify-center px-6 py-2 text-sm text-white rounded-md bg-mainColor font-TextFontSemiBold shadow-sm hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-mainColor disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {t("Submit")}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseReasonModal}
                        className="inline-flex justify-center px-6 py-2 text-sm text-gray-900 bg-white rounded-md font-TextFontMedium ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mainColor transition-colors duration-200"
                      >
                        {t("Cancel")}
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          )}
          {branches.length > 0 && (
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
  );
};

export default BranchesPage;