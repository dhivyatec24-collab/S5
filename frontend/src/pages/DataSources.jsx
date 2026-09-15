import React from "react";
import {
  Database,
  ShieldCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Award,
  Building
} from "lucide-react";

export default function DataSources() {
  const sources = [
    {
      name: "Directorate of Technical Education (DoTE) Tamil Nadu — TNEA",
      scope: "Official 4-digit college codes, engineering branches, category-wise closing cutoffs (OC, BC, BCM, MBC, SC, SCA, ST), seat matrices, and counselling round regulations.",
      type: "Official Government Statutory Authority",
      authority: "Government of Tamil Nadu",
      url: "https://www.tneaonline.org",
      verified: true
    },
    {
      name: "Anna University, Chennai — Academic Affiliation & Fees",
      scope: "University Departments (CEG, MIT, ACT, SAP), constituent engineering campuses, autonomous status determinations, and academic fee orders.",
      type: "State Technological University Portal",
      authority: "Anna University",
      url: "https://www.annauniv.edu",
      verified: true
    },
    {
      name: "National Institutional Ranking Framework (NIRF) — Ministry of Education",
      scope: "Verified annual placement percentages, highest, median, and average salary disclosures, student intake, and institutional research output.",
      type: "National Ranking Framework",
      authority: "Ministry of Education, Government of India",
      url: "https://www.nirfindia.org",
      verified: true
    },
    {
      name: "Tamil Nadu Committee on Fixation of Fee in Self Financing Professional Colleges",
      scope: "Approved statutory maximum tuition fee ceilings for accredited and non-accredited B.E./B.Tech degree programs.",
      type: "Statutory Judicial Committee",
      authority: "Government of Tamil Nadu",
      url: "https://www.tn.gov.in",
      verified: true
    },
    {
      name: "AICTE Mandatory Institutional Disclosures",
      scope: "Campus land acreage, laboratory and equipment inventory, central library books and journal subscriptions, and sports/hostel infrastructure.",
      type: "National Regulatory Council",
      authority: "All India Council for Technical Education",
      url: "https://www.aicte-india.org",
      verified: true
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Strict Transparency Policy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
          Data Sources & Transparency
        </h1>
        <p className="text-xs sm:text-sm text-[#6E5D63] mt-1 max-w-2xl">
          To protect Tamil Nadu engineering students from misleading commercial marketing, every single cutoff, fee, placement metric, and rating displayed on this counselor is backed by authentic public disclosures.
        </p>
      </div>

      {/* Core Transparency Directives */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center font-black text-xs">
            1
          </div>
          <h3 className="font-bold text-xs text-[#372B2E]">
            Zero Fabricated Data
          </h3>
          <p className="text-[11px] text-[#6E5D63] leading-relaxed">
            Whenever an official statistic or hostel spec is unverified in public records, we explicitly display <em>"Information not available"</em> rather than inventing false claims.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center font-black text-xs">
            2
          </div>
          <h3 className="font-bold text-xs text-[#372B2E]">
            Authentic Cutoffs Only
          </h3>
          <p className="text-[11px] text-[#6E5D63] leading-relaxed">
            Closing cutoff scores correspond strictly to DoTE TNEA archives for 2022 and 2023 across all reservation categories (OC, BC, BCM, MBC, SC, SCA, ST).
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F1D2DB] shadow-soft-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center font-black text-xs">
            3
          </div>
          <h3 className="font-bold text-xs text-[#372B2E]">
            Statistically Honest ML
          </h3>
          <p className="text-[11px] text-[#6E5D63] leading-relaxed">
            Machine Learning predictions represent statistical likelihood estimates grounded on historical admissions, not guaranteed promises of seat allotment.
          </p>
        </div>
      </div>

      {/* Sources Table / List */}
      <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
        <h2 className="text-lg font-black text-[#372B2E] border-b border-[#F1D2DB] pb-3">
          Official Government & Regulatory Sources
        </h2>

        <div className="space-y-4">
          {sources.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] space-y-2 hover:border-[#D85A7F] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-xs sm:text-sm text-[#372B2E]">
                    {s.name}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#D85A7F] bg-white border border-[#F1D2DB] px-2.5 py-0.5 rounded-full w-fit">
                  {s.type}
                </span>
              </div>

              <p className="text-xs text-[#6E5D63] leading-relaxed">
                {s.scope}
              </p>

              <div className="pt-2 border-t border-[#F1D2DB]/60 flex items-center justify-between text-[11px]">
                <span className="text-[#8E7E84]">Authority: <strong>{s.authority}</strong></span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#D85A7F] hover:underline flex items-center space-x-1"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Legal Disclaimer */}
      <div className="p-6 rounded-3xl bg-[#FAF7F8] border border-[#F1D2DB] text-xs text-[#6E5D63] space-y-2">
        <div className="flex items-center space-x-2 font-black text-[#372B2E]">
          <Info className="w-4 h-4 text-[#D85A7F]" />
          <span>Statutory Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          Smart College Admission Counselor Agent is an educational guidance decision-support tool. It is not affiliated with the Directorate of Technical Education (DoTE) or the Tamil Nadu Government. Cutoff predictions, admission likelihoods, and comparisons are intended solely for academic planning and do not constitute an official seat allotment or offer of admission. All students are advised to check <a href="https://www.tneaonline.org" target="_blank" rel="noopener noreferrer" className="text-[#D85A7F] font-bold underline">tneaonline.org</a> for binding announcements during the counselling window.
        </p>
      </div>
    </div>
  );
}
