import React, { useEffect, useRef, useState } from "react";
import {
    NumberInput,
    StaticButton,
    StaticLoader,
    SubmitButton,
    Switch,
    TextInput,
    TitlePage,
    UploadInput,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useGet } from "../../../../../Hooks/useGet"; // Assuming useGet is imported
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import DropDown from "../../../../../Components/AnotherComponents/DropDown"; // Import the DropDown component

const EditHallLocations = () => {
    const { hallId } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchHall, loading: loadingHall, data: dataHall } = useGet({ url: `${apiUrl}/admin/caffe_location/item/${hallId}` });
    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({
        url: `${apiUrl}/admin/caffe_location`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin/caffe_location/update/${hallId}`,
    });
    const { t } = useTranslation();
    const { toastError } = useAuth();

    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [name, setName] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null); // State for selected branch
    const [openMenu, setOpenMenu] = useState(false); // State for dropdown menu open/close


    useEffect(() => {
        refetchHall();
        refetchList();
    }, [refetchList, refetchHall]);

    useEffect(() => {
        if (dataList && dataList.branches) {
            setBranches(dataList.branches);
        }
    }, [dataList]);

    useEffect(() => {
        if (dataHall && dataHall.location) {
            const data = dataHall.location;
            setName(data?.name || '')
            setSelectedBranch(data?.branch)
        }
    }, [dataHall]);

    useEffect(() => {
        if (!loadingPost && response) {
            navigate(-1)
        }
    }, [response]);

    const handleReset = () => {
        setName("");
        setSelectedBranch(null);
    };

    const handleOpen = () => {
        setOpenMenu(!openMenu);
    };

    const handleOpenOption = () => {
        setOpenMenu(false);
    };

    const handleSelectBranch = (option) => {
        setSelectedBranch(option);
    };

    const handleHallAdd = (e) => {
        e.preventDefault();

        if (!name) {
            toastError(t("Please Enter Hall Name"));
            return;
        }

        if (!selectedBranch) {
            toastError(t("selectBranch"));
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("branch_id", selectedBranch.id); // Assuming branch has an id property

        postData(formData, "Hall Edit Sucess!"); // Submit the form data
    };


    return (
        <>
            {loadingPost || loadingList || loadingHall ? (
                <div className="flex items-center justify-center w-full h-56">
                    <StaticLoader />
                </div>
            ) : (
                <section className="flex flex-col">
                    <form onSubmit={handleHallAdd}>
                        <div className="sm:py-3 lg:py-6">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {/* Name Input */}
                                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("Hall Name")}:
                                    </span>
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t("Hall Name")}
                                    />
                                </div>
                                {/* Branch Dropdown */}
                                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                    <span className="text-xl font-TextFontRegular text-thirdColor">
                                        {t("BranchName")}:
                                    </span>
                                    <DropDown
                                        options={branches} // Pass the branches array
                                        stateoption={selectedBranch ? selectedBranch.name : t("Select Branch")} // Display selected branch or placeholder
                                        openMenu={openMenu}
                                        handleOpen={handleOpen}
                                        handleOpenOption={handleOpenOption}
                                        onSelectOption={handleSelectBranch}
                                        border={true}
                                    />
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
                                    handleClick={handleHallAdd}
                                />
                            </div>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
};

export default EditHallLocations;