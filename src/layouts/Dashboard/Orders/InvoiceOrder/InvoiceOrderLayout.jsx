import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { InvoiceOrdersPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const InvoiceOrderLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('OrderInvoice')} />
                     {/* <AddPaymentMethodSection /> */}
                     {/* <TitleSection text={'Payment Methods Table'} /> */}
                     <InvoiceOrdersPage />
              </>
       )
}

export default InvoiceOrderLayout