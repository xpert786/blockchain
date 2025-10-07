import React from "react";
import { Link } from "react-router-dom";

const SolutionsHero = () => {
  return (
    <section className="bg-[#001D21] text-white text-center py-40 px-6 md:px-12 ">
      {/* Heading with gradient text */}
      <h1 className="text-4xl md:text-5xl font-semibold mb-4 mt-6">
        Our{" "}
        <span className="bg-[#CEC6FF] bg-clip-text text-transparent">
          Solution
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-[#FFFFFF] max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
        Empowering Founders, Investors, and Syndicate Managers with a modern,
        tokenized investment experience.
      </p>

      {/* Contact Us Button */}
      <Link
        to="/contact"
        className="inline-block bg-[#00E6CC] text-[#001D21] font-semibold px-6 py-2 rounded-md hover:bg-[#00ccb3] transition-all duration-300"
      >
        Contact Us
      </Link>
    </section>
  );
};

export default SolutionsHero;
