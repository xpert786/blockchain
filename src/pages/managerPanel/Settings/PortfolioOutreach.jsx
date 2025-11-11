import React, { useState } from "react";
import { ProtoIcon, SavechangesIcon } from "../../../components/Icons";

const PortfolioOutreach = () => {
  const [contactPermission, setContactPermission] = useState("restrict");

  const handlePermissionChange = (e) => {
    setContactPermission(e.target.value);
  };

  const handleSave = () => {
    console.log("Portfolio outreach settings saved:", contactPermission);
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full">
        <div className="flex items-center justify-center sm:justify-start">
          <ProtoIcon />
        </div>
        <div>
          <h4 className="text-base sm:text-lg text-[#001D21]">Portfolio Company Outreach</h4>
          <p className="text-sm sm:text-base text-gray-600 font-poppins-custom">
            Grants The Platform Permission To Contact Portfolio Companies Directly For{" "}
            <span className="font-bold text-[#748A91]">Valuation, Tax Reporting, And Compliance Purposes.</span>
          </p>
        </div>
      </div>

      {/* Contact Permission Setting - White Card */}
      <div className="bg-white rounded-xl p-6 w-full">
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
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <SavechangesIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default PortfolioOutreach;
