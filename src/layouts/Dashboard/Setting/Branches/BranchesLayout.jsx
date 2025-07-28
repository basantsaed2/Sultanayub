import React, { useState } from 'react'
import { AddButton, TitlePage, TitleSection } from '../../../../Components/Components'
import { AddBranchSection, BranchesPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const BranchesLayout = () => {
       const [update, setUpdate] = useState(false)
       const { t, i18n } = useTranslation();
       const navigate= useNavigate();

       return (
              <div className='flex flex-col gap-3' >
                     <div className='flex justify-between mt-5'>
                            <TitleSection text={t('BranchesTable')} />
                            <AddButton handleClick={()=>navigate("add")}/>
                     </div>
                     <BranchesPage refetch={update} />
              </div>
       )
}

export default BranchesLayout