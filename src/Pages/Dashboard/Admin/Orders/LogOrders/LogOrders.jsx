import { useEffect, useState } from "react";
import axios from "axios";

const LogOrders = ({ orderId }) => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = ["SL", "Admin Name", "Date", "From-Status", "To-Status"];

  useEffect(() => {
    axios({
      method: "post",
      url: `https://sultanayubbcknd.food2go.online/admin/order/log?order_id=25`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 136|oxbdg9QVDeaeSETkO9y1Rurk1mZZFE3ywuZaTLMM0b11e7e1",
      },
    })
      .then((res) => {
        console.log("✅ Success:", res.data);
        setLogData(res.data.log_order || []); 
        setLoading(false);
      })
      .catch((err) => {
        console.log("❌ Error:", err);
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className="w-full overflow-x-auto py-6">
      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2">
              {headers.map((name, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-mainColor text-center text-sm lg:text-base"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logData.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-4 text-gray-500"
                >
                  No logs found.
                </td>
              </tr>
            ) : (
              logData.map((log, index) => (
                <tr key={log.id} className="border-b">
                  <td className="text-center px-4 py-2">{index + 1}</td>
                  <td className="text-center px-4 py-2">{log.admin?.name || "N/A"}</td>
                  <td className="text-center px-4 py-2">
                    {log.date ? new Date(log.date).toLocaleString() : "-"}
                  </td>
                  <td className="text-center px-4 py-2">{log.from_status}</td>
                  <td className="text-center px-4 py-2">{log.to_status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LogOrders;
