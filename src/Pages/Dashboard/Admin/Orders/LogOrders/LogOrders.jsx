import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const LogOrders = () => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
                 const {  t,i18n } = useTranslation();

  const headers = ["SL", "Admin Name", "Date", "From-Status", "To-Status"];

  const fetchLogs = (id) => {
    if (!id) return;
    
    setLoading(true);
    axios({
      method: "post",
      url: `https://sultanayubbcknd.food2go.online/admin/order/log?order_id=${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 136|oxbdg9QVDeaeSETkO9y1Rurk1mZZFE3ywuZaTLMM0b11e7e1",
      },
    })
      .then((res) => {
        setLogData(res.data.log_order || []);
      })
      .catch((err) => {
        console.log("Error:", err);
        setLogData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(orderId);
  };

  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setShowAdminModal(true);
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
  };

  return (
    <div className="w-full py-6">
      <div className="max-w-md mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder={t("EnterOrderID")}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-mainColor"
          />
          <button
            type=
            className="px-4 py-2 text-white rounded bg-mainColor hover:bg-gray-700"
          >
                        {t("Search")}

          </button>
        </form>
      </div>

      <div className="w-full overflow-x-auto">
        {loading ? (
          <p className="text-lg text-center text-gray-500">{t('Loading')}</p>
        ) : logData.length === 0 ? (
          <p className="text-center text-gray-500">
            {orderId ? t("NologsfoundforthisorderID") : t("EnteranorderIDtosearch")}
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                {headers.map((name, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-sm text-center text-mainColor lg:text-base"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logData.map((log, index) => (
                <tr key={log.id} className="border-b">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td 
                    className="px-4 py-2 text-center text-blue-500 cursor-pointer hover:underline"
                    onClick={() => handleAdminClick(log.admin)}
                  >
                    {log.admin?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {log.date ? new Date(log.date).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">{log.from_status}</td>
                  <td className="px-4 py-2 text-center">{log.to_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Admin Details Modal */}
      {showAdminModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{t("AdminDetails")}</h3>
              <button 
                onClick={closeAdminModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
                <p><span className="font-semibold">{t("Name")}:</span> {selectedAdmin.name}</p>
              <p><span className="font-semibold">{t('Email')}:</span> {selectedAdmin.email}</p>
              <p><span className="font-semibold">{t("Phone")}:</span> {selectedAdmin.phone}</p>
              <p><span className="font-semibold">{t("Role")}:</span> {selectedAdmin.role}</p>
              <p><span className="font-semibold">{t("Status")}:</span> {selectedAdmin.status === 1 ? t("Active") : t("Inactive")}</p>
              
              {selectedAdmin.image && (
                <div>
                  <span className="font-semibold">{t("Image")}:</span>
                  <img 
                    src={`${selectedAdmin.image_link}/${selectedAdmin.image}`} 
                    alt="Admin" 
                    className="mt-2 max-h-40"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogOrders;