import React, { useState } from 'react'
import { AddScheduleTimeSection, ScheduleTimePage } from '../../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../../Components/Components'

const ScheduleTimeLayout = () => {
       const [update, setUpdate] = useState(false)
       return (
              <>
                     <TitlePage text={'Add Schedule Time'} />
                     <AddScheduleTimeSection update={update} setUpdate={setUpdate}/>
                     <TitleSection text={'Schedule Time Table'} />
                     <ScheduleTimePage refetch={update}/>
              </>
       )
}

export default ScheduleTimeLayout;