import React, { useEffect } from 'react'
import { TitlePage } from '../../../../Components/Components'
import { OutForDeliveryOrdersPage, SelectDateRangeSection } from '../../../../Pages/Pages'
import { OrdersComponent } from '../../../../Store/CreateSlices'
import { useTranslation } from "react-i18next";

const OutForDeliveryOrdersLayout = () => {
       const { t, i18n } = useTranslation();

       return (
              <>
                     <OrdersComponent />
                     <div className="flex flex-col w-full mb-0">
                            <TitlePage text={t("OutForDeliveryOrders")} />
                            <SelectDateRangeSection typPage={'out_for_delivery'} />
                            <OutForDeliveryOrdersPage />
                     </div>
              </>
       )
}

export default OutForDeliveryOrdersLayout