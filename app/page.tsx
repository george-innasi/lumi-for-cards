"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, BookOpen, Send, ShieldCheck, AlertCircle, CreditCard, Shield, Zap, FileText, Globe, LifeBuoy } from 'lucide-react';

// --- KNOWLEDGE BASE DATA ---
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

const QUICK_ACTIONS = [
  { label: "US1: Rates & Fees", query: "What are the fees for the Infinite Visa?" },
  { label: "US2: Insurance", query: "What is the car rental damage limit?" },
  { label: "US3: Card Perks", query: "What are the earn rates for CashBack?" },
  { label: "US4: Promos", query: "Are there any balance transfer offers?" }
];

export default function LumiPrototype() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello George. I am Lumi, your BMO Credit Card Assistant. Select a suggested query below or ask a specific policy question.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (forcedQuery?: string) => {
    const queryToProcess = forcedQuery || input;
    if (!queryToProcess.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: queryToProcess }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response: any = { role: 'assistant', type: 'answer' };
      const q = queryToProcess.toLowerCase();
      
      if (/(?:\d{4}[- ]?){3}\d{4}|(?:\d{3}[- ]?){3}/.test(q)) {
        response.content = "This assistant cannot process customer personal information. Please remove any sensitive data.";
        response.type = 'error';
      } 
      else if (q.match(/mortgage|loan|gic|pin reset/)) {
        response.content = "This assistant covers credit card benefits and insurance only. For mortgage and lending, see the Lending Policy library.";
        response.type = 'redirect';
      }
      else {
        const foundDoc = KNOWLEDGE_BASE.find(doc => doc.keywords.some(k => q.includes(k)));
        if (foundDoc) response = { ...response, ...foundDoc };
        else {
          response.content = "I cannot answer this from the active knowledge base. Confirm it in the source document or escalate to Branch Support.";
          response.type = 'refusal';
        }
      }
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
      
      {/* LEFT SIDE: THE POLICY HUB DASHBOARD */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">BMO</div>
            <div>
              <h1 className="font-black text-slate-800 tracking-tight text-lg leading-none">CARD SERVICES HUB</h1>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1 block">Policy Knowledge Base</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-slate-100 p-2 rounded-lg flex items-center gap-2 px-4 border border-slate-200">
                <Search size={16} className="text-slate-400"/>
                <input type="text" placeholder="Global Search..." className="bg-transparent border-none outline-none text-xs w-48 font-medium"/>
            </div>
            <span className="text-sm font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">George Innasi</span>
          </div>
        </header>

        <main className="p-10 max-w-6xl mx-auto w-full space-y-10">
          <div className="bg-[#003366] rounded-3xl p-8 text-white flex items-center justify-between relative overflow-hidden shadow-xl">
             <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Ready for a consultation?</h2>
                <p className="text-blue-100 font-medium max-w-md">Lumi is active on the right sidebar to assist with real-time card policy, insurance, and interest rate lookups.</p>
             </div>
             <Shield size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 font-bold"><CreditCard/></div>
               <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Top Card Policies</h3>
               <p className="text-xs text-slate-500 mb-4">View MSRP limits, earn rates, and annual fees for retail card products.</p>
               <button className="text-[10px] font-black text-[#003366] hover:underline">BROWSE CARDS →</button>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-5 font-bold"><ShieldCheck/></div>
               <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Insurance Matrix</h3>
               <p className="text-xs text-slate-500 mb-4">Collision Damage, Travel Medical, and Purchase Protection certificates.</p>
               <button className="text-[10px] font-black text-[#003366] hover:underline">VIEW COVERAGE →</button>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 font-bold"><Zap/></div>
               <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Rate Specials</h3>
               <p className="text-xs text-slate-500 mb-4">Check current balance transfer and introductory APR promotional windows.</p>
               <button className="text-[10px] font-black text-[#003366] hover:underline">CHECK PROMOS →</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-xs text-slate-600 tracking-widest uppercase italic">Master Library Access</h3>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black">ACTIVE CORPUS</span>
                </div>
             </div>
             <div className="p-2 divide-y divide-slate-50">
                {['Cardholder Agreements (Retail)', 'Insurance Certificates & T&Cs', 'Branch Fee Disclosure Tables', 'Marketing Compliance Guide'].map(item => (
                  <div key={item} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all rounded-xl group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded text-slate-400 group-hover:text-blue-600 transition-colors"><FileText size={18}/></div>
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-slate-400 italic">v2026.1 Updated</span>
                        <ExternalLink size={14} className="text-slate-400"/>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </main>
      </div>

      {/* RIGHT SIDE: THE LUMI ASSISTANT SIDEBAR */}
      <div className="w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-30">
        <div className="p-5 bg-[#003366] text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-400/20 rounded-lg border border-white/10">
              <MessageSquare size={20} className="text-blue-100" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tighter leading-none">LUMI ASSISTANT</h2>
              <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest mt-1 block">Verified Answer Engine</span>
            </div>
          </div>
          <div className="text-[9px] bg-white/10 px-2 py-1 rounded font-black border border-white/5 uppercase">Phase 0 Beta</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scroll-smooth">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-2'}`}>
              <div className={`max-w-[95%] ${m.role === 'user' ? 'bg-[#003366] text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-lg' : 'bg-[#F8FAFC] border border-slate-100 rounded-2xl rounded-tl-none p-6 shadow-sm'}`}>
                
                {m.date && <p className="text-[10px] font-black text-blue-600/60 mb-3 uppercase tracking-widest flex items-center gap-2 border-b border-blue-100 pb-2">
                  <Shield size={12}/> SOURCE EFFECTIVE: {m.date}
                </p>}
                
                {m.type === 'error' && <AlertCircle size={20} className="text-red-500 mb-3" />}

                <p className="text-[13px] leading-relaxed font-medium text-slate-700 whitespace-pre-wrap">{m.content}</p>

                {m.conditions && (
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight flex items-center gap-2">
                      <LifeBuoy size={12}/> Policy Details & Caveats:
                    </p>
                    <ul className="space-y-2 pl-1">
                      {m.conditions.map((c, i) => (
                        <li key={i} className="text-[12px] text-slate-600 flex gap-2 font-medium">
                          <span className="text-blue-500 font-black">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.source && (
                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <button className="w-full text-left p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-400 transition-all shadow-sm flex items-center justify-between group">
                      <div className="overflow-hidden">
                        <div className="text-[11px] font-black text-[#003366] flex items-center gap-2 uppercase truncate">
                          <BookOpen size={14} className="shrink-0"/> {m.source}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-bold italic text-xs">{m.pages} • Branch Doc Repository</div>
                      </div>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0"/>
                    </button>
                  </div>
                )}

                {m.role === 'assistant' && idx > 0 && (
                  <div className="mt-4 flex items-center gap-4 border-t border-slate-50 pt-4">
                    <button className="text-slate-300 hover:text-blue-600 transition-colors"><ThumbsUp size={16} /></button>
                    <button className="text-slate-300 hover:text-red-600 transition-colors"><ThumbsDown size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 text-slate-400 p-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest animate-pulse italic text-blue-500">Retrieving Policy Data...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* INPUT & QUICK ACTIONS AREA */}
        <div className="p-6 bg-white border-t border-slate-200 shadow-2xl">
          <div className="grid grid-cols-2 gap-3 mb-5">
            {QUICK_ACTIONS.map((q) => (
              <button 
                key={q.label}
                onClick={() => handleSend(q.query)}
                className="text-left px-3 py-2.5 border border-slate-100 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group shadow-sm bg-slate-50/30"
              >
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-blue-600">{q.label}</div>
                <div className="text-[10px] text-slate-700 font-bold truncate mt-0.5">{q.query}</div>
              </button>
            ))}
          </div>

          <div className="relative group">
            <textarea 
              rows={1}
              placeholder="Ask about rewards, insurance, or card terms..."
              className="w-full p-4 pr-16 rounded-2xl border border-slate-200 focus:border-[#003366] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all resize-none shadow-sm bg-slate-50/50 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="absolute right-3.5 bottom-3.5 p-2 bg-[#003366] text-white rounded-xl hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-5 px-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <ShieldCheck size={14} className="text-blue-500"/> Verified Policy Guardrails Active
            </div>
            <span className="text-[9px] text-slate-400 italic font-bold uppercase tracking-tighter opacity-50">Branch Retail Tool</span>
          </div>
        </div>
      </div>
    </div>
  );
}
