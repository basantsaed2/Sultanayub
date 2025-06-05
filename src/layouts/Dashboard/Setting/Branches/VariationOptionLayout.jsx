import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { VariationOptionPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const VariationOptionLayout = () => {
                  const { t, i18n } = useTranslation();
       
       const [update, setUpdate] = useState(false)
       return (
              <>
                     <TitlePage text={t('VariationOptions')} />
                     <VariationOptionPage refetch={update} />
              </>
       )
}

export default VariationOptionLayout;