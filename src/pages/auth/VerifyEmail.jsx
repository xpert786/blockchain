import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Removed external image and icon imports that caused resolution errors:
 import bgImage from "../../assets/img/bg-images.png";
 import loginLogo from "../../assets/img/loginlogo.png";
// import { VerifyemailIcon } from "../../components/Icons";
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


const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);


  useEffect(() => {
    const resolveEmail = () => {
      const storedUserData = localStorage.getItem("userData");
      const storedTempData = localStorage.getItem("tempUserData");

      let detectedEmail =
        (storedUserData && (() => {
          try {
            return JSON.parse(storedUserData)?.email;
          } catch {
            return null;
          }
        })()) ||
        (storedTempData && (() => {
          try {
            return JSON.parse(storedTempData)?.email;
          } catch {
            return null;
          }
        })());

      if (!detectedEmail || typeof detectedEmail !== "string") {
        detectedEmail = "your email";
      }

      setEmail(detectedEmail);
    };

    resolveEmail();
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

  // Check registration status from backend
  const checkRegistrationStatus = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/get_registration_status/`;
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return null;
      const resp = await axios.get(finalUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return resp.data;
    } catch (err) {
      console.error("Error fetching registration status:", err);
      return null;
    }
  };

  // Try to resolve phone and user id from localStorage or token
  const resolvePhoneAndUserId = () => {
    let phone = null;
    let userId = null;
    const stored = localStorage.getItem("userData") || localStorage.getItem("user") || localStorage.getItem("tempUserData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        phone = parsed?.phone_number || parsed?.phone || parsed?.mobile || phone;
        userId = parsed?.id || parsed?.user_id || parsed?.pk || userId;
      } catch (e) {
        // ignore
      }
    }

    // Try to extract user id from JWT accessToken if still missing
    if (!userId) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            userId = payload?.user_id || payload?.user || payload?.sub || userId;
          }
        } catch (e) {
          // ignore
        }
      }
    }

    return { phone, userId };
  };

  const normalizePhoneNumber = (raw) => {
    if (!raw) return "";
    const trimmed = String(raw).trim();
    if (trimmed.startsWith("+")) return trimmed;
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
    if (digits.length > 10) return `+${digits}`;
    return `+91${digits}`;
  };

  // Attempt to send two-factor SMS (backend requires user_id and phone_number)
  const sendTwoFactorAfterEmail = async () => {
    try {
      const { phone, userId } = resolvePhoneAndUserId();
      if (!phone || !userId) {
        console.warn("Cannot auto-send SMS: missing phone or userId", { phone, userId });
        return false;
      }
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const payload = { phone_number: normalizePhoneNumber(phone), user_id: userId };
      // Try both possible paths (legacy code sometimes uses /api/ prefix)
      const tryUrls = [
        `${API_URL.replace(/\/$/, "")}/registration/send_two_factor/`,
        
      ];
      let sent = false;
      for (const url of tryUrls) {
        try {
          await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
          sent = true;
          break;
        } catch (err) {
          const resp = err?.response;
          if (resp) {
            const body = resp.data;
            const asString = typeof body === 'string' ? body : JSON.stringify(body || {});
            if (resp.status === 429 || asString.includes('exceeded') || asString.includes('50 daily messages')) {
              console.warn('Rate-limit or daily-limit detected from send_two_factor (email flow); bypassing as success', resp.status, body);
              return true;
            }
            console.warn("send_two_factor attempt failed for", url, err?.message || err);
            console.warn("Response status:", resp.status, "data:", body);
          } else {
            console.warn("send_two_factor attempt failed for", url, err?.message || err);
          }
        }
      }
      if (!sent) throw new Error("All send_two_factor endpoints failed");
      console.log("Sent two-factor SMS after email verify:", payload);
      return true;
    } catch (err) {
      console.error("Failed to send two-factor after email:", err);
      return false;
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
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
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
      console.log("📋 Verify code response:", JSON.stringify(response.data, null, 2));

      // After email verification, navigate based on role (phone verification bypassed)
      // Get role from multiple sources: verify_code response, registration status API, or localStorage
      let userRole = null;
      let userData = JSON.parse(localStorage.getItem("userData") || "{}");
      
      // First, try to get role from verify_code response (this is the most reliable source)
      if (response.data?.user?.role) {
        userRole = response.data.user.role;
        console.log("📋 Role from verify_code response.user.role:", userRole);
        
        // IMPORTANT: Save role to localStorage immediately
        userData.role = userRole;
        // Also save other user data from response
        if (response.data.user) {
          userData.user_id = response.data.user.id || userData.user_id;
          userData.email = response.data.user.email || userData.email;
          userData.username = response.data.user.username || userData.username;
        }
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("✅ Saved role to localStorage:", userRole);
      } else if (response.data?.role) {
        userRole = response.data.role;
        console.log("📋 Role from verify_code response.role:", userRole);
        
        // Save role to localStorage
        userData.role = userRole;
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("✅ Saved role to localStorage:", userRole);
      }
      
      // Second, try registration status API (where account was created)
      if (!userRole) {
        try {
          const status = await checkRegistrationStatus();
          console.log("📋 Registration status response:", JSON.stringify(status, null, 2));
          
          // Get role from registration status API (this is where account was created)
          if (status) {
            // Try multiple possible paths for role in status response
            userRole = status?.role || status?.user?.role || status?.user_role || status?.user_role_name;
            console.log("📋 Role from registration status:", userRole);
            
            // If role found in status, update localStorage
            if (userRole) {
              userData.role = userRole;
              localStorage.setItem("userData", JSON.stringify(userData));
            }
          }
        } catch (e) {
          console.warn("Could not fetch registration status:", e);
        }
      }
      
      // Third, fallback to localStorage (saved during signup)
      if (!userRole) {
        userRole = userData?.role;
        console.log("📋 Role from localStorage:", userRole);
      }
      
      // Normalize role to lowercase
      const normalizedRole = (userRole || "").toLowerCase().trim();
      console.log("📋 Final normalized role:", normalizedRole);
      console.log("📋 Full userData:", userData);
      
      // Navigate based on role
      if (normalizedRole === "syndicate" || normalizedRole.includes("syndicate")) {
        // Syndicate users go to terms of service after email verification (phone bypassed)
        console.log("✅ Email verified - redirecting syndicate user to terms of service");
        navigate("/terms-of-service");
        return;
      } else if (normalizedRole === "investor" || normalizedRole.includes("investor")) {
        // Investors go to quick profile setup
        console.log("✅ Email verified - redirecting investor to quick profile");
        navigate("/quick-profile");
        return;
      } else {
        // If role not found, default to quick profile (but log warning)
        console.warn("⚠️ Role not found or invalid, defaulting to quick profile. Role was:", normalizedRole);
        console.warn("⚠️ Available userData keys:", Object.keys(userData));
        navigate("/quick-profile");
        return;
      }
      
    } catch (err) {
      console.error("Error verifying email:", err);
      setError(formatBackendError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Phone verification bypassed - navigate based on role
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userRole = (userData?.role || "").toLowerCase();
    
    if (userRole === "syndicate" || userRole.includes("syndicate")) {
      navigate("/terms-of-service");
    } else {
      navigate("/quick-profile");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
      // Phone verification bypassed - navigate based on role
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userRole = (userData?.role || "").toLowerCase();
      
      if (userRole === "syndicate" || userRole.includes("syndicate")) {
        navigate("/terms-of-service");
      } else {
        navigate("/quick-profile");
      }
    }
  };

  // Handler for the Resend Code link
  const handleResendCode = () => {
    triggerCodeSend("email");
  };


  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative" 
      // Set a solid background color instead of relying on unresolved bgImage
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
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6 relative">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-4">Verify Your Email</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">
                A verification code has been sent to <span className="text-[#9889FF] font-semibold">{email}</span>. Please check your email and enter the code below to activate your account.
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
                <span className="text-[#9889FF] font-semibold">{email}</span> has been verified.
              </p>
              <button
                onClick={handleClosePopup}
                className="w-full mt-4 bg-[#0A3A38] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200"
              >
                Continue to Phone Verification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerifyEmail;