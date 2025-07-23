import { TitlePage } from '../../../Components/Components'
import { AddProductPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const AddProductLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('AddProduct')} />
                     <AddProductPage />
              </>
       )
}

export default AddProductLayout