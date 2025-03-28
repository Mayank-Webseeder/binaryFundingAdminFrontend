import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Requested = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
          const requestsWithStatus = response.data.pendingRequests.map(request => ({
            ...request,
            status: "pending"
          }));
          setRequests(requestsWithStatus);
          setFilteredRequests(requestsWithStatus);
        } else {
          setError("Failed to fetch pending requests.");
        }
      } catch (err) {
        setError("Error fetching pending requests. Please try again.");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('adminToken');
        }
      } finally {
        setLoading(false);
      }
    };

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
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, requests]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

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
        setRequests(requests.map(request => 
          request._id === requestId ? { ...request, status } : request
        ));
        setFilteredRequests(filteredRequests.map(request => 
          request._id === requestId ? { ...request, status } : request
        ));
        
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

  const handleStatusChange = (requestId, newStatus) => {
    if (newStatus === "rejected") {
      const reason = prompt("Please provide a reason for rejection:");
      if (reason) {
        handleProcessRequest(requestId, newStatus, reason);
      }
    } else if (newStatus === "approved") {
      handleProcessRequest(requestId, newStatus);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-400">{error}</div>;
  }

  return (
    <div className="flex flex-col bg-black text-gray-300 mt-10 md:mt-0 lg:mt-0">
      <main className="flex-1 p-3 sm:p-6">
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-blue-400">Pending Plan Requests</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Showing {filteredRequests.length} pending requests</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full sm:w-64 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Per page:</span>
              <select
                className="w-16 bg-gray-700 text-gray-300 border border-gray-700 rounded-md px-1 sm:px-2 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </header>

        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg">
          <table className="w-full table-auto rounded-lg shadow-md min-w-[1000px]">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Request Type</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">First Name</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Last Name</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Email</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Phone</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Plan Price</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((request) => (
                <tr key={request._id} className="border-b border-gray-700">
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300 capitalize">
                    {request.type.replace('_', ' ')}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData.firstName || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData.lastName || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData.email || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData.phone || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    ${request.planData.price || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request._id, e.target.value)}
                      className={`w-24 sm:w-28 bg-gray-700 border border-gray-700 rounded-md px-1 sm:px-2 py-0.5 sm:py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[10px] sm:text-sm ${
                        request.status === 'pending' ? 'text-yellow-500' :
                        request.status === 'approved' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      <option value="pending" className="text-yellow-500">Pending</option>
                      <option value="approved" className="text-green-500">Approved</option>
                      <option value="rejected" className="text-red-500">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentItems.length === 0 && (
            <div className="py-6 text-center text-gray-500 text-xs sm:text-sm">
              No pending requests found.
            </div>
          )}
        </div>

        {/* Pagination  */}
        {filteredRequests.length > 0 && (
          <div className="mt-3 flex justify-end items-center gap-1 sm:gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-600 text-xs sm:text-sm"
            >
              Previous
            </button>
            <span className="text-xs sm:text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-600 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Requested;