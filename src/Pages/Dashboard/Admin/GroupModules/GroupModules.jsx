import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../Assets/Icons/AllIcons";
import { Link, useNavigate } from "react-router-dom";
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
import { IoInformationCircleOutline, IoClose } from "react-icons/io5";

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
    const [openModules, setOpenModules] = useState(null);
    const [selectedGroupModules, setSelectedGroupModules] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const GroupModulesPerPage = 20;

    const totalPages = Math.ceil(GroupModules.length / GroupModulesPerPage);
    const currentGroupModules = GroupModules.slice(
        (currentPage - 1) * GroupModulesPerPage,
        currentPage * GroupModulesPerPage
    );

    useEffect(() => {
        if (dataGroupModules?.group_products) {
            setGroupModules(dataGroupModules.group_products);
        }
    }, [dataGroupModules]);

    useEffect(() => {
        refetchGroupModules();
    }, [refetchGroupModules]);

    const handleChangeStatus = async (id, name, status) => {
        const response = await changeState(
            `${apiUrl}/admin/group_product/status/${id}`,
            `${name} Changed Status.`,
            { status }
        );

        if (response) {
            setGroupModules((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status } : item
                )
            );
        }
    };

    const handleDelete = async (id, name) => {
        const success = await deleteData(
            `${apiUrl}/admin/group_product/delete/${id}`,
            `${name} Deleted Success.`
        );

        if (success) {
            setGroupModules((prev) => prev.filter((g) => g.id !== id));
            handleCloseDelete();
        }
    };

    const handleViewProducts = (groupId, groupName) => {
        navigate(`products/${groupId}`, {
            state: { groupId, groupName }
        });
    };

    // Modules Dialog
    const handleOpenModules = (group) => {
        // FIXED: it was group.modules → should be group.module
        const modules = Array.isArray(group.module) ? group.module : [];
        setSelectedGroupModules(modules);
        setOpenModules(group.id);
    };

    const handleCloseModules = () => {
        setOpenModules(null);
        setSelectedGroupModules([]);
    };

    const handleOpenDelete = (id) => setOpenDelete(id);
    const handleCloseDelete = () => setOpenDelete(null);

    const formatModuleName = (module) => {
        return module.charAt(0).toUpperCase() + module.slice(1).replace('_', ' ');
    };

    const headers = [
        t("SL"),
        t("Name"),
        t("Increase %"),
        t("Decrease %"),
        t("Modules"),
        t("Products"),
        t("Due"),
        t("Status"),
        t("Action"),
    ];

    return (
        <div className="flex items-start justify-start w-full overflow-x-scroll p-2 pb-28 scrollSection">
            {(loadingGroupModules || loadingChange || loadingDelete) ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="flex flex-col items-center justify-between md:flex-row mb-6">
                        <TitlePage text={t("Group Modules Table")} />
                        <Link to="add">
                            <AddButton Text={t("Add")} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max table-auto">
                            <thead>
                                <tr className="border-b-2">
                                    {headers.map((name, i) => (
                                        <th key={i} className="py-3 text-center text-mainColor font-TextFontLight">
                                            {name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {GroupModules.length === 0 ? (
                                    <tr>
                                        <td colSpan={headers.length} className="text-center py-8 text-xl text-mainColor">
                                            {t("No Group Modules found")}
                                        </td>
                                    </tr>
                                ) : (
                                    currentGroupModules.map((group, index) => (
                                        <tr key={group.id} className="border-b">
                                            <td className="py-4 text-center">
                                                {(currentPage - 1) * GroupModulesPerPage + index + 1}
                                            </td>
                                            <td className="py-3 text-center">{group.name || "-"}</td>
                                            <td className="py-3 text-center">
                                                {group.increase_precentage != null ? `${group.increase_precentage}%` : "-"}
                                            </td>
                                            <td className="py-3 text-center">
                                                {group.decrease_precentage != null ? `${group.decrease_precentage}%` : "-"}
                                            </td>

                                            {/* Modules Button - FIXED */}
                                            <td className="py-3 text-center">
                                                <button
                                                    onClick={() => handleOpenModules(group)}
                                                    className="flex items-center justify-center gap-1 mx-auto text-mainColor hover:text-blue-600 underline"
                                                >
                                                    <IoInformationCircleOutline size={18} />
                                                    {t("View Modules")} ({Array.isArray(group.module) ? group.module.length : 0})
                                                </button>
                                            </td>

                                            <td className="py-3 text-center">
                                                <button
                                                    onClick={() => handleViewProducts(group.id, group.name)}
                                                    className="text-mainColor hover:text-blue-600 underline"
                                                >
                                                    {t("View Products")}
                                                </button>
                                            </td>
                                            <td className="py-3 text-center">
                                                {group.due === 1 ? (
                                                    <span className="text-green-600 font-medium">{t("Yes")}</span>
                                                ) : (
                                                    <span className="text-red-600 font-medium">{t("No")}</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <Switch
                                                    checked={group.status === 1}
                                                    handleClick={() => handleChangeStatus(group.id, group.name, group.status === 1 ? 0 : 1)}
                                                />
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="flex justify-center gap-4">
                                                    <Link to={`edit/${group.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <button onClick={() => handleOpenDelete(group.id)}>
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modules Dialog - Now shows real data */}
                    {openModules && (
                        <Dialog open={true} onClose={handleCloseModules} className="relative z-50">
                            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                <DialogPanel className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
                                    <div className="flex items-center justify-between p-6 border-b">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {t("Group Modules")} - {GroupModules.find(g => g.id === openModules)?.name}
                                        </h3>
                                        <button onClick={handleCloseModules}>
                                            <IoClose size={28} className="text-gray-500 hover:text-gray-700" />
                                        </button>
                                    </div>

                                    <div className="p-6 max-h-96 overflow-y-auto">
                                        {selectedGroupModules.length === 0 ? (
                                            <p className="text-center text-gray-500 py-8">
                                                {t("No modules assigned to this group")}
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {selectedGroupModules.map((module, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                                                    >
                                                        <span className="font-medium text-gray-800">
                                                            {formatModuleName(module)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end p-6 border-t">
                                        <button
                                            onClick={handleCloseModules}
                                            className="px-6 py-3 bg-mainColor text-white rounded-xl font-semibold hover:bg-mainColor/90 transition"
                                        >
                                            {t("Close")}
                                        </button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </Dialog>
                    )}

                    {/* Delete Confirmation Dialog */}
                    {openDelete && (
                        <Dialog open={true} onClose={handleCloseDelete} className="relative z-50">
                            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                <DialogPanel className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
                                    <Warning width="48" height="48" className="mx-auto mb-4 text-red-500" />
                                    <p className="text-lg font-medium text-gray-800">
                                        {t("You will delete")} <strong>{GroupModules.find(g => g.id === openDelete)?.name}</strong>
                                    </p>
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={handleCloseDelete}
                                            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 rounded-xl hover:bg-gray-50"
                                        >
                                            {t("Cancel")}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(openDelete, GroupModules.find(g => g.id === openDelete)?.name)}
                                            className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                                        >
                                            {t("Delete")}
                                        </button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </Dialog>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8 flex-wrap">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-5 py-2 rounded-lg bg-mainColor text-white disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                                .map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page
                                            ? 'bg-mainColor text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-5 py-2 rounded-lg bg-mainColor text-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupModules;