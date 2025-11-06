import React from "react";
import { Outlet } from "react-router-dom";
import logoImage from "../../assets/img/logo.png";
import profileImage from "../../assets/img/profile.png";

const InvestorLayout = () => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F4F6F5'  }} >
      {/* Header */}
      <header className="bg-white rounded-xl">
        <div className="px-5 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-auto object-contain"
              />
            
            </div>
            {/* Right Side - Application Title and Information */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="flex flex-col items-end">
                <h1 className="text-2xl font-semibold mb-1">
                  <span className="text-[#9889FF]">Investor</span>{" "}
                  <span className="text-[#001D21]">Account Application</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-[#001D21] text-sm  font-poppins-custom">For Accredited Investors</span>
                  <a href="#" className="text-[#9889FF] text-sm hover:underline font-poppins-custom flex items-center gap-1 font-poppins-custom">
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

