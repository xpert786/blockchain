import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InvestmentGoals = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Investment Goals");
  const [formData, setFormData] = useState({
    investmentStrategies: [],
    allocationAmount: "up-to-20k",
    netWorthPercentage: "up-to-5",
    reasons: [],
    usageDescription: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (name, value) => {
    const currentValues = formData[name];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    handleInputChange(name, updatedValues);
  };

  const handleNext = () => {
    // Navigate to next step
    navigate("/investor-panel/past-experience");
  };

  const handlePrevious = () => {
    navigate("/investor-panel/accreditation");
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
    <div className="flex min-h-[calc(100vh-200px)]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#CEC6FF] rounded-xl p-4 m-10 h-fit">
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
      <div className="flex-1 bg-white rounded-xl p-6 m-10">
        <div className=" px-10 mx-auto">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#0A2A2E] mb-2">Investment Goals</h1>
          
          {/* Subtitle */}
          <p className="text-sm text-[#748A91] mb-8 font-poppins-custom">
            Tell us more about why you want to invest on Unlocksley
          </p>

          {/* Form Sections */}
          <div className="space-y-8">
            {/* Investment Strategies */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                Which of the following investment strategies (on products) best match your preferences?
              </label>
              <p className="text-sm text-[#748A91] mb-4 font-poppins-custom">
                Tell us more about why you want to invest on Unlocksley
              </p>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.investmentStrategies.includes("syndicates")}
                    onChange={() => handleCheckboxChange("investmentStrategies", "syndicates")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Picking companies to invest in (Unlocksley syndicates)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.investmentStrategies.includes("access-fund")}
                    onChange={() => handleCheckboxChange("investmentStrategies", "access-fund")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Investing in funds that broadly index venture, such as Unlocksley access fund (Unlocksley Managed Funds)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.investmentStrategies.includes("rolling-funds")}
                    onChange={() => handleCheckboxChange("investmentStrategies", "rolling-funds")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Investing behind fund managers who pick companies to invest in (Unlocksley Rolling or Venture Funds)
                  </span>
                </label>
              </div>
            </div>

            {/* Allocation Amount */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                How much are you hoping to allocate (in USD) to startups using Unlocksley over the next 12 months?
              </label>
              <p className="text-sm text-[#748A91] mb-4 font-poppins-custom">
                This will help us match you with the products that best fit your goals
              </p>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allocationAmount"
                    value="up-to-20k"
                    checked={formData.allocationAmount === "up-to-20k"}
                    onChange={(e) => handleInputChange("allocationAmount", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to $20,000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allocationAmount"
                    value="up-to-50k"
                    checked={formData.allocationAmount === "up-to-50k"}
                    onChange={(e) => handleInputChange("allocationAmount", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to $50,000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allocationAmount"
                    value="up-to-100k"
                    checked={formData.allocationAmount === "up-to-100k"}
                    onChange={(e) => handleInputChange("allocationAmount", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to $100,000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allocationAmount"
                    value="up-to-250k"
                    checked={formData.allocationAmount === "up-to-250k"}
                    onChange={(e) => handleInputChange("allocationAmount", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to $250,000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allocationAmount"
                    value="up-to-500k"
                    checked={formData.allocationAmount === "up-to-500k"}
                    onChange={(e) => handleInputChange("allocationAmount", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to $500,000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allocationAmount"
                    value="more-than-500k"
                    checked={formData.allocationAmount === "more-than-500k"}
                    onChange={(e) => handleInputChange("allocationAmount", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">More than $500,000</span>
                </label>
              </div>
            </div>

            {/* Net Worth Percentage */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                What percentage of your net worth do you want to allocate to investing in startups?
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="netWorthPercentage"
                    value="up-to-5"
                    checked={formData.netWorthPercentage === "up-to-5"}
                    onChange={(e) => handleInputChange("netWorthPercentage", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to 5%</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="netWorthPercentage"
                    value="up-to-10"
                    checked={formData.netWorthPercentage === "up-to-10"}
                    onChange={(e) => handleInputChange("netWorthPercentage", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to 10%</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="netWorthPercentage"
                    value="up-to-15"
                    checked={formData.netWorthPercentage === "up-to-15"}
                    onChange={(e) => handleInputChange("netWorthPercentage", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">Up to 15%</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="netWorthPercentage"
                    value="more-than-15"
                    checked={formData.netWorthPercentage === "more-than-15"}
                    onChange={(e) => handleInputChange("netWorthPercentage", e.target.value)}
                    className="w-4 h-4 accent-black border-gray-300"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">More than 15%</span>
                </label>
              </div>
            </div>

            {/* Reasons for Choosing Unlocksley */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                What are your main reasons for choosing Unlocksley?
              </label>
              <p className="text-sm text-[#748A91] mb-4 font-poppins-custom">
                Choose all that apply
              </p>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.reasons.includes("financial-returns")}
                    onChange={() => handleCheckboxChange("reasons", "financial-returns")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Generating financial returns for your portfolio
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.reasons.includes("networking")}
                    onChange={() => handleCheckboxChange("reasons", "networking")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Meeting new people to expand your network
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.reasons.includes("dealflow")}
                    onChange={() => handleCheckboxChange("reasons", "dealflow")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Accessing dealflow you can't get anywhere else
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.reasons.includes("learning")}
                    onChange={() => handleCheckboxChange("reasons", "learning")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Learning more about tech and startups
                  </span>
                </label>
              </div>
            </div>

            {/* Usage Description */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                How are you hoping to use Unlocksley?
              </label>
              <textarea
                value={formData.usageDescription}
                onChange={(e) => handleInputChange("usageDescription", e.target.value)}
                className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent resize-none"
                rows="6"
                style={{ border: "0.5px solid #0A2A2E" }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-[#F4F6F5] text-[black] rounded-lg hover:bg-gray-300 transition-colors font-medium font-poppins-custom"
              style={{ border: "1px solid #0A2A2E" }}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentGoals;

