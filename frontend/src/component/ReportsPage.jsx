import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  Loader,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const BACKEND_URL = "http://localhost:8080";
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }

    if (!patientEmail.trim()) {
      newErrors.patientEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail)) {
      newErrors.patientEmail = "Please enter a valid email";
    }

    if (selectedFiles.length === 0) {
      newErrors.files = "Please select at least one file";
    }

    if (!description.trim()) {
      newErrors.description = "Please provide a description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);

    const validatedFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(
          `File type not allowed: ${file.name}. Only PDF, JPEG, PNG are allowed.`,
        );
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File too large: ${file.name}. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validatedFiles]);
    if (errors.files) {
      setErrors((prev) => ({ ...prev, files: "" }));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setSuccessMessage("");
    setAnalysisResult(null);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("patientName", patientName);
      formData.append("patientEmail", patientEmail);
      formData.append("description", description);

      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      console.log("Uploading files...", selectedFiles);

      // Upload files to backend
      const response = await fetch(`${BACKEND_URL}/api/reports/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      setSuccessMessage("Files uploaded successfully! Analyzing reports...");

      // Analyze the uploaded reports
      await analyzeReports(data.reportId || data.id);

      // Reset form
      setTimeout(() => {
        setPatientName("");
        setPatientEmail("");
        setDescription("");
        setSelectedFiles([]);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrors({
        submit: "Failed to upload files. Please try again or contact support.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeReports = async (reportId) => {
    try {
      setIsAnalyzing(true);

      const response = await fetch(`${BACKEND_URL}/api/reports/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: reportId,
          patientName: patientName,
          patientEmail: patientEmail,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Analysis result:", result);

      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing reports:", error);
      setErrors((prev) => ({
        ...prev,
        analysis: "Failed to analyze reports. Please try again.",
      }));
    } finally {
      setIsAnalyzing(false);
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

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </button>
            <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Medical Reports Analysis
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 relative">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Upload Reports
                </span>
              </h2>
              <p className="text-gray-400">
                Upload medical reports for AI-powered analysis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (errors.patientName) {
                      setErrors((prev) => ({ ...prev, patientName: "" }));
                    }
                  }}
                  placeholder="Enter patient name"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.patientName
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isUploading}
                />
                {errors.patientName && (
                  <p className="text-xs text-red-400">{errors.patientName}</p>
                )}
              </div>

              {/* Patient Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Patient Email *
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => {
                    setPatientEmail(e.target.value);
                    if (errors.patientEmail) {
                      setErrors((prev) => ({ ...prev, patientEmail: "" }));
                    }
                  }}
                  placeholder="Enter patient email"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.patientEmail
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isUploading}
                />
                {errors.patientEmail && (
                  <p className="text-xs text-red-400">{errors.patientEmail}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Report Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }
                  }}
                  placeholder="Describe the medical reports"
                  rows="3"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition resize-none ${
                    errors.description
                      ? "border-red-400/50 focus:ring-red-400/20"
                      : "border-blue-400/20 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  }`}
                  disabled={isUploading}
                />
                {errors.description && (
                  <p className="text-xs text-red-400">{errors.description}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Upload Files *
                </label>
                <label
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition ${
                    errors.files
                      ? "border-red-400/50 bg-red-500/10"
                      : "border-cyan-400/50 bg-cyan-500/10 hover:bg-cyan-500/20"
                  }`}
                >
                  <Upload className="w-8 h-8 text-cyan-400 mb-2" />
                  <span className="text-sm font-semibold text-cyan-300">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PDF, JPEG, PNG (Max 10MB each)
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                {errors.files && (
                  <p className="text-xs text-red-400">{errors.files}</p>
                )}
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-300">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/5 border border-blue-400/20 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-300 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 p-1 hover:bg-red-500/20 rounded transition"
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isUploading || isAnalyzing}
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Analysis Results Section */}
          <section className="space-y-6">
            {analysisResult ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-cyan-400">
                    Analysis Results
                  </h3>
                  <p className="text-gray-400">
                    AI-powered analysis of your medical reports
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  {/* Summary */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-cyan-300">
                      📋 Summary
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {analysisResult.summary ||
                        "Analysis complete. Please review the detailed findings below."}
                    </p>
                  </div>

                  {/* Key Findings */}
                  {analysisResult.findings && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-cyan-300">
                        🔍 Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {(Array.isArray(analysisResult.findings)
                          ? analysisResult.findings
                          : [analysisResult.findings]
                        ).map((finding, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {finding}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysisResult.recommendations && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-cyan-300">
                        ⚕️ Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {(Array.isArray(analysisResult.recommendations)
                          ? analysisResult.recommendations
                          : [analysisResult.recommendations]
                        ).map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-cyan-400 font-bold text-sm mt-0.5">
                              →
                            </span>
                            <span className="text-sm text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risk Level */}
                  {analysisResult.riskLevel && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-cyan-300">
                        ⚠️ Risk Level
                      </h4>
                      <div
                        className={`px-4 py-2 rounded-lg font-semibold text-center ${
                          analysisResult.riskLevel === "Low"
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : analysisResult.riskLevel === "Medium"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                              : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {analysisResult.riskLevel}
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/20 transition flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                <FileText className="w-16 h-16 text-cyan-400/50" />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-gray-300">
                    No Analysis Yet
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Upload your medical reports to get AI-powered analysis and
                    recommendations
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
      `}</style>
    </div>
  );
};

export default ReportsPage;
