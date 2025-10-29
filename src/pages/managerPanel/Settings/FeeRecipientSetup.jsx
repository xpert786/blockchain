import React, { useState } from "react";
import { CurrencyDollarIcon, PlusIcon, SaveIcon } from "../../../components/Icons";

const FeeRecipientSetup = () => {
  const [feeRecipients, setFeeRecipients] = useState([]);

  const handleAddFeeRecipients = () => {
    console.log("Add fee recipients clicked");
    // This would typically open a modal or navigate to a form
  };

  const handleSave = () => {
    console.log("Fee recipient setup saved");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <CurrencyDollarIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Fee Recipient Setup</h2>
        </div>
      </div>

      {/* Fee Recipient Overview */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-poppins-custom">Fee Recipient</h3>
            <p className="text-sm text-gray-600 font-poppins-custom">who receives carry and/or management fees</p>
          </div>
        </div>
      </div>

      {/* Add Fee Recipients Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Add Fee Recipients</h3>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-600 font-poppins-custom mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <button
            onClick={handleAddFeeRecipients}
            className="flex items-center space-x-2 px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
          >
            <PlusIcon />
            <span>Add Fee Recipients</span>
          </button>
        </div>
      </div>

      {/* Fee Recipients List */}
      {feeRecipients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 font-poppins-custom">No Fee Recipients Added</h3>
          <p className="text-gray-500 font-poppins-custom">Add fee recipients to get started with fee management.</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <SaveIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default FeeRecipientSetup;
