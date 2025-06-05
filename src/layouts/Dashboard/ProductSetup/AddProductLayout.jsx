import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { AddProductPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const AddProductLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('AddProduct')} />
                     <AddProductPage />
              </>
       )
}

export default AddProductLayout