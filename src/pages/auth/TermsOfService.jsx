import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/img/bg-images.png";

const TermsOfService = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    acknowledge: false,
    termsAndPrivacy: false,
    cookies: false,
  });
  const [error, setError] = useState("");

  const handleCheckboxChange = (name) => {
    setAgreements({
      ...agreements,
      [name]: !agreements[name],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreements.acknowledge && agreements.termsAndPrivacy && agreements.cookies) {
      console.log("All agreements accepted:", agreements);
      // Navigate to login page after accepting terms
      navigate("/quick-profile-set");
    } else {
      setError("Please accept all terms and conditions to continue.");
    }
  };

  const documents = [
    "General Terms of Services",
    "Investing Banking Terms",
    "E-Sign Consent",
    "InfraFi Deposit Placement and Custodial Agreement",
    "Cookie Consent Preferences"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <h1 className="text-2xl font-bold text-[#001D21] mb-6 text-start">Terms Of Service</h1>

          {/* Document List */}
          <div className="space-y-3 mb-6">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F4F6F5] rounded-lg !border-[0.5px] border-[#0A2A2E]">
                <span className="text-[#0A2A2E] font-poppins-custom text-sm">{doc}</span>
                <button className="bg-[#00F0C3] text-[#0A2A2E] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 text-sm cursor-pointer">
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Checkbox Options */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Acknowledge Documents */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acknowledge"
                checked={agreements.acknowledge}
                onChange={() => handleCheckboxChange("acknowledge")}
                className="mt-1 w-5 h-5 text-[#00F0C3] bg-gray-100 border-gray-300 rounded focus:ring-[#00F0C3] focus:ring-2"
              />
              <label htmlFor="acknowledge" className="text-[#0A2A2E] font-poppins-custom text-sm">
                I acknowledge that i have received, read, and understand that above documents and i agree to their terms.
              </label>
            </div>

            {/* Terms and Privacy Policy */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsAndPrivacy"
                checked={agreements.termsAndPrivacy}
                onChange={() => handleCheckboxChange("termsAndPrivacy")}
                className="mt-1 w-5 h-5 text-[#00F0C3] bg-gray-100 border-gray-300 rounded focus:ring-[#00F0C3] focus:ring-2"
              />
              <label htmlFor="termsAndPrivacy" className="text-[#0A2A2E] font-poppins-custom text-sm">
                I agree to the <span className="text-[#9889FF] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#9889FF] cursor-pointer hover:underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Cookie Consent */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="cookies"
                checked={agreements.cookies}
                onChange={() => handleCheckboxChange("cookies")}
                className="mt-1 w-5 h-5 text-[#00F0C3] bg-gray-100 border-gray-300 rounded focus:ring-[#00F0C3] focus:ring-2"
              />
              <label htmlFor="cookies" className="text-[#0A2A2E] font-poppins-custom text-sm">
                I consent to cookies from this site.
              </label>
            </div>

            {/* Submit Button */}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex justify-start pt-4">
              <button
                type="submit"
                className="bg-[#00F0C3] text-[#0A2A2E] font-semibold py-2.5 px-6 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer"
              >
                Submit
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
