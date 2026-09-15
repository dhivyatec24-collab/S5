import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { recommendationsAPI } from "../services/api";
import {
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Filter,
  DollarSign
} from "lucide-react";
import { IMAGES, handleImageError } from "../assets/images";

export default function Recommendations() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("target"); // "dream", "target", "safe"

  const cutoff = user?.calculated_cutoff || 186.0;

  useEffect(() => {
    recommendationsAPI
      .get({
        calculated_cutoff: cutoff,
        community: user?.community || "BC",
        preferred_branch: user?.preferred_branch || "Computer Science and Engineering",
        preferred_district: user?.preferred_district || "All",
        budget: user?.budget || 150000,
        hostel_required: user?.hostel_required ? 1 : 0
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Recommendations error:", err))
      .finally(() => setLoading(false));
  }, [user, cutoff]);

  const dream = data?.dream_colleges || [];
  const target = data?.target_colleges || [];
  const safe = data?.safe_colleges || [];

  const getActiveList = () => {
    if (activeTab === "dream") return dream;
    if (activeTab === "safe") return safe;
    return target;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Random Forest ML Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Colleges That Match Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] max-w-xl">
            Categorized admission opportunities based on your cutoff ({cutoff}/200) and {user?.community || "BC"} community historical closing trends.
          </p>
        </div>

        {/* Visual Imagery of Students Celebrating Graduation */}
        <div className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden shadow-soft-sm border border-[#F1D2DB] hidden sm:block">
          <img
            src={IMAGES.celebratingGraduates}
            alt="Students Celebrating Graduation"
            onError={(e) => handleImageError(e)}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Tier Category Selection Tabs */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveTab("dream")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "dream"
              ? "bg-white border-[#D85A7F] shadow-soft-md ring-2 ring-[#D85A7F]/30"
              : "bg-white border-[#F1D2DB] hover:border-[#D85A7F]/50 shadow-soft-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-black text-rose-700">
              Dream Colleges
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {dream.length}
            </span>
          </div>
          <p className="text-[11px] text-[#6E5D63] leading-tight">
            Highly competitive aspirational choices where cutoff is slightly below closing.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("target")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "target"
              ? "bg-white border-[#D85A7F] shadow-soft-md ring-2 ring-[#D85A7F]/30"
              : "bg-white border-[#F1D2DB] hover:border-[#D85A7F]/50 shadow-soft-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-black text-blue-700">
              Target Colleges
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {target.length}
            </span>
          </div>
          <p className="text-[11px] text-[#6E5D63] leading-tight">
            Realistic and competitive options matching your exact cutoff threshold.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("safe")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "safe"
              ? "bg-white border-[#D85A7F] shadow-soft-md ring-2 ring-[#D85A7F]/30"
              : "bg-white border-[#F1D2DB] hover:border-[#D85A7F]/50 shadow-soft-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm font-black text-emerald-700">
              Safe Colleges
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {safe.length}
            </span>
          </div>
          <p className="text-[11px] text-[#6E5D63] leading-tight">
            High historical probability options where your cutoff provides a safe buffer.
          </p>
        </button>
      </div>

      {/* Recommendations Feed */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8E7E84]">
          Evaluating historical cutoffs across all verified institutions...
        </div>
      ) : getActiveList().length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-12 text-center text-xs text-[#8E7E84]">
          No {activeTab} college opportunities matched your exact preferences.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getActiveList().map((item, idx) => {
            const isPositive = item.cutoff_delta >= 0;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#F1D2DB] hover:border-[#D85A7F] shadow-soft-sm hover:shadow-soft-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#372B2E] bg-[#FAF7F8] px-2.5 py-0.5 rounded-full border border-[#F1D2DB]">
                      Code: {item.college_code}
                    </span>
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                        item.tier === "Safe"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.tier === "Target"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {item.tier} Opportunity
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-[#372B2E] leading-snug">
                      {item.short_name}
                    </h3>
                    <span className="text-xs font-semibold text-[#D85A7F] block mt-0.5">
                      {item.branch_name}
                    </span>
                    <span className="text-[11px] text-[#8E7E84] block">
                      {item.district} • {item.college_type}
                    </span>
                  </div>

                  {/* Cutoff Comparison Strip */}
                  <div className="bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E7E84]">Your Cutoff:</span>
                      <span className="font-extrabold text-[#372B2E]">{item.student_cutoff}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E7E84]">2023 Closing Cutoff:</span>
                      <span className="font-extrabold text-[#372B2E]">{item.historical_cutoff}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-[#F1D2DB]/60">
                      <span className="font-bold text-[#372B2E]">Cutoff Delta:</span>
                      <span
                        className={`font-black ${
                          isPositive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isPositive ? `+${item.cutoff_delta}` : item.cutoff_delta} marks
                      </span>
                    </div>
                  </div>

                  {/* Likelihood Explanation */}
                  <p className="text-[11px] text-[#6E5D63] leading-relaxed bg-[#FFF5F7] p-2.5 rounded-xl border border-[#F1D2DB]/60">
                    "{item.reason}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1D2DB]/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#8E7E84] block">Avg Placement</span>
                    <span className="font-black text-[#D85A7F]">
                      ₹{item.average_package_lpa} LPA
                    </span>
                  </div>
                  <Link
                    to={`/colleges/${item.college_id}`}
                    className="inline-flex items-center space-x-1 font-bold text-xs text-[#D85A7F] hover:underline"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimers & Advice Note */}
      <div className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] text-[11px] text-[#8E7E84] space-y-1">
        <span className="font-bold text-[#372B2E]">Important Counseling Advice:</span>
        <p>
          Do not omit Dream options from your TNEA choice filling form! TNEA checks choices from top to bottom, so placing dream colleges at the very top of your priority list does not harm your chances for Target or Safe colleges below them.
        </p>
        <p className="text-[10px] text-[#A09398]">
          *Admission likelihoods are scientific statistical estimates based on TNEA 2022-2023 closing trends. They do not constitute a legal seat allotment guarantee.
        </p>
      </div>
    </div>
  );
}
