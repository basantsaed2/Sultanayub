import React, { useState } from 'react'
import { AddVoidReason, VoidReason } from '../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';

const VoidReasonLayout = () => {
  const [update, setUpdate] = useState(false)
            const { t, i18n } = useTranslation();
 
  return (
    <>
      <TitlePage text={t('Add Void Reason')} />
      <AddVoidReason update={update} setUpdate={setUpdate} />
      <TitleSection text={t('Void Reason Table')} />
      <VoidReason refetch={update} setUpdate={setUpdate} />
    </>
  )
}

export default VoidReasonLayout