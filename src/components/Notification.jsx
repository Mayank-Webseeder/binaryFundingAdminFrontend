import React from 'react'

export default function Notification() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0f6dd3] ml-4">Notifications</h2>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Mark all as read
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex gap-2 items-center">
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-lg"
                    />
                    <span className="text-white">to</span>
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-lg"
                    />
                </div>
                <select
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="all">All notifications</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                </select>

                <select
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="all">All categories</option>
                </select>
            </div>
            <div className="space-y-4">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800 shadow rounded-lg">
                        <p className="text-gray-400">User Notification</p>
                        {/* <button className="py-2 px-4 bg-[#0f6dd3] text-white rounded-lg">
                            Add User
                        </button> */}
                    </div>
                ))}
            </div>
        </div>
    )
}
