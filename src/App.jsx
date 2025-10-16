import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeMain from "./pages/home/HomeMain";

// Solutions pages
import SolutionsLayout from "./pages/ourSolutions/SolutionsLayout";
import OurSolutionsMain from "./pages/ourSolutions/OurSolutionsMain";
import SolutionDetail from "./pages/ourSolutions/SolutionDetail";

// Auth pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OTPVerification from "./pages/auth/OTPVerification";
import SetNewPassword from "./pages/auth/SetNewPassword";
import SignUp from "./pages/auth/SignUp";
import CreatePassword from "./pages/auth/CreatePassword";
import SecureAccount2FA from "./pages/auth/SecureAccount2FA";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyPhone from "./pages/auth/VerifyPhone";
import TermsOfService from "./pages/auth/TermsOfService";

// Syndicate Creation pages
import SyndicateLayout from "./pages/syndicateCreation/SyndicateLayout";
import LeadInfo from "./pages/syndicateCreation/LeadInfo";
import EntityProfile from "./pages/syndicateCreation/EntityProfile";
import KYBVerification from "./pages/syndicateCreation/KYBVerification";
import ComplianceAttestation from "./pages/syndicateCreation/ComplianceAttestation";
import FinalReview from "./pages/syndicateCreation/FinalReview";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home Page */}
        <Route index element={<HomeMain />} />

        {/* Our Solutions main & details */}
        <Route path="our-solutions" element={<SolutionsLayout />}>
          <Route index element={<OurSolutionsMain />} />
          <Route path=":slug" element={<SolutionDetail />} />
        </Route>
      </Route>

      {/* Auth Routes (without Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/secure-account-2fa" element={<SecureAccount2FA />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-phone" element={<VerifyPhone />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<OTPVerification />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />

      {/* Syndicate Creation Routes (with Layout) */}
      <Route path="/syndicate-creation" element={<SyndicateLayout />}>
        <Route index element={<LeadInfo />} />
        <Route path="lead-info" element={<LeadInfo />} />
        <Route path="entity-profile" element={<EntityProfile />} />
        <Route path="kyb-verification" element={<KYBVerification />} />
        <Route path="compliance-attestation" element={<ComplianceAttestation />} />
        <Route path="final-review" element={<FinalReview />} />
      </Route>

    </Routes>
  );
};

export default App;

