import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { IMAGES, handleImageError } from "../assets/images";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#F1D2DB] shadow-soft-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Visual Hero */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-[#FFF5F7] via-[#FDF2F4] to-[#F3EEFA]">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TNEA Admissions 2026</span>
            </div>
            <h2 className="text-2xl font-black text-[#372B2E] tracking-tight leading-snug">
              SMART COLLEGE ADMISSION COUNSELOR
            </h2>
            <p className="text-xs text-[#6E5D63] leading-relaxed">
              Your AI-powered guide to Tamil Nadu Engineering Admissions. Designed
              exclusively for State Board and CBSE students.
            </p>
          </div>

          {/* Student Imagery */}
          <div className="relative rounded-2xl overflow-hidden shadow-soft-md my-6 border border-[#F1D2DB]">
            <img
              src={IMAGES.loginStudent}
              alt="Engineering College Student"
              onError={(e) => handleImageError(e, IMAGES.campusGeneric)}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
              <span className="text-xs font-semibold block">Find your dream engineering campus</span>
              <span className="text-[10px] text-pink-200">Anna University • Premier Autonomous Institutions</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#6E5D63]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#D85A7F]" />
              <span>Instant TNEA Cutoff Calculation (/200)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#D85A7F]" />
              <span>Machine Learning-based Admission Likelihood</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#D85A7F]" />
              <span>Verified Fees, Hostel & Placement Disclosures</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center mx-auto md:mx-0 mb-3 shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-[#372B2E] tracking-tight">
              Student Login
            </h1>
            <p className="text-xs text-[#6E5D63] mt-1">
              Enter your email and password to access your counselor dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E7E84] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] focus:bg-white text-[#372B2E] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E7E84] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] focus:bg-white text-[#372B2E] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] shadow-soft-sm hover:shadow-soft-md transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Logging in..." : "Log In to Counselor"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F1D2DB] text-center text-xs text-[#6E5D63]">
            <span>New Tamil Nadu engineering aspirant? </span>
            <Link to="/register" className="font-bold text-[#D85A7F] hover:underline">
              Create Student Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
