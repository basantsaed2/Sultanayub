import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../Context/Auth";
import {
  DropDown,
  LoaderLogin,
  NumberInput,
  StaticButton,
  SubmitButton,
  TextInput,
} from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useTranslation } from "react-i18next";

const EditDiscountPage = () => {
  const { discountId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchDiscount,
    loading: loadingDiscount,
    data: dataDiscount,
  } = useGet({ url: `${apiUrl}/admin/settings/discount/item/${discountId}` });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/settings/discount/update/${discountId}`,
  });

  const auth = useAuth();
  const navigate = useNavigate();

  const dropDownType = useRef();
  const { t, i18n } = useTranslation();

  const [discountName, setDiscountName] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType] = useState([{ name: "precentage" }, { name: "value" }]);

  const [stateType, setStateType] = useState("Select Discount Type");
  const [typeName, setTypeName] = useState("");

  const [isOpenDiscountType, setIsOpenDiscountType] = useState(false);

  useEffect(() => {
    if (dataDiscount) {
      setDiscountName(dataDiscount.discount.name || "-");
      setDiscountAmount(dataDiscount.discount.amount || "-");
      setStateType(dataDiscount.discount.type || "-");
      setTypeName(dataDiscount.discount.type || "-");
    }
  }, [dataDiscount]);

  const handleOpenDiscountType = () => {
    setIsOpenDiscountType(!isOpenDiscountType);
  };
  const handleOpenOptionDiscountType = () => setIsOpenDiscountType(false);

  const handleSelectDiscountType = (option) => {
    setTypeName(option.name);
    setStateType(option.name);
  };

  useEffect(() => {
    console.log("response", response);
    if (response) {
      handleBack();
    }
  }, [response]);

  const handleBack = () => {
    navigate(-1, { replace: true });
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

  const handleDiscountEdit = (e) => {
    e.preventDefault();

    if (!discountName) {
      auth.toastError(t("discountName")); // ترجمة النص
      return;
    }
    if (!discountAmount) {
      auth.toastError(t("discountAmount")); // ترجمة النص
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
    postData(formData, t("Discount Edited Success"));
  };

  return (
    <>
      {loadingDiscount || loadingPost ? (
        <>
          <div className="flex items-center justify-center w-full">
            <LoaderLogin />
          </div>
        </>
      ) : (
        <section>
          <form onSubmit={handleDiscountEdit}>
            {/* Content*/}
            <div className="sm:py-3 lg:py-6">
              <div className="flex flex-wrap items-center justify-start w-full gap-4 sm:flex-col lg:flex-row">
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
            </div>

            {/* Buttons*/}
            <div className="flex items-center justify-end w-full gap-x-4">
              <div className="">
                <StaticButton
                  text={t("Cancel")}
                  handleClick={handleBack}
                  bgColor="bg-transparent"
                  Color="text-mainColor"
                  border={"border-2"}
                  borderColor={"border-mainColor"}
                  rounded="rounded-full"
                />
              </div>
              <div className="">
                <SubmitButton
                  text={t("Edit")}
                  rounded="rounded-full"
                  handleClick={handleDiscountEdit}
                />
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default EditDiscountPage;
