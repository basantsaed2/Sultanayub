import React from 'react'
import { EditCityPage } from '../../../../Pages/Pages'
import { TitlePage } from '../../../../Components/Components'
import { useTranslation } from 'react-i18next';

const EditCityLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditCity')} />
                     <EditCityPage />
              </>
       )
}

export default EditCityLayout