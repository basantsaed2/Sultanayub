import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { EditCouponPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditCouponLayout = () => {
 const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditCoupon')} />
                     <EditCouponPage />
              </>
       )
}

export default EditCouponLayout