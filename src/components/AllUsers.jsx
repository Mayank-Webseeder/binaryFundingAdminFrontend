import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBin3Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editShowModal, setEditShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
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

  // Fetch user details by ID
  const fetchUserById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/getUserById/${id}`
      );
      if (response.data.success) {
        setEditUser(response.data.user);
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

  // Update user details
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:4000/api/v1/user/updateUserById/${editUser._id}`,
        formData
      );
      toast.success("User updated successfully");
      setEditShowModal(false);
      window.location.reload(); 
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
          `http://localhost:4000/api/v1/user/deleteUserById/${id}`
        );
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete User.", error);
      }
    }
  };

  const setEditUser = (user) => {
    setEditUsersId(user._id);
    setEditShowModal(true);
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
                <th className="py-3 px-4 text-left">Image</th>
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
                  <td className="py-3 px-4">
                    <img
                      src={user.image}
                      alt="Payment"
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      onClick={() => {
                        setEditUser(user);
                        setEditShowModal(true);
                        fetchUserById(user._id)
                      }}
                    >
                      <MdOutlineEdit />
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <RiDeleteBin3Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editShowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 mt-20">
            <div className="bg-[#111322] w-full max-w-4xl rounded-lg shadow-lg mx-4 p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-2xl font-bold text-[#0f6dd3]">Update User </h2>
                <button
                  className="text-red-500 text-3xl font-semibold hover:text-red-700"
                  onClick={() => {
                    setEditShowModal(false);
                  }}
                >
                  <span className=" text-red-500 bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleUpdateUser}>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 w-full">
                    <select
                      className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="phone"
                      required
                    >
                      {countryOptions}
                    </select>
                    <input type="tel" placeholder="Contact No" className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                /> 
                <select
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2"
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div>
                  <label className="text-[#F8D9B3] font-semibold" htmlFor="image">
                    Image <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-[#F8D9B3] text-3xl focus:outline-none"
                        onClick={() => document.getElementById("image").click()}
                      >
                        +
                      </button>
                      <FaCamera className="text-[#F8D9B3] h-5 w-5" />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 w-32 h-32 object-cover"
                      />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#F8D9B3] text-[#111322] py-2 px-6 rounded-full font-semibold hover:bg-[#E6C89A] transition"
                >
                  Update User
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AllUsers;

