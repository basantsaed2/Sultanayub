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
       Switch,
       TextInput,
       UploadInput,
} from "../../../../../Components/Components";
import { usePost } from "../../../../../Hooks/usePostJson";
import { useAuth } from "../../../../../Context/Auth";
import { useNavigate, useParams } from "react-router-dom";
import { useGet } from "../../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";

const EditBranchPage = () => {
       const { branchId } = useParams();
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const {
              refetch: refetchCities,
              loading: loadingCities,
              data: dataCities,
       } = useGet({
              url: `${apiUrl}/admin/settings/city`,
       });
       const {
              refetch: refetchTranslation,
              loading: loadingTranslation,
              data: dataTranslation,
       } = useGet({
              url: `${apiUrl}/admin/translation`,
       });
       const {
              refetch: refetchBranch,
              loading: loadingBranch,
              data: dataBranch,
       } = useGet({ url: `${apiUrl}/admin/branch/item/${branchId}` });
       const { postData, loadingPost, response } = usePost({
              url: `${apiUrl}/admin/branch/update/${branchId}`,
       });

       const auth = useAuth();
       const navigate = useNavigate();
       const { t, i18n } = useTranslation();

       const dropDownCities = useRef();
       const ImageRef = useRef();
       const CoverRef = useRef();
       const [taps, setTaps] = useState([]);
       const [currentTap, setCurrentTap] = useState(0);
       const [cities, setCities] = useState([]);
       const [branch, setBranch] = useState("");

       const [branchName, setBranchName] = useState([]);
       const [branchAddress, setBranchAddress] = useState("");
       const [branchEmail, setBranchEmail] = useState("");
       const [branchPhone, setBranchPhone] = useState("");
       const [branchPassword, setBranchPassword] = useState("");
       const [foodPreparationTime, setFoodPreparationTime] = useState("00:00");
       const [branchLatitude, setBranchLatitude] = useState("");
       const [branchLongitude, setBranchLongitude] = useState("");
       const [branchCoverage, setBranchCoverage] = useState("");

       const [activeBranch, setActiveBranch] = useState(0);

       const [stateCity, setStateCity] = useState("Select City");
       const [cityId, setCityId] = useState("");
       const [isOpenCity, setIsOpenCity] = useState(false);

       const [image, setImage] = useState("");
       const [imageFile, setImageFile] = useState(null);

       const [cover, setCover] = useState("");
       const [coverFile, setCoverFile] = useState(null);

       useEffect(() => {
              refetchCities(); // Refetch data when the component mounts
              refetchBranch(); // Refetch data when the component mounts
       }, [refetchCities, refetchBranch]);

       useEffect(() => {
              refetchCities(); // Refetch data when the component mounts
              refetchTranslation(); // Refetch data when the component mounts
       }, [refetchCities, refetchTranslation]);

       useEffect(() => {
              if (dataTranslation) {
                     setTaps(dataTranslation.translation);
              }
       }, [dataTranslation]);

       useEffect(() => {
              if (dataCities && dataCities.city) {
                     setCities([{ id: "", name: "Select City" }, ...dataCities.cities] || []);
              }
              if (dataBranch) {
                     setBranch(dataBranch.branch && dataBranch.branch_names);
                     const newBranchNames = [];
                     if (dataBranch.branch_names) {
                            dataBranch.branch_names.forEach((branch) => {
                                   let obj = {
                                          tranlation_id: branch.tranlation_id || "-", // Use '' if id is missing
                                          tranlation_name: branch.tranlation_name || "Default Language", // Fallback value
                                          branch_name: branch.branch_name || "-", // Use '' if name is missing
                                   };
                                   newBranchNames.push(obj);
                            });
                     }
                     console.log("categoryName edite", branchName);

                     setBranchName(newBranchNames.length > 0 ? newBranchNames : []);
                     setBranchAddress(dataBranch.branch.address || "");
                     setBranchEmail(dataBranch.branch.email || "");
                     setBranchPhone(dataBranch.branch.phone || "");
                     setBranchPassword(dataBranch.branch.password || "");
                     setFoodPreparationTime(dataBranch.branch.food_preparion_time || "00:00");
                     setBranchLatitude(dataBranch.branch.latitude || "");
                     setBranchLongitude(dataBranch.branch.longitude || "");
                     setBranchCoverage(dataBranch.branch.coverage || "");

                     setActiveBranch(dataBranch.branch.status || 0);

                     setStateCity(dataBranch.branch.city.name || "Select City");
                     setCityId(dataBranch.branch.city.id || "");

                     setImage(dataBranch.branch.image_link || "");
                     setImageFile(dataBranch.branch.image_link || null);

                     setCover(dataBranch.branch.cover_image || "");
                     setCoverFile(dataBranch.branch.cover_image_link || null);
              }

              console.log("cities", cities);

              console.log("branch", branch);
       }, [dataCities, dataBranch]);

       const handleTap = (index) => {
              setCurrentTap(index);
       };

       const handleImageChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                     setImageFile(file);
                     setImage(file.name);
              }
       };
       const handleCoverChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                     setCoverFile(file);
                     setCover(file.name);
              }
       };

       const handleImageClick = (ref) => {
              if (ref.current) {
                     ref.current.click();
              }
       };
       const handleCoverClick = (ref) => {
              if (ref.current) {
                     ref.current.click();
              }
       };

       const handleOpenCities = () => setIsOpenCity(!isOpenCity);
       const handleOpenOptionCites = () => setIsOpenCity(false);

       const handleSelectCity = (option) => {
              setCityId(option.id);
              setStateCity(option.name);
       };

       const handleStatusBranch = () => {
              const currentState = activeBranch;
              {
                     currentState === 0 ? setActiveBranch(1) : setActiveBranch(0);
              }
       };

       useEffect(() => {
              console.log("response", response);
              if (response) {
                     handleBack();
              }
       }, [response]);

       const handleBack = () => {
              console.log("first", "first");
              navigate(-1, { replace: true });
       };

       useEffect(() => {
              const handleClickOutside = (event) => {
                     if (
                            dropDownCities.current &&
                            !dropDownCities.current.contains(event.target)
                     ) {
                            setIsOpenCity(null);
                     }
              };

              document.addEventListener("mousedown", handleClickOutside);
              return () => {
                     document.removeEventListener("mousedown", handleClickOutside);
              };
       }, []);

       const handleBranchEdit = (e) => {
              e.preventDefault();

              if (branchName.length === 0) {
                     auth.toastError(t("please Enter Branch Names"));
                     return;
              }
              if (!branchAddress) {
                     auth.toastError(t("Please Enter Branch Address"));
                     return;
              }
              if (!branchPhone) {
                     auth.toastErrort(t("Please Enter Branch Phone"));
                     return;
              }
              if (!branchEmail) {
                     auth.toastError(t("Please Enter Branch Email"));
                     return;
              }
              if (!branchEmail.includes("@")) {
                     auth.toastError(t("Please Add @ after branch email"));
                     return;
              }
              // if (!branchPassword) {
              //        auth.toastError('Please Enter Branch Password')
              //        return;
              // }
              if (!branchCoverage) {
                     auth.toastError(t("Please Enter Branch Coverage"));
                     return;
              }
              if (!cityId) {
                     auth.toastError(t("Please Select City"));
                     return;
              }
              if (!branchLatitude) {
                     auth.toastError(t("Please Enter Branch Latitude"));
                     return;
              }
              if (!branchLongitude) {
                     auth.toastError(t("Please Enter Branch Longitude"));
                     return;
              }
              if (foodPreparationTime == "00:00") {
                     auth.toastError(t("Please Enter Food Preparion Time"));
                     return;
              }
              if (!imageFile) {
                     auth.toastError(t("Please Enter Image"));
                     return;
              }
              if (!coverFile) {
                     auth.toastError(t("Please Enter Cover File"));
                     return;
              }

              const formData = new FormData();

              formData.append("address", branchAddress);
              formData.append("email", branchEmail);
              formData.append("phone", branchPhone);

              if (branchPassword) {
                     formData.append("password", branchPassword);
              }
              formData.append("food_preparion_time", foodPreparationTime);
              formData.append("latitude", branchLatitude);
              formData.append("longitude", branchLongitude);
              formData.append("coverage", branchCoverage);
              formData.append("city_id", cityId);
              formData.append("status", activeBranch);
              formData.append("image", imageFile);
              formData.append("cover_image", coverFile);

              branchName.forEach((name, index) => {
                     // Corrected the typo and added translation_id and translation_name
                     formData.append(
                            `branch_names[${index}][tranlation_id]`,
                            name.tranlation_id
                     );
                     formData.append(`branch_names[${index}][branch_name]`, name.branch_name);
                     formData.append(
                            `branch_names[${index}][tranlation_name]`,
                            name.tranlation_name
                     );
              });

              postData(formData, "Branch Updated Success");
       };
       return (
              <>
                     {loadingCities || loadingPost ? (
                            <>
                                   <div className="flex items-center justify-center w-full h-56">
                                          <StaticLoader />
                                   </div>
                            </>
                     ) : (
                            <section>
                                   <form onSubmit={handleBranchEdit} className="mb-20">
                                          {/* Taps */}
                                          <div className="flex items-center justify-start w-full py-2 gap-x-6">
                                                 {taps.map((tap, index) => (
                                                        <span
                                                               key={tap.id}
                                                               onClick={() => handleTap(index)}
                                                               className={`${currentTap === index
                                                                             ? "text-mainColor border-b-4 border-mainColor"
                                                                             : "text-thirdColor"
                                                                      }  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                                                        >
                                                               {tap.name}
                                                        </span>
                                                 ))}
                                          </div>
                                          {/* Content*/}
                                          <div className="sm:py-3 lg:py-6">
                                                 {taps.map(
                                                        (tap, index) =>
                                                               currentTap === index && (
                                                                      <div
                                                                             className="flex flex-wrap items-center justify-start w-full gap-4 sm:flex-col lg:flex-row"
                                                                             key={tap.id}
                                                                      >
                                                                             <div className="flex flex-wrap items-center justify-start w-full gap-4 sm:flex-col lg:flex-row">
                                                                                    {/* Branch Name */}
                                                                                    <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                           <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                  {t("Name")} {tap.name}:
                                                                                           </span>
                                                                                           <TextInput
                                                                                                  value={branchName[index]?.branch_name} // Access zone_names property
                                                                                                  onChange={(e) => {
                                                                                                         const inputValue = e.target.value; // Ensure this is a string
                                                                                                         setBranchName((prev) => {
                                                                                                                const updatedNames = [...prev];

                                                                                                                // Ensure the array is long enough
                                                                                                                if (updatedNames.length <= index) {
                                                                                                                       updatedNames.length = index + 1; // Resize array
                                                                                                                }

                                                                                                                // Create or update the object at the current index
                                                                                                                updatedNames[index] = {
                                                                                                                       ...updatedNames[index], // Retain existing properties if any
                                                                                                                       tranlation_id: tap.id, // Use the ID from tap
                                                                                                                       branch_name: inputValue, // Use the captured string value
                                                                                                                       tranlation_name: tap.name || "Default Name", // Use tap.name for tranlation_name
                                                                                                                };

                                                                                                                return updatedNames;
                                                                                                         });
                                                                                                  }}
                                                                                                  placeholder={t("BranchName")}
                                                                                           />
                                                                                    </div>

                                                                                    {currentTap === 0 && (
                                                                                           <>
                                                                                                  {/* Branch Address */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchAddress")}:
                                                                                                         </span>
                                                                                                         <TextInput
                                                                                                                value={branchAddress}
                                                                                                                onChange={(e) =>
                                                                                                                       setBranchAddress(e.target.value)
                                                                                                                }
                                                                                                                placeholder={t("BranchAddress")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Phone */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchPhone")}:
                                                                                                         </span>
                                                                                                         <NumberInput
                                                                                                                value={branchPhone}
                                                                                                                onChange={(e) => setBranchPhone(e.target.value)}
                                                                                                                placeholder={t("BranchPhone")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Email */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchEmail")}:
                                                                                                         </span>
                                                                                                         <TextInput
                                                                                                                // backgound='white'
                                                                                                                value={branchEmail}
                                                                                                                onChange={(e) => setBranchEmail(e.target.value)}
                                                                                                                placeholder={t("BranchEmail")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Password */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchPassword")}:
                                                                                                         </span>
                                                                                                         <PasswordInput
                                                                                                                backgound="white"
                                                                                                                value={branchPassword}
                                                                                                                onChange={(e) =>
                                                                                                                       setBranchPassword(e.target.value)
                                                                                                                }
                                                                                                                placeholder={t("BranchPassword")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Coverage */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchCoverage")}:
                                                                                                         </span>
                                                                                                         <NumberInput
                                                                                                                value={branchCoverage}
                                                                                                                onChange={(e) =>
                                                                                                                       setBranchCoverage(e.target.value)
                                                                                                                }
                                                                                                                placeholder={t("BranchCoverage")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Cities */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("City")}:
                                                                                                         </span>
                                                                                                         <DropDown
                                                                                                                ref={dropDownCities}
                                                                                                                handleOpen={handleOpenCities}
                                                                                                                stateoption={stateCity}
                                                                                                                openMenu={isOpenCity}
                                                                                                                handleOpenOption={handleOpenOptionCites}
                                                                                                                onSelectOption={handleSelectCity}
                                                                                                                options={cities}
                                                                                                                border={false}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Latitude */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchLatitude")}:
                                                                                                         </span>
                                                                                                         <NumberInput
                                                                                                                value={branchLatitude}
                                                                                                                onChange={(e) =>
                                                                                                                       setBranchLatitude(e.target.value)
                                                                                                                }
                                                                                                                placeholder={t("BranchLatitude")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Longitude */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("BranchLongitude")}:
                                                                                                         </span>
                                                                                                         <NumberInput
                                                                                                                value={branchLongitude}
                                                                                                                onChange={(e) =>
                                                                                                                       setBranchLongitude(e.target.value)
                                                                                                                }
                                                                                                                placeholder={t("BranchLongitude")}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Preparion Time */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("FoodPreparationTime")}:
                                                                                                         </span>
                                                                                                         <CustomTimeInput
                                                                                                                value={foodPreparationTime}
                                                                                                                onChange={(newTime) =>
                                                                                                                       setFoodPreparationTime(newTime)
                                                                                                                }
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Branch Image */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("Image")}:
                                                                                                         </span>
                                                                                                         <UploadInput
                                                                                                                value={image}
                                                                                                                uploadFileRef={ImageRef}
                                                                                                                placeholder={t("Category Image")}
                                                                                                                handleFileChange={handleImageChange}
                                                                                                                onChange={(e) => setImage(e.target.value)}
                                                                                                                onClick={() => handleImageClick(ImageRef)}
                                                                                                         />
                                                                                                  </div>
                                                                                                  {/* Banner Cover Image */}
                                                                                                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("CoverImage")}:
                                                                                                         </span>
                                                                                                         <UploadInput
                                                                                                                value={cover}
                                                                                                                uploadFileRef={CoverRef}
                                                                                                                placeholder={t("CoverImage")}
                                                                                                                handleFileChange={handleCoverChange}
                                                                                                                onChange={(e) => setCover(e.target.value)}
                                                                                                                onClick={() => handleCoverClick(CoverRef)}
                                                                                                         />
                                                                                                  </div>
                                                                                                  <div className="sm:w-full xl:w-[30%] flex items-center justify-start gap-3">
                                                                                                         <span className="text-xl font-TextFontRegular text-thirdColor">
                                                                                                                {t("Active")}:
                                                                                                         </span>
                                                                                                         <Switch
                                                                                                                handleClick={handleStatusBranch}
                                                                                                                checked={activeBranch}
                                                                                                         />
                                                                                                  </div>
                                                                                           </>
                                                                                    )}
                                                                             </div>
                                                                      </div>
                                                               )
                                                 )}
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
                                                               text={t("Submit")}
                                                               rounded="rounded-full"
                                                               handleClick={handleBranchEdit}
                                                        />
                                                 </div>
                                          </div>
                                   </form>
                            </section>
                     )}
              </>
       );
};

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
                            ? `${newValue}:${currentMinutes}`
                            : `${currentHours}:${newValue}`;
              onChange(updatedTime); // Ensure value is always in HH:mm format
       };

       return (
              <div className="flex gap-2">
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

export default EditBranchPage;
