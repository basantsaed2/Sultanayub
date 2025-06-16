import React, { useEffect, useState } from "react";
import {
  EmailInput,
  LoaderLogin,
  NumberInput,
  PasswordInput,
  StaticButton,
  SubmitButton,
  Switch,
  TextInput,
  TitleSection,
} from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import { usePost } from "../../../../Hooks/usePostJson";
import { useAuth } from "../../../../Context/Auth";
import { useTranslation } from "react-i18next";

const CustomerLoginPage = () => {
  const [manualLogin, setManualLogin] = useState(0);
  const [oTPLogin, setOTPLogin] = useState(0);
  const [emailVerification, setEmailVerification] = useState(0);
  const [phoneNumberVerification, setPhoneNumberVerification] = useState(0);
  // State for email verification inputs
  const [email, setEmail] = useState("");
  const [integrationPassword, setIntegrationPassword] = useState("");
  // State for phone verification inputs
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [senderId, setSenderId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [profileId, setProfileId] = useState("");

  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchLogin,
    loading: loadingLogin,
    data: dataLogin,
  } = useGet({
    url: `${apiUrl}/admin/settings/business_setup/customer_login`,
  });
  const [Loign, setLogin] = useState([]);

  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/settings/business_setup/customer_login/add`,
  });

  useEffect(() => {
    if (dataLogin && dataLogin.customer_login) {
      setLogin(dataLogin.customer_login);

      // Login condition
      if (dataLogin.customer_login?.login === "manuel") {
        setManualLogin(1);
      } else if (dataLogin.customer_login?.login === "otp") {
        setOTPLogin(1);
      }

      // Verification conditions
      if (dataLogin.customer_login?.verification === "email" && dataLogin.email_integration) {
        setEmailVerification(1);

      } else if (dataLogin.customer_login?.verification === "phone" && dataLogin.sms_integration) {
        setPhoneNumberVerification(1);
        setUser(dataLogin.sms_integration?.user || '')
        setPwd(dataLogin.sms_integration?.pwd)
        setSenderId(dataLogin.sms_integration?.senderid || '')
        setMobileNo(dataLogin.sms_integration?.mobileno || '')
        setCountryCode(dataLogin.sms_integration?.CountryCode || '')
        setProfileId(dataLogin.sms_integration?.profileid || '')
      }

      if (dataLogin.email_integration && emailVerification === 1) {
        setPhoneNumberVerification(0);
        setEmail(dataLogin.email_integration?.email)
        setIntegrationPassword(dataLogin.email_integration?.integration_password)
      }
      if (dataLogin.sms_integration && phoneNumberVerification === 1) {
        setEmailVerification(0);
        setUser(dataLogin.sms_integration?.user || '')
        setPwd(dataLogin.sms_integration?.pwd)
        setSenderId(dataLogin.sms_integration?.senderid || '')
        setMobileNo(dataLogin.sms_integration?.mobileno || '')
        setCountryCode(dataLogin.sms_integration?.CountryCode || '')
        setProfileId(dataLogin.sms_integration?.profileid || '')
      }

    }

    console.log("dataLogin fetch:", dataLogin);
  }, [dataLogin, phoneNumberVerification, emailVerification]);

  const handleClickManualLogin = (e) => {
    const isChecked = e.target.checked;
    setManualLogin(isChecked ? 1 : 0);
    setOTPLogin(0);
  };

  const handleClickOTPLogin = (e) => {
    const isChecked = e.target.checked;
    setOTPLogin(isChecked ? 1 : 0);
    setManualLogin(0);
    setEmailVerification(0);
    setPhoneNumberVerification(0);
  };

  const handleClickEmailVerification = (e) => {
    const isChecked = e.target.checked;
    setEmailVerification(isChecked ? 1 : 0);
    setPhoneNumberVerification(0);
  };

  const handleClickPhoneNumberVerification = (e) => {
    const isChecked = e.target.checked;
    setPhoneNumberVerification(isChecked ? 1 : 0);
    setEmailVerification(0);
  };

  const handleReset = () => {
    setManualLogin(0);
    setOTPLogin(0);
    setEmailVerification(0);
    setPhoneNumberVerification(0);
    // Reset input fields
    setEmail("");
    setIntegrationPassword("");
    setUser("");
    setPwd("");
    setSenderId("");
    setMobileNo("");
    setCountryCode("");
    setProfileId("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Error check for login method
    if (oTPLogin === 0 && manualLogin === 0) {
      auth.toastError(t("Pleaseselectaloginmethod"));
      return;
    }

    const formData = new FormData();

    // Set login method
    if (manualLogin === 1) {
      formData.append("login", "manuel");
    } else if (oTPLogin === 1) {
      formData.append("login", "otp");

      // Set verification method for OTP login and respective data fields
      if (emailVerification === 1) {
        // Validate email inputs
        if (!email || !integrationPassword) {
          auth.toastError(t("Pleasefillallemailfields"));
          return;
        }
        formData.append("verification", "email");
        // Email verification data
        formData.append("email", email);
        formData.append("integration_password", integrationPassword);
      } else if (phoneNumberVerification === 1) {
        // Validate phone inputs
        if (!user || !pwd || !senderId || !mobileNo || !countryCode || !profileId) {
          auth.toastError(t("Pleasefillallphonefields"));
          return;
        }
        formData.append("verification", "phone");
        // Phone verification data
        formData.append("user", user);
        formData.append("pwd", pwd);
        formData.append("senderid", senderId);
        formData.append("mobileno", mobileNo);
        formData.append("CountryCode", countryCode);
        formData.append("profileid", profileId);
      } else {
        auth.toastError(t("Pleaseselectaverificationmethod"));
        return;
      }
    }

    // Post data with success message
    postData(formData, t("Branch Added Successfully"));
    console.log("all data submitted:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  return (
    <>
      {loadingLogin || loadingPost ? (
        <div className="flex items-center justify-center w-full h-56">
          <LoaderLogin />
        </div>
      ) : (
        <form
          className="flex flex-wrap items-start justify-start w-full gap-4 sm:flex-col lg:flex-row mb-20"
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <TitleSection text={t("Restaurant Closing Schedules")} />
            <p className="text-xl font-TextFontMedium text-secoundColor">
              {t("Theoption")}
            </p>
          </div>

          <div className="sm:w-full xl:w-[30%] flex items-center justify-start gap-3">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("ManualLogin")}:
            </span>
            <div>
              <Switch
                checked={manualLogin}
                handleClick={handleClickManualLogin}
              />
            </div>
          </div>
          <div className="sm:w-full xl:w-[30%] flex items-center justify-start gap-3">
            <span className="text-xl font-TextFontRegular text-thirdColor">
              {t("OTPLogin")}:
            </span>
            <div>
              <Switch checked={oTPLogin} handleClick={handleClickOTPLogin} />
            </div>
          </div>
          {oTPLogin === 1 && (
            <>
              <div className="w-full">
                <TitleSection text={t("OTPVerification")} />
                <p className="text-xl font-TextFontMedium text-secoundColor">
                  {t("Theoptionyou")}
                </p>
              </div>
              <div className="sm:w-full xl:w-[30%] flex items-center justify-start gap-3">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("EmailVerification")}:
                </span>
                <div>
                  <Switch
                    checked={emailVerification}
                    handleClick={handleClickEmailVerification}
                  />
                </div>
              </div>

              <div className="sm:w-full xl:w-[30%] flex items-center justify-start gap-3">
                <span className="text-xl font-TextFontRegular text-thirdColor">
                  {t("PhoneNumberVerification")}:
                </span>
                <div>
                  <Switch
                    checked={phoneNumberVerification}
                    handleClick={handleClickPhoneNumberVerification}
                  />
                </div>
              </div>

              {emailVerification === 1 && (
                <form
                  className="flex flex-wrap items-start justify-start w-full gap-4 sm:flex-col lg:flex-row"
                  onSubmit={handleSubmit}
                >
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
                  {/* Password */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("Password")}:
                    </span>
                    <PasswordInput
                      backgound="white"
                      value={integrationPassword}
                      onChange={(e) => setIntegrationPassword(e.target.value)}
                      placeholder={t("Password")}
                    />
                  </div>
                </form>
              )}
              {phoneNumberVerification === 1 && (
                <form
                  className="flex flex-wrap items-start justify-start w-full gap-4 sm:flex-col lg:flex-row"
                  onSubmit={handleSubmit}
                >
                  {/* User */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("User")}
                    </span>
                    <TextInput
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      placeholder={t("EnterUser")}
                    />
                  </div>
                  {/* Password */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("Password")}:
                    </span>
                    <PasswordInput
                      backgound="white"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      placeholder={t("EnterPassword")}
                    />
                  </div>
                  {/* SenderID */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("SenderID")}
                    </span>
                    <TextInput
                      value={senderId}
                      onChange={(e) => setSenderId(e.target.value)}
                      placeholder={t("EnterSenderID")}
                    />
                  </div>
                  {/* MobileNumber */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("MobileNumber")}
                    </span>
                    <NumberInput
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      placeholder={t("EnterMobileNumber")}
                    />
                  </div>
                  {/* countryCode */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("CountryCode")}
                    </span>
                    <TextInput
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      placeholder={t("EnterCountryCode")}
                    />
                  </div>
                  {/* ProfileID */}
                  <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                    <span className="text-xl font-TextFontRegular text-thirdColor">
                      {t("ProfileID")}
                    </span>
                    <TextInput
                      value={profileId}
                      onChange={(e) => setProfileId(e.target.value)}
                      placeholder={t("EnterProfileID")}
                    />
                  </div>
                </form>
              )}
            </>
          )}
          {/* Buttons */}
          <div className="flex items-center justify-end w-full gap-x-4">
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
                  handleClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CustomerLoginPage;