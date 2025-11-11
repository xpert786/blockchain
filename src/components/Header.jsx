import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/img/logo.png";

const Header = () => {
  const [activeTab, setActiveTab] = useState("syndicate");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Optional: navigate based on tab selection in the future
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0A2A2E] px-4 py-3 backdrop-blur-md md:top-4 md:left-1/2 md:right-auto md:w-[94%] md:max-w-6xl md:-translate-x-1/2 md:rounded-xl md:bg-[#0A2A2E]/90">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <img
              src={logoImage}
              alt="Unlocksley Logo"
              className="h-12 w-12 object-contain"
            />
            <span className="hidden sm:inline text-lg font-semibold text-white">
              Unlocksley
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex justify-start rounded-lg border border-white/30 bg-[#0A2A2E] p-1">
              <button
                onClick={() => handleTabClick("syndicate")}
                className={`px-4 py-1 font-medium rounded-md transition ${
                  activeTab === "syndicate" ? "bg-white text-black" : "text-white"
                }`}
              >
                Syndicate
              </button>
              <button
                onClick={() => handleTabClick("invester")}
                className={`px-4 py-1 font-medium rounded-md transition ${
                  activeTab === "invester" ? "bg-white text-black" : "text-white"
                }`}
              >
                Invester
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-white px-4 py-1 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Log In
          </Link>
          <Link
            to="/demo"
            className="rounded-lg bg-[#F2E0C9] px-4 py-1 text-sm font-medium text-black transition hover:bg-[#d9c39f]"
          >
            Request a Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center justify-center rounded-lg border border-white/40 p-2 text-white md:hidden"
          aria-label="Open navigation menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-64 max-w-full transform bg-[#0A2A2E] transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 text-white"
            aria-label="Close navigation menu"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 px-4 py-2">
          <div className="flex flex-col gap-2 rounded-lg border border-white/20 bg-[#0A2A2E] p-2">
            <button
              onClick={() => handleTabClick("syndicate")}
              className={`rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                activeTab === "syndicate" ? "bg-white text-black" : "text-white"
              }`}
            >
              Syndicate
            </button>
            <button
              onClick={() => handleTabClick("invester")}
              className={`rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                activeTab === "invester" ? "bg-white text-black" : "text-white"
              }`}
            >
              Invester
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white"
            >
              Log In
            </Link>
            <Link
              to="/demo"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg bg-[#F2E0C9] px-4 py-2 text-sm font-medium text-black"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Close menu overlay"
        />
      )}
    </header>
  );
};

export default Header;

