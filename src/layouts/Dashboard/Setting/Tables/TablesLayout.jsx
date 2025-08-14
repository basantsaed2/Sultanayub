import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddTablesSection, TablesPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const TablesLayout = () => {
             const { t, i18n } = useTranslation();
  
  const [update, setUpdate] = useState(false)
  return (
    <>
      <TitlePage text={t('Add Hall Table')} />
      <AddTablesSection update={update} setUpdate={setUpdate} />
      <TitleSection text={t('Hall Tables')} />
      <TablesPage refetch={update} />
    </>
  )
}

export default TablesLayout;