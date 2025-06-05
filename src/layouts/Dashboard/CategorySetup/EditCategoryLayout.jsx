import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { EditCategoryPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditCategotyLayout = () => {
                         const { t, i18n } = useTranslation();

       return (
              <>
                     <TitlePage text={t('EditCategory')} />
                     <EditCategoryPage />
              </>
       )
}

export default EditCategotyLayout