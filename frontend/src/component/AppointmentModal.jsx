import React, { useState } from "react";
import { X, Loader, AlertCircle, CheckCircle } from "lucide-react";

const AppointmentModal = ({ doctor, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
    appointmentDate: "",
    consultationType: "In-person",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const BACKEND_URL = "http://localhost:8080";

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    return today.toISOString().split("T")[0];
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email";
    }

    if (!formData.userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    } else if (
      !/^\+?[1-9]\d{1,14}$/.test(formData.userPhone.replace(/\s/g, ""))
    ) {
      newErrors.userPhone = "Please enter a valid phone number";
    }

    if (!formData.userAddress.trim()) {
      newErrors.userAddress = "Address is required";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const generateConfirmationNumber = () => {
    return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  // Send appointment data to backend
  const sendToBackend = async (appointmentData) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/schedule/availableSlots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        },
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend Response:", data);
      return data;
    } catch (error) {
      console.error("Error sending to backend:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const confirmNum = generateConfirmationNumber();
      setConfirmationNumber(confirmNum);

      // Prepare appointment data to send to backend
      const appointmentData = {
        // User Information
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        userAddress: formData.userAddress,

        // Appointment Information
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        consultationType: formData.consultationType,
        symptoms: formData.symptoms,

        // Doctor Information
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        doctorPhone: doctor.phone,
        doctorAddress: doctor.address,
        doctorDepartment: doctor.department,
        doctorFee: doctor.fee,
        doctorSpecialization: doctor.specialization,
        doctorExperience: doctor.experience,

        // Appointment Meta Information
        confirmationNumber: confirmNum,
        appointmentId: `APT-${Date.now()}`,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}`,
      };

      console.log("Sending to backend:", appointmentData);

      // Send to backend
      const backendResponse = await sendToBackend(appointmentData);

      // Call the onSubmit callback (for updating chat/UI)
      await onSubmit(appointmentData);

      setSuccessMessage("Appointment booked successfully!");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          userName: "",
          userEmail: "",
          userPhone: "",
          userAddress: "",
          appointmentDate: "",
          appointmentTime: "",
          consultationType: "In-person",
          symptoms: "",
        });
        setSuccessMessage("");
        setConfirmationNumber("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrors({
        submit:
          "Failed to book appointment. Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !doctor) {
    return null;
  }

  const minDate = getTodayDate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 border border-blue-500/20 rounded-2xl shadow-2xl max-w-lg w-full my-8">
        {/* Modal Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-blue-500/10 bg-gradient-to-r from-slate-800 to-blue-900">
          <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Doctor Info Card */}
          <div className="bg-white/5 border border-blue-400/20 rounded-xl p-4 space-y-3">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{doctor.image}</div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-cyan-400">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-400">{doctor.specialization}</p>
                <p className="text-xs text-gray-500">
                  {doctor.department} • {doctor.experience} experience
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-cyan-400">{doctor.fee}</p>
                <p className="text-xs text-gray-400">per consultation</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">✓ {successMessage}</p>
                {confirmationNumber && (
                  <p className="text-xs mt-1">
                    Confirmation: <strong>{confirmationNumber}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section: Patient Information */}
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">
                📋 Patient Information
              </h3>

              {/* Full Name */}
              <div className="space-y-2 mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.userName
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.userName && (
                  <p className="text-xs text-red-400">{errors.userName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.userEmail
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.userEmail && (
                  <p className="text-xs text-red-400">{errors.userEmail}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2 mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., +977-9801234567"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.userPhone
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.userPhone && (
                  <p className="text-xs text-red-400">{errors.userPhone}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Address *
                </label>
                <textarea
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  rows="2"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition resize-none ${
                    errors.userAddress
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.userAddress && (
                  <p className="text-xs text-red-400">{errors.userAddress}</p>
                )}
              </div>
            </div>

            {/* Section: Appointment Information */}
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">
                📅 Appointment Details
              </h3>

              {/* Appointment Date */}
              <div className="space-y-2 mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={minDate}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                    errors.appointmentDate
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isSubmitting}
                />
                {formData.appointmentDate && (
                  <p className="text-xs text-gray-400">
                    📅{" "}
                    {new Date(formData.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                )}
                {errors.appointmentDate && (
                  <p className="text-xs text-red-400">
                    {errors.appointmentDate}
                  </p>
                )}
              </div>

              {/* Consultation Type */}
              <div className="space-y-2 mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Consultation Type
                </label>
                <div className="flex gap-4">
                  {["In-person", "Video Call"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="consultationType"
                        value={type}
                        checked={formData.consultationType === type}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Confirm Booking</span>
                )}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 text-center">
            By booking, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
