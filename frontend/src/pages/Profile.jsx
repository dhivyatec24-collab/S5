import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { studentAPI } from "../services/api";
import {
  User,
  Calculator,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  MapPin,
  IndianRupee,
  Home
} from "lucide-react";

const ENGINEERING_BRANCHES = [
  "Computer Science and Engineering",
  "Information Technology",
  "Artificial Intelligence and Data Science",
  "Artificial Intelligence and Machine Learning",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Cyber Security",
  "Biomedical Engineering",
  "Robotics and Automation"
];

const TN_DISTRICTS = [
  "All",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Erode",
  "Salem",
  "Tirunelveli",
  "Chengalpattu",
  "Kanchipuram"
];

const COMMUNITIES = ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"];

export default function Profile() {
  const { user, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    board: "Tamil Nadu State Board",
    maths: 95,
    physics: 90,
    chemistry: 92,
    preferred_branch: "Computer Science and Engineering",
    preferred_district: "All",
    budget: 120000,
    hostel_required: true,
    community: "BC",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        board: user.board || "Tamil Nadu State Board",
        maths: user.maths || 95,
        physics: user.physics || 90,
        chemistry: user.chemistry || 92,
        preferred_branch: user.preferred_branch || "Computer Science and Engineering",
        preferred_district: user.preferred_district || "All",
        budget: user.budget || 120000,
        hostel_required: Boolean(user.hostel_required),
        community: user.community || "BC",
      });
    }
  }, [user]);

  const m = parseFloat(formData.maths) || 0;
  const p = parseFloat(formData.physics) || 0;
  const c = parseFloat(formData.chemistry) || 0;
  const liveCutoff = (m + p / 2 + c / 2).toFixed(2);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await studentAPI.updateProfile({
        name: formData.name,
        board: formData.board,
        maths: m,
        physics: p,
        chemistry: c,
        preferred_branch: formData.preferred_branch,
        preferred_district: formData.preferred_district,
        budget: Number(formData.budget),
        hostel_required: formData.hostel_required ? 1 : 0,
        community: formData.community,
      });

      await refreshProfile();
      setMessage("Profile and engineering cutoff updated successfully! Recommendations have been updated.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Student Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] mt-1">
            Update your subject marks or preferences to refresh your cutoff and college recommendations.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#F1D2DB] shadow-soft-sm text-center shrink-0">
          <span className="text-[10px] font-bold text-[#8E7E84] uppercase tracking-wider block">Cutoff</span>
          <span className="text-2xl font-black text-[#D85A7F]">{liveCutoff}</span>
          <span className="text-[10px] text-[#8E7E84] block">/ 200</span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
              Student Full Name
            </label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
              12th Board of Examination
            </label>
            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
            >
              <option value="Tamil Nadu State Board">Tamil Nadu State Board</option>
              <option value="CBSE">CBSE</option>
            </select>
          </div>
        </div>

        {/* Marks Section */}
        <div className="pt-4 border-t border-[#F1D2DB]">
          <span className="text-xs font-black text-[#372B2E] uppercase tracking-wider block mb-3">
            Subject Marks (Max 100 Each)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Mathematics Mark
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                name="maths"
                value={formData.maths}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-black text-[#372B2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Physics Mark
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                name="physics"
                value={formData.physics}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-black text-[#372B2E]"
              />
              <span className="text-[10px] text-[#8E7E84] block mt-0.5">TNEA 50% = {p / 2}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Chemistry Mark
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                name="chemistry"
                value={formData.chemistry}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-black text-[#372B2E]"
              />
              <span className="text-[10px] text-[#8E7E84] block mt-0.5">TNEA 50% = {c / 2}</span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="pt-4 border-t border-[#F1D2DB]">
          <span className="text-xs font-black text-[#372B2E] uppercase tracking-wider block mb-3">
            TNEA Preferences & Living Requirements
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Preferred Engineering Branch
              </label>
              <select
                name="preferred_branch"
                value={formData.preferred_branch}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
              >
                {ENGINEERING_BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Preferred District
              </label>
              <select
                name="preferred_district"
                value={formData.preferred_district}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                Community Category
              </label>
              <select
                name="community"
                value={formData.community}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
              >
                {COMMUNITIES.map((comm) => (
                  <option key={comm} value={comm}>{comm}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-[#FAF7F8] p-4 rounded-2xl border border-[#F1D2DB]">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#372B2E]">Max Tuition Budget</label>
                <span className="text-xs font-black text-[#D85A7F]">
                  ₹{Number(formData.budget).toLocaleString("en-IN")}/yr
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="200000"
                step="5000"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full accent-[#D85A7F]"
              />
            </div>

            <div className="flex items-center space-x-3 sm:pl-6 sm:border-l border-[#F1D2DB]">
              <input
                type="checkbox"
                id="hostel_req"
                name="hostel_required"
                checked={formData.hostel_required}
                onChange={handleChange}
                className="w-5 h-5 rounded text-[#D85A7F] accent-[#D85A7F]"
              />
              <label htmlFor="hostel_req" className="text-xs font-bold text-[#372B2E] cursor-pointer">
                Hostel Accommodation Required
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] shadow-soft-sm flex items-center justify-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Updating Profile..." : "Update Profile & Refresh Recommendations"}</span>
        </button>
      </form>
    </div>
  );
}
