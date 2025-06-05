import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddBranchSection, BranchesPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const BranchesLayout = () => {
       const [update, setUpdate] = useState(false)
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('AddNewBranch')} />
                     <AddBranchSection update={update} setUpdate={setUpdate} />
                     <TitleSection text={t('BranchesTable')} />
                     <BranchesPage refetch={update} />
              </>
       )
}

export default BranchesLayout