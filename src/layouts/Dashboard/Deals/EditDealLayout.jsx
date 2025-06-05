import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { EditDealPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditDealLayout = () => {
                  const { t, i18n } = useTranslation();

       return (
              <>
                     <TitlePage text={t('EditDeal')} />
                     <EditDealPage />
              </>
       )
}

export default EditDealLayout