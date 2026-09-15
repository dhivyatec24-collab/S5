import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  Star,
  CheckCircle2,
  Home,
  ArrowRight,
  PlusCircle,
  Check
} from "lucide-react";
import { handleImageError, IMAGES } from "../assets/images";

export default function CollegeCard({
  college,
  onCompareToggle,
  isCompared = false,
  studentCutoff
}) {
  const fees = college.fees || {};
  const placements = college.placements || {};
  const hostel = college.hostel || {};
  const branches = college.branches || [];

  const heroImage = college.images?.hero || IMAGES.campusGeneric;

  return (
    <div className="bg-white rounded-2xl border border-[#F1D2DB] hover:border-[#D85A7F]/40 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col overflow-hidden group">
      {/* College Image Header */}
      <div className="relative h-44 w-full overflow-hidden bg-[#FDF2F4]">
        <img
          src={heroImage}
          alt={college.name}
          onError={(e) => handleImageError(e, IMAGES.campusGeneric)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-white/95 backdrop-blur-sm text-[#372B2E] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm border border-[#F1D2DB]">
            Code: {college.code}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
            college.type === "Government"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : college.type === "Government Aided"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-[#FDF2F4] text-[#D85A7F] border border-[#F1D2DB]"
          }`}>
            {college.type}
          </span>
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-amber-600 px-2 py-0.5 rounded-full flex items-center space-x-1 text-xs font-bold shadow-sm border border-amber-100">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{college.overall_rating?.toFixed(1) || "4.5"}</span>
        </div>

        {/* Bottom District Pill */}
        <div className="absolute bottom-2.5 left-3 flex items-center space-x-1 text-white text-xs font-medium drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-rose-300" />
          <span>{college.district}, Tamil Nadu</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/colleges/${college.id}`}
            className="block font-bold text-base text-[#372B2E] hover:text-[#D85A7F] transition-colors leading-snug line-clamp-2 mb-1"
          >
            {college.name}
          </Link>
          <span className="text-[11px] text-[#8E7E84] block mb-3">
            {college.nirf_rank || "Anna University Affiliated"} • Est. {college.established_year || "N/A"}
          </span>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF7F8] p-2.5 rounded-xl border border-[#F1D2DB]/60 mb-3">
            <div>
              <span className="text-[10px] text-[#8E7E84] block uppercase tracking-wider">Tuition Fee</span>
              <span className="font-extrabold text-[#372B2E]">
                ₹{fees.tuition_fee_annual ? fees.tuition_fee_annual.toLocaleString("en-IN") : "N/A"}
                <span className="text-[10px] font-normal text-[#8E7E84]">/yr</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E7E84] block uppercase tracking-wider">Avg Package</span>
              <span className="font-extrabold text-[#D85A7F]">
                ₹{placements.average_package_lpa ? `${placements.average_package_lpa} LPA` : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E7E84] block uppercase tracking-wider">Hostel</span>
              <span className="font-medium text-[#372B2E] flex items-center space-x-1">
                <Home className="w-3 h-3 text-[#D85A7F]" />
                <span>{hostel.available ? "Available" : "Not available"}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E7E84] block uppercase tracking-wider">Placements</span>
              <span className="font-medium text-emerald-700">
                {placements.placement_percentage ? `${placements.placement_percentage}% placed` : "N/A"}
              </span>
            </div>
          </div>

          {/* Branches list preview */}
          <div>
            <span className="text-[10px] font-bold text-[#8E7E84] uppercase tracking-wider block mb-1">
              Top Engineering Branches
            </span>
            <div className="flex flex-wrap gap-1">
              {branches.slice(0, 3).map((b, idx) => (
                <span
                  key={idx}
                  className="bg-[#FDF2F4] text-[#6E5D63] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#F1D2DB]/70"
                >
                  {b.branch_code || b.branch_name}
                </span>
              ))}
              {branches.length > 3 && (
                <span className="text-[10px] text-[#8E7E84] self-center px-1">
                  +{branches.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#F1D2DB]/60 flex items-center space-x-2">
          <Link
            to={`/colleges/${college.id}`}
            className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] rounded-xl shadow-soft-sm flex items-center justify-center space-x-1 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(college)}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center ${
                isCompared
                  ? "bg-[#D85A7F] text-white border-[#D85A7F]"
                  : "bg-white text-[#6E5D63] border-[#F1D2DB] hover:border-[#D85A7F] hover:text-[#D85A7F]"
              }`}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
              {isCompared ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
