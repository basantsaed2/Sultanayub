import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { EditProductPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditProductLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditProduct')} />
                     <EditProductPage />
              </>
       )
}

export default EditProductLayout