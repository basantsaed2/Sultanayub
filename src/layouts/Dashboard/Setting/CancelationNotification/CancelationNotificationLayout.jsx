import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { CancelationNotificationPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const CancelationNotificationLayout = () => {
                         const { t, i18n } = useTranslation();

       return (
              <>
                     <TitlePage text={t('Cancelation Notification')} />
                     <CancelationNotificationPage />
              </>
       )
}

export default CancelationNotificationLayout