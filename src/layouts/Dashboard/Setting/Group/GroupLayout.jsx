import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddGroupPage, GroupPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const GroupLayout = () => {
  const [update, setUpdate] = useState(false)
             const { t, i18n } = useTranslation();
  
  return (
    <>
      <TitlePage text={t('AddNewGroup')} />
      <AddGroupPage update={update} setUpdate={setUpdate} />
      <TitleSection text={t('GroupsTable')} />
      <GroupPage refetch={update} />
    </>
  )
}

export default GroupLayout;