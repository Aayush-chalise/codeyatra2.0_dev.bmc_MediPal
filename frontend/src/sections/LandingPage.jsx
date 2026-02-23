import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Heart,
  Brain,
  Send,
  Loader,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  FileText,
  LogIn,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "../component/AppointmentModal";
import AuthModal from "../component/AuthModal";

const LandingPageWithDoctors = () => {
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I am MediPal, your AI health assistant. Tell me about your symptoms, and I will suggest the right department and doctors for you!",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] =
    useState(null);

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { name, email, token }

  // ── Doctor data state ───────────────────────────────────────────────────────
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);

  const BACKEND_URL = "http://localhost:8080";

  const colors = {
    primary: "#006d77",
    secondary: "#83c5be",
    light: "#edf6f9",
  };

  const translations = {
    en: {
      title: "MediPal",
      subtitle: "Smart Healthcare Companion",
      nav: ["Features", "How it Works", "Pricing", "Contact"],
    },
    ne: {
      title: "स्वास्थ्य साथी",
      subtitle: "स्मार्ट स्वास्थ्य सेवा",
      nav: ["विशेषता", "कसरी काम गर्छ", "मूल्य निर्धारण", "सम्पर्क गर्नुहोस्"],
    },
  };

  const t = translations[language];

  // ── Fetch doctors whenever selected department changes ──────────────────────
  useEffect(() => {
    if (!selectedDepartment) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      setDoctorsLoading(true);
      setDoctorsError(null);
      setDoctors([]);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/doctors?department=${encodeURIComponent(selectedDepartment)}`,
        );
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        console.log(data);
        setDoctors(Array.isArray(data) ? data : (data.doctors ?? []));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setDoctorsError("Could not load doctors. Please try again.");
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedDepartment]);

  // ── Auth handlers ───────────────────────────────────────────────────────────
  const handleAuthSuccess = (userData) => {
    // Normalise whatever shape your backend returns
    setCurrentUser({
      name: userData.name ?? userData.user?.name ?? "User",
      email: userData.email ?? userData.user?.email ?? "",
      token: userData.token ?? userData.accessToken ?? "",
    });
  };

  const handleLogout = () => setCurrentUser(null);

  // ── Symptom analysis ────────────────────────────────────────────────────────
  const symptomKeywords = {
    "chest pain": { dept: "Cardiology", urgency: "High", time: "Today" },
    heart: { dept: "Cardiology", urgency: "High", time: "Today" },
    breathing: { dept: "Pulmonology", urgency: "High", time: "Today" },
    headache: { dept: "Neurology", urgency: "Medium", time: "Tomorrow" },
    fever: { dept: "General Medicine", urgency: "Medium", time: "Today" },
    fracture: { dept: "Orthopedics", urgency: "High", time: "Today" },
    injury: { dept: "Orthopedics", urgency: "High", time: "Immediate" },
    bleeding: { dept: "Emergency", urgency: "Critical", time: "Immediate" },
    unconscious: { dept: "Emergency", urgency: "Critical", time: "Immediate" },
    attack: { dept: "Emergency", urgency: "Critical", time: "Immediate" },
    eye: { dept: "Ophthalmology", urgency: "Medium", time: "Today" },
    skin: { dept: "Dermatology", urgency: "Low", time: "This Week" },
    tooth: { dept: "Dentistry", urgency: "Low", time: "This Week" },
    stomach: { dept: "General Medicine", urgency: "Medium", time: "Today" },
  };

  const analyzeSymptom = (symptomText) => {
    const lowerText = symptomText.toLowerCase();
    for (const keyword of ["bleeding", "unconscious", "attack", "severe"]) {
      if (lowerText.includes(keyword))
        return {
          dept: "Emergency",
          urgency: "Critical",
          time: "Immediate",
          isEmergency: true,
        };
    }
    for (const [keyword, suggestion] of Object.entries(symptomKeywords)) {
      if (lowerText.includes(keyword))
        return { ...suggestion, isEmergency: false };
    }
    return null;
  };
  const token = localStorage.getItem("token");

  const sendToBackend = async (symptomText) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/symptoms/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symptom: symptomText }),
      });
      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error("Error sending to backend:", err);
      setError("Failed to connect to backend. Using local analysis.");
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: new Date().getTime(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    const symptomText = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const backendResponse = await sendToBackend(symptomText);
      let analysis = backendResponse?.analysis || analyzeSymptom(symptomText);
      let botResponse = "";

      if (analysis?.text) {
        botResponse = analysis.text;
      } else if (analysis?.isEmergency) {
        botResponse = `⚠️ Your symptoms appear to be critical. Please **visit the Emergency Department immediately**.\n\nSuggested Department: **${analysis.department}**\nUrgency: **${analysis.urgency}**\nAction Required: **${analysis.time}**`;
      } else if (analysis) {
        botResponse = `✅ Analysis Complete\n\n**Suggested Department:** ${analysis.department}\n**Urgency Level:** ${analysis.urgency}\n**Recommended Time:** ${analysis.time}\n\nCheck available doctors below to book an appointment!`;
        setSelectedDepartment(analysis.department);
      } else {
        botResponse = `I couldn't determine the exact department from your symptoms. Could you provide more details? For example: location of pain, duration, additional symptoms, etc.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: botResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsModalOpen(true);
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/book/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      const data = await response.json();
      console.log("Appointment booked successfully:", data);

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: `✅ Appointment Confirmed!\n\nYour appointment with ${appointmentData.doctorName} has been booked successfully.\n\nDate: ${appointmentData.appointmentDate}\nTime: ${appointmentData.appointmentTime}\nConfirmation: ${appointmentData.confirmationNumber}\n\nConfirmation details have been sent to ${appointmentData.userEmail}.\n\nWe look forward to seeing you!`,
          timestamp: new Date(),
        },
      ]);
      // navigate("/")
    } catch (err) {
      console.error("Error booking appointment:", err);
      throw err;
    }
  };

  return (
    <div
      className="min-h-screen text-gray-900 overflow-hidden"
      style={{ backgroundColor: colors.light }}
    >
      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 shadow-md border-b"
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.secondary,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.secondary }}
              >
                <Heart className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div style={{ color: colors.light }}>
                <h1 className="text-xl font-black">{t.title}</h1>
                <p className="text-xs opacity-80">{t.subtitle}</p>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {t.nav.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-medium transition hover:opacity-80"
                  style={{ color: colors.light }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center space-x-3">
              {/* Reports */}
              <button
                onClick={() => navigate("/reports")}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition hover:shadow-lg"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                }}
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </button>

              {/* ── Auth: shows Login button OR user chip ── */}
              {currentUser ? (
                <div className="hidden md:flex items-center space-x-2">
                  {/* User chip */}
                  <div
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border-2"
                    style={{
                      borderColor: colors.secondary,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.primary,
                      }}
                    >
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="text-sm font-semibold max-w-[100px] truncate"
                      style={{ color: colors.light }}
                    >
                      {currentUser.name}
                    </span>
                  </div>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="p-2 rounded-lg transition hover:opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold border-2 transition hover:bg-white hover:bg-opacity-10"
                  style={{ borderColor: colors.secondary, color: colors.light }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Language */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                  border: `2px solid ${colors.secondary}`,
                }}
              >
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
              </select>

              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition"
                style={{ color: colors.light }}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="md:hidden pb-4 space-y-2 border-t"
              style={{ borderColor: colors.secondary }}
            >
              {t.nav.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-2 font-medium rounded transition"
                  style={{ color: colors.light }}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate("/reports");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                }}
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </button>

              {/* Mobile auth */}
              {currentUser ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{
                        backgroundColor: colors.secondary,
                        color: colors.primary,
                      }}
                    >
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: colors.light }}
                    >
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold underline"
                    style={{ color: colors.secondary }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 border-2 transition"
                  style={{ borderColor: colors.secondary, color: colors.light }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Error Banner */}
      {error && (
        <div
          className="border px-4 py-3 mx-4 mt-4 rounded-lg flex items-center space-x-2"
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            borderColor: "rgba(220, 38, 38, 0.3)",
            color: "#dc2626",
          }}
        >
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Main Container ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Chatbot Section */}
          <section className="flex flex-col">
            <div className="flex-1 flex flex-col">
              <div className="text-center space-y-4 mb-8">
                <div
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2"
                  style={{
                    backgroundColor: `${colors.secondary}30`,
                    borderColor: colors.secondary,
                  }}
                >
                  <Brain
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.primary }}
                  >
                    AI Health Assistant
                  </span>
                </div>
                <h1
                  className="text-4xl sm:text-5xl font-black leading-tight"
                  style={{ color: colors.primary }}
                >
                  Your Personal Health{" "}
                  <span style={{ color: colors.secondary }}>Companion</span>
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Describe your symptoms and get instant AI-powered department
                  suggestions
                </p>
              </div>

              <div
                className="flex-1 flex flex-col border-2 rounded-2xl overflow-hidden h-96 sm:h-[500px] shadow-lg"
                style={{
                  borderColor: colors.primary,
                  backgroundColor: "white",
                }}
              >
                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                  style={{ backgroundColor: colors.light }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md rounded-2xl p-4 space-y-2 ${message.type === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
                        style={{
                          backgroundColor:
                            message.type === "user" ? colors.primary : "white",
                          color:
                            message.type === "user"
                              ? colors.light
                              : colors.primary,
                          border:
                            message.type === "user"
                              ? "none"
                              : `2px solid ${colors.primary}`,
                        }}
                      >
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.secondary }}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div
                        className="rounded-2xl rounded-tl-none p-4 flex items-center space-x-2 border-2"
                        style={{
                          borderColor: colors.primary,
                          backgroundColor: "white",
                        }}
                      >
                        <Loader
                          className="w-5 h-5 animate-spin"
                          style={{ color: colors.primary }}
                        />
                        <span
                          style={{ color: colors.primary }}
                          className="text-sm font-medium"
                        >
                          Analyzing...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div
                  className="border-t-2 p-4"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: "white",
                  }}
                >
                  <div className="flex items-end space-x-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Describe your symptoms..."
                      className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition resize-none border-2"
                      style={{
                        borderColor: colors.secondary,
                        color: colors.primary,
                      }}
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-4 py-3 rounded-lg font-semibold text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs mt-2" style={{ color: colors.primary }}>
                    Disclaimer: This AI assistant provides suggestions based on
                    the symptoms you describe. It is not a substitute for
                    professional medical advice.
                  </p>
                </div>
              </div>

              {/* Example prompts */}
              <div className="mt-6">
                <p
                  className="text-center text-xs font-medium mb-3"
                  style={{ color: colors.primary }}
                >
                  Try asking:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Chest pain",
                    "Severe headache",
                    "Twisted ankle",
                    "Shortness of breath",
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputValue(prompt)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition hover:shadow-md border-2"
                      style={{
                        borderColor: colors.secondary,
                        color: colors.primary,
                        backgroundColor: "white",
                      }}
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Doctors Section */}
          <section>
            {selectedDepartment ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className="w-6 h-6"
                      style={{ color: colors.primary }}
                    />
                    <h2
                      className="text-3xl font-black"
                      style={{ color: colors.primary }}
                    >
                      {selectedDepartment}
                    </h2>
                  </div>
                  {!doctorsLoading && !doctorsError && (
                    <p
                      style={{ color: colors.primary }}
                      className="font-medium"
                    >
                      {doctors.length} available doctor
                      {doctors.length !== 1 ? "s" : ""} in {selectedDepartment}
                    </p>
                  )}
                </div>

                {doctorsLoading && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader
                      className="w-10 h-10 animate-spin"
                      style={{ color: colors.primary }}
                    />
                    <p
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      Loading doctors...
                    </p>
                  </div>
                )}

                {doctorsError && !doctorsLoading && (
                  <div
                    className="border-2 rounded-xl p-6 flex items-center space-x-3"
                    style={{
                      borderColor: "#dc2626",
                      backgroundColor: "rgba(220,38,38,0.05)",
                      color: "#dc2626",
                    }}
                  >
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Failed to load doctors</p>
                      <p className="text-sm mt-1">{doctorsError}</p>
                      <button
                        onClick={() => setSelectedDepartment((d) => d)}
                        className="mt-3 text-sm font-semibold underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {!doctorsLoading && !doctorsError && doctors.length === 0 && (
                  <div
                    className="border-2 rounded-xl p-10 text-center space-y-3"
                    style={{
                      borderColor: colors.secondary,
                      backgroundColor: colors.light,
                    }}
                  >
                    <div className="text-5xl">🔍</div>
                    <p
                      className="font-semibold text-lg"
                      style={{ color: colors.primary }}
                    >
                      No doctors found
                    </p>
                    <p className="text-gray-600 text-sm">
                      There are currently no available doctors in the{" "}
                      {selectedDepartment} department.
                    </p>
                  </div>
                )}

                {!doctorsLoading && !doctorsError && doctors.length > 0 && (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor._id}
                        className="border-2 rounded-xl p-6 space-y-4 transition hover:shadow-lg"
                        style={{
                          borderColor: colors.secondary,
                          backgroundColor: "white",
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="text-4xl">
                              {doctor.image ?? "👨‍⚕️"}
                            </div>
                            <div className="space-y-1">
                              <h3
                                className="text-lg font-bold"
                                style={{ color: colors.primary }}
                              >
                                {doctor.name}
                              </h3>
                              <p
                                className="text-sm font-medium"
                                style={{ color: colors.secondary }}
                              >
                                {doctor.specialization}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-lg font-bold"
                              style={{ color: colors.secondary }}
                            >
                              NPR: {doctor.consultationFee}
                            </p>
                            <p className="text-xs text-gray-500">
                              per consultation
                            </p>
                          </div>
                        </div>

                        <div
                          className="grid grid-cols-2 gap-4 py-4 border-t-2"
                          style={{ borderColor: colors.secondary }}
                        >
                          <div className="space-y-1">
                            <p
                              className="text-xs font-semibold flex items-center space-x-1"
                              style={{ color: colors.primary }}
                            >
                              <Clock className="w-3 h-3" />
                              <span>Experience</span>
                            </p>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: colors.primary }}
                            >
                              {doctor.experienceYears}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p
                              className="text-xs font-semibold flex items-center space-x-1"
                              style={{ color: colors.primary }}
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Availability</span>
                            </p>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: colors.secondary }}
                            >
                              Available
                            </p>
                          </div>
                        </div>

                        <div
                          className="rounded-lg p-3 text-xs space-y-1 border-2"
                          style={{
                            backgroundColor: `${colors.secondary}20`,
                            borderColor: colors.secondary,
                            color: colors.primary,
                          }}
                        >
                          <p className="font-semibold">📋 Working Hours:</p>
                          <p>
                            {doctor.schedule?.workingHours?.start} -{" "}
                            {doctor.schedule?.workingHours?.end}
                          </p>
                        </div>

                        <div
                          className="space-y-3 pt-4 border-t-2"
                          style={{ borderColor: colors.secondary }}
                        >
                          <div
                            className="flex items-center space-x-2 text-sm"
                            style={{ color: colors.primary }}
                          >
                            <Phone
                              className="w-4 h-4"
                              style={{ color: colors.secondary }}
                            />
                            <span>{doctor.phone}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          className="w-full mt-4 py-3 rounded-lg font-semibold text-white hover:shadow-lg transition"
                          style={{ backgroundColor: colors.primary }}
                        >
                          Book Appointment
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="h-96 sm:h-[500px] flex flex-col items-center justify-center border-2 rounded-xl space-y-6"
                style={{
                  borderColor: colors.secondary,
                  backgroundColor: colors.light,
                }}
              >
                <div className="text-6xl">👨‍⚕️</div>
                <div className="text-center space-y-2">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    No Department Selected
                  </h3>
                  <p className="text-gray-600 max-w-sm">
                    Describe your symptoms in the chatbot to get AI-powered
                    department suggestions and see available doctors
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <AppointmentModal
        doctor={selectedDoctorForBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoctorForBooking(null);
        }}
        onSubmit={handleAppointmentSubmit}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LandingPageWithDoctors;
