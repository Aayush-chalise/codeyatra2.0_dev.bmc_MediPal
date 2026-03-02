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

// Brand + accent palette — no gradients
const C = {
  primary: "#006d77",
  secondary: "#83c5be",
  light: "#edf6f9",
  ink: "#1a1a2e",
  muted: "#6b7280",
  border: "#e5e7eb",
  cardBg: "#ffffff",
  pageBg: "#f8fafb",
  amber: "#f59e0b",
  amberLight: "#fffbeb",
  amberBorder: "#fde68a",
  red: "#ef4444",
  redLight: "#fef2f2",
  redBorder: "#fecaca",
  green: "#10b981",
  greenLight: "#ecfdf5",
  greenBorder: "#a7f3d0",
  tagBg: "#e0f2f1",
  tagText: "#00564f",
};

export default function BookingStatusSection({
  appointmentData,
  onCancel,
  onReschedule,
}) {
  const [statusSteps, setStatusSteps] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const appt = appointmentData || {
    confirmationNumber: "MED-2024-00123",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialization: "Cardiologist",
    department: "Cardiology",
    doctorPhone: "+977-1-4111111",
    doctorAddress: "123 Medical St, Kathmandu",
    appointmentDate: "2025-06-15",
    appointmentTime: "10:00 AM",
    consultationType: "In-person Consultation",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    patientPhone: "+977-9800000000",
    patientAddress: "456 Home Lane, Lalitpur",
    symptoms:
      "Experiencing chest discomfort and mild shortness of breath over the past two weeks. No prior cardiac history.",
    status: "confirmed",
    createdAt: new Date(),
    automations: {
      emailSent: true,
      doctorEmailSent: true,
      smsSent: true,
      calendarAdded: false,
      remindersScheduled: true,
      adminNotified: true,
    },
  };

  useEffect(() => {
    const steps = [
      {
        id: 1,
        title: "Appointment Booked",
        description: "Your appointment has been confirmed",
        timestamp: appt.createdAt,
        completed: true,
        icon: "✓",
      },
      {
        id: 2,
        title: "Confirmation Sent",
        description: "Email sent to your address",
        timestamp: appt.createdAt,
        completed: appt.automations?.emailSent || false,
        icon: "✉",
      },
      {
        id: 3,
        title: "Appointment Day",
        description: `${appt.appointmentDate} at ${appt.appointmentTime}`,
        timestamp: new Date(`${appt.appointmentDate}T${appt.appointmentTime}`),
        completed: false,
        icon: "◎",
      },
      {
        id: 4,
        title: "Consultation Complete",
        description: "After your visit",
        timestamp: null,
        completed: appt.status === "completed",
        icon: "⬤",
      },
    ];
    setStatusSteps(steps);

    const tick = () => {
      const dt = new Date(`${appt.appointmentDate}T${appt.appointmentTime}`);
      const diff = dt - new Date();
      if (diff <= 0) {
        setTimeRemaining("Appointment time has passed");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeRemaining(
        d > 0
          ? `${d}d ${h}h ${m}m away`
          : h > 0
            ? `${h}h ${m}m away`
            : `${m}m away`,
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const handleShare = () => {
    const text = `Appointment with ${appt.doctorName} on ${appt.appointmentDate} at ${appt.appointmentTime}. Ref: ${appt.confirmationNumber}`;
    if (navigator.share) navigator.share({ title: "Appointment", text });
    else {
      navigator.clipboard?.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const card = {
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: "1.75rem",
  };
  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .bss-root { font-family: 'DM Sans', sans-serif; background: ${C.pageBg}; min-height: 100vh; color: ${C.ink}; }
        .bss-root a { text-decoration: none; }
        .bss-btn {
          font-family: 'DM Sans', sans-serif; cursor: pointer; border-radius: 10px;
          font-weight: 600; font-size: 14px; display: flex; align-items: center;
          justify-content: center; gap: 8px; width: 100%; padding: 11px 16px;
          transition: filter 0.15s, transform 0.1s, box-shadow 0.15s;
          border: 1.5px solid transparent;
        }
        .bss-btn:hover { filter: brightness(0.95); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .bss-btn:active { transform: translateY(0); filter: brightness(0.9); }
        .bss-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .bss-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        @media (max-width: 900px) { .bss-main-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .bss-grid { grid-template-columns: 1fr; } }
        textarea:focus { outline: 2px solid ${C.primary}; border-color: ${C.primary}; }
        .pulse-dot { animation: pulse-ring 2s ease-in-out infinite; }
        @keyframes pulse-ring {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,109,119,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(0,109,119,0); }
        }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div className="bss-root">
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}
        >
          {/* ── Top Banner ── */}
          <div
            style={{
              ...card,
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              borderLeft: `5px solid ${C.primary}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: C.greenLight,
                  border: `1.5px solid ${C.greenBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={24} color={C.green} />
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 800,
                    color: C.ink,
                  }}
                >
                  Appointment Confirmed!
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: C.muted,
                    marginTop: 2,
                  }}
                >
                  Your booking is confirmed and reminders have been sent.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: C.tagBg,
                  color: C.tagText,
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1.5px solid ${C.secondary}`,
                }}
              >
                {appt.status?.toUpperCase() || "CONFIRMED"}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: C.amberLight,
                  border: `1.5px solid ${C.amberBorder}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                }}
              >
                <Clock size={14} color={C.amber} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>
                  {timeRemaining}
                </span>
              </div>
            </div>
          </div>

          <div className="bss-main-grid">
            {/* ── LEFT COLUMN ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Confirmation + Timeline */}
              <div style={card}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  <div>
                    <p style={sectionLabel}>Confirmation Number</p>
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 22,
                        fontWeight: 500,
                        color: C.primary,
                        margin: 0,
                        letterSpacing: 2,
                      }}
                    >
                      {appt.confirmationNumber}
                    </p>
                  </div>
                  <div
                    style={{
                      background: C.light,
                      border: `1.5px solid ${C.secondary}`,
                      borderRadius: 10,
                      padding: "8px 14px",
                      textAlign: "right",
                    }}
                  >
                    <p style={{ ...sectionLabel, marginBottom: 2 }}>
                      Booked on
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.ink,
                        margin: 0,
                      }}
                    >
                      {new Date(appt.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    ...sectionLabel,
                    color: C.primary,
                    marginBottom: "1.25rem",
                  }}
                >
                  Booking Progress
                </p>
                <div>
                  {statusSteps.map((step, i) => {
                    const isNext =
                      i === statusSteps.findIndex((s) => !s.completed);
                    const isDone = step.completed;
                    return (
                      <div key={step.id} style={{ display: "flex", gap: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className={isNext ? "pulse-dot" : ""}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 700,
                              background: isDone
                                ? C.primary
                                : isNext
                                  ? C.light
                                  : "#f3f4f6",
                              border: `2px solid ${isDone ? C.primary : isNext ? C.primary : C.border}`,
                              color: isDone
                                ? "#fff"
                                : isNext
                                  ? C.primary
                                  : C.muted,
                            }}
                          >
                            {isDone ? (
                              <CheckCircle size={16} color="#fff" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div
                              style={{
                                width: 2,
                                flex: 1,
                                minHeight: 32,
                                margin: "4px 0",
                                background: isDone ? C.primary : C.border,
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            paddingTop: 6,
                            paddingBottom: i < statusSteps.length - 1 ? 16 : 0,
                            flex: 1,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              fontWeight: 700,
                              color: isDone
                                ? C.primary
                                : isNext
                                  ? C.ink
                                  : C.muted,
                            }}
                          >
                            {step.title}
                          </p>
                          <p
                            style={{
                              margin: "3px 0 0",
                              fontSize: 13,
                              color: C.muted,
                            }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Appointment Details Grid */}
              <div style={card}>
                <p
                  style={{
                    ...sectionLabel,
                    color: C.primary,
                    marginBottom: "1.25rem",
                  }}
                >
                  Appointment Details
                </p>
                <div className="bss-grid">
                  <DetailBlock
                    title="Doctor"
                    icon={<User size={15} color={C.primary} />}
                  >
                    <DetailRow label="Name" value={appt.doctorName} large />
                    <DetailRow
                      label="Specialization"
                      value={appt.doctor.specialization}
                    />
                    <DetailRow label="Department" value={appt.department} />
                    <a
                      href={`tel:${appt.doctorPhone}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: C.primary,
                        fontSize: 13,
                        fontWeight: 600,
                        marginTop: 8,
                        paddingTop: 10,
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      <Phone size={13} /> {appt.doctorPhone}
                    </a>
                  </DetailBlock>

                  <DetailBlock
                    title="Schedule"
                    icon={<Calendar size={15} color={C.primary} />}
                  >
                    <DetailRow
                      label="Date"
                      value={new Date(appt.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                      large
                    />
                    <DetailRow
                      label="Time"
                      value={appt.appointmentTime}
                      large
                    />
                    <DetailRow
                      label="Visit Type"
                      value={appt.consultationType}
                    />
                  </DetailBlock>

                  <DetailBlock
                    title="Patient"
                    icon={<User size={15} color={C.primary} />}
                  >
                    <DetailRow label="Name" value={appt.patientName} large />
                    <DetailRow label="Email" value={appt.patientEmail} />
                    <DetailRow label="Phone" value={appt.patientPhone} />
                  </DetailBlock>

                  <DetailBlock
                    title="Location"
                    icon={<MapPin size={15} color={C.primary} />}
                  >
                    <DetailRow label="Clinic" value={appt.doctorAddress} />
                    <DetailRow
                      label="Your Address"
                      value={appt.patientAddress}
                    />
                  </DetailBlock>
                </div>
              </div>

              {/* Chief Complaint */}
              <div style={card}>
                <p
                  style={{
                    ...sectionLabel,
                    color: C.primary,
                    marginBottom: "0.75rem",
                  }}
                >
                  Chief Complaint
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: C.ink,
                    lineHeight: 1.8,
                    background: C.pageBg,
                    padding: "1rem",
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {appt.symptoms}
                </p>
              </div>

              {/* Automations */}
              <div style={{ ...card, borderLeft: `5px solid ${C.green}` }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: "1.25rem",
                  }}
                >
                  <CheckCircle size={18} color={C.green} />
                  <p style={{ ...sectionLabel, margin: 0, color: C.green }}>
                    Automation Status
                  </p>
                </div>
                <div className="bss-grid">
                  {[
                    {
                      name: "Confirmation Email",
                      icon: "✉️",
                      status: appt.automations?.emailSent,
                    },
                    {
                      name: "Doctor Notification",
                      icon: "📧",
                      status: appt.automations?.doctorEmailSent,
                    },
                    {
                      name: "SMS Reminder",
                      icon: "📱",
                      status: appt.automations?.smsSent,
                    },
                    {
                      name: "Calendar Event",
                      icon: "📅",
                      status: appt.automations?.calendarAdded,
                    },
                    {
                      name: "Reminders Scheduled",
                      icon: "⏰",
                      status: appt.automations?.remindersScheduled,
                    },
                    {
                      name: "Admin Notified",
                      icon: "🔔",
                      status: appt.automations?.adminNotified,
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: a.status ? C.greenLight : C.amberLight,
                        border: `1px solid ${a.status ? C.greenBorder : C.amberBorder}`,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.ink,
                        }}
                      >
                        {a.name}
                      </span>
                      {a.status ? (
                        <CheckCircle size={16} color={C.green} />
                      ) : (
                        <AlertCircle size={16} color={C.amber} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Quick Actions */}
              <div
                style={{ ...card, position: "sticky", top: 16 }}
                className="no-print"
              >
                <p
                  style={{
                    ...sectionLabel,
                    marginBottom: "1rem",
                    color: C.primary,
                  }}
                >
                  Quick Actions
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <button
                    className="bss-btn"
                    style={{
                      background: C.light,
                      borderColor: C.secondary,
                      color: C.primary,
                    }}
                    onClick={() => window.print()}
                  >
                    <Printer size={16} /> Print Confirmation
                  </button>
                  <button
                    className="bss-btn"
                    style={{
                      background: "#f5f3ff",
                      borderColor: "#c4b5fd",
                      color: "#6d28d9",
                    }}
                    onClick={() => {}}
                  >
                    <Download size={16} /> Download PDF
                  </button>
                  <button
                    className="bss-btn"
                    style={{
                      background: "#eff6ff",
                      borderColor: "#bfdbfe",
                      color: "#1d4ed8",
                    }}
                    onClick={handleShare}
                  >
                    <Share2 size={16} /> Share Booking
                  </button>
                  <div
                    style={{ height: 1, background: C.border, margin: "4px 0" }}
                  />
                  <button
                    className="bss-btn"
                    style={{
                      background: C.pageBg,
                      borderColor: C.border,
                      color: C.ink,
                    }}
                    onClick={onReschedule}
                  >
                    <Edit size={16} /> Reschedule
                  </button>
                  <button
                    className="bss-btn"
                    style={{
                      background: C.redLight,
                      borderColor: C.redBorder,
                      color: C.red,
                    }}
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <X size={16} /> Cancel Appointment
                  </button>
                </div>
              </div>

              {/* Important Notes */}
              <div style={{ ...card, borderLeft: `5px solid ${C.amber}` }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: "1rem",
                  }}
                >
                  <AlertCircle size={17} color={C.amber} />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.amber,
                      letterSpacing: 0.5,
                    }}
                  >
                    BEFORE YOU ARRIVE
                  </p>
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {[
                    "Arrive 10 minutes early",
                    "Bring valid ID and medical records",
                    "Cancel 24 hours ahead to avoid charges",
                    "Check email for reminders",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        fontSize: 13,
                        color: C.ink,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: C.amberLight,
                          border: `1px solid ${C.amberBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.amber,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div style={card}>
                <p
                  style={{
                    ...sectionLabel,
                    color: C.primary,
                    marginBottom: "0.75rem",
                  }}
                >
                  Need Help?
                </p>
                <p style={{ fontSize: 13, color: C.muted, margin: "0 0 12px" }}>
                  Reach out for any booking issues:
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <a
                    href="mailto:support@medipal.com"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: C.ink,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: C.light,
                        border: `1px solid ${C.secondary}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={15} color={C.primary} />
                    </div>
                    support@medipal.com
                  </a>
                  <a
                    href="tel:+977-1-4123456"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: C.ink,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: C.light,
                        border: `1px solid ${C.secondary}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={15} color={C.primary} />
                    </div>
                    +977-1-4123456
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: C.cardBg,
              borderRadius: 20,
              maxWidth: 460,
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: C.redLight,
                    border: `1px solid ${C.redBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertCircle size={20} color={C.red} />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: C.ink,
                    }}
                  >
                    Cancel Appointment?
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCancelDialog(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.muted,
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: C.amberLight,
                  border: `1px solid ${C.amberBorder}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 13,
                  color: C.ink,
                }}
              >
                ⚠️ Cancelling within 24 hours may incur a cancellation fee.
              </div>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.ink,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Reason (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tell us why you're cancelling..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: C.pageBg,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 10,
                    color: C.ink,
                    fontSize: 13,
                    resize: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="bss-btn"
                  style={{
                    background: C.pageBg,
                    borderColor: C.border,
                    color: C.ink,
                  }}
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Appointment
                </button>
                <button
                  className="bss-btn"
                  style={{
                    background: C.redLight,
                    borderColor: C.redBorder,
                    color: C.red,
                  }}
                  onClick={() => {
                    onCancel?.(cancelReason);
                    setShowCancelDialog(false);
                  }}
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailBlock({ title, icon, children }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "#edf6f9",
            border: "1px solid #83c5be",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#006d77",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          background: "#f8fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, large }) {
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "#9ca3af",
          textTransform: "uppercase",
          margin: "0 0 2px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: large ? 14 : 13,
          fontWeight: large ? 700 : 500,
          color: "#1a1a2e",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}
