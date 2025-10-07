import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#001D21] text-white rounded-t-3xl">
      {/* Container with equal left-right spacing */}
      <div className="container mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-20">
        
        {/* Logo & Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Logo</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Secure platform for private investment syndicates with features for
            SPV creation, investor onboarding, and compliance workflows.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
           
              <li><a href="/our-solutions" className="hover:underline">Our Solutions</a></li>
            <li><a href="/" className="hover:underline">SPVs</a></li>
            <li><a href="#" className="hover:underline">Compliance</a></li>
            <li><a href="#" className="hover:underline">Security</a></li>
            <li><a href="#" className="hover:underline">Pricing</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline font-semibold">Blog</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Disclosures</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 text-center py-4 text-sm text-gray-400">
        © 2025 Logo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
