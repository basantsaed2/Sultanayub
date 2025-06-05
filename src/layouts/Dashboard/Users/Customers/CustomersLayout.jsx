import React, { useEffect, useState } from 'react'
import { TitlePage, TitleSection } from '../../../../Components/Components'
import { AddCustomersSection, CustomersPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const CustomersLayout = () => {
    const [update, setUpdate] = useState(false)
             const { t, i18n } = useTranslation();

    return (
        <>
            <TitlePage text={t('AddCustomer')} />
            <AddCustomersSection update={update} setUpdate={setUpdate} />
            <TitleSection text={t('CustomerTable')} />
            <CustomersPage update={update} setUpdate={setUpdate} />
        </>
    )
}

export default CustomersLayout
