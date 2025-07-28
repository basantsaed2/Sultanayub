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

const AddKitchenType = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { branchId } = useParams();
    const isBirsta = location.pathname.includes("branch_birsta");
    const type = isBirsta ? "brista" : "kitchen";

    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/pos/kitchens/add`,
    });

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(0);

    useEffect(() => {
        if (!loadingPost && response) {
            navigate(-1);
        }
    }, [response, loadingPost, navigate]);

    const handleChangeStatus = () => {
        setStatus((prev) => (prev === 0 ? 1 : 0));
    };

    const handleReset = () => {
        setName("");
        setPassword("");
        setStatus(0);
    };

    const handleAdd = (e) => {
        e.preventDefault();

        if (!name) {
            auth.toastError(t(isBirsta ? "EnterBirstaName" : "EnterKitchenName"));
            return;
        }
        if (!password) {
            auth.toastError(t("EnterPassword"));
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("status", status);
        formData.append("type", type);
        formData.append("branch_id", branchId);

        postData(formData, t("AddedSuccess", { type: t(type === "brista" ? "Birsta" : "Kitchen") }));
    };

    return (
        <>
            {loadingPost ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <section className="flex flex-col mb-20">
                    <TitlePage text={t(isBirsta ? "AddNewBirsta" : "AddNewKitchen")} />
                    <form onSubmit={handleAdd}>
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
                                        backgound="white"
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
                                    handleClick={handleAdd}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default AddKitchenType;