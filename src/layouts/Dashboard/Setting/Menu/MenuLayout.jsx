import React, { useState } from 'react'
import { AddMenuPage, MenuPage } from '../../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { useTranslation } from 'react-i18next';

const MenuLayout = () => {
       const [update, setUpdate] = useState(false)
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('AddMenu')} />
                     <AddMenuPage update={update} setUpdate={setUpdate}/>
                     <TitleSection text={t('MenuTable')} />
                     <MenuPage refetch={update}/>
              </>
       )
}

export default MenuLayout