import React from 'react'
import { PolicySupportPage } from '../../../../Pages/Pages'
import { TitlePage } from '../../../../Components/Components'
import { useTranslation } from 'react-i18next';

const PolicySupportLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('Policy&Support')} />
                     <PolicySupportPage />
              </>
       )
}

export default PolicySupportLayout;