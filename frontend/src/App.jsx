import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWithDoctors from "./sections/LandingPage";
import ReportsPage from "./component/ReportsPage";
import BookingStatusPage from "./component/BookingStatusPage";
import AuthModal from "./component/AuthModal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWithDoctors />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/booking/?userId=696b65446086f9cdf997ecaa"
          element={<BookingStatusPage />}
        />
        <Route
          path="/auth"
          element={<AuthModal isOpen={true} onClose={() => {}} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
