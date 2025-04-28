import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useDelete } from "../../../../../Hooks/useDelete";
import { StaticLoader, Switch } from "../../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";

const RolesPage = ({ loadingRoles, roles }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { changeState, loadingChange } = useChangeState();
  const { deleteData, loadingDelete } = useDelete();

  const [rolesData, setRolesData] = useState([]);
  const [openPermissionsView, setOpenPermissionsView] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 20;

  useEffect(() => {
    setRolesData(roles);
  }, [roles]);

  const totalPages = Math.ceil(rolesData.length / rolesPerPage);

  const currentRoles = rolesData.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleChangeStatus = async (id, name, status) => {
    const response = await changeState(
      `${apiUrl}/admin/admin_roles/status/${id}`,
      `${name} Changed Status.`,
      { status }
    );

    if (response) {
      setRolesData((prevRoles) =>
        prevRoles.map((role) =>
          role.id === id ? { ...role, status: status } : role
        )
      );
    }
  };

  const handleOpenPermissionsView = (item) => setOpenPermissionsView(item);
  const handleClosePermissionsView = () => setOpenPermissionsView(null);

  const handleOpenDelete = (item) => setOpenDelete(item);
  const handleCloseDelete = () => setOpenDelete(null);

  const handleDelete = async (id, name) => {
    const success = await deleteData(
      `${apiUrl}/admin/admin_roles/delete/${id}`,
      `${name} Deleted Success.`
    );

    if (success) {
      setRolesData(rolesData.filter((role) => role.id !== id));
    }
  };

  const handleEdit = (role) => {
    navigate(`/dashboard/setting/roles/edit/${role.id}`, {
      state: {
        roleData: {
          id: role.id,
          name: role.name,
          status: role.status,
          roles: role.roles || [],
        },
      },
    });
  };

  const headers = ["#", "Name", "Permissions", "Status", "Action"];

  return (
    <div className="w-full pb-16 flex items-start justify-start overflow-x-auto">
      {loadingRoles || loadingChange || loadingDelete ? (
        <div className="w-full mt-20 flex justify-center">
          <StaticLoader className="w-12 h-12" />
        </div>
      ) : (
        <div className="w-full flex flex-col">
          {/* الجدول */}
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="w-full">
              <tr className="w-full border-b border-gray-200">
                {headers.map((name, index) => (
                  <th
                    className="min-w-[100px] text-mainColor text-center font-TextFontRegular text-sm py-2"
                    key={index}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-full">
              {rolesData.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center text-base text-mainColor font-TextFontMedium py-4"
                  >
                    No roles found.
                  </td>
                </tr>
              ) : (
                currentRoles.map((role, index) => (
                  <tr
                    className="w-full border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                    key={role.id}
                  >
                    <td className="min-w-[60px] py-2 text-center text-thirdColor text-sm overflow-hidden">
                      {(currentPage - 1) * rolesPerPage + index + 1}
                    </td>
                    <td className="min-w-[120px] py-2 text-center text-thirdColor text-sm overflow-hidden">
                      {role.name}
                    </td>
                    <td className="min-w-[120px] py-2 text-center text-thirdColor text-sm overflow-hidden">
                      <span
                        className="text-mainColor text-sm border-b border-mainColor font-TextFontMedium cursor-pointer hover:text-mainColor-dark transition"
                        onClick={() => handleOpenPermissionsView(role.id)}
                      >
                        View
                      </span>

                      {/* Dialog لعرض الـ Permissions */}
                      {openPermissionsView === role.id && (
                        <Dialog
                          open={true}
                          onClose={handleClosePermissionsView}
                          className="relative z-10"
                        >
                          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                {Array.isArray(role?.roles) &&
                                role.roles.length === 0 ? (
                                  <div className="w-full text-center text-sm font-TextFontMedium text-gray-500 my-3">
                                    No Permissions for this Role.
                                  </div>
                                ) : Array.isArray(role?.roles) ? (
                                  <div className="flex flex-wrap gap-2 justify-center px-4 py-3">
                                    {role.roles.map((permission, index) => (
                                      <div
                                        key={permission.id || index}
                                        className="w-full flex items-center justify-center shadow-sm hover:shadow-none duration-300 py-2 px-3 rounded-lg bg-gray-50"
                                      >
                                        <span className="text-mainColor text-sm font-TextFontMedium capitalize">
                                          {index + 1}. {permission.role} -{" "}
                                          {permission.action}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="w-full text-center text-sm font-TextFontMedium text-red-500 my-3">
                                    Invalid Permissions Data
                                  </div>
                                )}
                                <div className="px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
                                    type="button"
                                    onClick={handleClosePermissionsView}
                                    className="mt-2 inline-flex w-full justify-center rounded-md bg-mainColor px-4 py-2 text-sm font-TextFontMedium text-white shadow-sm sm:mt-0 sm:w-auto hover:bg-mainColor-dark focus:outline-none"
                                  >
                                    Close
                                  </button>
                                </div>
                              </DialogPanel>
                            </div>
                          </div>
                        </Dialog>
                      )}
                    </td>
                    <td className="min-w-[100px] py-2 text-center text-thirdColor text-sm overflow-hidden">
                      <Switch
                        checked={role?.status === 1}
                        handleClick={() =>
                          handleChangeStatus(
                            role.id,
                            role.name,
                            role.status === 1 ? 0 : 1
                          )
                        }
                        className="scale-75"
                      />
                    </td>
                    <td className="py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(role)}
                          className="p-1 rounded-full hover:bg-gray-200 transition"
                        >
                          <EditIcon className="w-5 h-5 text-mainColor" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(role.id)}
                          className="p-1 rounded-full hover:bg-gray-200 transition"
                        >
                          <DeleteIcon className="w-5 h-5 text-red-500" />
                        </button>

                        {/* Dialog لتأكيد الحذف */}
                        {openDelete === role.id && (
                          <Dialog
                            open={openDelete === role.id}
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
                                      You are about to delete the role{" "}
                                      <span className="font-TextFontMedium">
                                        {role?.name || "-"}
                                      </span>
                                      .
                                    </div>
                                  </div>
                                  <div className="px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                      className="inline-flex w-full justify-center rounded-md bg-mainColor px-4 py-2 text-sm font-TextFontMedium text-white shadow-sm sm:ml-2 sm:w-auto hover:bg-mainColor-dark"
                                      onClick={() =>
                                        handleDelete(role.id, role.name)
                                      }
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
          {rolesData.length > 0 && (
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

export default RolesPage;
