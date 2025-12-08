import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../Context/Auth";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useChangeState } from "../../../../Hooks/useChangeState";
import { useDelete } from "../../../../Hooks/useDelete";
import { StaticLoader } from "../../../../Components/Components";

const Popup = () => {
    const { t } = useTranslation();
    const auth = useAuth();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name_en: "",
        name_ar: "",
        image_en: null,
        image_ar: null,
        link: "",
        status: 1,
    });

    const [previewEn, setPreviewEn] = useState(null);
    const [previewAr, setPreviewAr] = useState(null);

    const { data: popupData, loading, refetch } = useGet({
        url: `${apiUrl}/admin/popup`,
    });

    // Check if data is null/empty
    const isDataEmpty = !popupData ||
        (popupData.image_ar === null &&
            popupData.image_en === null &&
            popupData.link === null &&
            popupData.name_ar === null &&
            popupData.name_en === null &&
            popupData.status === null);

    const popup = !isDataEmpty ? popupData : null;

    const { postData, loadingPost } = usePost({
        url: `${apiUrl}/admin/popup/create_or_update`,
    });

    const { changeState } = useChangeState();
    const { deleteData } = useDelete();

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/600x400.png?text=No+Image";
        return url.startsWith("http") ? url : `${apiUrl}/${url}`;
    };

    useEffect(() => {
        if (isModalOpen && popup) {
            setFormData({
                name_en: popup.name_en || "",
                name_ar: popup.name_ar || "",
                link: popup.link || "",
                status: popup.status || 1,
                image_en: null,
                image_ar: null,
            });
            setPreviewEn(popup.image_en ? getImageUrl(popup.image_en) : null);
            setPreviewAr(popup.image_ar ? getImageUrl(popup.image_ar) : null);
        }
    }, [isModalOpen, popup]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = (refresh = false) => {
        setIsModalOpen(false);
        setFormData({ name_en: "", name_ar: "", image_en: null, image_ar: null, link: "", status: 1 });
        setPreviewEn(null);
        setPreviewAr(null);
        if (refresh) refetch();
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                name === "image_en" ? setPreviewEn(reader.result) : setPreviewAr(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name_en", formData.name_en);
        data.append("name_ar", formData.name_ar);
        data.append("link", formData.link || "");
        data.append("status", formData.status);

        // Only append image if a NEW file is selected
        data.append("image_en", formData.image_en);
        data.append("image_ar", formData.image_ar);

        const success = await postData(
            data,
            popup ? t("Popup updated successfully") : t("Popup created successfully")
        );
        if (success) closeModal(true);
    };

    const handleToggleStatus = async () => {
        if (!popup) return;
        const newStatus = popup.status === 1 ? 0 : 1;
        const success = await changeState(
            `${apiUrl}/admin/popup/status`,
            newStatus === 1 ? t("Popup activated") : t("Popup deactivated"),
            { status: newStatus }
        );
        if (success) refetch();
    };

    const handleDelete = async () => {
        if (!popup) return;
        const success = await deleteData(
            `${apiUrl}/admin/popup/delete`,
            t("Popup deleted successfully")
        );
        if (success) {
            closeDeleteModal();
            refetch();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <StaticLoader />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="w-full pb-32">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{t("Popup")}</h1>
                        <p className="text-gray-600 mt-2">{t("Manage your website popup content")}</p>
                    </div>
                    {!popup && (
                        <button
                            onClick={openModal}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg flex items-center gap-3 group"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t("Create Popup")}
                        </button>
                    )}
                </div>

                {/* Current Popup */}
                {popup ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 w-full relative transform transition-all duration-300 hover:shadow-3xl">
                        {/* Status Switch - Top Right */}
                        <div className="absolute top-4 right-4 z-10 rounded-full p-2">
                            <button
                                onClick={handleToggleStatus}
                                className={`w-14 h-8 sm:w-16 sm:h-9 rounded-full transition-all duration-300 ${popup.status === 1 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"}`}
                            >
                                <span className={`block w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${popup.status === 1 ? "translate-x-7 sm:translate-x-8" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {/* Edit Button - Top Left */}
                        {/* <div className="absolute top-4 left-4 z-10">
                            <button
                                onClick={openModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t("Edit")}
                            </button>
                        </div> */}

                        {/* Dual Language Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* English */}
                            <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
                                <div className="absolute top-2 right-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                    EN
                                </div>
                                <p className="text-sm sm:text-base font-bold text-blue-700 mb-4 text-center">{t("English Version")}</p>
                                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden mb-6 hover:border-blue-400 transition-colors">
                                    <img
                                        src={getImageUrl(popup.image_en)}
                                        alt={popup.name_en}
                                        className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    {popup.name_en || t("No name")}
                                </h2>
                                {popup.link && (
                                    <div className="text-center">
                                        <a
                                            href={popup.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-mainColor underline hover:text-blue-700 transition-colors text-base sm:text-lg break-all inline-flex items-center gap-2"
                                        >
                                            {popup.link}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Arabic */}
                            <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-bl from-pink-50 to-white relative overflow-hidden" dir="rtl">
                                <div className="absolute top-2 left-2 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-bold">
                                    AR
                                </div>
                                <p className="text-sm sm:text-base font-bold text-pink-700 mb-4 text-center">{t("Arabic Version")}</p>
                                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden mb-6 hover:border-pink-400 transition-colors">
                                    <img
                                        src={getImageUrl(popup.image_ar)}
                                        alt={popup.name_ar}
                                        className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3 bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                                    {popup.name_ar || t("No name")}
                                </h2>
                                {popup.link && (
                                    <div className="text-center">
                                        <a
                                            href={popup.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-mainColor underline hover:text-pink-700 transition-colors text-base sm:text-lg break-all inline-flex items-center gap-2"
                                        >
                                            {popup.link}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <span className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-xl font-bold shadow-md ${popup.status === 1 ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800" : "bg-gradient-to-r from-red-100 to-red-200 text-red-800"}`}>
                                        {popup.status === 1 ? t("Active") : t("Inactive")}
                                    </span>
                                    <div className="text-gray-600 text-center sm:text-left">
                                        <p className="text-sm">{t("Last updated")}:</p>
                                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={openDeleteModal}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-3"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {t("Delete Popup")}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 animate-fadeIn">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">{t("No popup created yet")}</p>
                        <p className="text-lg sm:text-xl text-gray-500 mb-8">{t("Click the button above to create your first popup")}</p>
                        <button
                            onClick={openModal}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg inline-flex items-center gap-3 animate-bounce-slow"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t("Create Your First Popup")}
                        </button>
                    </div>
                )}

                {/* Edit/Create Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto animate-modalIn">
                            <div className="p-6 sm:p-10 pb-8 sm:pb-12">
                                <div className="flex justify-between items-center mb-8 sm:mb-12">
                                    <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
                                        {popup ? t("Edit Popup") : t("Create New Popup")}
                                    </h2>
                                    <button
                                        onClick={() => closeModal()}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                        {/* English */}
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                                                <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6 text-center flex items-center justify-center gap-3">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                    </svg>
                                                    {t("English")}
                                                </h3>
                                                <input
                                                    type="text"
                                                    name="name_en"
                                                    value={formData.name_en}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder={t("Name (English)")}
                                                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl text-base sm:text-lg mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                />
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:border-blue-400 transition-colors">
                                                    <input
                                                        type="file"
                                                        name="image_en"
                                                        accept="image/*"
                                                        onChange={handleInputChange}
                                                        className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:bg-blue-600 file:text-white file:hover:bg-blue-700 file:transition-colors cursor-pointer"
                                                    />
                                                </div>
                                                {previewEn && (
                                                    <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-100">
                                                        <img src={previewEn} alt="EN Preview" className="w-full h-48 object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arabic */}
                                        <div dir="rtl" className="space-y-6">
                                            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                                                <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 sm:mb-6 text-center flex items-center justify-center gap-3">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                    </svg>
                                                    {t("Arabic")}
                                                </h3>
                                                <input
                                                    type="text"
                                                    name="name_ar"
                                                    value={formData.name_ar}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder={t("Name (Arabic)")}
                                                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl text-base sm:text-lg mb-4 text-right focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                                                />
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:border-pink-400 transition-colors">
                                                    <input
                                                        type="file"
                                                        name="image_ar"
                                                        accept="image/*"
                                                        onChange={handleInputChange}
                                                        className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:bg-pink-600 file:text-white file:hover:bg-pink-700 file:transition-colors cursor-pointer"
                                                    />
                                                </div>
                                                {previewAr && (
                                                    <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border-2 border-pink-100">
                                                        <img src={previewAr} alt="AR Preview" className="w-full h-48 object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="inline-block w-full max-w-xl">
                                            <label className="block text-gray-700 text-lg font-bold mb-3">
                                                {t("Popup Link")} <span className="text-gray-500 text-sm">({t("Optional")})</span>
                                            </label>
                                            <input
                                                type="url"
                                                name="link"
                                                value={formData.link}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com"
                                                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl text-base sm:text-lg focus:border-mainColor focus:ring-2 focus:ring-mainColor/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-6 sm:pt-10 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => closeModal()}
                                            className="w-full sm:w-auto px-10 py-4 border-2 border-gray-400 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-600 transition-all duration-300"
                                        >
                                            {t("Cancel")}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loadingPost}
                                            className="w-full sm:w-auto px-14 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                                        >
                                            {loadingPost ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    {t("Saving...")}
                                                </>
                                            ) : popup ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {t("Update")}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    {t("Create")}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-3xl w-full max-w-md animate-modalIn">
                            <div className="p-8 sm:p-10">
                                {/* Warning Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
                                    {t("Delete Popup")}
                                </h3>

                                {/* Message */}
                                <p className="text-gray-600 text-center mb-2">
                                    {t("Are you sure you want to delete this popup?")}
                                </p>
                                <p className="text-red-600 text-center font-medium mb-8">
                                    {t("This action cannot be undone.")}
                                </p>

                                {/* Popup Info Preview */}
                                {popup && (
                                    <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={getImageUrl(popup.image_en)}
                                                    alt={popup.name_en}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{popup.name_en}</p>
                                                <p className="text-sm text-gray-600">{popup.name_ar}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="w-full px-4 py-4 border-2 border-gray-400 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-600 transition-all duration-300"
                                    >
                                        {t("Cancel")}
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t("Yes, Delete")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;