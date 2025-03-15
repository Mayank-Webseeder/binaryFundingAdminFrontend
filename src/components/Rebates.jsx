import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineAttachMoney } from "react-icons/md";
import { X } from 'lucide-react';
import toast from "react-hot-toast";

const Rebates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}affiliate/getAffiliates`,{
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setAffiliates(response.data.affiliate);
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
    <div className="flex flex-col md:flex-row bg-black text-white">
      <main className="flex-1 mt-6 lg:p-6">
        <header className="mb-6 flex justify-between items-center px-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0f6dd3]">Affiliate Rebates</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {affiliates.length} affiliate accounts</p>
          </div>
        </header>
        
        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg">
          <table className="w-full min-w-[800px] table-auto rounded-lg shadow-md overflow-hidden">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Referral Code</th>
                <th className="py-3 px-4 text-left">Balance</th>
                <th className="py-3 px-4 text-left">Referrals</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate._id} className="border-b border-gray-700">
                  <td className="py-3 px-4">{`${affiliate.firstName} ${affiliate.lastName}`}</td>
                  <td className="py-3 px-4">{affiliate.email}</td>
                  <td className="py-3 px-4">{affiliate.referralCode}</td>
                  <td className="py-3 px-4 font-semibold text-green-400">
                    ${affiliate.affiliateBalance?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-3 px-4">{affiliate.referrals?.length || 0}</td>
                  <td className="py-3 px-4">
                    <button 
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center gap-1"
                      onClick={() => showDetails(affiliate)}
                    >
                      <MdOutlineAttachMoney />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* No data message */}
          {affiliates.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No affiliates found.
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedAffiliate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-lg">
              <div className="border-b border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">
                      Affiliate Rebate Details
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {selectedAffiliate.firstName} {selectedAffiliate.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="rounded-full p-1.5 hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs">Affiliate Email</p>
                    <p className="text-white font-medium">{selectedAffiliate.email}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs">Referral Code</p>
                    <p className="text-white font-medium">{selectedAffiliate.referralCode}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs">Total Referrals</p>
                    <p className="text-white font-medium">{selectedAffiliate.referrals?.length || 0}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-xs">Current Balance</p>
                    <p className="text-green-400 font-bold text-xl">
                      ${selectedAffiliate.affiliateBalance?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Payment Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-500 transition flex items-center justify-center gap-2">
                      <MdOutlineAttachMoney />
                      <span>Process Payment</span>
                    </button>
                    <button className="bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition">
                      View Payment History
                    </button>
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