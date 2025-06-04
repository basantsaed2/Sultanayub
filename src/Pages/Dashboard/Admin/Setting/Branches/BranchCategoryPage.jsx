import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGet } from '../../../../../Hooks/useGet';
import { useChangeState } from '../../../../../Hooks/useChangeState';
import { useDelete } from '../../../../../Hooks/useDelete';
import { StaticLoader, Switch } from '../../../../../Components/Components';
import { DeleteIcon, EditIcon } from '../../../../../Assets/Icons/AllIcons';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Warning from '../../../../../Assets/Icons/AnotherIcons/WarningIcon';
import { useNavigate, useParams } from 'react-router-dom';

const BranchCategoryPage = ({ refetch }) => {
       const { branchId } = useParams();
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { refetch: refetchBranchProduct, loading: loadingBranchProduct, data: dataBranchProduct} = useGet({url: `${apiUrl}/admin/branch/branch_product/${branchId}` });
       const { refetch: refetchBranchOption, loading: loadingBranchOption, data: dataBranchOption} = useGet({url: `${apiUrl}/admin/branch/branch_options/${branchId}` });
       
       const [branchProduct, setBranchProduct] = useState([]);
       const [branchCategory, setBranchCategory] = useState([]);
       const [branchOption, setBranchOption] = useState([]);

       const { changeState:changeStateProduct , loadingChange:loadingChangeProduct, responseChange:responseChangeProduct } = useChangeState();
       const { changeState:changeStateCategory , loadingChange:loadingChangeCategory, responseChange:responseChangeCategory } = useChangeState();
       const { changeState:changeStateOptions , loadingChange:loadingChangeOptions , responseChange:responseChangeOptions } = useChangeState();

       const [branches, setBranches] = useState([]);


       const [currentPage, setCurrentPage] = useState(1); // Track the current page
       const branchesPerPage = 20; // Limit to 20 branches per page

       // Calculate total number of pages
       const totalPages = Math.ceil(branchCategory.length / branchesPerPage);

       // Get the branches for the current page
       const currentBranches = branchCategory.slice(
              (currentPage - 1) * branchesPerPage,
              currentPage * branchesPerPage
       );

       // handle page change
       const handlePageChange = (pageNumber) => {
              setCurrentPage(pageNumber);
       };

       useEffect(() => {
        refetchBranchProduct();
        refetchBranchOption();
       }, [refetchBranchProduct,refetchBranchOption, refetch]);

       useEffect(() => {
        if (dataBranchProduct && dataBranchProduct.products && dataBranchProduct.categories) {
            setBranchProduct(dataBranchProduct.products);
            setBranchCategory(dataBranchProduct.categories);
        }
        console.log('dataBranches', dataBranchProduct)
    }, [dataBranchProduct]); // Only run this effect when `data` changes

    useEffect(() => {
        if (dataBranchOption && dataBranchOption.variations) {
            setBranchOption(dataBranchOption.variations);
        }
        console.log('dataBranchOption', dataBranchOption)
    }, [dataBranchOption]); // Only run this effect when `data` changes

    // Change Product status 
    const handleChangeProductStaus = async (id, name, status) => {
        const response = await changeStateProduct(
            `${apiUrl}/admin/branch/branch_product_status/${id}`,
            `${name} Changed Status.`,
            { status ,branch_id:branchId } // Pass status as an object if changeState expects an object
        );

     if (response) {
            setBranchProduct((prevBranchProduct) =>
                  prevBranchProduct.map((branch) =>
                          branch.id === id ? { ...branch, status: status } : branch
                   )
            );
     }

    }

    // Change Category status 
    const handleChangeCategoryStaus = async (id, name, status) => {
        const response = await changeStateCategory(
               `${apiUrl}/admin/branch/branch_category_status/${id}`,
               `${name} Changed Status.`,
               { status ,branch_id:branchId } // Pass status as an object if changeState expects an object
        );

        if (response) {
               setBranchCategory((prevBranchCategory) =>
                    prevBranchCategory.map((branch) =>
                             branch.id === id ? { ...branch, status: status } : branch
                      )
               );
        }

    }

    // Change Product status 
    const handleChangeOptionStaus = async (id, name, status) => {
        const response = await changeStateOptions(
               `${apiUrl}/admin/branch/branch_option_status/${id}`,
               `${name} Changed Status.`,
               { status } // Pass status as an object if changeState expects an object
        );

        if (response) {
               setBranchOption((prevOption) =>
                    prevOption.map((branch) =>
                             branch.id === id ? { ...branch, status: status } : branch
                      )
               );
        }

    }

       const headers = ['#','Image','Name','Category Products', 'Status',];

       return (
              <div className="w-full pb-28 flex items-start justify-start overflow-x-scroll scrollSection">
                     {loadingBranchProduct || loadingBranchOption  ? (
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
                                                 {branchCategory.length === 0 ? (
                                                        <tr>
                                                               <td colSpan={12} className='text-center text-xl text-mainColor font-TextFontMedium  '>Not find Categories</td>
                                                        </tr>
                                                 ) : (
                                                        currentBranches.map((branch, index) => ( // Example with two rows
                                                               <tr className="w-full border-b-2" key={index}>
                                                                      <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             {(currentPage - 1) * branchesPerPage + index + 1}
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             <div className="flex justify-center">
                                                                                    <img src={branch.image_link}
                                                                                           className="bg-mainColor border-2 border-mainColor rounded-full min-w-14 min-h-14 max-w-14 max-h-14"
                                                                                           loading="lazy"
                                                                                           alt="Photo"
                                                                                    />
                                                                             </div>
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             {branch?.name || '-'}
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                                                                             <Link to={`/dashboard/branches/branch_category/${branchId}/category_product/${branch.id}`} className='text-mainColor text-xl border-b-2 border-mainColor font-TextFontSemiBold cursor-pointer'>
                                                                                    View
                                                                             </Link>
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             <Switch
                                                                                    checked={branch.status === 1}
                                                                                    handleClick={() => {
                                                                                           handleChangeCategoryStaus(branch.id, branch.name, branch.status === 1 ? 0 : 1);
                                                                                    }}
                                                                             />
                                                                      </td>
                                                               </tr>
                                                        ))

                                                 )}
                                          </tbody>
                                   </table>
                                   {branchCategory.length > 0 && (
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

export default BranchCategoryPage;
