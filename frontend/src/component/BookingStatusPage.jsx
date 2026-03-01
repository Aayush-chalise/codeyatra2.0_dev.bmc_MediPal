import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingStatusSection from "../sections/BookingStatusSection";
import { Loader, AlertCircle } from "lucide-react";

const BookingStatusPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = "http://localhost:8080";

  useEffect(() => {
    fetchAppointmentData();
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/appointments/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("medipal_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment data");
      }

      const data = await response.json();
      console.log(data);
      setAppointmentData(data.appointments);
    } catch (err) {
      console.error("Error fetching appointment:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (reason) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          cancellationReason: reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      const data = await response.json();
      alert("Appointment cancelled successfully");
      setAppointmentData((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment: " + err.message);
    }
  };

  const handleReschedule = () => {
    navigate(`/reschedule/${appointmentId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <p className="text-lg text-gray-400">
            Loading appointment details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !appointmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-lg text-red-400">
            {error || "Appointment not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-cyan-500 rounded-lg font-semibold text-white hover:bg-cyan-600 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookingStatusSection
      appointmentData={appointmentData}
      onCancel={handleCancel}
      onReschedule={handleReschedule}
    />
  );
};

export default BookingStatusPage;
