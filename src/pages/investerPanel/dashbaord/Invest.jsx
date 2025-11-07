import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";

const Invest = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const filterDropdownRef = useRef(null);
  const investDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const syndicates = [
    {
      name: "NextGen AI Syndicate",
      date: "02/01/2024",
      description: "Focused On Artificial Intelligence And Machine Learning Startups With Proven Traction And Enterprise Customers.",
      tags: ["Technology", "Series B", "Raising"],
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$25,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      date: "02/01/2024",
      description: "Focused On Artificial Intelligence And Machine Learning Startups With Proven Traction And Enterprise Customers.",
      tags: ["Technology", "Series B", "Raising"],
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$25,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      date: "02/01/2024",
      description: "Focused On Artificial Intelligence And Machine Learning Startups With Proven Traction And Enterprise Customers.",
      tags: ["Technology", "Series B", "Raising"],
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$25,000",
      trackRecord: "+23.4% IRR",
      status: 65
    }
  ];

  const filterOptions = ["All", "Technology", "AI/ML", "Robotics", "Healthcare", "Energy", "Finance"];

  return (
    <div className="min-h-screen bg-[#F4F6F5]">
      {/* Top Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          {/* Logo on Left */}
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="Unlocksley Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Right Side: Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search SPVs, investors, documents..."
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => navigate("/investor-panel/notifications")}
                className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
              >
                <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="30" height="30" rx="8" fill="#01373D"/>
                  <path d="M14.0083 20.2474C14.106 20.425 14.2495 20.5731 14.424 20.6763C14.5984 20.7794 14.7973 20.8338 15 20.8338C15.2027 20.8338 15.4016 20.7794 15.576 20.6763C15.7505 20.5731 15.894 20.425 15.9917 20.2474M11.5 12.6641C11.5 11.7358 11.8687 10.8456 12.5251 10.1892C13.1815 9.53281 14.0717 9.16406 15 9.16406C15.9283 9.16406 16.8185 9.53281 17.4749 10.1892C18.1313 10.8456 18.5 11.7358 18.5 12.6641C18.5 16.7474 20.25 17.9141 20.25 17.9141H9.75C9.75 17.9141 11.5 16.7474 11.5 12.6641Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                  <span className="text-[#01373D] text-xs font-bold">2</span>
                </div>
              </button>
            </div>

            {/* Profile with Dropdown */}
            <div className="flex items-center gap-2">
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              <button>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Dark Teal) */}
      <nav className="bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-3 py-3 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 18.3346V10.0013H12.5V18.3346M17.5 16.668V7.99039C17.5 7.68179 17.3575 7.39049 17.1139 7.20103L10.6139 2.14548C10.2528 1.86461 9.74717 1.86461 9.38606 2.14548L2.88606 7.20103C2.64247 7.39049 2.5 7.6818 2.5 7.99039V16.668C2.5 17.11 2.67559 17.5339 2.98816 17.8465C3.30072 18.159 3.72464 18.3346 4.16667 18.3346H15.8333C16.2754 18.3346 16.6993 18.159 17.0118 17.8465C17.3244 17.5339 17.5 17.11 17.5 16.668Z" stroke="#00F0C3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button 
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors bg-[#FFFFFF1A] text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.6665 9.99739C1.6665 6.06906 1.6665 4.1049 2.8865 2.88406C4.10817 1.66406 6.0715 1.66406 9.99984 1.66406C13.9282 1.66406 15.8923 1.66406 17.1123 2.88406C18.3332 4.10573 18.3332 6.06906 18.3332 9.99739C18.3332 13.9257 18.3332 15.8899 17.1123 17.1099C15.8932 18.3307 13.9282 18.3307 9.99984 18.3307C6.0715 18.3307 4.10734 18.3307 2.8865 17.1099C1.6665 15.8907 1.6665 13.9257 1.6665 9.99739Z" stroke="white" strokeWidth="1.2"/>
                <path d="M5.83301 11.6615L7.74384 9.75062C7.90011 9.5944 8.11204 9.50664 8.33301 9.50664C8.55398 9.50664 8.7659 9.5944 8.92217 9.75062L10.2438 11.0723C10.4001 11.2285 10.612 11.3163 10.833 11.3163C11.054 11.3163 11.2659 11.2285 11.4222 11.0723L14.1663 8.32812M14.1663 8.32812V10.4115M14.1663 8.32812H12.083" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Invest
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showInvestDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]" style={{border: "1px solid #000"}}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg"
                  style={{backgroundColor: "#00F0C3"}}
                >
                  Discover
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invites");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Invites
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/top-syndicates");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Top Syndicates
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/wishlist");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                >
                  Wishlist
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.6665 9.99739C1.6665 6.06906 1.6665 4.1049 2.8865 2.88406C4.10817 1.66406 6.0715 1.66406 9.99984 1.66406C13.9282 1.66406 15.8923 1.66406 17.1123 2.88406C18.3332 4.10573 18.3332 6.06906 18.3332 9.99739C18.3332 13.9257 18.3332 15.8899 17.1123 17.1099C15.8932 18.3307 13.9282 18.3307 9.99984 18.3307C6.0715 18.3307 4.10734 18.3307 2.8865 17.1099C1.6665 15.8907 1.6665 13.9257 1.6665 9.99739Z" stroke="white" strokeWidth="1.2"/>
              <path d="M5.83301 11.6615L7.74384 9.75062C7.90011 9.5944 8.11204 9.50664 8.33301 9.50664C8.55398 9.50664 8.7659 9.5944 8.92217 9.75062L10.2438 11.0723C10.4001 11.2285 10.612 11.3163 10.833 11.3163C11.054 11.3163 11.2659 11.2285 11.4222 11.0723L14.1663 8.32812M14.1663 8.32812V10.4115M14.1663 8.32812H12.083" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Your Portfolio
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.26522 2.29058C10.5368 1.75545 13.1345 2.35433 14.9332 3.82964C16.2835 4.98266 17.166 6.34446 17.649 8.05035C17.6701 8.12323 17.6917 8.19695 17.7135 8.27203C18.0674 9.7751 17.903 11.4637 17.3385 12.9039L17.2203 13.189C17.1941 13.2496 17.1932 13.2497 17.1666 13.3111C16.5579 14.69 15.5079 15.8885 14.2232 16.6763L14.2213 16.6773C14.1617 16.7154 14.102 16.7533 14.0406 16.7925C12.3547 17.8312 10.1332 18.1436 8.20272 17.7076C6.81781 17.3587 5.58442 16.6853 4.55429 15.6978L4.55233 15.6959L4.38632 15.5445C3.36253 14.5752 2.73369 13.3166 2.35019 11.9625L2.28573 11.7398C1.93202 10.237 2.09635 8.54888 2.66073 7.10894L2.7789 6.82379L2.83261 6.70074C3.64448 4.86185 5.20761 3.41056 7.07187 2.67047L7.07284 2.67144C7.39145 2.55135 7.71435 2.44925 8.04355 2.35601C8.11648 2.33487 8.19009 2.31237 8.26522 2.29058ZM13.7857 5.29937C11.4093 3.24156 7.83103 3.72119 5.66659 5.80914L5.66366 5.81207C4.43298 7.08878 3.97554 8.67593 3.99569 10.4009V10.4029C4.04228 12.0348 4.86514 13.3777 5.97812 14.4927L5.98105 14.4947C7.05839 15.5068 8.59078 16.0678 10.0621 16.0552H10.066C11.5479 15.994 12.931 15.5038 14.0328 14.48C14.0868 14.4302 14.1412 14.38 14.1969 14.3287L14.1988 14.3277C15.2279 13.3401 15.9705 11.9193 16.0016 10.4625C16.0315 8.68192 15.6074 7.15784 14.3355 5.83746L14.3346 5.83648L14.1607 5.65972C14.1126 5.61016 14.0638 5.5604 14.0142 5.50933L14.0123 5.50738L13.7857 5.29937ZM11.8336 7.10699C12.0783 7.07171 12.3394 7.12899 12.6217 7.29839C12.8362 7.54182 12.9347 7.77123 12.9332 8.09332C12.8804 8.42037 12.6679 8.72437 12.3932 9.01519C12.2559 9.16048 12.106 9.3002 11.9586 9.43511C11.8123 9.56899 11.6665 9.69988 11.5416 9.82574C11.5002 9.86742 11.4592 9.90975 11.4166 9.95269C11.1982 10.1728 10.9791 10.3922 10.7603 10.6119C10.5798 10.7933 10.4 10.9756 10.2203 11.1578C10.0025 11.3787 9.78323 11.5983 9.56405 11.8179C9.48097 11.9014 9.39856 11.9858 9.31601 12.0699C9.2009 12.187 9.084 12.3033 8.96737 12.4195L8.9664 12.4205C8.93353 12.4543 8.90062 12.4882 8.86679 12.523C8.61692 12.7689 8.34878 12.9303 8.00937 12.9468C7.73689 12.9238 7.55638 12.8378 7.34335 12.6597C7.14096 12.4165 7.04984 12.1896 7.0621 11.8795C7.17248 11.5017 7.33213 11.2822 7.61874 10.9996L7.61972 10.9986C7.65967 10.958 7.69868 10.9164 7.73983 10.8746L7.74081 10.8756C7.87279 10.7419 8.00666 10.6089 8.14022 10.4761C8.23308 10.3829 8.32577 10.2892 8.41855 10.1959C8.61282 10.0008 8.80822 9.80598 9.00351 9.61187C9.25343 9.36334 9.50187 9.11316 9.7496 8.86285C9.94063 8.67021 10.1325 8.47833 10.3248 8.28668L10.6002 8.01031C10.7277 7.88152 10.8566 7.75317 10.9859 7.62554L10.9869 7.62457C11.0419 7.56828 11.0424 7.56743 11.0973 7.51129C11.3384 7.27655 11.584 7.143 11.8336 7.10699ZM11.5846 11.1451C11.7879 11.0651 12.0347 11.0563 12.3267 11.0943C12.594 11.2213 12.7486 11.3769 12.8756 11.6441C12.9185 11.9708 12.9166 12.2343 12.7887 12.5191C12.6545 12.6593 12.5482 12.7513 12.4312 12.8111C12.3134 12.8713 12.178 12.9031 11.982 12.9107C11.7865 12.9031 11.6515 12.8712 11.5338 12.8111C11.417 12.7514 11.3093 12.6608 11.1754 12.5211C11.0468 12.2357 11.0455 11.9713 11.0885 11.6441C11.2172 11.3742 11.3857 11.2234 11.5846 11.1451ZM8.358 7.1275C8.62696 7.25475 8.78232 7.41003 8.90976 7.67828C8.95267 8.00489 8.9509 8.26842 8.82284 8.55328C8.68877 8.69331 8.58232 8.78551 8.46542 8.84527C8.34758 8.90545 8.21208 8.93632 8.0162 8.9439C7.82055 8.93627 7.68474 8.90547 7.56698 8.84527C7.45052 8.78568 7.34397 8.69449 7.21054 8.55523C7.08172 8.26973 7.07965 8.00551 7.12265 7.67828C7.25139 7.40817 7.41977 7.25663 7.61874 7.17828C7.82141 7.09859 8.06734 7.08992 8.358 7.1275Z" fill="white"/>
              <path d="M5.66659 5.80914C7.83103 3.72119 11.4093 3.24156 13.7857 5.29937L14.0123 5.50738L14.0142 5.50933C14.0638 5.5604 14.1126 5.61016 14.1607 5.65972L14.3346 5.83648L14.3355 5.83746C15.6074 7.15784 16.0315 8.68192 16.0016 10.4625C15.9705 11.9193 15.2279 13.3401 14.1988 14.3277L14.1969 14.3287C14.1412 14.38 14.0868 14.4302 14.0328 14.48C12.931 15.5038 11.5479 15.994 10.066 16.0552H10.0621C8.59078 16.0678 7.05839 15.5068 5.98105 14.4947L5.97812 14.4927C4.86514 13.3777 4.04228 12.0348 3.99569 10.4029V10.4009C3.97554 8.67593 4.43298 7.08878 5.66366 5.81207L5.66659 5.80914ZM5.66659 5.80914L5.73593 5.8814M8.26522 2.29058C10.5368 1.75545 13.1345 2.35433 14.9332 3.82964C16.2835 4.98266 17.166 6.34446 17.649 8.05035C17.6701 8.12323 17.6917 8.19695 17.7135 8.27203C18.0674 9.7751 17.903 11.4637 17.3385 12.9039L17.2203 13.189C17.1941 13.2496 17.1932 13.2497 17.1666 13.3111C16.5579 14.69 15.5079 15.8885 14.2232 16.6763L14.2213 16.6773C14.1617 16.7154 14.102 16.7533 14.0406 16.7925C12.3547 17.8312 10.1332 18.1436 8.20272 17.7076C6.81781 17.3587 5.58442 16.6853 4.55429 15.6978L4.55233 15.6959L4.38632 15.5445C3.36253 14.5752 2.73369 13.3166 2.35019 11.9625L2.28573 11.7398C1.93202 10.237 2.09635 8.54888 2.66073 7.10894L2.7789 6.82379L2.83261 6.70074C3.64448 4.86185 5.20761 3.41056 7.07187 2.67047L7.07284 2.67144C7.39145 2.55135 7.71435 2.44925 8.04355 2.35601C8.11648 2.33487 8.19009 2.31237 8.26522 2.29058ZM11.8336 7.10699C12.0783 7.07171 12.3394 7.12899 12.6217 7.29839C12.8362 7.54182 12.9347 7.77123 12.9332 8.09332C12.8804 8.42037 12.6679 8.72437 12.3932 9.01519C12.2559 9.16048 12.106 9.3002 11.9586 9.43511C11.8123 9.56899 11.6665 9.69988 11.5416 9.82574C11.5002 9.86742 11.4592 9.90975 11.4166 9.95269C11.1982 10.1728 10.9791 10.3922 10.7603 10.6119C10.5798 10.7933 10.4 10.9756 10.2203 11.1578C10.0025 11.3787 9.78323 11.5983 9.56405 11.8179C9.48097 11.9014 9.39856 11.9858 9.31601 12.0699C9.2009 12.187 9.084 12.3033 8.96737 12.4195L8.9664 12.4205C8.93353 12.4543 8.90062 12.4882 8.86679 12.523C8.61692 12.7689 8.34878 12.9303 8.00937 12.9468C7.73689 12.9238 7.55638 12.8378 7.34335 12.6597C7.14096 12.4165 7.04984 12.1896 7.0621 11.8795C7.17248 11.5017 7.33213 11.2822 7.61874 10.9996L7.61972 10.9986C7.65967 10.958 7.69868 10.9164 7.73983 10.8746L7.74081 10.8756C7.87279 10.7419 8.00666 10.6089 8.14022 10.4761C8.23308 10.3829 8.32577 10.2892 8.41855 10.1959C8.61282 10.0008 8.80822 9.80598 9.00351 9.61187C9.25343 9.36334 9.50187 9.11316 9.7496 8.86285C9.94063 8.67021 10.1325 8.47833 10.3248 8.28668L10.6002 8.01031C10.7277 7.88152 10.8566 7.75317 10.9859 7.62554L10.9869 7.62457C11.0419 7.56828 11.0424 7.56743 11.0973 7.51129C11.3384 7.27655 11.584 7.143 11.8336 7.10699ZM11.5846 11.1451C11.7879 11.0651 12.0347 11.0563 12.3267 11.0943C12.594 11.2213 12.7486 11.3769 12.8756 11.6441C12.9185 11.9708 12.9166 12.2343 12.7887 12.5191C12.6545 12.6593 12.5482 12.7513 12.4312 12.8111C12.3134 12.8713 12.178 12.9031 11.982 12.9107C11.7865 12.9031 11.6515 12.8712 11.5338 12.8111C11.417 12.7514 11.3093 12.6608 11.1754 12.5211C11.0468 12.2357 11.0455 11.9713 11.0885 11.6441C11.2172 11.3742 11.3857 11.2234 11.5846 11.1451ZM8.358 7.1275C8.62696 7.25475 8.78232 7.41003 8.90976 7.67828C8.95267 8.00489 8.9509 8.26842 8.82284 8.55328C8.68877 8.69331 8.58232 8.78551 8.46542 8.84527C8.34758 8.90545 8.21208 8.93632 8.0162 8.9439C7.82055 8.93627 7.68474 8.90547 7.56698 8.84527C7.45052 8.78568 7.34397 8.69449 7.21054 8.55523C7.08172 8.26973 7.07965 8.00551 7.12265 7.67828C7.25139 7.40817 7.41977 7.25663 7.61874 7.17828C7.82141 7.09859 8.06734 7.08992 8.358 7.1275Z" stroke="#001D21" strokeWidth="0.5"/>
            </svg>
            Taxes & Document
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Messages
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.1833 1.66406H9.81667C9.37464 1.66406 8.95072 1.83966 8.63816 2.15222C8.3256 2.46478 8.15 2.8887 8.15 3.33073V3.48073C8.1497 3.773 8.07255 4.06005 7.92628 4.31309C7.78002 4.56613 7.56978 4.77626 7.31667 4.9224L6.95834 5.13073C6.70497 5.27701 6.41756 5.35402 6.125 5.35402C5.83244 5.35402 5.54503 5.27701 5.29167 5.13073L5.16667 5.06406C4.78422 4.84345 4.32987 4.7836 3.90334 4.89765C3.47681 5.01171 3.11296 5.29034 2.89167 5.6724L2.70833 5.98906C2.48772 6.37151 2.42787 6.82587 2.54192 7.25239C2.65598 7.67892 2.93461 8.04277 3.31667 8.26406L3.44167 8.3474C3.69356 8.49282 3.90302 8.70164 4.04921 8.95309C4.1954 9.20454 4.27325 9.48987 4.275 9.78073V10.2057C4.27617 10.4994 4.19971 10.7882 4.05337 11.0428C3.90703 11.2974 3.69601 11.5089 3.44167 11.6557L3.31667 11.7307C2.93461 11.952 2.65598 12.3159 2.54192 12.7424C2.42787 13.1689 2.48772 13.6233 2.70833 14.0057L2.89167 14.3224C3.11296 14.7044 3.47681 14.9831 3.90334 15.0971C4.32987 15.2112 4.78422 15.1513 5.16667 14.9307L5.29167 14.8641C5.54503 14.7178 5.83244 14.6408 6.125 14.6408C6.41756 14.6408 6.70497 14.7178 6.95834 14.8641L7.31667 15.0724C7.56978 15.2185 7.78002 15.4287 7.92628 15.6817C8.07255 15.9347 8.1497 16.2218 8.15 16.5141V16.6641C8.15 17.1061 8.3256 17.53 8.63816 17.8426C8.95072 18.1551 9.37464 18.3307 9.81667 18.3307H10.1833C10.6254 18.3307 11.0493 18.1551 11.3618 17.8426C11.6744 17.53 11.85 17.1061 11.85 16.6641V16.5141C11.8503 16.2218 11.9275 15.9347 12.0737 15.6817C12.22 15.4287 12.4302 15.2185 12.6833 15.0724L13.0417 14.8641C13.295 14.7178 13.5824 14.6408 13.875 14.6408C14.1676 14.6408 14.455 14.7178 14.7083 14.8641L14.8333 14.9307C15.2158 15.1513 15.6701 15.2112 16.0967 15.0971C16.5232 14.9831 16.887 14.7044 17.1083 14.3224L17.2917 13.9974C17.5123 13.6149 17.5721 13.1606 17.4581 12.7341C17.344 12.3075 17.0654 11.9437 16.6833 11.7224L16.5583 11.6557C16.304 11.5089 16.093 11.2974 15.9466 11.0428C15.8003 10.7882 15.7238 10.4994 15.725 10.2057V9.78906C15.7238 9.49538 15.8003 9.2066 15.9466 8.95197C16.093 8.69734 16.304 8.4859 16.5583 8.33906L16.6833 8.26406C17.0654 8.04277 17.344 7.67892 17.4581 7.25239C17.5721 6.82587 17.5123 6.37151 17.2917 5.98906L17.1083 5.6724C16.887 5.29034 16.5232 5.01171 16.0967 4.89765C15.6701 4.7836 15.2158 4.84345 14.8333 5.06406L14.7083 5.13073C14.455 5.27701 14.1676 5.35402 13.875 5.35402C13.5824 5.35402 13.295 5.27701 13.0417 5.13073L12.6833 4.9224C12.4302 4.77626 12.22 4.56613 12.0737 4.31309C11.9275 4.06005 11.8503 3.773 11.85 3.48073V3.33073C11.85 2.8887 11.6744 2.46478 11.3618 2.15222C11.0493 1.83966 10.6254 1.66406 10.1833 1.66406Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Investor Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Header Section */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <h1 className="text-3xl  text-[#0A2A2E] font-poppins-custom mb-2">
            Discover/ Find New <span className="text-[#9889FF]">Syndicates</span>
          </h1>
          <p className="text-base text-[#748A91] font-poppins-custom mb-6">
            Discover and invest in top-tier opportunities
          </p>

          {/* Search, Filter, and View Toggle */}
          <div className="flex justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="flex flex-row  gap-6">
                <div className="relative">
                <input
                  type="text"
                  placeholder="Search Companies, funds, leads."
                  className="w-fit bg-white border border-gray-300 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
               {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium font-poppins-custom text-[#0A2A2E]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Filter
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {filterOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveFilter(option);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-poppins-custom hover:bg-gray-50 transition-colors ${
                        activeFilter === option ? "bg-[#00F0C3] text-[#001D21]" : "text-[#0A2A2E]"
                      } ${index === 0 ? "rounded-t-lg" : ""} ${index === filterOptions.length - 1 ? "rounded-b-lg" : ""}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>


                </div>
              
            </div>

           

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H9V9H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 3H17V9H11V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 11H9V17H3V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 11H17V17H11V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Syndicate Cards */}
        <div className="space-y-4">
          {syndicates.map((syndicate, index) => (
            <div key={index} className="bg-white rounded-lg p-6" style={{border: "0.5px solid #E2E2FB"}}>
              {/* Header: Name, Date, Tags */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                    {syndicate.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 6H13M6 2V4M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{syndicate.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {syndicate.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom ${
                        tag === "Raising"
                          ? "bg-[#22C55E] text-white"
                          : "bg-[#F9F8FF]  text-[#0A2A2E] " 
                      }`}
                      style={{border: "1px solid #E2E2FB"}}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#748A91] font-poppins-custom mb-5">
                {syndicate.description}
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-5 gap-4 mb-5">
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Allocated</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.allocated}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Raised</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.raised}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1 ">Target</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.target}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Min. Investment</p>
                  <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{syndicate.minInvestment}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom mb-1">Track Record</p>
                  <p className="text-base font-medium text-[#22C55E] font-poppins-custom">{syndicate.trackRecord}</p>
                </div>
              </div>

              {/* Progress Bar and Actions */}
              <div className="flex items-center justify-between mb-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div className="bg-[#22C55E] h-full" style={{width: `${syndicate.status}%`}}></div>
                      <div className="bg-[#CEC6FF] h-full" style={{width: `${100 - syndicate.status}%`}}></div>
                    </div>
                  </div>
                  <span className="text-sm text-[#0A2A2E] font-poppins-custom whitespace-nowrap">{syndicate.status}%</span>
                </div>
              </div>

               {/* Action Buttons */}
               <div className="flex items-center justify-start gap-3 ">
                  <button className="px-4 py-2 bg-[#00F0C3] text-black rounded-xl hover:bg-[#16a34a] transition-colors font-medium font-poppins-custom flex items-center gap-2 text-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 5.25L10.125 11.625L6.375 7.875L1.5 12.75M16.5 5.25H12M16.5 5.25V9.75" stroke="#001D21" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>                                                   

                    Invest Now
                  </button>
                  <button className="px-4 py-2 bg-[#F4F6F5]  text-[#0A2A2E] rounded-xl hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                  style={{border: "0.5px solid #01373D"}}
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-[#F4F6F5]  text-[#0A2A2E] rounded-xl hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                  style={{border: "0.5px solid #01373D"}}
                  >
                    Request Invite
                  </button>
                  <button className="w-10 h-10 bg-[#F4F6F5]  text-[#0A2A2E] rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                  style={{border: "0.5px solid #01373D"}}
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1.5L12.5 7.5L19 8.5L14.5 13L15.5 19.5L10 16.5L4.5 19.5L5.5 13L1 8.5L7.5 7.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Invest;

