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
import SyndicateSuccess from "./pages/syndicateCreation/SyndicateSuccess";
import SPVLayout from "./pages/syndicateCreation/spvCreation/SPVLayout";
import SPVStep1 from "./pages/syndicateCreation/spvCreation/SPVStep1";
import SPVStep2 from "./pages/syndicateCreation/spvCreation/SPVStep2";
import SPVStep3 from "./pages/syndicateCreation/spvCreation/SPVStep3";
import SPVStep4 from "./pages/syndicateCreation/spvCreation/SPVStep4";
import SPVStep5 from "./pages/syndicateCreation/spvCreation/SPVStep5";
import SPVStep6 from "./pages/syndicateCreation/spvCreation/SPVStep6";
import SPVStep7 from "./pages/syndicateCreation/spvCreation/SPVStep7";
import ManagerLayout from "./pages/managerPanel/ManagerLayout";
import Dashboard from "./pages/managerPanel/Dashboard";
import Notifications from "./pages/managerPanel/Notifications";
import SPVManagement from "./pages/managerPanel/SPVManagement";
import SPVDetails from "./pages/managerPanel/SPVDetails";
import InvestorDetails from "./pages/managerPanel/InvestorDetails";
import DocumentTemplateEngine from "./pages/managerPanel/DocumentTemplateEngine";
import ManageDocuments from "./pages/managerPanel/ManageDocuments";
import ManageTemplates from "./pages/managerPanel/ManageTemplates";
import GeneratedDocuments from "./pages/managerPanel/GeneratedDocuments";
import GenerateDocument from "./pages/managerPanel/GenerateDocument";
import TransferTemp from "./pages/managerPanel/Transfer/TransferTemp";
import RequestSystem from "./pages/managerPanel/Requests-System/RequestSystem";

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

      {/* Syndicate Success Route (without sidebar) */}
      <Route path="/syndicate-creation/success" element={<SyndicateSuccess />} />

      {/* SPV Creation Routes (with Layout) */}
      <Route path="/syndicate-creation/spv-creation" element={<SPVLayout />}>
        <Route path="step1" element={<SPVStep1 />} />
        <Route path="step2" element={<SPVStep2 />} />
        <Route path="step3" element={<SPVStep3 />} />
        <Route path="step4" element={<SPVStep4 />} />
        <Route path="step5" element={<SPVStep5 />} />
        <Route path="step6" element={<SPVStep6 />} />
        <Route path="step7" element={<SPVStep7 />} />
      </Route>

      {/* Manager Panel Routes (with Layout) */}
      <Route path="/manager-panel" element={<ManagerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="spv-management" element={<SPVManagement />} />
                <Route path="spv-details" element={<SPVDetails />} />
                <Route path="investor-details" element={<InvestorDetails />} />
                <Route path="documents" element={<ManageDocuments />} />
                <Route path="document-template-engine" element={<DocumentTemplateEngine />} />
                <Route path="manage-templates" element={<ManageTemplates />} />
                <Route path="generated-documents" element={<GeneratedDocuments />} />
                <Route path="generate-document" element={<GenerateDocument />} />
                <Route path="transfers" element={<TransferTemp />} />
                <Route path="requests-system" element={<RequestSystem />} />
      </Route>

    </Routes>
  );
};

export default App;

