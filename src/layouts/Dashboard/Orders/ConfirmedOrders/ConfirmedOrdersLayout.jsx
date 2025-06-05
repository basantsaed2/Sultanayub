import React, { useEffect } from "react";
import { LoaderLogin, TitlePage } from "../../../../Components/Components";
import {
  ConfirmedOrdersPage,
  SelectDateRangeSection,
} from "../../../../Pages/Pages";
import { useGet } from "../../../../Hooks/useGet";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useTranslation } from "react-i18next";

const ConfirmedOrdersLayout = () => {
  const { t, i18n } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: `${apiUrl}/admin/order/branches`,
  });

  useEffect(() => {
    refetchBranch(); // Refetch data when the component mounts
  }, [refetchBranch]);

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
        <TitlePage text={t("ConfirmedOrders")} />
        {loadingBranch ? (
          <>
            <div className="flex items-center justify-center w-full">
              <LoaderLogin />
            </div>
          </>
        ) : (
          <>
            <SelectDateRangeSection
              typPage={"confirmed"}
              branchsData={dataBranch}
            />

            <ConfirmedOrdersPage />
          </>
        )}
      </div>
    </>
  );
};

export default ConfirmedOrdersLayout;
