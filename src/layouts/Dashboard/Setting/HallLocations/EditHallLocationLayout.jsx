import React from 'react'
import { EditHallLocations } from '../../../../Pages/Pages'
import { TitlePage } from '../../../../Components/Components'
import { useTranslation } from 'react-i18next';

const EditHallLocationLayout = () => {
                  const { t, i18n } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('Edit Hall')} />
                     <EditHallLocations/>
              </>
       )
}

export default EditHallLocationLayout;