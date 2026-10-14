"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, BookOpen, Send, ShieldCheck, AlertCircle, CreditCard, Shield, Zap, FileText, Globe, LifeBuoy, Fingerprint, barChart3, BarChart3 } from 'lucide-react';

// --- ENHANCED KNOWLEDGE BASE (Addressing Assignment Feedback) ---
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

const QUICK_ACTIONS = [
  { label: "QC Edge Case", query: "Does a Quebec client on a Year 1 $0 fee waiver pay the transfer fee?" },
  { label: "Qualify Query", query: "Does my client qualify for the rental coverage?" },
  { label: "Ambiguous Query", query: "What is the grace period?" },
  { label: "Out of Scope: Mortgages", query: "What is the 5-year fixed mortgage rate?" },
  { label: "Out of Scope: Ops", query: "How do I perform a PIN reset for a client?" }
];

export default function LumiPrototype() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello George. I am Lumi. I provide grounded policy answers for BMO Credit Cards. I cannot make credit or claim decisions.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trace, setTrace] = useState({ confidence: 0, filters: [] as string[] });
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (forcedQuery?: string) => {
    const queryToProcess = forcedQuery || input;
    if (!queryToProcess.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: queryToProcess }]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG Pipeline Logic based on feedback
    setTimeout(() => {
      let response: any = { role: 'assistant', type: 'answer' };
      const q = queryToProcess.toLowerCase();
      
      // 1. OVER-TRUST GUARDRAIL (Addressing "Does my client qualify?")
      if (q.includes('qualify') || q.includes('eligible') || q.includes('approved')) {
        setTrace({ confidence: 0.98, filters: ['Intent: Eligibility', 'Boundary: Policy-Only'] });
        response.content = "Lumi cannot determine if a client qualifies. The policy states the following requirements, but the final decision rests with the Claims Administrator or Underwriting:";
        response.conditions = ["Vehicle MSRP under $65,000", "Primary cardholder present", "Rental declined at counter"];
        response.source = "Standard Terms & Conditions";
      }
      // 2. AMBIGUITY CLARIFIER
      else if (q === "what is the grace period?" || q === "grace period") {
        setTrace({ confidence: 0.45, filters: ['Entity: Missing_Card_Type'] });
        response.content = "To provide the correct grace period, please specify if you are looking for the CashBack Mastercard, Infinite Visa, or a Quebec-specific disclosure.";
        response.type = 'clarification';
      }
      // 3. QUEBEC EDGE CASE (The 4-way interaction)
      else if (q.includes('quebec') && q.includes('transfer')) {
        setTrace({ confidence: 0.99, filters: ['Province: Quebec', 'DocType: Disclosure'] });
        const doc = KNOWLEDGE_BASE[0];
        response = { ...response, ...doc };
      }
      // 4. OUT OF SCOPE: MORTGAGES
      else if (q.includes('mortgage') || q.includes('rate')) {
        setTrace({ confidence: 1.0, filters: ['Intent: Out_of_Scope'] });
        response.content = "This assistant is restricted to credit card benefits and fees. For mortgage rates and lending policy, please refer to the Mortgage & Lending Policy portal [Link].";
        response.type = 'redirect';
      }
      // 5. OUT OF SCOPE: OPS
      else if (q.includes('pin') || q.includes('reset')) {
        setTrace({ confidence: 1.0, filters: ['Intent: Branch_Ops'] });
        response.content = "PIN resets are a branch operational procedure. This assistant covers card products only. Please see the Branch Operations library [Link].";
        response.type = 'redirect';
      }
      else {
        setTrace({ confidence: 0.32, filters: ['Status: Low_Confidence_Refusal'] });
        response.content = "I cannot answer this from the active knowledge base. This may be due to an 'Over-Refusal' guardrail. Confirm in the source document or escalate to Branch Support.";
        response.type = 'refusal';
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
      
      {/* LEFT SIDE: KNOWLEDGE HUB & SYSTEM TRACE */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg tracking-tighter">BMO</div>
            <div>
              <h1 className="font-black text-slate-800 tracking-tight text-lg leading-none italic uppercase">Lumi Knowledge Hub</h1>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1 block">RAG Deployment Trace Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end border-r pr-4 border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Reranker Confidence</span>
                <span className={`text-sm font-black ${trace.confidence > 0.8 ? 'text-green-600' : 'text-amber-500'}`}>{(trace.confidence * 100).toFixed(0)}%</span>
             </div>
             <div className="text-sm font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">George Innasi</div>
          </div>
        </header>

        <main className="p-10 max-w-6xl mx-auto w-full space-y-8">
          {/* Metadata Filter Panel (Addressing Evaluator's request for numeric targets/evaluation) */}
          <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-black mb-4 tracking-tight flex items-center gap-2 italic uppercase">
                        <BarChart3 size={20} className="text-blue-400"/> Current Query Metadata Trace
                    </h2>
                    <div className="flex gap-3">
                        {trace.filters.length > 0 ? trace.filters.map(f => (
                            <span key={f} className="bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">{f}</span>
                        )) : <span className="text-slate-500 text-xs italic">Awaiting query...</span>}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase">Recall Target</div>
                    <div className="text-lg font-black text-blue-400 italic">Recall@20: 0.94</div>
                </div>
             </div>
             <Shield size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
          </section>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 font-bold"><CreditCard/></div>
               <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider italic">Quebec Exception Matrix</h3>
               <p className="text-xs text-slate-500 mb-4">Handling Year 1 fee waivers vs. promo transfer rates (The 4-way interaction).</p>
               <button className="text-[10px] font-black text-[#003366] hover:underline">RECONCILE QUEBEC DISCLOSURE →</button>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-5 font-bold"><ShieldCheck/></div>
               <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider italic">Anti-Over-Trust Guard</h3>
               <p className="text-xs text-slate-500 mb-4">System refusal triggers for 'Does my client qualify?' queries to prevent misstatement risk.</p>
               <button className="text-[10px] font-black text-[#003366] hover:underline">VIEW SAFETY LOGS →</button>
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
              <h2 className="font-black text-sm tracking-tighter leading-none italic italic">LUMI ASSISTANT</h2>
              <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest mt-1 block tracking-[0.2em]">Policy Support Engine</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scroll-smooth">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start animate-in fade-in slide-in-from-bottom-2'}`}>
              <div className={`max-w-[95%] ${m.role === 'user' ? 'bg-[#003366] text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-lg' : 'bg-[#F8FAFC] border border-slate-100 rounded-2xl rounded-tl-none p-6 shadow-sm'}`}>
                
                {m.date && <p className="text-[10px] font-black text-blue-600/60 mb-3 uppercase tracking-widest flex items-center gap-2 border-b border-blue-100 pb-2 italic">
                  <Shield size={12}/> CITATION EFFECTIVE: {m.date}
                </p>}
                
                {m.type === 'error' && <AlertCircle size={20} className="text-red-500 mb-3" />}
                {m.type === 'clarification' && <Fingerprint size={20} className="text-amber-500 mb-3" />}

                <p className="text-[13px] leading-relaxed font-medium text-slate-700 whitespace-pre-wrap">{m.content}</p>

                {m.conditions && (
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight flex items-center gap-2 italic">
                      <LifeBuoy size={12}/> Disclosure Logic:
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
                        <div className="text-[10px] text-slate-400 mt-1 font-bold italic">{m.pages} • Policy Repository</div>
                      </div>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0"/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 text-slate-400 p-2">
              <div className="flex gap-1.5 italic text-[10px] uppercase font-black">Retrieving policy...</div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* UPDATED QUICK ACTIONS FOR ASSIGNMENT 3 FEEDBACK */}
        <div className="p-6 bg-white border-t border-slate-200 shadow-2xl">
          <div className="grid grid-cols-2 gap-3 mb-5">
            {QUICK_ACTIONS.map((q) => (
              <button 
                key={q.label}
                onClick={() => handleSend(q.query)}
                className="text-left px-3 py-2.5 border border-slate-100 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group shadow-sm bg-slate-50/30"
              >
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-blue-600 italic leading-none mb-1">{q.label}</div>
                <div className="text-[9px] text-slate-700 font-bold truncate leading-none">{q.query}</div>
              </button>
            ))}
          </div>

          <div className="relative group">
            <textarea 
              rows={1}
              placeholder="Ask a policy question..."
              className="w-full p-4 pr-16 rounded-2xl border border-slate-200 focus:border-[#003366] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all resize-none shadow-sm bg-slate-50/50 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button onClick={() => handleSend()} className="absolute right-3.5 bottom-3.5 p-2 bg-[#003366] text-white rounded-xl shadow-lg"><Send size={20} /></button>
          </div>
          
          <div className="flex items-center justify-between mt-5 px-1 font-black text-slate-400 text-[9px] uppercase tracking-tighter">
            <span>Branch Retail Assistant v3.0</span>
            <span className="italic">Groundedness Score Target: 1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
