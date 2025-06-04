import React, { useEffect, useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddRoleSection, RolesPage } from '../../../../Pages/Pages'
import AddButton from '../../../../Components/Buttons/AddButton'
import { Link } from 'react-router-dom'

const RolesLayout = () => {
  const [update, setUpdate] = useState(false)
  return (
    <>
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className='w-full md:w-1/2'>
          <TitlePage text={'Roles Table'} />
        </div>
        <div className='w-full md:w-1/2 flex justify-end py-4'>
          <Link to='add'>
            <AddButton Text='Add New Role' />
          </Link>
        </div>
      </div>
      <RolesPage update={update} setUpdate={setUpdate} />
    </>
  )
}

export default RolesLayout;