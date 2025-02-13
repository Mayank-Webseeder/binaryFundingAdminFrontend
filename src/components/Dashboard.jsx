import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Dashboard() {
    const localStorageToken = localStorage.getItem("token");
    const decodedToken = jwtDecode(localStorageToken);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("https://binaryfundingaccount-backend-vx0u.onrender.com/api/v1/user/getAllUser");
                if (response.data.success) {
                    setUsers(response.data.user);
                } else {
                    setError("Failed to fetch users.");
                }
            } catch (err) {
                setError("Error fetching users. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Count active and inactive users
    const activeUsers = users.filter(user => user.status === "active").length;
    const inactiveUsers = users.filter(user => user.status === "inactive").length;

    return (
        <>
            <div className="flex flex-col md:flex-row bg-black text-white">
                <main className="flex-1 p-6">
                    <header className="mb-6">
                        <h2 className="text-2xl font-bold text-[#0f6dd3]">Welcome, {decodedToken?.firstName}</h2>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {[
                            { label: "Active Users", count: activeUsers },
                            { label: "InActive Users", count: inactiveUsers },
                            { label: "", count: "" },
                        ].map((stat, index) => (
                            <div key={index} className="p-4 bg-gray-800 shadow rounded-lg text-center">
                                <h3 className="text-gray-400">{stat.label}</h3>
                                <p className="text-2xl font-bold text-[#0f6dd3]">{stat.count}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-800 shadow rounded-lg mb-6">
                        <h3 className="text-gray-400 mb-2">User Growth</h3>
                        <div className="h-48 bg-[#0f6dd3]/20 flex items-center justify-center rounded-lg">
                            <p className="text-[#0f6dd3]">Chart goes here</p>
                        </div>
                    </div>
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
