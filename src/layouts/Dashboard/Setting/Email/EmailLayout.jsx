import { useEffect, useState } from "react";
import { TitlePage, TitleSection } from "../../../../Components/Components";
import { useGet } from "../../../../Hooks/useGet";
import EmailPage from "../../../../Pages/Dashboard/Admin/Setting/Email/EmailPage";
import AddEmailSection from "../../../../Pages/Dashboard/Admin/Setting/Email/AddEmailSection";

const EmailLayout = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const {
    data: emailsData,
    loading: loadingEmails,
    refetch: refetchEmails,
  } = useGet({
    url: `${apiUrl}/admin/settings/business_setup/order_delay_notification`,
  });

  const [update, setUpdate] = useState(false);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    refetchEmails();
  }, [refetchEmails, update]);

  useEffect(() => {
    if (emailsData && emailsData.order_notification) {
      setEmails(emailsData.order_notification);
    }
  }, [emailsData]);

  useEffect(() => {
    console.log("emailsData", emailsData);
  }, [emailsData]);

  return (
    <>
      <TitlePage text={"Add New Email"} />
      <AddEmailSection update={update} setUpdate={setUpdate} />
      <TitleSection text={"Emails Table"} />
      <EmailPage
        loadingEmails={loadingEmails}
        emails={emails}
        refetchEmails={refetchEmails}
      />
    </>
  );
};

export default EmailLayout;