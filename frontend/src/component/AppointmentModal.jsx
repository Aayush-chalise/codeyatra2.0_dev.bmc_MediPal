import React, { useState } from "react";
import { X, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppointmentModal = ({ doctor, isOpen, onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "In-person",
    symptoms: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const BACKEND_URL = "http://localhost:8080";

  // Color palette
  const colors = {
    primary: "#006d77", // Dark teal
    secondary: "#83c5be", // Light teal
    light: "#edf6f9", // Very light blue
  };

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

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Appointment time is required";
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = "Please describe your symptoms";
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
    return `APT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
  };

  // Send appointment data to backend
  const sendToBackend = async (appointmentData) => {
    try {
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
      console.log("Received from backend:", backendResponse);

      // Call the onSubmit callback (for updating chat/UI)
      await onSubmit(appointmentData);

      setSuccessMessage("Appointment booked successfully!");

      // Reset form after 1.5 seconds
      setTimeout(() => {
        // Navigate to booking status page with appointment ID
        navigate(`/booking/${appointmentData.appointmentId}`, {
          state: { appointmentData },
        });

        // Close modal
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
      <div
        className="border-2 rounded-2xl shadow-2xl max-w-lg w-full my-8"
        style={{
          backgroundColor: colors.light,
          borderColor: colors.secondary,
        }}
      >
        {/* Modal Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b-2"
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.secondary,
            color: colors.light,
          }}
        >
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition hover:opacity-80"
            disabled={isSubmitting}
            style={{ color: colors.light }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Doctor Info Card */}
          <div
            className="border-2 rounded-xl p-4 space-y-3"
            style={{
              backgroundColor: colors.light,
              borderColor: colors.secondary,
            }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{doctor.image}</div>
              <div className="flex-1 space-y-1">
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
                <p className="text-xs text-gray-600">
                  {doctor.department} • {doctor.experience} experience
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-lg font-bold"
                  style={{ color: colors.secondary }}
                >
                  {doctor.fee}
                </p>
                <p className="text-xs text-gray-600">per consultation</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              className="border-2 px-4 py-3 rounded-lg text-sm flex items-center space-x-2"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderColor: "#22c55e",
                color: "#16a34a",
              }}
            >
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
            <div
              className="border-2 px-4 py-3 rounded-lg text-sm flex items-center space-x-2"
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                borderColor: "#dc2626",
                color: "#991b1b",
              }}
            >
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section: Patient Information */}
            <div
              className="border-b-2 pb-4"
              style={{ borderColor: colors.secondary }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: colors.primary }}
              >
                📋 Patient Information
              </h3>

              {/* Full Name */}
              <div className="space-y-2 mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.userName ? "#dc2626" : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {errors.userName && (
                  <p className="text-xs text-red-600">{errors.userName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.userEmail
                      ? "#dc2626"
                      : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {errors.userEmail && (
                  <p className="text-xs text-red-600">{errors.userEmail}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2 mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., +977-9801234567"
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.userPhone
                      ? "#dc2626"
                      : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {errors.userPhone && (
                  <p className="text-xs text-red-600">{errors.userPhone}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Address *
                </label>
                <textarea
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  rows="2"
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                  style={{
                    borderColor: errors.userAddress
                      ? "#dc2626"
                      : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {errors.userAddress && (
                  <p className="text-xs text-red-600">{errors.userAddress}</p>
                )}
              </div>
            </div>

            {/* Section: Appointment Information */}
            <div
              className="border-b-2 pb-4"
              style={{ borderColor: colors.secondary }}
            >
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: colors.primary }}
              >
                📅 Appointment Details
              </h3>

              {/* Appointment Date */}
              <div className="space-y-2 mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Appointment Date *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={minDate}
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.appointmentDate
                      ? "#dc2626"
                      : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {formData.appointmentDate && (
                  <p className="text-xs text-gray-600">
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
                  <p className="text-xs text-red-600">
                    {errors.appointmentDate}
                  </p>
                )}
              </div>

              {/* Appointment Time */}
              <div className="space-y-2 mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Appointment Time *
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.appointmentTime
                      ? "#dc2626"
                      : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {formData.appointmentTime && (
                  <p className="text-xs text-gray-600">
                    🕐 {formData.appointmentTime}
                  </p>
                )}
                {errors.appointmentTime && (
                  <p className="text-xs text-red-600">
                    {errors.appointmentTime}
                  </p>
                )}
              </div>

              {/* Consultation Type */}
              <div className="space-y-2 mb-3">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
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
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.primary }}
                      >
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Symptoms / Chief Complaint *
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your symptoms or reason for visit"
                  rows="3"
                  className="w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                  style={{
                    borderColor: errors.symptoms ? "#dc2626" : colors.secondary,
                    color: colors.primary,
                  }}
                  disabled={isSubmitting}
                />
                {errors.symptoms && (
                  <p className="text-xs text-red-600">{errors.symptoms}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 rounded-lg font-semibold transition hover:opacity-80"
                style={{
                  borderColor: colors.secondary,
                  color: colors.primary,
                  backgroundColor: "white",
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary }}
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

          <p className="text-xs text-gray-600 text-center">
            By booking, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
