import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGet } from '../../../../../Hooks/useGet';
import { useChangeState } from '../../../../../Hooks/useChangeState';
import { StaticLoader, Switch } from '../../../../../Components/Components';

const CategoryProductPage = ({ refetch }) => {
  const { branchId, productId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Fetch branch products (and categories) from API
  const { refetch: refetchBranchProduct, loading: loadingBranchProduct, data: dataBranchProduct } = useGet({
    url: `${apiUrl}/admin/branch/branch_product/${branchId}`
  });

  const { changeState: changeStateProduct, loadingChange: loadingChangeProduct } = useChangeState();
  
  // State for branch products and filtered products for this category
  const [branchProduct, setBranchProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // Fetch branch products on mount and when refetch is triggered
  useEffect(() => {
    refetchBranchProduct();
  }, [refetchBranchProduct, refetch]);

  // Set branch products once the data is fetched
  useEffect(() => {
    if (dataBranchProduct && dataBranchProduct.products) {
      setBranchProduct(dataBranchProduct.products);
    }
  }, [dataBranchProduct]);

  // Filter products based on the category id from URL (productId)
  useEffect(() => {
    if (branchProduct.length > 0 && productId) {
      const filtered = branchProduct.filter(
        product => product.category_id === parseInt(productId, 10)
      );
      setFilteredProducts(filtered);
      setCurrentPage(1); // reset page when filter changes
    }
  }, [branchProduct, productId]);

  // Handler for page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handler to change product status (example)
  const handleChangeProductStatus = async (id, name, status) => {
    const response = await changeStateProduct(
      `${apiUrl}/admin/branch/branch_product_status/${id}`,
      `${name} Changed Status.`,
      { status, branch_id: branchId }
    );
    if (response) {
      setBranchProduct(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, status } : product
        )
      );
    }
  };

 
    const headers = ['#','Image', 'Name','Product variations', 'Status',];
 
     return (
               <div className="w-full pb-28 flex items-start justify-start overflow-x-scroll scrollSection">
                      {loadingBranchProduct || loadingChangeProduct  ? (
                             <div className='w-full mt-40'>
                                    <StaticLoader />
                             </div>
                ) : (
        <div className="w-full sm:min-w-0 block overflow-x-scroll scrollSection border-collapse">
            <table className="w-full sm:min-w-0">
                    <thead className="w-full">
                            <tr className="w-full border-b-2">
                                    {headers.map((name, index) => (
                                        <th className="min-w-[120px] sm:w-[8%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3" key={index}>
                                                {name}
                                        </th>
                                    ))}
                            </tr>
                    </thead>
                    <tbody className="w-full">
                            {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} className='text-center text-xl text-mainColor font-TextFontMedium  '>Not find Products</td>
                                    </tr>
                            ) : (
                                currentProducts.map((product, index) => ( // Example with two rows
                                        <tr className="w-full border-b-2" key={index}>
                                                <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                        {(currentPage - 1) * productsPerPage + index + 1}
                                                </td>
                                                <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                        <div className="flex justify-center">
                                                                <img src={product.image_link}
                                                                    className="bg-mainColor border-2 border-mainColor rounded-full min-w-14 min-h-14 max-w-14 max-h-14"
                                                                    loading="lazy"
                                                                    alt="Photo"
                                                                />
                                                        </div>
                                                </td>
                                                <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                        {product?.name || '-'}
                                                </td>
                                                <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                                                        <Link to={`/dashboard/branches/branch_category/${branchId}/product_variation/${product.id}`} className='text-mainColor text-xl border-b-2 border-mainColor font-TextFontSemiBold cursor-pointer'>
                                                                View
                                                        </Link>
                                                </td>
                                                <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                        <Switch
                                                                checked={product.status === 1}
                                                                handleClick={() => {
                                                                    handleChangeProductStatus(product.id, product.name, product.status === 1 ? 0 : 1);
                                                                }}
                                                        />
                                                </td>
                                        </tr>
                                    ))

                            )}
                    </tbody>
            </table>
            {filteredProducts.length > 0 && (
                    <div className="my-6 flex flex-wrap items-center justify-center gap-x-4">
                            {currentPage !== 1 && (
                                    <button type='button' className='text-lg px-4 py-2 rounded-xl bg-mainColor text-white font-TextFontMedium' onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${currentPage === page ? 'bg-mainColor text-white' : ' text-mainColor'}`}
                                    >
                                        {page}
                                    </button>
                            ))}
                            {totalPages !== currentPage && (
                                    <button type='button' className='text-lg px-4 py-2 rounded-xl bg-mainColor text-white font-TextFontMedium' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            )}
                    </div>
            )}
        </div>
)}
</div>
);
};

export default CategoryProductPage;
