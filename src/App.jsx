import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeMain from "./pages/home/HomeMain";

// Solutions pages
import SolutionsLayout from "./pages/ourSolutions/SolutionsLayout";
import OurSolutionsMain from "./pages/ourSolutions/OurSolutionsMain";
import SolutionDetail from "./pages/ourSolutions/SolutionDetail";

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

    </Routes>
  );
};

export default App;

