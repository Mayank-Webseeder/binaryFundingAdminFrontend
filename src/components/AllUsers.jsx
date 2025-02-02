import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/getAllUser");
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

  return (
    <div className="flex flex-col md:flex-row bg-black text-white">
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f6dd3]">All Users</h2>
        </header>
        <div className="flex items-center justify-between p-4 bg-gray-800 shadow rounded-lg">
          <table className="min-w-full table-auto rounded-lg shadow-md overflow-hidden">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-3 px-4 text-left">Account ID</th>
                <th className="py-3 px-4 text-left">First Name</th>
                <th className="py-3 px-4 text-left">Last Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Mobile</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Fee</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="">
                  <td className="py-3 px-4">{user.accountId}</td>
                  <td className="py-3 px-4">{user.firstName}</td>
                  <td className="py-3 px-4">{user.lastName}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">${user.price}</td>
                  <td className="py-3 px-4">${user.fee}</td>
                  <td className={`py-3 px-4 font-semibold ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {user.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AllUsers;

