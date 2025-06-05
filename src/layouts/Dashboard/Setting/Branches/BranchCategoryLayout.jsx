import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { BranchCategoryPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const BranchCategoryLayout = () => {
       const [update, setUpdate] = useState(false)
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitleSection text={t('BranchCategories')} />
                     <BranchCategoryPage refetch={update} />
              </>
       )
}

export default BranchCategoryLayout