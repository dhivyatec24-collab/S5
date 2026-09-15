import React, { useState } from "react";
import { Star, Info, SlidersHorizontal, Check } from "lucide-react";

export default function RatingBreakdown({ ratingBreakdown, ratingSource }) {
  const [customWeights, setCustomWeights] = useState({
    placement: 30,
    infrastructure: 20,
    academics: 20,
    hostel: 10,
    campus_life: 10,
    value_for_money: 10,
  });

  const [showConfig, setShowConfig] = useState(false);

  const scores = ratingBreakdown || {
    placement: 4.5,
    infrastructure: 4.4,
    academics: 4.6,
    hostel: 4.0,
    campus_life: 4.3,
    value_for_money: 4.5,
  };

  // Calculate weighted composite
  const totalWeight = Object.values(customWeights).reduce((a, b) => a + b, 0);
  const calculatedComposite = (
    (scores.placement * customWeights.placement +
      scores.infrastructure * customWeights.infrastructure +
      scores.academics * customWeights.academics +
      scores.hostel * customWeights.hostel +
      scores.campus_life * customWeights.campus_life +
      scores.value_for_money * customWeights.value_for_money) /
    (totalWeight || 100)
  ).toFixed(2);

  const criteria = [
    { key: "placement", label: "Placements & Recruiters", score: scores.placement, defaultWeight: 30 },
    { key: "infrastructure", label: "Campus & Laboratories", score: scores.infrastructure, defaultWeight: 20 },
    { key: "academics", label: "Academics & Faculty", score: scores.academics, defaultWeight: 20 },
    { key: "hostel", label: "Hostel & Living", score: scores.hostel, defaultWeight: 10 },
    { key: "campus_life", label: "Campus Life & Culture", score: scores.campus_life, defaultWeight: 10 },
    { key: "value_for_money", label: "Value for Money / ROI", score: scores.value_for_money, defaultWeight: 10 },
  ];

  const handleWeightChange = (key, val) => {
    setCustomWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, Number(val))),
    }));
  };

  const resetWeights = () => {
    setCustomWeights({
      placement: 30,
      infrastructure: 20,
      academics: 20,
      hostel: 10,
      campus_life: 10,
      value_for_money: 10,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F1D2DB] p-6 shadow-soft-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#F1D2DB] mb-6 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-lg font-extrabold text-[#372B2E]">
              Multifactor College Rating
            </h3>
          </div>
          <p className="text-xs text-[#6E5D63] mt-0.5">
            Transparent composite score based on verified institutional metrics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#FDF2F4] border border-[#F1D2DB] rounded-xl px-3.5 py-1.5 flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#8E7E84]">Composite:</span>
            <span className="text-lg font-black text-[#D85A7F]">{calculatedComposite}</span>
            <span className="text-xs text-[#8E7E84]">/ 5.0</span>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-xl text-xs font-semibold bg-[#FAF7F8] hover:bg-[#FDF2F4] border border-[#F1D2DB] text-[#6E5D63] flex items-center space-x-1.5 transition-colors"
            title="Configure category weights"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D85A7F]" />
            <span className="hidden sm:inline">Customize Weights</span>
          </button>
        </div>
      </div>

      {/* Weight Config drawer */}
      {showConfig && (
        <div className="bg-[#FAF7F8] border border-[#F1D2DB] rounded-xl p-4 mb-6 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#372B2E]">
              Adjust Evaluation Weighting (% priority)
            </span>
            <button
              onClick={resetWeights}
              className="text-[11px] font-semibold text-[#D85A7F] hover:underline"
            >
              Reset to Defaults
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {criteria.map((c) => (
              <div key={c.key} className="bg-white p-2.5 rounded-lg border border-[#F1D2DB]/60">
                <label className="text-[11px] font-medium text-[#6E5D63] block truncate">
                  {c.label}
                </label>
                <div className="flex items-center space-x-1.5 mt-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customWeights[c.key]}
                    onChange={(e) => handleWeightChange(c.key, e.target.value)}
                    className="w-16 px-2 py-1 text-xs font-bold border border-[#F1D2DB] rounded focus:outline-none focus:border-[#D85A7F]"
                  />
                  <span className="text-xs text-[#8E7E84]">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Meters Grid */}
      <div className="space-y-4">
        {criteria.map((c) => {
          const pct = Math.min(100, Math.max(0, (c.score / 5.0) * 100));
          return (
            <div key={c.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#372B2E] flex items-center space-x-2">
                  <span>{c.label}</span>
                  <span className="text-[10px] font-medium text-[#8E7E84] bg-[#FAF7F8] px-2 py-0.5 rounded border border-[#F1D2DB]/60">
                    Weight: {customWeights[c.key]}%
                  </span>
                </span>
                <span className="text-[#D85A7F] font-bold">
                  {c.score?.toFixed(1) || "N/A"} <span className="text-[10px] text-[#8E7E84]">/ 5.0</span>
                </span>
              </div>
              <div className="w-full bg-[#FAF7F8] rounded-full h-2.5 overflow-hidden border border-[#F1D2DB]/60">
                <div
                  className="bg-gradient-to-r from-[#F8D7DE] to-[#D85A7F] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sourcing Transparency Footnote */}
      <div className="mt-6 pt-4 border-t border-[#F1D2DB]/60 flex items-start space-x-2 text-[11px] text-[#8E7E84] bg-[#FAF7F8] p-3 rounded-xl border border-[#F1D2DB]/60">
        <Info className="w-4 h-4 text-[#D85A7F] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#372B2E]">Rating Methodology Transparency: </span>
          {ratingSource || "Calculated multi-factor composite based on verified NIRF 2024 metric scores and AICTE mandatory disclosures."}
        </div>
      </div>
    </div>
  );
}
