import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { chatAPI } from "../services/api";
import {
  Bot,
  User,
  Sparkles,
  Send,
  Loader2,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Calculator,
  Compass,
  ArrowRight
} from "lucide-react";

const SUGGESTED_QUERIES = [
  "How is engineering cutoff calculated?",
  "What colleges can I get with 185 cutoff for CSE?",
  "Tell me about CEG Guindy fees and placements",
  "Which engineering colleges in Coimbatore have hostel?",
  "What is the difference between CSE and ECE?",
  "What documents are required for TNEA verification?",
  "How does TNEA online counselling work?",
  "How should I prioritize choices in choice filling?"
];

export default function AICounselor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Vanakkam! I am your AI Admission Counselor for Tamil Nadu Engineering Admissions.\n\n" +
        "I am connected directly to our verified TNEA 2022-2023 closing cutoff records, official Anna University fee schedules, and mandatory AICTE disclosures.\n\n" +
        "How can I assist you with your college selection today?",
      sources: ["DoTE TNEA Archive", "Anna University Affiliation Portal"],
      suggested_actions: ["Calculate my cutoff", "Colleges for 185 cutoff", "Explain TNEA counselling rounds"]
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const text = messageText || inputValue.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const studentProfile = user
        ? {
            calculated_cutoff: user.calculated_cutoff,
            community: user.community,
            preferred_branch: user.preferred_branch,
            preferred_district: user.preferred_district,
            budget: user.budget,
          }
        : null;

      const res = await chatAPI.sendMessage(text, studentProfile);
      const assistantMessage = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
        suggested_actions: res.data.suggested_actions || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a momentary connection error. Please ensure the backend server is running.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FDF0F3] to-[#F5EEFA] rounded-3xl border border-[#F1D2DB] p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#F1D2DB] text-[11px] font-bold text-[#D85A7F] mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Fact-Grounded TNEA Counseling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#372B2E] tracking-tight">
            Your AI Admission Counselor
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D63] mt-1 max-w-xl">
            Ask anything about Tamil Nadu engineering admissions, choice order, cutoff thresholds, fees, and campus living.
          </p>
        </div>

        {user && (
          <div className="bg-white px-4 py-3 rounded-2xl border border-[#F1D2DB] shadow-soft-sm shrink-0 text-right">
            <span className="text-[10px] font-bold text-[#8E7E84] block">Your Profile Cutoff</span>
            <span className="text-xl font-black text-[#D85A7F]">{user.calculated_cutoff}/200</span>
            <span className="text-[10px] text-[#6E5D63] block">{user.community} Community</span>
          </div>
        )}
      </div>

      {/* Suggested Questions Grid */}
      <div className="bg-white rounded-3xl border border-[#F1D2DB] p-6 shadow-soft-sm space-y-3">
        <span className="text-xs font-black text-[#372B2E] uppercase tracking-wider block">
          Frequently Asked Questions (Click to ask instantly)
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold text-[#6E5D63] hover:text-[#D85A7F] bg-[#FAF7F8] hover:bg-[#FDF2F4] border border-[#F1D2DB] hover:border-[#D85A7F] px-3.5 py-1.5 rounded-xl transition-all shadow-soft-sm text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Chat Panel */}
      <div className="bg-white rounded-3xl border border-[#F1D2DB] shadow-soft-sm overflow-hidden flex flex-col h-[650px]">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#FAF7F8]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-end space-x-3 max-w-[85%]">
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-2xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center shrink-0 mb-1 border border-[#F1D2DB]">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] text-white rounded-br-none shadow-soft-sm font-medium"
                      : "bg-white text-[#372B2E] border border-[#F1D2DB] rounded-bl-none shadow-soft-sm"
                  }`}
                >
                  <div className="whitespace-pre-line">{m.content}</div>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#F1D2DB]/60 text-[11px] text-[#8E7E84] flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D85A7F]" />
                      <span className="font-bold text-[#D85A7F]">Verified Sources:</span>
                      <span>{m.sources.join(", ")}</span>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-2xl bg-[#D85A7F] text-white flex items-center justify-center shrink-0 mb-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Follow up suggestions */}
              {m.suggested_actions && m.suggested_actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-11">
                  {m.suggested_actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(act)}
                      className="text-xs font-semibold text-[#D85A7F] bg-white border border-[#F1D2DB] hover:bg-[#FDF2F4] px-3 py-1 rounded-full transition-colors shadow-soft-sm"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#8E7E84] bg-white p-3.5 rounded-2xl border border-[#F1D2DB] w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-[#D85A7F]" />
              <span>AI Counselor is retrieving verified facts from TNEA database...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-[#F1D2DB] flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question about engineering admissions, colleges, or cutoff marks..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#FAF7F8] border border-[#F1D2DB] rounded-2xl focus:outline-none focus:border-[#D85A7F] text-[#372B2E] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] disabled:opacity-50 shadow-soft-sm flex items-center space-x-2 transition-all"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
