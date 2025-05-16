"use client";
import React, { useState, useEffect } from 'react';

export default function SupportQuery() {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [replyText, setReplyText] = useState('');
    const [replyImage, setReplyImage] = useState(null);
    const [submittedReplies, setSubmittedReplies] = useState({});

    // Fetch notifications with polling
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}support/getQueries`);
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.data);
                    setTotalPages(Math.ceil(data.data.length / itemsPerPage));
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [currentPage, itemsPerPage]);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        setReplyText('');
        setReplyImage(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
        setReplyText('');
        setReplyImage(null);
    };

    const handleReplySubmit = (notificationId) => {
        if (replyText.trim()) {
            setSubmittedReplies((prev) => ({
                ...prev,
                [notificationId]: {
                    text: replyText,
                    image: replyImage ? URL.createObjectURL(replyImage) : null,
                    submittedAt: new Date().toISOString()
                }
            }));
            setReplyText('');
            setReplyImage(null);
        }
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="relative mt-10 md:mt-0 lg:mt-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0f6dd3] ml-4">Notifications</h2>
            </div>

            <div className="space-y-4">
                {paginatedNotifications.length > 0 ? (
                    paginatedNotifications.map((notification) => {
                        const id = notification._id || notification.id;
                        return (
                            <div
                                key={id}
                                onClick={() => handleNotificationClick(notification)}
                                className="flex items-center justify-between p-4 bg-gray-800 shadow rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                <p className="text-gray-400">
                                    {notification.text.slice(0, 50)}...
                                    <b> - {notification.user.firstName} {notification.user.lastName}</b>
                                </p>
                                <span className="text-xs text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400">No notifications found.</p>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="mt-3 flex justify-end items-center gap-1 sm:gap-2 px-3 sm:px-4 text-white">
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

            {/* Modal */}
            {isModalOpen && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Query from {selectedNotification.user.firstName} {selectedNotification.user.lastName}
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Email: {selectedNotification.user.email}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg mb-4">
                            <p className="text-white mb-4">{selectedNotification.text}</p>

                            {selectedNotification.imageUrl && (
                                <div className="mt-4">
                                    <p className="text-gray-400 text-sm mb-2">Attached Image:</p>
                                    <img
                                        src={selectedNotification.imageUrl}
                                        alt="Support query attachment"
                                        className="max-h-64 w-auto rounded-md border border-gray-600"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/image-placeholder.svg';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Reply display */}
                            {submittedReplies[selectedNotification._id || selectedNotification.id] && (
                                <div className="mt-4 border-t border-gray-600 pt-4">
                                    <p className="text-gray-400 text-sm mb-2">Your Reply:</p>
                                    <p className="text-white mb-2">{submittedReplies[selectedNotification._id || selectedNotification.id].text}</p>
                                    {submittedReplies[selectedNotification._id || selectedNotification.id].image && (
                                        <div className="mt-2">
                                            <p className="text-gray-400 text-sm mb-1">Attached Image:</p>
                                            <img
                                                src={submittedReplies[selectedNotification._id || selectedNotification.id].image}
                                                alt="Attached reply"
                                                className="max-h-48 rounded border border-gray-600"
                                            />
                                        </div>
                                    )}
                                    <p className="text-gray-400 text-xs mt-2">
                                        Sent: {new Date(submittedReplies[selectedNotification._id || selectedNotification.id].submittedAt).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!submittedReplies[selectedNotification._id || selectedNotification.id] && (
                            <div className="mt-4 space-y-4">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    className="w-full p-3 bg-gray-900 text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
                                    rows="4"
                                />

                                <div>
                                    <label className="text-gray-400 block mb-1">Attach an image (optional):</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setReplyImage(e.target.files[0])}
                                        className="text-white"
                                    />
                                    {replyImage && (
                                        <div className="mt-2">
                                            <p className="text-gray-400 text-sm mb-1">Preview:</p>
                                            <img
                                                src={URL.createObjectURL(replyImage)}
                                                alt="Reply preview"
                                                className="max-h-48 rounded border border-gray-600"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-start">
                                    <button
                                        onClick={() => handleReplySubmit(selectedNotification._id || selectedNotification.id)}
                                        disabled={!replyText.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                            <span>Submitted: {new Date(selectedNotification.createdAt).toLocaleString()}</span>
                            <button
                                onClick={closeModal}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background-color: #4b5563;
                    border-radius: 4px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background-color: #6b7280;
                }

                .scrollbar-thin {
                    scrollbar-width: thin;
                    scrollbar-color: #4b5563 transparent;
                }
            `}</style>
        </div>
    );
}
