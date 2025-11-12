import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {
  HomeIcon,
  InvitesIcon,
  PortfolioIcon,
  TaxesIcon,
  MessagesIcon,
  SettingsIcon,
  ShareIcon,
  SendIcon,
  AlertsIcon
} from "./icon.jsx";

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const conversationsData = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    snippet: "The quarterly filing documents are ready for review.",
    status: "Online",
    lastActive: "2 hours ago"
  },
  {
    id: "investment-team",
    name: "Investment Team",
    snippet: "Your KYC documents have been approved.",
    status: "Offline",
    lastActive: "1 day ago"
  },
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    snippet: "New opportunity in renewable energy sector",
    status: "Offline",
    lastActive: "2 days ago"
  }
];

const messagesData = [
  {
    id: 1,
    sender: "Sarah Chen",
    time: "10:30 AM",
    content:
      "Hi John, I wanted to update you on the TechCorp Series C investment. The due diligence is complete and we're ready to move forward."
  },
  {
    id: 2,
    sender: "You",
    time: "10:45 AM",
    content: "That's great news! I've reviewed the materials and I'm ready to proceed with my $50k commitment."
  },
  {
    id: 3,
    sender: "Sarah Chen",
    time: "11:00 AM",
    content:
      "Perfect! I'll send over the final documents for signature. The closing is scheduled for next Friday."
  },
  {
    id: 4,
    sender: "Sarah Chen",
    time: "2:15 PM",
    content: "The TechCorp Series C documents are ready for review. Please check your documents section."
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState("messages");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(conversationsData[0]);
  const [messageDraft, setMessageDraft] = useState("");
  const [showMessageView, setShowMessageView] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/investor-panel/invest")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/portfolio")) {
      setActiveNav("portfolio");
    } else if (location.pathname.includes("/investor-panel/top-syndicates")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/wishlist")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/invites")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/tax-documents")) {
      setActiveNav("taxes");
    } else if (location.pathname.includes("/investor-panel/settings")) {
      setActiveNav("settings");
    } else {
      setActiveNav("messages");
    }
  }, [location.pathname]);

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

  const selectedMessages = messagesData;

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setShowMessageView(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
      {/* Top Header */}
      <header className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between w-full md:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
                aria-label="Open primary navigation"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <img src={logoImage} alt="Unlocksley Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/investor-panel/notifications")}
                className="relative bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
                aria-label="View notifications"
              >
                <AlertsIcon />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                  <span className="text-[#01373D] text-xs font-bold">2</span>
                </div>
              </button>
              <div className="flex items-center gap-1">
                <img src={profileImage} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
                <button
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#01373D] text-[#01373D]"
                  aria-label="Open profile menu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center w-full gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src={logoImage} alt="Unlocksley Logo" className="h-12 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  placeholder="Search SPVs, investors, documents..."
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => navigate("/investor-panel/notifications")}
                    className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
                    aria-label="View notifications"
                  >
                    <AlertsIcon />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                      <span className="text-[#01373D] text-xs font-bold">2</span>
                    </div>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <img src={profileImage} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                  <button
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
                    aria-label="Open profile menu"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search SPVs, investors, documents..."
                className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Dark Teal) */}
      <nav className="hidden lg:block bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full overflow-x-auto py-2">
          <button
            onClick={() => {
              navigate("/investor-panel/dashboard");
              setActiveNav("overview");
            }}
            className={navButtonClasses(activeNav === "overview")}
          >
            <HomeIcon />
            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className={navButtonClasses(activeNav === "invest")}
            >
              <InvitesIcon />
              Invest
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showInvestDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]" style={{ border: "1px solid #000" }}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors"
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
            className={navButtonClasses(activeNav === "portfolio")}
          >
            <PortfolioIcon />
            Your Portfolio
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/tax-documents");
              setActiveNav("taxes");
            }}
            className={navButtonClasses(activeNav === "taxes")}
          >
            <TaxesIcon />
            Taxes & Document
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/messages");
              setActiveNav("messages");
            }}
            className={navButtonClasses(activeNav === "messages")}
          >
            <MessagesIcon />
            Messages
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/settings");
              setActiveNav("settings");
            }}
            className={navButtonClasses(activeNav === "settings")}
          >
            <SettingsIcon />
            Investor Settings
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white transition-transform duration-300 ease-in-out shadow-lg lg:hidden ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-[#01373D]">Navigation</h4>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
            aria-label="Close navigation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <button
            onClick={() => {
              navigate("/investor-panel/dashboard");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg border transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Overview
          </button>
          <div className="space-y-2 rounded-lg border border-[#E2E2FB] p-4">
            <p className="text-sm font-semibold text-[#01373D] font-poppins-custom">Invest</p>
            <button
              onClick={() => {
                navigate("/investor-panel/invest");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Discover
            </button>
            <button
              onClick={() => {
                navigate("/investor-panel/invites");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Invites
            </button>
            <button
              onClick={() => {
                navigate("/investor-panel/top-syndicates");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Top Syndicates
            </button>
            <button
              onClick={() => {
                navigate("/investor-panel/wishlist");
                setIsMobileNavOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5]"
            >
              Wishlist
            </button>
          </div>
          <button
            onClick={() => {
              navigate("/investor-panel/portfolio");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Your Portfolio
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/tax-documents");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Taxes & Document
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/messages");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
            style={{ backgroundColor: "#00F0C3" }}
          >
            Messages
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/settings");
              setIsMobileNavOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors font-poppins-custom text-[#001D21] hover:bg-[#F4F6F5]"
          >
            Investor Settings
          </button>
        </div>
      </div>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <main className="w-full px-4 sm:px-6 py-8">
        <div className="mb-6 sm:mb-8 mt-5">
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0A2A2E] font-poppins-custom">Messages</h1>
          <p className="text-sm text-[#748A91] font-poppins-custom">
            Communicate with syndicate leads and support team
          </p>
        </div>
     
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Conversations List - Hidden on mobile when message view is shown */}
          <aside className={`bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 w-full lg:w-1/3 ${showMessageView ? "hidden lg:block" : "block"}`}>
            <div className="mb-4">
              <p className="text-md font-medium text-[#001D21] font-poppins-custom">
                Conversations
              </p>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="space-y-3">
              {conversationsData.map((conversation) => {
                const isActive = selectedConversation.id === conversation.id;
                const initials = conversation.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`w-full text-left border rounded-2xl px-4 py-3 transition-colors ${
                      isActive ? "border-[#00F0C3] bg-[#F4FFFB]" : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#E5F1F0] flex items-center justify-center text-sm font-medium text-[#0A2A2E]">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom truncate">{conversation.name}</p>
                          <span className="text-xs text-[#748A91] font-poppins-custom flex-shrink-0 whitespace-nowrap">{conversation.lastActive}</span>
                        </div>
                        <p className="text-xs text-[#748A91] font-poppins-custom mt-1 truncate">{conversation.snippet}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Message View - Hidden on mobile when conversations list is shown */}
          <section className={`bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 flex-1 flex flex-col min-h-[70vh] ${showMessageView ? "flex" : "hidden lg:flex"}`}>
            {/* Mobile Back Button */}
            <button
              onClick={() => setShowMessageView(false)}
              className="lg:hidden flex items-center gap-2 mb-4 text-sm text-[#0A2A2E] font-poppins-custom hover:text-[#01373D]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Conversations
            </button>
            <header className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-medium text-[#0A2A2E] font-poppins-custom truncate">{selectedConversation.name}</h2>
                <p className="text-xs text-[#748A91] font-poppins-custom truncate">
                  Syndicate Lead · {selectedConversation.status}
                </p>
              </div>
              <div className="text-xs text-[#748A91] font-poppins-custom hidden sm:block flex-shrink-0 whitespace-nowrap">Last active {selectedConversation.lastActive}</div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedMessages.map((message) => {
                const isOwn = message.sender === "You";
                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-lg rounded-2xl px-4 py-3 text-sm font-poppins-custom shadow-sm break-words ${
                        isOwn ? "bg-[#D7F8F0] text-[#0A2A2E]" : "bg-[#F4F6F5] text-[#0A2A2E]"
                      }`}
                    >
                      <p className="mb-2 break-words overflow-wrap-anywhere">{message.content}</p>
                      <span className="text-xs text-[#748A91] whitespace-nowrap">{message.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <textarea
                    rows={2}
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    placeholder="Write your message here..."
                    className="w-full bg-[#F4F6F5] border border-gray-300 rounded-2xl pl-12 pr-4 flex-1 align-middle text-sm font-poppins-custom focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <ShareIcon />
                  </div>
                </div>
                <button
                  type="button"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Messages;

