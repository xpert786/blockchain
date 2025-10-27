import React from "react";
import { useNavigate } from "react-router-dom";
import unlockLogo from "../../assets/img/unlocklogo.png";

const SyndicateSuccess = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/");
  };

  const handleCreateDeal = () => {
    navigate("/syndicate-creation/spv-creation/step1");
  };

  const handleEditProfile = () => {
    // Navigate to edit profile
    console.log("Edit profile clicked");
  };

  return (
    <div className="min-h-screen px-8 pt-4" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Fixed Header */}
      <header className="fixed top-4 left-8 right-8 bg-white z-50 shadow-sm rounded-lg">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-3">
              <img
                src={unlockLogo}
                alt="UNLOCKSLEY Logo"
                className="w-25 h-15 object-contain"
              />
            </div>

            {/* Center - Main title */}
            <div className="text-center">
              <h1 className="text-2xl ">
                <span className="text-[#9889FF]">Syndicated</span>{" "}
                <span className="text-[#001D21]">Creation Flow</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-28">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Your Syndicate Was Created Successfully</span>
          </div>
        </div>

        {/* Syndicate Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Top Section - Syndicate Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Syndicate Icon */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              
              {/* Syndicate Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">John Syndicate</h2>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">https://unlocksley.john-syndicate</span>
                  <svg className="w-4 h-4 ml-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Edit Profile Button */}
            <button
              onClick={handleEditProfile}
              className="flex items-center space-x-2 bg-gray-100 hover:scale-102 text-gray-700 px-4 py-2 rounded-lg border border-[#01373D] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-[16px] font-semibold">Edit Profile</span>
            </button>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Bottom Section - Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleGoToDashboard}
              className="bg-[#00F0C3] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Go To Dashboard
            </button>
            <button
              onClick={handleCreateDeal}
              className="bg-[#CEC6FF] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create a Deal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyndicateSuccess;