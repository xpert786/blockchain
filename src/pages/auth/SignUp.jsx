import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import bgImage from "../../assets/img/bg-images.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Generate username from fullName
    const username = formData.fullName.toLowerCase().replace(/\s+/g, "");
    
    // Save form data to localStorage (without API call)
    const tempUserData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      username: username,
      role: formData.role === "Investor" ? "investor" : "syndicate_manager",
    };

    localStorage.setItem("tempUserData", JSON.stringify(tempUserData));
    
    console.log("Form data saved to localStorage:", tempUserData);
    
    // Navigate to create password
    navigate("/create-password");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}bg-images.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex w-full max-w-5xl h-[650px] bg-white rounded-3xl overflow-hidden">
        <div className="w-1/2 flex items-center justify-center relative p-4">
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col items-center justify-center relative">
            <h2 className="absolute top-6 left-6 text-2xl font-bold text-[#01373D]">
              Logo
            </h2>
            <img src="/loginlogo.png" alt="Profile" className="w-60 h-[360px] object-cover rounded-xl" />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center p-3">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <h1 className="text-3xl text-[#001D21] mb-2">Create Account</h1>
              <p className="text-[#0A2A2E]">Join our investment platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="fullName" className="block text-sm text-[#0A2A2E] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-[#0A2A2E] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm text-[#0A2A2E] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm text-[#0A2A2E] mb-2">
                  Role
                </label>
                <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none" required>
                  <option value="">Select Role</option>
                  <option value="Investor">Investor</option>
                  <option value="Syndicate">Syndicate Manager</option>
                </select>
              </div>

              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

              {/* <button type="submit" disabled={loading} className="w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 disabled:opacity-50">
                {loading ? "Creating Account..." : "Continue"}
              </button> */}
               <button
                type="submit"
                className="w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 disabled:opacity-50"
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
