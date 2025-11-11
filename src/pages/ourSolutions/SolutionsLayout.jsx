import React from "react";
import { Outlet } from "react-router-dom";
import SolutionsScrollView from "./SolutionsScrollView";
import Testimonials from "../home/Testimonials";
import ContactUs from "../home/ContactUs";

const SolutionsLayout = () => {
    return (
        <>
            <Outlet />

            <main className="flex flex-col items-center w-full bg-white">
                <div className="w-full mt-6 bg-gradient-to-b from-[#FFFEF8] to-[#CEC6FF] flex flex-col items-center">
                    <div className="w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16 mt-12 sm:mt-16 md:mt-20">
                        <SolutionsScrollView />
                    </div>
                </div>

                <div className="w-full bg-[#FDEEE5] py-16 sm:py-20 mt-8 sm:mt-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
                        <Testimonials />
                    </div>
                </div>

                <div className="w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16">
                    <ContactUs />
                </div>
            </main>
        </>
    );
};

export default SolutionsLayout;
