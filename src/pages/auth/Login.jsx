import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Correcting paths/typos for assets. Assuming 'bg-images.png' and others exist under src/assets/img.
import bgImage from "/src/assets/img/bg-images.png";
import logo from "/src/assets/img/logo.png";
import loginLogo from "/src/assets/img/loginlogo.png";
import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";

// Helper function to decode JWT token and extract user_id
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleSelectModal, setShowRoleSelectModal] = useState(false);

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
      // NOTE: For live environments, ensure VITE_API_URL is correctly defined and secured.
      const API_URL = import.meta.env.VITE_API_URL;
      console.log("API_URL:", API_URL);

      const finalUrl = `${API_URL.replace(/\/$/, "")}/users/login/`;
      console.log("Final URL:", finalUrl);

      const payload = {
        email: formData.email,
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
      console.log("Full response data:", JSON.stringify(response.data, null, 2));

      // Save tokens if returned first
      let savedAccessToken = null;
      if (response.data?.tokens || response.data?.access) {
        savedAccessToken = response.data?.tokens?.access || response.data?.access;
        const refreshToken = response.data?.tokens?.refresh || response.data?.refresh;

        if (savedAccessToken) {
          localStorage.setItem("accessToken", savedAccessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }

      // Extract user data - check multiple possible locations for role
      const userInfo = response.data?.user || response.data;
      // Check for role in tokens object first, then root level, then user object
      const userRole = response.data?.tokens?.role || response.data?.role || userInfo?.role;

      // Extract user_id - try from response first, then from JWT token
      let userId = userInfo?.id || userInfo?.user_id || response.data?.user_id;
      if (!userId && savedAccessToken) {
        // Try to extract from JWT token
        const decodedToken = decodeJWT(savedAccessToken);
        if (decodedToken && decodedToken.user_id) {
          userId = decodedToken.user_id;
          console.log("✅ Extracted user_id from JWT token:", userId);
        }
      }

      const username = userInfo?.username || response.data?.username;
      const email = userInfo?.email || response.data?.email;
      const isActive = userInfo?.is_active || response.data?.is_active;
      const dateJoined = userInfo?.date_joined || response.data?.date_joined;

      console.log("=== Login Role Debug ===");
      console.log("Full response data:", response.data);
      console.log("response.data.tokens:", response.data?.tokens);
      console.log("response.data.tokens.role:", response.data?.tokens?.role);
      console.log("response.data.role:", response.data?.role);
      console.log("userInfo.role:", userInfo?.role);
      console.log("Raw role from response:", userRole);
      console.log("User info:", userInfo);
      console.log("Extracted user_id:", userId);

      // Save user data
      const userData = {
        user_id: userId,
        username: username,
        email: email,
        role: userRole,
        is_active: isActive,
        date_joined: dateJoined,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("User data saved to localStorage:", userData);

      // Verify user_id is present
      if (!userId) {
        console.error("❌ user_id is missing! Cannot proceed without user_id.");
        setError("Login successful but user ID is missing. Please contact support.");
        setLoading(false);
        return;
      }

      // Verify tokens and userData are saved before navigation
      const savedToken = localStorage.getItem("accessToken");
      const savedUserData = localStorage.getItem("userData");
      console.log("Verification - Token saved:", !!savedToken);
      console.log("Verification - UserData saved:", !!savedUserData);

      if (!savedToken || !savedUserData) {
        console.error("❌ Tokens or userData not saved properly!");
        setError("Failed to save login information. Please try again.");
        setLoading(false);
        return;
      }

      // Navigate to dashboard based on user role - simple redirect
      const normalizedRole = (userRole || "").toLowerCase().trim();
      console.log("=== Navigation Decision ===");
      console.log("User role:", userRole);
      console.log("Normalized role (lowercase, trimmed):", normalizedRole);
      console.log("Is empty?", !normalizedRole || normalizedRole === "");

      // Determine target path based on role
      if (normalizedRole && (normalizedRole === "syndicate" || normalizedRole === "syndicate_manager" || normalizedRole.includes("syndicate"))) {
        console.log("✅ Redirecting syndicate user to manager panel dashboard");
        setLoading(false);
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          navigate("/manager-panel/dashboard", { replace: true });
        }, 100);
      } else if (normalizedRole === "investor") {
        console.log("✅ Redirecting investor user to dashboard");
        setLoading(false);
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          navigate("/investor-panel/dashboard", { replace: true });
        }, 100);
      } else {
        // No role or unknown role - show role selection modal
        console.warn("⚠️ Unknown or missing role, showing role selection modal.");
        console.warn("Role value:", normalizedRole);
        console.warn("Full userData:", userData);
        setLoading(false);
        setShowRoleSelectModal(true);
        setError(""); // Clear any errors
      }

    } catch (err) {
      console.error("Login error:", err);

      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors - check for error field first
          const errorMsg = backendData.error ||
            backendData.non_field_errors?.[0] ||
            backendData.email?.[0] ||
            backendData.password?.[0] ||
            backendData.detail ||
            (backendData.message ? (typeof backendData.message === "string" ? backendData.message : JSON.stringify(backendData.message)) : null) ||
            JSON.stringify(backendData);
          setError(errorMsg);
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

  // Google OAuth login handler
  const handleGoogleLogin = async () => {
    setError("");
    setShowRoleSelectModal(false);
    try {
      setLoading(true);

      // Google OAuth Client ID from your credentials
      const clientId = "514125135351-t9d89tav43rcqqe90km3i5hb3e60ubav.apps.googleusercontent.com";

      // Redirect URI - must match EXACTLY what's configured in Google Cloud Console
      // Build redirect URI with base path
      const basePath = import.meta.env.BASE_URL || '/blockchain-frontend/';
      const cleanBase = basePath.replace(/\/$/, ''); // Remove trailing slash if present
      const redirectUri = `${window.location.origin}${cleanBase}/oauth2callback`;

      console.log("🔐 Google OAuth Configuration:");
      console.log("═══════════════════════════════════════");
      console.log("Client ID:", clientId);
      console.log("Current Origin:", window.location.origin);
      console.log("Base Path:", basePath);
      console.log("═══════════════════════════════════════");
      console.log("🔴 REDIRECT URI (COPY THIS EXACTLY):");
      console.log(redirectUri);
      console.log("═══════════════════════════════════════");
      console.log("⚠️ Add this EXACT URI to Google Cloud Console:");
      console.log("   1. Go to: https://console.cloud.google.com/apis/credentials");
      console.log("   2. Find OAuth client:", clientId);
      console.log("   3. Click 'Edit'");
      console.log("   4. Under 'Authorized redirect URIs', click 'ADD URI'");
      console.log("   5. Paste:", redirectUri);
      console.log("   6. Click 'SAVE'");
      console.log("═══════════════════════════════════════");

      // Build Google OAuth URL
      const scope = encodeURIComponent("openid profile email");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=consent&include_granted_scopes=true`;

      // Open popup window
      const width = 600, height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2.5;
      const popup = window.open(authUrl, "google_oauth", `width=${width},height=${height},left=${left},top=${top}`);

      if (!popup) {
        setError("Popup blocked. Please allow popups for this site.");
        setLoading(false);
        return;
      }

      // Listen for message from callback page
      const handleMessage = async (event) => {
        // Security check: ensure message comes from same origin
        if (event.origin !== window.origin) return;

        const msg = event.data || {};
        if (msg.type !== "google_auth") return;

        // Clean up
        window.removeEventListener("message", handleMessage);
        popup.close();

        // Handle errors
        if (msg.error) {
          let errorMsg = String(msg.error);
          if (errorMsg.includes("invalid_client") || errorMsg.includes("OAuth client") || errorMsg.includes("not found")) {
            errorMsg = `OAuth Configuration Error: Please add "${redirectUri}" to Google Cloud Console under "Authorized redirect URIs". Error: ${msg.error}`;
          }
          setError(errorMsg);
          setLoading(false);
          return;
        }

        const accessToken = msg.access_token;
        if (!accessToken) {
          setError("No access token received from Google.");
          setLoading(false);
          return;
        }

        // Send token to your backend API
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
          const url = `${API_URL.replace(/\/$/, "")}/auth/google/`;

          // For LOGIN (not signup), don't send role - backend will return user's existing role
          // Only send access_token for login
          const payload = {
            access_token: accessToken
          };

          console.log("📤 Google Login - Sending to backend:", url);
          console.log("Payload:", { access_token: "***" });

          const response = await axios.post(url, payload, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          console.log("✅ Backend response:", response.data);
          console.log("📋 Full response:", JSON.stringify(response.data, null, 2));

          // Save tokens if returned - EXACT SAME AS EMAIL/PASSWORD LOGIN
          let savedAccessToken = null;
          if (response.data?.tokens || response.data?.access) {
            savedAccessToken = response.data?.tokens?.access || response.data?.access;
            const refreshToken = response.data?.tokens?.refresh || response.data?.refresh;

            if (savedAccessToken) {
              localStorage.setItem("accessToken", savedAccessToken);
            }
            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }
          }

          // Extract user data - EXACT SAME AS EMAIL/PASSWORD LOGIN
          const userInfo = response.data?.user || response.data;
          // Check for role in tokens object first, then root level, then user object
          const userRole = response.data?.tokens?.role || response.data?.role || userInfo?.role;

          // Extract user_id - try from response first, then from JWT token
          let userId = userInfo?.id || userInfo?.user_id || response.data?.user_id;
          if (!userId && savedAccessToken) {
            // Try to extract from JWT token
            const decodedToken = decodeJWT(savedAccessToken);
            if (decodedToken && decodedToken.user_id) {
              userId = decodedToken.user_id;
              console.log("✅ Extracted user_id from JWT token:", userId);
            }
          }

          const username = userInfo?.username || response.data?.username;
          const email = userInfo?.email || response.data?.email;
          const isActive = userInfo?.is_active || response.data?.is_active;
          const dateJoined = userInfo?.date_joined || response.data?.date_joined;

          console.log("=== Google Login Role Debug ===");
          console.log("Full response data:", response.data);
          console.log("response.data.tokens:", response.data?.tokens);
          console.log("response.data.tokens.role:", response.data?.tokens?.role);
          console.log("response.data.role:", response.data?.role);
          console.log("userInfo.role:", userInfo?.role);
          console.log("Raw role from response:", userRole);
          console.log("User info:", userInfo);
          console.log("Extracted user_id:", userId);

          // Save user data - EXACT SAME AS EMAIL/PASSWORD LOGIN
          const userData = {
            user_id: userId,
            username: username,
            email: email,
            role: userRole,
            is_active: isActive,
            date_joined: dateJoined,
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          console.log("User data saved to localStorage:", userData);

          // Verify user_id is present
          if (!userId) {
            console.error("❌ user_id is missing! Cannot proceed without user_id.");
            setError("Login successful but user ID is missing. Please contact support.");
            setLoading(false);
            return;
          }

          // Navigate to dashboard - EXACT SAME LOGIC AS EMAIL/PASSWORD LOGIN
          const normalizedRole = (userRole || "").toLowerCase().trim();
          console.log("=== Navigation Decision ===");
          console.log("User role:", userRole);
          console.log("Normalized role (lowercase, trimmed):", normalizedRole);
          console.log("Is empty?", !normalizedRole || normalizedRole === "");

          // Verify tokens and userData are saved before navigation
          const savedToken = localStorage.getItem("accessToken");
          const savedUserData = localStorage.getItem("userData");
          console.log("Verification - Token saved:", !!savedToken);
          console.log("Verification - UserData saved:", !!savedUserData);

          if (!savedToken || !savedUserData) {
            console.error("❌ Tokens or userData not saved properly!");
            setError("Failed to save login information. Please try again.");
            setLoading(false);
            return;
          }

          // Simple dashboard redirect based on role
          if (normalizedRole && (normalizedRole === "syndicate" || normalizedRole === "syndicate_manager" || normalizedRole.includes("syndicate"))) {
            console.log("✅ Redirecting syndicate user to manager panel dashboard");
            setLoading(false); // Stop loading before navigation
            // Use setTimeout to ensure state updates are processed
            setTimeout(() => {
              navigate("/manager-panel/dashboard", { replace: true });
            }, 100);
          } else if (normalizedRole === "investor") {
            console.log("✅ Redirecting investor user to dashboard");
            setLoading(false); // Stop loading before navigation
            // Use setTimeout to ensure state updates are processed
            setTimeout(() => {
              navigate("/investor-panel/dashboard", { replace: true });
            }, 100);
          } else {
            // No role or unknown role - show role selection modal
            console.warn("⚠️ Unknown or missing role, showing role selection modal.");
            console.warn("Role value:", normalizedRole);
            console.warn("Full userData:", userData);
            setLoading(false);
            setShowRoleSelectModal(true);
            setError(""); // Clear any errors
          }

        } catch (err) {
          console.error("Backend API error:", err);
          const backend = err.response?.data;

          // Check if error is about missing role (user hasn't selected role yet)
          // Handle multiple error formats:
          // 1. {"success":false,"detail":{"id_token":["This field is required."]}}
          // 2. {"success":false,"detail":"Role is required for signup. Provide \"investor\" or \"syndicate\"."}
          const detail = backend?.detail;
          const detailString = typeof detail === "string" ? detail : JSON.stringify(detail || {});

          const isMissingRoleError =
            backend?.detail?.id_token || // Old format: id_token field error
            (typeof detail === "string" && (
              detail.toLowerCase().includes("role is required") ||
              detail.toLowerCase().includes("provide \"investor\" or \"syndicate\"") ||
              detail.toLowerCase().includes("role is required for signup")
            )) || // New format: role required message
            (typeof backend === "object" && backend.detail &&
              (detailString.includes("id_token") ||
                detailString.includes("This field is required") ||
                detailString.includes("Role is required")));

          console.log("Error check - isMissingRoleError:", isMissingRoleError);
          console.log("Backend error detail:", detail);

          if (isMissingRoleError) {
            setShowRoleSelectModal(true);
            setError(""); // Clear inline error for this case
          } else {
            // Extract error message properly
            let errorMsg = err.message || "Google login failed";
            if (backend) {
              if (typeof backend === "object") {
                errorMsg = backend.error ||
                  backend.detail ||
                  backend.non_field_errors?.[0] ||
                  (backend.message ? (typeof backend.message === "string" ? backend.message : JSON.stringify(backend.message)) : null) ||
                  JSON.stringify(backend);
              } else {
                errorMsg = String(backend);
              }
            }
            setError(errorMsg);
            setShowRoleSelectModal(false);
            setLoading(false);
          }
        }
      };

      window.addEventListener("message", handleMessage);

      // Cleanup if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          setLoading(false);
        }
      }, 1000);

    } catch (e) {
      console.error("Google login flow error:", e);
      setError(String(e));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>


      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel - Visual/Marketing Section */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full">
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

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-7 sm:p-8 md:p-6">
          <div className="w-full max-w-md">
            <div className="mb-4 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-2 font-semibold">Welcome Back</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">Sign in to your account to continue</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <p>{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-1 outline-none">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {/* Placeholder Eye Icon for visibility toggle */}
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


              <div className="flex items-center justify-between mb-4 ">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    // Tailwind uses accent color for checkbox styling in modern versions, but keeping inline color for compatibility
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2]"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#0A2A2E] font-poppins-custom">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-[#ED1C24] hover:text-red-700 transition-colors">
                  Forgot password?
                </Link>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A3A38] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto text-[#0A2A2E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Log In"}
              </button>




            </form>


            <div className="flex items-center mb-2 mt-2
             ">
              <div className="w-full h-[1px] bg-[#0A2A2E]"></div>
              <span className="text-lg text-[#0A2A2E] mx-5 font-poppins-custom">or</span>
              <div className="w-full h-[1px] bg-[#0A2A2E]"></div>
            </div>

            <div className="flex flex-row items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex flex-row  items-center justify-center gap-1 w-full bg-white text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg border-2 border-[#0A2A2E] hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_3034_1961)">
                    <path d="M5.57386 0.526248C3.97522 1.08083 2.59654 2.13346 1.64035 3.5295C0.684163 4.92554 0.200854 6.59143 0.261418 8.28245C0.321982 9.97348 0.923226 11.6005 1.97684 12.9246C3.03045 14.2486 4.48089 15.1999 6.11511 15.6387C7.44002 15.9806 8.82813 15.9956 10.1601 15.6825C11.3668 15.4115 12.4823 14.8317 13.3976 14C14.3502 13.1079 15.0417 11.9731 15.3976 10.7175C15.7845 9.35208 15.8534 7.91616 15.5989 6.52H8.15886V9.60625H12.4676C12.3815 10.0985 12.197 10.5683 11.9251 10.9875C11.6531 11.4068 11.2994 11.7669 10.8851 12.0462C10.359 12.3943 9.76586 12.6285 9.14387 12.7337C8.52005 12.8497 7.88019 12.8497 7.25636 12.7337C6.6241 12.603 6.02599 12.3421 5.50011 11.9675C4.6553 11.3695 4.02096 10.5199 3.68762 9.54C3.34863 8.54174 3.34863 7.45951 3.68762 6.46125C3.9249 5.76152 4.31716 5.12442 4.83511 4.5975C5.42785 3.98343 6.17828 3.54449 7.00406 3.32884C7.82984 3.11319 8.69906 3.12916 9.51637 3.375C10.1548 3.57099 10.7387 3.91342 11.2214 4.375C11.7072 3.89166 12.1922 3.40708 12.6764 2.92125C12.9264 2.66 13.1989 2.41125 13.4451 2.14375C12.7083 1.45809 11.8435 0.924569 10.9001 0.573748C9.18225 -0.0500151 7.30259 -0.0667781 5.57386 0.526248Z" fill="white" />
                    <path d="M5.57397 0.526245C7.30254 -0.067184 9.1822 -0.0508623 10.9002 0.572495C11.8437 0.925699 12.7082 1.46179 13.444 2.14999C13.194 2.41749 12.9302 2.66749 12.6752 2.92749C12.1902 3.41166 11.7056 3.89416 11.2215 4.37499C10.7388 3.91342 10.1549 3.57098 9.51646 3.37499C8.69943 3.1283 7.83024 3.1114 7.00424 3.32617C6.17824 3.54094 5.42735 3.97907 4.83396 4.59249C4.31601 5.11941 3.92375 5.75652 3.68646 6.45624L1.09521 4.44999C2.02273 2.6107 3.62865 1.20377 5.57397 0.526245Z" fill="#E33629" />
                    <path d="M0.407438 6.43745C0.546714 5.74719 0.777942 5.07873 1.09494 4.44995L3.68619 6.4612C3.34721 7.45946 3.34721 8.54169 3.68619 9.53995C2.82285 10.2066 1.9591 10.8766 1.09494 11.55C0.301376 9.97035 0.0593537 8.17058 0.407438 6.43745Z" fill="#F8BD00" />
                    <path d="M8.15876 6.5188H15.5988C15.8533 7.91496 15.7844 9.35088 15.3975 10.7163C15.0416 11.9719 14.3501 13.1067 13.3975 13.9988C12.5613 13.3463 11.7213 12.6988 10.885 12.0463C11.2996 11.7666 11.6535 11.4062 11.9254 10.9865C12.1973 10.5668 12.3817 10.0965 12.4675 9.6038H8.15876C8.15751 8.5763 8.15876 7.54755 8.15876 6.5188Z" fill="#587DBD" />
                    <path d="M1.09375 11.55C1.95792 10.8834 2.82167 10.2134 3.685 9.54004C4.01901 10.5203 4.65426 11.3699 5.5 11.9675C6.02751 12.3404 6.62691 12.5992 7.26 12.7275C7.88382 12.8435 8.52368 12.8435 9.1475 12.7275C9.76949 12.6223 10.3626 12.3881 10.8888 12.04C11.725 12.6925 12.565 13.34 13.4012 13.9925C12.4861 14.8247 11.3705 15.4049 10.1637 15.6763C8.83176 15.9894 7.44365 15.9744 6.11875 15.6325C5.07088 15.3528 4.09209 14.8595 3.24375 14.1838C2.34583 13.4709 1.61244 12.5725 1.09375 11.55Z" fill="#319F43" />
                  </g>
                  <defs>
                    <clipPath id="clip0_3034_1961">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>


                </span>Login with Google
              </button>
            </div>

            <div className="py-2">
              <p>don't have an account? <Link to="/register" className="text-[#CEC6FF] decoration-underline hover:text-[#00E6B0] transition-colors"
                style={{ textDecoration: "underline" }}
              >Create one</Link></p>
            </div>

            <div className="border-1 border-[#0A2A2E] rounded-lg p-2 bg-[#F4F6F5]">
              <p className="text-xs p-1 text-[#0A2A2E] font-poppins-custom">
                By logging in, you acknowledge that Unlocksley does not provide investment advice and is intended for accredited/HNW investors only. Compliance varies by jurisdiction.
              </p>

            </div>

          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleSelectModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[3px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#001D21] mb-2">
                Role Selection Required
              </h3>
              <p className="text-sm text-[#0A2A2E] mb-6 font-poppins-custom">
                Your account needs a role to continue. Please select whether you're an Investor or Syndicate Manager.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowRoleSelectModal(false);
                    navigate("/role-select");
                  }}
                  className="flex-1 bg-[#0A3A38] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200"
                >
                  sign in
                </button>
                <button
                  onClick={() => setShowRoleSelectModal(false)}
                  className="flex-1 bg-gray-200 text-[#0A2A2E] font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Login;