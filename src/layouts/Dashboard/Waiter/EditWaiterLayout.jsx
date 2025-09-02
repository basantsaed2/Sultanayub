import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';
import { EditWaiter } from '../../../Pages/Pages';

const EditWaiterLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('Edit Waiter')} />
                     <EditWaiter />
              </>
       )
}

export default EditWaiterLayout;