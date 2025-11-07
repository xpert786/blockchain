import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";

const TopSyndicates = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const filterDropdownRef = useRef(null);
  const investDropdownRef = useRef(null);
  const actionsDropdownRefs = useRef({});
  const actionButtonRefs = useRef({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
      // Check if click is outside any actions dropdown
      if (showActionsDropdown !== null) {
        const clickedDropdown = actionsDropdownRefs.current[showActionsDropdown];
        const clickedButton = actionButtonRefs.current[showActionsDropdown];
        if (clickedDropdown && !clickedDropdown.contains(event.target) && 
            clickedButton && !clickedButton.contains(event.target)) {
          setShowActionsDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsDropdown]);

  // Update dropdown position to prevent cutoff
  useEffect(() => {
    if (showActionsDropdown !== null) {
      const updatePosition = () => {
        const button = actionButtonRefs.current[showActionsDropdown];
        if (button) {
          const buttonRect = button.getBoundingClientRect();
          const dropdownHeight = 180; // Approximate height of dropdown with 4 items
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          // Position dropdown above if not enough space below, but enough space above
          if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Position above button
            setDropdownPosition({
              bottom: `${window.innerHeight - buttonRect.top + 8}px`,
              right: `${window.innerWidth - buttonRect.right}px`,
              top: 'auto',
              left: 'auto'
            });
          } else {
            // Position below button (default) - use viewport coordinates for fixed positioning
            // Align dropdown right edge with button right edge
            const dropdownWidth = 180;
            let leftPos = buttonRect.right - dropdownWidth;
            // Ensure dropdown doesn't go off-screen to the left
            if (leftPos < 8) {
              leftPos = 8;
            }
            setDropdownPosition({
              top: `${buttonRect.bottom + 8}px`,
              left: `${leftPos}px`,
              bottom: 'auto',
              right: 'auto'
            });
          }
        }
      };
      
      // Small delay to ensure button ref is set
      setTimeout(updatePosition, 0);
      
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showActionsDropdown]);

  const syndicates = [
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

  const filterOptions = ["All", "Technology", "AI/ML", "Robotics", "Healthcare", "Energy", "Finance"];

  const toggleActionsDropdown = (index, event) => {
    if (event) {
      event.stopPropagation();
    }
    if (showActionsDropdown === index) {
      setShowActionsDropdown(null);
      setDropdownPosition({});
    } else {
      setShowActionsDropdown(index);
      // Calculate position immediately
      setTimeout(() => {
        const button = actionButtonRefs.current[index];
        if (button) {
          const buttonRect = button.getBoundingClientRect();
          const dropdownHeight = 180;
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Position above button
            setDropdownPosition({
              bottom: `${window.innerHeight - buttonRect.top + 8}px`,
              right: `${window.innerWidth - buttonRect.right}px`,
              top: 'auto',
              left: 'auto'
            });
          } else {
            // Position below button (default) - use viewport coordinates for fixed positioning
            // Align dropdown right edge with button right edge
            const dropdownWidth = 180;
            let leftPos = buttonRect.right - dropdownWidth;
            // Ensure dropdown doesn't go off-screen to the left
            if (leftPos < 8) {
              leftPos = 8;
            }
            setDropdownPosition({
              top: `${buttonRect.bottom + 8}px`,
              left: `${leftPos}px`,
              bottom: 'auto',
              right: 'auto'
            });
          }
        }
      }, 0);
    }
  };

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
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                  {/* Search icon placeholder */}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => navigate("/investor-panel/notifications")}
                className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
              >
                <div className="w-6 h-6 text-white">
                  {/* Notification icon placeholder */}
                </div>
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
                <div className="w-4 h-4 text-[#0A2A2E]">
                  {/* Dropdown icon placeholder */}
                </div>
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
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 16.901V8.56771H10.5V16.901M15.5 15.2344V6.55679C15.5 6.2482 15.3575 5.9569 15.1139 5.76744L8.61394 0.711884C8.25283 0.431021 7.74717 0.43102 7.38606 0.711884L0.886059 5.76744C0.642473 5.9569 0.5 6.2482 0.5 6.55679V15.2344C0.5 15.6764 0.675595 16.1003 0.988155 16.4129C1.30072 16.7254 1.72464 16.901 2.16667 16.901H13.8333C14.2754 16.901 14.6993 16.7254 15.0118 16.4129C15.3244 16.1003 15.5 15.6764 15.5 15.2344Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button 
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors bg-[#FFFFFF1A] text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66602 9.99739C1.66602 6.06906 1.66602 4.1049 2.88602 2.88406C4.10768 1.66406 6.07101 1.66406 9.99935 1.66406C13.9277 1.66406 15.8918 1.66406 17.1118 2.88406C18.3327 4.10573 18.3327 6.06906 18.3327 9.99739C18.3327 13.9257 18.3327 15.8899 17.1118 17.1099C15.8927 18.3307 13.9277 18.3307 9.99935 18.3307C6.07101 18.3307 4.10685 18.3307 2.88602 17.1099C1.66602 15.8907 1.66602 13.9257 1.66602 9.99739Z" stroke="#00F0C3" stroke-width="1.2"/>
<path d="M5.83203 11.6615L7.74286 9.75062C7.89914 9.5944 8.11106 9.50664 8.33203 9.50664C8.553 9.50664 8.76492 9.5944 8.9212 9.75062L10.2429 11.0723C10.3991 11.2285 10.6111 11.3163 10.832 11.3163C11.053 11.3163 11.2649 11.2285 11.4212 11.0723L14.1654 8.32812M14.1654 8.32812V10.4115M14.1654 8.32812H12.082" stroke="#00F0C3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              Invest
              <div className="w-3 h-3 text-white">
                {/* Dropdown arrow placeholder */}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showInvestDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]" style={{border: "1px solid #000"}}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors"
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
                  style={{backgroundColor: "#00F0C3"}}
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
            <path d="M13.3327 4.9974C13.3327 3.42573 13.3327 2.64073 12.8443 2.1524C12.356 1.66406 11.571 1.66406 9.99935 1.66406C8.42768 1.66406 7.64268 1.66406 7.15435 2.1524C6.66602 2.64073 6.66602 3.42573 6.66602 4.9974M1.66602 11.6641C1.66602 8.52156 1.66602 6.9499 2.64268 5.97406C3.61935 4.99823 5.19018 4.9974 8.33268 4.9974H11.666C14.8085 4.9974 16.3802 4.9974 17.356 5.97406C18.3318 6.95073 18.3327 8.52156 18.3327 11.6641C18.3327 14.8066 18.3327 16.3782 17.356 17.3541C16.3793 18.3299 14.8085 18.3307 11.666 18.3307H8.33268C5.19018 18.3307 3.61852 18.3307 2.64268 17.3541C1.66685 16.3774 1.66602 14.8066 1.66602 11.6641Z" stroke="white" stroke-width="1.2"/>
            <path d="M9.9987 14.439C10.9195 14.439 11.6654 13.8173 11.6654 13.0506C11.6654 12.284 10.9195 11.6615 9.9987 11.6615C9.07786 11.6615 8.33203 11.0398 8.33203 10.2723C8.33203 9.50563 9.07786 8.88396 9.9987 8.88396M9.9987 14.439C9.07786 14.439 8.33203 13.8173 8.33203 13.0506M9.9987 14.439V14.9948M9.9987 8.88396V8.32812M9.9987 8.88396C10.9195 8.88396 11.6654 9.50563 11.6654 10.2723" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
            </svg>

            Your Portfolio
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.41561 0.44292C8.68719 -0.0922103 11.2849 0.50667 13.0836 1.98198C14.4339 3.135 15.3164 4.4968 15.7994 6.20269C15.8205 6.27557 15.8421 6.34929 15.8639 6.42437C16.2178 7.92744 16.0534 9.61603 15.4889 11.0562L15.3707 11.3413C15.3445 11.4019 15.3436 11.402 15.317 11.4634C14.7083 12.8423 13.6583 14.0408 12.3736 14.8286L12.3717 14.8296C12.3121 14.8677 12.2524 14.9056 12.191 14.9448C10.5051 15.9835 8.28359 16.2959 6.35311 15.8599C4.9682 15.511 3.73481 14.8376 2.70468 13.8501L2.70272 13.8482L2.53671 13.6968C1.51292 12.7275 0.884083 11.4689 0.500583 10.1148L0.436123 9.89213C0.0824129 8.38933 0.246743 6.70122 0.811123 5.26128L0.929293 4.97613L0.983003 4.85308C1.79487 3.01419 3.358 1.5629 5.22226 0.82281L5.22323 0.82378C5.54184 0.70369 5.86474 0.60159 6.19394 0.50835C6.26687 0.48721 6.34048 0.46471 6.41561 0.44292ZM11.9361 3.45171C9.55969 1.3939 5.98142 1.87353 3.81698 3.96148L3.81405 3.96441C2.58337 5.24112 2.12593 6.82827 2.14608 8.55323V8.55523C2.19267 10.1871 3.01553 11.53 4.12851 12.645L4.13144 12.647C5.20878 13.6591 6.74117 14.2201 8.21249 14.2075H8.21639C9.69829 14.1463 11.0814 13.6561 12.1832 12.6323C12.2372 12.5825 12.2916 12.5323 12.3473 12.481L12.3492 12.48C13.3783 11.4924 14.1209 10.0716 14.152 8.61483C14.1819 6.83426 13.7578 5.31018 12.4859 3.9898L12.485 3.98882L12.3111 3.81206C12.263 3.7625 12.2142 3.71274 12.1646 3.66167L12.1627 3.65972L11.9361 3.45171ZM9.98399 5.25933C10.2287 5.22405 10.4898 5.28133 10.7721 5.45073C10.9866 5.69416 11.0851 5.92357 11.0836 6.24566C11.0308 6.57271 10.8183 6.87671 10.5436 7.16753C10.4063 7.31282 10.2564 7.45254 10.109 7.58745C9.96269 7.72133 9.81689 7.85222 9.69199 7.97808C9.65059 8.01976 9.60959 8.06209 9.56699 8.10503C9.34859 8.32513 9.12949 8.54453 8.91069 8.76423C8.73019 8.94563 8.55039 9.12793 8.37069 9.31013C8.15289 9.53103 7.93362 9.75063 7.71444 9.97023C7.63136 10.0537 7.54895 10.1381 7.4664 10.2222C7.35129 10.3393 7.23439 10.4556 7.11776 10.5718L7.11679 10.5728C7.08392 10.6066 7.05101 10.6405 7.01718 10.6753C6.76731 10.9212 6.49917 11.0826 6.15976 11.0991C5.88728 11.0761 5.70677 10.9901 5.49374 10.812C5.29135 10.5688 5.20023 10.3419 5.21249 10.0318C5.32287 9.65403 5.48252 9.43453 5.76913 9.15193L5.77011 9.15093C5.81006 9.11033 5.84907 9.06873 5.89022 9.02693L5.8912 9.02793C6.02318 8.89423 6.15705 8.76123 6.29061 8.62843C6.38347 8.53523 6.47616 8.44153 6.56894 8.34823C6.76321 8.15313 6.95861 7.95832 7.1539 7.76421C7.40382 7.51568 7.65226 7.2655 7.89999 7.01519C8.09102 6.82255 8.28289 6.63067 8.47519 6.43902L8.75059 6.16265C8.87809 6.03386 9.00699 5.90551 9.13629 5.77788L9.13729 5.77691C9.19229 5.72062 9.19279 5.71977 9.24769 5.66363C9.48879 5.42889 9.73439 5.29534 9.98399 5.25933ZM9.73499 9.29743C9.93829 9.21743 10.1851 9.20863 10.4771 9.24663C10.7444 9.37363 10.899 9.52923 11.026 9.79643C11.0689 10.1231 11.067 10.3866 10.9391 10.6714C10.8049 10.8116 10.6986 10.9036 10.5816 10.9634C10.4638 11.0236 10.3284 11.0554 10.1324 11.063C9.93689 11.0554 9.80189 11.0235 9.68419 10.9634C9.56739 10.9037 9.45969 10.8131 9.32579 10.6734C9.19719 10.388 9.19589 10.1236 9.23889 9.79643C9.36759 9.52653 9.53609 9.37573 9.73499 9.29743ZM6.50839 5.27984C6.77735 5.40709 6.93271 5.56237 7.06015 5.83062C7.10306 6.15723 7.10129 6.42076 6.97323 6.70562C6.83916 6.84565 6.73271 6.93785 6.61581 6.99761C6.49797 7.05779 6.36247 7.08866 6.16659 7.09624C5.97094 7.08861 5.83513 7.05781 5.71737 6.99761C5.60091 6.93802 5.49436 6.84683 5.36093 6.70757C5.23211 6.42207 5.23004 6.15785 5.27304 5.83062C5.40178 5.56051 5.57016 5.40897 5.76913 5.33062C5.9718 5.25093 6.21773 5.24226 6.50839 5.27984Z" fill="white"/>
            <path d="M3.81698 3.96148C5.98142 1.87353 9.55969 1.3939 11.9361 3.45171L12.1627 3.65972L12.1646 3.66167C12.2142 3.71274 12.263 3.7625 12.3111 3.81206L12.485 3.98882L12.4859 3.9898C13.7578 5.31018 14.1819 6.83426 14.152 8.61483C14.1209 10.0716 13.3783 11.4924 12.3492 12.48L12.3473 12.481C12.2916 12.5323 12.2372 12.5825 12.1832 12.6323C11.0814 13.6561 9.69829 14.1463 8.21639 14.2075H8.21249C6.74117 14.2201 5.20878 13.6591 4.13144 12.647L4.12851 12.645C3.01553 11.53 2.19267 10.1871 2.14608 8.55523V8.55323C2.12593 6.82827 2.58337 5.24112 3.81405 3.96441L3.81698 3.96148ZM3.81698 3.96148L3.88632 4.03374M6.41561 0.44292C8.68719 -0.0922103 11.2849 0.50667 13.0836 1.98198C14.4339 3.135 15.3164 4.4968 15.7994 6.20269C15.8205 6.27557 15.8421 6.34929 15.8639 6.42437C16.2178 7.92744 16.0534 9.61603 15.4889 11.0562L15.3707 11.3413C15.3445 11.4019 15.3436 11.402 15.317 11.4634C14.7083 12.8423 13.6583 14.0408 12.3736 14.8286L12.3717 14.8296C12.3121 14.8677 12.2524 14.9056 12.191 14.9448C10.5051 15.9835 8.28359 16.2959 6.35311 15.8599C4.9682 15.511 3.73481 14.8376 2.70468 13.8501L2.70272 13.8482L2.53671 13.6968C1.51292 12.7275 0.884083 11.4689 0.500583 10.1148L0.436123 9.89213C0.0824129 8.38933 0.246743 6.70122 0.811123 5.26128L0.929293 4.97613L0.983003 4.85308C1.79487 3.01419 3.358 1.5629 5.22226 0.82281L5.22323 0.82378C5.54184 0.70369 5.86474 0.60159 6.19394 0.50835C6.26687 0.48721 6.34048 0.46471 6.41561 0.44292ZM9.98399 5.25933C10.2287 5.22405 10.4898 5.28133 10.7721 5.45073C10.9866 5.69416 11.0851 5.92357 11.0836 6.24566C11.0308 6.57271 10.8183 6.87671 10.5436 7.16753C10.4063 7.31282 10.2564 7.45254 10.109 7.58745C9.96269 7.72133 9.81689 7.85222 9.69199 7.97808C9.65059 8.01976 9.60959 8.06209 9.56699 8.10503C9.34859 8.32513 9.12949 8.54453 8.91069 8.76423C8.73019 8.94563 8.55039 9.12793 8.37069 9.31013C8.15289 9.53103 7.93362 9.75063 7.71444 9.97023C7.63136 10.0537 7.54895 10.1381 7.4664 10.2222C7.35129 10.3393 7.23439 10.4556 7.11776 10.5718L7.11679 10.5728C7.08392 10.6066 7.05101 10.6405 7.01718 10.6753C6.76731 10.9212 6.49917 11.0826 6.15976 11.0991C5.88728 11.0761 5.70677 10.9901 5.49374 10.812C5.29135 10.5688 5.20023 10.3419 5.21249 10.0318C5.32287 9.65403 5.48252 9.43453 5.76913 9.15193L5.77011 9.15093C5.81006 9.11033 5.84907 9.06873 5.89022 9.02693L5.8912 9.02793C6.02318 8.89423 6.15705 8.76123 6.29061 8.62843C6.38347 8.53523 6.47616 8.44153 6.56894 8.34823C6.76321 8.15313 6.95861 7.95832 7.1539 7.76421C7.40382 7.51568 7.65226 7.2655 7.89999 7.01519C8.09102 6.82255 8.28289 6.63067 8.47519 6.43902L8.75059 6.16265C8.87809 6.03386 9.00699 5.90551 9.13629 5.77788L9.13729 5.77691C9.19229 5.72062 9.19279 5.71977 9.24769 5.66363C9.48879 5.42889 9.73439 5.29534 9.98399 5.25933ZM9.73499 9.29743C9.93829 9.21743 10.1851 9.20863 10.4771 9.24663C10.7444 9.37363 10.899 9.52923 11.026 9.79643C11.0689 10.1231 11.067 10.3866 10.9391 10.6714C10.8049 10.8116 10.6986 10.9036 10.5816 10.9634C10.4638 11.0236 10.3284 11.0554 10.1324 11.063C9.93689 11.0554 9.80189 11.0235 9.68419 10.9634C9.56739 10.9037 9.45969 10.8131 9.32579 10.6734C9.19719 10.388 9.19589 10.1236 9.23889 9.79643C9.36759 9.52653 9.53609 9.37573 9.73499 9.29743ZM6.50839 5.27984C6.77735 5.40709 6.93271 5.56237 7.06015 5.83062C7.10306 6.15723 7.10129 6.42076 6.97323 6.70562C6.83916 6.84565 6.73271 6.93785 6.61581 6.99761C6.49797 7.05779 6.36247 7.08866 6.16659 7.09624C5.97094 7.08861 5.83513 7.05781 5.71737 6.99761C5.60091 6.93802 5.49436 6.84683 5.36093 6.70757C5.23211 6.42207 5.23004 6.15785 5.27304 5.83062C5.40178 5.56051 5.57016 5.40897 5.76913 5.33062C5.9718 5.25093 6.21773 5.24226 6.50839 5.27984Z" stroke="#001D21" stroke-width="0.5"/>
            </svg>

            Taxes & Document
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            Messages
          </button>
          <button 
            onClick={() => navigate("/investor-panel/dashboard")}
            className="px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors text-gray-300 hover:text-white"
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
        {/* Header Section */}
        <div className="mb-6 bg-white rounded-lg p-6">
          <h1 className="text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
            Top <span className="text-[#9889FF]">Syndicates</span>
          </h1>
          <p className="text-base text-[#748A91] font-poppins-custom mb-6">
            Discover and invest in top-tier opportunities
          </p>

          {/* Search, Filter, and View Toggle */}
          <div className="flex justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="flex flex-row gap-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Companies, funds, leads."
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                    {/* Search icon placeholder */}
                  </div>
                </div>
                {/* Filter Dropdown */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium font-poppins-custom text-[#0A2A2E]"
                  >
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5087 1.6875H13.492C13.9644 1.6875 14.3682 1.6875 14.6912 1.73025C15.0333 1.776 15.3641 1.87875 15.6361 2.14875C15.9123 2.424 16.0221 2.76675 16.0703 3.123C16.1149 3.45075 16.1149 3.858 16.1149 4.323V4.905C16.1149 5.27175 16.1149 5.5875 16.0894 5.85225C16.0611 6.13725 16.0009 6.4035 15.8549 6.65925C15.7097 6.9135 15.5149 7.098 15.2897 7.263C15.0779 7.419 14.808 7.58025 14.4893 7.77L12.4054 9.012C11.9308 9.29475 11.7657 9.39675 11.6552 9.498C11.4024 9.7305 11.2572 9.98925 11.1892 10.3125C11.1601 10.4513 11.1566 10.6252 11.1566 11.1547V13.2037C11.1566 13.8795 11.1566 14.4533 11.0907 14.895C11.0213 15.3638 10.8591 15.8137 10.4341 16.095C10.0183 16.3702 9.56141 16.3447 9.11657 16.233C8.68803 16.1257 8.16033 15.9068 7.52708 15.645L7.46616 15.6195C7.16866 15.4965 6.90941 15.3892 6.70399 15.2767C6.48299 15.156 6.27757 15.006 6.12103 14.772C5.96166 14.535 5.89862 14.2815 5.86958 14.022C5.84408 13.7857 5.84408 13.5022 5.84408 13.1857V11.1547C5.84408 10.6252 5.84124 10.4513 5.81149 10.3125C5.74734 9.99311 5.58309 9.70607 5.34541 9.498C5.23491 9.39675 5.06916 9.29475 4.59528 9.012L2.51137 7.77C2.19262 7.58025 1.92274 7.419 1.71095 7.263C1.4857 7.098 1.29091 6.9135 1.1457 6.65925C0.999784 6.4035 0.939575 6.1365 0.91195 5.85225C0.885742 5.58825 0.885742 5.27175 0.885742 4.905V4.323C0.885742 3.858 0.885742 3.45075 0.930367 3.123C0.978534 2.76675 1.08833 2.424 1.36458 2.14875C1.63658 1.87875 1.96666 1.776 2.30949 1.73025C2.63249 1.6875 3.03624 1.6875 3.5087 1.6875ZM2.44266 2.847C2.20608 2.8785 2.13099 2.9295 2.09203 2.96925C2.05662 3.00375 2.01128 3.0645 1.98153 3.28275C1.94966 3.52125 1.94824 3.84675 1.94824 4.36125V4.87875C1.94824 5.27925 1.94824 5.53725 1.96808 5.73675C1.98649 5.922 2.01766 6.01125 2.05591 6.078C2.09487 6.14625 2.16003 6.2235 2.31658 6.339C2.48233 6.4605 2.70828 6.59625 3.05324 6.80175L5.11662 8.03175L5.17328 8.0655C5.56995 8.30175 5.83912 8.46225 6.0417 8.64825C6.45141 9.01422 6.73532 9.51339 6.8492 10.068C6.90657 10.3433 6.90657 10.653 6.90657 11.088V13.1572C6.90657 13.5112 6.90728 13.7288 6.9257 13.8923C6.94128 14.0408 6.96749 14.091 6.98662 14.1202C7.00787 14.1517 7.05037 14.2005 7.19133 14.2778C7.34149 14.3595 7.54903 14.4457 7.87628 14.5815C8.55699 14.8635 9.01528 15.0517 9.36166 15.1388C9.70095 15.2242 9.81287 15.18 9.87024 15.1417C9.91841 15.1095 9.99278 15.0442 10.0417 14.7195C10.0927 14.3767 10.0941 13.8923 10.0941 13.1565V11.088C10.0941 10.653 10.0941 10.3433 10.1522 10.068C10.2658 9.51349 10.5495 9.01434 10.9589 8.64825C11.1615 8.46225 11.4314 8.301 11.8267 8.0655L11.884 8.03175L13.9474 6.80175C14.2924 6.59625 14.5183 6.4605 14.6841 6.339C14.8406 6.2235 14.9058 6.14625 14.9447 6.078C14.983 6.01125 15.0142 5.922 15.0319 5.73675C15.0517 5.53725 15.0524 5.27925 15.0524 4.878V4.3605C15.0524 3.84675 15.051 3.5205 15.0191 3.28275C14.9894 3.0645 14.9433 3.00375 14.9093 2.96925C14.8697 2.93025 14.7946 2.8785 14.558 2.847C14.3101 2.81325 13.9736 2.8125 13.4587 2.8125H3.54199C3.02703 2.8125 2.69128 2.81325 2.44266 2.847Z" fill="#0A2A2E"/>
                    </svg>

                    Filter
                    <div className="w-3 h-3 text-[#0A2A2E]">
                      {/* Dropdown arrow placeholder */}
                    </div>
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
                <div className="w-5 h-5">
                  {/* List icon placeholder */}
                </div>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-[#00F0C3] text-[#001D21]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="w-5 h-5">
                  {/* Grid icon placeholder */}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg" style={{border: "0.5px solid #E2E2FB"}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#E2E2FB]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Syndicate Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Allocated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Raised
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Min. Investment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Track Record
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#748A91] font-poppins-custom uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white ">
                {syndicates.map((syndicate, index) => (
                  <tr key={index} className="hover:bg-gray-50 border border-[#E2E2FB]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">
                        {syndicate.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#748A91] font-poppins-custom">
                        {syndicate.sector}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.allocated}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.raised}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.target}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#0A2A2E] font-poppins-custom">
                        {syndicate.minInvestment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm  text-black font-poppins-custom">
                        {syndicate.trackRecord}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden min-w-[100px]">
                          <div className="h-full flex">
                            <div className="bg-[#22C55E] h-full" style={{width: `${syndicate.status}%`}}></div>
                            <div className="bg-[#CEC6FF] h-full" style={{width: `${100 - syndicate.status}%`}}></div>
                          </div>
                        </div>
                        <span className="text-sm text-[#0A2A2E] font-poppins-custom whitespace-nowrap">{syndicate.status}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center relative">
                      <div className="relative inline-block">
                        <button
                          ref={el => {
                            actionButtonRefs.current[index] = el;
                          }}
                          onClick={(e) => toggleActionsDropdown(index, e)}
                          className="p-2 text-[#0A2A2E] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" fill="#F4F6F5"/>
                            <rect x="0.25" y="0.25" width="25.5" height="25.5" rx="5.75" stroke="#E8EAED" strokeWidth="0.5"/>
                            <path d="M12.4163 13.0013C12.4163 13.3235 12.6775 13.5846 12.9997 13.5846C13.3218 13.5846 13.583 13.3235 13.583 13.0013C13.583 12.6791 13.3218 12.418 12.9997 12.418C12.6775 12.418 12.4163 12.6791 12.4163 13.0013Z" fill="#01373D" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.4163 17.0833C12.4163 17.4055 12.6775 17.6667 12.9997 17.6667C13.3218 17.6667 13.583 17.4055 13.583 17.0833C13.583 16.7612 13.3218 16.5 12.9997 16.5C12.6775 16.5 12.4163 16.7612 12.4163 17.0833Z" fill="#01373D" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.4163 8.91536C12.4163 9.23753 12.6775 9.4987 12.9997 9.4987C13.3218 9.4987 13.583 9.23753 13.583 8.91536C13.583 8.5932 13.3218 8.33203 12.9997 8.33203C12.6775 8.33203 12.4163 8.5932 12.4163 8.91536Z" fill="#01373D" stroke="#01373D" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        {/* Actions Dropdown Menu - Fixed positioning */}
                        {showActionsDropdown === index && (
                          <div 
                            ref={el => {
                              actionsDropdownRefs.current[index] = el;
                            }}
                            className="flex flex-col fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-[180px]"
                            style={{
                              top: dropdownPosition.top || 'auto',
                              bottom: dropdownPosition.bottom || 'auto',
                              right: dropdownPosition.right || 'auto',
                              left: dropdownPosition.left || 'auto'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-[#00F0C3] transition-colors"
                            >
                              Invest Now
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                            >
                              Request Invite
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                            >
                              Add To Wishlist
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                &lt;
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-[#00F0C3] rounded-lg font-poppins-custom">
                1
              </button>
              <button className="px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                2
              </button>
              <button className="px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                3
              </button>
              <button className="px-3 py-2 text-sm text-[#0A2A2E] font-poppins-custom hover:bg-gray-100 rounded-lg transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopSyndicates;

