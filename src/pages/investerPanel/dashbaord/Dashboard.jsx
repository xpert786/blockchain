import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("discover-deals");
  const [activeNav, setActiveNav] = useState("overview");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const investDropdownRef = useRef(null);

  useEffect(() => {
    // Update activeNav based on current route
    if (location.pathname.includes("/invest")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/portfolio")) {
      setActiveNav("portfolio");
    } else {
      setActiveNav("overview");
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const investmentOpportunities = [
    {
      name: "naman",
      date: "02/01/2024",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$85k",
      tags: ["Healthcare", "Series B", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Green Energy Initiative Q3",
      date: "02/01/2024",
      allocated: "30",
      raised: "$4M",
      target: "$45M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Real Estate Opportunity Fund",
      date: "15/01/2024",
      allocated: "18",
      raised: "$1.3M",
      target: "$8M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    }
  ];

  const topSyndicates = [
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    },
    {
      name: "NextGen AI Syndicate",
      sector: "Technology",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$250,000",
      trackRecord: "+23.4% IRR",
      status: 65
    }
  ];

  const invites = [
    {
      name: "TechCorp Series c",
      date: "02/01/2024",
      allocated: "18",
      raised: "$1.2M",
      target: "$25M",
      minInvestment: "$85k",
      tags: ["Technology","series b"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Green Energy Initiative Q3",
      date: "02/01/2024",
      allocated: "30",
      raised: "$4M",
      target: "$45M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    },
    {
      name: "Real Estate Opportunity Fund",
      date: "15/01/2024",
      allocated: "18",
      raised: "$1.3M",
      target: "$8M",
      minInvestment: "$50k",
      tags: ["Energy", "Raising"],
      daysLeft: "22",
      statusColor: "bg-[#22C55E]"
    }
  ];

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
                <path d="M14.0083 20.2474C14.106 20.425 14.2495 20.5731 14.424 20.6763C14.5984 20.7794 14.7973 20.8338 15 20.8338C15.2027 20.8338 15.4016 20.7794 15.576 20.6763C15.7505 20.5731 15.894 20.425 15.9917 20.2474M11.5 12.6641C11.5 11.7358 11.8687 10.8456 12.5251 10.1892C13.1815 9.53281 14.0717 9.16406 15 9.16406C15.9283 9.16406 16.8185 9.53281 17.4749 10.1892C18.1313 10.8456 18.5 11.7358 18.5 12.6641C18.5 16.7474 20.25 17.9141 20.25 17.9141H9.75C9.75 17.9141 11.5 16.7474 11.5 12.6641Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
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
            onClick={() => setActiveNav("overview")}
            className={`px-3 py-3 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
              activeNav === "overview" 
                ? "bg-[#FFFFFF1A] text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 18.3346V10.0013H12.5V18.3346M17.5 16.668V7.99039C17.5 7.68179 17.3575 7.39049 17.1139 7.20103L10.6139 2.14548C10.2528 1.86461 9.74717 1.86461 9.38606 2.14548L2.88606 7.20103C2.64247 7.39049 2.5 7.6818 2.5 7.99039V16.668C2.5 17.11 2.67559 17.5339 2.98816 17.8465C3.30072 18.159 3.72464 18.3346 4.16667 18.3346H15.8333C16.2754 18.3346 16.6993 18.159 17.0118 17.8465C17.3244 17.5339 17.5 17.11 17.5 16.668Z" stroke="#00F0C3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button 
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className={`px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
                activeNav === "invest" 
                  ? "bg-[#FFFFFF1A] text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
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
                    setActiveNav("invest");
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
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Invites
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/top-syndicates");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Top Syndicates
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/wishlist");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                >
                  Wishlist
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              navigate("/investor-panel/portfolio");
              setActiveNav("portfolio");
            }}
            className={`px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
              activeNav === "portfolio" 
                ? "bg-[#FFFFFF1A] text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.6665 9.99739C1.6665 6.06906 1.6665 4.1049 2.8865 2.88406C4.10817 1.66406 6.0715 1.66406 9.99984 1.66406C13.9282 1.66406 15.8923 1.66406 17.1123 2.88406C18.3332 4.10573 18.3332 6.06906 18.3332 9.99739C18.3332 13.9257 18.3332 15.8899 17.1123 17.1099C15.8932 18.3307 13.9282 18.3307 9.99984 18.3307C6.0715 18.3307 4.10734 18.3307 2.8865 17.1099C1.6665 15.8907 1.6665 13.9257 1.6665 9.99739Z" stroke="white" stroke-width="1.2"/>
                <path d="M5.83301 11.6615L7.74384 9.75062C7.90011 9.5944 8.11204 9.50664 8.33301 9.50664C8.55398 9.50664 8.7659 9.5944 8.92217 9.75062L10.2438 11.0723C10.4001 11.2285 10.612 11.3163 10.833 11.3163C11.054 11.3163 11.2659 11.2285 11.4222 11.0723L14.1663 8.32812M14.1663 8.32812V10.4115M14.1663 8.32812H12.083" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

            Your Portfolio
          </button>
          <button 
            onClick={() => setActiveNav("taxes")}
            className={`px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
              activeNav === "taxes" 
                ? "bg-[#FFFFFF1A] text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.26522 2.29058C10.5368 1.75545 13.1345 2.35433 14.9332 3.82964C16.2835 4.98266 17.166 6.34446 17.649 8.05035C17.6701 8.12323 17.6917 8.19695 17.7135 8.27203C18.0674 9.7751 17.903 11.4637 17.3385 12.9039L17.2203 13.189C17.1941 13.2496 17.1932 13.2497 17.1666 13.3111C16.5579 14.69 15.5079 15.8885 14.2232 16.6763L14.2213 16.6773C14.1617 16.7154 14.102 16.7533 14.0406 16.7925C12.3547 17.8312 10.1332 18.1436 8.20272 17.7076C6.81781 17.3587 5.58442 16.6853 4.55429 15.6978L4.55233 15.6959L4.38632 15.5445C3.36253 14.5752 2.73369 13.3166 2.35019 11.9625L2.28573 11.7398C1.93202 10.237 2.09635 8.54888 2.66073 7.10894L2.7789 6.82379L2.83261 6.70074C3.64448 4.86185 5.20761 3.41056 7.07187 2.67047L7.07284 2.67144C7.39145 2.55135 7.71435 2.44925 8.04355 2.35601C8.11648 2.33487 8.19009 2.31237 8.26522 2.29058ZM13.7857 5.29937C11.4093 3.24156 7.83103 3.72119 5.66659 5.80914L5.66366 5.81207C4.43298 7.08878 3.97554 8.67593 3.99569 10.4009V10.4029C4.04228 12.0348 4.86514 13.3777 5.97812 14.4927L5.98105 14.4947C7.05839 15.5068 8.59078 16.0678 10.0621 16.0552H10.066C11.5479 15.994 12.931 15.5038 14.0328 14.48C14.0868 14.4302 14.1412 14.38 14.1969 14.3287L14.1988 14.3277C15.2279 13.3401 15.9705 11.9193 16.0016 10.4625C16.0315 8.68192 15.6074 7.15784 14.3355 5.83746L14.3346 5.83648L14.1607 5.65972C14.1126 5.61016 14.0638 5.5604 14.0142 5.50933L14.0123 5.50738L13.7857 5.29937ZM11.8336 7.10699C12.0783 7.07171 12.3394 7.12899 12.6217 7.29839C12.8362 7.54182 12.9347 7.77123 12.9332 8.09332C12.8804 8.42037 12.6679 8.72437 12.3932 9.01519C12.2559 9.16048 12.106 9.3002 11.9586 9.43511C11.8123 9.56899 11.6665 9.69988 11.5416 9.82574C11.5002 9.86742 11.4592 9.90975 11.4166 9.95269C11.1982 10.1728 10.9791 10.3922 10.7603 10.6119C10.5798 10.7933 10.4 10.9756 10.2203 11.1578C10.0025 11.3787 9.78323 11.5983 9.56405 11.8179C9.48097 11.9014 9.39856 11.9858 9.31601 12.0699C9.2009 12.187 9.084 12.3033 8.96737 12.4195L8.9664 12.4205C8.93353 12.4543 8.90062 12.4882 8.86679 12.523C8.61692 12.7689 8.34878 12.9303 8.00937 12.9468C7.73689 12.9238 7.55638 12.8378 7.34335 12.6597C7.14096 12.4165 7.04984 12.1896 7.0621 11.8795C7.17248 11.5017 7.33213 11.2822 7.61874 10.9996L7.61972 10.9986C7.65967 10.958 7.69868 10.9164 7.73983 10.8746L7.74081 10.8756C7.87279 10.7419 8.00666 10.6089 8.14022 10.4761C8.23308 10.3829 8.32577 10.2892 8.41855 10.1959C8.61282 10.0008 8.80822 9.80598 9.00351 9.61187C9.25343 9.36334 9.50187 9.11316 9.7496 8.86285C9.94063 8.67021 10.1325 8.47833 10.3248 8.28668L10.6002 8.01031C10.7277 7.88152 10.8566 7.75317 10.9859 7.62554L10.9869 7.62457C11.0419 7.56828 11.0424 7.56743 11.0973 7.51129C11.3384 7.27655 11.584 7.143 11.8336 7.10699ZM11.5846 11.1451C11.7879 11.0651 12.0347 11.0563 12.3267 11.0943C12.594 11.2213 12.7486 11.3769 12.8756 11.6441C12.9185 11.9708 12.9166 12.2343 12.7887 12.5191C12.6545 12.6593 12.5482 12.7513 12.4312 12.8111C12.3134 12.8713 12.178 12.9031 11.982 12.9107C11.7865 12.9031 11.6515 12.8712 11.5338 12.8111C11.417 12.7514 11.3093 12.6608 11.1754 12.5211C11.0468 12.2357 11.0455 11.9713 11.0885 11.6441C11.2172 11.3742 11.3857 11.2234 11.5846 11.1451ZM8.358 7.1275C8.62696 7.25475 8.78232 7.41003 8.90976 7.67828C8.95267 8.00489 8.9509 8.26842 8.82284 8.55328C8.68877 8.69331 8.58232 8.78551 8.46542 8.84527C8.34758 8.90545 8.21208 8.93632 8.0162 8.9439C7.82055 8.93627 7.68474 8.90547 7.56698 8.84527C7.45052 8.78568 7.34397 8.69449 7.21054 8.55523C7.08172 8.26973 7.07965 8.00551 7.12265 7.67828C7.25139 7.40817 7.41977 7.25663 7.61874 7.17828C7.82141 7.09859 8.06734 7.08992 8.358 7.1275Z" fill="white"/>
            <path d="M5.66659 5.80914C7.83103 3.72119 11.4093 3.24156 13.7857 5.29937L14.0123 5.50738L14.0142 5.50933C14.0638 5.5604 14.1126 5.61016 14.1607 5.65972L14.3346 5.83648L14.3355 5.83746C15.6074 7.15784 16.0315 8.68192 16.0016 10.4625C15.9705 11.9193 15.2279 13.3401 14.1988 14.3277L14.1969 14.3287C14.1412 14.38 14.0868 14.4302 14.0328 14.48C12.931 15.5038 11.5479 15.994 10.066 16.0552H10.0621C8.59078 16.0678 7.05839 15.5068 5.98105 14.4947L5.97812 14.4927C4.86514 13.3777 4.04228 12.0348 3.99569 10.4029V10.4009C3.97554 8.67593 4.43298 7.08878 5.66366 5.81207L5.66659 5.80914ZM5.66659 5.80914L5.73593 5.8814M8.26522 2.29058C10.5368 1.75545 13.1345 2.35433 14.9332 3.82964C16.2835 4.98266 17.166 6.34446 17.649 8.05035C17.6701 8.12323 17.6917 8.19695 17.7135 8.27203C18.0674 9.7751 17.903 11.4637 17.3385 12.9039L17.2203 13.189C17.1941 13.2496 17.1932 13.2497 17.1666 13.3111C16.5579 14.69 15.5079 15.8885 14.2232 16.6763L14.2213 16.6773C14.1617 16.7154 14.102 16.7533 14.0406 16.7925C12.3547 17.8312 10.1332 18.1436 8.20272 17.7076C6.81781 17.3587 5.58442 16.6853 4.55429 15.6978L4.55233 15.6959L4.38632 15.5445C3.36253 14.5752 2.73369 13.3166 2.35019 11.9625L2.28573 11.7398C1.93202 10.237 2.09635 8.54888 2.66073 7.10894L2.7789 6.82379L2.83261 6.70074C3.64448 4.86185 5.20761 3.41056 7.07187 2.67047L7.07284 2.67144C7.39145 2.55135 7.71435 2.44925 8.04355 2.35601C8.11648 2.33487 8.19009 2.31237 8.26522 2.29058ZM11.8336 7.10699C12.0783 7.07171 12.3394 7.12899 12.6217 7.29839C12.8362 7.54182 12.9347 7.77123 12.9332 8.09332C12.8804 8.42037 12.6679 8.72437 12.3932 9.01519C12.2559 9.16048 12.106 9.3002 11.9586 9.43511C11.8123 9.56899 11.6665 9.69988 11.5416 9.82574C11.5002 9.86742 11.4592 9.90975 11.4166 9.95269C11.1982 10.1728 10.9791 10.3922 10.7603 10.6119C10.5798 10.7933 10.4 10.9756 10.2203 11.1578C10.0025 11.3787 9.78323 11.5983 9.56405 11.8179C9.48097 11.9014 9.39856 11.9858 9.31601 12.0699C9.2009 12.187 9.084 12.3033 8.96737 12.4195L8.9664 12.4205C8.93353 12.4543 8.90062 12.4882 8.86679 12.523C8.61692 12.7689 8.34878 12.9303 8.00937 12.9468C7.73689 12.9238 7.55638 12.8378 7.34335 12.6597C7.14096 12.4165 7.04984 12.1896 7.0621 11.8795C7.17248 11.5017 7.33213 11.2822 7.61874 10.9996L7.61972 10.9986C7.65967 10.958 7.69868 10.9164 7.73983 10.8746L7.74081 10.8756C7.87279 10.7419 8.00666 10.6089 8.14022 10.4761C8.23308 10.3829 8.32577 10.2892 8.41855 10.1959C8.61282 10.0008 8.80822 9.80598 9.00351 9.61187C9.25343 9.36334 9.50187 9.11316 9.7496 8.86285C9.94063 8.67021 10.1325 8.47833 10.3248 8.28668L10.6002 8.01031C10.7277 7.88152 10.8566 7.75317 10.9859 7.62554L10.9869 7.62457C11.0419 7.56828 11.0424 7.56743 11.0973 7.51129C11.3384 7.27655 11.584 7.143 11.8336 7.10699ZM11.5846 11.1451C11.7879 11.0651 12.0347 11.0563 12.3267 11.0943C12.594 11.2213 12.7486 11.3769 12.8756 11.6441C12.9185 11.9708 12.9166 12.2343 12.7887 12.5191C12.6545 12.6593 12.5482 12.7513 12.4312 12.8111C12.3134 12.8713 12.178 12.9031 11.982 12.9107C11.7865 12.9031 11.6515 12.8712 11.5338 12.8111C11.417 12.7514 11.3093 12.6608 11.1754 12.5211C11.0468 12.2357 11.0455 11.9713 11.0885 11.6441C11.2172 11.3742 11.3857 11.2234 11.5846 11.1451ZM8.358 7.1275C8.62696 7.25475 8.78232 7.41003 8.90976 7.67828C8.95267 8.00489 8.9509 8.26842 8.82284 8.55328C8.68877 8.69331 8.58232 8.78551 8.46542 8.84527C8.34758 8.90545 8.21208 8.93632 8.0162 8.9439C7.82055 8.93627 7.68474 8.90547 7.56698 8.84527C7.45052 8.78568 7.34397 8.69449 7.21054 8.55523C7.08172 8.26973 7.07965 8.00551 7.12265 7.67828C7.25139 7.40817 7.41977 7.25663 7.61874 7.17828C7.82141 7.09859 8.06734 7.08992 8.358 7.1275Z" stroke="#001D21" stroke-width="0.5"/>
            </svg>

            Taxes & Document
          </button>
          <button 
            onClick={() => setActiveNav("messages")}
            className={`px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
              activeNav === "messages" 
                ? "bg-[#FFFFFF1A] text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

            Messages
          </button>
          <button 
            onClick={() => setActiveNav("settings")}
            className={`px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
              activeNav === "settings" 
                ? "bg-[#FFFFFF1A] text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1833 1.66406H9.81667C9.37464 1.66406 8.95072 1.83966 8.63816 2.15222C8.3256 2.46478 8.15 2.8887 8.15 3.33073V3.48073C8.1497 3.773 8.07255 4.06005 7.92628 4.31309C7.78002 4.56613 7.56978 4.77626 7.31667 4.9224L6.95834 5.13073C6.70497 5.27701 6.41756 5.35402 6.125 5.35402C5.83244 5.35402 5.54503 5.27701 5.29167 5.13073L5.16667 5.06406C4.78422 4.84345 4.32987 4.7836 3.90334 4.89765C3.47681 5.01171 3.11296 5.29034 2.89167 5.6724L2.70833 5.98906C2.48772 6.37151 2.42787 6.82587 2.54192 7.25239C2.65598 7.67892 2.93461 8.04277 3.31667 8.26406L3.44167 8.3474C3.69356 8.49282 3.90302 8.70164 4.04921 8.95309C4.1954 9.20454 4.27325 9.48987 4.275 9.78073V10.2057C4.27617 10.4994 4.19971 10.7882 4.05337 11.0428C3.90703 11.2974 3.69601 11.5089 3.44167 11.6557L3.31667 11.7307C2.93461 11.952 2.65598 12.3159 2.54192 12.7424C2.42787 13.1689 2.48772 13.6233 2.70833 14.0057L2.89167 14.3224C3.11296 14.7044 3.47681 14.9831 3.90334 15.0971C4.32987 15.2112 4.78422 15.1513 5.16667 14.9307L5.29167 14.8641C5.54503 14.7178 5.83244 14.6408 6.125 14.6408C6.41756 14.6408 6.70497 14.7178 6.95834 14.8641L7.31667 15.0724C7.56978 15.2185 7.78002 15.4287 7.92628 15.6817C8.07255 15.9347 8.1497 16.2218 8.15 16.5141V16.6641C8.15 17.1061 8.3256 17.53 8.63816 17.8426C8.95072 18.1551 9.37464 18.3307 9.81667 18.3307H10.1833C10.6254 18.3307 11.0493 18.1551 11.3618 17.8426C11.6744 17.53 11.85 17.1061 11.85 16.6641V16.5141C11.8503 16.2218 11.9275 15.9347 12.0737 15.6817C12.22 15.4287 12.4302 15.2185 12.6833 15.0724L13.0417 14.8641C13.295 14.7178 13.5824 14.6408 13.875 14.6408C14.1676 14.6408 14.455 14.7178 14.7083 14.8641L14.8333 14.9307C15.2158 15.1513 15.6701 15.2112 16.0967 15.0971C16.5232 14.9831 16.887 14.7044 17.1083 14.3224L17.2917 13.9974C17.5123 13.6149 17.5721 13.1606 17.4581 12.7341C17.344 12.3075 17.0654 11.9437 16.6833 11.7224L16.5583 11.6557C16.304 11.5089 16.093 11.2974 15.9466 11.0428C15.8003 10.7882 15.7238 10.4994 15.725 10.2057V9.78906C15.7238 9.49538 15.8003 9.2066 15.9466 8.95197C16.093 8.69734 16.304 8.4859 16.5583 8.33906L16.6833 8.26406C17.0654 8.04277 17.344 7.67892 17.4581 7.25239C17.5721 6.82587 17.5123 6.37151 17.2917 5.98906L17.1083 5.6724C16.887 5.29034 16.5232 5.01171 16.0967 4.89765C15.6701 4.7836 15.2158 4.84345 14.8333 5.06406L14.7083 5.13073C14.455 5.27701 14.1676 5.35402 13.875 5.35402C13.5824 5.35402 13.295 5.27701 13.0417 5.13073L12.6833 4.9224C12.4302 4.77626 12.22 4.56613 12.0737 4.31309C11.9275 4.06005 11.8503 3.773 11.85 3.48073V3.33073C11.85 2.8887 11.6744 2.46478 11.3618 2.15222C11.0493 1.83966 10.6254 1.66406 10.1833 1.66406Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            Investor Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl">
          {/* KYC Status Card */}
          <div className="bg-[#CAE6FF] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">KYC Status</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="#01373D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#01373D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="w-fit bg-[#001D21] text-white px-3 py-2 rounded-md text-xs font-medium font-poppins-custom">
                Verified
              </span>
            </div>
          </div>

          {/* Total Investments Card */}
          <div className="bg-[#D7F8F0] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">Total Investments</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7L13.5 15.5L8.5 10.5L2 17M22 7H16M22 7V13" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

            </div>
            <div className="flex flex-row justify-between gap-5">
              <p className="text-2xl font-bold text-[#0A2A2E] font-poppins-custom mb-1">3</p>
              <p className="text-sm text-[#748A91] font-poppins-custom">Active SPVs</p>
            </div>
          </div>

          {/* Portfolio Value Card */}
          <div className="bg-[#E2E2FB] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">Portfolio Value</p>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5009 4.749H14.0009C14.0009 3.003 13.9859 2.217 13.6349 1.866C13.2839 1.515 12.4979 1.5 10.7519 1.5C9.00593 1.5 8.21993 1.515 7.86893 1.866C7.51793 2.217 7.50293 3.003 7.50293 4.749H6.00293C6.00293 2.724 6.00293 1.611 6.80693 0.804C7.61093 0 8.72693 0 10.7519 0C12.7769 0 13.8899 0 14.6969 0.804C15.5009 1.611 15.5009 2.724 15.5009 4.749ZM10.7519 17.499C10.3379 17.499 10.0019 17.163 10.0019 16.749V16.743C9.57593 16.638 9.18593 16.443 8.85893 16.17C8.31593 15.717 8.00393 15.078 8.00393 14.415C8.00393 14.001 8.33993 13.665 8.75393 13.665C9.16793 13.665 9.50393 14.001 9.50393 14.415C9.50393 14.913 10.0769 15.333 10.7549 15.333C11.4329 15.333 12.0059 14.913 12.0059 14.415C12.0059 13.917 11.4329 13.497 10.7549 13.497C10.0469 13.497 9.37193 13.263 8.86193 12.834C8.31893 12.381 8.00693 11.742 8.00693 11.079C8.00693 10.416 8.31893 9.777 8.86193 9.324C9.18893 9.051 9.58193 8.856 10.0049 8.751V8.745C10.0049 8.331 10.3409 7.995 10.7549 7.995C11.1689 7.995 11.5049 8.331 11.5049 8.745V8.751C11.9309 8.856 12.3239 9.051 12.6479 9.324C13.1909 9.777 13.5029 10.416 13.5029 11.079C13.5029 11.493 13.1669 11.829 12.7529 11.829C12.3389 11.829 12.0029 11.493 12.0029 11.079C12.0029 10.581 11.4299 10.161 10.7519 10.161C10.0739 10.161 9.50093 10.581 9.50093 11.079C9.50093 11.577 10.0739 11.997 10.7519 11.997C11.4599 11.997 12.1349 12.231 12.6449 12.66C13.1879 13.113 13.4999 13.752 13.4999 14.415C13.4999 15.078 13.1879 15.717 12.6449 16.17C12.3179 16.443 11.9249 16.638 11.5019 16.743V16.749C11.5019 17.163 11.1659 17.499 10.7519 17.499Z" fill="#01373D"/>
            <path d="M12.753 21.4981H8.751C6.807 21.4981 5.4 21.4981 4.263 21.3451C2.958 21.1711 2.073 20.7871 1.392 20.1061C0.711 19.4251 0.33 18.5401 0.153 17.2351C7.15256e-08 16.0951 0 14.6911 0 12.7471C0 10.8031 7.15256e-08 9.39609 0.153 8.25909C0.327 6.95409 0.711 6.06909 1.392 5.38809C2.073 4.70709 2.958 4.32609 4.263 4.14909C5.403 3.99609 6.807 3.99609 8.751 3.99609H12.75C14.694 3.99609 16.101 3.99609 17.238 4.14909C18.543 4.32309 19.428 4.70709 20.109 5.38809C20.79 6.06909 21.171 6.95409 21.348 8.25909C21.501 9.39909 21.501 10.8031 21.501 12.7471C21.501 14.6911 21.501 16.0981 21.348 17.2351C21.174 18.5401 20.79 19.4251 20.109 20.1061C19.428 20.7871 18.543 21.1681 17.238 21.3451C16.101 21.4981 14.697 21.4981 12.753 21.4981ZM8.751 5.49909C5.19 5.49909 3.405 5.49909 2.454 6.45009C1.503 7.40409 1.503 9.18909 1.503 12.7501C1.503 16.3111 1.503 18.0961 2.454 19.0471C3.405 19.9981 5.193 19.9981 8.751 19.9981H12.75C16.311 19.9981 18.096 19.9981 19.047 19.0471C19.998 18.0961 19.998 16.3081 19.998 12.7501C19.998 9.18909 19.998 7.40409 19.047 6.45309C18.099 5.49909 16.311 5.49909 12.753 5.49909H8.751Z" fill="#01373D"/>
            </svg>

            </div>
            <div className="flex flex-row justify-between gap-5">
              <p className="text-2xl font-bold text-[#0A2A2E] font-poppins-custom mb-1">$287,500</p>
              <p className="text-sm text-[#22C55E] font-poppins-custom">+ 15% from invested capital</p>
            </div>
          </div>

          {/* Notification Card */}
          <div className="bg-[#FFEFE8] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#748A91] font-poppins-custom">Notification</p>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.6316 16.5881C20.101 15.675 19.3126 13.0997 19.3126 9.75C19.3126 7.8106 18.5422 5.95064 17.1708 4.57928C15.7994 3.20792 13.9395 2.4375 12.0001 2.4375C10.0607 2.4375 8.20073 3.20792 6.82937 4.57928C5.45801 5.95064 4.68758 7.8106 4.68758 9.75C4.68758 13.1006 3.89821 15.675 3.36758 16.5881C3.25116 16.7875 3.18938 17.014 3.18849 17.2449C3.18759 17.4758 3.2476 17.7028 3.36247 17.903C3.47734 18.1033 3.643 18.2697 3.84274 18.3855C4.04247 18.5013 4.26922 18.5623 4.50008 18.5625H8.48258C8.61921 19.3964 9.04778 20.1545 9.69177 20.7016C10.3358 21.2486 11.1532 21.549 11.9982 21.549C12.8432 21.549 13.6607 21.2486 14.3047 20.7016C14.9486 20.1545 15.3772 19.3964 15.5138 18.5625H19.5001C19.7308 18.562 19.9573 18.5007 20.1568 18.3848C20.3562 18.2689 20.5216 18.1024 20.6363 17.9022C20.7509 17.702 20.8108 17.4751 20.8098 17.2444C20.8088 17.0137 20.7471 16.7874 20.6307 16.5881H20.6316ZM12.0001 20.4375C11.4516 20.4373 10.9191 20.2521 10.4889 19.9119C10.0586 19.5716 9.75573 19.0962 9.62915 18.5625H14.371C14.2444 19.0962 13.9415 19.5716 13.5113 19.9119C13.081 20.2521 12.5486 20.4373 12.0001 20.4375ZM19.6604 17.3438C19.645 17.3725 19.6219 17.3964 19.5938 17.4129C19.5657 17.4295 19.5336 17.438 19.501 17.4375H4.50008C4.46748 17.438 4.43538 17.4295 4.40728 17.4129C4.37918 17.3964 4.35615 17.3725 4.34071 17.3438C4.32425 17.3152 4.31559 17.2829 4.31559 17.25C4.31559 17.2171 4.32425 17.1848 4.34071 17.1562C5.0504 15.9375 5.81258 13.0959 5.81258 9.75C5.81258 8.10897 6.46448 6.53516 7.62486 5.37478C8.78524 4.2144 10.3591 3.5625 12.0001 3.5625C13.6411 3.5625 15.2149 4.2144 16.3753 5.37478C17.5357 6.53516 18.1876 8.10897 18.1876 9.75C18.1876 13.095 18.9507 15.9328 19.6604 17.1562C19.6769 17.1848 19.6855 17.2171 19.6855 17.25C19.6855 17.2829 19.6769 17.3152 19.6604 17.3438Z" fill="#01373D"/>
                </svg>

            </div>
            <div className="flex flex-row justify-between gap-5">
              <p className="text-2xl font-bold text-[#0A2A2E] font-poppins-custom mb-1">5</p>
              <p className="text-sm text-[#22C55E] font-poppins-custom">Unread Updates</p>
            </div>
          </div>
        </div>

        {/* New Investment Section */}
        <div className="mb-8">


          <div className="bg-white p-4 my-4 rounded-xl ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl  text-[#0A2A2E] font-poppins-custom">
              New <span className="text-[#9889FF]">Investment</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("discover-deals")}
              className={`px-4 py-2 rounded-lg font-medium font-poppins-custom transition-colors ${
                activeTab === "discover-deals"
                  ? "bg-[#00F0C3] text-[#001D21]"
                  : "bg-white text-[#748A91] hover:bg-gray-50"
              }`}
            >
              Discover Deals
            </button>
            <button
              onClick={() => setActiveTab("top-syndicates")}
              className={`px-4 py-2 rounded-lg font-medium font-poppins-custom transition-colors ${
                activeTab === "top-syndicates"
                  ? "bg-[#00F0C3] text-[#001D21]"
                  : "bg-white text-[#748A91] hover:bg-gray-50"
              }`}
            >
              Top Syndicates
            </button>
            <button
              onClick={() => setActiveTab("invites")}
              className={`px-4 py-2 rounded-lg font-medium font-poppins-custom transition-colors ${
                activeTab === "invites"
                  ? "bg-[#00F0C3] text-[#001D21]"
                  : "bg-white text-[#748A91] hover:bg-gray-50"
              }`}
            >
              Invites
            </button>
          </div>
            </div>  
          

          {/* Investment Opportunities / Top Syndicates / Invites */}
          {(() => {
            if (activeTab === "top-syndicates") {
              return (
                <div className="bg-white rounded-lg p-6 mb-6" style={{border: "0.5px solid #E2E2FB"}}>
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1.2fr_1.2fr_1.5fr_0.8fr] gap-4 pb-4 border-b border-gray-200 mb-4">
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Syndicate Name</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Sector</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Allocated</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Raised</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Target</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Min. Investment</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Track Record</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Status</div>
                <div className="text-sm font-medium text-[#748A91] font-poppins-custom">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-3 mb-6">
                {topSyndicates.map((syndicate, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 ">
                    <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1.2fr_1.2fr_1.5fr_0.8fr] gap-4 items-center">
                      <div className="text-sm font-semibold text-[#0A2A2E] font-poppins-custom">{syndicate.name}</div>
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.sector}</div>
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.allocated}</div>
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.raised}</div>
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.target}</div>
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.minInvestment}</div>
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">{syndicate.trackRecord}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div className="bg-[#22C55E] h-full" style={{width: `${syndicate.status}%`}}></div>
                            <div className="bg-[#CEC6FF] h-full" style={{width: `${100 - syndicate.status}%`}}></div>
                          </div>
                        </div>
                        <span className="text-sm text-[#0A2A2E] font-poppins-custom whitespace-nowrap">{syndicate.status}%</span>
                      </div>
                      <div className="flex justify-center">
                        <button className="w-8 h-8 bg-white   rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" fill="#F4F6F5"/>
                        <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" stroke="#E8EAED" stroke-width="0.5"/>
                        <path d="M12.4163 13.0013C12.4163 13.3235 12.6775 13.5846 12.9997 13.5846C13.3218 13.5846 13.583 13.3235 13.583 13.0013C13.583 12.6791 13.3218 12.418 12.9997 12.418C12.6775 12.418 12.4163 12.6791 12.4163 13.0013Z" fill="#01373D" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.4163 17.0833C12.4163 17.4055 12.6775 17.6667 12.9997 17.6667C13.3218 17.6667 13.583 17.4055 13.583 17.0833C13.583 16.7612 13.3218 16.5 12.9997 16.5C12.6775 16.5 12.4163 16.7612 12.4163 17.0833Z" fill="#01373D" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.4163 8.91536C12.4163 9.23753 12.6775 9.4987 12.9997 9.4987C13.3218 9.4987 13.583 9.23753 13.583 8.91536C13.583 8.5932 13.3218 8.33203 12.9997 8.33203C12.6775 8.33203 12.4163 8.5932 12.4163 8.91536Z" fill="#01373D" stroke="#01373D" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <div className="text-center">
                <button className="px-6 py-3 bg-white text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2 mx-auto"
                style={{border: "0.5px solid #01373D"}}
                >
                  View More Syndicates
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
                </div>
              );
            } else if (activeTab === "invites") {
              return (
                <div key="invites-section" className="space-y-4 mb-6 bg-white rounded-lg p-6"
                style={{border: "0.5px solid #E2E2FB"}}
                >
              {invites.map((invite, index) => (
              <div key={index} className="bg-white rounded-lg p-6"
              style={{border: "0.5px solid #E2E2FB"}}
              >
                {/* Header Section: Title/Date on Left, Tags on Right */}
                <div className="flex items-start justify-between mb-5">
                  {/* Left: Title and Date */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                      {invite.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H13M6 2V4M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{invite.date}</span>
                    </div>
                  </div>

                  {/* Right: Tags */}
                  <div className="flex items-center gap-2">
                    {invite.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium font-poppins-custom ${
                          tag === "Raising"
                            ? "bg-[#22C55E] text-white"
                            : "bg-[#F9F8FF] border border-gray-400 text-[#0A2A2E]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Section: Four boxes with light gray backgrounds */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Allocated</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.allocated}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Raised</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.raised}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Target</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.target}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Min. Investment</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{invite.minInvestment}</p>
                  </div>
                </div>

                {/* Footer Section: Buttons on Left, Timer on Right */}
                <div className="flex items-center justify-between">
                  {/* Left: Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-[#00F0C3] text-[#001D21] rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1401_2449)">
                        <path d="M14.6673 7.38527V7.99861C14.6665 9.43622 14.201 10.8351 13.3402 11.9865C12.4794 13.1379 11.2695 13.9803 9.89089 14.3879C8.51227 14.7955 7.03882 14.7465 5.6903 14.2483C4.34177 13.7501 3.19042 12.8293 2.40796 11.6233C1.6255 10.4173 1.25385 8.99065 1.34844 7.55615C1.44303 6.12165 1.99879 4.75616 2.93284 3.66332C3.86689 2.57049 5.12917 1.80886 6.53144 1.49204C7.93371 1.17521 9.40083 1.32017 10.714 1.90527M6.00065 7.33194L8.00065 9.33194L14.6673 2.66527" stroke="#001D21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_1401_2449">
                          <rect width="16" height="16" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>


                      Accept and Invite Now
                    </button>
                    <button className="flex flex-row items-center justify-center gap-2 px-6 py-2.5 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom">
                      Decline
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1401_2454)">
                          <path d="M10.0007 5.9987L6.00065 9.9987M6.00065 5.9987L10.0007 9.9987M14.6673 7.9987C14.6673 11.6806 11.6825 14.6654 8.00065 14.6654C4.31875 14.6654 1.33398 11.6806 1.33398 7.9987C1.33398 4.3168 4.31875 1.33203 8.00065 1.33203C11.6825 1.33203 14.6673 4.3168 14.6673 7.9987Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1401_2454">
                            <rect width="16" height="16" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <button className="w-10 h-10 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1.5L12.5 7.5L19 8.5L14.5 13L15.5 19.5L10 16.5L4.5 19.5L5.5 13L1 8.5L7.5 7.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Right: Timer */}
                  <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{invite.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
              {/* View All Invites Button */}
              <div className="text-center mt-6">
                <button className="px-6 py-3 bg-white border border-gray-300 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2 mx-auto">
                  View All Invites
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
              );
            } else {
              return (
                <div key="discover-deals-section" className="space-y-4 mb-6 bg-white rounded-lg p-6"
                style={{border: "0.5px solid #E2E2FB"}}
                >
            {investmentOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-lg p-6"
              style={{border: "0.5px solid #E2E2FB"}}
              >
                {/* Header Section: Title/Date on Left, Tags on Right */}
                <div className="flex items-start justify-between mb-5">
                  {/* Left: Title and Date */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#0A2A2E] font-poppins-custom mb-2">
                        {opportunity.name}
                      </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2H4C3.44772 2 3 2.44772 3 3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V3C13 2.44772 12.5523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 6H13M6 2V4M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{opportunity.date}</span>
                      </div>
                    </div>

                  {/* Right: Tags */}
                      <div className="flex items-center gap-2">
                        {opportunity.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium font-poppins-custom ${
                              tag === "Raising"
                            ? "bg-[#22C55E] text-white"
                            : "bg-[#F9F8FF] border border-gray-400 text-[#0A2A2E]"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                {/* Metrics Section: Four boxes with light gray backgrounds */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Allocated</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.allocated}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Raised</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.raised}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Target</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.target}</p>
                  </div>
                  <div className="bg-[#F9F8FF] rounded-lg p-4 flex flex-row justify-between items-center"
                  style={{border: "0.5px solid #E2E2FB"}}
                  >
                    <p className="text-xs text-[#748A91] font-poppins-custom mb-1.5">Min. Investment</p>
                    <p className="text-base font-semibold text-[#0A2A2E] font-poppins-custom">{opportunity.minInvestment}</p>
                  </div>
                </div>

                {/* Footer Section: Buttons on Left, Timer on Right */}
                <div className="flex items-center justify-between">
                  {/* Left: Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-[#00F0C3] text-[#001D21] rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 5.25L10.125 11.625L6.375 7.875L1.5 12.75M16.5 5.25H12M16.5 5.25V9.75" stroke="#001D21" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                      Invest Now
                    </button>
                    <button className="px-5 py-2.5 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom">
                      View Details
                    </button>
                    <button className="w-10 h-10 bg-[#F4F6F5] border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1.5L12.5 7.5L19 8.5L14.5 13L15.5 19.5L10 16.5L4.5 19.5L5.5 13L1 8.5L7.5 7.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Right: Timer */}
                  <div className="flex items-center gap-1.5 text-sm text-[#748A91] font-poppins-custom">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{opportunity.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          {/* View All Deals Button */}
              <div className="text-center mt-6">
            <button className="px-6 py-3 bg-white border border-gray-300 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom flex items-center gap-2 mx-auto">
              View All Deals →
            </button>
          </div>
                </div>
              );
            }
          })()}
        </div>

        {/* My Portfolio Snapshot Section */}
        <div className="bg-white rounded-lg p-6"
        style={{border: "0.5px solid #E2E2FB"}}
        >
          <div className="mb-6 flex items-start justify-between"
   
          >
        <div>
              <h2 className="text-3xl  text-[#0A2A2E] font-poppins-custom mb-2">
              My Portfolio Snapshot
            </h2>
            <p className="text-sm text-[#748A91] font-poppins-custom">
              Your investment performance overview
            </p>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-400 text-[#0A2A2E] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium font-poppins-custom">
              View Full
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Total Invested Card */}
            <div className="bg-[#F9F8FF] rounded-lg p-6 "
            style={{border: "0.5px solid #E2E2FB"}}
            >
              <p className="text-sm text-[#748A91] font-poppins-custom mb-3">Total Invested</p>
              <p className="text-3xl  text-[#0A2A2E] font-poppins-custom mb-6">$250,000</p>
              <p className="text-sm text-[#748A91] font-poppins-custom mb-2">Current Value</p>
              <p className="text-2xl text-[#0A2A2E] font-poppins-custom">$287,500</p>
            </div>

            {/* Unrealized Gain Card */}
            <div className="bg-[#F9F8FF] rounded-lg p-6"
            style={{border: "0.5px solid #E2E2FB"}}
            >
              <p className="text-sm text-[#748A91] font-poppins-custom mb-3">Unrealized Gain</p>
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl  text-[#22C55E] font-poppins-custom">+$37,500</p>
                <p className="text-sm text-[#22C55E] font-poppins-custom">15% Portfolio Growth</p>
              </div>
              {/* Line Graph Representation */}
              <div className="h-40 bg-[#F9F8FF] rounded-lg relative overflow-hidden mt-4">
                <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none" className="absolute inset-0">
                  <defs>
                    <linearGradient id="portfolioAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00F0C3" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#00F0C3" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <polyline
                    points="15,120 45,105 75,90 105,75 135,60 165,45 195,30 225,20 255,12 285,5"
                    fill="none"
                    stroke="#00F0C3"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="15,120 45,105 75,90 105,75 135,60 165,45 195,30 225,20 255,12 285,5 285,150 15,150"
                    fill="url(#portfolioAreaGradient)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

