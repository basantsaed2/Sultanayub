import React from 'react'
import { BuyOfferPage } from '../../../Pages/Pages'
import { TitlePage } from '../../../Components/Components'
import { useTranslation } from 'react-i18next';

const BuyOfferLayout = () => {
        const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('BuyOffer')} />
                     <BuyOfferPage />
              </>
       )
}

export default BuyOfferLayout