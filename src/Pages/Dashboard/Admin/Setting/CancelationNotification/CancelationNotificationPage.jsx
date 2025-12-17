import React, { useEffect, useState, useCallback } from 'react';
import { useGet } from '../../../../../Hooks/useGet';
import { useChangeState } from '../../../../../Hooks/useChangeState';
import { LoaderLogin, StaticLoader, Switch } from '../../../../../Components/Components';
import { useTranslation } from "react-i18next";

// Define the API URL prefix once
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Reusable Component for a Single Setting Toggle ---

/**
 * Renders a single notification setting with a switch control.
 */
const ToggleSetting = ({ labelKey, isChecked, onToggle, isLoading }) => {
       const { t } = useTranslation();
       const statusText = isChecked ? t('Enabled') : t('Disabled');

       return (
              <div className="flex items-center justify-start gap-x-3 p-4 bg-white shadow-md rounded-lg min-w-[300px]">
                     <span className="flex-grow font-medium text-gray-700">{t(labelKey)}:</span>
                     <Switch
                            checked={isChecked}
                            handleClick={onToggle}
                            // Disable the switch while updating to prevent multiple clicks
                            disabled={isLoading}
                     />
                     <span className={`text-sm font-semibold ${isChecked ? 'text-green-600' : 'text-red-600'}`}>
                            ({statusText})
                     </span>
              </div>
       );
};


// --- Main Page Component ---

const CancellationNotificationPage = () => {
       const { t } = useTranslation();
       const { changeState } = useChangeState();

       // 1. Fetching Cancellation Notification Data
       const {
              refetch: refetchCancelationNotification,
              loading: loadingCancelationNotification,
              data: dataCancelationNotification
       } = useGet({
              url: `${API_BASE_URL}/admin/settings/cancelation_notification`,
       });

       // 2. Fetching General Notification Data
       const {
              refetch: refetchNotification,
              loading: loadingNotification,
              data: dataNotification
       } = useGet({
              url: `${API_BASE_URL}/admin/settings/notification`,
       });

       // Separate State Variables for two distinct settings
       const [cancellationRepeated, setCancellationRepeated] = useState(0); // 0 or 1
       const [generalRepeated, setGeneralRepeated] = useState(0); // 0 or 1

       // Loading states for individual state changes/API updates
       const [loadingCancellationChange, setLoadingCancellationChange] = useState(false);
       const [loadingGeneralChange, setLoadingGeneralChange] = useState(false);


       // --- Data Initialization Effect for Cancellation Notification ---
       useEffect(() => {
              if (dataCancelationNotification) {
                     // Ensure state is updated based on API response
                     const repeatedValue = parseInt(dataCancelationNotification.repeated_notification, 10);
                     setCancellationRepeated(repeatedValue === 1 ? 1 : 0);
              }
       }, [dataCancelationNotification]);

       // --- Data Initialization Effect for General Notification ---
       useEffect(() => {
              if (dataNotification) {
                     // Assuming the general notification API also returns a 'repeated_notification' or similar field
                     const repeatedValue = parseInt(dataNotification.repeated_notification || 0, 10);
                     setGeneralRepeated(repeatedValue === 1 ? 1 : 0);
              }
       }, [dataNotification]);


       // --- Initial Data Fetch Effect ---
       useEffect(() => {
              refetchCancelationNotification();
              refetchNotification();
       }, [refetchCancelationNotification, refetchNotification]);


       // --- Generic Status Change Handler (Reusable) ---
       const handleUpdateStatus = useCallback(async (currentStatus, updateUrl, setLoadingState, setLocalState) => {
              setLoadingState(true);
              const newStatus = currentStatus === 1 ? 0 : 1;

              const response = await changeState(
                     updateUrl,
                     t("Notification status changed successfully"),
                     { repeated: newStatus } // Payload based on original code
              );

              if (response && !response.errors) {
                     setLocalState(newStatus);
              } else {
                     // Future enhancement: Add error handling like a toast notification here
              }

              setLoadingState(false);
       }, [changeState, t]);


       // --- Specific Toggle Handlers using the generic function ---

       const handleToggleCancellation = () => {
              handleUpdateStatus(
                     cancellationRepeated,
                     `${API_BASE_URL}/admin/settings/update_cancelation_notification`,
                     setLoadingCancellationChange,
                     setCancellationRepeated
              );
       };

       const handleToggleGeneralNotification = () => {
              handleUpdateStatus(
                     generalRepeated,
                     `${API_BASE_URL}/admin/settings/update_notification`,
                     setLoadingGeneralChange,
                     setGeneralRepeated
              );
       };

       // --- Combined Initial Loading Check ---
       const isInitialLoading = loadingCancelationNotification || loadingNotification;

       return (
              <div className="min-h-screen p-4">
                     {isInitialLoading || loadingCancellationChange || loadingGeneralChange ? (
                            <div className="flex items-center justify-center h-96">
                                   <StaticLoader />
                            </div>
                     ) : (
                            <section className="flex flex-col items-start justify-start w-full max-w-lg gap-y-4">
                                   <ToggleSetting
                                          labelKey={t("Repeated Cancellation Notification")}
                                          isChecked={cancellationRepeated === 1}
                                          onToggle={handleToggleCancellation}
                                          isLoading={loadingCancellationChange}
                                   />

                                   <ToggleSetting
                                          labelKey={t("General Repeated Notification")}
                                          isChecked={generalRepeated === 1}
                                          onToggle={handleToggleGeneralNotification}
                                          isLoading={loadingGeneralChange}
                                   />

                                   <blockquote className="p-3 mt-4 text-sm text-blue-800 bg-blue-100 border-l-4 border-blue-500">
                                          {t("Note: Each setting controls a different type of repeated notification. Changes are saved automatically.")}
                                   </blockquote>
                            </section>
                     )}
              </div>
       );
};

export default CancellationNotificationPage;