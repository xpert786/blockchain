import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import bgImage from "../../assets/img/bg-images.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password form submitted:", formData);
    // Navigate to OTP verification page
    navigate("/otp-verification");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-images.png)`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      {/* Left Panel */}
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-3xl overflow-hidden">
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
              <h1 className="text-3xl text-[#001D21] mb-2">Forgot Password ?</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">Please enter your valid email account to send the verification code to reset your password.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 !border !border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                
                className="w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer"
              >
                Send Code
              </button>
              
            </form>

            {/* Resend Code Link */}
            <div className="mt-6 text-start">
              <p className="text-[#0A2A2E]">
                Didn't receive the code?{" "}
                <Link to="/otp-verification" className="text-[#CEC6FF] hover:text-[#B8A8E8] font-semibold underline">
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

export default ForgotPassword;
