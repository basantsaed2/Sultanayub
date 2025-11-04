import React, { useEffect, useState } from "react";
import {
    DropDown,
    PasswordInput,
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    TextInput,
    TimeInput,
    TitlePage,
} from "../../../../../../Components/Components";
import { usePost } from "../../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../../Context/Auth";
import { useGet } from "../../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';

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
    const { refetch, loading, data } = useGet({ url: `${apiUrl}/admin/pos/kitchens/lists` });

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [branch_id, setBranchId] = useState(branchId || "");
    const [print_status, setPrintStatus] = useState(0);
    const [print_ip, setPrintIp] = useState("");
    const [print_name, setPrintName] = useState("");
    const [status, setStatus] = useState(0);
    const [preparing_time, setPreparingTime] = useState("");
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (data && data.branches) {
            setBranches(data.branches);
        }
    }, [data]);

    useEffect(() => {
        if (!loadingPost && response) {
            navigate(-1);
        }
    }, [response, loadingPost, navigate]);

    const handleChangeStatus = () => {
        setStatus((prev) => (prev === 0 ? 1 : 0));
    };

    const handleChangePrintStatus = () => {
        setPrintStatus((prev) => (prev === 0 ? 1 : 0));
    };

    const handleReset = () => {
        setName("");
        setPassword("");
        setBranchId(branchId || "");
        setPrintStatus(0);
        setPrintIp("");
        setPrintName("");
        setStatus(0);
        setPreparingTime("");
    };

    const formatTimeToHHMMSS = (time) => {
        if (!time) return '';
        if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
        return time;
    };

    const handleAdd = (e) => {
        e.preventDefault();

        if (!name) {
            auth.toastError(t(isBirsta ? "Enter Birsta Name" : "Enter Kitchen Name"));
            return;
        }
        if (!password) {
            auth.toastError(t("EnterPassword"));
            return;
        }
        if (!branch_id) {
            auth.toastError(t("SelectBranch"));
            return;
        }

        const formattedTime = formatTimeToHHMMSS(preparing_time);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("branch_id", branch_id);
        formData.append("print_status", print_status);
        formData.append("status", status);
        formData.append("type", type);
        formData.append("preparing_time", formattedTime);

        // Only append print_ip and print_name if print_status is 1
        if (print_status === 1) {
            formData.append("print_ip", print_ip);
            formData.append("print_name", print_name);
        }

        postData(formData, t("AddedSuccess", { type: t(type === "brista" ? "Birsta" : "Kitchen") }));
    };

    // Prepare options for React Select
    const branchOptions = branches.map(branch => ({
        value: branch.id,
        label: branch.name
    }));

    // Find selected branch for React Select
    const selectedBranch = branchOptions.find(option => option.value === branch_id);

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
                                        {t(isBirsta ? "Birsta Name" : "Kitchen Name")}:
                                    </span>
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        name="name"
                                        placeholder={t(isBirsta ? "Enter Birsta Name" : "Enter Kitchen Name")}
                                        background="white"
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
                                        placeholder={t("Enter Password")}
                                        name="password"
                                    />
                                </div>

                                {/* Branch Select */}
                                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("Branch")}:
                                    </span>
                                    <Select
                                        value={selectedBranch}
                                        onChange={(selectedOption) => setBranchId(selectedOption?.value || "")}
                                        options={branchOptions}
                                        placeholder={t("Select Branch")}
                                        isClearable
                                        className="w-full"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: '#d1d5db',
                                                borderRadius: '0.375rem',
                                                padding: '2px 4px',
                                                backgroundColor: 'white'
                                            })
                                        }}
                                    />
                                </div>

                                {/* Print Status Switch */}
                                <div className="w-full flex items-start justify-start gap-x-1 pt-8">
                                    <div className="flex items-center justify-start w-2/4 gap-x-1">
                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                            {t("Print Status")}:
                                        </span>
                                        <Switch
                                            handleClick={handleChangePrintStatus}
                                            checked={print_status === 1}
                                        />
                                    </div>
                                </div>

                                {
                                    print_status === 1 && (
                                        <>
                                            {/* Print Name Input */}
                                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                                    {t("Print Name")}:
                                                </span>
                                                <TextInput
                                                    value={print_name}
                                                    onChange={(e) => setPrintName(e.target.value)}
                                                    name="print_name"
                                                    placeholder={t("Enter Print Name")}
                                                    background="white"
                                                />
                                            </div>

                                            {/* Print IP Input */}
                                            <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                                <span className="text-xl font-TextFontRegular text-thirdColor">
                                                    {t("Print MAC Address")}:
                                                </span>
                                                <TextInput
                                                    value={print_ip}
                                                    onChange={(e) => setPrintIp(e.target.value)}
                                                    name="print_ip"
                                                    placeholder={t("Enter Print MAC Address")}
                                                    background="white"
                                                />
                                            </div>
                                        </>
                                    )}

                                {/* Preparing Time Input */}
                                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("Preparing Time")}:
                                    </span>
                                    <TimeInput
                                        value={preparing_time}
                                        onChange={(e) => setPreparingTime(e.target.value)}
                                        name="preparing_time"
                                        placeholder={t("Enter Preparing Time")}
                                        background="white"
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