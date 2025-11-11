import React from "react";
import { Link } from "react-router-dom";

const SolutionsHero = ({ onContactClick }) => {
  return (
    <section className="bg-[#001D21] text-white text-center px-6 py-24 sm:py-32 md:py-40 md:px-12">
      {/* Heading with gradient text */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 mt-6">
        Our{" "}
        <span className="bg-[#CEC6FF] bg-clip-text text-transparent">
          Solution
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-[#FFFFFF] max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
        Empowering Founders, Investors, and Syndicate Managers with a modern,
        tokenized investment experience.
      </p>

      {/* Contact Us Button */}
       <button
        onClick={onContactClick}
        className="inline-flex w-full sm:w-auto items-center justify-center bg-[#00E6CC] text-[#001D21] font-semibold px-6 py-3 rounded-md hover:bg-[#00ccb3] transition-all duration-300"
      >
        Contact Us
      </button>
    </section>
  );
};

export default SolutionsHero;





