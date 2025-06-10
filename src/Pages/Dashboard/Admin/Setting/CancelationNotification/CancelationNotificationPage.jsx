import React, { useEffect, useState } from 'react';
import { useGet } from '../../../../../Hooks/useGet';
import { usePost } from '../../../../../Hooks/usePostJson';
import { LoaderLogin, Switch } from '../../../../../Components/Components';
import { useChangeState } from '../../../../../Hooks/useChangeState';
import { useTranslation } from "react-i18next";

const CancelationNotificationPage = () => {
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { refetch: refetchCancelationNotification, loading: loadingCancelationNotification, data: dataCancelationNotification } = useGet({
              url: `${apiUrl}/admin/settings/cancelation_notification`,
       });
       const { changeState, loadingChange, responseChange } = useChangeState();
                 const {  t,i18n } = useTranslation();

       const [repeatedNotification, setRepeatedNotification] = useState(0);

       // Fetch data from the API
       useEffect(() => {
              refetchCancelationNotification();
       }, [refetchCancelationNotification]);

       // Update notification state when API data is received
       useEffect(() => {
              if (dataCancelationNotification && dataCancelationNotification.repeated_notification) {
                     setRepeatedNotification(parseInt(dataCancelationNotification.repeated_notification));
                     console.log('Fetched repeated notification from API:', dataCancelationNotification.repeated_notification);
              }
       }, [dataCancelationNotification]);


       const handleChangeStatus = async () => {
              const newStatus = repeatedNotification === 1 ? 0 : 1;
              const response = await changeState(
                     `${apiUrl}/admin/settings/update_cancelation_notification`,
                     t("Notification status changed"),
                     { repeated: newStatus } // Ensure payload matches API expectation
              );

              if (response && !response.errors) {
                     setRepeatedNotification(newStatus);
              }
       };


       return (
              <>
                     {loadingChange || loadingCancelationNotification ? (
                            <div className="flex items-center justify-center w-full">
                                   <LoaderLogin />
                            </div>
                     ) : (
                            <section className="flex items-center justify-start w-full gap-y-2">
                                   <div className="flex items-center justify-start gap-x-1">
                                          <Switch
                                                 checked={repeatedNotification === 1}
                                                 handleClick={handleChangeStatus}
                                          />
                                          <span>{t("Repeated Notification")} {repeatedNotification === 1 ? t('Enabled') : t('Disabled')}</span>
                                   </div>
                            </section>
                     )}
              </>
       );
};

export default CancelationNotificationPage;