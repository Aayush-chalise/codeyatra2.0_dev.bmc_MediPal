import React, { useState } from "react";
import AppointmentModal from "../component/AppointmentModal";

import {
  Menu,
  X,
  Heart,
  Brain,
  Send,
  Loader,
  Star,
  MapPin,
  Clock,
  Phone,
  Video,
  CheckCircle,
} from "lucide-react";

const LandingPageWithDoctors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] =
    useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I am MediPal, your AI health assistant. Tell me about your symptoms, and I will suggest the right department and urgency level.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [error, setError] = useState(null);

  // Backend API configuration
  const BACKEND_URL = "http://localhost:8080"; // Change this to your backend URL

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

  // Doctor Database
  const doctorsDatabase = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      department: "Cardiology",
      specialization: "Heart & Cardio Diseases",
      rating: 4.8,
      reviews: 245,
      experience: "15 years",
      fee: "NPR 1000",
      availability: "Available Today",
      image: "👨‍⚕️",
      phone: "+977-1-4123456",
      address: "Central Hospital, Kathmandu",
      consultationType: ["In-person", "Video Call"],
      workingHours: "9:00 AM - 5:00 PM",
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      department: "Cardiology",
      specialization: "Cardiologist & Arrhythmia",
      rating: 4.9,
      reviews: 312,
      experience: "12 years",
      fee: "NPR 550",
      availability: "Available Today",
      image: "👩‍⚕️",
      phone: "+977-1-4234567",
      address: "City Medical Center, Kathmandu",
      consultationType: ["Video Call", "In-person"],
    },
    {
      id: 3,
      name: "Dr. Amit Singh",
      department: "Emergency",
      specialization: "Emergency",
      rating: 4.7,
      reviews: 189,
      experience: "18 years",
      fee: "NPR 800",
      availability: "Available Tomorrow",
      image: "👨‍⚕️",
      phone: "+977-1-4345678",
      address: "Health Plus Hospital, Kathmandu",
      consultationType: ["In-person"],
    },
    {
      id: 4,
      name: "Dr. Neha Patel",
      department: "Pulmonology",
      specialization: "Respiratory Diseases",
      rating: 4.6,
      reviews: 156,
      experience: "10 years",
      fee: "NPR 650",
      availability: "Available Today",
      image: "👩‍⚕️",
      phone: "+977-1-4456789",
      address: "Respiratory Center, Kathmandu",
      consultationType: ["Video Call", "In-person"],
    },
    {
      id: 5,
      name: "Dr. Vikram Desai",
      department: "Neurology",
      specialization: "Neurologist & Headaches",
      rating: 4.8,
      reviews: 267,
      experience: "14 years",
      fee: "NPR 500",
      availability: "Available Today",
      image: "👨‍⚕️",
      phone: "+977-1-4567890",
      address: "Neuro Care Clinic, Kathmandu",
      consultationType: ["In-person", "Video Call"],
    },
    {
      id: 6,
      name: "Dr. Anisha Roy",
      department: "Orthopedics",
      specialization: "Orthopedic Surgeon",
      rating: 4.9,
      reviews: 298,
      experience: "16 years",
      fee: "NPR 600",
      availability: "Available Today",
      image: "👩‍⚕️",
      phone: "+977-1-4678901",
      address: "Bone & Joint Center, Kathmandu",
      consultationType: ["In-person"],
    },
    {
      id: 7,
      name: "Dr. Sameer Malhotra",
      department: "General Medicine",
      specialization: "General Practitioner",
      rating: 4.5,
      reviews: 421,
      experience: "20 years",
      fee: "NPR 1000",
      availability: "Available Today",
      image: "👨‍⚕️",
      phone: "+977-1-4789012",
      address: "General Health Clinic, Kathmandu",
      consultationType: ["Video Call", "In-person"],
    },
    {
      id: 8,
      name: "Dr. Divya Gupta",
      department: "General Medicine",
      specialization: "Internal Medicine",
      rating: 4.7,
      reviews: 334,
      experience: "13 years",
      fee: "NPR 900",
      availability: "Available Today",
      image: "👩‍⚕️",
      phone: "+977-1-4890123",
      address: "Medical Excellence, Kathmandu",
      consultationType: ["Video Call", "In-person"],
    },
  ];

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

  const handleBookAppointment = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      // Send to backend
      const response = await fetch(`${BACKEND_URL}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Appointment booked successfully:", data);

      // Add success message to chat
      const botMessage = {
        id: messages.length + 1,
        type: "bot",
        text: `✅ Appointment Confirmed!\n\nYour appointment with ${appointmentData.doctorName} has been booked successfully.\n\nConfirmation details have been sent to ${appointmentData.userEmail}.\n\nWe look forward to seeing you!`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error booking appointment:", err);
      throw err;
    }
  };

  const analyzeSymptom = (symptomText) => {
    const lowerText = symptomText.toLowerCase();

    for (const keyword of ["bleeding", "unconscious", "attack", "severe"]) {
      if (lowerText.includes(keyword)) {
        return {
          dept: "Emergency",
          urgency: "Critical",
          time: "Immediate",
          isEmergency: true,
        };
      }
    }

    for (const [keyword, suggestion] of Object.entries(symptomKeywords)) {
      if (lowerText.includes(keyword)) {
        return { ...suggestion, isEmergency: false };
      }
    }

    return null;
  };

  // Send message to backend
  const sendToBackend = async (symptomText) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/symptoms/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptom: symptomText,
          timestamp: new Date().toISOString(),
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      return data; // Return the backend response
    } catch (err) {
      console.error("Error sending to backend:", err);
      setError("Failed to connect to backend. Using local analysis.");
      return null; // Fall back to local analysis
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
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
      // Send to backend
      const backendResponse = await sendToBackend(symptomText);
      console.log(backendResponse);

      // Use backend response if available, otherwise fall back to local analysis
      let analysis = backendResponse?.analysis || analyzeSymptom(symptomText);

      let botResponse = "";

      if (analysis?.text) {
        botResponse = analysis.text;
      } else if (analysis?.isEmergency) {
        botResponse = `🚨 **EMERGENCY DETECTED**\n\nYour symptoms appear to be critical. Please **visit the Emergency Department immediately.\n\nSuggested Department: **${analysis.department}**\nUrgency: **${analysis.urgency}**\nAction Required: **${analysis.time}**`;
      } else if (analysis) {
        botResponse = `✅ Analysis Complete\n\n**Suggested Department:** ${analysis.department}\n**Urgency Level:** ${analysis.urgency}\n**Recommended Time:** ${analysis.time}\n\n👇 Check available doctors below to book an appointment!`;
        // Set the selected department for filtering
        setSelectedDepartment(analysis.department);
      } else {
        botResponse = `I couldn't determine the exact department from your symptoms. Could you provide more details? For example: location of pain, duration, additional symptoms, etc.`;
      }

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter doctors based on selected department
  const filteredDoctors = selectedDepartment
    ? doctorsDatabase.filter((doc) => doc.department === selectedDepartment)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-xs text-gray-400">{t.subtitle}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {t.nav.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-4 py-2 text-gray-300 hover:text-cyan-400 transition relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-xs text-gray-300 cursor-pointer hover:border-blue-400/50 transition"
              >
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
              </select>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-blue-500/20 rounded-lg transition"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 mx-4 mt-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chatbot Section */}
          <section className="relative z-10 flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300 font-medium">
                    AI Health Assistant
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                  Your Personal Health{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Companion
                  </span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Describe your symptoms and get instant AI-powered department
                  suggestions
                </p>
              </div>

              {/* Chat Container */}
              <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-96 sm:h-[500px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md ${
                          message.type === "user"
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-tr-none"
                            : "bg-white/10 border border-white/20 text-gray-100 rounded-2xl rounded-tl-none"
                        } p-4 space-y-2`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs ${
                            message.type === "user"
                              ? "text-cyan-100"
                              : "text-gray-400"
                          }`}
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
                      <div className="bg-white/10 border border-white/20 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
                        <Loader className="w-5 h-5 text-cyan-400 animate-spin" />
                        <span className="text-gray-400 text-sm">
                          Analyzing...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-white/10 p-4 bg-gradient-to-t from-slate-900/50 to-transparent">
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
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition resize-none"
                      rows="1"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send
                  </p>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="mt-6">
                <p className="text-center text-xs text-gray-400 mb-3">
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
                      onClick={() => {
                        setInputValue(prompt);
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-lg text-xs text-gray-300 hover:text-cyan-400 transition"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Doctors List Section */}
          <section className="relative z-10">
            {selectedDepartment ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-3xl font-black">
                      <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {selectedDepartment}
                      </span>
                    </h2>
                  </div>
                  <p className="text-gray-400">
                    {filteredDoctors.length} available doctors in{" "}
                    {selectedDepartment}
                  </p>
                </div>

                {/* Doctors List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 rounded-2xl p-6 space-y-4 transition group"
                    >
                      {/* Doctor Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">{doctor.image}</div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold group-hover:text-cyan-400 transition">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-cyan-300">
                              {doctor.specialization}
                            </p>
                            <div className="flex items-center space-x-1 mt-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-semibold">
                                {doctor.rating}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({doctor.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-cyan-400">
                            {doctor.fee}
                          </p>
                          <p className="text-xs text-gray-400">
                            per consultation
                          </p>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Experience</span>
                          </p>
                          <p className="text-sm font-semibold">
                            {doctor.experience}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Availability</span>
                          </p>
                          <p className="text-sm font-semibold text-green-400">
                            {doctor.availability}
                          </p>
                        </div>
                      </div>

                      {/* Contact & Type */}
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span>{doctor.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <Phone className="w-4 h-4 text-cyan-400" />
                          <span>{doctor.phone}</span>
                        </div>

                        {/* Consultation Types */}
                        <div className="flex gap-2 pt-2">
                          {doctor.consultationType.map((type) => (
                            <span
                              key={type}
                              className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1 ${
                                type === "Video Call"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                              }`}
                            >
                              {type === "Video Call" ? (
                                <Video className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              <span>{type}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Book Button */}
                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition"
                      >
                        Book Appointment
                      </button>
                      <AppointmentModal
                        doctor={selectedDoctorForBooking}
                        isOpen={isModalOpen}
                        onClose={() => {
                          setIsModalOpen(false);
                          setSelectedDoctorForBooking(null);
                        }}
                        onSubmit={handleAppointmentSubmit}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Placeholder when no department is selected */
              <div className="h-96 sm:h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl space-y-6">
                <div className="text-6xl">👨‍⚕️</div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">No Department Selected</h3>
                  <p className="text-gray-400 max-w-sm">
                    Describe your symptoms in the chatbot to get AI-powered
                    department suggestions and see available doctors
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
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
