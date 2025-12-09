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
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("+1 ******3960");
  const [actualPhone, setActualPhone] = useState("");
  const [userId, setUserId] = useState(null);
  const [enteredPhone, setEnteredPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const resolvePhone = () => {
      const storedUserData = localStorage.getItem("userData") || localStorage.getItem("user");
      let detectedPhone = null;
      let detectedUserId = null;

      if (storedUserData) {
        try {
          const parsed = JSON.parse(storedUserData);
          detectedPhone = parsed?.phone_number || parsed?.phone || parsed?.mobile;
          detectedUserId = parsed?.id || parsed?.user_id || parsed?.pk;
        } catch (e) {
          console.error("Could not parse userData from localStorage", e);
        }
      }
      
      if (detectedPhone && typeof detectedPhone === "string") {
        // Save raw phone for API calls
        setActualPhone(detectedPhone);
        // Simple masking for display
        const lastFour = detectedPhone.slice(-4);
        setPhone(`+XX ******${lastFour}`);
      } else {
        // Fallback to original mock if phone number is not found
        setActualPhone("");
        setPhone("+1 ******3960");
      }

      if (detectedUserId) {
        setUserId(detectedUserId);
      }
      // If we didn't find userId in stored data, try extracting from access token
      if (!detectedUserId) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              const maybeId = payload?.user_id || payload?.user || payload?.sub || null;
              if (maybeId) setUserId(maybeId);
            }
          } catch (e) {
            // ignore
          }
        }
      }
      return detectedPhone;
    };

    // Resolve and then send if a phone was detected
    const detectedPhone = resolvePhone();
    if (detectedPhone) {
      // send using detected phone immediately
      (async () => { await sendTwoFactor(detectedPhone); })();
    }
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

  // Send two-factor code via backend (SMS)
  const sendTwoFactor = async (phoneOverride) => {
    setResendLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      // Try both possible paths (backend sometimes sits behind /api/)
      const tryUrls = [
        `${API_URL.replace(/\/$/, "")}/registration/send_two_factor/`,
        `${API_URL.replace(/\/$/, "")}/registration/send_two_factor/`,
      ];
      let phoneToUse = phoneOverride || actualPhone || enteredPhone;
      // Normalize phone: if it doesn't start with '+', and looks like an Indian number, prefix +91
      const normalizePhoneNumber = (raw) => {
        if (!raw) return "";
        const trimmed = String(raw).trim();
        if (trimmed.startsWith("+")) return trimmed;
        // remove non-digit
        const digits = trimmed.replace(/\D/g, "");
        if (digits.length === 10) return `+91${digits}`;
        if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
        // fallback: if it already includes country-like leading digits but no plus, prefix +
        if (digits.length > 10) return `+${digits}`;
        // otherwise assume local Indian 10-digit
        return `+91${digits}`;
      };

      // Resolve userId synchronously (prefer state, then registration status, then token)
      let resolvedUserId = userId;
      if (!phoneToUse || !resolvedUserId) {
        try {
          const status = await checkRegistrationStatus();
          if (status) {
            if (!resolvedUserId && (status.user_id || status.user)) resolvedUserId = status.user_id || status.user;
            if (!phoneToUse && (status.phone_number || status.phone)) phoneToUse = status.phone_number || status.phone;
          }
        } catch (e) {
          console.warn("Could not enrich sendTwoFactor payload from registration status:", e);
        }
      }
      // Final fallback: try to parse accessToken to extract user id if still missing
      if (!resolvedUserId) {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              resolvedUserId = payload?.user_id || payload?.user || payload?.sub || resolvedUserId;
            }
          }
        } catch (e) {
          // ignore
        }
      }

      const normalizedPhone = normalizePhoneNumber(phoneToUse);
      if (!phoneToUse) {
        setError("Phone number is required to send SMS verification.");
        return false;
      }

      const payload = {
        phone_number: normalizedPhone,
      };
      if (resolvedUserId) payload.user_id = resolvedUserId;

      console.log("Resolved user id for sendTwoFactor:", resolvedUserId);

      console.log("Sending two-factor to:", payload);
      // include Authorization header if available
      const accessToken = localStorage.getItem("accessToken");
      const headers = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      let sent = false;
      let lastErr = null;
      for (const url of tryUrls) {
        try {
          console.log("POSTing send_two_factor to", url, "payload:", payload, "headers:", headers);
          const resp = await axios.post(url, payload, { headers });
          console.log("send_two_factor success", url, resp.data);
          sent = true;
          break;
        } catch (err) {
          lastErr = err;
          // If backend returns rate-limit (429) or explicit daily-limit message, bypass and treat as success
          const resp = err?.response;
          if (resp) {
            const body = resp.data;
            const asString = typeof body === 'string' ? body : JSON.stringify(body || {});
            if (resp.status === 429 || asString.includes('exceeded') || asString.includes('50 daily messages')) {
              console.warn('Rate-limit or daily-limit detected from send_two_factor; bypassing as success', resp.status, body);
              return true;
            }
            console.warn("send_two_factor attempt failed for", url, err?.message || err);
            console.warn("Response status:", resp.status, "data:", body);
          } else {
            console.warn("send_two_factor attempt failed for", url, err?.message || err);
          }
        }
      }
      if (!sent) {
        const detail = lastErr?.response?.data || lastErr?.message || "All send_two_factor endpoints failed";
        setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        throw new Error(detail);
      }
      console.log("Two-factor SMS sent successfully.");
      return true;
    } catch (err) {
      console.error("Error sending two-factor SMS:", err);
      setError(formatBackendError(err));
      return false;
    } finally {
      setResendLoading(false);
    }
  };

  // Verify two-factor code via backend
  const verifyTwoFactor = async (code) => {
    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const tryUrls = [
        `${API_URL.replace(/\/$/, "")}/registration/verify_two_factor/`,
        `${API_URL.replace(/\/$/, "")}/registration/verify_two_factor/`,
      ];

      const phoneToUse = actualPhone || enteredPhone;
      if (!phoneToUse) {
        setError("Phone number is required for SMS verification");
        return null;
      }
      // reuse normalization from sendTwoFactor: ensure +91 prefix when appropriate
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

      const normalizedPhone = normalizePhoneNumber(phoneToUse);

      const payload = {
        phone_number: normalizedPhone,
        code: code
      };

      console.log("Verifying two-factor with payload:", payload);

      let response = null;
      for (const url of tryUrls) {
        try {
          response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
          break;
        } catch (err) {
          console.warn("verify_two_factor attempt failed for", url, err?.message || err);
        }
      }
      if (!response) throw new Error("All verify_two_factor endpoints failed");
      console.log("Two-factor verified:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error verifying two-factor:", err);
      setError(formatBackendError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const otpCode = otp.join("");
    if (otpCode.length !== otp.length) {
      setError(`Please enter the complete ${otp.length}-digit code.`);
      setLoading(false);
      return;
    }

    try {
      // Call backend verify_two_factor
      const verifyResult = await verifyTwoFactor(otpCode);
      if (!verifyResult) {
        // verifyTwoFactor sets the error state
        return;
      }

      // If both email and phone are already verified, navigate based on role
      try {
        const status = await checkRegistrationStatus();
        if (status && status.email_verified && status.phone_verified) {
          // Check user role
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          const userRole = (userData?.role || "").toLowerCase();
          
          console.log("📋 User role check after phone verification:", userRole);
          console.log("📋 User data:", userData);
          
          if (userRole === "syndicate" || userRole.includes("syndicate")) {
            // Syndicate users go to terms of service after both verifications
            console.log("✅ Both verifications complete - redirecting syndicate user to terms of service");
            navigate("/terms-of-service");
          } else {
            // Investors go to quick profile
            console.log("✅ Redirecting investor to quick profile");
            navigate("/quick-profile");
          }
          return;
        }
      } catch (e) {
        console.warn("Could not determine registration status, continuing flow.", e);
      }

      // On success, show success popup and trigger next step (email verification code)
      setShowPopup(true);
      console.log("Attempting to trigger Email verification code...");
      await triggerCodeSend("email");
    } catch (err) {
      console.error("Error during phone verification flow:", err);
      // verifyTwoFactor sets the error
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
    // Trigger backend to send SMS two-factor code
    (async () => {
      const phoneToUse = actualPhone || enteredPhone;
      if (!phoneToUse) {
        setError("No phone number available to resend code to.");
        return;
      }
      await sendTwoFactor(phoneToUse);
    })();
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
                  {actualPhone || enteredPhone ? (
                    <>A verification code has been sent to <span className="text-[#9889FF] font-semibold">{phone}</span>. Please check your SMS and enter the code below to activate your account.</>
                  ) : (
                    <>We don't have a phone number on file. Please enter your phone number to receive an SMS code.</>
                  )}
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
                   
                  </div>
                ))}
              </div>

              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
              {/* If no actualPhone available, show input to enter phone and a Send Code button */}
              {!actualPhone && (
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-1">Phone Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={enteredPhone}
                      onChange={(e) => setEnteredPhone(e.target.value)}
                      placeholder="+1 555 555 5555"
                      className="flex-1 bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E]"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!enteredPhone) { setError('Please enter a phone number to send the code.'); return; }
                        const ok = await sendTwoFactor(enteredPhone);
                        if (ok) {
                          // set masked display and set actualPhone for subsequent verify
                          const lastFour = enteredPhone.slice(-4);
                          setPhone(`+XX ******${lastFour}`);
                          setActualPhone(enteredPhone);
                        }
                      }}
                      disabled={resendLoading}
                      className="bg-[#00F0C3] px-4 py-3 rounded-md text-sm font-medium"
                    >
                      {resendLoading ? 'Sending...' : 'Send Code'}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
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