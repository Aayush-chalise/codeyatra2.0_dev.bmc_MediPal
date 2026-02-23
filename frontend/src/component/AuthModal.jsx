import React, { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Loader,
  Heart,
  AlertCircle,
  CheckCircle,
  User,
  Lock,
  Mail,
  Phone,
} from "lucide-react";

// ── Token & User helpers ─────────────────────────────────────────────────────
const AUTH_TOKEN_KEY = "medipal_token";
const AUTH_USER_KEY = "medipal_user";

const saveAuth = (data) => {
  const token = data.token ?? data.accessToken ?? data.jwt ?? null;
  console.log(token);
  const user = {
    id: data.id ?? data.user?._id ?? data.user?.id ?? "",
    name: data.name ?? data.fullName ?? data.user?.name ?? "User",
    email: data.email ?? data.user?.email ?? "",
    phone: data.phone ?? data.user?.phone ?? "", // optional — if backend returns it
  };

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    console.warn(
      "No token received from server — user may not be authenticated",
    );
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return { ...user, token };
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

// ─────────────────────────────────────────────────────────────────────────────

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const BACKEND_URL = "http://localhost:8080";

  const colors = {
    primary: "#006d77",
    secondary: "#83c5be",
    light: "#edf6f9",
  };

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const resetState = () => {
    setErrors({});
    setSuccessMessage("");
    setLoginData({ email: "", password: "" });
    setSignupData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetState();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email))
      newErrors.email = "Please enter a valid email";
    if (!loginData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!signupData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email))
      newErrors.email = "Please enter a valid email";

    if (!signupData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[1-9]\d{7,14}$/.test(signupData.phone.replace(/\D/g, "")))
      newErrors.phone = "Please enter a valid phone number (7–15 digits)";

    if (!signupData.password) newErrors.password = "Password is required";
    else if (signupData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!signupData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (signupData.password !== signupData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Input handlers ──────────────────────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Login ───────────────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      const userData = saveAuth(data);

      setSuccessMessage("Logged in successfully! Redirecting...");
      setTimeout(() => {
        onAuthSuccess?.(userData);
        handleClose();
      }, 1000);
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Signup ──────────────────────────────────────────────────────────────────
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const payload = {
        fullName: signupData.fullName.trim(),
        email: signupData.email.trim(),
        phone: signupData.phone.trim(),
        password: signupData.password,
      };

      const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      const userData = saveAuth(data);

      setSuccessMessage("Account created successfully! Welcome to MediPal 🎉");
      setTimeout(() => {
        onAuthSuccess?.(userData);
        handleClose();
      }, 1400);
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputBaseClass =
    "w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition text-sm";

  const getInputStyle = (field) => ({
    borderColor: errors[field] ? "#dc2626" : colors.secondary,
    color: colors.primary,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: colors.light }}
      >
        {/* Header */}
        <div
          className="relative px-8 pt-8 pb-6"
          style={{ backgroundColor: colors.primary }}
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition hover:opacity-70"
            style={{ color: colors.light }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.secondary }}
            >
              <Heart className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <span
              className="text-xl font-black"
              style={{ color: colors.light }}
            >
              MediPal
            </span>
          </div>

          <h2
            className="text-2xl font-black mb-1"
            style={{ color: colors.light }}
          >
            {activeTab === "login" ? "Welcome back" : "Create your account"}
          </h2>

          <p className="text-sm opacity-75" style={{ color: colors.secondary }}>
            {activeTab === "login"
              ? "Sign in to manage your appointments"
              : "Join MediPal and take charge of your health"}
          </p>

          <div
            className="flex mt-6 rounded-xl p-1"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabSwitch(tab)}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition"
                style={
                  activeTab === tab
                    ? { backgroundColor: colors.light, color: colors.primary }
                    : { color: colors.secondary }
                }
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div className="px-8 py-6">
          {successMessage && (
            <div
              className="mb-4 flex items-center space-x-2 border-2 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(34,197,94,0.08)",
                borderColor: "#22c55e",
                color: "#15803d",
              }}
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div
              className="mb-4 flex items-center space-x-2 border-2 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(220,38,38,0.08)",
                borderColor: "#dc2626",
                color: "#991b1b",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="you@example.com"
                    className={inputBaseClass}
                    style={getInputStyle("email")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    className={inputBaseClass}
                    style={{
                      ...getInputStyle("password"),
                      paddingRight: "2.75rem",
                    }}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: colors.primary }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-semibold text-white transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    placeholder="Your full name"
                    className={inputBaseClass}
                    style={getInputStyle("fullName")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="you@example.com"
                    className={inputBaseClass}
                    style={getInputStyle("email")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    placeholder="+977 9801234567"
                    className={inputBaseClass}
                    style={getInputStyle("phone")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="Min. 8 characters"
                    className={inputBaseClass}
                    style={{
                      ...getInputStyle("password"),
                      paddingRight: "2.75rem",
                    }}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label
                  className="text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="Re-enter your password"
                    className={inputBaseClass}
                    style={{
                      ...getInputStyle("confirmPassword"),
                      paddingRight: "2.75rem",
                    }}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-semibold text-white transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <p className="text-center text-xs mt-5 text-gray-500">
            {activeTab === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                handleTabSwitch(activeTab === "login" ? "signup" : "login")
              }
              className="font-semibold hover:underline"
              style={{ color: colors.primary }}
            >
              {activeTab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
