import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  AlertCircle,
  Download,
  Share2,
  Edit,
  X,
  Printer,
} from "lucide-react";

const BookingStatusSection = ({ appointmentData, onCancel, onReschedule }) => {
  const [statusSteps, setStatusSteps] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    // Generate status steps
    generateStatusSteps();

    // Calculate time remaining
    const timer = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(timer);
  }, [appointmentData]);

  const generateStatusSteps = () => {
    const steps = [
      {
        id: 1,
        title: "Appointment Booked",
        description: "Your appointment has been confirmed",
        timestamp: appointmentData?.createdAt || new Date(),
        completed: true,
        icon: "✓",
      },
      {
        id: 2,
        title: "Confirmation Sent",
        description: "Confirmation email sent to your email address",
        timestamp: appointmentData?.createdAt || new Date(),
        completed: appointmentData?.automations?.emailSent || false,
        icon: "✉️",
      },
      {
        id: 3,
        title: "Appointment Day",
        description: `${appointmentData?.appointmentDate} at ${appointmentData?.appointmentTime}`,
        timestamp: new Date(
          `${appointmentData?.appointmentDate}T${appointmentData?.appointmentTime}`,
        ),
        completed: false,
        icon: "📅",
      },
      {
        id: 4,
        title: "Appointment Completed",
        description: "After your consultation",
        timestamp: null,
        completed: appointmentData?.status === "completed",
        icon: "🏁",
      },
    ];

    setStatusSteps(steps);
  };

  const calculateTimeRemaining = () => {
    const appointmentDateTime = new Date(
      `${appointmentData?.appointmentDate}T${appointmentData?.appointmentTime}`,
    );
    const now = new Date();
    const diff = appointmentDateTime - now;

    if (diff <= 0) {
      setTimeRemaining("Appointment time has passed");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h ${minutes}m remaining`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    } else {
      setTimeRemaining(`${minutes}m remaining`);
    }
  };

  const getStatusColor = () => {
    if (appointmentData?.status === "confirmed") return "green";
    if (appointmentData?.status === "cancelled") return "red";
    if (appointmentData?.status === "completed") return "blue";
    return "yellow";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Implementation for PDF download
    console.log("Download PDF");
  };

  const handleShare = () => {
    const shareText = `I have booked an appointment with Dr. ${appointmentData?.doctorName} on ${appointmentData?.appointmentDate} at ${appointmentData?.appointmentTime} via MediPal. Confirmation: ${appointmentData?.confirmationNumber}`;

    if (navigator.share) {
      navigator.share({
        title: "Appointment Booking",
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Appointment details copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 relative">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300 font-medium">
              Booking Confirmed
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            Appointment
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Confirmed!
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your appointment has been successfully booked. Please save your
            confirmation number for future reference.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side (2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
              {/* Confirmation Number */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-400">
                  CONFIRMATION NUMBER
                </h2>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-4">
                  <p className="text-2xl font-black text-white tracking-wider">
                    {appointmentData?.confirmationNumber}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Save this number for your records
                </p>
              </div>

              {/* Status Timeline */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-cyan-300">
                  Booking Status
                </h3>

                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex space-x-4">
                      {/* Timeline Circle */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            step.completed
                              ? "bg-green-500/20 border-2 border-green-400 text-green-400"
                              : index ===
                                  statusSteps.findIndex((s) => !s.completed)
                                ? "bg-yellow-500/20 border-2 border-yellow-400 text-yellow-400 animate-pulse"
                                : "bg-gray-500/20 border-2 border-gray-500 text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Connector Line */}
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-16 my-2 ${
                              step.completed ? "bg-green-400" : "bg-gray-500"
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-1 pt-1">
                        <h4
                          className={`font-bold ${
                            step.completed
                              ? "text-green-400"
                              : index ===
                                  statusSteps.findIndex((s) => !s.completed)
                                ? "text-yellow-400"
                                : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-cyan-300">
                Appointment Details
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Doctor Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Doctor Information</span>
                  </h3>

                  <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-blue-400/20">
                    <div>
                      <p className="text-xs text-gray-400">DOCTOR NAME</p>
                      <p className="text-lg font-bold text-white">
                        {appointmentData?.doctorName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">SPECIALIZATION</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.doctorSpecialization}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">DEPARTMENT</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.department}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      <a
                        href={`tel:${appointmentData?.doctorPhone}`}
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        {appointmentData?.doctorPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>When & Where</span>
                  </h3>

                  <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-blue-400/20">
                    <div>
                      <p className="text-xs text-gray-400">DATE</p>
                      <p className="text-lg font-bold text-white">
                        {new Date(
                          appointmentData?.appointmentDate,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">TIME</p>
                      <p className="text-lg font-bold text-white">
                        {appointmentData?.appointmentTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">TYPE</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.consultationType}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-300">
                        {timeRemaining}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Your Information</span>
                  </h3>

                  <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-blue-400/20">
                    <div>
                      <p className="text-xs text-gray-400">NAME</p>
                      <p className="text-sm font-semibold text-white">
                        {appointmentData?.patientName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">EMAIL</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.patientEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">PHONE</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.patientPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Location</span>
                  </h3>

                  <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-blue-400/20">
                    <div>
                      <p className="text-xs text-gray-400">CLINIC ADDRESS</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.doctorAddress}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">PATIENT ADDRESS</p>
                      <p className="text-sm text-gray-300">
                        {appointmentData?.patientAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms/Reason */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-cyan-300">
                Chief Complaint
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {appointmentData?.symptoms}
              </p>
            </div>

            {/* Automations Status */}
            {appointmentData?.automations && (
              <div className="bg-gradient-to-br from-green-900/40 to-slate-900/40 backdrop-blur-xl border border-green-400/20 rounded-2xl p-8 space-y-4">
                <h3 className="text-lg font-semibold text-green-300 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Automations Completed</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Confirmation Email",
                      icon: "✉️",
                      status: appointmentData.automations.emailSent,
                    },
                    {
                      name: "Doctor Notification",
                      icon: "📧",
                      status: appointmentData.automations.doctorEmailSent,
                    },
                    {
                      name: "SMS Reminder",
                      icon: "📱",
                      status: appointmentData.automations.smsSent,
                    },
                    {
                      name: "Calendar Event",
                      icon: "📅",
                      status: appointmentData.automations.calendarAdded,
                    },
                    {
                      name: "Reminders Scheduled",
                      icon: "⏰",
                      status: appointmentData.automations.remindersScheduled,
                    },
                    {
                      name: "Admin Notified",
                      icon: "🔔",
                      status: appointmentData.automations.adminNotified,
                    },
                  ].map((automation, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-2xl">{automation.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-300">
                          {automation.name}
                        </p>
                      </div>
                      {automation.status ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side (1 column) */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 sticky top-20">
              <h3 className="text-lg font-bold text-cyan-300">Quick Actions</h3>

              <button
                onClick={handlePrint}
                className="w-full px-4 py-3 bg-blue-500/20 border border-blue-400/30 rounded-lg font-semibold text-blue-300 hover:bg-blue-500/30 transition flex items-center justify-center space-x-2"
              >
                <Printer className="w-5 h-5" />
                <span>Print Confirmation</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="w-full px-4 py-3 bg-purple-500/20 border border-purple-400/30 rounded-lg font-semibold text-purple-300 hover:bg-purple-500/30 transition flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full px-4 py-3 bg-pink-500/20 border border-pink-400/30 rounded-lg font-semibold text-pink-300 hover:bg-pink-500/30 transition flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Booking</span>
              </button>

              {appointmentData?.status === "confirmed" && (
                <>
                  <button
                    onClick={onReschedule}
                    className="w-full px-4 py-3 bg-cyan-500/20 border border-cyan-400/30 rounded-lg font-semibold text-cyan-300 hover:bg-cyan-500/30 transition flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="w-full px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-lg font-semibold text-red-300 hover:bg-red-500/30 transition flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel Appointment</span>
                  </button>
                </>
              )}
            </div>

            {/* Important Information */}
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-yellow-300 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Important Information</span>
              </h3>

              <ul className="space-y-2 text-sm text-yellow-200">
                <li className="flex items-start space-x-2">
                  <span className="text-lg">→</span>
                  <span>Arrive 10 minutes before your appointment time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-lg">→</span>
                  <span>Bring valid ID and medical documents if needed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-lg">→</span>
                  <span>
                    Cancel 24 hours before to avoid cancellation charges
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-lg">→</span>
                  <span>Check your email for confirmation and reminders</span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-cyan-300">Need Help?</h3>

              <div className="space-y-3 text-sm">
                <p className="text-gray-400">
                  For any questions or issues with your booking:
                </p>

                <a
                  href="mailto:support@medipal.com"
                  className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@medipal.com</span>
                </a>

                <a
                  href="tel:+977-1-4123456"
                  className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>+977-1-4123456</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 border border-red-400/20 rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-red-400/10">
              <h2 className="text-2xl font-bold text-white">
                Cancel Appointment?
              </h2>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-300">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you're cancelling..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-400/50 focus:ring-2 focus:ring-red-400/20 transition resize-none"
                  rows="3"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10 transition"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={() => {
                    onCancel(cancelReason);
                    setShowCancelDialog(false);
                  }}
                  className="flex-1 px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-lg font-semibold text-red-300 hover:bg-red-500/30 transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        @media print {
          .fixed,
          button,
          .sticky {
            display: none;
          }
          body {
            background: white;
            color: black;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingStatusSection;
