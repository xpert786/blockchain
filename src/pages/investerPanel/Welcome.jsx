import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartApplication = () => {
    // Navigate to Accreditation page
    navigate("/investor-panel/accreditation");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="bg-white rounded-xl  p-10 max-w-2xl w-full"
      style={{ border: "0.5px solid #E8EAED" }}
      >
        {/* Title */}
        <h1 className="text-4xl  text-[#001D21] mb-6">Welcome!</h1>

        {/* Descriptive Text */}
        <p className="text-[#748A91] text-base leading-relaxed mb-8">
          Investing in venture capital funds involves a high degree of risk and is suitable only for sophisticated and qualified investors. This application for accredited investors takes around 5 minutes to complete and will determine your qualification for deal by deal investing. All responses are kept confidential.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={handleStartApplication}
          className="w-fit bg-[#00D9C4] hover:bg-[#00C4B3] text-black  py-4 px-6 rounded-xl transition-colors duration-200"
   
        >
          Start Application
        </button>
      </div>
    </div>
  );
};

export default Welcome;

