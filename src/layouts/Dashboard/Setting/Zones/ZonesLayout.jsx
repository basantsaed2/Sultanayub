import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddZoneSection, ZonesPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const ZonesLayout = () => {
  const [update, setUpdate] = useState(false)
             const { t, i18n } = useTranslation();
  
  return (
    <>
      <TitlePage text={t('AddNewZone')} />
      <AddZoneSection update={update} setUpdate={setUpdate} />
      <TitleSection text={t('ZonesTable')} />
      <ZonesPage refetch={update} />
    </>
  )
}

export default ZonesLayout