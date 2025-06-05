import React, { useEffect, useRef, useState } from "react";
import {
  DropDown,
  EmailInput,
  LoaderLogin,
  NumberInput,
  PasswordInput,
  StaticButton,
  StaticLoader,
  SubmitButton,
  TextInput,
  TitleSection,
  UploadInput,
} from "../../../../Components/Components";
import { Dropdown } from "primereact/dropdown";
import { usePost } from "../../../../Hooks/usePostJson";
import { useGet } from "../../../../Hooks/useGet";
import { useAuth } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";

const MainBranchSetupPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: `${apiUrl}/admin/settings/business_setup/branch`,
  });
  const [branch, setBranch] = useState([]);
  const [previousBranchData, setPreviousBranchData] = useState({});
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/settings/business_setup/branch/add`,
  });
  const { t, i18n } = useTranslation();

  const {
    refetch: refetchCity,
    loading: loadingCity,
    data: dataCity,
  } = useGet({
    url: `${apiUrl}/admin/settings/city`,
  });

  useEffect(() => {
    refetchBranch();
    refetchCity();
  }, [refetchBranch, refetchCity]);

  useEffect(() => {
    if (dataCity && dataCity.cities) {
      // const cityNames = dataCity.cities.map((city) => ({ name: city.name }));
      setCities(dataCity?.cities || []);
    }
  }, [dataCity]);

  useEffect(() => {
    if (dataBranch) {
      setBranch(dataBranch);
      setName(dataBranch?.branches?.name || "");
      setAddress(dataBranch?.branches?.address || "");
      setBranchCover(dataBranch?.branches?.cover_image_link || "");
      setBranchCoverFile(dataBranch?.branches?.cover_image_link || "");
      setBranchImage(dataBranch?.branches?.image_link || "");
      setBranchImageFile(dataBranch?.branches?.image_link || "");
      setLatitude(dataBranch?.branches?.latitude || "");
      setCoverage(dataBranch?.branches?.coverage || "");
      setLongitude(dataBranch?.branches?.longitude || "");
      setStateCity(dataBranch?.branches?.city || stateCity);
      setSelectedCity(dataBranch?.branches?.city || selectedCity);
      setPhone(dataBranch?.branches?.phone || "");
      setEmail(dataBranch?.branches?.email || "");
      setFoodPreparationTime(dataBranch?.branches?.food_preparion_time || "");

      console.log("data fetch branch : ", dataBranch);
    }
  }, [dataBranch]);

  const auth = useAuth();
  const BranchImageRef = useRef();
  const BranchCoverRef = useRef();

  const [name, setName] = useState("");
  const [foodPreparationTime, setFoodPreparationTime] = useState("00:00");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [stateCity, setStateCity] = useState("Select City");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    console.log("stateCity", stateCity);
    console.log("selectedCity", selectedCity);
    console.log("selectedCity", selectedCity.id);
  }, [selectedCity, stateCity]);

  const [cities, setCities] = useState(null);
  const [branchImage, setBranchImage] = useState("");
  const [branchImageFile, setBranchImageFile] = useState(null);
  const [branchCover, setBranchCover] = useState("");
  const [branchCoverFile, setBranchCoverFile] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [coverage, setCoverage] = useState("");

  const handleChangeCity = (e) => {
    const selected = e.value;

    // Check if the selected city matches the current branch's city name
    if (selected.name === dataBranch.branches.city.name) {
      setSelectedCity(selected.name); // Update the selected city name
      setCityID(selected.id); // Set the city ID from the selected city
    } else {
      // Handle other logic if needed when the city doesn't match
      setSelectedCity(selected.name);
      setCityID(selected.id);
    }

    console.log("Selected City:", selected.name);
    console.log("City ID:", selected.id);
  };
  //  post formdata in postdata
  const handleBranchAdd = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!name) {
      auth.toastError(t("validation.enter_first_name"));
      return;
    }
    if (foodPreparationTime === "00:00") {
      auth.toastError(t("validation.enter_preparation_time"));
      return;
    }
    if (!address) {
      auth.toastError(t("validation.enter_address"));
      return;
    }
    if (!email) {
      auth.toastError(t("validation.enter_email"));
      return;
    }
    if (!phone) {
      auth.toastError(t("validation.enter_phone_number"));
      return;
    }
    // if (!password) {
    //     auth.toastError(t('validation.enter_password'));
    //     return;
    // }
    if (!branchImageFile) {
      auth.toastError(t("validation.upload_branch_image"));
      return;
    }
    if (!branchCoverFile) {
      auth.toastError(t("validation.upload_branch_cover"));
      return;
    }
    if (!latitude) {
      auth.toastError(t("validation.enter_latitude"));
      return;
    }
    if (!longitude) {
      auth.toastError(t("validation.enter_longitude"));
      return;
    }
    if (!coverage) {
      auth.toastError(t("validation.enter_coverage"));
      return;
    }

    const formData = new FormData();
    formData.append("name", name || dataBranch?.branches?.name);
    formData.append(
      "food_preparion_time",
      foodPreparationTime || dataBranch?.branches?.food_preparion_time
    );
    formData.append("address", address || dataBranch?.branches?.address);
    formData.append("email", email || dataBranch?.branches?.email);
    formData.append("phone", phone || dataBranch?.branches?.phone);
    formData.append("password", password || ""); // Optional password
    formData.append(
      "image",
      branchImageFile || dataBranch?.branches?.image_link
    );
    formData.append(
      "cover_image",
      branchCoverFile || dataBranch?.branches?.cover_image_link
    );
    formData.append("latitude", latitude || dataBranch?.branches?.latitude);
    formData.append("longitude", longitude || dataBranch?.branches?.longitude);
    formData.append("coverage", coverage || dataBranch?.branches?.coverage);
    formData.append("status", 1);
    formData.append("city_id", selectedCity.id);

    postData(formData, "Branch Added Success done");
    console.log("all data submitted", formData);

    // try {
    //     const response = await

    //     if (response?.status === 200) {
    //         auth.toastSuccess('Branch successfully added!');
    //     } else {
    //         auth.toastError('Failed to add branch. Please try again.');
    //     }

    // } catch (error) {
    //     auth.toastError('An error occurred. Please check your input.');
    //     console.error('Error during post:', error);
    // }
  };

  const handleBranchImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBranchImageFile(file);
      setBranchImage(file.name);
    }
  };

  const handleBranchImageClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleBranchCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBranchCoverFile(file);
      setBranchCover(file.name);
    }
  };

  const handleBranchCoverClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };
  const handleReset = () => {
    setName("");
    setFoodPreparationTime("00:00");
    setAddress("");
    setEmail("");
    setPhone("");
    setPassword("");
    setStateCity("Select City");
    setBranchImage("");
    setBranchImageFile(null);
    setBranchCover("");
    setBranchCoverFile(null);
    setLatitude("");
    setLongitude("");
    setCoverage("");
  };

  return (
    <>
      {loadingBranch || loadingPost ? (
        <>
          <div className="flex items-center justify-center w-full h-56 mt-8">
            <LoaderLogin />
          </div>
        </>
      ) : (
        <form
          className="flex flex-wrap items-start justify-start w-full gap-4 sm:flex-col lg:flex-row"
          onSubmit={handleBranchAdd}
        >
          {/* Name */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Name")}:
            </span>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Name")}
            />
          </div>
          {/* Food Preparation Time */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("FoodPreparationTime")}:
            </span>
            <CustomTimeInput
              value={foodPreparationTime}
              onChange={(newTime) => setFoodPreparationTime(newTime)}
            />
          </div>
          {/* Address */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Address")}:
            </span>
            <TextInput
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("Address")}
            />
          </div>
          {/* Email */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Email")}:
            </span>
            <EmailInput
              backgound="white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Email")}
            />
          </div>
          {/* Phone */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Phone")}:
            </span>
            <NumberInput
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("Phone")}
            />
          </div>
          {/* Password */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Password")}:
            </span>
            <PasswordInput
              backgound="white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Password")}
            />
          </div>
          {/* Branch Image */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("BranchPhoto")}:
            </span>
            <UploadInput
              value={branchImage}
              uploadFileRef={BranchImageRef}
              placeholder={t("BranchPhoto")}
              handleFileChange={handleBranchImageChange}
              onChange={(e) => setBranchImage(e.target.value)}
              onClick={() => handleBranchImageClick(BranchImageRef)}
            />
          </div>
          {/* Branch Image Cover*/}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("BranchCoverPhoto")}:
            </span>
            <UploadInput
              value={branchCover}
              uploadFileRef={BranchCoverRef}
              placeholder={t("BranchCoverPhoto")}
              handleFileChange={handleBranchCoverChange}
              onChange={(e) => setBranchCover(e.target.value)}
              onClick={() => handleBranchCoverClick(BranchCoverRef)}
            />
          </div>
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Cities")}:
            </span>
            <Dropdown
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.value)}
              options={cities}
              optionLabel="name"
              placeholder={stateCity.name}
              filter
              className="w-full md:w-14rem"
            />
          </div>

          <TitleSection text={t("Store Location")} />
          {/* Latitude */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Latitude")}:
            </span>
            <NumberInput
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder={t("Latitude")}
            />
          </div>
          {/* Longitude */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Longitude")}:
            </span>
            <NumberInput
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder={t("Longitude")}
            />
          </div>

          {/* Coverage */}
          <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("Coverage")}:
            </span>
            <NumberInput
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              placeholder={t("Coverage")}
            />
          </div>
          {/* Buttons */}
          <div className="flex items-center justify-end w-full mb-32 gap-x-4">
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
                handleClick={handleBranchAdd}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default MainBranchSetupPage;

const CustomTimeInput = ({ value, onChange }) => {
         const { t, i18n } = useTranslation();

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  ); // Pad hours to 2 digits
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  ); // Pad minutes to 2 digits

  const handleTimeChange = (type, newValue) => {
    const [currentHours, currentMinutes] = value.split(":");
    const updatedTime =
      type === "hours"
        ? `${newValue}: ${currentMinutes}`
        : `${currentHours}: ${newValue}`;
    onChange(updatedTime); // Ensure value is always in HH:mm format
  };

  return (
    <div className="flex gap-2 mt-3">
      <span className="text-xl font-TextFontRegular text-thirdColor">
        {t("Hours")}:
      </span>
      <select
        value={value.split(":")[0]} // Get hours part from the value
        onChange={(e) => handleTimeChange("hours", e.target.value)}
        className="px-2 py-1 border rounded"
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="text-xl font-TextFontRegular text-thirdColor">
        {t("Minutes")}:
      </span>
      <select
        value={value.split(":")[1]} // Get minutes part from the value
        onChange={(e) => handleTimeChange("minutes", e.target.value)}
        className="px-2 py-1 border rounded"
      >
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
};
