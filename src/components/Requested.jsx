import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin3Line } from "react-icons/ri";
import toast from "react-hot-toast";

const Requested = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}user/pending-plan-requests`, 
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          }
        );
        if (response.data.success) {
          setRequests(response.data.pendingRequests);
          setFilteredRequests(response.data.pendingRequests);
        } else {
          setError("Failed to fetch pending requests.");
        }
      } catch (err) {
        setError("Error fetching pending requests. Please try again.");
        // Handle unauthorized access or token expiration
        if (err.response && err.response.status === 401) {
          // Redirect to login or clear token
          localStorage.removeItem('adminToken');
          // Optionally redirect to admin login page
          // window.location.href = '/admin/login';
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if admin token exists
    if (adminToken) {
      fetchPendingRequests();
    } else {
      setError("No admin token found. Please log in.");
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    let result = [...requests];

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(request => {
        const fullName = `${request.userData.firstName || ''} ${request.userData.lastName || ''}`.toLowerCase();
        const phone = (request.userData.phone || '').toLowerCase();
        return fullName.includes(lowerSearchTerm) || phone.includes(lowerSearchTerm);
      });
    }

    setFilteredRequests(result);
  }, [searchTerm, requests]);

  const handleProcessRequest = async (requestId, status, rejectionReason = "") => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}user/process-plan-request`,
        { requestId, status, rejectionReason },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );

      if (response.data.success) {
        setRequests(requests.filter(request => request._id !== requestId));
        setFilteredRequests(filteredRequests.filter(request => request._id !== requestId));
        
        toast.success(`Request ${status} successfully`);
      } else {
        toast.error("Failed to process the request.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('adminToken');
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("An error occurred while processing the request.");
      }
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col bg-black text-white">
      <main className="flex-1 p-4 sm:p-6">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f6dd3]">Pending Plan Requests</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {filteredRequests.length} pending requests</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full sm:w-64 bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg">
          <table className="w-full table-auto rounded-lg shadow-md min-w-[1000px]">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Request Type</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">First Name</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Last Name</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Email</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Phone</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Plan Price</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-700">
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm capitalize">
                    {request.type.replace('_', ' ')}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {request.userData.firstName || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {request.userData.lastName || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {request.userData.email || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    {request.userData.phone || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    ${request.planData.price || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-xs"
                        onClick={() => handleProcessRequest(request._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs"
                        onClick={() => {
                          const reason = prompt("Please provide a reason for rejection:");
                          if (reason) {
                            handleProcessRequest(request._id, "rejected", reason);
                          }
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">
              No pending requests found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Requested;