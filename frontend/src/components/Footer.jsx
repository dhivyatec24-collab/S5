import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#F1D2DB] mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#F1D2DB]">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F8D7DE] flex items-center justify-center text-[#D85A7F]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-[#372B2E]">
                SMART COLLEGE ADMISSION COUNSELOR
              </span>
            </div>
            <p className="text-xs text-[#6E5D63] leading-relaxed max-w-lg">
              An intelligent, transparent admission guidance platform designed exclusively
              for Tamil Nadu students pursuing B.E./B.Tech engineering degrees through TNEA.
              Supporting Tamil Nadu State Board and CBSE aspirants with authentic data and verified disclosures.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#B83B60] font-semibold bg-[#FDF2F4] px-3 py-1.5 rounded-lg inline-flex border border-[#F1D2DB]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Data Transparency & Verified Sourcing Standards</span>
            </div>
          </div>

          {/* Quick Guidance Links */}
          <div>
            <h4 className="text-xs font-bold text-[#372B2E] uppercase tracking-wider mb-3">
              Guidance Features
            </h4>
            <ul className="space-y-2 text-xs text-[#6E5D63]">
              <li>
                <Link to="/cutoff-predictor" className="hover:text-[#D85A7F] transition-colors">
                  TNEA Cutoff Calculator
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-[#D85A7F] transition-colors">
                  Find Engineering Colleges
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-[#D85A7F] transition-colors">
                  Dream, Target & Safe Options
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#D85A7F] transition-colors">
                  College Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/counselor" className="hover:text-[#D85A7F] transition-colors">
                  AI Admission Counselor
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Official Portals */}
          <div>
            <h4 className="text-xs font-bold text-[#372B2E] uppercase tracking-wider mb-3">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs text-[#6E5D63]">
              <li>
                <a
                  href="https://www.tneaonline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-[#D85A7F] transition-colors"
                >
                  <span>TNEA Online (DoTE)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.annauniv.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-[#D85A7F] transition-colors"
                >
                  <span>Anna University Chennai</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nirfindia.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-[#D85A7F] transition-colors"
                >
                  <span>NIRF India Engineering</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/sources" className="hover:text-[#D85A7F] font-semibold text-[#D85A7F]">
                  View Sourcing & Disclaimers →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bottom Banner */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8E7E84] space-y-2 sm:space-y-0">
          <p>
            © 2026 Smart College Admission Counselor Agent. Exclusively for Tamil Nadu TNEA Engineering Aspirants.
          </p>
          <div className="flex items-center space-x-1">
            <span>Crafted with academic precision for TN students</span>
            <Heart className="w-3 h-3 text-[#D85A7F] inline fill-[#D85A7F]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
