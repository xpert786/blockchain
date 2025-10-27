import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import {EmailIcon, PhoneIcon} from "../../components/Icons";

const SecureAccount2FA = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerificationMethod = async (method) => {
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const finalUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/choose_verification_method/`;
      
      const payload = {
        method: method
      };

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      console.log("Sending verification method:", payload);
      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("Verification method set successfully:", response.data);
      
      // Navigate based on method
      if (method === "email") {
        navigate("/verify-email");
      } else if (method === "sms") {
        navigate("/verify-phone");
      }
      
    } catch (err) {
      console.error("Error setting verification method:", err);
      const backendData = err.response?.data;
      if (backendData) {
        setError(typeof backendData === "object" ? JSON.stringify(backendData) : String(backendData));
      } else {
        setError(err.message || "Failed to set verification method.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = () => {
    handleVerificationMethod("email");
  };

  const handlePhoneClick = () => {
    handleVerificationMethod("sms");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      {/* Left Panel */}
      <div className="flex w-full max-w-5xl h-[650px] bg-white rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center relative p-4">
          {/* Purple background behind logo/image */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col items-center justify-center relative">
            <h2 className="absolute top-6 left-6 text-2xl font-bold text-[#01373D] font-poppins-custom">Logo</h2>
            <img
              src={loginLogo}
              alt="Profile"
              className="w-60 h-[360px] object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl text-[#001D21] mb-4">Secure Your Account With 2FA</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">Two-Factor Authentication adds an extra security layer, protecting your account with a code and password.</p>
            </div>
            
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

            <div className="space-y-4">
              {/* Email Option */}
              <div 
                onClick={handleEmailClick}
                className={`flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-12 h-12 bg-[#CEC6FF] rounded-lg flex items-center justify-center mr-4">
                  <EmailIcon/> 
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#001D21] mb-1">Email</h3>
                  <p className="text-sm text-[#0A2A2E] font-poppins-custom">We'll send a verification code to your email address.</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Phone Option - Static Navigation */}
              <div 
                onClick={() => navigate("/verify-phone")}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-[#CEC6FF] rounded-lg flex items-center justify-center mr-4">
                 <PhoneIcon/>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#001D21] mb-1">Phone</h3>
                  <p className="text-sm text-[#0A2A2E] font-poppins-custom">We'll send an SMS with a verification code to your Phone</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
