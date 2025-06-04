import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { CategoryProductPage } from '../../../../Pages/Pages'

const CategoryProductLayout = () => {
       const [update, setUpdate] = useState(false)
       return (
              <>
                     <TitlePage text={'Category Products'} />
                     <CategoryProductPage refetch={update} />
              </>
       )
}

export default CategoryProductLayout;