import React from 'react'

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-col md:flex-row bg-black text-white">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Welcome Section */}
                    <header className="mb-6">
                        <h2 className="text-2xl font-bold text-[#0f6dd3]">Welcome, Admin</h2>
                        <p className="text-gray-400">Here's what's been happening in the last 7 days.</p>
                    </header>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {[
                            { label: "Users", count: "24,000" },
                            { label: "Pandits", count: "1,200" },
                            { label: "Kathabachaks", count: "2,200" },
                        ].map((stat, index) => (
                            <div key={index} className="p-4 bg-gray-800 shadow rounded-lg text-center">
                                <h3 className="text-gray-400">{stat.label}</h3>
                                <p className="text-2xl font-bold text-[#0f6dd3]">{stat.count}</p>
                            </div>
                        ))}
                    </div>

                    {/* User Growth Chart */}
                    <div className="p-4 bg-gray-800 shadow rounded-lg mb-6">
                        <h3 className="text-gray-400 mb-2">User Growth</h3>
                        <div className="h-48 bg-[#0f6dd3]/20 flex items-center justify-center rounded-lg">
                            <p className="text-[#0f6dd3]">Chart goes here</p>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    <div className="space-y-4">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-800 shadow rounded-lg">
                                <p className="text-gray-400">Add a new user</p>
                                <button className="py-2 px-4 bg-[#0f6dd3] text-white rounded-lg">
                                    Add User
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    )
}
