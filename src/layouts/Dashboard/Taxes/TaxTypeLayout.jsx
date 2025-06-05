import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { TaxTypePage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const TaxTypeLayout = () => {
                         const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('TaxType')} />
                     <TaxTypePage />
              </>
       )
}

export default TaxTypeLayout