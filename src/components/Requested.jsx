import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin3Line } from "react-icons/ri";
import toast from "react-hot-toast";

const Requested = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}user/getAllUser`);
        if (response.data.success) {
          setUsers(response.data.user);
          setFilteredUsers(response.data.user);
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

  useEffect(() => {
    let result = [...users];

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((user) => {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
        const phone = (user.phone || "").toLowerCase();
        return fullName.includes(lowerSearchTerm) || phone.includes(lowerSearchTerm);
      });
    }

    setFilteredUsers(result);
  }, [searchTerm, users]);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}user/deleteUserById/${id}`);
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}user/updateUserById/${id}`, {
        status: newStatus,
      });
      setUsers(users.map((user) =>
        user._id === id ? { ...user, status: newStatus } : user
      ));
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col bg-black text-white">
      <main className="flex-1 p-4 sm:p-6">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f6dd3]">Requested</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {filteredUsers.length} requested accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full sm:w-64 bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg">
          <table className="w-full table-auto rounded-lg shadow-md min-w-[800px]">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Account ID</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">First Name</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Last Name</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Email</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Mobile</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Status</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{user.accountId || user._id}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{user.firstName || "N/A"}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{user.lastName || "N/A"}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{user.email || "N/A"}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{user.phone || "N/A"}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    <select
                      value={user.status || "pending"}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      className={`w-full bg-gray-700 border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm ${
                        user.status === "active"
                          ? "text-green-500"
                          : user.status === "inactive"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      <option value="pending" className="bg-gray-700 text-yellow-500">Pending</option>
                      <option value="active" className="bg-gray-700 text-green-500">Active</option>
                      <option value="inactive" className="bg-gray-700 text-red-500">Inactive</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4">
                    <div className="flex items-center gap-1 sm:gap-2 flex-nowrap">
                      <button
                        className="bg-red-500 text-white p-1 sm:p-2 rounded-md hover:bg-red-600 flex-shrink-0"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <RiDeleteBin3Line className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">
              No users found matching your criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Requested;