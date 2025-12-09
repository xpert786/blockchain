import React, { useEffect } from "react";

// This page is used as the OAuth redirect target. It extracts the access_token
// from the URL fragment and posts it to the opener window, then closes itself.
const GoogleOAuthCallback = () => {
  useEffect(() => {
    try {
      // Extract fragment parameters
      const hash = window.location.hash || ""; // e.g. #access_token=...&token_type=Bearer&expires_in=...
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const accessToken = params.get("access_token");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      // Format error message if present
      let errorMessage = error;
      if (error && errorDescription) {
        errorMessage = `${error}: ${errorDescription}`;
      } else if (error === "invalid_client") {
        errorMessage = "OAuth client configuration error. Please check your Google OAuth client ID and redirect URI settings.";
      }

      // Post token back to opener
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ 
          type: "google_auth", 
          access_token: accessToken, 
          error: errorMessage 
        }, window.origin);
      }
    } catch (e) {
      console.error("GoogleOAuthCallback error:", e);
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "google_auth", error: String(e) }, window.origin);
      }
    } finally {
      // close the popup after a short delay to allow message to be delivered
      setTimeout(() => {
        window.close();
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">Completing Google sign-in... You can close this window.</div>
    </div>
  );
};

export default GoogleOAuthCallback;
