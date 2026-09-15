import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collegesAPI } from "../services/api";
import CollegeCard from "../components/CollegeCard";
import {
  Compass,
  Search,
  SlidersHorizontal,
  RotateCcw,
  GitCompare,
  Building,
  MapPin,
  Sparkles,
  ArrowRight,
  X
} from "lucide-react";

const BRANCHES = [
  "All",
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

const DISTRICTS = [
  "All",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Erode",
  "Salem",
  "Tirunelveli",
  "Tiruvallur",
  "Virudhunagar",
  "Chengalpattu",
  "Kanchipuram"
];

const TYPES = ["All", "Government", "Government Aided", "Private Autonomous", "Private"];

export default function FindColleges() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [hostelOnly, setHostelOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState(150000);
  const [minRating, setMinRating] = useState(4.0);

  // Comparison tray (2-4 colleges)
  const [comparedColleges, setComparedColleges] = useState([]);

  const fetchColleges = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const params = {
        search: search || undefined,
        branch: selectedBranch !== "All" ? selectedBranch : undefined,
        district: selectedDistrict !== "All" ? selectedDistrict : undefined,
        type: selectedType !== "All" ? selectedType : undefined,
        hostel: hostelOnly ? true : undefined,
        max_budget: maxBudget,
        min_rating: minRating,
        cutoff: user?.calculated_cutoff || undefined,
        community: user?.community || "BC"
      };

      const res = await collegesAPI.list(params);
      setColleges(res.data.colleges || []);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setLoadError(err.response?.data?.error || "Unable to load verified colleges. Make sure the backend is running on http://127.0.0.1:5000.");
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [selectedBranch, selectedDistrict, selectedType, hostelOnly, maxBudget, minRating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchColleges();
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedBranch("All");
    setSelectedDistrict("All");
    setSelectedType("All");
    setHostelOnly(false);
    setMaxBudget(150000);
    setMinRating(4.0);
  };

  const handleCompareToggle = (college) => {
    if (comparedColleges.some((c) => c.id === college.id)) {
      setComparedColleges((prev) => prev.filter((c) => c.id !== college.id));
    } else {
      if (comparedColleges.length >= 4) {
        alert("You can compare up to 4 colleges at a time.");
        return;
      }
      setComparedColleges((prev) => [...prev, college]);
    }
  };

  const handleGoToCompare = () => {
    const ids = comparedColleges.map((c) => c.id).join(",");
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F] mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>TNEA Engineering Colleges Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Find My Colleges
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] mt-1">
            Filter authentic Tamil Nadu engineering institutions by district, branch, government fee ceilings, and campus living.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by college name, code (0001)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#F1D2DB] rounded-2xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E] shadow-soft-sm"
          />
          <Search className="w-4 h-4 text-[#8E7E84] absolute left-3.5 top-3" />
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1D2DB]">
          <span className="text-xs font-black text-[#372B2E] flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[#D85A7F]" />
            <span>Interactive Admission Filters</span>
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-bold text-[#D85A7F] hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Branch Filter */}
          <div>
            <label className="block font-bold text-[#372B2E] mb-1">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl text-xs font-semibold text-[#372B2E] focus:outline-none focus:border-[#D85A7F]"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block font-bold text-[#372B2E] mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl text-xs font-semibold text-[#372B2E] focus:outline-none focus:border-[#D85A7F]"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* College Type Filter */}
          <div>
            <label className="block font-bold text-[#372B2E] mb-1">College Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl text-xs font-semibold text-[#372B2E] focus:outline-none focus:border-[#D85A7F]"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Budget Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#372B2E]">Max Tuition</label>
              <span className="font-black text-[#D85A7F]">
                ₹{maxBudget.toLocaleString("en-IN")}/yr
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="200000"
              step="5000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#D85A7F]"
            />
          </div>
        </div>

        {/* Secondary Filters Checkboxes */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hostelOnly}
              onChange={(e) => setHostelOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#D85A7F] accent-[#D85A7F]"
            />
            <span className="font-bold text-[#372B2E]">Only Colleges with Verified Hostel</span>
          </label>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#8E7E84] font-semibold">Min Rating:</span>
            {[4.0, 4.3, 4.6].map((rate) => (
              <button
                key={rate}
                onClick={() => setMinRating(rate)}
                className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold transition-colors ${
                  minRating === rate
                    ? "bg-[#D85A7F] text-white border-[#D85A7F]"
                    : "bg-[#FAF7F8] text-[#6E5D63] border-[#F1D2DB]"
                }`}
              >
                {rate}★+
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#6E5D63]">
          Showing <strong className="text-[#372B2E]">{colleges.length}</strong> matching engineering colleges
        </span>
        {user?.calculated_cutoff && (
          <span className="text-xs font-semibold text-[#D85A7F] bg-[#FDF2F4] px-3 py-1 rounded-full border border-[#F1D2DB]">
            Evaluating against your cutoff: {user.calculated_cutoff}/200
          </span>
        )}
      </div>

      {/* College Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8E7E84]">
          Finding suitable colleges matching your preferences...
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-12 text-center space-y-3">
          <Building className="w-10 h-10 text-[#D85A7F] mx-auto" />
          <h3 className="text-base font-bold text-[#372B2E]">College directory is temporarily unavailable</h3>
          <p className="text-xs text-[#6E5D63] max-w-md mx-auto">{loadError}</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-12 text-center space-y-3">
          <Building className="w-10 h-10 text-[#D85A7F] mx-auto" />
          <h3 className="text-base font-bold text-[#372B2E]">
            No colleges matched your current preferences
          </h3>
          <p className="text-xs text-[#6E5D63] max-w-md mx-auto">
            Try increasing your college budget range, clearing specific branch filters, or resetting your filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#D85A7F]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isCompared={comparedColleges.some((c) => c.id === college.id)}
              onCompareToggle={handleCompareToggle}
              studentCutoff={user?.calculated_cutoff}
            />
          ))}
        </div>
      )}

      {/* Floating Comparison Tray */}
      {comparedColleges.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 max-w-3xl mx-auto z-40 px-4">
          <div className="bg-white rounded-2xl border-2 border-[#D85A7F] shadow-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 overflow-x-auto">
              <div className="text-xs font-extrabold text-[#372B2E] shrink-0">
                Comparing ({comparedColleges.length}/4):
              </div>
              <div className="flex items-center space-x-2">
                {comparedColleges.map((c) => (
                  <span
                    key={c.id}
                    className="bg-[#FDF2F4] text-[#D85A7F] border border-[#F1D2DB] px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 shrink-0"
                  >
                    <span>{c.short_name}</span>
                    <button
                      onClick={() => handleCompareToggle(c)}
                      className="hover:text-rose-700"
                    >
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setComparedColleges([])}
                className="text-xs text-[#8E7E84] hover:underline"
              >
                Clear
              </button>
              <button
                onClick={handleGoToCompare}
                disabled={comparedColleges.length < 2}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] disabled:opacity-50 shadow-soft-sm flex items-center space-x-1.5"
              >
                <span>Compare Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
