import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Removed external image imports that caused resolution errors:
 import bgImage from "../../assets/img/bg-images.png";
 import loginLogo from "../../assets/img/loginlogo.png";
 import logo from "/src/assets/img/logo.png";
 import loginimg from "/src/assets/img/loginimg1.svg";
 import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";

// Define VerifyemailIcon inline since it couldn't be resolved from external components/Icons
const VerifyemailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM20 6L12 11L4 6H20ZM4 18V7L12 12L20 7V18H4Z" fill="#0A3A38"/>
  </svg>
);


// Helper function to format errors (copied from SignUp for consistency)
const formatBackendError = (err) => {
    const backendData = err.response?.data;
    if (backendData) {
      if (typeof backendData === "object" && (backendData.detail || backendData.error)) {
        return backendData.detail || backendData.error;
      }
      return typeof backendData === "object" ? JSON.stringify(backendData) : String(backendData);
    }
    return err.message || "An unknown error occurred.";
};

const VerifyPhone = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("+1 ******3960");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const resolvePhone = () => {
      const storedUserData = localStorage.getItem("userData");
      let detectedPhone = null;

      if (storedUserData) {
        try {
          detectedPhone = JSON.parse(storedUserData)?.phone_number;
        } catch (e) {
          console.error("Could not parse userData from localStorage", e);
        }
      }
      
      if (detectedPhone && typeof detectedPhone === "string") {
        // Simple masking for display
        const lastFour = detectedPhone.slice(-4);
        setPhone(`+XX ******${lastFour}`);
      } else {
        // Fallback to original mock if phone number is not found
        setPhone("+1 ******3960");
      }
    };

    resolvePhone();
  }, []);


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

  // Function to trigger the code send for the specified method
  const triggerCodeSend = async (method) => {
    setResendLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/choose_verification_method/`;

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      console.log(`Triggering code send for ${method}:`, finalUrl);

      await axios.post(finalUrl, { method }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`Code successfully triggered for ${method}.`);
      return true;
    } catch (err) {
      console.error(`Error triggering code for ${method}:`, err);
      setError(formatBackendError(err));
      return false;
    } finally {
      setResendLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      setLoading(false);
      return;
    }

    try {
      // --- TEMPORARY BYPASS: Verification API call is skipped as requested ---
      console.log(`Phone verification API bypassed. Simulating success for OTP: ${otpCode}`);

      // Simulate network delay for better user experience
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      // Show success popup
      setShowPopup(true);

      // --- CRITICAL FLOW: Trigger the next verification (Email) ---
      // This ensures the Email code is sent before we navigate to /verify-email
      console.log("Attempting to trigger Email verification code...");
      await triggerCodeSend("email");
      
    } catch (err) {
      // Since the primary verification API is bypassed, any error here is likely from triggerCodeSend
      console.error("Error during phone verification bypass flow:", err);
      // Use the existing error set by triggerCodeSend
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Navigate to Verify Email page after closing popup
    navigate("/verify-email");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
      // Navigate to Verify Email page after closing popup
      navigate("/verify-email");
    }
  };

  // Handler for the Resend Code link
  const handleResendCode = () => {
    // --- TEMPORARY BYPASS: Skipping Resend API call for SMS as requested ---
    console.log("Resend SMS code requested. API is temporarily disabled (simulated).");
    // Optionally: triggerCodeSend("sms"); could be called here if the API was working
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative" 
      // Removed inline style background image due to unresolved path error
      style={{ backgroundColor: '#F0F4F8' }}
    >

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[650px] bg-white rounded-3xl overflow-hidden relative">
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
              <h1 className="text-3xl text-[#001D21] mb-4">Verify Your Phone</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">
                A verification code has been sent to <span className="text-[#9889FF] font-semibold">{phone}</span>. Please check your SMS and enter the code below to activate your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-center md:justify-start space-x-2">
                {otp.map((digit, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CEC6FF] focus:border-transparent"
                      maxLength={1}
                      disabled={loading || resendLoading}
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
                disabled={loading || resendLoading}
                className="w-full md:w-40 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#0A2A2E] font-poppins-custom">
                Didn't receive the code? 
                <span 
                  className={`text-[#9889FF] cursor-pointer hover:underline ${resendLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={handleResendCode}
                >
                  {resendLoading ? "Resending..." : "Resend Code"}
                </span>
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
              <h2 className="text-2xl  text-[#001D21] mb-4">Verified Successfully</h2>
              <p className="text-[#0A2A2E] font-poppins-custom">
                Congratulations! your account
              </p>
              <p className="text-[#0A2A2E] font-poppins-custom">
                <span className="text-[#9889FF] font-semibold">{phone}</span> has been verified.
              </p>
              <button
                onClick={handleClosePopup}
                className="w-full mt-4 bg-[#0A3A38] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200"
              >
                Continue to Email Verification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerifyPhone;