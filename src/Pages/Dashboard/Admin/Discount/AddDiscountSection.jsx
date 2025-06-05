import React, { useEffect, useRef, useState } from "react";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import {
  DropDown,
  NumberInput,
  StaticButton,
  StaticLoader,
  SubmitButton,
  TextInput,
} from "../../../../Components/Components";
import { useTranslation } from "react-i18next";

const AddDiscountSection = ({ update, setUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/settings/discount/add`,
  });

  const dropDownType = useRef();
  const auth = useAuth();

  const [discountName, setDiscountName] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType] = useState([
    { id: "", name: "Select Discount Type" },
    { id: "precentage", name: "precentage" },
    { id: "value", name: "value" },
  ]);
  const { t, i18n } = useTranslation();

  const [stateType, setStateType] = useState("Select Discount Type");
  const [typeName, setTypeName] = useState("");

  const [isOpenDiscountType, setIsOpenDiscountType] = useState(false);

  const handleOpenDiscountType = () => {
    setIsOpenDiscountType(!isOpenDiscountType);
  };
  const handleOpenOptionDiscountType = () => setIsOpenDiscountType(false);

  const handleSelectDiscountType = (option) => {
    setTypeName(option.id);
    setStateType(option.name);
  };

  useEffect(() => {
    console.log("response", response);
    if (!loadingPost) {
      handleReset();
    }
    setUpdate(!update);
  }, [response]);

  const handleReset = () => {
    setDiscountName("");
    setDiscountAmount("");
    setStateType("Select Discount Type");
    setTypeName("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownType.current &&
        !dropDownType.current.contains(event.target)
      ) {
        setIsOpenDiscountType(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDiscountAdd = (e) => {
    e.preventDefault();

    if (!discountName) {
      auth.toastError(t("please Enter Discount Name"));
      return;
    }
    if (!discountAmount) {
      auth.toastError(t("please Enter Discount Amount"));
      return;
    }
    if (!typeName) {
      auth.toastError(t("please Select Discount Type"));
      return;
    }

    const formData = new FormData();

    formData.append("name", discountName);
    formData.append("amount", discountAmount);
    formData.append("type", typeName);

    console.log(...formData.entries());
    postData(formData, "Discount Added Success");
  };

  return (
    <>
      {loadingPost ? (
        <>
          <div className="flex items-center justify-center w-full h-56">
            <StaticLoader />
          </div>
        </>
      ) : (
        <section>
          <form onSubmit={handleDiscountAdd}>
            <div className="flex flex-wrap items-center justify-start w-full gap-4 mb-4 sm:flex-col lg:flex-row">
              {/* Discount Name */}
              <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("DiscountName")}:
                </span>
                <TextInput
                  value={discountName}
                  onChange={(e) => setDiscountName(e.target.value)}
                  placeholder={t("DiscountName")}
                />
              </div>
              {/* Discount Amount */}
              <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("DiscountAmount")}:
                </span>
                <NumberInput
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder={t("DiscountAmount")}
                />
              </div>
              {/* Discount Types */}
              <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("DiscountType")}:
                </span>
                <DropDown
                  ref={dropDownType}
                  handleOpen={handleOpenDiscountType}
                  stateoption={stateType}
                  openMenu={isOpenDiscountType}
                  handleOpenOption={handleOpenOptionDiscountType}
                  onSelectOption={handleSelectDiscountType}
                  options={discountType}
                  border={false}
                />
              </div>
            </div>

            {/* Buttons*/}
            <div className="flex items-center justify-end w-full gap-x-4">
              <div className="">
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
              <div className="">
                <SubmitButton
                  text={t("Submit")}
                  rounded="rounded-full"
                  handleClick={handleDiscountAdd}
                />
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default AddDiscountSection;
