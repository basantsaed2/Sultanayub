import React from 'react'
import { TitlePage } from '../../../../Components/Components'
import { EditScheduleTimePage } from '../../../../Pages/Pages'

const EditScheduleTimeLayout = () => {
       return (
              <>
                     <TitlePage text={'Edit Schedule Time'} />
                     <EditScheduleTimePage />
              </>
       )
}

export default EditScheduleTimeLayout;