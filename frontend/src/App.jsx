import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWithDoctors from "./pages/LandingPageWithDoctors";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWithDoctors />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
