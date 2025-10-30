import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../../Assets/Icons/AllIcons";
import { Link, useNavigate } from "react-router-dom";
import {
    AddButton,
    StaticLoader,
    Switch,
    TitlePage,
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { useChangeState } from "../../../../../Hooks/useChangeState";
import { useDelete } from "../../../../../Hooks/useDelete";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Warning from "../../../../../Assets/Icons/AnotherIcons/WarningIcon";
import { t } from "i18next";
import { IoInformationCircleOutline } from "react-icons/io5";

const GroupModules = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const {
        refetch: refetchGroupModules,
        loading: loadingGroupModules,
        data: dataGroupModules,
    } = useGet({
        url: `${apiUrl}/admin/group_product`,
    });
    const { deleteData, loadingDelete } = useDelete();
    const { changeState, loadingChange } = useChangeState();

    const [GroupModules, setGroupModules] = useState([]);
    const [openDelete, setOpenDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const GroupModulesPerPage = 20;

    // Calculate total number of pages
    const totalPages = Math.ceil(GroupModules.length / GroupModulesPerPage);

    // Get the groups for the current page
    const currentGroupModules = GroupModules.slice(
        (currentPage - 1) * GroupModulesPerPage,
        currentPage * GroupModulesPerPage
    );

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Update groups when data changes
    useEffect(() => {
        if (dataGroupModules && dataGroupModules.group_products) {
            setGroupModules(dataGroupModules.group_products);
        }
    }, [dataGroupModules]);

    // Fetch groups on mount
    useEffect(() => {
        refetchGroupModules();
    }, [refetchGroupModules]);

    // Change Group Modules status
    const handleChangeStatus = async (id, name, status) => {
        const response = await changeState(
            `${apiUrl}/admin/group_product/status/${id}`,
            `${name} Changed Status.`,
            { status }
        );

        if (response) {
            setGroupModules((prevGroupModules) =>
                prevGroupModules.map((GroupModules) =>
                    GroupModules.id === id ? { ...GroupModules, status } : GroupModules
                )
            );
        }
    };

    // Delete GroupModules
    const handleDelete = async (id, name) => {
        const success = await deleteData(
            `${apiUrl}/admin/group_product/delete/${id}`,
            `${name} Deleted Success.`
        );

        if (success) {
            setGroupModules(GroupModules.filter((group) => group.id !== id));
            handleCloseDelete();
        }
    };

    // Navigate to products page
    const handleViewProducts = (groupId, groupName) => {
        navigate(`products/${groupId}`, {
            state: {
                groupId: groupId,
                groupName: groupName
            }
        });
    };

    // Dialog controls
    const handleOpenDelete = (id) => {
        setOpenDelete(id);
    };
    const handleCloseDelete = () => {
        setOpenDelete(null);
    };

    const headers = [
        t("SL"),
        t("Name"),
        t("Increase Percentage"),
        t("Decrease Percentage"),
        t("Products"),
        t("Status"),
        t("Action"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
            {loadingGroupModules || loadingChange || loadingDelete ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <div className="w-full md:w-1/2">
                            <TitlePage text={t("Group Modules Table")} />
                        </div>
                        <div className="flex justify-end w-full py-4 md:w-1/2">
                            <Link to="add">
                                <AddButton Text={t("Add Group Modules")} />
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
                            {GroupModules.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="text-xl text-center text-mainColor font-TextFontMedium"
                                    >
                                        {t("No GroupModules found")}
                                    </td>
                                </tr>
                            ) : (
                                currentGroupModules.map((group, index) => (
                                    <tr className="w-full border-b-2" key={group.id}>
                                        <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {(currentPage - 1) * GroupModulesPerPage + index + 1}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {group?.name || "-"}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {group?.increase_precentage !== null && group?.increase_precentage !== undefined
                                                ? `${group.increase_precentage}%`
                                                : "-"}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            {group?.decrease_precentage !== null && group?.decrease_precentage !== undefined
                                                ? `${group.decrease_precentage}%`
                                                : "-"}
                                        </td>
                                        <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => handleViewProducts(group.id, group.name)}
                                                className="text-mainColor hover:text-red-700 transition-colors underline text-sm sm:text-base"
                                            >
                                                {t("View Products")}
                                            </button>
                                        </td>
                                        <td className="min-w-[100px] sm:min-w-[80px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                            <Switch
                                                checked={group.status === 1}
                                                handleClick={() => {
                                                    handleChangeStatus(
                                                        group.id,
                                                        group.name,
                                                        group.status === 1 ? 0 : 1
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td className="min-w-[120px] sm:min-w-[100px] px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link to={`edit/${group.id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenDelete(group.id)}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                        {/* Delete Dialog */}
                                        {openDelete === group.id && (
                                            <Dialog
                                                open={true}
                                                onClose={handleCloseDelete}
                                                className="relative z-10"
                                            >
                                                <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                                        <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-md">
                                                            <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                                                <Warning
                                                                    width="28"
                                                                    height="28"
                                                                    aria-hidden="true"
                                                                />
                                                                <div className="flex items-center">
                                                                    <div className="mt-2 text-center">
                                                                        {t("You will delete")} {group.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                <button
                                                                    className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                                                    onClick={() =>
                                                                        handleDelete(group.id, group.name)
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {GroupModules.length > 0 && (
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

export default GroupModules;