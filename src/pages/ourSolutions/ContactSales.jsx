import React from "react";
import { useNavigate } from "react-router-dom";

const ContactSales = () => {
  const navigate = useNavigate();

 
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/our-solutions");
  };

  return (
    <section className="bg-[#001D21] text-white px-6 py-20 sm:py-24 md:py-30 md:px-12 flex justify-center items-center">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-start justify-between gap-12 md:gap-16 mt-12 sm:mt-16 md:mt-20">

        {/* ✅ Left Text Section */}
        <div className="flex-1 md:pr-10">
          <h1 className="text-3xl sm:text-4xl md:text-[45px] font-semibold mb-6 text-[#FFFFFF]">Contact Sales</h1>
          <p className="text-[#FFFFFF] text-sm sm:text-base leading-relaxed max-w-md">
            Fill out the form below to connect with our sales team. We’ll reach
            out to discuss how Unlocksley’s software solutions can support your
            firm’s goals and operations.
          </p>
        </div>

        {/* ✅ Right Form Section */}
        <div className="flex-1 w-full">
          <div className="bg-white text-[#001D21] rounded-xl p-6 sm:p-8 w-full max-w-lg md:max-w-md md:ml-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6CC]"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6CC]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6CC]"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6CC]"
                />
              </div>

              {/* Interest */}
              <div>
                <label className="text-sm font-medium mb-2">
                  What are you interested in?
                </label>
                <div className="border border-gray-300 rounded-md divide-y divide-gray-200">
                  <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-medium">Venture Funds</p>
                      <p className="text-xs text-gray-500">
                        Launch and manage funds of any size
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="interest"
                      className="accent-[#00E6CC]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-medium">SPVs</p>
                      <p className="text-xs text-gray-500">
                        Raise capital on a deal-by-deal basis
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="interest"
                      className="accent-[#00E6CC]"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-[130px] bg-[#00F0C3] text-[#0A2A2E] py-2 rounded-md font-semibold hover:bg-[#00ccb3] transition-all cursor-pointer"
              >
                Contact Sales
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSales;
