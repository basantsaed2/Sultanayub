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

    const popup = popupData;

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
        if (!popup || !confirm(t("Are you sure you want to delete this popup?"))) return;
        const success = await deleteData(
            `${apiUrl}/admin/popup/delete`,
            t("Popup deleted successfully")
        );
        if (success) refetch();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <StaticLoader />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="w-full pb-32">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{t("Popup")}</h1>
                    <button
                        onClick={openModal}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-xl transition text-lg"
                    >
                        {popup ? t("Edit Popup") : t("Create Popup")}
                    </button>
                </div>

                {/* Current Popup */}
                {popup ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 w-full relative">
                        {/* Status Switch - Top Right */}
                        <div className="absolute top-4 right-4 z-10 rounded-full p-2">
                            <button
                                onClick={handleToggleStatus}
                                className={`w-14 h-8 sm:w-16 sm:h-9 rounded-full transition-all duration-300 ${popup.status === 1 ? "bg-green-500" : "bg-gray-400"}`}
                            >
                                <span className={`block w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-md transform transition-transform ${popup.status === 1 ? "translate-x-7 sm:translate-x-8" : "translate-x-1"}`} />
                            </button>
                        </div>

                        {/* Dual Language Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* English */}
                            <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-white">
                                <p className="text-sm sm:text-base font-bold text-blue-700 mb-4 text-center">{t("English Version")}</p>
                                <div className="bg-gray-100 border-2 border-dashed rounded-2xl overflow-hidden mb-6">
                                    <img
                                        src={getImageUrl(popup.image_en)}
                                        alt={popup.name_en}
                                        className="w-full h-64 sm:h-80 lg:h-96 object-contain"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/600x400.png?text=EN"}
                                    />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3">{popup.name_en}</h2>
                                {popup.link && (
                                    <p className="text-center text-mainColor underline text-base sm:text-lg break-all">{popup.link}</p>
                                )}
                            </div>

                            {/* Arabic */}
                            <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-bl from-pink-50 to-white" dir="rtl">
                                <p className="text-sm sm:text-base font-bold text-pink-700 mb-4 text-center">{t("Arabic Version")}</p>
                                <div className="bg-gray-100 border-2 border-dashed rounded-2xl overflow-hidden mb-6">
                                    <img
                                        src={getImageUrl(popup.image_ar)}
                                        alt={popup.name_ar}
                                        className="w-full h-64 sm:h-80 lg:h-96 object-contain"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/600x400.png?text=AR"}
                                    />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3">{popup.name_ar}</h2>
                                {popup.link && (
                                    <p className="text-center text-mainColor underline text-base sm:text-lg break-all">{popup.link}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 sm:p-8 bg-gray-50">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <span className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-xl font-bold ${popup.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {popup.status === 1 ? t("Active") : t("Inactive")}
                                </span>
                                <button
                                    onClick={handleDelete}
                                    className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition text-base sm:text-lg"
                                >
                                    {t("Delete Popup")}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 sm:py-32">
                        <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-80 h-80 sm:w-96 sm:h-96 mx-auto mb-8 opacity-60" />
                        <p className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">{t("No popup created yet")}</p>
                        <p className="text-lg sm:text-xl text-gray-400">{t("Click the button above to create one")}</p>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                        {/* This div now scrolls */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto my-4">
                            <div className="p-6 sm:p-10 pb-8 sm:pb-12"> {/* Extra bottom padding */}
                                <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
                                    {popup ? t("Edit Popup") : t("Create New Popup")}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                        {/* English */}
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6 text-center">{t("English")}</h3>
                                            <input
                                                type="text"
                                                name="name_en"
                                                value={formData.name_en}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={t("Name (English)")}
                                                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl text-base sm:text-lg mb-4 focus:border-blue-500"
                                            />
                                            <input
                                                type="file"
                                                name="image_en"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:bg-blue-600 file:text-white mb-4"
                                            />
                                            {previewEn && (
                                                <img src={previewEn} alt="EN" className="w-full rounded-2xl shadow-xl max-h-64 sm:max-h-80 object-contain" />
                                            )}
                                        </div>

                                        {/* Arabic */}
                                        <div dir="rtl">
                                            <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 sm:mb-6 text-center">{t("Arabic")}</h3>
                                            <input
                                                type="text"
                                                name="name_ar"
                                                value={formData.name_ar}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={t("Name (Arabic)")}
                                                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl text-base sm:text-lg mb-4 text-right focus:border-pink-500"
                                            />
                                            <input
                                                type="file"
                                                name="image_ar"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:bg-pink-600 file:text-white mb-4"
                                            />
                                            {previewAr && (
                                                <img src={previewAr} alt="AR" className="w-full rounded-2xl shadow-xl max-h-64 sm:max-h-80 object-contain" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <input
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                            className="w-full max-w-xl px-6 py-4 border-2 border-gray-300 rounded-2xl text-base sm:text-lg focus:border-mainColor"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-6 sm:pt-10">
                                        <button
                                            type="button"
                                            onClick={() => closeModal()}
                                            className="w-full sm:w-auto px-10 py-4 border-2 border-gray-400 rounded-2xl font-bold text-lg hover:bg-gray-50 transition"
                                        >
                                            {t("Cancel")}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loadingPost}
                                            className="w-full sm:w-auto px-14 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-60 transition"
                                        >
                                            {loadingPost ? t("Saving...") : popup ? t("Update") : t("Create")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;