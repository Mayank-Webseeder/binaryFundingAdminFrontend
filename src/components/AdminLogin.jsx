import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/v1/user/loginAdmin", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("adminEmail", email);
        navigate("/otp");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="p-12 bg-gray-900 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-[#0f6dd3] mb-6">Admin Login</h2>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#0f6dd3]"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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