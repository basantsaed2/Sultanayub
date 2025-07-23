import { useEffect } from "react";
import { LoaderLogin, TitlePage } from "../../../../Components/Components";
import {
  DeliveredOrdersPage,
  SelectDateRangeSection,
} from "../../../../Pages/Pages";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useGet } from "../../../../Hooks/useGet";
import { useTranslation } from "react-i18next";

const DeliveredOrdersLayout = () => {
  const { t } = useTranslation();
  const userRole = localStorage.getItem("role") || "admin";

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const apiEndpoint =
    userRole === "branch"
      ? `${apiUrl}/branch/online_order`
      : `${apiUrl}/admin/order/branches`;

  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: apiEndpoint,
    enabled: userRole === "branch",
  });

  useEffect(() => {
    if (userRole === "branch") {
      refetchBranch();
    }
  }, [refetchBranch, userRole]);

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        <TitlePage text={t("DeliveredOrders")} />
        {loadingBranch ? (
          <div className="flex items-center justify-center w-full">
            <LoaderLogin />
          </div>
        ) : (
          <>
            <SelectDateRangeSection
              typPage={"delivered"}
              branchsData={dataBranch}
            />
            <DeliveredOrdersPage />
          </>
        )}
      </div>
    </>
  );
};

export default DeliveredOrdersLayout;
