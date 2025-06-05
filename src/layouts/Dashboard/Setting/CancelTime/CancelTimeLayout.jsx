import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { CancelTimePage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const CancelTimeLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('CancelTime')} />
                     <CancelTimePage />
              </>
       )
}

export default CancelTimeLayout