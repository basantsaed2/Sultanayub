import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { VariationOptionPage } from '../../../../Pages/Pages'

const VariationOptionLayout = () => {
       const [update, setUpdate] = useState(false)
       return (
              <>
                     <TitlePage text={'Variation Options'} />
                     <VariationOptionPage refetch={update} />
              </>
       )
}

export default VariationOptionLayout;