import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PastExperience = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Past Experience");
  const [formData, setFormData] = useState({
    linkedinProfile: "",
    ventureExperience: [],
    techStartupExperience: [],
    hearAboutUnlocksley: ["other"],
    otherSource: "",
    agreeToTerms: false,
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

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
    // Navigate to thank you page
    navigate("/investor-panel/thank-you");
  };

  const handlePrevious = () => {
    navigate("/investor-panel/investment-goals");
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
          <h1 className="text-3xl font-bold text-[#0A2A2E] mb-2">Past Experience</h1>
          
          {/* Subtitle */}
          <p className="text-sm text-[#748A91] mb-8 font-poppins-custom">
            Your goals and past experience can help unlock access to investment opportunities
          </p>

          {/* Form Sections */}
          <div className="space-y-8">
            {/* LinkedIn Profile */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                LinkedIn Profile
              </label>
              <p className="text-sm text-[#748A91] mb-4 font-poppins-custom">
                Providing a LinkedIn profile helps us determine your eligibility. If you don't have one, leave this field blank.
              </p>
              <input
                type="text"
                value={formData.linkedinProfile}
                onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent"
                placeholder="Enter your LinkedIn profile URL"
              />
            </div>

            {/* Venture Experience */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                What is your experience investing in venture-backed tech startups or venture capital funds?
              </label>
              <p className="text-sm text-[#748A91] mb-4 font-poppins-custom">
                Choose all that apply
              </p>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ventureExperience.includes("spv")}
                    onChange={() => handleCheckboxChange("ventureExperience", "spv")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I invested in a startup directly or through a single-purpose vehicle (SPV)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ventureExperience.includes("venture-fund")}
                    onChange={() => handleCheckboxChange("ventureExperience", "venture-fund")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I invested in startups indirectly through a venture fund
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ventureExperience.includes("vc-firm")}
                    onChange={() => handleCheckboxChange("ventureExperience", "vc-firm")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I work or worked at a venture capital or investment firm
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ventureExperience.includes("family-office")}
                    onChange={() => handleCheckboxChange("ventureExperience", "family-office")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I represent or represented a family office or Registered Investment Advisor (RIA)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ventureExperience.includes("none")}
                    onChange={() => handleCheckboxChange("ventureExperience", "none")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    None of the above
                  </span>
                </label>
              </div>
            </div>

            {/* Tech Startup Experience */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                What is your experience working with tech startups?
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.techStartupExperience.includes("worked-at-startup")}
                    onChange={() => handleCheckboxChange("techStartupExperience", "worked-at-startup")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I work or worked at a tech startup
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.techStartupExperience.includes("advised-startup")}
                    onChange={() => handleCheckboxChange("techStartupExperience", "advised-startup")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I advise or advised a tech startup
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.techStartupExperience.includes("founder")}
                    onChange={() => handleCheckboxChange("techStartupExperience", "founder")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    I am or was a tech startup founder
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.techStartupExperience.includes("none")}
                    onChange={() => handleCheckboxChange("techStartupExperience", "none")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    None of the above
                  </span>
                </label>
              </div>
            </div>

            {/* How did you hear about Unlocksley */}
            <div>
              <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                How did you hear about Unlocksley?
              </label>
              <p className="text-sm text-[#748A91] mb-4 font-poppins-custom">
                Choose all that apply
              </p>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearAboutUnlocksley.includes("google")}
                    onChange={() => handleCheckboxChange("hearAboutUnlocksley", "google")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Google search
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearAboutUnlocksley.includes("newsletter")}
                    onChange={() => handleCheckboxChange("hearAboutUnlocksley", "newsletter")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Newsletter/Media Site (TechCrunch, etc.)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearAboutUnlocksley.includes("twitter")}
                    onChange={() => handleCheckboxChange("hearAboutUnlocksley", "twitter")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    X.com (Twitter)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearAboutUnlocksley.includes("friend")}
                    onChange={() => handleCheckboxChange("hearAboutUnlocksley", "friend")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Friend or Connection
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearAboutUnlocksley.includes("syndicate-lead")}
                    onChange={() => handleCheckboxChange("hearAboutUnlocksley", "syndicate-lead")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Unlocksley Syndicate Lead or Fund Manager
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hearAboutUnlocksley.includes("other")}
                    onChange={() => handleCheckboxChange("hearAboutUnlocksley", "other")}
                    className="w-4 h-4 accent-black border-gray-300 rounded"
                  />
                  <span className="ml-3 text-[#748A91] font-poppins-custom">
                    Other (please specify)
                  </span>
                </label>
                {formData.hearAboutUnlocksley.includes("other") && (
                  <div className="ml-7 mt-2">
                    <p className="text-[#262626] font-poppins-custom mb-2">  Other (please specify)</p>
                    <input
                      type="text"
                      value={formData.otherSource}
                      onChange={(e) => handleInputChange("otherSource", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent bg-[#F4F6F5]"
                      placeholder="Please specify"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer Section */}
            <div>
              <h3 className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                Please carefully review the information below before submitting your application:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-[#0A2A2E] font-poppins-custom">
                <li className="ml-4 ">
                  I understand that most investments in startups result in a complete loss.
                </li>
                <li className="ml-4">
                  I understand that Unlocksley does not verify information on the site, and I am responsible for my own diligence.
                </li>
                <li className="ml-4">
                  I promise to hold Unlocksley harmless against any damage that may happen to myself as a result of my use of Unlocksley.
                </li>
                <li className="ml-4">
                  If I invest, I will comply with securities laws and consult my own attorney and professional advisors where I need advice.
                </li>
                <li className="ml-4">
                  I understand that I will be permanently banned from Unlocksley and that I may face legal consequences if I falsely represent my accreditation status.
                </li>
              </ol>
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className="w-4 h-4 accent-black border-gray-300 rounded"
                />
                <span className="ml-3 text-[#0A2A2E] font-poppins-custom">
                  I agree to the terms and conditions, as well as the terms above.
                </span>
              </label>
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
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastExperience;

