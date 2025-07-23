import { TitlePage } from '../../../../Components/Components'
import { DetailsOrdersPage } from '../../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const DetailsOrderLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('DetailsOrder')} />
                     {/* <AddPaymentMethodSection /> */}
                     {/* <TitleSection text={'Payment Methods Table'} /> */}
                     <DetailsOrdersPage />
              </>
       )
}

export default DetailsOrderLayout