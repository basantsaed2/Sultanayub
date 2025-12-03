import React, { useEffect, useState } from "react";
import {
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    PasswordInput,
    TextInput,
    TitlePage,
} from "../../../../../../Components/Components";
import { usePost } from "../../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useGet } from "../../../../../../Hooks/useGet";
import { useParams } from "react-router-dom";

const AddPreparationMan = () => {
    const { branchId } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const {
        refetch: refetchPreparationMan,
        loading: loadingPreparationMan,
        data: dataPreparationMan,
    } = useGet({
        url: `${apiUrl}/admin/preparation_man/lists`,
    });

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/preparation_man/add`,
    });
    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(1);

    useEffect(() => {
        refetchPreparationMan();
    }, [refetchPreparationMan]);

    // Navigate back after successful submission
    useEffect(() => {
        if (!loadingPost && response) {
            handleBack();
        }
    }, [response, loadingPost]);

    // Toggle status
    const handleStatus = () => {
        setStatus((prev) => (prev === 1 ? 0 : 1));
    };

    // Reset form
    const handleReset = () => {
        setName("");
        setPassword("");
        setStatus(1);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name) {
            auth.toastError(t("Enter Preparation Man Name"));
            return;
        }

        if (!password) {
            auth.toastError(t("Enter Password"));
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("status", status);
        formData.append("branch_id", branchId);

        postData(formData, t("Preparation Man Added Success"));
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            {loadingPost || loadingPreparationMan ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
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
                            <TitlePage text={t("Add Preparation Man")} />
                        </div>
                    </div>
                    <form className="p-2" onSubmit={handleSubmit}>
                        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {/* Name */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Name")}:
                                </span>
                                <TextInput
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("Enter Name")}
                                />
                            </div>

                            {/* Password */}
                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                    {t("Password")}:
                                </span>
                                <PasswordInput
                                    value={password}
                                    backgound="bg-white"
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("Enter Password")}
                                />
                            </div>

                            {/* Status */}
                            <div className="w-full flex items-start justify-start gap-x-1 pt-8">
                                <div className="flex items-center justify-start gap-x-3">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("Active")}:
                                    </span>
                                    <Switch handleClick={handleStatus} checked={status} />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end w-full gap-x-4 mt-6">
                            <div>
                                <StaticButton
                                    text={t("Reset")}
                                    handleClick={handleReset}
                                    bgColor="bg-transparent"
                                    Color="text-mainColor"
                                    border="border-2"
                                    borderColor="border-mainColor"
                                    rounded="rounded-full"
                                />
                            </div>
                            <div>
                                <SubmitButton
                                    text={t("Submit")}
                                    rounded="rounded-full"
                                    handleClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default AddPreparationMan;