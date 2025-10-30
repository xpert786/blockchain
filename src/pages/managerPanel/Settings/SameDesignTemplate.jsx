import React, { useState } from "react";
import { BuildingOfficeIcon, SaveIcon } from "../../../components/Icons";

const SameDesignTemplate = () => {
  const [option, setOption] = useState("option1");

  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const handleSave = () => {
    console.log("Template settings saved:", option);
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen py-10">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-3 mb-8 max-w-2xl w-full mx-auto">
        <BuildingOfficeIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Template Section Title</h2>
          <p className="text-gray-600 font-poppins-custom">
            Description of this settings section goes here. <span className="font-bold">Highlight important usage/purpose.</span>
          </p>
        </div>
      </div>

      {/* Option Setting - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 max-w-2xl w-full mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Template Question?</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="optionRadio"
              value="option1"
              checked={option === "option1"}
              onChange={handleOptionChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Option 1</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="optionRadio"
              value="option2"
              checked={option === "option2"}
              onChange={handleOptionChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Option 2</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end max-w-2xl w-full mx-auto">
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

export default SameDesignTemplate;
