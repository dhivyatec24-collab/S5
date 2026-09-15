import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { recommendationsAPI, collegesAPI } from "../services/api";
import {
  GraduationCap,
  Calculator,
  Compass,
  GitCompare,
  Bot,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  AlertCircle,
  Home,
  IndianRupee,
  MapPin
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

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [collegesCount, setCollegesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const cutoff = user?.calculated_cutoff || 186.0;
  const maths = user?.maths || 95;
  const physics = user?.physics || 90;
  const chemistry = user?.chemistry || 92;

  const marksData = [
    { subject: "Maths (Max 100)", mark: maths, weighted: maths, fill: "#D85A7F" },
    { subject: "Physics (Max 50)", mark: physics, weighted: physics / 2, fill: "#E87A8B" },
    { subject: "Chemistry (Max 50)", mark: chemistry, weighted: chemistry / 2, fill: "#F4ABB4" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, colRes] = await Promise.all([
          recommendationsAPI.get({
            calculated_cutoff: cutoff,
            community: user?.community || "BC",
            preferred_branch: user?.preferred_branch || "Computer Science and Engineering",
            preferred_district: user?.preferred_district || "All",
            budget: user?.budget || 150000,
            hostel_required: user?.hostel_required ? 1 : 0
          }),
          collegesAPI.list({ cutoff: cutoff, community: user?.community || "BC" })
        ]);

        setRecommendations(recRes.data);
        setCollegesCount(colRes.data.total || 0);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, cutoff]);

  const dreamCount = recommendations?.dream_colleges?.length || 0;
  const targetCount = recommendations?.target_colleges?.length || 0;
  const safeCount = recommendations?.safe_colleges?.length || 0;
  const totalRecommended = dreamCount + targetCount + safeCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tamil Nadu Engineering Admissions 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Welcome, {user?.name || "Aspirant"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] max-w-xl">
            Here is your personalized TNEA counseling overview based on your 12th Standard Board marks and authentic historical closing data.
          </p>
        </div>

        {/* Quick Cutoff Score Badge */}
        <div className="bg-white px-6 py-4 rounded-2xl border border-[#F1D2DB] shadow-soft-sm shrink-0 text-center">
          <span className="text-[11px] font-bold text-[#8E7E84] uppercase tracking-wider block">
            Your Engineering Cutoff
          </span>
          <div className="flex items-baseline justify-center space-x-1 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-[#D85A7F]">{cutoff}</span>
            <span className="text-xs font-bold text-[#8E7E84]">/ 200</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            {cutoff >= 195 ? "Eligible for CEG / MIT / PSG Tech" : cutoff >= 180 ? "Eligible for Premier Autonomous Colleges" : "Eligible for Reputable Regional Campuses"}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm">
          <div className="flex items-center justify-between text-[#8E7E84] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">My Cutoff</span>
            <Calculator className="w-4 h-4 text-[#D85A7F]" />
          </div>
          <span className="text-2xl font-black text-[#372B2E]">{cutoff}</span>
          <span className="text-[11px] text-[#8E7E84] block mt-1">
            Max Cutoff: 200.0
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm">
          <div className="flex items-center justify-between text-[#8E7E84] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Recommended</span>
            <Sparkles className="w-4 h-4 text-[#D85A7F]" />
          </div>
          <span className="text-2xl font-black text-[#D85A7F]">{totalRecommended}</span>
          <span className="text-[11px] text-[#8E7E84] block mt-1">
            Dream ({dreamCount}) • Target ({targetCount}) • Safe ({safeCount})
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm">
          <div className="flex items-center justify-between text-[#8E7E84] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Colleges</span>
            <Building className="w-4 h-4 text-[#D85A7F]" />
          </div>
          <span className="text-2xl font-black text-[#372B2E]">{collegesCount || "14"}</span>
          <span className="text-[11px] text-[#8E7E84] block mt-1">
            Govt, Govt-Aided & Autonomous
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm">
          <div className="flex items-center justify-between text-[#8E7E84] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Branch</span>
            <GraduationCap className="w-4 h-4 text-[#D85A7F]" />
          </div>
          <span className="text-sm font-extrabold text-[#372B2E] block truncate">
            {user?.preferred_branch || "Computer Science"}
          </span>
          <span className="text-[11px] text-[#8E7E84] block mt-1">
            Community: {user?.community || "BC"}
          </span>
        </div>
      </div>

      {/* Student Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1D2DB]">
          <div>
            <h2 className="text-lg font-black text-[#372B2E]">
              Student Profile & TNEA Parameters
            </h2>
            <p className="text-xs text-[#6E5D63]">
              Your registered details used to predict cutoffs and recommend colleges.
            </p>
          </div>
          <Link
            to="/profile"
            className="text-xs font-bold text-[#D85A7F] hover:underline"
          >
            Edit Profile →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
            <span className="text-[#8E7E84] block uppercase text-[10px] tracking-wider">Board</span>
            <span className="font-bold text-[#372B2E] text-xs">{user?.board || "Tamil Nadu State Board"}</span>
          </div>
          <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
            <span className="text-[#8E7E84] block uppercase text-[10px] tracking-wider">Community</span>
            <span className="font-bold text-[#D85A7F] text-xs">{user?.community || "BC"} Category</span>
          </div>
          <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
            <span className="text-[#8E7E84] block uppercase text-[10px] tracking-wider">Max Budget</span>
            <span className="font-bold text-[#372B2E] text-xs">₹{user?.budget ? Number(user.budget).toLocaleString("en-IN") : "1,50,000"}/yr</span>
          </div>
          <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
            <span className="text-[#8E7E84] block uppercase text-[10px] tracking-wider">Hostel Required</span>
            <span className="font-bold text-[#372B2E] text-xs">{user?.hostel_required ? "Yes (Required)" : "No (Day Scholar)"}</span>
          </div>
        </div>

        {/* Marks Breakdown & Weighted Contribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-[#372B2E] block">
              12th Marks Contribution to TNEA Cutoff
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#FDF2F4] border border-[#F1D2DB]">
                <span className="font-medium text-[#372B2E]">Mathematics (100% weight)</span>
                <span className="font-black text-[#D85A7F]">{maths} / 100</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F1D2DB]/60">
                <span className="font-medium text-[#372B2E]">Physics (50% weight: {physics}/2)</span>
                <span className="font-black text-[#372B2E]">{physics / 2} / 50</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F1D2DB]/60">
                <span className="font-medium text-[#372B2E]">Chemistry (50% weight: {chemistry}/2)</span>
                <span className="font-black text-[#372B2E]">{chemistry / 2} / 50</span>
              </div>
            </div>
            <p className="text-[11px] text-[#8E7E84]">
              Cutoff = {maths} + {physics / 2} + {chemistry / 2} = <strong className="text-[#D85A7F]">{cutoff}/200</strong>
            </p>
          </div>

          <div className="lg:col-span-7 h-48 bg-[#FAF7F8] p-4 rounded-2xl border border-[#F1D2DB]/60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marksData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#8E7E84" fontSize={10} />
                <YAxis dataKey="subject" type="category" stroke="#8E7E84" fontSize={10} width={110} />
                <Tooltip />
                <Bar dataKey="weighted" name="Effective Cutoff Contribution" radius={[0, 8, 8, 0]}>
                  {marksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/cutoff-predictor"
          className="p-4 rounded-2xl bg-white border border-[#F1D2DB] hover:border-[#D85A7F] shadow-soft-sm hover:shadow-soft-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-[#372B2E] block">Predict Cutoff</span>
          <span className="text-[10px] text-[#8E7E84]">Run ML model</span>
        </Link>

        <Link
          to="/colleges"
          className="p-4 rounded-2xl bg-white border border-[#F1D2DB] hover:border-[#D85A7F] shadow-soft-sm hover:shadow-soft-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-[#372B2E] block">Find Colleges</span>
          <span className="text-[10px] text-[#8E7E84]">Filter & explore</span>
        </Link>

        <Link
          to="/compare"
          className="p-4 rounded-2xl bg-white border border-[#F1D2DB] hover:border-[#D85A7F] shadow-soft-sm hover:shadow-soft-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
            <GitCompare className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-[#372B2E] block">Compare Colleges</span>
          <span className="text-[10px] text-[#8E7E84]">Suitability analysis</span>
        </Link>

        <Link
          to="/counselor"
          className="p-4 rounded-2xl bg-white border border-[#F1D2DB] hover:border-[#D85A7F] shadow-soft-sm hover:shadow-soft-md transition-all text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-[#372B2E] block">Ask AI Counselor</span>
          <span className="text-[10px] text-[#8E7E84]">TNEA Q&A Guidance</span>
        </Link>
      </div>

      {/* Recommendations Preview Banner */}
      {recommendations && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#372B2E]">
                Top Realistic Options for Cutoff {cutoff}
              </h3>
              <p className="text-xs text-[#6E5D63]">
                Estimated opportunities categorized by the Random Forest admission likelihood classifier.
              </p>
            </div>
            <Link
              to="/recommendations"
              className="text-xs font-bold text-[#D85A7F] hover:underline"
            >
              View All Tiers ({totalRecommended}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {recommendations.target_colleges?.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] space-y-2 hover:border-[#D85A7F] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Target Option
                  </span>
                  <span className="text-xs font-bold text-[#D85A7F]">
                    {item.cutoff_delta >= 0 ? `+${item.cutoff_delta}` : item.cutoff_delta} marks
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#372B2E] leading-snug line-clamp-1">
                  {item.short_name}
                </h4>
                <p className="text-[11px] text-[#6E5D63] line-clamp-1">
                  {item.branch_name}
                </p>
                <div className="flex justify-between text-[10px] text-[#8E7E84] pt-1 border-t border-[#F1D2DB]/60">
                  <span>2023 Closing: {item.historical_cutoff}</span>
                  <span>Avg Pkg: ₹{item.average_package_lpa} LPA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
