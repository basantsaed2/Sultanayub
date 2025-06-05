import React, { useEffect } from "react";
import { LoaderLogin, TitlePage } from "../../../../Components/Components";
import {
  PendingOrdersPage,
  SelectDateRangeSection,
} from "../../../../Pages/Pages";
import { useGet } from "../../../../Hooks/useGet";
import { OrdersComponent } from "../../../../Store/CreateSlices";
import { useTranslation } from "react-i18next";

const PendingOrdersLayout = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchBranch,
    loading: loadingBranch,
    data: dataBranch,
  } = useGet({
    url: `${apiUrl}/admin/order/branches`,
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    refetchBranch(); // Refetch data when the component mounts
  }, [refetchBranch]);

  return (
    <>
      <OrdersComponent />
      <div className="flex flex-col w-full mb-0">
                            <TitlePage text={t('PendingOrders')} />
        {loadingBranch ? (
          <>
            <div className="flex items-center justify-center w-full">
              <LoaderLogin />
            </div>
          </>
        ) : (
          <>
            <SelectDateRangeSection
              typPage={"pending"}
              branchsData={dataBranch}
            />

            <PendingOrdersPage />
          </>
        )}
      </div>
    </>
  );
};

export default PendingOrdersLayout;
