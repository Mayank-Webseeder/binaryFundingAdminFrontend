import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("adminEmail");

  const handleVerifyOTP = async () => {
    setError(null);
    setLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/v1/user/verifyOtp", {
        email,
        otp,
      });

      if (response.data.success) {
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="p-12 bg-gray-900 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-[#0f6dd3] mb-6">Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white mb-6 text-center focus:outline-none focus:ring-2 focus:ring-[#0f6dd3]"
          maxLength={6}
        />
        <button
          onClick={handleVerifyOTP}
          className="w-full py-3 bg-[#0f6dd3] text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};


export default OtpVerification;