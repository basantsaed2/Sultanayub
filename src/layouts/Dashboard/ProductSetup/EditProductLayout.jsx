import { TitlePage } from '../../../Components/Components'
import { EditProductPage } from '../../../Pages/Pages'
import { useTranslation } from 'react-i18next';

const EditProductLayout = () => {
                  const { t } = useTranslation();
       
       return (
              <>
                     <TitlePage text={t('EditProduct')} />
                     <EditProductPage />
              </>
       )
}

export default EditProductLayout