import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin3Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { X } from 'lucide-react';
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editShowModal, setEditShowModal] = useState(false);
  const [editUsersId, setEditUsersId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      result = result.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const phone = (user.phone || '').toLowerCase();
        return fullName.includes(lowerSearchTerm) || phone.includes(lowerSearchTerm);
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, users]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchUserById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}user/getUserById/${id}`
      );
      if (response.data.success) {
        setEditUsersId(id);
        setFormData({
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          status: response.data.user.status || "",
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

      setUsers(users.map(user =>
        user._id === editUsersId ? { ...user, ...formData } : user
      ));
      setEditShowModal(false);
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this User?");
    if (confirmDelete) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_BASE_URL}user/deleteUserById/${id}`
        );
        toast.success("User deleted successfully");
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        toast.error("Failed to delete User.");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BASE_URL}user/updateUserById/${id}`,
        { status: newStatus }
      );

      setUsers(users.map(user =>
        user._id === id ? { ...user, status: newStatus } : user
      ));

      toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${newStatus === "active" ? "activate" : "deactivate"} user`);
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col bg-black text-white mt-10 md:mt-0 lg:mt-0">
      <main className="flex-1 p-3 sm:p-6">
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto px-2">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#0f6dd3]">Users</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Showing {filteredUsers.length} user accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full sm:w-64 bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full sm:w-48 bg-gray-700 text-white border border-gray-700 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
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

        {/* Table with Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto bg-gray-800 shadow rounded-lg md:mt-10">
          <table className="w-full table-auto rounded-lg shadow-md min-w-[800px]">
            <thead className="bg-slate-900">
              <tr>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Account ID</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">First Name</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Last Name</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Email</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Mobile</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Price</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Fee</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Status</th>
                <th className="py-1 px-1 sm:py-3 sm:px-4 text-left text-[10px] sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{user.accountId}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{user.firstName || "N/A"}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{user.lastName || "N/A"}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{user.email || "N/A"}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{user.phone || "N/A"}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">${user.price || 0}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">${user.fee || 0}</td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    <select
                      className={`w-full sm:w-24 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                    >
                      <option value="active" className="text-green-600">Active</option>
                      <option value="inactive" className="text-red-600">Inactive</option>
                    </select>
                  </td>
                  <td className="py-1 px-1 sm:py-3 sm:px-4">
                    <div className="flex items-center gap-0.5 sm:gap-2 flex-nowrap">
                      <button
                        className="bg-blue-500 text-white p-1 sm:p-2 rounded-md hover:bg-blue-600 flex-shrink-0"
                        onClick={() => fetchUserById(user._id)}
                      >
                        <MdOutlineEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        className="bg-red-500 text-white p-1 sm:p-2 rounded-md hover:bg-red-600 flex-shrink-0"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <RiDeleteBin3Line className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentItems.length === 0 && (
            <div className="py-6 text-center text-gray-400 text-xs sm:text-sm">
              No users found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-3 flex justify-end items-center gap-1 sm:gap-2">
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

        {/* Edit Modal */}
        {editShowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
            <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-lg">
              <div className="border-b border-gray-700 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-xl font-bold text-blue-400">
                      Update User Profile
                    </h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Edit user information below</p>
                  </div>
                  <button
                    onClick={() => setEditShowModal(false)}
                    className="rounded-full p-1 sm:p-1.5 hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <form onSubmit={handleUpdateUser} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-medium text-gray-300">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs sm:text-sm"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-medium text-gray-300">Last Name</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs sm:text-sm"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-300">Contact Information</label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <select className="w-full sm:w-1/3 bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs sm:text-sm">
                        {countryOptions}
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full sm:w-2/3 bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs sm:text-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-300">Email Address</label>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs sm:text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-300">Status</label>
                    <select
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xs sm:text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 text-white py-1.5 sm:py-2 px-4 sm:px-6 rounded-xl font-semibold hover:bg-blue-400 transition text-xs sm:text-sm"
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

export default Users;