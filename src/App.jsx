import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Public Pages
import HomeMain from "./pages/home/HomeMain";
import OurSolutionsMain from "./pages/ourSolutions/OurSolutionsMain"


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeMain />} /> 
         <Route path="our-solutions" element={<OurSolutionsMain />} /> 
       
      </Route>
    </Routes>
  );
};

export default App;
