import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ExternalLink,
  Loader2,
  HelpCircle,
  Maximize2,
  Minimize2
} from "lucide-react";
import { chatAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ChatBotWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Vanakkam! 👋 I am your AI Admission Counselor for Tamil Nadu Engineering Admissions (TNEA).\n\n" +
        "I can answer your questions on cutoff calculation, realistic college options, verified fees, hostel facilities, placements, and counselling rounds using authentic DoTE records.",
      sources: ["TNEA Online Guidelines", "Anna University Regulations"],
      suggested_actions: ["Calculate my cutoff", "Colleges for 185 cutoff", "Best colleges for CSE", "Explain TNEA counselling"]
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
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
      const assistantMsg = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
        suggested_actions: res.data.suggested_actions || [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection issue. Please verify the backend service is running.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] text-white shadow-soft-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2.5 group"
          aria-label="Open AI Admission Counselor"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold">
            AI Admission Counselor
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl border border-[#F1D2DB] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "w-[92vw] sm:w-[680px] h-[85vh]"
              : "w-[92vw] sm:w-[410px] h-[580px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FDE8ED] via-[#F8D7DE] to-[#F3EEFA] p-4 border-b border-[#F1D2DB] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#D85A7F] flex items-center justify-center shadow-sm border border-[#F1D2DB]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#372B2E] flex items-center space-x-1.5">
                  <span>AI Admission Counselor</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D85A7F]" />
                </h3>
                <p className="text-[11px] text-[#8E7E84]">
                  Authentic Tamil Nadu Engineering Guidance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-[#6E5D63] hover:text-[#372B2E] hover:bg-white/60 transition-colors"
                title={isExpanded ? "Collapse window" : "Expand window"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#6E5D63] hover:text-rose-600 hover:bg-white/60 transition-colors"
                title="Close counselor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7F8]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end space-x-2 max-w-[88%]">
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-xl bg-[#F8D7DE] text-[#D85A7F] flex items-center justify-center shrink-0 mb-1 border border-[#F1D2DB]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] text-white rounded-br-none shadow-soft-sm font-medium"
                        : "bg-white text-[#372B2E] border border-[#F1D2DB] rounded-bl-none shadow-soft-sm"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.content}</div>

                    {/* Sources Badge */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#F1D2DB]/60 text-[10px] text-[#8E7E84] flex items-center space-x-1">
                        <span className="font-semibold text-[#D85A7F]">Source:</span>
                        <span>{m.sources.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-xl bg-[#D85A7F] text-white flex items-center justify-center shrink-0 mb-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Suggested follow-up prompt chips */}
                {m.suggested_actions && m.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                    {m.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(act)}
                        className="text-[11px] font-semibold text-[#D85A7F] bg-white border border-[#F1D2DB] hover:bg-[#FDF2F4] hover:border-[#D85A7F] px-2.5 py-1 rounded-full transition-colors shadow-soft-sm"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-[#8E7E84] bg-white p-3 rounded-2xl border border-[#F1D2DB] w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-[#D85A7F]" />
                <span>AI Counselor is analyzing verified TNEA database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-white border-t border-[#F1D2DB]/60 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-[#8E7E84] shrink-0 font-medium">Quick:</span>
            {[
              "Calculate my cutoff",
              "Which colleges can I get?",
              "Best colleges for CSE",
              "Compare CEG and PSG Tech",
              "Explain TNEA counselling",
            ].map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#FAF7F8] hover:bg-[#FDF2F4] text-[#6E5D63] hover:text-[#D85A7F] border border-[#F1D2DB] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#F1D2DB] flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about cutoffs, fees, hostel, TNEA rounds..."
              className="flex-1 px-4 py-2.5 text-xs bg-[#FAF7F8] border border-[#F1D2DB] rounded-2xl focus:outline-none focus:border-[#D85A7F] focus:bg-white text-[#372B2E] placeholder-[#A09398] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-[#E87A8B] to-[#D85A7F] hover:from-[#D85A7F] hover:to-[#B83B60] text-white disabled:opacity-40 shadow-soft-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
