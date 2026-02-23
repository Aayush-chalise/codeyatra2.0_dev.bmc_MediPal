import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWithDoctors from "./sections/LandingPage";
import ReportsPage from "./component/ReportsPage";
import BookingStatusPage from "./component/BookingStatusPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWithDoctors />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/booking/:appointmentId" element={<BookingStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;
