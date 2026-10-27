"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, BookOpen, ExternalLink, AlertCircle, Fingerprint, LifeBuoy, Shield, Sparkles } from 'lucide-react';

// --- KNOWLEDGE BASE ---
const KNOWLEDGE_BASE = [
  {
    id: "doc_qc_001",
    card: "BMO CashBack Mastercard",
    province: "Quebec",
    keywords: ['quebec', 'balance transfer', 'fee', 'promo'],
    effectiveDate: "March 1, 2026",
    content: "For Quebec residents: The Year 1 $0 annual fee waiver is active. However, the 1% balance transfer fee applies upfront regardless of the waiver. In month 13, the promotional 0.99% rate reverts to the standard 22.99% transfer APR.",
    conditions: ["1% fee applies regardless of annual fee waiver", "Reverts to 22.99% in Month 13", "Applies only to transfers made within first 90 days"],
    source: "Quebec Disclosure Addendum, v2026.1",
    pages: "p.2"
  },
  {
    id: "doc_ins_001",
    card: "BMO Infinite Visa",
    province: "ROC",
    keywords: ['rental', 'damage', 'collision', 'qualify', 'eligible'],
    effectiveDate: "March 1, 2026",
    content: "Collision Damage Waiver (CDW) covers vehicles up to $65,000 MSRP for 48 days. Note: Lumi provides policy parameters; eligibility is determined by the Claims Administrator based on the incident report.",
    conditions: ["MSRP Limit: $65,000", "Duration: 48 days", "Full rental charged to card"],
    source: "Infinite Visa Certificate of Insurance, v2026.1",
    pages: "p.4"
  }
];

const FAQ_ITEMS = [
  { label: "QC Edge Case", query: "Does a Quebec client on a Year 1 $0 fee waiver pay the transfer fee?" },
  { label: "Qualify Query", query: "Does my client qualify for the rental coverage?" },
  { label: "Ambiguous Query", query: "What is the grace period?" },
  { label: "Out of Scope: Mortgages", query: "What is the 5-year fixed mortgage rate?" },
  { label: "Out of Scope: Ops", query: "How do I perform a PIN reset for a client?" }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  conditions?: string[];
  source?: string;
  pages?: string;
  effectiveDate?: string;
  card?: string;
  id?: string;
  province?: string;
  keywords?: string[];
}

