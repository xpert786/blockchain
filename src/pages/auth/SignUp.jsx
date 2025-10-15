import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/img/bg-images.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "Investor",
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
    console.log("Sign up form submitted:", formData);
    // Navigate to Create Password page
    navigate("/create-password");
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
        <div className="w-1/2 flex items-center justify-center p-3">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <h1 className="text-3xl text-[#001D21] mb-2">Create Account</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">Join our investment platform</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 !border border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

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
                  className="w-full px-4 py-3 !border border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 !border border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 !border border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="Investor">Investor</option>
                    <option value="Syndicate">Syndicate</option>
                    <option value="Both">Both</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer"
              >
                Continue
              </button>
            </form>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
