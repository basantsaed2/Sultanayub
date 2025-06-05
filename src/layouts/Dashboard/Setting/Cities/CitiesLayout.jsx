import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddCitySection, CitiesPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const CitiesLayout = () => {
             const { t, i18n } = useTranslation();
  
  const [update, setUpdate] = useState(false)
  return (
    <>
      <TitlePage text={t('AddNewCity')} />
      <AddCitySection update={update} setUpdate={setUpdate} />
      <TitleSection text={t('CitiesTable')} />
      <CitiesPage refetch={update} />
    </>
  )
}

export default CitiesLayout