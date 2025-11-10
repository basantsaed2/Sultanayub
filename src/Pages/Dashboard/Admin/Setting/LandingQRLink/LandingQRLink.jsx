import React, { useEffect, useState } from "react";
import { useGet } from "../../../../../Hooks/useGet";
import { usePost } from "../../../../../Hooks/usePostJson";
import {
    LoaderLogin,
    SubmitButton,
    TextInput,
    TitlePage,
} from "../../../../../Components/Components";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LandingQRLink = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const {
        refetch: refetchQRLink,
        loading: loadingQRLink,
        data: dataQRLink,
    } = useGet({
        url: `${apiUrl}/admin/landing_page`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/landing_page/update`,
    });

    const [link, setLink] = useState("");
    const [qrCode, setQrCode] = useState("");

    const { t } = useTranslation();

    useEffect(() => {
        refetchQRLink();
    }, [refetchQRLink]);

    useEffect(() => {
        if (dataQRLink) {
            setLink(dataQRLink.website || "");
            setQrCode(dataQRLink.qr_code || "");
        }
    }, [dataQRLink]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!link) {
            auth.toastError(t("Enter QR Link"));
            return;
        }

        const formData = new FormData();
        formData.append("web_site", link);

        postData(formData, t("QR Link Changed Success"));
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            {loadingPost || loadingQRLink ? (
                <div className="flex items-center justify-center w-full">
                    <LoaderLogin />
                </div>
            ) : (
                <section>
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-x-2">
                            <button
                                onClick={handleBack}
                                className="text-mainColor hover:text-red-700 transition-colors"
                                title={t("Back")}
                            >
                                <IoArrowBack size={24} />
                            </button>
                            <TitlePage text={t("Enter QR Link")} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="w-full p-2 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Website Input */}
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    {t("Website URL")}
                                </label>
                                <TextInput
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder={t("Enter QR Link")}
                                    type="url"
                                />
                            </div>

                            {/* QR Code Display */}
                            {qrCode && (
                                <div className="w-full">
                                        <img
                                            src={qrCode}
                                            alt="QR Code"
                                            className="w-48 h-48 object-contain mx-auto"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    <p className="text-sm text-gray-600 text-center">
                                        {t("Current QR Code")}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end w-full gap-x-4 mt-2">
                            <div className="">
                                <SubmitButton
                                    text={t("Change")}
                                    rounded="rounded-full"
                                    handleClick={handleSubmit}
                                    loading={loadingPost}
                                />
                            </div>
                        </div>
                    </form>

                </section>
            )}
        </>
    );
};

export default LandingQRLink;