import { useEffect, useState } from "react";
import {
  EmailInput,
  LoaderLogin,
  PasswordInput,
  SubmitButton,
} from "../../Components/Components";
import LoginBackground from "../../Assets/Images/LoginBackground";
import { useAuth } from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../Hooks/usePostJson";
import { useDispatch } from "react-redux";
import { setUser } from "../../Store/CreateSlices";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t, i18n } = useTranslation();

  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const { postData, loadingPost, response, error } = usePost({
    url: `${apiUrl}/api/admin/auth/login`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }); // Destructure as an object
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // Use uppercase "D"

    if (!email) {
      auth.toastError(t("Please Enter The Email"));
      return;
    }
    if (!password) {
      auth.toastError(t("Please Enter The Password"));
      return;
    }
    const payload = {
      email,
      password,
    };

    console.log("Login payload:", payload);
    console.log("API URL:", `${apiUrl}/api/admin/auth/login`);
    
    postData(payload); // Call postData with formData
  };

  useEffect(() => {
    if (response) {
      console.log("response", response);

      // التحقق من وجود البيانات المطلوبة
      if (response.data && response.data.admin && response.data.token) {
        auth.login(response.data.admin);

        // تخزين التوكن في localStorage بعد تسجيل الدخول
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        // التوجيه بناءً على الدور
        const userRole = response.data.role;
        
        if (userRole === 'admin') {
          navigate("/dashboard", { replace: true });
        } else if (userRole === 'branch') {
          navigate("/branch", { replace: true });
        } else {
          // في حالة وجود أدوار أخرى، يمكن إضافة المزيد من الشروط
          // أو توجيه إلى صفحة افتراضية
          navigate("/dashboard", { replace: true });
        }
      } else {
        console.error("Response structure is invalid:", response);
        auth.toastError(t("Login failed. Please try again."));
      }
    }
    
    // التعامل مع الأخطاء
    if (error) {
      console.error("Login error:", error);
      
      // التحقق من نوع الخطأ
      if (error.response) {
        // خطأ من الـ server
        const errorMessage = error.response.data?.message || "Login failed";
        auth.toastError(t(errorMessage));
      } else if (error.request) {
        // مشكلة في الـ network
        auth.toastError(t("Network error. Please check your connection."));
      } else {
        // خطأ عام
        auth.toastError(t("Login failed. Please try again."));
      }
    }
  }, [response, error, navigate, auth, t]);

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex items-center justify-center w-full h-screen mx-auto overflow-hidden"
      >
        <div className="flex items-start justify-between w-11/12 h-5/6">
          <div className="flex flex-col items-start justify-start h-full sm:w-full xl:w-5/12 gap-y-8">
            {loadingPost ? (
              <>
                <div className="w-full h-full">
                  <LoaderLogin />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-start justify-start w-full gap-y-4">
                  <span className="sm:text-4xl xl:text-5xl font-TextFontRegular text-secoundColor">
                    {t("Loginto")} {t("projectName")}
                  </span>
                  <span className="sm:text-4xl xl:text-5xl font-TextFontRegular text-secoundColor">
                    {t("welcomeback")}
                  </span>
                </div>
                <div className="flex flex-col justify-center w-full gap-y-10 h-3/5">
                  <div className="flex flex-col justify-center w-full gap-y-6">
                    <div className="w-11/12 mx-auto">
                      <EmailInput
                        value={email}
                        required={false}
                        placeholder={t("Email")}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="w-11/12 mx-auto">
                      <PasswordInput
                        value={password}
                        placeholder={t("Password")}
                        required={false}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-11/12 mx-auto">
                    <SubmitButton text={t("Login")} handleClick={handleLogin} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="items-center justify-center w-2/4 h-full sm:hidden xl:flex">
            <LoginBackground height="100%" />
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginPage;