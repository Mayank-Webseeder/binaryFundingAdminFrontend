import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";

const CustomerWithdrawal = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [error, setError] = useState(null);
    const [qrShowModal, setQrShowModal] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch withdrawal requests from the backend
    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/getUserRequests`);
            setRequests(response.data.withdrawalRequests);
            setFilteredRequests(response.data.withdrawalRequests);
            setLoading(false);
        } catch (err) {
            setError("Error fetching withdrawal requests.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        let result = [...requests];

        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(request => {
                const requestId = (request._id || '').toLowerCase();
                const affiliateId = (request.affiliateId || '').toString().toLowerCase();
                const walletCode = (request.walletCode || '').toLowerCase();
                return requestId.includes(lowerSearchTerm) || affiliateId.includes(lowerSearchTerm) || walletCode.includes(lowerSearchTerm);
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

    const handleStatusChange = async (requestId, newStatus) => {
        if (newStatus === 'approved') {
            try {
                const response = await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/userApprove/${requestId}`);

                if (response.data.success) {
                    alert(response.data.message);
                    fetchRequests();
                } else {
                    alert(response.data.message || "Error updating withdrawal status.");
                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    alert(err.response.data.message);
                } else {
                    alert("Error updating withdrawal status.");
                }
            }
        } else {
            try {
                const response = await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}withdrawal/userReject/${requestId}`, {
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
        <div className="flex flex-col md:flex-row bg-black text-white mt-10 md:mt-0 lg:mt-0">
            <main className="flex-1 mt-4 lg:p-3 sm:p-6">
                <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-4 overflow-x-auto">
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-[#0f6dd3]">Customer Withdrawal</h2>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Showing {filteredRequests.length} requests</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by request ID, affiliate ID, or wallet address..."
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
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Request ID</th>
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">User Name</th>
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Amount</th>
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Wallet Address</th>
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Status</th>
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Created At</th>
                                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((request) => (
                                <tr key={request._id} className="border-b border-gray-700">
                                    <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{request._id.substring(0, 8)}...</td>
                                    <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{request.firstName} {request.lastName}</td>
                                    <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">${request.amount}</td>
                                    <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2">
                                        {request.walletCode}
                                        <button
                                            onClick={() => handleCopyWallet(request.walletCode, request._id)}
                                            className="text-gray-400 hover:text-white flex items-center gap-1"
                                            title="Copy wallet address"
                                        >
                                            <FaCopy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
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
                                    <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{new Date(request.createdAt).toLocaleDateString()}</td>
                                    <td className="py-1 px-1 sm:py-3 sm:px-4">
                                        <button
                                            onClick={() => handleViewQrCode(request.image)}
                                            className="text-gray-400 hover:text-white"
                                            title="View QR Code"
                                        >
                                            <BsQrCode className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {currentItems.length === 0 && (
                        <div className="py-6 text-center text-gray-400 text-xs sm:text-sm">
                            No withdrawal requests found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredRequests.length > 0 && (
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

                {/* QR Code Modal */}
                {qrShowModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
                        <div className="w-full max-w-[90%] sm:max-w-md bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-lg">
                            <div className="border-b border-gray-700 p-3 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-xl font-bold text-blue-400">QR Code</h2>
                                    <button
                                        onClick={() => setQrShowModal(false)}
                                        className="rounded-full p-1 sm:p-1.5 hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400">✕</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 sm:p-6 flex justify-center">
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