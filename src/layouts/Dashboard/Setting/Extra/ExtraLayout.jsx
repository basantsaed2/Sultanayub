import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddExtraPage, ExtraPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const ExtraLayout = () => {
  const [update, setUpdate] = useState(false)
             const { t, i18n } = useTranslation();
  
  return (
    <>
      <TitlePage text={t('AddNewExtra')} />
      <AddExtraPage update={update} setUpdate={setUpdate} />
      <TitleSection text={t('ExtraTable')} />
      <ExtraPage refetch={update} />
    </>
  )
}

export default ExtraLayout;