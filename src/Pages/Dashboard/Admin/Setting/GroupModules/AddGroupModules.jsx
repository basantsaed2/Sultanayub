import React, { useEffect, useState } from "react";
import {
  StaticButton,
  StaticLoader,
  SubmitButton,
  Switch,
  TextInput,NumberInput,
  TitlePage,
} from "../../../../../Components/Components";
import { useGet } from "../../../../../Hooks/useGet";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AddGroupModules = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();

  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/group_product/add`,
  });

  // State variables
  const [name, setName] = useState("");
  const [percentageType, setPercentageType] = useState("increase"); // "increase" or "decrease"
  const [percentageValue, setPercentageValue] = useState("");
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response && response.status === 200) {
      handleBack();
    }
  }, [response]);

  const handleStatusChange = () => {
    setStatus(prev => prev === 1 ? 0 : 1);
  };

  const handlePercentageTypeChange = (type) => {
    setPercentageType(type);
    setPercentageValue(""); // Reset value when changing type
  };

  const handleReset = () => {
    setName("");
    setPercentageType("increase");
    setPercentageValue("");
    setStatus(1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      auth.toastError(t("Please enter group name"));
      return;
    }

    if (!percentageValue || isNaN(percentageValue) || parseFloat(percentageValue) <= 0) {
      auth.toastError(t("Please enter a valid positive percentage"));
      return;
    }

    setLoading(true);

    // Prepare data based on selection
    const formData = new FormData();
    formData.append("name", name.trim());
    
    if (percentageType === "increase") {
      formData.append("increase_precentage", parseFloat(percentageValue));
      formData.append("decrease_precentage", 0);
    } else {
      formData.append("increase_precentage", 0);
      formData.append("decrease_precentage", parseFloat(percentageValue));
    }
    
    formData.append("status", status);

    postData(formData, "Group module added successfully")
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-start justify-start w-full p-2 pb-28">
      {loadingPost || loading ? (
        <div className="flex items-center justify-center w-full h-56">
          <StaticLoader />
        </div>
      ) : (
        <section className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-x-2">
              <button
                onClick={handleBack}
                className="text-mainColor hover:text-red-700 transition-colors"
                title={t("Back")}
              >
                <IoArrowBack size={24} />
              </button>
              <TitlePage text={t("Add Group Module")} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Content */}
            <div className="sm:py-3 lg:py-6">
              <div className="flex flex-wrap items-start justify-start w-full gap-4 sm:flex-col lg:flex-row">
                
                {/* Name Input */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("Group Name")}:
                  </span>
                  <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("Enter group name")}
                  />
                </div>

                {/* Percentage Type Selection */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {t("Percentage Type")}:
                  </span>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="percentageType"
                        value="increase"
                        checked={percentageType === "increase"}
                        onChange={() => handlePercentageTypeChange("increase")}
                        className="w-4 h-4 text-mainColor focus:ring-mainColor"
                      />
                      <span className="text-lg font-TextFontRegular text-thirdColor">
                        {t("Increase")}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="percentageType"
                        value="decrease"
                        checked={percentageType === "decrease"}
                        onChange={() => handlePercentageTypeChange("decrease")}
                        className="w-4 h-4 text-mainColor focus:ring-mainColor"
                      />
                      <span className="text-lg font-TextFontRegular text-thirdColor">
                        {t("Decrease")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Percentage Value Input */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    {percentageType === "increase" ? t("Increase Percentage") : t("Decrease Percentage")}:
                  </span>
                  <div className="relative w-full">
                    <NumberInput
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(e.target.value)}
                      placeholder={t("Enter percentage")}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-thirdColor font-TextFontMedium">
                      %
                    </span>
                  </div>
                </div>

                {/* Status Switch */}
                <div className="sm:w-full xl:w-[30%] flex items-start justify-start gap-x-1 pt-8">
                  <div className="flex items-center justify-start w-2/4 gap-x-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("Status")}:
                    </span>
                    <Switch
                      handleClick={handleStatusChange}
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
                  border={"border-2"}
                  borderColor={"border-mainColor"}
                  rounded="rounded-full"
                />
              </div>
              <div>
                <SubmitButton
                  text={t("Submit")}
                  rounded="rounded-full"
                />
              </div>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default AddGroupModules;