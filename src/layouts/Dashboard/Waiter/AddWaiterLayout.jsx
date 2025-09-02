import React from 'react'
import { TitlePage } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';
import { AddWaiter } from '../../../Pages/Pages';

const AddWaiterLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('Add Waiter')} />
                     <AddWaiter />
              </>
       )
}

export default AddWaiterLayout;