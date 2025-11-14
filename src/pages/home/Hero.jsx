import React from "react";
import fullImg from "../../assets/img/fullimg.png";

const Hero = () => {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center text-white"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${fullImg})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className=" mt-16 relative z-10 flex max-w-3xl flex-col mt-10 items-center gap-6 px-4 py-16 sm:px-6 lg:px-8">
        <span className="bg-[#0A2A2E] text-[#DCF3E2] px-4 py-2 rounded-full text-sm sm:text-base md:text-lg font-aeonik font-semibold">
          Private Investment Platform
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-[72px] leading-tight text-[#FFFFFF] font-aeonik">
          Secure Platform For
          <br className="hidden sm:block" />
          <span className="text-[#CEC6FF] font-aeonik">Private Investment Syndicates</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-[24px] text-gray-200 font-aeonik max-w-2xl">
          Streamline SPV creation, investor onboarding, and compliance workflows
          with our comprehensive platform.
        </p>

        <button className="w-full sm:w-auto bg-[#00F0C3] text-[#0A2A2E] px-6 py-3 rounded-lg font-aeonik font-semibold hover:bg-teal-300 transition">
          Contact Us
        </button>
      </div>
    </section>
  );
};

export default Hero;
