"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, BookOpen, Send, ShieldAlert, AlertCircle } from 'lucide-react';

// --- MOCK KNOWLEDGE BASE (Expanded with all 3 BMO Cards) ---
const KNOWLEDGE_BASE = [
  {
    id: "doc_1",
    card: "BMO Infinite Visa",
    keywords: ['rental', 'damage', 'collision', 'car', 'infinite'],
    effectiveDate: "March 1, 2026",
    content: "The Auto Rental Collision/Loss Damage Insurance covers rental vehicles with a MSRP up to $65,000 [Infinite Visa Certificate of Insurance, v2026.1, p.4]. The maximum rental period is up to 48 consecutive days.",
    conditions: [
      "Full rental cost must be charged to the card [p.4]",
      "The collision damage waiver offered by the rental agency must be declined [p.4]",
      "Coverage applies to the cardholder as primary renter [p.5]"
    ],
    source: "Infinite Visa Certificate of Insurance, v2026.1",
    pages: "pp.4 to 5"
  },
  {
    id: "doc_2",
    card: "BMO CashBack Mastercard",
    keywords: ['cashback', 'groceries', 'recurring', 'rate', 'earn'],
    effectiveDate: "May 1, 2026",
    content: "Earn 3% cash back on groceries, 1% on recurring bill payments, and 0.5% on all other purchases. This is the highest no-fee grocery rate in Canada.",
    conditions: [
      "3% grocery rate applies to the first $500 spent monthly",
      "1% bill payment rate applies to the first $500 spent monthly",
      "Redeem cash back any time starting at just $1"
    ],
    source: "CashBack Mastercard Disclosure, v2026.2",
    pages: "p.2"
  },
  {
    id: "doc_3",
    card: "BMO Air Miles World Elite",
    keywords: ['miles', 'travel', 'lounge', 'dragonpass', 'elite'],
    effectiveDate: "January 15, 2026",
    content: "Earn 1 Mile for every $12 spent. Includes a 25% discount on one flight redemption per year and complimentary membership in Mastercard Travel Pass by DragonPass.",
    conditions: [
      "Travel insurance includes up to $5 million in medical (for under 65)",
      "Lounge access costs US$32 per person, per visit",
      "Earn 3x Miles at participating AIR MILES Partners"
    ],
    source: "Air Miles World Elite Benefits Guide, v2026.1",
    pages: "p.12"
  }
];

export default function LumiPrototype() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello George. I am Lumi, your BMO Credit Card Policy Assistant. How can I help you support a client today?', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userQuery = input.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = { role: 'assistant', type: 'answer' };
      
      // 1. PII Guardrail (Section 7.3 MUST 5)
      if (/(?:\d{4}[- ]?){3}\d{4}|(?:\d{3}[- ]?){3}/.test(userQuery)) {
        response.content = "This assistant cannot process customer personal information, evaluate credit applications, or confirm insurance claim decisions. Please remove any sensitive data.";
        response.type = 'error';
      } 
      // 2. Out of Scope Redirect (Section 7.3 MUST 1)
      else if (userQuery.match(/mortgage|loan|gic|pin reset/)) {
        response.content = "This assistant covers credit card benefits, insurance coverage, rates, and fees only. For mortgage and lending policy, see the Mortgage & Lending Policy library.";
        response.type = 'redirect';
      }
      // 3. RAG Retrieval Logic
      else {
        const foundDoc = KNOWLEDGE_BASE.find(doc => 
          doc.keywords.some(keyword => userQuery.includes(keyword))
        );

        if (foundDoc) {
          response.date = foundDoc.effectiveDate;
          response.content = foundDoc.content;
          response.conditions = foundDoc.conditions;
          response.source = foundDoc.source;
          response.pages = foundDoc.pages;
        } else {
          response.content = "I cannot answer this from the active knowledge base. Confirm it in the source document or escalate to Internal Branch Support.";
          response.type = 'refusal';
        }
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F4F7F9] font-sans text-slate-800">
      {/* Background Portal */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#003366] rounded flex items-center justify-center text-white font-bold text-xs">BMO</div>
            <span className="font-semibold text-slate-600 uppercase text-xs tracking-wider">Internal Policy Portal</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Search size={18} />
            <span>George Innasi (Personal Banker)</span>
          </div>
        </header>
        <main className="p-8 opacity-30 select-none flex-1">
          <div className="max-w-4xl space-y-6">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded border border-slate-200"></div>)}
            </div>
            <div className="h-96 bg-white rounded border border-slate-200"></div>
          </div>
        </main>
      </div>

      {/* LUMI SIDE PANEL (As per Section 6.1) */}
      <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        <div className="p-4 bg-[#003366] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-300" />
            <h2 className="font-bold tracking-tight uppercase text-sm">Lumi Assistant</h2>
          </div>
          <div className="text-[10px] bg-blue-500/30 px-2 py-1 rounded font-mono border border-blue-400/50 uppercase">Phase 0</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FAFBFC]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-2'}`}>
              <div className={`max-w-[92%] ${m.role === 'user' ? 'bg-[#003366] text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-md' : 'bg-white border border-slate-200 rounded-2xl rounded-tl-none p-5 shadow-sm'}`}>
                
                {m.date && <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest border-b pb-1">Source effective {m.date}</p>}
                
                {(m.type === 'error' || m.type === 'refusal') && <AlertCircle size={18} className="text-red-500 mb-2" />}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                {m.conditions && (
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Key Exclusions & Conditions:</p>
                    <ul className="space-y-2">
                      {m.conditions.map((c, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2 leading-snug">
                          <span className="text-[#0079c1] font-bold">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.source && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button className="w-full text-left p-2.5 rounded-lg bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition-all group">
                      <div className="text-[11px] font-bold text-[#003366] flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><BookOpen size={14}/> {foundSource(m.source)}</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform opacity-50"/>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{m.pages} • Verified SharePoint Asset</div>
                    </button>
                  </div>
                )}

                {m.role === 'assistant' && idx > 0 && (
                  <div className="mt-4 flex items-center gap-4 border-t border-slate-50 pt-3">
                    <button className="text-slate-300 hover:text-blue-600 transition-colors"><ThumbsUp size={16} /></button>
                    <button className="text-slate-300 hover:text-red-600 transition-colors"><ThumbsDown size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 text-slate-400 p-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Lumi is retrieving policy...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <textarea 
              rows={1}
              placeholder="Ask about card insurance, earn rates, or terms..."
              className="w-full p-4 pr-14 rounded-xl border border-slate-200 focus:border-[#003366] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all resize-none shadow-inner bg-slate-50/30"
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
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-3 bottom-3 p-2 bg-[#003366] text-white rounded-lg hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <div className="flex items-center gap-1.5"><ShieldAlert size={12} className="text-[#0079c1]"/> BMO DLP Guardrails Active</div>
            <span className="opacity-50 italic">Internal Staff Use Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper for source display
function foundSource(text: string) {
  return text.length > 35 ? text.substring(0, 35) + '...' : text;
}
