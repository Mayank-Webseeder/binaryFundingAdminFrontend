import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    // Simulate OTP sending (replace with actual API call)
    console.log("OTP sent to", email);
    navigate("/otp");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="p-12 bg-gray-900 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-[#0f6dd3] mb-6">Admin Login</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#0f6dd3]"
        />
        <button
          onClick={handleSendOTP}
          className="w-full py-3 bg-[#0f6dd3] text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;