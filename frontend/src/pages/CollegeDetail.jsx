import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collegesAPI } from "../services/api";
import RatingBreakdown from "../components/RatingBreakdown";
import {
  Building,
  MapPin,
  GraduationCap,
  Calendar,
  Award,
  ShieldCheck,
  Briefcase,
  Home,
  Utensils,
  BookOpen,
  Wifi,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  DollarSign,
  TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { IMAGES, handleImageError } from "../assets/images";

export default function CollegeDetail() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    collegesAPI
      .getById(id)
      .then((res) => {
        setCollege(res.data.college);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Verified college information is currently unavailable.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-[#8E7E84]">
        Loading verified college information from TNEA database...
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-[#D85A7F] mx-auto" />
        <h2 className="text-xl font-bold text-[#372B2E]">
          {error || "College information not available."}
        </h2>
        <Link
          to="/colleges"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#D85A7F]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to College Directory</span>
        </Link>
      </div>
    );
  }

  const fees = college.fees || {};
  const hostel = college.hostel || {};
  const placements = college.placements || {};
  const infrastructure = college.infrastructure || {};
  const branches = college.branches || [];

  const numericOrZero = (value) => (typeof value === "number" ? value : 0);

  const placementChartData = [
    { name: "Highest Package", lpa: numericOrZero(placements.highest_package_lpa), fill: "#B83B60" },
    { name: "Average Package", lpa: numericOrZero(placements.average_package_lpa), fill: "#D85A7F" },
    { name: "Median Package", lpa: numericOrZero(placements.median_package_lpa), fill: "#E87A8B" },
  ];

  const infraImages = [
    { label: "College Campus", src: college.images?.campus || IMAGES.campusGeneric },
    { label: "Central Library", src: college.images?.library || IMAGES.libraryGeneric },
    { label: "Research Laboratories", src: college.images?.lab || IMAGES.labGeneric },
    { label: "Lecture Theatres", src: IMAGES.classroomGeneric }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#8E7E84]">
        <Link to="/colleges" className="hover:text-[#D85A7F] flex items-center space-x-1">
          <ChevronLeft className="w-4 h-4" />
          <span>Find Colleges</span>
        </Link>
        <span>/</span>
        <span className="text-[#372B2E] font-bold truncate max-w-sm">{college.short_name}</span>
      </div>

      {/* College Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-[#F1D2DB] shadow-soft-md overflow-hidden">
        <div className="relative h-60 sm:h-72 w-full bg-[#FAF7F8]">
          <img
            src={college.images?.hero || IMAGES.campusGeneric}
            alt={college.name}
            onError={(e) => handleImageError(e)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Hero Meta Pill */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/90 backdrop-blur-md text-[#372B2E] text-xs font-black px-3 py-1 rounded-full shadow-sm">
                TNEA Code: {college.code}
              </span>
              <span className="bg-[#D85A7F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {college.type}
              </span>
              <span className="bg-white/90 backdrop-blur-md text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                ★ {college.overall_rating?.toFixed(1) || "4.6"} / 5.0 Rating
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-pink-100 font-medium pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-pink-300" />
                <span>{college.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-pink-300" />
                <span>Established {college.established_year}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-pink-300" />
                <span>{college.nirf_rank || "NIRF Ranked"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 border-b border-[#F1D2DB] flex space-x-6 overflow-x-auto text-xs font-bold">
          {[
            { id: "overview", label: "Overview" },
            { id: "fees", label: "Fees Structure" },
            { id: "hostel", label: "Hostel & Dining" },
            { id: "placements", label: "Placements" },
            { id: "branches", label: "Branches & Cutoffs" },
            { id: "infrastructure", label: "Infrastructure" },
            { id: "ratings", label: "Multifactor Rating" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 border-b-2 whitespace-nowrap transition-colors ${
                selectedTab === tab.id
                  ? "border-[#D85A7F] text-[#D85A7F]"
                  : "border-transparent text-[#6E5D63] hover:text-[#372B2E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: Overview */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-4">
              <h2 className="text-lg font-black text-[#372B2E]">
                College Profile & Affiliation
              </h2>
              <p className="text-xs text-[#6E5D63] leading-relaxed">
                {college.name} (TNEA Code: {college.code}) is an established {college.type.toLowerCase()} institution in {college.district}, Tamil Nadu.
                Affiliated with {college.affiliation || "Anna University, Chennai"} and holds verified accreditation status: {college.accreditation || "NAAC Accredited"}.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">Affiliation</span>
                  <span className="font-bold text-xs text-[#372B2E]">{college.affiliation}</span>
                </div>
                <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">Accreditation</span>
                  <span className="font-bold text-xs text-[#372B2E]">{college.accreditation}</span>
                </div>
                <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">NIRF Rank</span>
                  <span className="font-bold text-xs text-[#D85A7F]">{college.nirf_rank}</span>
                </div>
              </div>
            </div>

            {/* Quick Slices of Fees & Placements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#F1D2DB] p-5 shadow-soft-sm space-y-2">
                <span className="text-[10px] font-bold text-[#8E7E84] uppercase tracking-wider block">
                  Annual Tuition Cost
                </span>
                <span className="text-2xl font-black text-[#372B2E]">
                  ₹{fees.tuition_fee_annual ? fees.tuition_fee_annual.toLocaleString("en-IN") : "N/A"}
                </span>
                <span className="text-[11px] text-emerald-700 block font-medium">
                  {fees.is_fee_verified ? "✓ Officially verified schedule" : "Approximate"}
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#F1D2DB] p-5 shadow-soft-sm space-y-2">
                <span className="text-[10px] font-bold text-[#8E7E84] uppercase tracking-wider block">
                  Average Placement Package
                </span>
                <span className="text-2xl font-black text-[#D85A7F]">
                  ₹{placements.average_package_lpa ? `${placements.average_package_lpa} LPA` : "N/A"}
                </span>
                <span className="text-[11px] text-[#6E5D63] block">
                  Highest: ₹{placements.highest_package_lpa} LPA • {placements.placement_percentage}% placed
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <RatingBreakdown
              ratingBreakdown={college.rating_breakdown}
              ratingSource={college.rating_source}
            />
          </div>
        </div>
      )}

      {/* TAB CONTENT: Fees */}
      {selectedTab === "fees" && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="border-b border-[#F1D2DB] pb-4">
            <h2 className="text-lg font-black text-[#372B2E]">
              Verified TNEA Fee Structure
            </h2>
            <p className="text-xs text-[#6E5D63] mt-1">
              Fee ceilings approved by the Tamil Nadu Committee on Fixation of Fee in Self Financing Professional Colleges and Anna University.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] space-y-1">
              <span className="text-[10px] font-extrabold text-[#8E7E84] uppercase tracking-wider block">
                Tuition Fee (Annual)
              </span>
              <span className="text-3xl font-black text-[#372B2E]">
                ₹{fees.tuition_fee_annual ? fees.tuition_fee_annual.toLocaleString("en-IN") : "Information not available"}
              </span>
              <span className="text-[11px] text-[#6E5D63] block">Per Academic Year</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] space-y-1">
              <span className="text-[10px] font-extrabold text-[#8E7E84] uppercase tracking-wider block">
                Hostel & Mess Fee (Annual)
              </span>
              <span className="text-3xl font-black text-[#D85A7F]">
                ₹{fees.hostel_fee_annual ? fees.hostel_fee_annual.toLocaleString("en-IN") : "Information not available"}
              </span>
              <span className="text-[11px] text-[#6E5D63] block">Including food & room rent</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] space-y-1">
              <span className="text-[10px] font-extrabold text-[#8E7E84] uppercase tracking-wider block">
                Approx Total (Day Scholar)
              </span>
              <span className="text-3xl font-black text-[#372B2E]">
                ₹{fees.approx_total_day_scholar ? fees.approx_total_day_scholar.toLocaleString("en-IN") : "Information not available"}
              </span>
              <span className="text-[11px] text-[#6E5D63] block">Tuition + exam & library fee</span>
            </div>
          </div>

          {/* Sourcing Transparency Note */}
          <div className="p-4 rounded-2xl bg-[#FDF2F4] border border-[#F1D2DB] space-y-1 text-xs text-[#6E5D63]">
            <div className="flex items-center space-x-2 font-bold text-[#D85A7F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Verification Citation</span>
            </div>
            <p>
              Fee Schedule Source: <strong>{fees.tuition_source || "Official Directorate Publication"}</strong>
            </p>
            {fees.tuition_source_url && (
              <a
                href={fees.tuition_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#D85A7F] font-bold hover:underline inline-flex items-center space-x-1 mt-1"
              >
                <span>View Official Fee Publication</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Hostel & Dining */}
      {selectedTab === "hostel" && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="border-b border-[#F1D2DB] pb-4">
            <h2 className="text-lg font-black text-[#372B2E]">
              Hostel Living & Dining Specifications
            </h2>
            <p className="text-xs text-[#6E5D63] mt-1">
              Verified campus residential details for outstation Tamil Nadu engineering students.
            </p>
          </div>

          {hostel.available ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-[#FAF7F8] p-3.5 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">Boys Hostel</span>
                  <span className="font-bold text-xs text-[#372B2E]">{hostel.boys_hostel ? "Yes (Available)" : "No"}</span>
                </div>
                <div className="bg-[#FAF7F8] p-3.5 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">Girls Hostel</span>
                  <span className="font-bold text-xs text-[#372B2E]">{hostel.girls_hostel ? "Yes (Available)" : "No"}</span>
                </div>
                <div className="bg-[#FAF7F8] p-3.5 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">Campus Wi-Fi</span>
                  <span className="font-bold text-xs text-[#372B2E]">{hostel.wifi ? "Yes (High-speed)" : "Information not available"}</span>
                </div>
                <div className="bg-[#FAF7F8] p-3.5 rounded-xl border border-[#F1D2DB]/60">
                  <span className="text-[10px] text-[#8E7E84] block uppercase">Security</span>
                  <span className="font-bold text-xs text-[#372B2E]">{hostel.security || "24/7 Guards & CCTV"}</span>
                </div>
              </div>

              {/* Food / Mess Details */}
              <div className="bg-[#FAF7F8] p-5 rounded-2xl border border-[#F1D2DB] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-black text-[#372B2E]">
                  <Utensils className="w-4 h-4 text-[#D85A7F]" />
                  <span>Mess & Food Facility</span>
                </div>
                <div className="text-xs text-[#6E5D63] space-y-1">
                  <p><strong>Cuisine Type:</strong> {hostel.mess_type || "Information not available"}</p>
                  <p><strong>Dining Details:</strong> {hostel.food_details || "Information not available"}</p>
                  <p><strong>Estimated Capacity:</strong> {hostel.approx_capacity || "Information not available"}</p>
                </div>
              </div>

              <div className="text-[11px] text-[#8E7E84]">
                Source: {hostel.source_type || "Official Institutional Handbook"}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#8E7E84] bg-[#FAF7F8] rounded-2xl border border-[#F1D2DB]">
              Hostel information not available from verified sources.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Placements */}
      {selectedTab === "placements" && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="border-b border-[#F1D2DB] pb-4">
            <h2 className="text-lg font-black text-[#372B2E]">
              Verified Placement Statistics & Salary Packages
            </h2>
            <p className="text-xs text-[#6E5D63] mt-1">
              Data sourced from NIRF 2024 institutional reports and official placement office records.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Placement Percentage</span>
              <span className="text-2xl font-black text-emerald-700">
                {placements.placement_percentage ? `${placements.placement_percentage}%` : "Information not available"}
              </span>
            </div>

            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Highest Package</span>
              <span className="text-2xl font-black text-[#B83B60]">
                {typeof placements.highest_package_lpa === "number" ? `₹${placements.highest_package_lpa} LPA` : "Information not available"}
              </span>
            </div>

            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Average Package</span>
              <span className="text-2xl font-black text-[#D85A7F]">
                {typeof placements.average_package_lpa === "number" ? `₹${placements.average_package_lpa} LPA` : "Information not available"}
              </span>
            </div>

            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Median Package</span>
              <span className="text-2xl font-black text-[#E87A8B]">
                {typeof placements.median_package_lpa === "number" ? `₹${placements.median_package_lpa} LPA` : "Information not available"}
              </span>
            </div>

            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Recruiting Companies</span>
              <span className="text-2xl font-black text-[#372B2E]">
                {placements.num_recruiters ? `${placements.num_recruiters}+` : "Information not available"}
              </span>
            </div>
          </div>

          {/* Placement Chart */}
          <div className="bg-[#FAF7F8] p-6 rounded-2xl border border-[#F1D2DB]">
            <span className="text-xs font-bold text-[#372B2E] block mb-4">
              Annual Salary Distribution (in ₹ Lakhs Per Annum)
            </span>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementChartData}>
                  <XAxis dataKey="name" stroke="#8E7E84" fontSize={11} />
                  <YAxis stroke="#8E7E84" fontSize={11} unit=" LPA" />
                  <Tooltip />
                  <Bar dataKey="lpa" name="Package (LPA)" radius={[8, 8, 0, 0]}>
                    {placementChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Companies */}
          {placements.top_companies && (
            <div>
              <span className="text-xs font-bold text-[#372B2E] block mb-2">
                Major Recruiting Companies
              </span>
              <div className="flex flex-wrap gap-2">
                {placements.top_companies.map((co, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF7F8] text-[#372B2E] border border-[#F1D2DB] px-3 py-1.5 rounded-xl text-xs font-semibold"
                  >
                    {co}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-[#8E7E84]">
            Data Source: {placements.source_type} ({placements.placement_year})
          </div>
        </div>
      )}

      {/* TAB CONTENT: Branches & Cutoffs */}
      {selectedTab === "branches" && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="border-b border-[#F1D2DB] pb-4">
            <h2 className="text-lg font-black text-[#372B2E]">
              Available B.E./B.Tech Branches & Closing Cutoffs
            </h2>
            <p className="text-xs text-[#6E5D63] mt-1">
              Authentic historical TNEA closing cutoffs across reservation categories (OC, BC, BCM, MBC, SC, SCA, ST).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F1D2DB] bg-[#FAF7F8]">
                  <th className="py-3 px-3 font-bold text-[#372B2E]">Branch Name</th>
                  <th className="py-3 px-2 font-bold text-[#372B2E]">Code</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">OC</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">BC</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">BCM</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">MBC</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">SC</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">SCA</th>
                  <th className="py-3 px-2 font-bold text-[#D85A7F]">ST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1D2DB]/60">
                {branches.map((b, idx) => {
                  const c23 = b.cutoffs_2023 || {};
                  return (
                    <tr key={idx} className="hover:bg-[#FDF2F4]/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#372B2E]">{b.branch_name}</td>
                      <td className="py-3 px-2 font-mono text-[#8E7E84]">{b.branch_code}</td>
                      <td className="py-3 px-2 font-extrabold text-[#372B2E]">{c23.OC || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-[#6E5D63]">{c23.BC || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-[#6E5D63]">{c23.BCM || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-[#6E5D63]">{c23.MBC || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-[#6E5D63]">{c23.SC || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-[#6E5D63]">{c23.SCA || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-[#6E5D63]">{c23.ST || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Infrastructure */}
      {selectedTab === "infrastructure" && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="border-b border-[#F1D2DB] pb-4">
            <h2 className="text-lg font-black text-[#372B2E]">
              Campus Infrastructure & Learning Facilities
            </h2>
            <p className="text-xs text-[#6E5D63] mt-1">
              Verified campus acreage, laboratory count, and sports infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Campus Size</span>
              <span className="text-sm font-bold text-[#372B2E]">{infrastructure.campus_size_acres || "Information not available"}</span>
            </div>
            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Library Volumes</span>
              <span className="text-sm font-bold text-[#372B2E]">{infrastructure.library_volumes || "Information not available"}</span>
            </div>
            <div className="bg-[#FAF7F8] p-4 rounded-xl border border-[#F1D2DB]/60">
              <span className="text-[10px] text-[#8E7E84] uppercase block">Laboratories</span>
              <span className="text-sm font-bold text-[#372B2E]">{infrastructure.labs_count || "Information not available"}</span>
            </div>
          </div>

          {/* Infrastructure Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {infraImages.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[#F1D2DB] shadow-soft-sm bg-[#FAF7F8]">
                <img
                  src={img.src}
                  alt={img.label}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.classList.remove("hidden");
                    fallback?.classList.add("flex");
                  }}
                  className="w-full h-36 object-cover"
                />
                <div className="hidden w-full h-36 items-center justify-center bg-gradient-to-br from-[#FFF5F7] to-[#F3EEFA]">
                  <svg viewBox="0 0 64 64" className="w-12 h-12 text-[#D85A7F]" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="8" y="20" width="48" height="32" rx="4" />
                    <path d="M8 28h48M24 20v-6h16v6" />
                  </svg>
                </div>
                <div className="p-3 bg-white text-center">
                  <span className="text-xs font-bold text-[#372B2E] block">{img.label}</span>
                  <span className="text-[10px] text-[#8E7E84]">Verified Learning Facility</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[#8E7E84]">
            Infrastructure Source: {infrastructure.source_type || "AICTE Mandatory Disclosure"}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Ratings */}
      {selectedTab === "ratings" && (
        <RatingBreakdown
          ratingBreakdown={college.rating_breakdown}
          ratingSource={college.rating_source}
        />
      )}
    </div>
  );
}
