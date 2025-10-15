import React from "react";

const ContactUs = () => {
  return (
    <section className="py-20">
      <div className="w-full bg-[#CEC6FF] rounded-2xl p-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Left Content */}
        <div>
          <span className="bg-[#0A2A2E] text-white text-xs px-3 py-1 rounded-full font-poppins-custom">
            Ready?
          </span>
          <h2 className="text-2xl md:text-3xl mt-4 mb-2 text-[#001D21] font-normal font-poppins-custom">
            Start Investing Or Launch Your <br />
            <span className="font-bold">SPV Today</span>
          </h2>
          <p className="text-[#001D21] text-sm md:text-base font-poppins-custom">
            Join 500+ syndicates already leveraging our platform.
          </p>
        </div>

        {/* Button */}
        <div className="mt-6 md:mt-0">
          <button className="bg-[#00F0C3] text-black font-semibold px-5 py-2 rounded-md hover:bg-[#0ddac4] transition font-poppins-custom">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
