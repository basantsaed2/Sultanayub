import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';
import { AddCaptianOrder } from '../../../Pages/Pages';

const AddCaptianOrderLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('Add Captain Order')} />
                     <AddCaptianOrder />
              </>
       )
}

export default AddCaptianOrderLayout;