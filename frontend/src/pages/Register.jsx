import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Calculator,
  Building,
  MapPin,
  IndianRupee,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { IMAGES, handleImageError } from "../assets/images";

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
  "Robotics and Automation",
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
  "Kanchipuram",
];

const COMMUNITIES = ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    board: "Tamil Nadu State Board",
    maths: "95",
    physics: "90",
    chemistry: "92",
    preferred_branch: "Computer Science and Engineering",
    preferred_district: "All",
    budget: 120000,
    hostel_required: true,
    community: "BC",
  });

  const [otherBoardWarning, setOtherBoardWarning] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live Cutoff Calculation: Maths + Physics/2 + Chemistry/2
  const m = parseFloat(formData.maths) || 0;
  const p = parseFloat(formData.physics) || 0;
  const c = parseFloat(formData.chemistry) || 0;
  const liveCutoff = (m + p / 2 + c / 2).toFixed(2);

  const handleBoardChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setOtherBoardWarning(
        "This admission counselor is currently designed for Tamil Nadu State Board and CBSE students applying for engineering through TNEA."
      );
    } else {
      setOtherBoardWarning("");
    }
    setFormData({ ...formData, board: val });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.board === "Other") {
      setError(
        "This admission counselor is currently designed for Tamil Nadu State Board and CBSE students applying for engineering through TNEA."
      );
      return;
    }

    if (m < 0 || m > 100 || p < 0 || p > 100 || c < 0 || c > 100) {
      setError("Please enter subject marks between 0 and 100.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl border border-[#F1D2DB] shadow-soft-lg overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] p-6 sm:p-8 border-b border-[#F1D2DB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TNEA Aspirants Only</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
              Create Your TNEA Admission Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5D63] mt-1">
              Personalized college recommendations based on authentic Tamil Nadu Engineering Admissions cutoff data.
            </p>
          </div>

          {/* Live Cutoff Calculator Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#F1D2DB] shadow-soft-sm shrink-0 w-full md:w-auto">
            <div className="flex items-center space-x-2 text-[11px] font-bold text-[#8E7E84] uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-[#D85A7F]" />
              <span>Calculated Cutoff</span>
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-black text-[#D85A7F]">{liveCutoff}</span>
              <span className="text-xs font-semibold text-[#8E7E84]">/ 200 max</span>
            </div>
            <span className="text-[10px] text-[#8E7E84] block mt-0.5">
              Maths ({m}) + Phy ({p}/2) + Chem ({c}/2)
            </span>
          </div>
        </div>

        {/* Error / Warning Alert */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {otherBoardWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <span className="font-semibold">{otherBoardWarning}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Account */}
            <div>
              <h3 className="text-sm font-black text-[#372B2E] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#F8D7DE] text-[#D85A7F] text-xs flex items-center justify-center font-bold">1</span>
                <span>Student Details & Credentials</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Senthil Kumar"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create secure password"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Board & Marks */}
            <div className="pt-4 border-t border-[#F1D2DB]">
              <h3 className="text-sm font-black text-[#372B2E] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#F8D7DE] text-[#D85A7F] text-xs flex items-center justify-center font-bold">2</span>
                <span>Board & 12th Standard Subject Marks (0 - 100)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    12th Board of Examination *
                  </label>
                  <select
                    name="board"
                    value={formData.board}
                    onChange={handleBoardChange}
                    className="w-full px-3 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E]"
                  >
                    <option value="Tamil Nadu State Board">Tamil Nadu State Board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="Other">Other Board (Not supported)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    Mathematics Mark (Max 100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    name="maths"
                    value={formData.maths}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-bold text-[#372B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    Physics Mark (Max 100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    name="physics"
                    value={formData.physics}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-bold text-[#372B2E]"
                  />
                  <span className="text-[10px] text-[#8E7E84] mt-0.5 block">Halved in TNEA: {p / 2}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#372B2E] mb-1.5">
                    Chemistry Mark (Max 100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    name="chemistry"
                    value={formData.chemistry}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-bold text-[#372B2E]"
                  />
                  <span className="text-[10px] text-[#8E7E84] mt-0.5 block">Halved in TNEA: {c / 2}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Engineering Preferences */}
            <div className="pt-4 border-t border-[#F1D2DB]">
              <h3 className="text-sm font-black text-[#372B2E] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#F8D7DE] text-[#D85A7F] text-xs flex items-center justify-center font-bold">3</span>
                <span>Engineering & Location Preferences</span>
              </h3>

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
                    Preferred District / Location
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
                    TNEA Reservation Community
                  </label>
                  <select
                    name="community"
                    value={formData.community}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl focus:outline-none focus:border-[#D85A7F] font-bold text-[#372B2E]"
                  >
                    {COMMUNITIES.map((comm) => (
                      <option key={comm} value={comm}>{comm}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Budget & Hostel */}
            <div className="pt-4 border-t border-[#F1D2DB]">
              <h3 className="text-sm font-black text-[#372B2E] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#F8D7DE] text-[#D85A7F] text-xs flex items-center justify-center font-bold">4</span>
                <span>Budget & Living Requirements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF7F8] p-4 rounded-2xl border border-[#F1D2DB]">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-[#372B2E]">
                      Maximum Annual Tuition Budget
                    </label>
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
                  <div className="flex justify-between text-[10px] text-[#8E7E84] mt-1">
                    <span>₹15,000 (Govt)</span>
                    <span>₹55,000 (Govt Aided / Self-Fin)</span>
                    <span>₹2,00,000+ (Private)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:pl-6 sm:border-l border-[#F1D2DB]">
                  <input
                    type="checkbox"
                    id="hostel_required"
                    name="hostel_required"
                    checked={formData.hostel_required}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-[#D85A7F] accent-[#D85A7F] focus:ring-[#D85A7F]"
                  />
                  <div>
                    <label htmlFor="hostel_required" className="text-xs font-bold text-[#372B2E] block cursor-pointer">
                      Hostel Accommodation Required
                    </label>
                    <span className="text-[11px] text-[#8E7E84] block">
                      Prioritize colleges with verified on-campus residential facilities.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || formData.board === "Other"}
                className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] shadow-soft-sm hover:shadow-soft-md disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Creating Profile & Calculating..." : "Save Profile & Explore My Colleges"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#F1D2DB] text-center text-xs text-[#6E5D63]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-[#D85A7F] hover:underline">
              Log In to Counselor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
