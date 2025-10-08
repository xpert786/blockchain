import React from "react";
import Hero from "./Hero";
import AboutPreview from "./AboutPreview";
import Testimonials from "./Testimonials";
import ContactUs from "./ContactUs";

const HomeMain = () => {
  return (
    <>
      {/* Full width Hero section */}
      <Hero />

      {/* Main centered container */}
      {/* <main className="flex flex-col items-center w-full bg-white">
        <div className="w-full max-w-7xl px-6 md:px-10 lg:px-16">
          <AboutPreview />
          <Testimonials />
          <ContactUs />
        </div>
      </main> */}

      <main className="flex flex-col items-center w-full bg-white">
  <div className="w-full max-w-7xl px-6 md:px-10 lg:px-16">
    <AboutPreview />
  </div>

  {/* Testimonials full-width background */}
  <div className="w-full bg-[#FDEEE5] py-20">
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

export default HomeMain;

