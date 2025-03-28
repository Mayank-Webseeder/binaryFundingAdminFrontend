import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";

const AffiliateWithdrawal = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editShowModal, setEditShowModal] = useState(false);
  const [formData, setFormData] = useState({
    requestId: "",
    amount: "",
    walletCode: "",
  });

  // Fetch withdrawal requests from the backend
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/getAllRequests`);
      setRequests(response.data.withdrawalRequests);
      setLoading(false);
    } catch (err) {
      setError("Error fetching withdrawal requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveRequest = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/approve/${id}`);
      alert("Withdrawal request approved");
      fetchRequests(); // Re-fetch the list to update the status
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error approving withdrawal request.");
      }
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/reject/${id}`);
      alert("Withdrawal request rejected");
      fetchRequests(); // Re-fetch the list to update the status
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error rejecting withdrawal request.");
      }
    }
  };

  // Edit Modal Show/Hide
  const handleEditModal = (request) => {
    setFormData({
      requestId: request._id,
      amount: request.amount,
      walletCode: request.walletCode,
    });
    setEditShowModal(true);
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/update/${formData.requestId}`, {
        amount: formData.amount,
        walletCode: formData.walletCode
      });
      alert("Withdrawal request updated successfully");
      setEditShowModal(false);
      fetchRequests();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error updating withdrawal request.");
      }
    }
  };

  if (loading) {
    return <p>Loading withdrawal requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-black text-white">
      <main className="flex-1 mt-6 lg:p-6">
        <header className="mb-6 flex justify-between items-center px-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0f6dd3]">Affiliate Withdrawal</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {requests.length} requests</p>
          </div>
        </header>

        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg">
          <table className="w-full min-w-[800px] table-auto rounded-lg shadow-md overflow-hidden">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-3 px-4 text-left">Request ID</th>
                <th className="py-3 px-4 text-left">Affiliate ID</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Wallet Address</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b border-gray-700">
                  <td className="py-3 px-4">{request._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">{request.affiliateId.toString().substring(0, 8)}...</td>
                  <td className="py-3 px-4">${request.amount}</td>
                  <td className="py-3 px-4">{request.walletCode}</td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={`
                      ${request.status === 'pending' ? 'text-yellow-500' : 
                        request.status === 'approved' ? 'text-green-500' : 'text-red-500'}
                    `}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                          onClick={() => handleApproveRequest(request._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                          onClick={() => handleRejectRequest(request._id)}
                        >
                          Reject
                        </button>
                        <button
                          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                          onClick={() => handleEditModal(request)}
                        >
                          <MdOutlineEdit className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No data message */}
          {requests.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No withdrawal requests found.
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editShowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-lg">
              <div className="border-b border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">Update Withdrawal Request</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Edit request details below</p>
                  </div>
                  <button
                    onClick={() => setEditShowModal(false)}
                    className="rounded-full p-1.5 hover:bg-gray-700 transition-colors"
                  >
                    <span className="h-4 w-4 text-gray-400">✕</span>
                  </button>
                </div>
              </div>

              <div className="p-4 mb-4">
                <form onSubmit={handleUpdateRequest} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Amount</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Wallet Address</label>
                    <input
                      type="text"
                      placeholder="Wallet Code"
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      value={formData.walletCode}
                      onChange={(e) =>
                        setFormData({ ...formData, walletCode: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-blue-400 transition"
                  >
                    Update Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AffiliateWithdrawal;