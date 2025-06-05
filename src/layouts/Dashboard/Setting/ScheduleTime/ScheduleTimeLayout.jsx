import React, { useState } from 'react'
import { AddScheduleTimeSection, ScheduleTimePage } from '../../../../Pages/Pages'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { useTranslation } from 'react-i18next';

const ScheduleTimeLayout = () => {
       const [update, setUpdate] = useState(false)
                    const { t, i18n } = useTranslation();

       return (
              <>
                     <TitlePage text={t('Add Schedule Time')} />
                     <AddScheduleTimeSection update={update} setUpdate={setUpdate}/>
                     <TitleSection text={t('Schedule Time Table')} />
                     <ScheduleTimePage refetch={update}/>
              </>
       )
}

export default ScheduleTimeLayout;