import React, { useState } from "react";
import { Menu, X, Heart, Brain, Send, Loader } from "lucide-react";

const LandingPageMinimal = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I am MediPal, your AI health assistant. Tell me about your symptoms, and I will suggest the right department, recommend doctors and automate your appointment booking!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      title: "MediPal",
      subtitle: "Smart Healthcare Companion",
      nav: ["Features", "How it Works", "Pricing", "Contact"],
    },
    ne: {
      title: "मेडीपाल",
      subtitle: "स्मार्ट स्वास्थ्य सेवा",
      nav: ["विशेषता", "कसरी काम गर्छ", "मूल्य निर्धारण", "सम्पर्क गर्नुहोस्"],
    },
  };

  const t = translations[language];

  const symptomKeywords = {
    "chest pain": { dept: "Cardiology", urgency: "High", time: "Today" },
    heart: { dept: "Cardiology", urgency: "High", time: "Today" },
    breathing: { dept: "Pulmonology", urgency: "High", time: "Today" },
    headache: { dept: "Neurology", urgency: "Medium", time: "Tomorrow" },
    fever: { dept: "General Medicine", urgency: "Medium", time: "Today" },
    fracture: { dept: "Orthopedics", urgency: "High", time: "Today" },
    injury: { dept: "Trauma Center", urgency: "High", time: "Immediate" },
    bleeding: { dept: "Emergency", urgency: "Critical", time: "Immediate" },
    unconscious: { dept: "Emergency", urgency: "Critical", time: "Immediate" },
    attack: { dept: "Emergency", urgency: "Critical", time: "Immediate" },
    eye: { dept: "Ophthalmology", urgency: "Medium", time: "Today" },
    skin: { dept: "Dermatology", urgency: "Low", time: "This Week" },
    tooth: { dept: "Dentistry", urgency: "Low", time: "This Week" },
    stomach: { dept: "Gastroenterology", urgency: "Medium", time: "Today" },
  };

  const analyzeSymptom = (symptomText) => {
    const lowerText = symptomText.toLowerCase();

    // Check for emergency keywords
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

    // Check for department keywords
    for (const [keyword, suggestion] of Object.entries(symptomKeywords)) {
      if (lowerText.includes(keyword)) {
        return { ...suggestion, isEmergency: false };
      }
    }

    return null;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const analysis = analyzeSymptom(inputValue);

      let botResponse = "";
      if (analysis?.isEmergency) {
        botResponse = `🚨 **EMERGENCY DETECTED**\n\nYour symptoms appear to be critical. Please **visit the Emergency Department immediately** or call 911.\n\nSuggested Department: **${analysis.dept}**\nUrgency: **${analysis.urgency}**\nAction Required: **${analysis.time}**`;
      } else if (analysis) {
        botResponse = `✅ Analysis Complete\n\n**Suggested Department:** ${analysis.dept}\n**Urgency Level:** ${analysis.urgency}\n**Recommended Time:** ${analysis.time}\n\nWould you like to book an appointment?`;
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
      setIsLoading(false);
    }, 800);
  };

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
            {/* Logo */}
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

            {/* Desktop Menu */}
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

            {/* Right Actions */}
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
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 min-h-screen flex flex-col">
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
              suggestions and urgency assessment
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg ${
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
                    <span className="text-gray-400 text-sm">Analyzing...</span>
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
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-400 mb-4">
              Try asking:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "I have chest pain and difficulty breathing",
                "I have a severe headache and fever",
                "I fell and hurt my ankle",
                "I have bleeding from a cut",
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(prompt);
                  }}
                  className="px-4 py-3 bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-lg text-sm text-gray-300 hover:text-cyan-400 transition text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageMinimal;
