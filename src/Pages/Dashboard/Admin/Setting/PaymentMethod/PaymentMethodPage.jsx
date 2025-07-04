import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGet } from '../../../../../Hooks/useGet';
import { useChangeState } from '../../../../../Hooks/useChangeState';
import { useDelete } from '../../../../../Hooks/useDelete';
import { StaticLoader, Switch } from '../../../../../Components/Components';
import { DeleteIcon, EditIcon } from '../../../../../Assets/Icons/AllIcons';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Warning from '../../../../../Assets/Icons/AnotherIcons/WarningIcon';
import { useTranslation } from "react-i18next";

const PaymentMethodPage = ({ refetch }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchPaymentMethods, loading: loadingPaymentMethods, data: dataPaymentMethods } = useGet({
    url: `${apiUrl}/admin/settings/payment_methods`
  });
  const { changeState, loadingChange, responseChange } = useChangeState();
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [paymentMethods, setPaymentMethods] = useState([]);
                 const {  t,i18n } = useTranslation();

  const [openDelete, setOpenDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const paymentMethodsPerPage = 20; // Limit to 20 paymentMethods per page

  // Calculate total number of pages
  const totalPages = Math.ceil(paymentMethods.length / paymentMethodsPerPage);

  // Get the paymentMethods for the current page
  const currentPaymentMethods = paymentMethods.slice(
    (currentPage - 1) * paymentMethodsPerPage,
    currentPage * paymentMethodsPerPage
  );

  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch categories when the component mounts or when refetch is called
  useEffect(() => {
    refetchPaymentMethods();
  }, [refetchPaymentMethods, refetch]); // Empty dependency array to only call refetch once on mount


  // Change paymentMethod status 
  const handleChangeStaus = async (id, name, status) => {
    const response = await changeState(
      `${apiUrl}/admin/settings/payment_methods/status/${id}`,
      `${name} Changed Status.`,
      { status } // Pass status as an object if changeState expects an object
    );

    if (response) {
      setPaymentMethods((prevPaymentMethods) =>
        prevPaymentMethods.map((paymentMethod) =>
          paymentMethod.id === id ? { ...paymentMethod, status: status } : paymentMethod
        )
      );
    }


    // Log the updated categories after the state update
    setPaymentMethods((prevPaymentMethods) => {
      const updatedPaymentMethod = prevPaymentMethods.map((paymentMthod) =>
        paymentMthod.id === id ? { ...paymentMthod, status: status } : paymentMthod
      );
      console.log('Updated Payment Method:', updatedPaymentMethod);
      return updatedPaymentMethod;
    });
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };
  const handleCloseDelete = () => {
    setOpenDelete(null);
  };


  // Delete payment Method
  const handleDelete = async (id, name) => {
    const success = await deleteData(`${apiUrl}/admin/settings/payment_methods/delete/${id}`, `${name} Deleted Success.`);

    if (success) {
      // Update categories only if changeState succeeded
      setPaymentMethods(
        paymentMethods.filter((paymentMethod) =>
          paymentMethod.id !== id
        )
      );
    }
    console.log('payment Methods', paymentMethods)
  };

  // Update categories when `data` changes
  useEffect(() => {
    if (dataPaymentMethods && dataPaymentMethods.payment_methods) {
      setPaymentMethods(dataPaymentMethods.payment_methods);
    }
    console.log('dataPaymentMethods', dataPaymentMethods)
  }, [dataPaymentMethods]); // Only run this effect when `data` changes



  const headers = ['#', t('Name'), t("Image"), t('Description'), t('Status'), t('Action')];

  return (
    <div className="flex items-start justify-start w-full overflow-x-scroll pb-28 scrollSection">
      {loadingPaymentMethods || loadingChange || loadingDelete ? (
        <div className='w-full mt-40'>
          <StaticLoader />
        </div>
      ) : (
        <div className='flex flex-col w-full'>
          <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
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
              {paymentMethods.length === 0 ? (
                <tr>
                  <td colSpan={12} className='text-xl text-center text-mainColor font-TextFontMedium '>{t("NotfindPaymentMethods")}</td>
                </tr>
              ) : (


                currentPaymentMethods.map((paymentMethod, index) => ( // Example with two rows
                  <tr className="w-full border-b-2" key={index}>
                    <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {(currentPage - 1) * paymentMethodsPerPage + index + 1}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {paymentMethod.name}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 overflow-hidden">
                      <div className="flex justify-center">
                        <img src={paymentMethod.logo_link}
                          className="rounded-full bg-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                          alt="Photo"
                        />
                      </div>
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {paymentMethod.description}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <Switch
                        checked={paymentMethod.status === 1}
                        handleClick={() => {
                          handleChangeStaus(paymentMethod.id, paymentMethod.name, paymentMethod.status === 1 ? 0 : 1);
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`edit/${paymentMethod.id}`}  ><EditIcon /></Link>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(paymentMethod.id)}
                        >
                          <DeleteIcon />
                        </button>
                        {openDelete === paymentMethod.id && (
                          <Dialog
                            open={true}
                            onClose={handleCloseDelete}
                            className="relative z-10"
                          >
                            <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                              <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                                  <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                                    <Warning
                                      width="28"
                                      height="28"
                                      aria-hidden="true"
                                    />
                                    <div className="flex items-center">
                                      <div className="mt-2 text-center">
                                        {t("YouwilldeletePaymentMethod")} {paymentMethod?.name || "-"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto" onClick={() => handleDelete(paymentMethod.id, paymentMethod.name)}>
                                      {t("Delete")}
                                    </button>

                                    <button
                                      type="button"
                                      data-autofocus
                                      onClick={handleCloseDelete}
                                      className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                                    >
                                      {t("Cancel")}
                                    </button>
                                  </div>
                                </DialogPanel>
                              </div>
                            </div>
                          </Dialog>
                        )}
                      </div>
                    </td>
                  </tr>
                ))

              )}
            </tbody>
          </table>

          {paymentMethods.length > 0 && (
            <div className="flex flex-wrap items-center justify-center my-6 gap-x-4">
              {currentPage !== 1 && (
                <button type='button' className='px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium' onClick={() => setCurrentPage(currentPage - 1)}>{t("Prev")}</button>
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
                <button type='button' className='px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium' onClick={() => setCurrentPage(currentPage + 1)}>{t("Next")}</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodPage;
