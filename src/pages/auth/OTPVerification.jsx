import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import logo from "/src/assets/img/logo.png";

import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  // Get email from location state or localStorage
  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("resetPasswordEmail");
    const userEmail = emailFromState || emailFromStorage || "";
    setEmail(userEmail);
    
    if (!userEmail) {
      // If no email found, redirect back to forgot password
      navigate("/forgot-password");
    }
  }, [location.state, navigate]); 

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
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
    const otpCode = otp.join("");
    
    if (otpCode.length !== 4) {
      setError("Please enter the complete 4-digit OTP code.");
      return;
    }

    if (!email) {
      setError("Email not found. Please start over.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const verifyOtpUrl = `${API_URL.replace(/\/$/, "")}/auth/verify_reset_otp/`;

      console.log("Verifying OTP:", verifyOtpUrl);
      console.log("Email:", email);
      console.log("OTP:", otpCode);

      const response = await axios.post(verifyOtpUrl, {
        email: email,
        otp: otpCode
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("OTP verification response:", response.data);

      if (response.data) {
        // Store email and OTP for password reset
        localStorage.setItem("resetPasswordEmail", email);
        localStorage.setItem("resetPasswordOtp", otpCode);
        
        // Navigate to Set New Password page
        navigate("/set-new-password", {
          state: { email: email, otp: otpCode }
        });
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const backendData = err.response?.data;
      
      if (backendData) {
        if (typeof backendData === "object") {
          const errorMsg = backendData.error || 
                          backendData.detail || 
                          backendData.message ||
                          backendData.otp?.[0] ||
                          JSON.stringify(backendData);
          setError(errorMsg);
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Invalid OTP code. Please try again.");
      }
      
      // Clear OTP on error
      setOtp(["", "", "", ""]);
      // Focus first input
      const firstInput = document.getElementById("otp-0");
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email not found. Please start over.");
      navigate("/forgot-password");
      return;
    }

    setResending(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const forgotPasswordUrl = `${API_URL.replace(/\/$/, "")}/auth/forgot_password/`;

      const response = await axios.post(forgotPasswordUrl, {
        email: email
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Resend code response:", response.data);
      
      // Clear OTP inputs
      setOtp(["", "", "", ""]);
      
      // Show success message
      alert("Verification code has been resent to your email.");
      
      // Focus first input
      const firstInput = document.getElementById("otp-0");
      if (firstInput) firstInput.focus();
    } catch (err) {
      console.error("Resend code error:", err);
      const backendData = err.response?.data;
      
      if (backendData) {
        if (typeof backendData === "object") {
          const errorMsg = backendData.error || 
                          backendData.detail || 
                          backendData.message ||
                          JSON.stringify(backendData);
          setError(errorMsg);
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to resend code. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full">
          {/* Purple background and content layout */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col justify-between relative overflow-hidden p-8">
            
            {/* Logo/Branding (Top) */}
            <img src={logo} alt="Login Logo" className="w-1/3 max-w-[150px] h-auto object-contain" />
            
            {/* Main Text Content (Middle - Takes up remaining space) */}
            <div className="flex flex-col items-center justify-center flex-grow ">
                <h1 className="text-[30px] font-semibold text-white font-poppins-custom">Invest Globally. <br />
                Compliantly. Confidently.</h1>
                <p className="text-white font-poppins-custom leading-tight mr-16 mt-2">Built for global accredited investors and <br />
                syndicate leads.</p>
            </div>
            

            {/* Image Content (Bottom - MOVED HERE) */}
            <div className="flex justify-start items-end w-full space-x-3 mt-7">
              <img src={loginimg} alt="Login Asset 1" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg2} alt="Login Asset 2" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg3} alt="Login Asset 3" className="w-1/3 max-w-[50px] h-auto object-contain" />
            </div>
            
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-2">OTP Verification</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">
                A verification code has been sent to <span className="text-[#CEC6FF] font-semibold">{email || "your email"}</span>. Please check your email and enter the code below to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* OTP Input Fields */}
              <div className="flex justify-center md:justify-start space-x-3 md:space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-2xl font-bold border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none disabled:opacity-50"
                    maxLength={1}
                    required
                    disabled={loading}
                  />
                ))}
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* Resend Code Link */}
            <div className="mt-6 text-center md:text-start">
              <p className="text-[#0A2A2E]">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="text-[#CEC6FF] hover:text-[#B8A8E8] font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Resending..." : "Resend Code"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
