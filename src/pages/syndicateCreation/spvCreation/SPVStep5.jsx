import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InviteLPsModal from "./InviteLPsModal";

const SPVStep5 = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step6");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step4");
  };

  const handleSkip = () => {
    navigate("/syndicate-creation/spv-creation/step6");
  };

  const handleInviteLPs = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Invite LPs</h1>
          <p className="text-gray-600">
            Configure how your SPV will appear to investors and control access settings.
          </p>
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-[#01373D]"
        >
          Skip
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#F4F6F5]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={handleInviteLPs}
          className="bg-[#00F0C3] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <span>Invite LPs</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* Team Members Table */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4 py-3 px-4 text-sm font-medium text-gray-500 border-b border-gray-200 flex items-right text-center justify-between">
          <div className="text-left">Team member</div>
          <div>Email address</div>
          <div className="text-right">Access</div>
        </div>
        <div className="mt-2 bg-gray-50 rounded-lg p-4 flex items-left text-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-900 font-medium">John Doe</span>
          </div>
          <div className="text-gray-700">johndoe81@gmail.com</div>
          <div className=" font-medium">Active</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-[#01373D]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="flex items-center space-x-2 bg-[#00F0C3] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <span>Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* Invite LPs Modal */}
      <InviteLPsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default SPVStep5;
