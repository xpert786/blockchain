import React, { useState } from "react";
import { FreeIcon , PlusIcon,  } from "../../../components/Icons";
import { useNavigate } from "react-router-dom";

const FeeRecipientSetup = () => {
  const navigate = useNavigate();
  const [feeRecipients, setFeeRecipients] = useState([]);

  const handleAddFeeRecipients = () => {
    navigate("/manager-panel/settings/AddFeeRecipient");
  };

  const handleSave = () => {
    console.log("Fee recipient setup saved");
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full">
        <div className="flex items-center justify-center sm:justify-start">
          <FreeIcon />
        </div>
        <div>
          <h4 className="text-base sm:text-lg text-[#001D21]">Fee Recipient</h4>
          <p className="font-poppins-custom text-xs sm:text-[13px] text-[#748A91] mt-0.5">who receives carry and/or management fees</p>
        </div>
      </div>

      {/* Add Fee Recipients Section - White Card */}
      <div className="bg-white rounded-xl p-6 mb-8 w-full">
        <h3 className="text-lg  text-[#000000] mb-3 font-poppins-custom">Add Fee Recipients</h3>
        <p className="text-[#748A91] font-poppins-custom mb-4 text-[13px]">
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here
        </p>
        <button
          onClick={handleAddFeeRecipients}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium cursor-pointer"
        >
          <PlusIcon />
          <span>Add Fee Recipients</span>
        </button>
      </div>
    </div>
  );
};

export default FeeRecipientSetup;