export default function LumiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQs, setShowFAQs] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setShowFAQs(true);
  };

  const handleSend = async (forcedQuery?: string) => {
    const queryToProcess = forcedQuery || input;
    if (!queryToProcess.trim() || isTyping) return;

    setShowFAQs(false);
    setMessages(prev => [...prev, { role: 'user', content: queryToProcess }]);
    setInput('');
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      let response: Message = { role: 'assistant', content: '', type: 'answer' };
      const q = queryToProcess.toLowerCase();

      if (q.includes('qualify') || q.includes('eligible') || q.includes('approved')) {
        response.content = "Lumi cannot determine if a client qualifies. The policy states the following requirements, but the final decision rests with the Claims Administrator or Underwriting:";
        response.conditions = ["Vehicle MSRP under $65,000", "Primary cardholder present", "Rental declined at counter"];
        response.source = "Standard Terms & Conditions";
      } else if (q === "what is the grace period?" || q === "grace period") {
        response.content = "To provide the correct grace period, please specify if you are looking for the CashBack Mastercard, Infinite Visa, or a Quebec-specific disclosure.";
        response.type = 'clarification';
      } else if (q.includes('quebec') && q.includes('transfer')) {
        const doc = KNOWLEDGE_BASE[0];
        response = { ...response, ...doc, role: 'assistant', type: 'answer' };
      } else if (q.includes('mortgage') || q.includes('rate')) {
        response.content = "This assistant is restricted to credit card benefits and fees. For mortgage rates and lending policy, please refer to the Mortgage & Lending Policy portal.";
        response.type = 'redirect';
      } else if (q.includes('pin') || q.includes('reset')) {
        response.content = "PIN resets are a branch operational procedure. This assistant covers card products only. Please see the Branch Operations library.";
        response.type = 'redirect';
      } else {
        response.content = "I cannot answer this from the active knowledge base. This may be due to an 'Over-Refusal' guardrail. Confirm in the source document or escalate to Branch Support.";
        response.type = 'refusal';
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const isEmptyState = messages.length === 0 && showFAQs;

  return (
    <div className="flex flex-col h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="font-semibold text-slate-800 text-base tracking-tight">Lumi for Cards</h1>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>New chat</span>
          </button>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 py-6">

          {/* Empty state: greeting + FAQs */}
          {isEmptyState && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 text-sm mb-10 text-center max-w-md">
                I provide grounded policy answers for BMO Credit Cards. Ask me about card benefits, fees, disclosures, and coverage.
              </p>

              <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FAQ_ITEMS.map((faq) => (
                  <button
                    key={faq.label}
                    onClick={() => handleSend(faq.query)}
                    className="text-left px-4 py-3 border border-slate-200 rounded-xl hover:border-[#003366] hover:bg-slate-50 transition-all group"
                  >
                    <div className="text-xs font-medium text-slate-400 group-hover:text-[#003366] mb-1">{faq.label}</div>
                    <div className="text-sm text-slate-700 leading-snug">{faq.query}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {!isEmptyState && (
            <div className="space-y-6">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 bg-[#003366] rounded-lg flex items-center justify-center mr-3 mt-1 shrink-0">
                      <Sparkles size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-[#003366] text-white rounded-2xl rounded-br-md px-4 py-3'
                      : 'bg-transparent'
                  }`}>
                    {/* Effective date citation */}
                    {m.effectiveDate && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-3 pb-2 border-b border-slate-100">
                        <Shield size={12} />
                        <span>Citation effective: {m.effectiveDate}</span>
                      </div>
                    )}

                    {/* Type indicators */}
                    {m.type === 'clarification' && m.role === 'assistant' && (
                      <div className="flex items-center gap-2 text-amber-600 text-xs font-medium mb-2">
                        <Fingerprint size={14} />
                        <span>Clarification needed</span>
                      </div>
                    )}
                    {m.type === 'redirect' && m.role === 'assistant' && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
                        <AlertCircle size={14} />
                        <span>Out of scope</span>
                      </div>
                    )}
                    {m.type === 'refusal' && m.role === 'assistant' && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-medium mb-2">
                        <AlertCircle size={14} />
                        <span>Low confidence</span>
                      </div>
                    )}

                    <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user' ? 'text-white' : 'text-slate-700'
                    }`}>
                      {m.content}
                    </p>

                    {/* Conditions list */}
                    {m.conditions && (
                      <div className="mt-4 space-y-1.5">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-2">
                          <LifeBuoy size={12} /> Disclosure conditions:
                        </p>
                        <ul className="space-y-1.5 pl-1">
                          {m.conditions.map((c: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600 flex gap-2">
                              <span className="text-[#003366] font-bold">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Source citation card */}
                    {m.source && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between group hover:border-[#003366] transition-colors cursor-pointer">
                          <div className="overflow-hidden">
                            <div className="text-xs font-semibold text-[#003366] flex items-center gap-2 truncate">
                              <BookOpen size={13} className="shrink-0" /> {m.source}
                            </div>
                            {m.pages && (
                              <div className="text-[11px] text-slate-400 mt-0.5">{m.pages} · Policy Repository</div>
                            )}
                          </div>
                          <ExternalLink size={13} className="text-slate-300 group-hover:text-[#003366] transition-colors shrink-0 ml-3" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start">
                  <div className="w-7 h-7 bg-[#003366] rounded-lg flex items-center justify-center mr-3 mt-1 shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 py-3">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <div className="shrink-0 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto w-full px-4 py-4">
          <div className="relative flex items-end bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#003366] focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask a policy question..."
              className="flex-1 px-4 py-3 bg-transparent outline-none text-sm resize-none max-h-[200px] placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="m-2 p-2 bg-[#003366] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#002244] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Lumi provides policy information only. It cannot make credit or claim decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
