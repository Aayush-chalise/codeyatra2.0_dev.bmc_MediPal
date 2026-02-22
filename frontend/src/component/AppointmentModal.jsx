import React, { useState } from "react";
import { X, Loader } from "lucide-react";

const AppointmentModal = ({ doctor, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      // Call the onSubmit callback with form data and doctor info
      await onSubmit({
        ...formData,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
      });

      setSuccessMessage("Appointment booked successfully!");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          userName: "",
          userEmail: "",
          userPhone: "",
          userAddress: "",
        });
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrors({ submit: "Failed to book appointment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !doctor) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 border border-blue-500/20 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
              <div className="text-3xl">{doctor.image}</div>
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
            <div className="bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-lg text-sm">
              ✓ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm">
              ✗ {errors.submit}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
                rows="3"
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
