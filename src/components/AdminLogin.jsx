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
        <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black flex justify-center items-center p-6">
            <div
                className="bg-[#121212]/80 p-8 rounded-lg shadow-lg w-full max-w-md text-center"
                style={{
                    background:
                        "linear-gradient(145deg, rgba(18,18,18,0.9) 0%, rgba(26,26,26,0.9) 100%)",
                    boxShadow: "0 0 20px 0 #4C9BFF20",
                    border: "1px solid #4C9BFF",
                }}
            >
                <h2 className="text-3xl font-bold text-white mb-8 mt-10">Admin Login</h2>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                />
                <button
                    onClick={handleSendOTP}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4 mb-10"
                >
                    Send OTP
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;