import React from 'react'
import { AddButton, TitleSection } from '../../../Components/Components'
import { ProductPage } from '../../../Pages/Pages'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const ProductLayout = () => {
       const navigate = useNavigate()
                  const { t, i18n } = useTranslation();
       
       return (
              <div className="flex flex-col items-start w-full gap-y-3">
                     <div className='mt-4 sm:w-full lg:w-52'>
                            <AddButton
                                   Text={t('AddProduct')}
                                   isWidth={true}
                                   handleClick={() => navigate('add', { replace: true })}
                            />
                     </div>
                     <TitleSection text={t('ProductTable')} />
                     <ProductPage />
              </div>
       )
}

export default ProductLayout