import React, { useState } from "react";
import SolutionsHero from "./SolutionsHero";
import SolutionsCards from "./SolutionsCards";
import ContactSales from "./ContactSales"; 

const OurSolutionsMain = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <>
     
      {!showContactForm ? (
        <SolutionsHero onContactClick={() => setShowContactForm(true)} />
      ) : (
        <ContactSales onBack={() => setShowContactForm(false)} />
      )}

   
      {!showContactForm && (
        <main className="flex flex-col items-center w-full bg-white">
          <div className="w-full max-w-7xl px-6 md:px-10 lg:px-16 mt-20">
            <SolutionsCards />
          </div>
        </main>
      )}
    </>
  );
};

export default OurSolutionsMain;


