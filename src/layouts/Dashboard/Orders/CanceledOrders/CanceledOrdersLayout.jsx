import { useEffect } from "react";
import { LoaderLogin, TitlePage } from "../../../../Components/Components";
import {
  CanceledOrdersPage,
  SelectDateRangeSection,
} from "../../../../Pages/Pages";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useGet } from "../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";

const CanceledOrdersLayout = () => {
  const { t } = useTranslation();

  // الحصول على الـ role من localStorage
  const userRole = localStorage.getItem("role") || "admin";  // إذا لم يكن موجود، سيتم تعيينه إلى admin بشكل افتراضي

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // تحديد الـ URL بناءً على الدور (role)
  const apiEndpoint =
    userRole === "branch" ? `${apiUrl}/branch/online_order` : `${apiUrl}/admin/order/branches`;

  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: apiEndpoint,
    enabled: userRole === "branch",
  });

  useEffect(() => {
    refetchBranch(); // Refetch data when the component mounts
  }, [refetchBranch]);

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        <TitlePage text={t("CanceledOrders")} />
        {loadingBranch ? (
          <div className="flex items-center justify-center w-full">
            <LoaderLogin />
          </div>
        ) : (
          <>
            <SelectDateRangeSection
              typPage={"canceled"}
              branchsData={dataBranch}
            />
            <CanceledOrdersPage />
          </>
        )}
      </div>
    </>
  );
};

export default CanceledOrdersLayout;
