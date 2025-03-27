import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin3Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { Camera, X } from 'lucide-react';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editShowModal, setEditShowModal] = useState(false);
  const [editUsersId, setEditUsersId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}user/getAllUser`);
        if (response.data.success) {
          // No filtering now - display all users
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

  const fetchUserById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}user/getUserById/${id}`
      );
      if (response.data.success) {
        setEditUsersId(id);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          phone: response.data.user.phone,
          status: response.data.user.status,
        });
        setEditShowModal(true);
      } else {
        toast.error("Failed to fetch user details.");
      }
    } catch (error) {
      toast.error("Error fetching user details.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BASE_URL}user/updateUserById/${editUsersId}`,
        formData
      );
      toast.success("User updated successfully");

      // Update user in current list
      setUsers(users.map(user =>
        user._id === editUsersId ? { ...user, ...formData } : user
      ));

      setEditShowModal(false);
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this User?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_BASE_URL}user/deleteUserById/${id}`
        );
        toast.success("User deleted successfully");
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        toast.error("Failed to delete User.", error);
      }
    }
  };

  const countryCodes = [
    { code: "+91", country: "🇮🇳" },
    { code: "+1", country: "🇺🇸" },
    { code: "+44", country: "🇬🇧" },
    { code: "+61", country: "🇦🇺" },
    { code: "+81", country: "🇯🇵" },
    { code: "+49", country: "🇩🇪" },
    { code: "+33", country: "🇫🇷" },
    { code: "+55", country: "🇧🇷" }
  ];

  const countryOptions = countryCodes.map((item, index) => (
    <option key={index} value={item.code}>
      {item.country} {item.code}
    </option>
  ));

  // Display loading state
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-black text-white">
      <main className="flex-1 mt-6 lg:p-6">
        <header className="mb-6 flex justify-between items-center px-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0f6dd3]">All Users</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {users.length} user accounts</p>
          </div>
        </header>

        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg">
          <table className="w-full min-w-[800px] table-auto rounded-lg shadow-md overflow-hidden">
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
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="py-3 px-4">{user.accountId}</td>
                  <td className="py-3 px-4">{user.firstName}</td>
                  <td className="py-3 px-4">{user.lastName}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">${user.price}</td>
                  <td className="py-3 px-4">${user.fee}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    {user.status}
                  </td>
                  <td className="py-3 px-4">
                    <img src={user.image} alt="User" className="w-12 h-12 object-cover rounded-full" />
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                      onClick={() => fetchUserById(user._id)}>
                      <MdOutlineEdit />
                    </button>
                    <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      onClick={() => handleDeleteUser(user._id)}>
                      <RiDeleteBin3Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No data message */}
          {users.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No users found.
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
                    <h2 className="text-xl font-bold text-blue-400">
                      Update User Profile
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">Edit user information below</p>
                  </div>
                  <button
                    onClick={() => setEditShowModal(false)}
                    className="rounded-full p-1.5 hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-4 mb-4">
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-300">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-300">Last Name</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Contact Information</label>
                    <div className="flex gap-3">
                      <select className="bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-1/3 text-sm">
                        {countryOptions}
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-2/3 bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Email Address</label>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-blue-400 transition"
                  >
                    Update User
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

export default UserManagement;