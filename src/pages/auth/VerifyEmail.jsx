import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import bgImage from "../../assets/img/bg-images.png";
import { VerifyemailIcon } from "../../components/Icons";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [email] = useState("john@gmail.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const otpCode = otp.join("");
    console.log("OTP submitted:", otpCode);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const finalUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/verify_code/`;
      
      const payload = {
        code: otpCode,
        method: "email"
      };

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Email verification successful:", response.data);
      
      // Show success popup
      setShowPopup(true);
      
    } catch (err) {
      console.error("Error verifying email:", err);
      const backendData = err.response?.data;
      if (backendData) {
        setError(typeof backendData === "object" ? JSON.stringify(backendData) : String(backendData));
      } else {
        setError(err.message || "Failed to verify email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Navigate to Terms of Service page after closing popup
    navigate("/terms-of-service");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
      // Navigate to Terms of Service page after closing popup
      navigate("/terms-of-service");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-images.png)`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      {/* Left Panel */}
      <div className="flex w-full max-w-5xl h-[650px] bg-white rounded-3xl overflow-hidden relative">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center relative p-4">
          {/* Purple background behind logo/image */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col items-center justify-center relative">
            <h2 className="absolute top-6 left-6 text-2xl font-bold text-[#01373D] font-poppins-custom">Logo</h2>
            <img
              src="/loginlogo.png"
              alt="Profile"
              className="w-60 h-[360px] object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl text-[#001D21] mb-4">Verify Your Email</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">
                A verification code has been sent to <span className="text-[#9889FF] font-semibold">**{email}**</span>. Please check your email and enter the code below to activate your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-start space-x-2">
                {otp.map((digit, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CEC6FF] focus:border-transparent"
                      maxLength={1}
                      disabled={loading}
                    />
                    {index === 2 && (
                      <span className="mx-2 text-gray-400">-</span>
                    )}
                  </div>
                ))}
              </div>

              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-40 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#0A2A2E] font-poppins-custom">
                Didn't receive the code? <span className="text-[#9889FF] cursor-pointer hover:underline">Resend Code</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Success Popup Modal - Center of entire page */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01373DB2]/60 " onClick={handleBackdropClick}>
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative shadow-2xl">

            {/* Envelope + Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#CEC6FF] rounded-full flex items-center justify-center relative">
                <VerifyemailIcon />
                
              </div>
            </div>

            {/* Text */}
            <div className="text-center">
              <h2 className="text-2xl  text-[#001D21] mb-4">Verified Successfully</h2>
              <p className="text-[#0A2A2E] font-poppins-custom">
                Congratulations! your account
              </p>
              <p className="text-[#0A2A2E] font-poppins-custom">
                <span className="text-[#9889FF] font-semibold">{email}</span> has been verified.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerifyEmail;
