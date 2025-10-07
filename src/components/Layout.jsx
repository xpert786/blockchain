import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      {/* Header sabhi pages par common hoga */}
      <Header />  

      {/* Yaha pe routes ka page content change hoga */}
      <main style={{ minHeight: "80vh",  }}>
        <Outlet />
      </main>

      {/* Footer bhi common hoga */}
      <Footer />
    </>
  );
};

export default Layout;
