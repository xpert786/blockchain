import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeMain from "./pages/home/HomeMain";

// Solutions pages
import SolutionsLayout from "./pages/ourSolutions/SolutionsLayout";
import OurSolutionsMain from "./pages/ourSolutions/OurSolutionsMain";
import SolutionDetail from "./pages/ourSolutions/SolutionDetail";
import ContactSales from "./pages/ourSolutions/ContactSales";

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
import RoleSelect from "./pages/auth/RoleSelect";
import QuickProfile from "./pages/auth/QuickProfile";

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
import RequestDetails from "./pages/managerPanel/Requests-System/RequestDetails";
import SettingsLayout from "./pages/managerPanel/Settings/SettingsLayout";
import ManagerMessages from "./pages/managerPanel/Messages/messages";
import InvestorLayout from "./pages/investerPanel/InvestorLayout";
import InvestorDashboardLayout from "./pages/investerPanel/dashbaord/InvestorDashboardLayout";
import Welcome from "./pages/investerPanel/Welcome";
import Accreditation from "./pages/investerPanel/Accreditation";
import InvestmentGoals from "./pages/investerPanel/InvestmentGoals";
import PastExperience from "./pages/investerPanel/PastExperience";
import ThankYou from "./pages/investerPanel/ThankYou";
import InvestorDashboard from "./pages/investerPanel/dashbaord/Dashboard";
import InvestorNotifications from "./pages/investerPanel/Notifications";
import Invest from "./pages/investerPanel/dashbaord/Invest";
import Invites from "./pages/investerPanel/dashbaord/Invites";
import TopSyndicates from "./pages/investerPanel/dashbaord/TopSyndicates";
import Wishlist from "./pages/investerPanel/dashbaord/wishlist";
import Portfolio from "./pages/investerPanel/dashbaord/Portfolio";
import TaxDocuments from "./pages/investerPanel/dashbaord/TaxDocuments";
import TaxDocumentDetail from "./pages/investerPanel/dashbaord/TaxDocumentDetail";
import Messages from "./pages/investerPanel/dashbaord/messages";
import InvestorSettings from "./pages/investerPanel/dashbaord/InvestorSettings";
import BasicInfo from "./pages/investerPanel/investerOnboarding/BasicInfo";
import KYCVerification from "./pages/investerPanel/investerOnboarding/KYCVerification";
import BankDetails from "./pages/investerPanel/investerOnboarding/BankDetails";
import AccreditationOnboarding from "./pages/investerPanel/investerOnboarding/AccreditationOnboarding";
import AcceptAgreements from "./pages/investerPanel/investerOnboarding/AcceptAgreements";
import InvestorFinalReview from "./pages/investerPanel/investerOnboarding/FinalReview";
import Confirmation from "./pages/investerPanel/investerOnboarding/Confirmation";
import Juridiction from "./pages/auth/Juridiction";
import QuickProfileSet from "./pages/auth/QuickProfileSet";
import GoogleOAuthCallback from "./pages/auth/GoogleOAuthCallback";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home Page */}
        <Route index element={<HomeMain />} />

        {/* Our Solutions main & details */}
        <Route path="our-solutions" element={<SolutionsLayout />}>
          <Route index element={<OurSolutionsMain />} />
          <Route path="contact-sales" element={<ContactSales />} />
          <Route path=":slug" element={<SolutionDetail />} />
        </Route>
      </Route>

      {/* Auth Routes (without Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/secure-account-2fa" element={<SecureAccount2FA />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-phone" element={<VerifyPhone />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<OTPVerification />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />
      <Route path="/quick-profile" element={<QuickProfile />} />
      <Route path="/juridiction" element={<Juridiction />} />
      {/* Historical/mistyped route - redirect to canonical path */}
      <Route path="/jurisdiction" element={<Navigate to="/juridiction" replace />} />
      <Route path="/oauth2callback" element={<GoogleOAuthCallback />} />
      <Route path="/quick-profile-set" element={<QuickProfileSet />} />
    
      {/* Syndicate Creation Routes (with Layout) - Protected */}
      <Route
        path="/syndicate-creation"
        element={
          <ProtectedRoute requiredRole="syndicate">
            <SyndicateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LeadInfo />} />
        <Route path="lead-info" element={<LeadInfo />} />
        <Route path="entity-profile" element={<EntityProfile />} />
        <Route path="kyb-verification" element={<KYBVerification />} />
        <Route path="compliance-attestation" element={<ComplianceAttestation />} />
        <Route path="final-review" element={<FinalReview />} />
      </Route>

      {/* Syndicate Success Route (without sidebar) - Protected */}
      <Route
        path="/syndicate-creation/success"
        element={
          <ProtectedRoute requiredRole="syndicate">
            <SyndicateSuccess />
          </ProtectedRoute>
        }
      />

      {/* SPV Creation Routes (with Layout) - Protected */}
      <Route
        path="/syndicate-creation/spv-creation"
        element={
          <ProtectedRoute requiredRole="syndicate">
            <SPVLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="step1" replace />} />
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
                <Route path="request-details" element={<RequestDetails />} />
                <Route path="messages" element={<ManagerMessages />} />
                <Route path="settings/*" element={<SettingsLayout />} />
      </Route>

      {/* Investor Dashboard Routes (with InvestorDashboardLayout) - Protected */}
      <Route
        path="/investor-panel"
        element={
          <ProtectedRoute requiredRole="investor">
            <InvestorDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InvestorDashboard />} />
        <Route path="notifications" element={<InvestorNotifications />} />
        <Route path="invest" element={<Invest />} />
        <Route path="invites" element={<Invites />} />
        <Route path="top-syndicates" element={<TopSyndicates />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="tax-documents/:documentId" element={<TaxDocumentDetail />} />
        <Route path="tax-documents" element={<TaxDocuments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<InvestorSettings />} />
      </Route>

      {/* Investor Panel Routes (with Layout) - Onboarding - Protected */}
      <Route
        path="/investor-panel"
        element={
          <ProtectedRoute requiredRole="investor">
            <InvestorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Welcome />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="accreditation" element={<Accreditation />} />
        <Route path="investment-goals" element={<InvestmentGoals />} />
        <Route path="past-experience" element={<PastExperience />} />
      </Route>

      {/* Thank You Page (without sidebar layout) - Protected */}
      <Route
        path="/investor-panel/thank-you"
        element={
          <ProtectedRoute requiredRole="investor">
            <ThankYou />
          </ProtectedRoute>
        }
      />

      {/* Investor Onboarding Routes (without sidebar layout, has own header) - Protected */}
      <Route
        path="/investor-onboarding/basic-info"
        element={
          <ProtectedRoute requiredRole="investor">
            <BasicInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor-onboarding/kyc-verification"
        element={
          <ProtectedRoute requiredRole="investor">
            <KYCVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor-onboarding/bank-details"
        element={
          <ProtectedRoute requiredRole="investor">
            <BankDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor-onboarding/accreditation"
        element={
          <ProtectedRoute requiredRole="investor">
            <AccreditationOnboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor-onboarding/agreements"
        element={
          <ProtectedRoute requiredRole="investor">
            <AcceptAgreements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor-onboarding/final-review"
        element={
          <ProtectedRoute requiredRole="investor">
            <InvestorFinalReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor-onboarding/confirmation"
        element={
          <ProtectedRoute requiredRole="investor">
            <Confirmation />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect unknown routes to home to avoid "No routes matched" warnings */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;


