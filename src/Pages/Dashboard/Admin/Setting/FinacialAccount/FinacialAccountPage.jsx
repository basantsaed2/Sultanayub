import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '../../../../../Hooks/useGet';
import { useChangeState } from '../../../../../Hooks/useChangeState';
import { useDelete } from '../../../../../Hooks/useDelete';
import { AddButton, StaticLoader, Switch, TitleSection } from '../../../../../Components/Components';
import { DeleteIcon, EditIcon } from '../../../../../Assets/Icons/AllIcons';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Warning from '../../../../../Assets/Icons/AnotherIcons/WarningIcon';
import { useTranslation } from "react-i18next";

const FinancialAccountPage = ({ refetch }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchFinancialAccount, loading: loadingFinancialAccount, data: dataFinancialAccount } = useGet({
    url: `${apiUrl}/admin/settings/financial`,
  });
  const { changeState, loadingChange } = useChangeState();
  const { deleteData, loadingDelete } = useDelete();
  const [financialAccounts, setFinancialAccounts] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(null);
  const [openBranchesModal, setOpenBranchesModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const financialAccountsPerPage = 20;

  const totalPages = Math.ceil(financialAccounts.length / financialAccountsPerPage);
  const currentFinancialAccounts = financialAccounts.slice(
    (currentPage - 1) * financialAccountsPerPage,
    currentPage * financialAccountsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    refetchFinancialAccount();
  }, [refetchFinancialAccount, refetch]);

  useEffect(() => {
    if (dataFinancialAccount && dataFinancialAccount.financials) {
      setFinancialAccounts(dataFinancialAccount.financials);
    }
  }, [dataFinancialAccount]);

  const handleChangeStatus = async (id, name, status) => {
    const response = await changeState(
      `${apiUrl}/admin/settings/financial/status/${id}`,
      t('StatusChangedSuccess', { name }),
      { status }
    );
    if (response) {
      setFinancialAccounts((prev) =>
        prev.map((account) =>
          account.id === id ? { ...account, status } : account
        )
      );
    }
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(id);
  };

  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  const handleDelete = async (id, name) => {
    const success = await deleteData(
      `${apiUrl}/admin/settings/financial/delete/${id}`,
      t('DeletedSuccess', { name })
    );
    if (success) {
      setFinancialAccounts(financialAccounts.filter((account) => account.id !== id));
      handleCloseDelete();
    }
  };

  const handleOpenBranchesModal = (account) => {
    setOpenBranchesModal(account);
  };

  const handleCloseBranchesModal = () => {
    setOpenBranchesModal(null);
  };

  const headers = [
    '#',
    t('Name'),
    t('Branches'),
    t('Image'),
    t('Balance'),
    t('Description'),
    t('Status'),
    t('Action'),
  ];

  return (
    <div className="flex items-start justify-start w-full overflow-x-scroll pb-28 scrollSection">
      {loadingFinancialAccount || loadingChange || loadingDelete ? (
        <div className="w-full mt-40">
          <StaticLoader />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-5">
          <div className="flex justify-between mt-5">
            <TitleSection text={t('FinancialAccountTable')} />
            <AddButton handleClick={() => navigate('add')} />
          </div>

          <table className="block w-full overflow-x-scroll sm:min-w-0 scrollPage">
            <thead className="w-full">
              <tr className="w-full border-b-2">
                {headers.map((name, index) => (
                  <th
                    className="min-w-[120px] sm:w-[8%] lg:w-[5%] text-mainColor text-center font-TextFontLight sm:text-sm lg:text-base xl:text-lg pb-3"
                    key={index}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="w-full">
              {financialAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-xl text-center text-mainColor font-TextFontMedium"
                  >
                    {t('NotfindfinancialAccount')}
                  </td>
                </tr>
              ) : (
                currentFinancialAccounts.map((financialAccount, index) => (
                  <tr className="w-full border-b-2" key={index}>
                    <td className="min-w-[80px] sm:min-w-[50px] sm:w-1/12 lg:w-1/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {(currentPage - 1) * financialAccountsPerPage + index + 1}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {financialAccount.name}
                    </td>
                    <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-3 py-1 text-sm font-TextFontMedium text-white bg-mainColor rounded-full hover:bg-opacity-80 transition-colors duration-300"
                        onClick={() => handleOpenBranchesModal(financialAccount)}
                      >
                        {financialAccount.branch.length} {t('Branches')}
                      </button>
                      {openBranchesModal?.id === financialAccount.id && (
                        <Dialog
                          open={true}
                          onClose={handleCloseBranchesModal}
                          className="relative z-20"
                        >
                          <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                          <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                              <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-md">
                                <div className="px-4 pt-5 pb-4 sm:p-6">
                                  <DialogTitle as="h3" className="text-lg font-TextFontSemiBold text-mainColor">
                                    {t('BranchesForAccount', { name: financialAccount.name })}
                                  </DialogTitle>
                                  <div className="mt-4 max-h-64 overflow-y-auto">
                                    {financialAccount.branch.length > 0 ? (
                                      financialAccount.branch.map((branch) => (
                                        <div
                                          key={branch.id}
                                          className="flex flex-col p-3 mb-2 bg-gray-50 rounded-md border border-gray-200"
                                        >
                                          <div className="text-sm font-TextFontMedium text-mainColor">
                                            {t('BranchName')}: {branch.name}
                                          </div>
                                          <div className="text-xs text-gray-900">
                                            {t('Address')}: {branch.address || t('NoAddress')}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-thirdColor">
                                        {t('NoBranches')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="px-4 py-3 sm:px-6">
                                  <button
                                    type="button"
                                    onClick={handleCloseBranchesModal}
                                    className="inline-flex justify-center w-full px-6 py-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:w-auto"
                                  >
                                    {t('Close')}
                                  </button>
                                </div>
                              </DialogPanel>
                            </div>
                          </div>
                        </Dialog>
                      )}
                    </td>
                    <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 overflow-hidden">
                      <div className="flex justify-center">
                        <img
                          src={financialAccount.logo_link}
                          className="rounded-full bg-mainColor min-w-14 min-h-14 max-w-14 max-h-14"
                          alt={t('ImageAlt')}
                        />
                      </div>
                    </td>
                    <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {financialAccount.balance}
                    </td>
                    <td className="min-w-[150px] sm:min-w-[100px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      {financialAccount.details}
                    </td>
                    <td className="min-w-[120px] sm:min-w-[80px] sm:w-2/12 lg:w-2/12 py-2 text-center text-thirdColor text-sm sm:text-base lg:text-lg xl:text-xl overflow-hidden">
                      <Switch
                        checked={financialAccount.status === 1}
                        handleClick={() => {
                          handleChangeStatus(
                            financialAccount.id,
                            financialAccount.name,
                            financialAccount.status === 1 ? 0 : 1
                          );
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`edit/${financialAccount.id}`}>
                          <EditIcon />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(financialAccount.id)}
                        >
                          <DeleteIcon />
                        </button>
                        {openDelete === financialAccount.id && (
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
                                    <Warning width="28" height="28" aria-hidden="true" />
                                    <div className="mt-2 text-center">
                                      {t('YouwilldeletefinancialAccount')} {financialAccount?.name || '-'}
                                    </div>
                                  </div>
                                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                      className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto"
                                      onClick={() => handleDelete(financialAccount.id, financialAccount.name)}
                                    >
                                      {t('Delete')}
                                    </button>
                                    <button
                                      type="button"
                                      data-autofocus
                                      onClick={handleCloseDelete}
                                      className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                                    >
                                      {t('Cancel')}
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

          {financialAccounts.length > 0 && (
            <div className="flex flex-wrap items-center justify-center my-6 gap-x-4">
              {currentPage !== 1 && (
                <button
                  type="button"
                  className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  {t('Prev')}
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 mx-1 text-lg font-TextFontSemiBold rounded-full duration-300 ${
                    currentPage === page ? 'bg-mainColor text-white' : 'text-mainColor'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages !== currentPage && (
                <button
                  type="button"
                  className="px-4 py-2 text-lg text-white rounded-xl bg-mainColor font-TextFontMedium"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {t('Next')}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialAccountPage;