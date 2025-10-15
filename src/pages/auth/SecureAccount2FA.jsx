import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/img/bg-images.png";
import {EmailIcon, PhoneIcon} from "../../components/Icons";

const SecureAccount2FA = () => {
  const navigate = useNavigate();

  const handleEmailClick = () => {
    navigate("/verify-email");
  };

  const handlePhoneClick = () => {
    navigate("/verify-phone");
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
              src="/loginlogo.png"
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
            
            <div className="space-y-4">
              {/* Email Option */}
              <div 
                onClick={handleEmailClick}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
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

              {/* Phone Option */}
              <div 
                onClick={handlePhoneClick}
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
