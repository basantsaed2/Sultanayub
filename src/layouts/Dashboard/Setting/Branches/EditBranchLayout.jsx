import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { EditBranchPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditBranchLayout = () => {
                         const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditBranch')} />
                     <EditBranchPage />
              </>
       )
}

export default EditBranchLayout