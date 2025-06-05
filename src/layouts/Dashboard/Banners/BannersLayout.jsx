import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../Components/Components'
import { AddBannerSection, BannersPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const BannersLayout = () => {
  const [update, setUpdate] = useState(false)
  const { t, i18n } = useTranslation();
  
  return (
    <>
      <TitlePage text={t('AddBanner')} />
      <AddBannerSection update={update} setUpdate={setUpdate} />
      <TitleSection text={t('BannersTable')} />
      <BannersPage refetch={update} />
    </>
  )
}

export default BannersLayout