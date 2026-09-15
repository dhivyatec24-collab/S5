import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collegesAPI, compareAPI } from "../services/api";
import {
  GitCompare,
  Building,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  PlusCircle,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

export default function CompareColleges() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allColleges, setAllColleges] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    collegesAPI
      .list()
      .then((res) => {
        setAllColleges(res.data.colleges || []);
        const paramIds = searchParams.get("ids");
        if (paramIds) {
          const splitIds = paramIds.split(",").filter(Boolean);
          setSelectedIds(splitIds);
        } else if (res.data.colleges && res.data.colleges.length >= 2) {
          // Default to top 2 premier colleges
          setSelectedIds([res.data.colleges[0].id, res.data.colleges[1].id]);
        }
      })
      .catch((err) => console.error("Error loading colleges for compare:", err));
  }, []);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);
      const studentProfile = user
        ? {
            calculated_cutoff: user.calculated_cutoff,
            community: user.community,
            preferred_branch: user.preferred_branch,
            preferred_district: user.preferred_district,
            budget: user.budget,
            hostel_required: user.hostel_required,
          }
        : {
            calculated_cutoff: 190.0,
            community: "BC",
            preferred_branch: "Computer Science and Engineering",
            budget: 150000,
            hostel_required: true,
          };

      compareAPI
        .compare(selectedIds, studentProfile)
        .then((res) => {
          setComparisonData(res.data);
        })
        .catch((err) => console.error("Comparison error:", err))
        .finally(() => setLoading(false));
    }
  }, [selectedIds, user]);

  const handleAddCollege = (collegeId) => {
    if (selectedIds.includes(collegeId)) return;
    if (selectedIds.length >= 4) {
      alert("You can compare a maximum of 4 colleges simultaneously.");
      return;
    }
    const updated = [...selectedIds, collegeId];
    setSelectedIds(updated);
    setSearchParams({ ids: updated.join(",") });
  };

  const handleRemoveCollege = (collegeId) => {
    if (selectedIds.length <= 2) {
      alert("At least 2 colleges are required for comparison.");
      return;
    }
    const updated = selectedIds.filter((id) => id !== collegeId);
    setSelectedIds(updated);
    setSearchParams({ ids: updated.join(",") });
  };

  const compared = comparisonData?.colleges || [];
  const suitability = comparisonData?.suitability_analysis;

  // Chart data comparing Fees and Average Package
  const chartData = compared.map((c) => ({
    name: c.short_name,
    tuitionFeeK: Math.round((c.fees?.tuition_fee_annual || 0) / 1000),
    avgPackageLPA: c.placements?.average_package_lpa || 0,
    highestPackageLPA: c.placements?.highest_package_lpa || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F] mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Side-by-Side College Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Compare Before You Choose
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] mt-1">
            Compare 2 to 4 colleges on verified fees, hostel living, placements, and profile suitability.
          </p>
        </div>

        {/* Add College Selector */}
        {selectedIds.length < 4 && (
          <div className="shrink-0 flex items-center space-x-2 bg-white p-2 rounded-2xl border border-[#F1D2DB] shadow-soft-sm">
            <span className="text-xs font-bold text-[#8E7E84] pl-2">Add to Compare:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddCollege(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl px-3 py-1.5 font-semibold text-[#372B2E] focus:outline-none"
            >
              <option value="" disabled>Select College...</option>
              {allColleges
                .filter((c) => !selectedIds.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.short_name} ({c.district})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* "Which One Suits Me Better?" Recommendation Banner */}
      {suitability && (
        <div className="bg-gradient-to-r from-[#FDE8ED] via-white to-[#F3EEFA] rounded-3xl border-2 border-[#D85A7F] p-6 sm:p-8 shadow-soft-md space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D85A7F] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-[#D85A7F] uppercase tracking-wider block">
                Profile-Aligned Recommendation
              </span>
              <h3 className="text-lg font-black text-[#372B2E]">
                Which One Suits Me Better?
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#372B2E] font-medium leading-relaxed">
            {suitability.verdict}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {suitability.scores.map((s, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  s.college_id === suitability.top_choice_id
                    ? "bg-white border-[#D85A7F] shadow-soft-sm ring-1 ring-[#D85A7F]"
                    : "bg-[#FAF7F8] border-[#F1D2DB]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#372B2E] truncate">{s.short_name}</span>
                  <span className="text-xs font-black text-[#D85A7F]">
                    {s.suitability_score}/100
                  </span>
                </div>
                <div className="text-[10px] text-[#6E5D63] space-y-0.5">
                  {s.key_highlights.slice(0, 2).map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center space-x-1 truncate">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8E7E84]">
          Loading comparison data...
        </div>
      ) : compared.length < 2 ? (
        <div className="p-8 text-center text-xs text-[#8E7E84]">
          Please select at least 2 colleges to compare.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F1D2DB] bg-[#FAF7F8]">
                  <th className="py-4 px-4 font-bold text-[#8E7E84] uppercase tracking-wider w-44">
                    Feature
                  </th>
                  {compared.map((c) => (
                    <th key={c.id} className="py-4 px-4 font-extrabold text-[#372B2E] text-center min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{c.short_name}</span>
                        {compared.length > 2 && (
                          <button
                            onClick={() => handleRemoveCollege(c.id)}
                            className="text-[#8E7E84] hover:text-rose-600 p-1"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#D85A7F] block text-left mt-0.5">
                        Code: {c.code}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1D2DB]/60">
                {/* Location */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">District & Location</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-medium text-[#372B2E]">
                      {c.district}, Tamil Nadu
                    </td>
                  ))}
                </tr>

                {/* College Type */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">College Type</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-semibold text-[#372B2E]">
                      {c.type}
                    </td>
                  ))}
                </tr>

                {/* Tuition Fee */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Annual Tuition Fee</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-black text-[#D85A7F]">
                      ₹{c.fees?.tuition_fee_annual?.toLocaleString("en-IN") || "N/A"}/yr
                    </td>
                  ))}
                </tr>

                {/* Hostel Fee */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Hostel & Mess Fee</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-bold text-[#372B2E]">
                      ₹{c.fees?.hostel_fee_annual?.toLocaleString("en-IN") || "N/A"}/yr
                    </td>
                  ))}
                </tr>

                {/* Hostel Available */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Hostel Available</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center">
                      {c.hostel?.available ? (
                        <span className="text-emerald-700 font-bold flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Yes (Verified)</span>
                        </span>
                      ) : (
                        <span className="text-[#8E7E84]">Not Available</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Placement % */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Placement Percentage</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-black text-emerald-700">
                      {c.placements?.placement_percentage || "N/A"}%
                    </td>
                  ))}
                </tr>

                {/* Average Package */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Average Package (LPA)</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-black text-[#D85A7F]">
                      ₹{c.placements?.average_package_lpa || "N/A"} LPA
                    </td>
                  ))}
                </tr>

                {/* Highest Package */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Highest Package (LPA)</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-extrabold text-[#372B2E]">
                      ₹{c.placements?.highest_package_lpa || "N/A"} LPA
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">Overall Rating</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-extrabold text-amber-600">
                      ★ {c.overall_rating?.toFixed(1) || "4.5"} / 5.0
                    </td>
                  ))}
                </tr>

                {/* NIRF Rank */}
                <tr className="hover:bg-[#FAF7F8]/60">
                  <td className="py-3 px-4 font-bold text-[#6E5D63]">NIRF 2024 Rank</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-center font-bold text-[#372B2E]">
                      {c.nirf_rank}
                    </td>
                  ))}
                </tr>

                {/* View Details CTA */}
                <tr className="bg-[#FAF7F8]">
                  <td className="py-4 px-4 font-bold text-[#8E7E84]">Profile</td>
                  {compared.map((c) => (
                    <td key={c.id} className="py-4 px-4 text-center">
                      <Link
                        to={`/colleges/${c.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-[#D85A7F] hover:bg-[#B83B60] px-3.5 py-1.5 rounded-xl shadow-soft-sm transition-colors"
                      >
                        <span>View Full Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visual Bar Chart: Fees vs Average Salary */}
      {chartData.length >= 2 && (
        <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-4">
          <h3 className="text-base font-black text-[#372B2E]">
            Comparative Visual: Average Salary vs Tuition Fee
          </h3>
          <p className="text-xs text-[#6E5D63]">
            Comparing annual tuition investment (₹ in Thousands) against verified average placement package (₹ in LPA).
          </p>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#8E7E84" fontSize={11} />
                <YAxis stroke="#8E7E84" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgPackageLPA" name="Avg Package (LPA)" fill="#D85A7F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tuitionFeeK" name="Tuition Fee (₹ Thousands)" fill="#F4ABB4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
