import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../Components/Components'
import { AddAddonsSection, AddonsPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const AddonsLayout = () => {
       const [update, setUpdate] = useState(false)
       const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('AddNewAddons')} />
                     <AddAddonsSection update={update} setUpdate={setUpdate} />
                     <TitleSection text={typeof('AddonsTable')} />
                     <AddonsPage refetch={update} />
              </>
       )
}

export default AddonsLayout