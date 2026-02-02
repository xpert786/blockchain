import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logoImage from "../../assets/img/image 5746.png";

const ManagerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const completedStatuses = ["submitted", "approved", "completed", "accepted"];

    const checkManagerAccess = async () => {
      const token = localStorage.getItem("accessToken");
      const rawUser = localStorage.getItem("userData");

      if (!token) {
        console.warn("ManagerLayout: No access token found");
        navigate("/login", { replace: true });
        return;
      }

      if (!rawUser) {
        console.warn("ManagerLayout: No user data found");
        navigate("/login", { replace: true });
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (error) {
        console.error("ManagerLayout: unable to parse user data:", error);
        navigate("/login", { replace: true });
        return;
      }

      // Check if user data is valid
      if (!parsedUser || !parsedUser.user_id) {
        console.warn("ManagerLayout: Invalid user data structure");
        navigate("/login", { replace: true });
        return;
      }

      const role = parsedUser?.role?.toLowerCase() || "";
      console.log("ManagerLayout: User role:", role);

      if (!role || !role.includes("syndicate")) {
        console.warn("ManagerLayout: User role does not include 'syndicate', redirecting to lead-info");
        navigate("/syndicate-creation/lead-info", { replace: true });
        return;
      }

      const normalizeStatus = (value) => (value || "").toString().toLowerCase().trim();

      let currentStatus = normalizeStatus(parsedUser?.application_status);
      let isCompleted =
        !!parsedUser?.syndicate_profile_completed || completedStatuses.includes(currentStatus);

      if (!isCompleted) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
          const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;

          const response = await fetch(finalUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          });

          // Handle 401 Unauthorized - token expired or invalid
          if (response.status === 401) {
            console.warn("ManagerLayout: Token expired or invalid (401), redirecting to login");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/login", { replace: true });
            return;
          }

          if (response.ok) {
            const data = await response.json();
            const latestStatus = normalizeStatus(
              data?.application_status ||
              data?.profile?.application_status ||
              data?.step_data?.application_status
            );

            if (latestStatus) {
              currentStatus = latestStatus;
              if (completedStatuses.includes(latestStatus)) {
                isCompleted = true;
                const updatedUser = {
                  ...parsedUser,
                  application_status: latestStatus,
                  syndicate_profile_completed: true
                };
                localStorage.setItem("userData", JSON.stringify(updatedUser));
              }
            }
          }
        } catch (error) {
          console.error("ManagerLayout: failed to fetch syndicate status:", error);
          // Don't redirect on network errors, just log
        }
      }

      if (!isCompleted) {
        navigate("/syndicate-creation/lead-info", { replace: true });
      }
    };

    checkManagerAccess();
  }, [navigate]);

  // Update active menu based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("spv-management") || path.includes("spv-details") || path.includes("investor-details")) {
      setActiveMenu("spv-management");
    } else if (
      path.includes("documents") ||
      path.includes("document-template-engine") ||
      path.includes("manage-templates") ||
      path.includes("generated-documents") ||
      path.includes("generate-document")
    ) {
      setActiveMenu("documents");
    } else if (path.includes("transfers")) {
      setActiveMenu("transfers");
    } else if (path.includes("requests-system")) {
      setActiveMenu("requests-system");
    } else if (path.includes("messages")) {
      setActiveMenu("messages");
    } else if (path.includes("dashboard")) {
      setActiveMenu("dashboard");
    } else if (path.includes("notifications")) {
      setActiveMenu("notifications");
    }
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: "dashboard", path: "/manager-panel/dashboard" },
    { id: "spv-management", name: "SPV Management", icon: "document", path: "/manager-panel/spv-management" },
    { id: "documents", name: "Documents", icon: "documents", path: "/manager-panel/documents" },
    { id: "transfers", name: "Transfers", icon: "transfers", path: "/manager-panel/transfers" },
    { id: "requests-system", name: "Requests System", icon: "requests", path: "/manager-panel/requests-system" },
    { id: "messages", name: "Messages", icon: "messages", path: "/manager-panel/messages" },
    { id: "settings", name: "Settings", icon: "settings", path: "/manager-panel/settings" }
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    ["accessToken", "refreshToken", "userData", "tempUserData"].forEach((key) => localStorage.removeItem(key));
    navigate("/login", { replace: true });
  };

  const renderLogoutButton = (className = "") => (
    <button
      type="button"
      onClick={handleLogout}
      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/60 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.25 4.16666H15C16.3807 4.16666 17.5 5.28595 17.5 6.66666V13.3333C17.5 14.714 16.3807 15.8333 15 15.8333H11.25"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.33301 10H12.4997M3.33301 10L6.24967 6.66666M3.33301 10L6.24967 13.3333"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Logout
    </button>
  );

  const getIcon = (iconName) => {
    const iconProps = { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" };

    switch (iconName) {
      case "dashboard":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.8125 9.10158C7.9078 9.04564 7.9868 8.96573 8.04162 8.86978C8.09645 8.77384 8.1252 8.66521 8.125 8.5547V2.9297C8.12588 2.82902 8.10241 2.72962 8.05661 2.63996C8.01081 2.5503 7.94403 2.47303 7.86195 2.41472C7.77986 2.35642 7.68491 2.31881 7.58516 2.3051C7.48542 2.29138 7.38384 2.30197 7.28906 2.33595C5.70674 2.89961 4.33727 3.93851 3.36811 5.31044C2.39895 6.68237 1.87745 8.32029 1.875 10C1.87585 10.4977 1.92029 10.9944 2.00781 11.4844C2.02659 11.5823 2.06822 11.6743 2.12931 11.7531C2.19041 11.8318 2.26923 11.895 2.35938 11.9375C2.44256 11.9767 2.53306 11.998 2.625 12C2.73491 11.9993 2.8427 11.9697 2.9375 11.9141L7.8125 9.10158ZM6.875 3.87501V8.19533L3.13281 10.3594C3.125 10.2344 3.125 10.1172 3.125 10C3.1274 8.73318 3.4786 7.49146 4.14008 6.41103C4.80157 5.33061 5.7478 4.4532 6.875 3.87501Z" fill="#00F0C3" />
            <path d="M17.0547 5.96875C17.0466 5.96003 17.0412 5.94919 17.0391 5.9375L17.0078 5.89844C16.2928 4.67422 15.2696 3.65862 14.0401 2.95272C12.8107 2.24682 11.4177 1.87526 10 1.875C9.83424 1.875 9.67527 1.94085 9.55805 2.05806C9.44085 2.17527 9.375 2.33424 9.375 2.5V9.64063L3.19531 13.2109C3.12328 13.2507 3.05994 13.3045 3.00901 13.3692C2.95808 13.4338 2.9206 13.508 2.89876 13.5874C2.87692 13.6667 2.87117 13.7496 2.88185 13.8312C2.89253 13.9128 2.91942 13.9914 2.96093 14.0625V14.0781L2.98437 14.1172C3.88558 15.6599 5.27016 16.8626 6.92381 17.539C8.57746 18.2154 10.408 18.328 12.132 17.8591C13.8561 17.3903 15.3775 16.3663 16.4609 14.9456C17.5443 13.5249 18.1291 11.7867 18.125 10C18.1269 8.58577 17.7578 7.19578 17.0547 5.96875Z" fill="#00F0C3" />
          </svg>

        );
      case "plus":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.9167 10H10M10 10H7.08333M10 10V7.08333M10 10V12.9167M2.5 7.83333C2.5 5.96667 2.5 5.03333 2.86333 4.32C3.18291 3.69282 3.69282 3.18291 4.32 2.86333C5.03333 2.5 5.96667 2.5 7.83333 2.5H12.1667C14.0333 2.5 14.9667 2.5 15.68 2.86333C16.3072 3.18291 16.8171 3.69282 17.1367 4.32C17.5 5.03333 17.5 5.96667 17.5 7.83333V12.1667C17.5 14.0333 17.5 14.9667 17.1367 15.68C16.8171 16.3072 16.3072 16.8171 15.68 17.1367C14.9667 17.5 14.0333 17.5 12.1667 17.5H7.83333C5.96667 17.5 5.03333 17.5 4.32 17.1367C3.69282 16.8171 3.18291 16.3072 2.86333 15.68C2.5 14.9667 2.5 14.0333 2.5 12.1667V7.83333Z" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      case "document":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_149_119)">
              <path d="M5 18.3337V3.33366C5 2.89163 5.17559 2.46771 5.48816 2.15515C5.80072 1.84259 6.22464 1.66699 6.66667 1.66699H13.3333C13.7754 1.66699 14.1993 1.84259 14.5118 2.15515C14.8244 2.46771 15 2.89163 15 3.33366V18.3337H5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4.99984 10H3.33317C2.89114 10 2.46722 10.1756 2.15466 10.4882C1.8421 10.8007 1.6665 11.2246 1.6665 11.6667V16.6667C1.6665 17.1087 1.8421 17.5326 2.15466 17.8452C2.46722 18.1577 2.89114 18.3333 3.33317 18.3333H4.99984" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 7.5H16.6667C17.1087 7.5 17.5326 7.6756 17.8452 7.98816C18.1577 8.30072 18.3333 8.72464 18.3333 9.16667V16.6667C18.3333 17.1087 18.1577 17.5326 17.8452 17.8452C17.5326 18.1577 17.1087 18.3333 16.6667 18.3333H15" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.3335 5H11.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.3335 8.33301H11.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.3335 11.667H11.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.3335 15H11.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_149_119">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>

        );
      case "documents":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6668 1.66699V5.00033C11.6668 5.44235 11.8424 5.86628 12.155 6.17884C12.4675 6.4914 12.8915 6.66699 13.3335 6.66699H16.6668M8.3335 7.50033H6.66683M13.3335 10.8337H6.66683M13.3335 14.167H6.66683M12.5002 1.66699H5.00016C4.55814 1.66699 4.13421 1.84259 3.82165 2.15515C3.50909 2.46771 3.3335 2.89163 3.3335 3.33366V16.667C3.3335 17.109 3.50909 17.5329 3.82165 17.8455C4.13421 18.1581 4.55814 18.3337 5.00016 18.3337H15.0002C15.4422 18.3337 15.8661 18.1581 16.1787 17.8455C16.4912 17.5329 16.6668 17.109 16.6668 16.667V5.83366L12.5002 1.66699Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      case "transfers":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.6665 8.33366H18.3332M3.33317 4.16699H16.6665C17.587 4.16699 18.3332 4.91318 18.3332 5.83366V14.167C18.3332 15.0875 17.587 15.8337 16.6665 15.8337H3.33317C2.4127 15.8337 1.6665 15.0875 1.6665 14.167V5.83366C1.6665 4.91318 2.4127 4.16699 3.33317 4.16699Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      case "requests":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      case "messages":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      case "analytics":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 2.5V17.5H17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 14.1667V7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.8335 14.167V4.16699" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.6665 14.167V11.667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      case "settings":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1833 1.66699H9.81667C9.37464 1.66699 8.95072 1.84259 8.63816 2.15515C8.3256 2.46771 8.15 2.89163 8.15 3.33366V3.48366C8.1497 3.77593 8.07255 4.06298 7.92628 4.31602C7.78002 4.56906 7.56978 4.77919 7.31667 4.92533L6.95834 5.13366C6.70497 5.27994 6.41756 5.35695 6.125 5.35695C5.83244 5.35695 5.54503 5.27994 5.29167 5.13366L5.16667 5.06699C4.78422 4.84638 4.32987 4.78653 3.90334 4.90058C3.47681 5.01464 3.11296 5.29327 2.89167 5.67533L2.70833 5.99199C2.48772 6.37444 2.42787 6.82879 2.54192 7.25532C2.65598 7.68185 2.93461 8.0457 3.31667 8.26699L3.44167 8.35033C3.69356 8.49575 3.90302 8.70457 4.04921 8.95602C4.1954 9.20747 4.27325 9.4928 4.275 9.78366V10.2087C4.27617 10.5023 4.19971 10.7911 4.05337 11.0457C3.90703 11.3004 3.69601 11.5118 3.44167 11.6587L3.31667 11.7337C2.93461 11.955 2.65598 12.3188 2.54192 12.7453C2.42787 13.1719 2.48772 13.6262 2.70833 14.0087L2.89167 14.3253C3.11296 14.7074 3.47681 14.986 3.90334 15.1001C4.32987 15.2141 4.78422 15.1543 5.16667 14.9337L5.29167 14.867C5.54503 14.7207 5.83244 14.6437 6.125 14.6437C6.41756 14.6437 6.70497 14.7207 6.95834 14.867L7.31667 15.0753C7.56978 15.2215 7.78002 15.4316 7.92628 15.6846C8.07255 15.9377 8.1497 16.2247 8.15 16.517V16.667C8.15 17.109 8.3256 17.5329 8.63816 17.8455C8.95072 18.1581 9.37464 18.3337 9.81667 18.3337H10.1833C10.6254 18.3337 11.0493 18.1581 11.3618 17.8455C11.6744 17.5329 11.85 17.109 11.85 16.667V16.517C11.8503 16.2247 11.9275 15.9377 12.0737 15.6846C12.22 15.4316 12.4302 15.2215 12.6833 15.0753L13.0417 14.867C13.295 14.7207 13.5824 14.6437 13.875 14.6437C14.1676 14.6437 14.455 14.7207 14.7083 14.867L14.8333 14.9337C15.2158 15.1543 15.6701 15.2141 16.0967 15.1001C16.5232 14.986 16.887 14.7074 17.1083 14.3253L17.2917 14.0003C17.5123 13.6179 17.5721 13.1635 17.4581 12.737C17.344 12.3105 17.0654 11.9466 16.6833 11.7253L16.5583 11.6587C16.304 11.5118 16.093 11.3004 15.9466 11.0457C15.8003 10.7911 15.7238 10.5023 15.725 10.2087V9.79199C15.7238 9.49831 15.8003 9.20953 15.9466 8.9549C16.093 8.70027 16.304 8.48883 16.5583 8.34199L16.6833 8.26699C17.0654 8.0457 17.344 7.68185 17.4581 7.25532C17.5721 6.82879 17.5123 6.37444 17.2917 5.99199L17.1083 5.67533C16.887 5.29327 16.5232 5.01464 16.0967 4.90058C15.6701 4.78653 15.2158 4.84638 14.8333 5.06699L14.7083 5.13366C14.455 5.27994 14.1676 5.35695 13.875 5.35695C13.5824 5.35695 13.295 5.27994 13.0417 5.13366L12.6833 4.92533C12.4302 4.77919 12.22 4.56906 12.0737 4.31602C11.9275 4.06298 11.8503 3.77593 11.85 3.48366V3.33366C11.85 2.89163 11.6744 2.46771 11.3618 2.15515C11.0493 1.84259 10.6254 1.66699 10.1833 1.66699Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#F4F6F5] border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden lg:block w-48">
              <img src={logoImage} alt="Logo" className="h-10 w-auto object-contain" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search SPVs, investors, documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  const accessToken = localStorage.getItem("accessToken");
                  const userData = localStorage.getItem("userData");

                  // Check if user is authenticated
                  if (!accessToken || !userData) {
                    console.warn("No access token or user data found, redirecting to login");
                    navigate("/login", { replace: true });
                    return;
                  }

                  // Verify token is still valid by checking userData
                  try {
                    const parsedUser = JSON.parse(userData);
                    if (!parsedUser || !parsedUser.user_id) {
                      console.warn("Invalid user data, redirecting to login");
                      navigate("/login", { replace: true });
                      return;
                    }
                  } catch (parseError) {
                    console.error("Error parsing user data:", parseError);
                    navigate("/login", { replace: true });
                    return;
                  }

                  const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

                  // Get user's SPVs to check status
                  try {
                    const spvListUrl = `${API_URL.replace(/\/$/, "")}/spv/`;
                    const spvListResponse = await axios.get(spvListUrl, {
                      headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      }
                    }).catch((error) => {
                      // Handle 401 Unauthorized - token expired or invalid
                      if (error.response?.status === 401) {
                        console.warn("Token expired or invalid, redirecting to login");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        navigate("/login", { replace: true });
                        return null;
                      }
                      throw error;
                    });

                    // If response is null (401 handled), stop execution
                    if (!spvListResponse) {
                      return;
                    }

                    const spvData = spvListResponse.data?.results || spvListResponse.data;
                    let mostRecentSpv = null;

                    if (Array.isArray(spvData) && spvData.length > 0) {
                      // Sort by most recent first
                      const sortedSpvs = [...spvData].sort((a, b) => {
                        if (a.created_at && b.created_at) {
                          return new Date(b.created_at) - new Date(a.created_at);
                        }
                        return (b.id || 0) - (a.id || 0);
                      });
                      mostRecentSpv = sortedSpvs[0];
                    } else if (spvData && spvData.id) {
                      mostRecentSpv = spvData;
                    }

                    // Check status of most recent SPV
                    if (mostRecentSpv) {
                      // Check final_review to get spv_status
                      try {
                        const finalReviewUrl = `${API_URL.replace(/\/$/, "")}/spv/${mostRecentSpv.id}/final_review/`;
                        const finalReviewResponse = await axios.get(finalReviewUrl, {
                          headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                          }
                        }).catch((error) => {
                          // Handle 401 Unauthorized
                          if (error.response?.status === 401) {
                            console.warn("Token expired during final review check, redirecting to login");
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("refreshToken");
                            navigate("/login", { replace: true });
                            return null;
                          }
                          throw error;
                        });

                        // If response is null (401 handled), stop execution
                        if (!finalReviewResponse) {
                          return;
                        }

                        const reviewData = finalReviewResponse.data;
                        const spvStatus = reviewData?.spv_status || reviewData?.status || mostRecentSpv.status;
                        const normalizedStatus = (spvStatus || "").toLowerCase();

                        if (normalizedStatus === 'draft') {
                          // Status is draft - navigate to existing SPV
                          console.log("✅ Found draft SPV, loading existing:", mostRecentSpv.id);
                          navigate("/syndicate-creation/spv-creation/step1", {
                            state: { spvId: mostRecentSpv.id }
                          });
                          return;
                        } else {
                          // Status is pending_review, submitted, or other - create new SPV
                          console.log("⚠️ SPV status is", spvStatus, "- creating new SPV");
                          navigate("/syndicate-creation/spv-creation/step1");
                          return;
                        }
                      } catch (reviewError) {
                        // If final_review doesn't exist (404), check list status
                        if (reviewError.response?.status === 404) {
                          const listStatus = (mostRecentSpv.status || "").toLowerCase();
                          if (listStatus === 'draft') {
                            console.log("✅ Found draft SPV in list, loading existing:", mostRecentSpv.id);
                            navigate("/syndicate-creation/spv-creation/step1", {
                              state: { spvId: mostRecentSpv.id }
                            });
                            return;
                          }
                        }
                        // If error or status not draft, create new
                        console.log("⚠️ Error checking status or status not draft - creating new SPV");
                        navigate("/syndicate-creation/spv-creation/step1");
                        return;
                      }
                    } else {
                      // No SPV found - create new SPV
                      console.log("ℹ️ No existing SPV found - creating new SPV");
                      navigate("/syndicate-creation/spv-creation/step1");
                    }
                  } catch (error) {
                    // Handle 401 errors
                    if (error.response?.status === 401) {
                      console.warn("Token expired or invalid, redirecting to login");
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("refreshToken");
                      navigate("/login", { replace: true });
                      return;
                    }
                    console.error("Error checking SPV status:", error);
                    // On other errors, just navigate to create new SPV
                    navigate("/syndicate-creation/spv-creation/step1");
                  }
                } catch (error) {
                  console.error("Error in Create New SPV handler:", error);
                  // Only redirect to login if it's an auth error
                  if (error.response?.status === 401) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    navigate("/login", { replace: true });
                    return;
                  }
                  // Otherwise, try to create new SPV
                  navigate("/syndicate-creation/spv-creation/step1");
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New SPV</span>
            </button>
            <button
              onClick={() => navigate("/manager-panel/notifications")}
              className="relative inline-flex items-center justify-center w-11 h-11  text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
              aria-label="View notifications"
            >
              <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" rx="8" fill="#01373D" />
                <path
                  d="M14.0083 20.2503C14.106 20.4279 14.2495 20.576 14.424 20.6792C14.5984 20.7823 14.7973 20.8368 15 20.8368C15.2027 20.8368 15.4016 20.7823 15.576 20.6792C15.7505 20.576 15.894 20.4279 15.9917 20.2503M11.5 12.667C11.5 11.7387 11.8687 10.8485 12.5251 10.1921C13.1815 9.53574 14.0717 9.16699 15 9.16699C15.9283 9.16699 16.8185 9.53574 17.4749 10.1921C18.1313 10.8485 18.5 11.7387 18.5 12.667C18.5 16.7503 20.25 17.917 20.25 17.917H9.75C9.75 17.917 11.5 16.7503 11.5 12.667Z"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute -top-0 -right-0 w-4 h-4 bg-[#F2E0C9] rounded-full flex items-center justify-center text-xs font-bold text-[#01373D]">
                2
              </span>
            </button>
            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu" />
          <aside className="relative w-72 max-w-full bg-[#01373D] text-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <img src={logoImage} alt="Logo" className="h-10 w-auto object-contain" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/40 hover:bg-white/10 transition-colors"
                aria-label="Close navigation menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === item.id ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"
                        }`}
                    >
                      {getIcon(item.icon)}
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">John Doe</p>
                  <p className="text-gray-400 text-sm">Manager</p>
                </div>
              </div>
              {renderLogoutButton("mt-6")}
            </div>
          </aside>
        </div>
      )}

      <div className="flex pt-24 lg:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#01373D] text-white min-h-screen">
          <div className="py-6 border-b border-gray-700">
            <img src={logoImage} alt="Logo" className="h-12 w-auto mx-auto object-contain" />
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === item.id ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
              >
                {getIcon(item.icon)}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">John Doe</p>
                <p className="text-gray-400 text-sm">Manager</p>
              </div>
            </div>
            {renderLogoutButton("mt-6")}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
