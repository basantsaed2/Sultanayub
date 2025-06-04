import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDelete } from "../../../../../Hooks/useDelete";
import { StaticLoader } from "../../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { useAuth } from "../../../../../Context/Auth";

const EmailPage = ({ emails, refetchEmails }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { deleteData, loadingDelete } = useDelete();
  const auth = useAuth();

  const [emailsData, setEmailsData] = useState([]);
  const [openDelete, setOpenDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 20;

  // Refetch emails when returning to /emails
  useEffect(() => {
    if (location.pathname === "/emails" && refetchEmails) {
      refetchEmails();
    }
  }, [location, refetchEmails]);

  // Update emailsData when emails prop changes
  useEffect(() => {
    if (emails && Array.isArray(emails)) {
      setEmailsData(emails);
    }
  }, [emails]);

  const totalPages = Math.ceil(emailsData.length / emailsPerPage);

  const currentEmails = emailsData.slice(
    (currentPage - 1) * emailsPerPage,
    currentPage * emailsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenDelete = (itemId) => setOpenDelete(itemId);
  const handleCloseDelete = () => setOpenDelete(null);

  // Handle email deletion
  const handleDelete = async (id) => {
    try {
      await deleteData(`${apiUrl}/admin/settings/business_setup/order_delay_notification/delete/${id}`, auth.token); 
      setOpenDelete(null); 
      refetchEmails(); 
      auth.toastSuccess("Email deleted successfully.");
    } catch (error) {
      console.error("Failed to delete email:", error);
    }
  };
  

  const handleEdit = (emailItem) => {
    navigate(`edit/${emailItem.id}`, {
      state: {
        emailData: {
          id: emailItem.id,
          email: emailItem.email,
        },
      },
    });
  };

  const headers = ["#", "Email", "Action"];

  return (
    <div className="w-full pb-16 flex items-start justify-start overflow-x-auto">
      {loadingDelete ? (
        <div className="w-full mt-20 flex justify-center">
          <StaticLoader className="w-12 h-12" />
        </div>
      ) : (
        <div className="w-full flex flex-col">
          {/* Table */}
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {headers.map((name, index) => (
                  <th
                    key={index}
                    className="min-w-[100px] text-mainColor text-center font-TextFontRegular text-sm py-2"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emailsData.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-base text-mainColor font-TextFontMedium py-4"
                  >
                    No emails found.
                  </td>
                </tr>
              ) : (
                currentEmails.map((emailItem, index) => (
                  <tr
                    key={emailItem.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-2 text-center text-thirdColor text-sm">
                      {(currentPage - 1) * emailsPerPage + index + 1}
                    </td>
                    <td className="py-2 text-center text-thirdColor text-sm">
                      {emailItem.email}
                    </td>
                    <td className="py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(emailItem)}
                          className="p-1 rounded-full hover:bg-gray-200 transition"
                        >
                          <EditIcon className="w-5 h-5 text-mainColor" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(emailItem.id)}
                          className="p-1 rounded-full hover:bg-gray-200 transition"
                        >
                          <DeleteIcon className="w-5 h-5 text-red-500" />
                        </button>

                        {/* Delete Confirmation Dialog */}
                        {openDelete === emailItem.id && (
                          <Dialog
                            open={true}
                            onClose={handleCloseDelete}
                            className="relative z-10"
                          >
                            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                                  <div className="flex flex-col items-center justify-center bg-white px-4 pb-4 pt-5 sm:p-4 sm:pb-4">
                                    <Warning
                                      width="24"
                                      height="24"
                                      aria-hidden="true"
                                    />
                                    <div className="mt-2 text-center text-sm">
                                      You are about to delete the email{" "}
                                      <span className="font-TextFontMedium">
                                        {emailItem.email}
                                      </span>
                                      .
                                    </div>
                                  </div>
                                  <div className="px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
  onClick={() => handleDelete(emailItem.id)}
  className="inline-flex w-full justify-center rounded-md bg-mainColor px-4 py-2 text-sm font-TextFontMedium text-white shadow-sm sm:ml-2 sm:w-auto hover:bg-mainColor-dark"
>
  Confirm Delete
</button>


                                    <button
                                      type="button"
                                      onClick={handleCloseDelete}
                                      className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-TextFontMedium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto hover:bg-gray-50"
                                    >
                                      Cancel
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

          {/* Pagination */}
          {emailsData.length > 0 && (
            <div className="my-4 flex flex-wrap items-center justify-center gap-x-2">
              {currentPage > 1 && (
                <button
                  type="button"
                  className="text-sm px-3 py-1 rounded-md bg-mainColor text-white font-TextFontMedium hover:bg-mainColor-dark transition"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm font-TextFontMedium rounded-md transition ${
                      currentPage === page
                        ? "bg-mainColor text-white"
                        : "text-mainColor hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {currentPage < totalPages && (
                <button
                  type="button"
                  className="text-sm px-3 py-1 rounded-md bg-mainColor text-white font-TextFontMedium hover:bg-mainColor-dark transition"
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

export default EmailPage;