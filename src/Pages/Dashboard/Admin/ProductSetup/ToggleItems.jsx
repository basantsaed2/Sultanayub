import { useEffect, useState } from "react";
import axios from "axios";

export default function ToggleItems({ id }) {
  console.log("المنتج الحالي هو:", id);
  const [branches, setBranches] = useState([]);
  const [branchProductStatus, setBranchProductStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="text-red-600 text-center p-4">
        Token not found. Please log in.
      </div>
    );
  }

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `https://sultanayubbcknd.food2go.online/admin/branch/branch_in_product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.branches) {
          setBranches(response.data.branches);

          // Initialize statuses from localStorage or API response
          const initialStatuses = {};
          response.data.branches.forEach((branch) => {
            const storedStatus = localStorage.getItem(
              `productStatus-${id}-${branch.id}`
            );
            initialStatuses[branch.id] =
              storedStatus !== null
                ? parseInt(storedStatus, 10)
                : branch.product_status;
          });

          setBranchProductStatus(initialStatuses);
          setLoading(false);
        } else {
          setError("Unexpected response structure.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Branch fetch error:", error);
        setError("Failed to fetch branches.");
        setLoading(false);
      }
    };

    fetchBranches();
  }, [token, id]);

  const toggleProductStatus = async (branch_id) => {
    const currentStatus = branchProductStatus[branch_id] || 0;
    const newStatus = currentStatus ? 0 : 1;

    try {
      await axios.put(
        `https://sultanayubbcknd.food2go.online/admin/branch/branch_product_status/${id}`,
        { branch_id, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBranchProductStatus((prev) => ({
        ...prev,
        [branch_id]: newStatus,
      }));

      // Store the new status in localStorage
      localStorage.setItem(`productStatus-${id}-${branch_id}`, String(newStatus));
    } catch (error) {
      console.error("Toggle error:", error);
      alert(`Error updating status: ${error.response?.status || "Unknown"}`);
    }
  };

  if (loading)
    return (
      <div className="text-center p-6 text-mainColor">Loading branches...</div>
    );
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;
  if (branches.length === 0)
    return <div className="p-6 text-center">No branches found.</div>;

  return (
    <div className="p-6 font-TextFontRegular">
      <h2 className="text-2xl text-mainColor font-bold mb-4 border-b border-gray-300 pb-2">
        Branch Product Control
      </h2>
      <p className="text-sm text-gray-600 mb-6">Total branches: {branches.length}</p>
      <ul className="space-y-4">
        {branches.map((branch) => {
          const status = branchProductStatus[branch.id] || 0;
          return (
            <li
              key={branch.id}
              className="flex justify-between items-center bg-white border rounded-lg shadow-sm px-6 py-4"
            >
              <span className="text-mainColor font-medium text-lg">{branch.name}</span>
              <button
                onClick={() => toggleProductStatus(branch.id)}
                className={`px-5 py-2 rounded-md font-bold text-white transition duration-300 ${
                  status ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {status ? "ON" : "OFF"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
