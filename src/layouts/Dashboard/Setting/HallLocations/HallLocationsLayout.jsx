import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddHallLocations, HallLocations } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const HallLocationsLayout = () => {
             const { t, i18n } = useTranslation();
  
  const [update, setUpdate] = useState(false)
  return (
    <>
      <TitlePage text={t('Add Hall Location')} />
      <AddHallLocations update={update} setUpdate={setUpdate} />
      <TitleSection text={t('Hall Location Table')} />
      <HallLocations refetch={update} />
    </>
  )
}

export default HallLocationsLayout;