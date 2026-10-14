"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, ChevronDown, BookOpen, Send, ShieldAlert, AlertCircle, User, Bot } from 'lucide-react';

// --- MOCK KNOWLEDGE BASE (From BMO Docs) ---
const KNOWLEDGE_BASE = [
  {
    id: "doc_1",
    card: "BMO Infinite Visa",
    topic: "Auto Rental Collision",
    effectiveDate: "March 1, 2026",
    content: "The Auto Rental Collision/Loss Damage Insurance covers rental vehicles with a manufacturer's suggested retail price up to $65,000 [Infinite Visa Certificate of Insurance, v2026.1, p.4]. The maximum rental period is up to 48 consecutive days.",
    conditions: [
      "The full cost of the rental must be charged to the card [p.4]",
      "The collision damage waiver offered by the rental agency must be declined [p.4]",
      "Coverage applies to the cardholder as the primary renter [p.5]"
    ],
    source: "Infinite Visa Certificate of Insurance, v2026.1",
    pages: "pp.4 to 5"
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
    const userQuery = input;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG System Processing
    setTimeout(() => {
      let response = { role: 'assistant', type: 'answer' };
      
      // 1. MUST 5: PII / Customer Data Guardrail
      if (/(?:\d{4}[- ]?){3}\d{4}|(?:\d{3}[- ]?){3}/.test(userQuery)) {
        response.content = "This assistant cannot process customer personal information, evaluate credit applications, or confirm insurance claim decisions. Please remove any sensitive data or refer to standard underwriting guidelines.";
        response.type = 'error';
      } 
      // 2. MUST 1 / Out of Scope Redirect
      else if (userQuery.toLowerCase().match(/mortgage|loan|gic|pin reset/)) {
        response.content = "This assistant covers credit card benefits, insurance coverage, rates, and fees only. For mortgage and lending policy, see the Mortgage & Lending Policy library. For branch operational procedures, see the Branch Operations library.";
        response.type = 'redirect';
      }
      // 3. MUST 2: Happy Path Retrieval (Rental Example)
      else if (userQuery.toLowerCase().includes('rental') || userQuery.toLowerCase().includes('damage')) {
        const doc = KNOWLEDGE_BASE[0];
        response.date = doc.effectiveDate;
        response.content = `Yes. ${doc.content}`;
        response.conditions = doc.conditions;
        response.source = doc.source;
        response.pages = doc.pages;
      }
      // 4. MUST 1: Refusal for Absent Data
      else {
        response.content = "I cannot answer this from the active knowledge base. Confirm it in the source document or escalate to Internal Branch Support.";
        response.type = 'refusal';
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F4F7F9] font-sans text-slate-800">
      {/* Mock Portal Background */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#003366] rounded flex items-center justify-center text-white font-bold text-xs">BMO</div>
            <span className="font-semibold text-slate-600">Employee Portal / Policy & Procedures</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Search size={18} />
            <span>George Innasi (Branch Retail)</span>
          </div>
        </header>
        <main className="p-8 opacity-40 select-none">
          <div className="max-w-4xl space-y-6">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded border border-slate-200"></div>)}
            </div>
            <div className="h-64 bg-white rounded border border-slate-200"></div>
          </div>
        </main>
      </div>

      {/* LUMI SIDE PANEL (Section 6.1) */}
      <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-xl ring-1 ring-black/5">
        <div className="p-4 bg-[#003366] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-300" />
            <h2 className="font-bold tracking-tight uppercase text-sm">Lumi Assistant</h2>
          </div>
          <div className="text-[10px] bg-blue-500/30 px-2 py-1 rounded font-mono border border-blue-400/50">v0.1.0-ALPHA</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-2 duration-300'}`}>
              <div className={`max-w-[92%] group ${m.role === 'user' ? 'bg-[#003366] text-white rounded-2xl rounded-tr-none px-4 py-2 shadow-sm' : 'bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm'}`}>
                
                {/* Answer Header (Requirement 7.3 SHOULD 3) */}
                {m.date && <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Source effective {m.date}</p>}
                
                {/* Icon for errors/refusals */}
                {(m.type === 'error' || m.type === 'refusal') && <AlertCircle size={16} className="text-red-500 mb-2" />}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                {/* Bullets (Requirement 7.2 Format) */}
                {m.conditions && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Conditions and exclusions:</p>
                    <ul className="space-y-1.5">
                      {m.conditions.map((c, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2 leading-snug">
                          <span className="text-[#0079c1] font-bold mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Source Panel (Requirement 6.2) */}
                {m.source && (
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#003366]">
                      <span className="flex items-center gap-1.5"><BookOpen size={13}/> SOURCES</span>
                    </div>
                    <button className="mt-2 w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group/link">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                        {m.source}
                        <ExternalLink size={10} className="group-hover/link:translate-x-0.5 transition-transform"/>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.pages} • SharePoint/CreditCards/Policy</div>
                    </button>
                  </div>
                )}

                {/* Feedback Chips (Requirement 6.4) */}
                {m.role === 'assistant' && idx > 0 && (
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-50 pt-3">
                    <button className="p-1.5 rounded-full hover:bg-blue-50 text-slate-300 hover:text-blue-600 transition-colors"><ThumbsUp size={14} /></button>
                    <button className="p-1.5 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-600 transition-colors"><ThumbsDown size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Retrieving Verified Policy</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          <div className="relative group">
            <textarea 
              rows={1}
              placeholder="Ask about card benefits, rates, or insurance..."
              className="w-full p-3 pr-12 rounded-xl border border-slate-200 focus:border-[#003366] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all resize-none min-h-[48px] max-h-32"
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
              className="absolute right-2.5 bottom-2.5 p-1.5 bg-[#003366] text-white rounded-lg hover:bg-blue-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <ShieldAlert size={12} className="text-blue-400"/> BMO Internal Data Guardrails Active
            </div>
            <span className="text-[10px] text-slate-300 font-mono italic">Ref: US1-US5 Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
