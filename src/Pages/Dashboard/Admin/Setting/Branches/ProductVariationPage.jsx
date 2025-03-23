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

const ProductVariationPage = ({ refetch }) => {
        const { branchId, variationId  } = useParams();
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const { refetch: refetchBranchOption, loading: loadingBranchOption, data: dataBranchOption} = useGet({url: `${apiUrl}/admin/branch/branch_options/${variationId}` });
       
        const [branchOption, setBranchOption] = useState([]);
       const [branches, setBranches] = useState([]);

       const [currentPage, setCurrentPage] = useState(1); // Track the current page
       const branchesPerPage = 20; // Limit to 20 branches per page

       // Calculate total number of pages
       const totalPages = Math.ceil(branchOption.length / branchesPerPage);

       // Get the branches for the current page
       const currentBranches = branchOption.slice(
              (currentPage - 1) * branchesPerPage,
              currentPage * branchesPerPage
       );

       // handle page change
       const handlePageChange = (pageNumber) => {
              setCurrentPage(pageNumber);
       };

       useEffect(() => {
        refetchBranchOption();
       }, [refetchBranchOption, refetch]);

    useEffect(() => {
        if (dataBranchOption && dataBranchOption.variations) {
            setBranchOption(dataBranchOption.variations);
        }
        console.log('dataBranchOption', dataBranchOption)
    }, [dataBranchOption]); // Only run this effect when `data` changes

       const headers = ['#', 'Name','Type','Variation Options',];

       return (
              <div className="w-full pb-28 flex items-start justify-start overflow-x-scroll scrollSection">
                     {loadingBranchOption   ? (
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
                                                 {branchOption.length === 0 ? (
                                                        <tr>
                                                               <td colSpan={12} className='text-center text-xl text-mainColor font-TextFontMedium  '>Not find Variations</td>
                                                        </tr>
                                                 ) : (
                                                        currentBranches.map((branch, index) => ( // Example with two rows
                                                               <tr className="w-full border-b-2" key={index}>
                                                                      <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             {(currentPage - 1) * branchesPerPage + index + 1}
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             {branch?.name || '-'}
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                                                                             {branch?.type || '-'}
                                                                      </td>
                                                                      <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-blue-500 cursor-pointer">
                                                                             <Link to={`/dashboard/branches/branch_category/${branchId}/variation_option/${branch.id}`} className='text-mainColor text-xl border-b-2 border-mainColor font-TextFontSemiBold cursor-pointer'>
                                                                                    View
                                                                             </Link>
                                                                      </td>
                                                               </tr>
                                                        ))

                                                 )}
                                          </tbody>
                                   </table>
                                   {branchOption.length > 0 && (
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

export default ProductVariationPage;
