import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Get temp user data from localStorage (saved during SignUp)
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
        email: tempUserData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        full_name: tempUserData.fullName,
        phone_number: tempUserData.phoneNumber,
        role: role,
      };
      
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
      setShowErrorPopup(true);
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
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative p-6 md:p-4 h-64 md:h-full">
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <h2 className="absolute top-4 left-4 md:top-6 md:left-6 text-lg md:text-2xl font-bold text-[#01373D]">Logo</h2>
            <img src={loginLogo} alt="Profile" className="w-40 h-40 md:w-60 md:h-[360px] object-cover rounded-xl" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6">
          <div className="w-full max-w-md">
            <h1 className="text-3xl text-[#001D21] mb-2 text-center md:text-left">Create Password</h1>
            <p className="text-[#0A2A2E] mb-4 text-center md:text-left">
              Use at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters.
            </p>

            {error && !showErrorPopup && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
              </div>

              <button
                type="submit"
                className="w-full md:w-40 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>

      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-[#001D21] bg-opacity-70"
            onClick={() => setShowErrorPopup(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FFC371] h-2 w-full" />
            <div className="px-6 py-8 text-center space-y-4">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-[#FFE8E8]">
                <span className="text-3xl text-[#FF4D4D]">!</span>
              </div>
              <div>
                  
                <p className="text-[#0A2A2E]">{error}</p>
              </div>
              <button
                onClick={() => setShowErrorPopup(false)}
                className="w-full bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 rounded-xl hover:bg-[#00E6B0] transition-colors duration-200"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePassword;
