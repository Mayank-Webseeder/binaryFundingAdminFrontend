import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineAttachMoney } from "react-icons/md";
import { X } from 'lucide-react';
import toast from "react-hot-toast";

const Rebates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}affiliate/getAffiliates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setAffiliates(response.data.affiliate);
          setFilteredAffiliates(response.data.affiliate);
        } else {
          setError("Failed to fetch affiliates.");
        }
      } catch (err) {
        setError("Error fetching affiliates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  useEffect(() => {
    let result = [...affiliates];

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(affiliate => {
        const fullName = `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.toLowerCase();
        const email = (affiliate.email || '').toLowerCase();
        const referralCode = (affiliate.referralCode || '').toLowerCase();
        return fullName.includes(lowerSearchTerm) || email.includes(lowerSearchTerm) || referralCode.includes(lowerSearchTerm);
      });
    }

    setFilteredAffiliates(result);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, affiliates]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAffiliates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAffiliates.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const showDetails = (affiliate) => {
    setSelectedAffiliate(affiliate);
    setShowDetailsModal(true);
  };

  // Display loading state
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-black text-white mt-10 md:mt-0 lg:mt-0">
      <main className="flex-1 mt-4 lg:p-3 sm:p-6">
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-4 overflow-x-auto">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#0f6dd3]">Affiliate Rebates</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Showing {filteredAffiliates.length} affiliate accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or referral code..."
              className="w-full sm:w-64 bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Per page:</span>
              <select
                className="w-16 bg-gray-700 text-white border border-gray-700 rounded-md px-1 sm:px-2 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
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
          <table className="w-full min-w-[800px] table-auto rounded-lg shadow-md overflow-hidden">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Name</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Email</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Referral Code</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Balance</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Referrals</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((affiliate) => (
                <tr key={affiliate._id} className="border-b border-gray-700">
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{`${affiliate.firstName} ${affiliate.lastName}`}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{affiliate.email}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{affiliate.referralCode}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm font-semibold text-green-400">
                    ${affiliate.affiliateBalance?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{affiliate.referrals?.length || 0}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4">
                    <button 
                      className="bg-blue-500 text-white p-1 sm:p-2 rounded-md hover:bg-blue-600 flex items-center gap-1 text-[10px] sm:text-sm"
                      onClick={() => showDetails(affiliate)}
                    >
                      <MdOutlineAttachMoney className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No data message */}
          {currentItems.length === 0 && (
            <div className="py-6 text-center text-gray-400 text-xs sm:text-sm">
              No affiliates found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAffiliates.length > 0 && (
          <div className="mt-3 flex justify-end items-center gap-1 sm:gap-2 px-3 sm:px-4">
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

        {/* Details Modal */}
        {showDetailsModal && selectedAffiliate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
            <div className="w-full max-w-[90%] sm:max-w-md md:max-w-2xl bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-lg">
              <div className="border-b border-gray-700 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-xl font-bold text-blue-400">
                      Affiliate Rebate Details
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">
                      {selectedAffiliate.firstName} {selectedAffiliate.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="rounded-full p-1 sm:p-1.5 hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-[10px] sm:text-xs">Affiliate Email</p>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedAffiliate.email}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-[10px] sm:text-xs">Referral Code</p>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedAffiliate.referralCode}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-[10px] sm:text-xs">Total Referrals</p>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedAffiliate.referrals?.length || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-[10px] sm:text-xs">Current Balance</p>
                    <p className="text-green-400 font-bold text-lg sm:text-xl">
                      ${selectedAffiliate.affiliateBalance?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2 sm:mb-3">Payment Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="bg-green-600 text-white py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-semibold hover:bg-green-500 transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <MdOutlineAttachMoney className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Process Payment</span>
                    </button>
                    {/* <button className="bg-gray-700 text-white py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-600 transition text-xs sm:text-sm">
                      View Payment History
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rebates;