import React, { useEffect, useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const SettingsPage = () => {
  const localStorageToken = localStorage.getItem("token");
  const decodedToken = jwtDecode(localStorageToken);
  const [id, setId] = useState();

  useEffect(() => {
    setId(decodedToken.id);
  }, [decodedToken.id])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/getAdminById/${id}`);
        setFormData(prevState => ({
          ...prevState,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          phone: response.data.user.phone || ''
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/v1/user/adminChangePassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating the password.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-black text-white">
      <div className="flex-1 p-6 space-y-8">
        <h2 className="text-2xl font-bold text-[#0f6dd3] ml-4">Settings</h2>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-4 sm:p-6 rounded-lg space-y-6">
          <h2 className="text-xl mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
            />
          </div>
          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-[#0f6dd3] rounded-lg hover:bg-[#0f6dd3]/80">
            Save Profile
          </button>
        </form>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-4 sm:p-6 rounded-lg space-y-6">
          <h2 className="text-xl mb-4">Change Password</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
            />
          </div>
          <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-[#0f6dd3] rounded-lg hover:bg-[#0f6dd3]/80">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;