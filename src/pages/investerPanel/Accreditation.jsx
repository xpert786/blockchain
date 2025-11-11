import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Accreditation = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Accreditation");
  const [formData, setFormData] = useState({
    investmentType: "individual",
    fullName: "",
    residence: "United States",
    accreditation: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    // Navigate to next step
    navigate("/investor-panel/investment-goals");
  };

  const handlePrevious = () => {
    navigate("/investor-panel/welcome");
  };

  const handleSidebarClick = (item) => {
    setActiveItem(item);
    // Navigate to the corresponding page
    if (item === "Accreditation") {
      navigate("/investor-panel/accreditation");
    } else if (item === "Investment Goals") {
      navigate("/investor-panel/investment-goals");
    } else if (item === "Past Experience") {
      navigate("/investor-panel/past-experience");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)] gap-6 lg:gap-0 px-4 sm:px-6 lg:px-0">
      {/* Left Sidebar */}
      <div className="w-full lg:w-64 bg-[#CEC6FF] rounded-xl p-4 sm:p-5 lg:p-6 mt-6 sm:mt-8 lg:mt-10 mx-auto lg:mx-10 h-fit">
        <div className="space-y-4">
          <div 
            className={`${activeItem === "Accreditation" ? "bg-[#FFFFFF]" : ""} rounded-lg px-4 py-3 cursor-pointer transition-colors text-[#001D21]`}
            onClick={() => handleSidebarClick("Accreditation")}
          >
            <span className="text-[#001D21] font-medium">Accreditation</span>
          </div>
          <div 
            className={`${activeItem === "Investment Goals" ? "bg-[#FFFFFF]" : ""} rounded-lg px-4 py-3 cursor-pointer transition-colors text-[#001D21]`}
            onClick={() => handleSidebarClick("Investment Goals")}
          >
            <span className="text-[#001D21] font-medium">Investment Goals</span>
          </div>
          <div 
            className={`${activeItem === "Past Experience" ? "bg-[#FFFFFF]" : ""} rounded-lg px-4 py-3 cursor-pointer transition-colors text-[#001D21]`}
            onClick={() => handleSidebarClick("Past Experience")}
          >
            <span className="text-[#001D21] font-medium">Past Experience</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl pt-6 sm:pt-8 px-4 sm:px-6 lg:px-10 mx-auto mb-10 lg:mb-10 w-full max-w-4xl">
        <div className="mx-auto">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accreditation</h1>
          
          {/* Instructional Text */}
          <p className="text-sm sm:text-base text-[#748A91] mb-8 font-poppins-custom text-center sm:text-left" >
            You must be an accredited investor per the SEC's standards to invest on Unlocksley{" "}
            <a href="#" className="text-[#9889FF] hover:underline">
              Learn More →
            </a>
          </p>

          {/* Form Sections */}
          <div className="space-y-8">
            {/* Investment Type */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom text-center sm:text-left">
                Will you be investing money as an Individual, a Trust, or a Firm or Fund?
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="investmentType"
                    value="individual"
                    checked={formData.investmentType === "individual"}
                    onChange={(e) => handleInputChange("investmentType", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#0A2A2E] font-poppins-custom">Individual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="investmentType"
                    value="trust"
                    checked={formData.investmentType === "trust"}
                    onChange={(e) => handleInputChange("investmentType", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#0A2A2E] font-poppins-custom">Trust</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="investmentType"
                    value="firm"
                    checked={formData.investmentType === "firm"}
                    onChange={(e) => handleInputChange("investmentType", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">Firm or Fund</span>
                </label>
              </div>
            </div>

            {/* Full Legal Name */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                What is your full legal name?
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full  rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent bg-[#F4F6F5]"
                placeholder="Enter your full legal name"
                style={{ border: "0.5px solid #0A2A2E" }}
              />
            </div>

            {/* Legal Place of Residence */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                Where is your legal place of residence?
              </label>
              <select
                value={formData.residence}
                onChange={(e) => handleInputChange("residence", e.target.value)}
                className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent bg-[#F4F6F5]"
                style={{ border: "0.5px solid #0A2A2E" }}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Accreditation */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                How are you accredited?
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accreditation"
                    value="5m"
                    checked={formData.accreditation === "5m"}
                    onChange={(e) => handleInputChange("accreditation", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">I have at least $5M in investment</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accreditation"
                    value="2.2m-5m"
                    checked={formData.accreditation === "2.2m-5m"}
                    onChange={(e) => handleInputChange("accreditation", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">I have between $2.2M and $5M in assets</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accreditation"
                    value="1m-2.2m"
                    checked={formData.accreditation === "1m-2.2m"}
                    onChange={(e) => handleInputChange("accreditation", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">I have between $1M and $2.2M in assets</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accreditation"
                    value="income"
                    checked={formData.accreditation === "income"}
                    onChange={(e) => handleInputChange("accreditation", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I have income of $200k (or $300k jointly with spouse) for the past 2 years and expect the same this year
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accreditation"
                    value="series"
                    checked={formData.accreditation === "series"}
                    onChange={(e) => handleInputChange("accreditation", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I am a Series 7, Series 65 or Series 82 holder and my license is active and in good standing
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accreditation"
                    value="not-accredited"
                    checked={formData.accreditation === "not-accredited"}
                    onChange={(e) => handleInputChange("accreditation", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">I'm not accredited yet</span>
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-12">
            <button
              onClick={handlePrevious}
              className="w-full sm:w-auto px-6 py-3 bg-[#F4F6F5] text-[black] rounded-lg hover:bg-gray-300 transition-colors font-medium font-poppins-custom"
              style={{ border: "1px solid #0A2A2E" }}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accreditation;

