import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { EditAddonsPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditAddonsLayout = () => {     
             const { t, i18n } = useTranslation();

       return (
              <>
                     <TitlePage text={t('EditAddon')} />
                     <EditAddonsPage />
              </>
       )
}

export default EditAddonsLayout