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
    // <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
    //   <div className="p-12 bg-gray-900 rounded-lg shadow-lg w-96 text-center">
    //     <h2 className="text-2xl font-bold text-[#0f6dd3] mb-6">Enter OTP</h2>
    //     <input
    //       type="text"
    //       placeholder="Enter 6-digit OTP"
    //       value={otp}
    //       onChange={(e) => setOtp(e.target.value)}
    //       className="w-full p-3 rounded bg-gray-800 text-white mb-6 text-center focus:outline-none focus:ring-2 focus:ring-[#0f6dd3]"
    //       maxLength={6}
    //     />
    //     <button
    //       onClick={handleVerifyOTP}
    //       className="w-full py-3 bg-[#0f6dd3] text-white rounded-lg hover:bg-blue-700 transition duration-300"
    //     >
    //       Verify OTP
    //     </button>
    //   </div>
    // </div>
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
        <h2 className="text-3xl font-bold text-white mb-8 mt-10">Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-center"
          maxLength={6}
        />
        <button
          onClick={handleVerifyOTP}
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mt-4 mb-10"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};


export default OtpVerification;