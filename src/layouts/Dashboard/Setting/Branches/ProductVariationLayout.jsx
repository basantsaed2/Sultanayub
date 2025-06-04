import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { ProductVariationPage } from '../../../../Pages/Pages'

const ProductVariationLayout = () => {
       const [update, setUpdate] = useState(false)
       return (
              <>
                     <TitlePage text={'Products Variation'} />
                     <ProductVariationPage refetch={update} />
              </>
       )
}

export default ProductVariationLayout;