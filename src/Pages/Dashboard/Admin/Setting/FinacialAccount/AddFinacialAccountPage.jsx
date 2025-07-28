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
import { MultiSelect } from "primereact/multiselect";
import { useNavigate } from "react-router-dom";

const AddFinacialAccountPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchBranches, loading: loadingBranches, data: dataBranches } = useGet({
    url: `${apiUrl}/admin/settings/financial`,
  });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/settings/financial/add`,
  });
  const { t } = useTranslation();
  const { toastError } = useAuth();

  const ImageRef = useRef();
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(null); // State for selected branch
  const [openMenu, setOpenMenu] = useState(false); // State for dropdown open/close

  useEffect(() => {
    refetchBranches();
  }, [refetchBranches]);

  useEffect(() => {
    if (dataBranches && dataBranches.branches) {
      setBranches(dataBranches.branches);
    }
  }, [dataBranches]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(file.name);
    }
  };

  const handleImageClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handlefinancialAccountStatus = () => {
    setStatus((prev) => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    if (!loadingPost && response) {
      navigate(-1)
    }
  }, [response]);

  const handleReset = () => {
    setName("");
    setDescription("");
    setBalance("");
    setImage("");
    setImageFile(null);
    setStatus(0);
    setSelectedBranch(null);
    setOpenMenu(false);
  };

  const handlefinancialAccountAdd = (e) => {
    e.preventDefault();

    if (!name) {
      toastError(t("enterfinancialAccountName"));
      return;
    }
    if (!description) {
      toastError(t("enterfinancialAccountDescription"));
      return;
    }
    if (!balance) {
      toastError(t("enterfinancialAccountBalance"));
      return;
    }
    if (!imageFile) {
      toastError(t("setfinancialAccountImage"));
      return;
    }
    if (!selectedBranch) {
      toastError(t("selectBranch")); // Add new translation key for branch validation
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("details", description);
    formData.append("balance", balance || 0);
    formData.append("logo", imageFile);
    formData.append("status", status);
    selectedBranch.forEach((branch, index) => {
      formData.append(`branch_id[${index}]`, branch.id); // Append each ID as an array element in FormData
    });
    postData(formData, t("financialAccountAddedSuccess")); // Updated to use t() for success message
  };

  return (
    <>
      {loadingPost || loadingBranches ? (
        <div className="flex items-center justify-center w-full h-56">
          <StaticLoader />
        </div>
      ) : (
        <section className="flex flex-col">
          <TitlePage text={t("AddNewFinancialAccount")} />

          <form onSubmit={handlefinancialAccountAdd}>
            <div className="sm:py-3 lg:py-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Name Input */}
                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("financialAccountName")}:
                  </span>
                  <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("financialAccountName")}
                  />
                </div>
                {/* Branch Dropdown */}
                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("BranchName")}:
                  </span>
                  <MultiSelect
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.value)}
                    options={branches}
                    optionLabel="name"
                    display="chip"
                    placeholder={t("selectBranch")}
                    // maxSelectedLabels={3}
                    className="w-full p-1 md:w-20rem text-mainColor"
                    filter
                  />
                </div>
                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("financialAccountDescription")}:
                  </span>
                  <TextInput
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("financialAccountDescription")}
                  />
                </div>
                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("financialAccountBalance")}:
                  </span>
                  <NumberInput
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder={t("financialAccountBalance")} // Fixed placeholder
                  />
                </div>
                <div className="w-full flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("financialAccountImage")}:
                  </span>
                  <UploadInput
                    value={image}
                    uploadFileRef={ImageRef}
                    placeholder={t("financialAccountImage")}
                    handleFileChange={handleImageChange}
                    onChange={(e) => setImage(e.target.value)}
                    onClick={() => handleImageClick(ImageRef)}
                  />
                </div>
                <div className="w-full flex items-start justify-start gap-x-1 pt-8">
                  <div className="flex items-center justify-start w-2/4 gap-x-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("Status")}:
                    </span>
                    <Switch
                      handleClick={handlefinancialAccountStatus}
                      checked={status}
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
                  handleClick={handlefinancialAccountAdd}
                />
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default AddFinacialAccountPage;