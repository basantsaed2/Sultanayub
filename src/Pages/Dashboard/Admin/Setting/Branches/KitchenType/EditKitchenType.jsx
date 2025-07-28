import React, { useEffect, useState } from "react";
import {
    DropDown,
    PasswordInput,
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    TextInput,
    TitlePage,
} from "../../../../../../Components/Components";
import { usePost } from "../../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../../Context/Auth";
import { useGet } from "../../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditKitchenType = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();
    const { branchId } = useParams();
    const { kitchenId, birstaId } = useParams();
    const { state } = useLocation();
    const { type: initialType, isBirsta } = state || {};
    const id = kitchenId || birstaId;
    const type = isBirsta ? "birsta" : "kitchen";

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/pos/kitchens/update/${id}`,
    });

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(0);

    useEffect(() => {
        if (initialType) {
            setName(initialType.name || "");
            setPassword(initialType.password || "");
            setStatus(initialType.status || 0);
        }
    }, [initialType]);

    useEffect(() => {
        if (!loadingPost && response) {
            navigate(-1);
        }
    }, [response, loadingPost, navigate]);

    const handleChangeStatus = () => {
        setStatus((prev) => (prev === 0 ? 1 : 0));
    };

    const handleReset = () => {
        setName(initialType?.name || "");
        setPassword(initialType?.password || "");
        setStatus(initialType?.status || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name) {
            auth.toastError(t(isBirsta ? "EnterBirstaName" : "EnterKitchenName"));
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("status", status);
        formData.append("branch_id", branchId);

        postData(formData, t("EditedSuccess", { type: t(type === "birsta" ? "Birsta" : "Kitchen") }));
    };

    return (
        <>
            {loadingPost ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <section className="flex flex-col mb-20">
                    <TitlePage text={t(isBirsta ? "EditBirsta" : "EditKitchen")} />
                    <form onSubmit={handleSubmit}>
                        <div className="py-3">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {/* Name Input */}
                                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t(isBirsta ? "BirstaName" : "KitchenName")}:
                                    </span>
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        name="name"
                                        placeholder={t(isBirsta ? "EnterBirstaName" : "EnterKitchenName")}
                                        background="white"
                                        borderColor="gray-300"
                                    />
                                </div>
                                {/* Password Input */}
                                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("Password")}:
                                    </span>
                                    <PasswordInput
                                        background="white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t("EnterPassword")}
                                        name="password"
                                    />
                                </div>
                                {/* Status Switch */}
                                <div className="w-full flex items-start justify-start gap-x-1 pt-8">
                                    <div className="flex items-center justify-start w-2/4 gap-x-1">
                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                            {t("Status")}:
                                        </span>
                                        <Switch
                                            handleClick={handleChangeStatus}
                                            checked={status === 1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex items-center justify-end w-full gap-x-4">
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

export default EditKitchenType;