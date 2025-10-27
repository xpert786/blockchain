import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import bgImage from "../../assets/img/bg-images.png";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      
      // Complete payload with SignUp data + Password
      const payload = {
        username: tempUserData.username,
        email: tempUserData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        role: tempUserData.role,
      };
      
      console.log("Creating account with role:", tempUserData.role);
      console.log("Full payload:", payload);

      const API_URL = import.meta.env.VITE_API_URL;
      const finalUrl = `${API_URL.replace(/\/$/, "")}/users/register/`;
      
      const response = await axios.post(finalUrl, payload);

      console.log("Account created successfully:", response.data);

      // Save tokens if returned
      if (response.data?.tokens) {
        localStorage.setItem("accessToken", response.data.tokens.access);
        localStorage.setItem("refreshToken", response.data.tokens.refresh);
        
        // Save complete user data
        localStorage.setItem("userData", JSON.stringify({
          user_id: response.data.user_id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          is_active: response.data.is_active,
          date_joined: response.data.date_joined,
        }));
      }

      // Clear temp data
      localStorage.removeItem("tempUserData");

      // Navigate to next page
      navigate("/secure-account-2fa");
    } catch (err) {
      console.error("Error creating account:", err);
      const backendData = err.response?.data;
      if (backendData) {
        setError(typeof backendData === "object" ? JSON.stringify(backendData) : String(backendData));
      } else {
        setError(err.message || "Failed to create account.");
      }
    }
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
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center relative p-4">
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col items-center justify-center relative">
            <h2 className="absolute top-6 left-6 text-2xl font-bold text-[#01373D]">Logo</h2>
            <img src="/loginlogo.png" alt="Profile" className="w-60 h-[360px] object-cover rounded-xl" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <h1 className="text-3xl text-[#001D21] mb-2">Create Password</h1>
            <p className="text-[#0A2A2E] mb-4">
              Use at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters.
            </p>

            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-40 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200"
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

export default CreatePassword;
