import React, { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirm) {
      // Handle account deletion
      console.log('Account deleted');
    }
  };

  return (
    <div className="flex-1 bg-black text-white">
    <div className="max-w-full sm:max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[#0f6dd3] ml-[70px] ">General Settings</h1>

      {/* Avatar Section */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Avatar Image */}
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />

          {/* Avatar Info & Buttons */}
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-xl mb-2">Avatar</h2>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <button className="w-full sm:w-auto px-4 py-2 bg-[#0f6dd3] rounded-lg hover:bg-[#0f6dd3]/80 flex items-center gap-2">
                <Upload size={16} /> Change
              </button>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
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
          <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
          />
        </div>
      </form>

      {/* Change Password */}
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

      {/* Danger Zone */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-red-500/20">
        <h2 className="text-xl mb-4 text-red-500">Danger Zone</h2>
        <p className="text-gray-400 mb-4">
          Delete any and all content you have, such as articles, comments, your reading list or chat messages.
          Allow your username to become available to anyone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 size={16} /> Delete Account
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Feel free to contact with any questions at{' '}
          <a href="mailto:support@example.com" className="text-[#0f6dd3]">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  </div>
    // <div className="flex-1 p-6 bg-black text-white">
    //   <div className="max-w-3xl mx-auto space-y-8">
    //     <h1 className="text-2xl font-bold text-[#0f6dd3]">General Settings</h1>

    //     {/* Avatar Section */}
    //     <div className="bg-gray-900 p-6 rounded-lg">
    //       <div className="flex items-center gap-4">
    //         {/* Avatar Image */}
    //         <img
    //           src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
    //           alt="Profile"
    //           className="w-16 h-16 rounded-full object-cover"
    //         />

    //         {/* Avatar Info & Buttons */}
    //         <div className="flex flex-col">
    //           <h2 className="text-xl mb-2">Avatar</h2>

    //           {/* Buttons (Same Row) */}
    //           <div className="flex items-center gap-2">
    //             <button className="px-4 py-2 bg-[#0f6dd3] rounded-lg hover:bg-[#0f6dd3]/80 flex items-center gap-2">
    //               <Upload size={16} /> Change
    //             </button>
    //             <button className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30">
    //               Remove
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     {/* Basic Information */}
    //     <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-6">
    //       <h2 className="text-xl mb-4">Basic Information</h2>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         <div>
    //           <label className="block text-sm font-medium mb-2">First Name</label>
    //           <input
    //             type="text"
    //             name="firstName"
    //             value={formData.firstName}
    //             onChange={handleChange}
    //             className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm font-medium mb-2">Last Name</label>
    //           <input
    //             type="text"
    //             name="lastName"
    //             value={formData.lastName}
    //             onChange={handleChange}
    //             className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //           />
    //         </div>
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium mb-2">Email</label>
    //         <input
    //           type="email"
    //           name="email"
    //           value={formData.email}
    //           onChange={handleChange}
    //           className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
    //         <input
    //           type="tel"
    //           name="phone"
    //           value={formData.phone}
    //           onChange={handleChange}
    //           className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //         />
    //       </div>
    //     </form>

    //     {/* Change Password */}
    //     <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-6">
    //       <h2 className="text-xl mb-4">Change Password</h2>

    //       <div>
    //         <label className="block text-sm font-medium mb-2">Current Password</label>
    //         <input
    //           type="password"
    //           name="currentPassword"
    //           value={formData.currentPassword}
    //           onChange={handleChange}
    //           className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium mb-2">New Password</label>
    //         <input
    //           type="password"
    //           name="newPassword"
    //           value={formData.newPassword}
    //           onChange={handleChange}
    //           className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium mb-2">Confirm New Password</label>
    //         <input
    //           type="password"
    //           name="confirmPassword"
    //           value={formData.confirmPassword}
    //           onChange={handleChange}
    //           className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0f6dd3]"
    //         />
    //       </div>

    //       <div className="text-sm text-gray-400">
    //         <p className="font-medium mb-2">Password requirements:</p>
    //         <ul className="list-disc pl-5 space-y-1">
    //           <li>Minimum 8 characters long</li>
    //           <li>At least one lowercase character</li>
    //           <li>At least one uppercase character</li>
    //           <li>At least one number, symbol, or whitespace character</li>
    //         </ul>
    //       </div>

    //       <button type="submit" className="px-6 py-2 bg-[#0f6dd3] rounded-lg hover:bg-[#0f6dd3]/80">
    //         Save Changes
    //       </button>
    //     </form>

    //     {/* Danger Zone */}
    //     <div className="bg-gray-900 p-6 rounded-lg border border-red-500/20">
    //       <h2 className="text-xl mb-4 text-red-500">Danger Zone</h2>
    //       <p className="text-gray-400 mb-4">
    //         Delete any and all content you have, such as articles, comments, your reading list or chat messages.
    //         Allow your username to become available to anyone.
    //       </p>
    //       <button
    //         onClick={handleDeleteAccount}
    //         className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
    //       >
    //         <Trash2 size={16} /> Delete Account
    //       </button>
    //       <p className="mt-4 text-sm text-gray-400">
    //         Feel free to contact with any questions at{' '}
    //         <a href="mailto:support@example.com" className="text-[#0f6dd3]">
    //           support@example.com
    //         </a>
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SettingsPage;