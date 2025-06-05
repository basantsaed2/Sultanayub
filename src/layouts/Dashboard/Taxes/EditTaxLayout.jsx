import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { EditTaxPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditTaxLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditTax')} />
                     <EditTaxPage />
              </>
       )
}

export default EditTaxLayout