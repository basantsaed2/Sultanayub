import React from "react";
import { useGet } from "../../../../Hooks/useGet";

const Report = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetchReports, loadingReports, dataReports } = useGet({ url: `${apiUrl}/cashier/reports/cashier_reports` });

    return (
        <>
            Report
        </>
    )
}
export default Report;