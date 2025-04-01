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
  const [previewImage, setPreviewImage] = useState(null); // New state for image preview
  const [previewVisible, setPreviewVisible] = useState(false); //New state for managing the visibility of the preview

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}user/all-plan-requests`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );

        if (response.data.success) {
          setRequests(response.data.allRequests || []);
          setFilteredRequests(response.data.allRequests || []);
        } else {
          toast.error("Failed to fetch approval requests.");
        }
      } catch (error) {
        setError("Error fetching approval requests. Please try again.");
        toast.error("Error fetching approval requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (adminToken) {
      fetchAllRequests();
    } else {
      setError("No admin token found. Please log in.");
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (!requests || !Array.isArray(requests)) return;
    let result = [...requests];
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(request => {
        const fullName = `${request.userData?.firstName || ''} ${request.userData?.lastName || ''}`.toLowerCase();
        const phone = (request.userData?.phone || '').toLowerCase();
        return fullName.includes(lowerSearchTerm) || phone.includes(lowerSearchTerm);
      });
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [searchTerm, requests]);

  // Pagination logic
  const totalItems = filteredRequests?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredRequests)
    ? filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}user/process-plan-request`,
        { requestId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status: newStatus } : request
          )
        );

        setFilteredRequests((prevFilteredRequests) =>
          prevFilteredRequests.map((request) =>
            request._id === requestId ? { ...request, status: newStatus } : request
          )
        );

        toast.success(`Request status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update request status.");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("An error occurred while updating the request status.");
    }
  };

  const handleImageClick = (imageSrc) => {
    setPreviewImage(imageSrc);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
    setPreviewVisible(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-400">{error}</div>;
  }

  return (
    <div className="flex flex-col bg-black text-gray-300 mt-10 md:mt-0 lg:mt-0">
      {/* Image Preview Modal */}
      {previewVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={handleClosePreview}>
          <div className="bg-gray-800 rounded-lg p-4">
            <img src={previewImage} alt="Preview" className="max-w-3xl max-h-3xl rounded-md" style={{ maxHeight: '80vh', maxWidth: '80vw' }} />
            <button onClick={handleClosePreview} className="mt-4 block mx-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 p-3 sm:p-6">
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-blue-400">Plan Requests</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Showing {filteredRequests.length} requests</p>
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
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm text-gray-400">Image</th>
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
                    {request.userData?.firstName || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData?.lastName || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData?.email || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.userData?.phone || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    {request.planData?.image ? (
                      <img
                        src={request.planData.image}
                        alt="Plan"
                        className="h-16 w-auto rounded-md cursor-pointer"
                        onClick={() => handleImageClick(request.planData.image)} // Open preview on click
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm text-gray-300">
                    ${request.planData?.price || "N/A"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request._id, e.target.value)}
                      className={`w-24 sm:w-28 bg-gray-700 border border-gray-700 rounded-md px-1 sm:px-2 py-0.5 sm:py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[10px] sm:text-sm ${request.status === 'pending' ? 'text-yellow-500' :
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
