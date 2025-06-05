import React, { useEffect } from 'react'
import { LoaderLogin, TitlePage } from '../../../../Components/Components'
import { OutForDeliveryOrdersPage, SelectDateRangeSection } from '../../../../Pages/Pages'
import { OrdersComponent } from '../../../../Store/CreateSlices'
import { useGet } from '../../../../Hooks/useGet'
import { useTranslation } from "react-i18next";

const OutForDeliveryOrdersLayout = () => {
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { refetch: refetchBranch, loading: loadingBranch, data: dataBranch } = useGet({
              url: `${apiUrl}/admin/order/branches`
       });
  const { t, i18n } = useTranslation();

       useEffect(() => {
              refetchBranch(); // Refetch data when the component mounts
       }, [refetchBranch]);
       return (
              <>
                     <OrdersComponent />
                     <div className="flex flex-col w-full mb-0">
        <TitlePage text={t("OutForDeliveryOrders")} />
                            {loadingBranch ? (
                                   <>
                                          <div className="flex items-center justify-center w-full">
                                                 <LoaderLogin />
                                          </div>
                                   </>
                            ) : (
                                   <>
                                          <SelectDateRangeSection typPage={'out_for_delivery'} branchsData={dataBranch} />

                                          <OutForDeliveryOrdersPage />
                                   </>
                            )}
                     </div>
              </>
       )
}

export default OutForDeliveryOrdersLayout