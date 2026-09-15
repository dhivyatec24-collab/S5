import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Calculator,
  Compass,
  GitCompare,
  Sparkles,
  Bot,
  ShieldCheck,
  Building,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Users
} from "lucide-react";
import { IMAGES, handleImageError } from "../assets/images";

export default function Home() {
  const featureCards = [
    {
      title: "AI Cutoff Prediction",
      desc: "Predict your admission likelihood across top colleges using an authentic scikit-learn Random Forest model trained on TNEA closing archives.",
      icon: Calculator,
      link: "/cutoff-predictor",
      badge: "Machine Learning",
    },
    {
      title: "College Recommendation",
      desc: "Discover colleges categorized into Dream, Target, and Safe opportunities based strictly on your 12th cutoff and reservation community.",
      icon: Sparkles,
      link: "/recommendations",
      badge: "Categorized Tiers",
    },
    {
      title: "College Comparison",
      desc: "Compare up to 4 premier colleges side-by-side on verified fees, placement packages, hostel living, and personalized suitability scores.",
      icon: GitCompare,
      link: "/compare",
      badge: "Suitability Matrix",
    },
    {
      title: "AI Admission Counselor",
      desc: "Engage in grounded counseling on choice filling, counselling rounds, cutoff feasibility, and branch choices using verified facts.",
      icon: Bot,
      link: "/counselor",
      badge: "RAG Fact-Grounded",
    },
    {
      title: "TNEA Guidance & Disclosures",
      desc: "Transparent access to DoTE guidelines, Anna University fee structures, NIRF reports, and AICTE mandatory disclosures.",
      icon: BookOpen,
      link: "/sources",
      badge: "100% Sourced",
    },
    {
      title: "Engineering Discovery",
      desc: "Explore top government, government-aided, and autonomous engineering colleges in Chennai, Coimbatore, Madurai, and more.",
      icon: Compass,
      link: "/colleges",
      badge: "District Filters",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDF0F3] to-[#FAF7F8] pt-12 pb-20 border-b border-[#F1D2DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F1D2DB] text-xs font-bold text-[#D85A7F] shadow-soft-sm">
                <Sparkles className="w-4 h-4" />
                <span>Exclusively for Tamil Nadu B.E./B.Tech Aspirants</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#372B2E] tracking-tight leading-[1.15]">
                Find the Right Engineering College for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87A8B] to-[#D85A7F]">
                  Your Future
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#6E5D63] max-w-2xl leading-relaxed mx-auto lg:mx-0">
                AI-powered Tamil Nadu engineering admission guidance based on your 12th marks,
                preferences, and authentic TNEA closing cutoffs. Designed specifically for State Board & CBSE students.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <Link
                  to="/cutoff-predictor"
                  className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] shadow-soft-md hover:shadow-soft-lg transition-all flex items-center space-x-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Check My Cutoff</span>
                </Link>

                <Link
                  to="/colleges"
                  className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#372B2E] bg-white hover:bg-[#FDF2F4] border border-[#F1D2DB] shadow-soft-sm transition-all flex items-center space-x-2"
                >
                  <Compass className="w-4 h-4 text-[#D85A7F]" />
                  <span>Find My Colleges</span>
                </Link>

                <Link
                  to="/counselor"
                  className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#D85A7F] bg-[#FDF2F4] hover:bg-[#FCE7E9] border border-[#F1D2DB] transition-all flex items-center space-x-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Talk to Counselor</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#F1D2DB]/80 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="text-lg sm:text-xl font-black text-[#372B2E] block">200.0</span>
                  <span className="text-[11px] font-medium text-[#8E7E84]">TNEA Standard Formula</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-[#372B2E] block">100%</span>
                  <span className="text-[11px] font-medium text-[#8E7E84]">Sourced Information</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-[#D85A7F] block">Zero</span>
                  <span className="text-[11px] font-medium text-[#8E7E84]">Fabricated Data</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-soft-lg border-2 border-white bg-white">
                <img
                  src={IMAGES.heroStudent}
                  alt="Engineering College Student with Laptop"
                  onError={(e) => handleImageError(e, IMAGES.campusGeneric)}
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="bg-white/95 backdrop-blur-md text-[#372B2E] p-3.5 rounded-2xl shadow-soft-md border border-[#F1D2DB] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center space-x-1.5 text-[#D85A7F]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>TNEA 2026 Cutoff Ready</span>
                      </span>
                      <span className="text-[10px] font-black bg-[#FDF2F4] text-[#D85A7F] px-2 py-0.5 rounded-full">
                        Maths + Phy/2 + Chem/2
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E5D63]">
                      Calculate your cutoff out of 200 and receive data-driven recommendations across Anna University departments and top autonomous colleges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Comprehensive Guidance for Every Step
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5D63] mt-2">
            From cutoff prediction to choice filling strategies, access transparent information without commercial bias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, i) => (
            <Link
              key={i}
              to={feat.link}
              className="bg-white p-6 rounded-3xl border border-[#F1D2DB] shadow-soft-sm hover:shadow-soft-md hover:border-[#D85A7F]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#D85A7F] bg-[#FDF2F4] px-2.5 py-1 rounded-full border border-[#F1D2DB]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#372B2E] group-hover:text-[#D85A7F] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#6E5D63] leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F1D2DB]/60 flex items-center text-xs font-bold text-[#D85A7F]">
                <span>Explore Feature</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified Colleges Banner with Visuals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FFF5F7] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-8 sm:p-10 shadow-soft-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#D85A7F] tracking-wider uppercase">
                Premier Tamil Nadu Institutions
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
                CEG, MIT, PSG Tech, SSN, CIT, TCE & More
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5D63] leading-relaxed">
                Directly explore official TNEA college codes, official fee breakdown structures approved by the Tamil Nadu Fee Fixation Committee, and verified NIRF 2024 placement statistics.
              </p>
              <div className="pt-2">
                <Link
                  to="/colleges"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#D85A7F] hover:bg-[#B83B60] transition-colors"
                >
                  <span>Browse College Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden border border-[#F1D2DB] shadow-soft-sm">
                <img
                  src={IMAGES.campusGeneric}
                  alt="College Campus"
                  onError={(e) => handleImageError(e)}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-white text-center">
                  <span className="text-[11px] font-bold text-[#372B2E] block">CEG Anna University</span>
                  <span className="text-[9px] text-[#8E7E84]">Code 0001 • NIRF #13</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#F1D2DB] shadow-soft-sm">
                <img
                  src={IMAGES.celebratingGraduates}
                  alt="Graduation Celebrations"
                  onError={(e) => handleImageError(e)}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-white text-center">
                  <span className="text-[11px] font-bold text-[#372B2E] block">PSG Tech Coimbatore</span>
                  <span className="text-[9px] text-[#8E7E84]">Code 2006 • NIRF #63</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
