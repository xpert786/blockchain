import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  
  // Check if user is logged in - do this synchronously
  const accessToken = localStorage.getItem("accessToken");
  const userDataStr = localStorage.getItem("userData");
  
  // Debug logging
  console.log("🔒 ProtectedRoute Check:", {
    path: location.pathname,
    hasToken: !!accessToken,
    tokenValue: accessToken ? "***" + accessToken.slice(-10) : null,
    requiredRole,
    hasUserData: !!userDataStr
  });
  
  // If no token, immediately redirect to login
  if (!accessToken || accessToken.trim() === "" || accessToken === "null" || accessToken === "undefined") {
    console.log("❌ No access token found, redirecting to login");
    // Clear any invalid data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If role is required, check user role
  if (requiredRole) {
    let userRole = null;
    
    try {
      if (userDataStr && userDataStr.trim() !== "" && userDataStr !== "null" && userDataStr !== "undefined") {
        const userData = JSON.parse(userDataStr);
        userRole = userData?.role?.toLowerCase()?.trim();
        console.log("👤 User role from localStorage:", userRole);
      } else {
        console.log("⚠️ No userData found in localStorage - redirecting to login");
        // If role is required but no userData, treat as unauthenticated
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        return <Navigate to="/login" replace state={{ from: location }} />;
      }
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      // If we can't parse user data, treat as unauthenticated
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Check if user has the required role
    if (requiredRole === "syndicate") {
      // Check for various syndicate role formats (same as Login.jsx)
      const isSyndicate = userRole && (
        userRole === "syndicate" || 
        userRole === "syndicate_manager" || 
        userRole.includes("syndicate")
      );
      
      console.log("🔍 Is Syndicate?", isSyndicate, "| User role:", userRole);
      
      if (!isSyndicate) {
        console.log("❌ User is not a syndicate, redirecting");
        // User is not a syndicate, redirect to appropriate page
        if (userRole === "investor") {
          return <Navigate to="/investor-panel/dashboard" replace state={{ from: location }} />;
        }
        // Unknown role or no role, redirect to login
        console.log("❌ Unknown or missing role, redirecting to login");
        return <Navigate to="/login" replace state={{ from: location }} />;
      }
    } else if (requiredRole === "investor") {
      if (userRole !== "investor") {
        console.log("❌ User is not an investor, redirecting");
        // User is not an investor, redirect based on their role
        if (userRole && (userRole.includes("syndicate") || userRole === "syndicate_manager")) {
          return <Navigate to="/syndicate-creation/lead-info" replace state={{ from: location }} />;
        }
        return <Navigate to="/login" replace state={{ from: location }} />;
      }
    }
  }

  // User is authenticated and has the required role (if specified)
  console.log("✅ Access granted to:", location.pathname);
  return children;
};

export default ProtectedRoute;
