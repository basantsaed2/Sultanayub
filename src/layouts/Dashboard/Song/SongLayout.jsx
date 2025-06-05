import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { SongPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const SongLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('SoundNotificationOrder')} />
                     <SongPage />
              </>
       )
}

export default SongLayout