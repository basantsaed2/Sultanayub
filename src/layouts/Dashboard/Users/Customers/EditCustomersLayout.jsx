import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { EditCustomersPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditCustomersLayout = () => {       
             const { t, i18n } = useTranslation();

       return (
              <>
                     <TitlePage text={t('EditCustomer')} />
                     <EditCustomersPage />
              </>
       )
}

export default EditCustomersLayout