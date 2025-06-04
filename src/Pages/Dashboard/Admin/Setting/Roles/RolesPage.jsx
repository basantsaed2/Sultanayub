import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useDelete } from "../../../../../Hooks/useDelete";
import { StaticLoader, Switch } from "../../../../../Components/Components";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { Link } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet";
const RolesPage = ({ update, setUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchRoles, loading: loadingRoles, data: dataRoles } = useGet({
    url: `${apiUrl}/admin/admin_roles`
  });
  const { changeState, loadingChange, responseChange } = useChangeState();
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [Roles, setRoles] = useState([]);

  const [openDelete, setOpenDelete] = useState(null);
  const navigate = useNavigate();

  const [rolesData, setRolesData] = useState([]);
  const [openPermissionsView, setOpenPermissionsView] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const RolesPerPage = 20; // Limit to 20 Roles per page

  useEffect(() => {
    refetchRoles();
  }, [refetchRoles, update]); // Empty dependency array to only call refetch once on mount

  useEffect(() => {
    if (dataRoles && dataRoles.user_positions) {
      setRoles(dataRoles.user_positions);
    }
    console.log('dataRoles', dataRoles)
  }, [dataRoles]); // Only run this effect when `data` changes

  // Calculate total number of pages
  const totalPages = Math.ceil(Roles.length / RolesPerPage);

  // Get the Roles for the current page
  const currentRoles = Roles.slice(
    (currentPage - 1) * RolesPerPage,
    currentPage * RolesPerPage
  );

  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChangeStatus = async (id, name, status) => {
    const response = await changeState(
      `${apiUrl}/admin/admin_roles/status/${id}`,
      `${name} Changed Status.`,
      { status }
    );

    if (response) {
      setRoles((prevRoles) =>
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
      setRoles(Roles.filter((role) => role.id !== id));
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
    <div className="w-full pb-28 flex items-start justify-start overflow-x-scroll scrollSection">
      {loadingRoles || loadingChange || loadingDelete ? (
        <div className='w-full mt-40'>
          <StaticLoader />
        </div>
      ) : (
        <div className="w-full flex flex-col">
          {/* الجدول */}
          <table className="w-full sm:min-w-0 block overflow-x-scroll scrollPage">
            <thead className="w-full">
              <tr className="w-full border-b-2">
                {headers.map((name, index) => (
                  <th className="min-w-[120px] sm:w-[8%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3" key={index}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-full">
              {Roles.length === 0 ? (
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
                  <tr className="w-full border-b-2" key={index}>
                    <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {(currentPage - 1) * RolesPerPage + index + 1}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {role?.name || '-'}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <span
                        className="text-mainColor text-sm border-b border-mainColor font-TextFontMedium cursor-pointer hover:text-mainColor-dark transition"
                        onClick={() => handleOpenPermissionsView(role.id)}
                      >
                        View
                      </span>
                    </td>
                    {openPermissionsView === role.id && (
                      <Dialog
                        open={true}
                        onClose={handleClosePermissionsView}
                        className="relative z-10"
                      >
                        <DialogBackdrop className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" />
                        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
                          <DialogPanel className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
                            {/* Compact header */}
                            <div className="sticky top-0 bg-white px-4 py-3 border-b flex justify-between items-center">
                              <DialogTitle className="text-sm font-TextFontBold text-gray-800">
                                Permissions: {role.name || "Role"}
                              </DialogTitle>
                              <button
                                onClick={handleClosePermissionsView}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            {/* Compact content area with limited height */}
                            <div className="px-4 py-2 max-h-[50vh] overflow-y-auto">
                              {Array.isArray(role?.roles) && role.roles.length === 0 ? (
                                <div className="py-3 text-center text-sm text-gray-500">
                                  No permissions assigned
                                </div>
                              ) : Array.isArray(role?.roles) ? (
                                <div className="space-y-2">
                                  {Object.entries(
                                    role.roles.reduce((acc, permission) => {
                                      if (!acc[permission.role]) acc[permission.role] = [];
                                      acc[permission.role].push(permission);
                                      return acc;
                                    }, {})
                                  ).map(([roleName, permissions]) => (
                                    <div key={roleName} className="text-sm">
                                      <div className="font-TextFontMedium text-gray-700 py-1 capitalize">
                                        {roleName}:
                                      </div>
                                      <div className="flex flex-wrap gap-1 pl-2 mb-2">
                                        {permissions.map((p) => (
                                          <span
                                            key={p.id}
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${p.action === "all"
                                                ? "bg-green-100 text-green-800 font-medium"
                                                : "bg-gray-100 text-gray-800"
                                              }`}
                                          >
                                            {p.action}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-3 text-center text-sm text-red-500">
                                  Invalid permissions data
                                </div>
                              )}
                            </div>

                            {/* Compact footer */}
                            <div className="sticky bottom-0 bg-white px-4 py-2 border-t flex justify-end">
                              <button
                                onClick={handleClosePermissionsView}
                                className="text-sm text-mainColor hover:text-mainColor-dark font-TextFontMedium"
                              >
                                Close
                              </button>
                            </div>
                          </DialogPanel>
                        </div>
                      </Dialog>
                    )}
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <Switch
                        checked={role?.status === 1}
                        handleClick={() =>
                          handleChangeStatus(
                            role.id,
                            role.name,
                            role.status === 1 ? 0 : 1
                          )
                        }
                      />
                    </td>
                    <td className="py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`edit/${role.id}`} state={{ role }} ><EditIcon /></Link>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(role.id)}
                        >
                          <DeleteIcon />
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
          {Roles.length > 0 && (
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
                    className={`px-3 py-1 text-sm font-TextFontMedium rounded-md transition ${currentPage === page
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
