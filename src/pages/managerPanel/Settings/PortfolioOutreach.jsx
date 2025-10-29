import React, { useState } from "react";
import { BuildingOfficeIcon, SaveIcon } from "../../../components/Icons";

const PortfolioOutreach = () => {
  const [contactPermission, setContactPermission] = useState("restrict");

  const handlePermissionChange = (e) => {
    setContactPermission(e.target.value);
  };

  const handleSave = () => {
    console.log("Portfolio outreach settings saved:", contactPermission);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <BuildingOfficeIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Portfolio Company Outreach</h2>
          <p className="text-gray-600 font-poppins-custom">
            Grants The Platform Permission To Contact Portfolio Companies Directly For{" "}
            <span className="font-bold">Valuation, Tax Reporting, And Compliance Purposes.</span>
          </p>
        </div>
      </div>

      {/* Contact Permission Setting */}
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Allow Platform Contact?</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="contactPermission"
              value="restrict"
              checked={contactPermission === "restrict"}
              onChange={handlePermissionChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Restrict</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="contactPermission"
              value="allow"
              checked={contactPermission === "allow"}
              onChange={handlePermissionChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Allow</label>
          </div>
        </div>
      </div>

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

export default PortfolioOutreach;
