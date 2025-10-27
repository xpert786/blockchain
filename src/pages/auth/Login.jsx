import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/config";
import bgImage from "../../assets/img/bg-images.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalUrl = config.getApiUrl('users/login/');
      console.log("Final URL:", finalUrl);
      
      const payload = {
        username: formData.username,
        password: formData.password,
      };
      console.log("Payload:", payload);

      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Login successful:", response.data);

      // Save tokens if returned
      if (response.data?.tokens) {
        localStorage.setItem("accessToken", response.data.tokens.access);
        localStorage.setItem("refreshToken", response.data.tokens.refresh);
        
        // Save user data
        localStorage.setItem("userData", JSON.stringify({
          user_id: response.data.user_id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          is_active: response.data.is_active,
          date_joined: response.data.date_joined,
        }));
      }

      // Navigate based on user role
      const userRole = response.data?.role || JSON.parse(localStorage.getItem("userData") || "{}").role;
      console.log("User role:", userRole);
      
      if (userRole === "syndicate_manager") {
        navigate("/syndicate-creation");
      } else if (userRole === "investor") {
        navigate("/");
      } else {
        // Default fallback
        navigate("/");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          if (backendData.non_field_errors) {
            setError(backendData.non_field_errors[0]);
          } else if (backendData.username) {
            setError(backendData.username[0]);
          } else if (backendData.password) {
            setError(backendData.password[0]);
          } else {
            setError(JSON.stringify(backendData));
          }
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>


      {/* Left Panel */}
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-3xl  overflow-hidden">
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
              <h1 className="text-3xl  text-[#001D21] mb-2">Welcome Back</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">Sign in to your account to continue</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
              
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm  text-[#0A2A2E] font-poppins-custom mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 !border !border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none "
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-2 outline-none">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 !border border-0.5px border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none "
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

             
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#0A2A2E] font-poppins-custom">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-[#ED1C24] hover:text-red-700">
                  Forgot password?
                </Link>
              </div>

            
              <button
                type="submit"
                disabled={loading}
                className="w-30 bg-[#00F0C3] text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>


            </form>

          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;
