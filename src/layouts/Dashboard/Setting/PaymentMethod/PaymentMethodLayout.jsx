import React, { useState } from 'react'
import { AddPaymentMethodSection, PaymentMethodPage } from '../../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { useTranslation } from 'react-i18next';

const PaymentMethodLayout = () => {
       const [update, setUpdate] = useState(false)
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('AddNewPaymentMethod')} />
                     <AddPaymentMethodSection update={update} setUpdate={setUpdate}/>
                     <TitleSection text={t('PaymentMethodsTable')} />
                     <PaymentMethodPage refetch={update}/>
              </>
       )
}

export default PaymentMethodLayout