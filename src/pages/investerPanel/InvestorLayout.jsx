import React from "react";
import { Outlet } from "react-router-dom";
import logoImage from "../../assets/img/logo.png";
import profileImage from "../../assets/img/profile.png";

const InvestorLayout = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6" style={{ backgroundColor: '#F4F6F5'  }} >
      {/* Header */}
      <header className="bg-white rounded-xl">
        <div className="px-5 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            {/* Right Side - Application Title and Information */}
            <div className="flex items-center justify-center md:justify-end flex-1">
              <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1">
                <h1 className="text-xl sm:text-2xl font-semibold">
                  <span className="text-[#9889FF]">Investor</span>{" "}
                  <span className="text-[#001D21]">Account Application</span>
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[#001D21] text-sm font-poppins-custom">For Accredited Investors</span>
                  <a href="#" className="text-[#9889FF] text-sm hover:underline font-poppins-custom flex items-center justify-center gap-1">
                    Learn More <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default InvestorLayout;

