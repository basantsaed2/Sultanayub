import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';
import { EditCaptianOrder } from '../../../Pages/Pages';

const EditCaptianOrderLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('Edit Captain Order')} />
                     <EditCaptianOrder />
              </>
       )
}

export default EditCaptianOrderLayout;