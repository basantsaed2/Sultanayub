import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { DeliveryTimePage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const DeliveryTimeLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('DeliveryTime')} />
                     <DeliveryTimePage />
              </>
       )
}

export default DeliveryTimeLayout