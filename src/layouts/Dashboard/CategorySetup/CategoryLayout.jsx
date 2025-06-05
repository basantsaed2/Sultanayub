import React, { useState } from 'react'
import { AddCategorySection, CategoryPage } from '../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';

const CategoryLayout = () => {
  const [update, setUpdate] = useState(false)
             const { t, i18n } = useTranslation();
  
  return (
    <>
      <TitlePage text={t('AddNewCategory')} />
      <AddCategorySection update={update} setUpdate={setUpdate} />
      <TitleSection text={t('CategoryTable')} />
      <CategoryPage refetch={update} setUpdate={setUpdate} />
    </>
  )
}

export default CategoryLayout