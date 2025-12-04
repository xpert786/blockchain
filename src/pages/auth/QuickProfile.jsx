import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import logo from "/src/assets/img/logo.png";

import loginimg from "/src/assets/img/loginimg1.svg";
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";

const QuickProfile = () => {
  const [formData, setFormData] = useState({
    country: "",
    taxResidency: "",
    investorCategory: "Individual",
  });
  const [showComplianceAlert, setShowComplianceAlert] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Show compliance alert for restricted jurisdictions
    if (name === "country" && value) {
      const restrictedCountries = ["Iran", "North Korea", "Syria"];
      setShowComplianceAlert(restrictedCountries.includes(value));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      investorCategory: category,
    });
    setOpenDropdown(null);
  };

  const handleCountrySelect = (country) => {
    setFormData({
      ...formData,
      country: country,
    });
    setOpenDropdown(null);
    
    const restrictedCountries = ["Iran", "North Korea", "Syria"];
    setShowComplianceAlert(restrictedCountries.includes(country));
  };

  const handleTaxResidencySelect = (residency) => {
    setFormData({
      ...formData,
      taxResidency: residency,
    });
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showComplianceAlert) {
      alert("Cannot proceed: Your jurisdiction is not supported.");
      return;
    }
    console.log("Quick Profile form submitted:", formData);
  };

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "Singapore",
    "UAE",
    "India",
  ];

  const taxResidencies = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "Singapore",
    "UAE",
    "Other",
  ];

  const investorCategories = ["Individual","Family Office", "Corporate Vehicle", "Trust / Foundation"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[650px] bg-white rounded-3xl overflow-visible">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full overflow-hidden">
          {/* Purple background and content layout */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col justify-between relative overflow-hidden p-8">
            
            {/* Logo/Branding (Top) */}
            <img src={logo} alt="Login Logo" className="w-1/3 max-w-[150px] h-auto object-contain" />
            
            {/* Main Text Content (Middle - Takes up remaining space) */}
            <div className="flex flex-col items-center justify-center flex-grow ">
                <h1 className="text-[30px] font-semibold text-white font-poppins-custom">Invest Globally. <br />
                Compliantly. Confidently.</h1>
                <p className="text-white font-poppins-custom leading-tight mr-16 mt-2">Built for global accredited investors and <br />
                syndicate leads.</p>
            </div>
            

            {/* Image Content (Bottom - MOVED HERE) */}
            <div className="flex justify-start items-end w-full space-x-3 mt-7">
              <img src={loginimg} alt="Login Asset 1" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg2} alt="Login Asset 2" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg3} alt="Login Asset 3" className="w-1/3 max-w-[50px] h-auto object-contain" />
            </div>
            
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6 overflow-visible relative z-10">
          <div className="w-full max-w-md relative">
            <div className="mb-8">
              <h1 className="text-3xl text-[#001D21] font-medium mb-2">Quick Profile Setup</h1>
              <p className="text-[#6B8A8D] font-poppins-custom text-sm">Tell us about yourself.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-40">
              {/* Country of Residence */}
              <div className="relative">
                <label htmlFor="country" className="block text-md font-normal text-[#001D21] font-poppins-custom mb-2">
                  Country of Residence
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('country')}
                    className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none text-[#0A2A2E] font-poppins-custom cursor-pointer flex items-center justify-between"
                  >
                    <span>{formData.country || "Enter your Country"}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`}
                      fill="#0A2A2E" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === 'country' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      {countries.map((country, index) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full px-4 py-3 text-left font-poppins-custom transition-colors whitespace-normal ${
                            formData.country === country
                              ? 'bg-[#001D21] text-white font-medium'
                              : 'bg-white text-[#0A2A2E] hover:bg-[#F4F6F5]'
                          } ${index !== countries.length - 1 ? 'border-b border-[#E0E0E0]' : ''}`}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tax Residency */}
              <div className="relative">
                <label htmlFor="taxResidency" className="block text-md font-normal text-[#001D21] font-poppins-custom mb-2">
                  Tax Residency
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('taxResidency')}
                    className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none text-[#0A2A2E] font-poppins-custom cursor-pointer flex items-center justify-between"
                  >
                    <span>{formData.taxResidency || "Tax Residency"}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openDropdown === 'taxResidency' ? 'rotate-180' : ''}`}
                      fill="#0A2A2E" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === 'taxResidency' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      {taxResidencies.map((residency, index) => (
                        <button
                          key={residency}
                          type="button"
                          onClick={() => handleTaxResidencySelect(residency)}
                          className={`w-full px-4 py-3 text-left font-poppins-custom transition-colors whitespace-normal ${
                            formData.taxResidency === residency
                              ? 'bg-[#001D21] text-white font-medium'
                              : 'bg-white text-[#0A2A2E] hover:bg-[#F4F6F5]'
                          } ${index !== taxResidencies.length - 1 ? 'border-b border-[#E0E0E0]' : ''}`}
                        >
                          {residency}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Investor Category - Custom Dropdown */}
              <div className="relative">
                <label htmlFor="investorCategory" className="block text-md font-normal text-[#001D21] font-poppins-custom mb-2">
                  Investor Category
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('category')}
                    className="w-full px-4 py-3 border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none text-black font-poppins-custom appearance-none cursor-pointer flex items-center justify-between"
                  >
                    <span>{formData.investorCategory}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                      fill="black" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === 'category' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E0E0E0] rounded-lg shadow-xl z-50">
                      {investorCategories.map((category, index) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full px-4 py-3 text-left font-poppins-custom transition-colors whitespace-normal ${
                            formData.investorCategory === category
                              ? 'bg-[#001D21] text-white font-medium'
                              : 'bg-white text-[#0A2A2E] hover:bg-[#F4F6F5]'
                          } ${index !== investorCategories.length - 1 ? 'border-b border-[#E0E0E0]' : ''}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Conditional Compliance Alert */}
              {showComplianceAlert && (
                <div className="bg-[#F8D7DA] border border-[#F5C2C7] rounded-lg p-4">
                  <h3 className="text-[#842029] font-semibold text-sm mb-1 font-poppins-custom">
                    Conditional Compliance Alert
                  </h3>
                  <p className="text-[#842029] text-sm font-poppins-custom">
                    Due to local regulations, we cannot support investments from your jurisdiction.
                  </p>
                </div>
              )}

              {/* Continue Button */}
              <button
                type="submit"
                disabled={showComplianceAlert}
                className={`w-full py-3 px-4 rounded-lg font-semibold font-poppins-custom transition-colors duration-200 cursor-pointer ${
                  showComplianceAlert
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#00866B] text-white hover:bg-[#006B54]"
                }`}
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickProfile;
