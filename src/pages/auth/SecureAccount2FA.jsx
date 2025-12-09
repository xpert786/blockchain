import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import logo from "/src/assets/img/logo.png";

import loginimg from "/src/assets/img/loginimg1.svg";
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";
import { EmailIcon, PhoneIcon } from "../../components/Icons";
import { useState } from "react";

const SecureAccount2FA = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ ONLY EMAIL CALLS API NOW
  const handleEmailMethod = async () => {
    // First check current registration status; if email verified, navigate appropriately (phone bypassed)
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const statusUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/get_registration_status/`;
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const st = await axios.get(statusUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
        const status = st?.data;
        if (status) {
          // Redirect if email is verified (phone verification bypassed)
          if (status.email_verified) {
            // Check user role
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const userRole = (userData?.role || "").toLowerCase();
            
            if (userRole === "syndicate" || userRole.includes("syndicate")) {
              // Syndicate users go to terms of service after email verification
              navigate("/terms-of-service");
            } else {
              // Investors go to quick profile
              navigate("/quick-profile");
            }
            return;
          }
        }
      }

      // Not verified yet (or couldn't determine) — proceed to request email method
      setLoading(true);
      setError("");

      const finalUrl = `${(import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend").replace(/\/$/, "")}/registration-flow/choose_verification_method/`;
      const payload = { method: "email" };

      const access = localStorage.getItem("accessToken");
      if (!access) {
        const errorMsg = "No access token found. Please complete your registration or login again.";
        setError(errorMsg);
        setLoading(false);
        console.error("❌ No access token in localStorage");
        console.log("Available localStorage keys:", Object.keys(localStorage));
        return;
      }

      console.log("🔐 Attempting to set email verification method...");
      console.log("API URL:", finalUrl);
      console.log("Token exists:", !!access);
      console.log("Token length:", access.length);

      const response = await axios.post(finalUrl, payload, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Email verification method set:", response.data);
      navigate("/verify-email");
    } catch (err) {
      console.error("❌ Error setting email verification:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      const backendData = err.response?.data;
      
      // Handle 401 Unauthorized specifically
      if (err.response?.status === 401) {
        const errorMsg = "Your session has expired or the access token is invalid. Please try logging in again or complete your registration.";
        setError(errorMsg);
        
        // Optionally clear invalid token
        console.warn("⚠️ Clearing potentially invalid access token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else if (backendData) {
        // Format backend error message
        let errorMsg = "";
        if (typeof backendData === "object") {
          if (backendData.detail) {
            errorMsg = backendData.detail;
          } else if (backendData.error) {
            errorMsg = backendData.error;
          } else if (backendData.message) {
            errorMsg = backendData.message;
          } else {
            errorMsg = JSON.stringify(backendData);
          }
        } else {
          errorMsg = String(backendData);
        }
        setError(errorMsg || "Failed to set verification method.");
      } else {
        setError(err.message || "Failed to set verification method. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ❌ PHONE NO LONGER USES API — ONLY NAVIGATION, but pre-check status first
  const handlePhoneClick = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const statusUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/get_registration_status/`;
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const st = await axios.get(statusUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
        const status = st?.data;
        if (status) {
          // Only redirect if BOTH email and phone are verified
          if (status.phone_verified && status.email_verified) {
            // Check user role
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const userRole = (userData?.role || "").toLowerCase();
            
            if (userRole === "syndicate" || userRole.includes("syndicate")) {
              // Syndicate users go to terms of service after both verifications
              navigate("/terms-of-service");
            } else {
              // Investors go to quick profile
              navigate("/quick-profile");
            }
            return;
          }
          // If phone verified but email not, go to email verification
          if (status.phone_verified && !status.email_verified) {
            navigate("/verify-email");
            return;
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch registration status before phone navigation:", err);
      // fall-through to default navigation
    }
    navigate("/verify-phone");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[650px] bg-white rounded-3xl overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full">
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col justify-between relative overflow-hidden p-8">
            <img src={logo} alt="Login Logo" className="w-1/3 max-w-[150px]" />

            <div className="flex flex-col items-center justify-center flex-grow">
              <h1 className="text-[30px] font-semibold text-white font-poppins-custom">
                Invest Globally. <br /> Compliantly. Confidently.
              </h1>
              <p className="text-white mt-2 leading-tight mr-16 font-poppins-custom">
                Built for global accredited investors and <br /> syndicate leads.
              </p>
            </div>

            <div className="flex space-x-3 mt-7">
              <img src={loginimg} className="w-1/3 max-w-[50px]" />
              <img src={loginimg2} className="w-1/3 max-w-[50px]" />
              <img src={loginimg3} className="w-1/3 max-w-[50px]" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-4">Secure Your Account With 2FA</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">
                Two-Factor Authentication adds an extra security layer.
              </p>
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

            <div className="space-y-4">

              {/* EMAIL OPTION */}
              <div
                onClick={handleEmailMethod}
                className={`flex items-center p-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#CEC6FF] rounded-lg flex items-center justify-center mr-4">
                  <EmailIcon />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#001D21]">Email</h3>
                  <p className="text-sm text-[#0A2A2E] font-poppins-custom">
                    We'll send a verification code to your email.
                  </p>
                </div>
                <div className="text-gray-400">
                  ➜
                </div>
              </div>

              {/* PHONE OPTION — NO API CALL */}
              <div
                onClick={handlePhoneClick}
                className="flex items-center p-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-[#CEC6FF] rounded-lg flex items-center justify-center mr-4">
                  <PhoneIcon />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#001D21]">Phone</h3>
                  <p className="text-sm text-[#0A2A2E] font-poppins-custom">
                    We'll verify your phone number.
                  </p>
                </div>
                <div className="text-gray-400">
                  ➜
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAccount2FA;
