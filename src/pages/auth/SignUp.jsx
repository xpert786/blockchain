import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";
import logo from "/src/assets/img/logo.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatBackendError = (data) => {
    if (!data) return "Failed to create account.";

    if (typeof data === "string") return data;

    if (Array.isArray(data)) {
      return data
        .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
        .join(" ");
    }

    if (typeof data === "object") {
      if (data.error) return formatBackendError(data.error);
      if (data.detail) return formatBackendError(data.detail);

      const messages = Object.entries(data).map(([key, value]) => {
        const formattedValue = Array.isArray(value) ? value.join(" ") : formatBackendError(value);
        return `${key.replace(/_/g, " ")}: ${formattedValue}`;
      });

      return messages.join(" ");
    }

    return "Failed to create account.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Get temp user data from localStorage (saved during RoleSelect)
      const tempUserData = JSON.parse(localStorage.getItem("tempUserData") || "{}");
      
      // Verify role is present and valid
      if (!tempUserData.role) {
        setError("Role is missing. Please go back and select a role.");
        return;
      }
      
      // Ensure role is in correct format (lowercase: "investor" or "syndicate")
      const role = tempUserData.role.toLowerCase();
      if (role !== "investor" && role !== "syndicate") {
        setError(`Invalid role: ${tempUserData.role}. Role must be "investor" or "syndicate".`);
        return;
      }
      
      // Complete payload with SignUp data + Password - using correct endpoint format
      const payload = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        role: role,
      };
      
      // Update localStorage with complete user data including role
      localStorage.setItem("tempUserData", JSON.stringify({
        ...tempUserData,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: role
      }));
      
      console.log("=== Registration Debug ===");
      console.log("Raw tempUserData:", tempUserData);
      console.log("Role from localStorage:", tempUserData.role);
      console.log("Normalized role:", role);
      console.log("✅ ROLE IS INCLUDED IN PAYLOAD:", role);
      console.log("Full payload:", payload);
      console.log("📤 PAYLOAD WITH ROLE:", JSON.stringify(payload, null, 2));

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      // Match the curl command endpoint: /api/registration-flow/register/
      const finalUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/register/`;
      
      console.log("🔗 Calling registration API:", finalUrl);
      console.log("📦 Final payload being sent (includes role):", {
        email: payload.email,
        full_name: payload.full_name,
        phone_number: payload.phone_number,
        role: payload.role, // ✅ Role is here!
        password: "***hidden***",
        confirm_password: "***hidden***"
      });
      
      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Account created successfully:", response.data);

      // Save tokens if returned
      if (response.data?.tokens) {
        localStorage.setItem("accessToken", response.data.tokens.access);
        localStorage.setItem("refreshToken", response.data.tokens.refresh);
        
        // Save complete user data
        localStorage.setItem("userData", JSON.stringify({
          user_id: response.data.user_id,
          email: response.data.email,
          phone_number: response.data.phone_number,
          full_name: response.data.full_name,
          role: response.data.role,
        }));
      }

      // Clear temp data
      localStorage.removeItem("tempUserData");

      // Navigate to SecureAccount2FA after successful registration
      navigate("/secure-account-2fa");
    } catch (err) {
      console.error("Error creating account:", err);
      const backendData = err.response?.data;
      const message = backendData ? formatBackendError(backendData) : err.message;
      setError(message || "Failed to create account.");
    }
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
        <div className="w-full md:w-1/2 flex items-center justify-center relative h-64 md:h-full">
        <div className="w-full flex relative p-6 md:p-4 h-64 md:h-full">
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
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-3">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-4 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-1">Create Account</h1>
              <p className="text-[#0A2A2E]">Join our investment platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-3">
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

              {/* Password */}
              <div>
                <label className="block text-sm text-[#0A2A2E] mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    className="w-full px-4 py-3 pr-12 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-[#0A2A2E] mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 pr-12 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="flex flex-row items-center justify-start mt-2">
                <input
                    type="checkbox"
                    id="termsAndConditions"
                    name="termsAndConditions"
                    checked={formData.termsAndConditions}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2]"
                  />
                  <label htmlFor="termsAndConditions" className="ml-2 block text-thin text-xs text-[#0A2A2E`] font-poppins-custom">I want to enable 2-Factor Authentication automatically</label>
                  </div>
              </div>


              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

              {/* <button type="submit" disabled={loading} className="w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 disabled:opacity-50">
                {loading ? "Creating Account..." : "Continue"}
              </button> */}
               <button
                 type="submit"
                 className="w-full  bg-[#0A3A38] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 disabled:opacity-50"
               >
                 Create Account
               </button>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
