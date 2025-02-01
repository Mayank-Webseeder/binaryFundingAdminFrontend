import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
  
    const handleVerifyOTP = () => {
      // Simulate OTP verification (replace with actual API call)
      if (otp.length === 6) {
        console.log("OTP verified");
        navigate("/admin");
      } else {
        alert("Please enter a valid 6-digit OTP");
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