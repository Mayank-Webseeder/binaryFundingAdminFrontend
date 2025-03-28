import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";

const CustomerWithdrawal = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrShowModal, setQrShowModal] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState("");
    const [copiedId, setCopiedId] = useState(null);

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

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/update/${requestId}`, {
                status: newStatus
            });
            alert(`Withdrawal request ${newStatus} successfully`);
            fetchRequests();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Error updating withdrawal status.");
            }
        }
    };

    if (loading) {
        return <p>Loading withdrawal requests...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleCopyWallet = (walletCode, requestId) => {
        navigator.clipboard.writeText(walletCode);
        setCopiedId(requestId);
        setTimeout(() => setCopiedId(null), 1000);
    };

    const handleViewQrCode = (qrCodeUrl) => {
        setSelectedQrCode(qrCodeUrl);
        setQrShowModal(true);
    };

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
                                <th className="py-3 px-4 text-left">QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request._id} className="border-b border-gray-700">
                                    <td className="py-3 px-4">{request._id.substring(0, 8)}...</td>
                                    <td className="py-3 px-4">{request.affiliateId.toString().substring(0, 8)}...</td>
                                    <td className="py-3 px-4">${request.amount}</td>
                                    <td className="py-3 px-4 flex items-center gap-2">
                                        {request.walletCode}
                                        <button
                                            onClick={() => handleCopyWallet(request.walletCode, request._id)}
                                            className="text-gray-400 hover:text-white flex items-center gap-1"
                                            title="Copy wallet address"
                                        >
                                            <FaCopy className="h-4 w-4" />
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={request.status}
                                            onChange={(e) => handleStatusChange(request._id, e.target.value)}
                                            className={`w-28 bg-gray-700 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm ${
                                                request.status === 'pending' ? 'text-yellow-500' :
                                                request.status === 'approved' ? 'text-green-500' : 'text-red-500'
                                            }`}
                                        >
                                            <option value="pending" className="text-yellow-500">Pending</option>
                                            <option value="approved" className="text-green-500">Approved</option>
                                            <option value="rejected" className="text-red-500">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleViewQrCode(request.qrCodeUrl)}
                                            className="text-gray-400 hover:text-white"
                                            title="View QR Code"
                                        >
                                            <BsQrCode className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {requests.length === 0 && (
                        <div className="py-8 text-center text-gray-400">
                            No withdrawal requests found.
                        </div>
                    )}
                </div>

                {/* QR Code Modal */}
                {qrShowModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-lg">
                            <div className="border-b border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-blue-400">QR Code</h2>
                                    <button
                                        onClick={() => setQrShowModal(false)}
                                        className="rounded-full p-1.5 hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="h-4 w-4 text-gray-400">✕</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex justify-center">
                                <img
                                    src={selectedQrCode}
                                    alt="Wallet QR Code"
                                    className="max-w-full h-auto rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CustomerWithdrawal;