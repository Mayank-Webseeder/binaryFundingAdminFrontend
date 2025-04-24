"use client";
import React, { useState, useEffect } from 'react';

export default function SupportQuery() {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch notifications with polling
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}support/getQueries`);
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Initial fetch
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [currentPage, itemsPerPage]);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="relative mt-10 md:mt-0 lg:mt-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0f6dd3] ml-4">Notifications</h2>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div
                            key={index}
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
                    ))
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

            {/* Enhanced Modal */}
            {isModalOpen && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
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

                            {/* Image Display */}
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
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-400">
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
        </div>
    );
}
