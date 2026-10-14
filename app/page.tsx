"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, BookOpen, Send, ShieldAlert, AlertCircle, CreditCard, ShieldCheck, Zap, HelpCircle, FileText, Globe } from 'lucide-react';

// --- KNOWLEDGE BASE ---
const KNOWLEDGE_BASE = [
  {
    id: "doc_1",
    card: "BMO Infinite Visa",
    keywords: ['rental', 'damage', 'collision', 'car', 'infinite'],
    effectiveDate: "March 1, 2026",
    content: "The Auto Rental Collision/Loss Damage Insurance covers rental vehicles with a MSRP up to $65,000 [Infinite Visa Certificate of Insurance, v2026.1, p.4]. The maximum rental period is up to 48 consecutive days.",
    conditions: ["Full rental cost must be charged to the card", "Collision waiver must be declined", "Cardholder must be primary renter"],
    source: "Infinite Visa Certificate of Insurance, v2026.1",
    pages: "pp.4 to 5"
  },
  {
    id: "doc_2",
    card: "BMO CashBack Mastercard",
    keywords: ['cashback', 'groceries', 'recurring', 'rate', 'earn'],
    effectiveDate: "May 1, 2026",
    content: "Earn 3% cash back on groceries, 1% on recurring bill payments, and 0.5% on all other purchases. This is the highest no-fee grocery rate in Canada.",
    conditions: ["3% grocery rate applies to first $500 monthly", "1% bill payment applies to first $500 monthly", "Redeem cash back any time starting at $1"],
    source: "CashBack Mastercard Disclosure, v2026.2",
    pages: "p.2"
  }
];

const SUGGESTED_QUESTIONS = [
  { label: "US1: Rates & Fees", query: "What are the fees for the Infinite Visa?" },
  { label: "US2: Insurance Limits", query: "What is the car rental damage limit?" },
  { label: "US3: Card Benefits", query: "Compare CashBack vs Air Miles rewards." },
  { label: "US4: Promo Offers", query: "Are there any active balance transfer offers?" }
];

export default function LumiPrototype() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello George. I am Lumi, your BMO Credit Card Assistant. Select a topic below or ask a specific policy question.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (forcedQuery?: string) => {
    const queryToProcess = forcedQuery || input;
    if (!queryToProcess.trim()) return;

    const userQuery = queryToProcess.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: queryToProcess }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response: any = { role: 'assistant', type: 'answer' };
      
      if (/(?:\d{4}[- ]?){3}\d{4}|(?:\d{3}[- ]?){3}/.test(userQuery)) {
        response.content = "This assistant cannot process customer personal information. Please remove any sensitive data.";
        response.type = 'error';
      } 
      else if (userQuery.match(/mortgage|loan|gic|pin reset/)) {
        response.content = "This assistant covers credit card benefits and insurance only. For mortgage and lending, see the Lending Policy library.";
        response.type = 'redirect';
      }
      else {
        const foundDoc = KNOWLEDGE_BASE.find(doc => doc.keywords.some(k => userQuery.includes(k)));
        if (foundDoc) {
          response = { ...response, ...foundDoc };
        } else {
          response.content = "I cannot answer this from the active knowledge base. Confirm it in the source document or escalate to Branch Support.";
          response.type = 'refusal';
        }
      }
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800">
      
      {/* LEFT SIDE: THE KNOWLEDGE HUB PORTAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold text-xs">BMO</div>
            <span className="font-bold text-slate-700 tracking-tight text-sm uppercase">Card Services Knowledge Hub</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1"><Globe size={14}/> EN / FR</div>
            <span className="font-medium">George Innasi (Personal Banker)</span>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <zap size={20} className="text-amber-500 fill-amber-500"/> Featured Policy Updates
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4"><ShieldCheck size={20}/></div>
                  <h3 className="font-bold text-sm mb-2">Travel Insurance v2026</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Updated collision coverage MSRP limits for Infinite cardholders.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4"><CreditCard size={20}/></div>
                  <h3 className="font-bold text-sm mb-2">Rewards Earn Rates</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">New 5% grocery accelerators active for CashBack Mastercard accounts.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4"><Zap size={20}/></div>
                  <h3 className="font-bold text-sm mb-2">Promotional APRs</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">New balance transfer windows for Q3 customer retention campaigns.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Master Document Library</h3>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold">428 DOCUMENTS</span>
              </div>
              <div className="divide-y divide-slate-100">
                {['Cardholder Agreements', 'Certificates of Insurance', 'Fee Schedules', 'Marketing Guidelines'].map(doc => (
                  <div key={doc} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400 group-hover:text-blue-500"/>
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-300"/>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* RIGHT SIDE: THE LUMI ASSISTANT */}
      <div className="w-[480px] bg-white border-l border-slate-200 flex flex-col shadow-2xl relative z-20">
        <div className="p-4 bg-[#003366] text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-500/20 rounded shadow-inner">
              <MessageSquare size={18} className="text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight leading-none">LUMI ASSISTANT</h2>
              <span className="text-[9px] text-blue-300 font-bold uppercase tracking-widest">Policy Support AI</span>
            </div>
          </div>
          <div className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold border border-white/10 uppercase tracking-tighter">PHASE 0</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-2'}`}>
              <div className={`max-w-[92%] ${m.role === 'user' ? 'bg-[#003366] text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-md' : 'bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5'}`}>
                
                {m.date && <p className="text-[9px] font-black text-slate-400 mb-3 uppercase tracking-widest border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-blue-500"/> Source Effective {m.date}
                </p>}
                
                {m.type === 'error' && <AlertCircle size={20} className="text-red-500 mb-2" />}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                {m.conditions && (
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight flex items-center gap-1">
                      <HelpCircle size={10}/> Conditions & Exclusions:
                    </p>
                    <ul className="space-y-1.5">
                      {m.conditions.map((c, i) => (
                        <li key={i} className="text-xs text-slate-600 flex gap-2">
                          <span className="text-blue-500 font-bold">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.source && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <button className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-sm flex items-center justify-between group">
                      <div className="overflow-hidden">
                        <div className="text-[10px] font-black text-[#003366] flex items-center gap-1.5 uppercase truncate">
                          <BookOpen size={12}/> {m.source}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{m.pages} • Verified Asset</div>
                      </div>
                      <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500"/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 text-slate-400 p-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Retrieving Policy Data...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* INPUT & QUICK ACTIONS */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          {/* Quick Start Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button 
                key={q.label}
                onClick={() => handleSend(q.query)}
                className="text-left px-3 py-2 border border-slate-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="text-[9px] font-black text-slate-400 uppercase group-hover:text-blue-500">{q.label}</div>
                <div className="text-[10px] text-slate-600 truncate">{q.query}</div>
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea 
              rows={1}
              placeholder="Ask about rewards, insurance, or card terms..."
              className="w-full p-4 pr-14 rounded-xl border border-slate-200 focus:border-[#003366] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all resize-none shadow-sm bg-slate-50/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="absolute right-3 bottom-3 p-2 bg-[#003366] text-white rounded-lg hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              <ShieldCheck size={12} className="text-blue-500"/> Policy Guardrails Active
            </div>
            <span className="text-[9px] text-slate-300 italic font-medium">BMO Card Services Team v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
