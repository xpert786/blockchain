import React from "react";

const Hero = () => {
  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center text-center text-white"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/fullimg.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-4 mt-20">
        <span className="bg-[#0A2A2E] text-[#DCF3E2] px-5 py-2 rounded-full text-[18px] font-aeonik font-semibold">
          Private Investment Platform
        </span>

        <h1 className="text-[72px] md:text-[72px] mt-6 leading-tight text-[#FFFFFF] font-aeonik">
          Secure Platform For <br />
          <span className="text-[#CEC6FF] font-aeonik">Private Investment Syndicates</span>
        </h1>
        
        <p className="mt-4 text-base md:text-[24px] text-gray-200 text-[24px] font-aeonik">
          Streamline SPV creation, investor onboarding, and compliance workflows
          with our comprehensive platform.
        </p>

        <button className="mt-6 bg-[#00F0C3] text-[#0A2A2E] px-6 py-2 rounded-lg font-aeonik font-semibold hover:bg-teal-300 transition">
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default Hero;
