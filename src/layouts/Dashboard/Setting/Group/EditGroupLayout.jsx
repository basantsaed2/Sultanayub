import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { EditGroupPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditGroupLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditGroup')} />
                     <EditGroupPage />
              </>
       )
}

export default EditGroupLayout;