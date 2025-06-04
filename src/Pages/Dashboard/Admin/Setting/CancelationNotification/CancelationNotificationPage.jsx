import React, { useEffect, useState } from 'react';
import { useGet } from '../../../../../Hooks/useGet';
import { usePost } from '../../../../../Hooks/usePostJson';
import { LoaderLogin, Switch } from '../../../../../Components/Components';
import { useChangeState } from '../../../../../Hooks/useChangeState';

const CancelationNotificationPage = () => {
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { refetch: refetchCancelationNotification, loading: loadingCancelationNotification, data: dataCancelationNotification } = useGet({
              url: `${apiUrl}/admin/settings/cancelation_notification`,
       });
       const { changeState, loadingChange, responseChange } = useChangeState();

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
                     'Notification status changed.',
                     { repeated: newStatus } // Ensure payload matches API expectation
              );

              if (response && !response.errors) {
                     setRepeatedNotification(newStatus);
              }
       };


       return (
              <>
                     {loadingChange || loadingCancelationNotification ? (
                            <div className="w-full flex justify-center items-center">
                                   <LoaderLogin />
                            </div>
                     ) : (
                            <section className="w-full flex items-center justify-start gap-y-2">
                                   <div className="flex items-center justify-start gap-x-1">
                                          <Switch
                                                 checked={repeatedNotification === 1}
                                                 handleClick={handleChangeStatus}
                                          />
                                          <span>Repeated Notification {repeatedNotification === 1 ? 'Enabled' : 'Disabled'}</span>
                                   </div>
                            </section>
                     )}
              </>
       );
};

export default CancelationNotificationPage;