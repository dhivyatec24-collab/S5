import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { cutoffAPI, collegesAPI } from "../services/api";
import {
  Calculator,
  Sparkles,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3
} from "lucide-react";
import { IMAGES, handleImageError } from "../assets/images";

export default function CutoffPredictor() {
  const { user } = useAuth();

  // Calculator inputs
  const [maths, setMaths] = useState(user?.maths || 95);
  const [physics, setPhysics] = useState(user?.physics || 90);
  const [chemistry, setChemistry] = useState(user?.chemistry || 92);

  // Live Cutoff calculation
  const m = parseFloat(maths) || 0;
  const p = parseFloat(physics) || 0;
  const c = parseFloat(chemistry) || 0;
  const cutoff = (m + p / 2 + c / 2).toFixed(2);

  // ML Prediction form
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeCode, setSelectedCollegeCode] = useState("0001");
  const [selectedBranchCode, setSelectedBranchCode] = useState("CSE");
  const [community, setCommunity] = useState(user?.community || "BC");
  const [mlResult, setMlResult] = useState(null);
  const [mlMetrics, setMlMetrics] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    // Load colleges and ML metrics
    collegesAPI
      .list()
      .then((res) => setColleges(res.data.colleges || []))
      .catch((err) => console.error("Error loading colleges:", err));

    cutoffAPI
      .getMlMetrics()
      .then((res) => setMlMetrics(res.data))
      .catch((err) => console.error("Error loading ML metrics:", err));
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredicting(true);

    // Find selected college's branch cutoff
    const college = colleges.find((col) => col.code === selectedCollegeCode);
    let closingCut = 197.5;
    if (college && college.branches) {
      const b = college.branches.find((br) => br.branch_code === selectedBranchCode);
      if (b && b.cutoffs_2023) {
        closingCut = b.cutoffs_2023[community] || b.cutoffs_2023["OC"] || 195.0;
      }
    }

    try {
      const res = await cutoffAPI.predict({
        student_cutoff: parseFloat(cutoff),
        closing_cutoff: closingCut,
        community: community,
        college_code: selectedCollegeCode,
        branch_code: selectedBranchCode,
        admission_year: 2023
      });
      setMlResult({
        ...res.data,
        collegeName: college?.short_name || "College",
        branchName: selectedBranchCode,
        closingCutoff: closingCut,
      });
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F]">
            <Calculator className="w-3.5 h-3.5" />
            <span>Standard TNEA Formula</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Know Your Cutoff. Know Your Options.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] max-w-xl">
            TNEA engineering cutoff is strictly calculated out of 200 marks using your 12th Mathematics, Physics, and Chemistry scores.
          </p>
        </div>

        <div className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden shadow-soft-sm border border-[#F1D2DB] hidden sm:block">
          <img
            src={IMAGES.degreeGraduation}
            alt="Graduation Achievement"
            onError={(e) => handleImageError(e)}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Formula & Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="border-b border-[#F1D2DB] pb-4">
            <h2 className="text-lg font-black text-[#372B2E] flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-[#D85A7F]" />
              <span>Interactive Cutoff Calculator</span>
            </h2>
            <p className="text-xs text-[#6E5D63] mt-1">
              Adjust your subject marks below to instantly recalculate your TNEA engineering cutoff.
            </p>
          </div>

          {/* Formula Display Card */}
          <div className="bg-[#FAF7F8] p-4 rounded-2xl border border-[#F1D2DB]/80 space-y-2">
            <span className="text-[10px] font-extrabold text-[#8E7E84] uppercase tracking-wider block">
              Official TNEA Calculation Formula
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-[#D85A7F] font-mono bg-white p-2.5 rounded-xl border border-[#F1D2DB] shadow-soft-sm">
              TNEA Cutoff = Mathematics + (Physics / 2) + (Chemistry / 2)
            </div>
            <div className="text-[11px] text-[#6E5D63] flex items-center justify-between pt-1">
              <span>Maximum Cutoff: <strong>200.0 Marks</strong></span>
              <span>Maths (100) + Physics (50) + Chem (50)</span>
            </div>
          </div>

          {/* Sliders and Inputs */}
          <div className="space-y-5">
            {/* Mathematics */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-[#372B2E]">
                  Mathematics Mark (100% Weightage)
                </label>
                <span className="font-black text-[#D85A7F] text-sm">
                  {m} <span className="text-xs font-normal text-[#8E7E84]">/ 100</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={m}
                onChange={(e) => setMaths(e.target.value)}
                className="w-full accent-[#D85A7F]"
              />
              <span className="text-[10px] text-[#8E7E84] block">
                Contributes directly: <strong>{m} marks</strong>
              </span>
            </div>

            {/* Physics */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-[#372B2E]">
                  Physics Mark (Halved to 50 Max)
                </label>
                <span className="font-black text-[#372B2E] text-sm">
                  {p} <span className="text-xs font-normal text-[#8E7E84]">/ 100</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={p}
                onChange={(e) => setPhysics(e.target.value)}
                className="w-full accent-[#D85A7F]"
              />
              <span className="text-[10px] text-[#8E7E84] block">
                Calculated contribution: {p} / 2 = <strong>{p / 2} marks</strong>
              </span>
            </div>

            {/* Chemistry */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-[#372B2E]">
                  Chemistry Mark (Halved to 50 Max)
                </label>
                <span className="font-black text-[#372B2E] text-sm">
                  {c} <span className="text-xs font-normal text-[#8E7E84]">/ 100</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={c}
                onChange={(e) => setChemistry(e.target.value)}
                className="w-full accent-[#D85A7F]"
              />
              <span className="text-[10px] text-[#8E7E84] block">
                Calculated contribution: {c} / 2 = <strong>{c / 2} marks</strong>
              </span>
            </div>
          </div>

          {/* Live Cutoff Result Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FDE8ED] to-[#FFF5F7] border border-[#F1D2DB] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#8E7E84] block">Your Calculated TNEA Cutoff:</span>
              <span className="text-xs text-[#6E5D63] font-mono mt-0.5 block">
                {m} + {p / 2} + {c / 2}
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[#D85A7F]">{cutoff}</span>
              <span className="text-xs text-[#8E7E84] font-semibold block">/ 200.0</span>
            </div>
          </div>
        </div>

        {/* Right Column: Random Forest Likelihood Predictor (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#F1D2DB] pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#D85A7F]" />
                <h2 className="text-lg font-black text-[#372B2E]">
                  Random Forest Predictor
                </h2>
              </div>
              <p className="text-xs text-[#6E5D63] mt-1">
                Evaluates historical admission likelihood using trained Random Forest classification.
              </p>
            </div>

            <form onSubmit={handlePredict} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#372B2E] mb-1">Target College</label>
                <select
                  value={selectedCollegeCode}
                  onChange={(e) => setSelectedCollegeCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl text-xs font-semibold text-[#372B2E] focus:outline-none focus:border-[#D85A7F]"
                >
                  {colleges.length === 0 ? (
                    <option value="0001">Loading verified TNEA colleges...</option>
                  ) : (
                    colleges.map((col) => (
                      <option key={col.code} value={col.code}>
                        {col.short_name} (Code: {col.code})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#372B2E] mb-1">Engineering Branch</label>
                <select
                  value={selectedBranchCode}
                  onChange={(e) => setSelectedBranchCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl text-xs font-semibold text-[#372B2E] focus:outline-none focus:border-[#D85A7F]"
                >
                  <option value="CSE">Computer Science and Engineering (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics and Communication (ECE)</option>
                  <option value="AIDS">Artificial Intelligence & Data Science (AIDS)</option>
                  <option value="AIML">AI & Machine Learning (AIML)</option>
                  <option value="MECH">Mechanical Engineering (MECH)</option>
                  <option value="CIVIL">Civil Engineering (CIVIL)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#372B2E] mb-1">TNEA Community</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl text-xs font-semibold text-[#372B2E] focus:outline-none focus:border-[#D85A7F]"
                >
                  <option value="OC">OC (Open Competition)</option>
                  <option value="BC">BC (Backward Class)</option>
                  <option value="BCM">BCM (Backward Class Muslim)</option>
                  <option value="MBC">MBC (Most Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="SCA">SCA (SC Arunthathiyar)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={predicting}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] shadow-soft-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>{predicting ? "Evaluating Likelihood..." : "Predict Admission Likelihood"}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>

            {/* Prediction Output Card */}
            {mlResult && (
              <div className="p-4 rounded-2xl bg-[#FAF7F8] border border-[#F1D2DB] space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    mlResult.tier === "Safe"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : mlResult.tier === "Target"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {mlResult.tier} Opportunity
                  </span>
                  <span className="text-xs font-bold text-[#D85A7F]">
                    Confidence: {(mlResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="text-xs text-[#372B2E] font-semibold">
                  {mlResult.collegeName} — {mlResult.branchName}
                </div>

                <p className="text-[11px] text-[#6E5D63] leading-relaxed">
                  {mlResult.reason}
                </p>

                <div className="pt-2 border-t border-[#F1D2DB]/60 flex justify-between text-[10px] text-[#8E7E84]">
                  <span>Historical Closing: {mlResult.closingCutoff}</span>
                  <span>Cutoff Delta: {mlResult.delta >= 0 ? `+${mlResult.delta}` : mlResult.delta}</span>
                </div>
              </div>
            )}
          </div>

          {/* Genuine ML Metrics Disclosure */}
          {mlMetrics && (
            <div className="pt-4 border-t border-[#F1D2DB] space-y-2">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#372B2E]">
                <BarChart3 className="w-4 h-4 text-[#D85A7F]" />
                <span>Model Verification & True Test Metrics</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#FAF7F8] p-1.5 rounded-lg border border-[#F1D2DB]/60">
                  <span className="text-[9px] text-[#8E7E84] block">Accuracy</span>
                  <span className="text-xs font-black text-[#D85A7F]">
                    {(mlMetrics.evaluation_metrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-[#FAF7F8] p-1.5 rounded-lg border border-[#F1D2DB]/60">
                  <span className="text-[9px] text-[#8E7E84] block">Precision</span>
                  <span className="text-xs font-black text-[#D85A7F]">
                    {(mlMetrics.evaluation_metrics.precision * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-[#FAF7F8] p-1.5 rounded-lg border border-[#F1D2DB]/60">
                  <span className="text-[9px] text-[#8E7E84] block">Recall</span>
                  <span className="text-xs font-black text-[#D85A7F]">
                    {(mlMetrics.evaluation_metrics.recall * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-[#FAF7F8] p-1.5 rounded-lg border border-[#F1D2DB]/60">
                  <span className="text-[9px] text-[#8E7E84] block">F1-Score</span>
                  <span className="text-xs font-black text-[#D85A7F]">
                    {(mlMetrics.evaluation_metrics.f1_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-[#8E7E84] leading-tight">
                *Trained using scikit-learn RandomForestClassifier with {mlMetrics.training_samples?.toLocaleString()} samples on TNEA historical cutoffs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
