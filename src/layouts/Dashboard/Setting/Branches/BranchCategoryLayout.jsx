import React, { useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { BranchCategoryPage } from '../../../../Pages/Pages'

const BranchCategoryLayout = () => {
       const [update, setUpdate] = useState(false)
       return (
              <>
                     <TitleSection text={'Branch Categories'} />
                     <BranchCategoryPage refetch={update} />
              </>
       )
}

export default BranchCategoryLayout