import React from "react";
import SolutionsHero from "./SolutionsHero.jsx";
import SolutionsCards from "./SolutionsCards.jsx";
import Testimonials from "../home/Testimonials.jsx";
import ContactUs from "../home/ContactUs.jsx";

const OurSolutionsMain = () => {
  return (
    <>
      {/* Full width Hero section */}
      <SolutionsHero />



      <main className="flex flex-col items-center w-full bg-white">
        <div className="w-full max-w-7xl px-6 md:px-10 lg:px-16 mt-20">
          <SolutionsCards />
        </div>

        {/* Testimonials full-width background */}
        <div className="w-full bg-[#FDEEE5] py-20 mt-10">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
            <Testimonials />
          </div>
        </div>

        <div className="w-full max-w-7xl px-6 md:px-10 lg:px-16">
          <ContactUs />
        </div>
      </main>
    </>
  );
};

export default OurSolutionsMain;
