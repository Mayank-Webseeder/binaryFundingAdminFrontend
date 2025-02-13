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
            const response = await axios.post("https://binaryfundingaccount-backend-vx0u.onrender.com/api/v1/user/loginAdmin", {
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

        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <img src="/public/logos/single.png" alt="Logo" className="w-16 h-16" />
              </div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Admin Login
                </h2>
              </div>
  
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-gray-800/50 p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-gray-800/50 p-3 rounded-lg text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                    required 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleSendOTP} 
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:outline-none group">
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AdminLogin;