import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email] = useState("john@gmail.com"); 

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("OTP submitted:", otpCode);
    // Navigate to Set New Password page
    navigate("/set-new-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative p-6 md:p-4 h-64 md:h-full">
          {/* Purple background behind logo/image */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <h2 className="absolute top-4 left-4 md:top-6 md:left-6 text-lg md:text-2xl font-bold text-[#01373D] font-poppins-custom">Logo</h2>
            <img
              src={loginLogo}
              alt="Profile"
              className="w-40 h-40 md:w-60 md:h-[360px] object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-2">OTP Verification</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">
                A verification code has been sent to <span className="text-[#CEC6FF] font-semibold">{email}</span>. Please check your email and enter the code below to activate your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-2xl font-bold border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none "
                    maxLength={1}
                    required
                  />
                ))}
              </div>


              <button
                type="submit"
                className="w-full md:w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer"
              >
                Continue
              </button>
            </form>

            {/* Resend Code Link */}
            <div className="mt-6 text-center md:text-start">
              <p className="text-[#0A2A2E]">
                Didn't receive the code?{" "}
                <Link to="/resend-code" className="text-[#CEC6FF] hover:text-[#B8A8E8] font-semibold underline">
                  Resend Code
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
