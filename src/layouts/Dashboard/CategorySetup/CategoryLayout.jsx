import React, { useState } from 'react'
import { AddCategorySection, CategoryPage } from '../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../Context/Auth';

const CategoryLayout = () => {
  const [update, setUpdate] = useState(false)
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const role = auth.userState?.role ? auth.userState?.role : localStorage.getItem("role");

  return (
    <>
      {
        role === "admin" && (
          <>
            <TitlePage text={t('AddNewCategory')} />
            <AddCategorySection update={update} setUpdate={setUpdate} />
          </>
        )
      }
      <TitleSection text={t('CategoryTable')} />
      <CategoryPage refetch={update} setUpdate={setUpdate} />
    </>
  )
}

export default CategoryLayout