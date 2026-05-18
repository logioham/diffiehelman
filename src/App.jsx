import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { powerMod, isPrime, getPrimitiveRoots } from './utils/cryptoMath';
import { UserCard } from './components/UserCard';
import { Tooltip } from './components/Tooltip';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { translations } from './data/translations';
import { TheorySection } from './components/TheorySection';
import { FloatingCalculator } from './components/FloatingCalculator';

// === ЭКЗАМЕН ===
const ExamSection = ({ isLight, dict }) => {
  const [p, setP] = useState("23"); const [g, setG] = useState("5");
  const [a, setA] = useState("6");  const [b, setB] = useState("15");
  const [ansA, setAnsA] = useState(""); const [ansB, setAnsB] = useState(""); const [ansK, setAnsK] = useState("");
  const [step, setStep] = useState(1); const [errorMsg, setErrorMsg] = useState("");

  const t = { cardBg: isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#172033]/80 border-indigo-500/20 shadow-lg', text: isLight ? 'text-slate-700' : 'text-slate-300', title: isLight ? 'text-slate-900' : 'text-white', input: isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900' : 'bg-[#0B0F19] border-indigo-500/30 focus:border-cyan-400 text-indigo-200', btn: isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]', success: isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400' };

  const checkStep2 = () => { if (ansA === powerMod(g, a, p) && ansB === powerMod(g, b, p)) { setStep(3); setErrorMsg(""); } else setErrorMsg(dict.exWrong); };
  const checkStep3 = () => { const correctB = powerMod(g, b, p); if (ansK === powerMod(correctB, a, p)) { setStep(4); setErrorMsg(""); } else setErrorMsg(dict.exWrong); };

  return (
     <div className="max-w-4xl mx-auto p-8 font-sans pb-32">
        <h2 className={`text-4xl font-extrabold mb-4 tracking-tight ${t.title}`}>{dict.examTitle}</h2><p className={`text-lg mb-10 ${t.text}`}>{dict.examDesc}</p>
        <motion.div className={`p-8 rounded-2xl border mb-8 transition-opacity duration-500 ${t.cardBg} ${step > 1 ? 'opacity-50' : ''}`}>
           <h3 className={`text-2xl font-bold mb-6 ${t.title}`}>{dict.exS1}</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>p</label><input type="number" value={p} onChange={e=>setP(e.target.value)} disabled={step>1} className={`w-full p-3 text-lg font-bold rounded-xl font-mono outline-none border ${t.input}`}/></div>
             <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>g</label><input type="number" value={g} onChange={e=>setG(e.target.value)} disabled={step>1} className={`w-full p-3 text-lg font-bold rounded-xl font-mono outline-none border ${t.input}`}/></div>
             <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>Секрет (a)</label><input type="number" value={a} onChange={e=>setA(e.target.value)} disabled={step>1} className={`w-full p-3 text-lg font-bold rounded-xl font-mono outline-none border ${t.input}`}/></div>
             <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>Секрет (b)</label><input type="number" value={b} onChange={e=>setB(e.target.value)} disabled={step>1} className={`w-full p-3 text-lg font-bold rounded-xl font-mono outline-none border ${t.input}`}/></div>
           </div>
           {step === 1 && <button onClick={() => { if(p&&g&&a&&b) setStep(2); else setErrorMsg(dict.errFill); }} className={`px-8 py-3.5 rounded-xl font-bold text-lg ${t.btn}`}>{dict.exStart}</button>}
        </motion.div>
        {step >= 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-2xl border mb-8 ${t.cardBg} ${step > 2 ? 'opacity-50' : ''}`}>
             <h3 className={`text-2xl font-bold mb-6 ${t.title}`}>{dict.exS2}</h3>
             <div className="flex flex-col md:flex-row gap-8 mb-8">
               <div className="flex-1"><p className={`text-base mb-3 font-mono font-bold ${t.text}`}>A = {g}<sup>{a}</sup> mod {p}</p><input type="number" placeholder="Ответ (A)" value={ansA} onChange={e=>setAnsA(e.target.value)} disabled={step>2} className={`w-full p-4 text-xl font-bold rounded-xl font-mono outline-none border ${t.input}`}/></div>
               <div className="flex-1"><p className={`text-base mb-3 font-mono font-bold ${t.text}`}>B = {g}<sup>{b}</sup> mod {p}</p><input type="number" placeholder="Ответ (B)" value={ansB} onChange={e=>setAnsB(e.target.value)} disabled={step>2} className={`w-full p-4 text-xl font-bold rounded-xl font-mono outline-none border ${t.input}`}/></div>
             </div>
             {step === 2 && <button onClick={checkStep2} className={`px-8 py-3.5 rounded-xl font-bold text-lg ${t.btn}`}>{dict.exCheck}</button>}
          </motion.div>
        )}
        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-2xl border mb-8 ${t.cardBg} ${step > 3 ? 'opacity-50' : ''}`}>
             <h3 className={`text-2xl font-bold mb-6 ${t.title}`}>{dict.exS3}</h3><p className={`text-base mb-3 font-mono font-bold ${t.text}`}>K = B<sup>{a}</sup> mod {p} <span className="opacity-50 mx-2">или</span> A<sup>{b}</sup> mod {p}</p>
             <input type="number" placeholder="Финальный секрет (K)" value={ansK} onChange={e=>setAnsK(e.target.value)} disabled={step>3} className={`w-full p-4 text-xl font-bold rounded-xl font-mono outline-none border mb-8 max-w-sm ${t.input}`}/>
             <br/>{step === 3 && <button onClick={checkStep3} className={`px-8 py-3.5 rounded-xl font-bold text-lg ${t.btn}`}>{dict.exCheck}</button>}
          </motion.div>
        )}
        {errorMsg && <div className="p-5 rounded-xl border bg-rose-500/20 border-rose-500/50 text-rose-500 font-bold text-center text-lg mb-8 animate-pulse">{errorMsg}</div>}
        {step === 4 && <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`p-8 rounded-2xl border text-center font-black text-3xl ${t.success}`}>🎉 {dict.exFinish}</motion.div>}
     </div>
  )
};

// === ПЛАВАЮЩАЯ ШПАРГАЛКА ===
const FloatingCheatSheet = ({ isLight, dict, lang, setLang, containerRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag dragConstraints={containerRef} dragMomentum={false}
      onDragStart={() => setIsDragging(true)} onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
      initial={{ opacity: 0, scale: 0.8, x: -50 }} animate={{ opacity: 1, scale: 1, x: 0, width: isOpen ? 600 : 64, height: isOpen ? '70vh' : 64, borderRadius: isOpen ? 24 : 32 }} exit={{ opacity: 0, scale: 0.8, x: -50 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ position: 'absolute', top: '50%', left: 60, zIndex: 9998 }}
      className={`shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border ${isLight ? 'bg-slate-50/95 backdrop-blur-2xl border-slate-300' : 'bg-[#0B0F19]/95 backdrop-blur-2xl border-indigo-500/40'}`}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          <div className={`p-4 border-b flex justify-between items-center cursor-grab active:cursor-grabbing ${isLight ? 'border-slate-200 bg-white/50' : 'border-indigo-500/20 bg-white/5'}`}>
             <div className="flex items-center gap-2">
               <span className={`opacity-40 text-xl leading-none ${isLight ? 'text-slate-400' : 'text-indigo-300'}`}>⋮⋮</span>
               <span className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-indigo-800' : 'text-indigo-400'}`}>{dict.cheatSheet}</span>
             </div>
             <div className="flex gap-1 ml-auto mr-4" onPointerDown={(e) => e.stopPropagation()}>
               {['ru', 'en', 'kk'].map((l) => (
                 <button key={l} onClick={() => setLang(l)} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${lang === l ? 'bg-indigo-500 text-white' : (isLight ? 'text-slate-500 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/10')}`}>{l}</button>
               ))}
             </div>
             <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsOpen(false)} className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isLight ? 'bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-600' : 'bg-white/10 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400'}`}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto" onPointerDown={(e) => e.stopPropagation()}><div className="scale-90 origin-top"><TheorySection isLight={isLight} lang={lang} /></div></div>
        </div>
      ) : (
        <button onClick={() => { if (!isDragging) setIsOpen(true); }} className={`w-full h-full text-3xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isLight ? 'text-amber-500 bg-white' : 'text-amber-400'}`}>❓</button>
      )}
    </motion.div>
  );
};


// === ГЛАВНОЕ ПРИЛОЖЕНИЕ ===
export default function App() {
  const [activeTab, setActiveTab] = useState('practice'); 
  const [mode, setMode] = useState(2); 
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLight, setIsLight] = useState(false);
  const [lang, setLang] = useState('ru');
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  
  const appRef = useRef(null); 
  const d = translations[lang];

  const [p, setP] = useState("23"); 
  const [g, setG] = useState("5");
  const [validRoots, setValidRoots] = React.useState(getPrimitiveRoots(23));

  React.useEffect(() => {
    if (p && isPrime(p)) {
      const roots = getPrimitiveRoots(p);
      setValidRoots(roots);
      if (!roots.includes(parseInt(g)) && roots.length > 0) {
        setG(String(roots[0]));
      }
    } else {
      setValidRoots([]);
    }
  }, [p]);

  const [users, setUsers] = useState({ alice: { priv: "", pub: null, inter: null, final: null }, bob: { priv: "", pub: null, inter: null, final: null }, carol: { priv: "", pub: null, inter: null, final: null } });

  const updatePriv = (user, val) => setUsers(prev => ({ ...prev, [user]: { ...prev[user], priv: val } }));
  const currentStepsList = mode === 2 ? d.steps2 : d.steps3;

  const getMath = (user, type) => {
    const u = users[user];
    if (!u.priv) return null;
    if (type === 'pub') {
        const char = user === 'alice' ? 'A' : user === 'bob' ? 'B' : 'C'; const pow = user === 'alice' ? 'a' : user === 'bob' ? 'b' : 'c';
        return { formula: `${char} = g^${pow} mod p`, sub: `${char} = ${g}^${u.priv} mod ${p}` };
    }
    if (type === 'inter' && mode === 3) {
        if (user === 'alice' && users.carol.pub) return { formula: 'A_inter = C^a mod p', sub: `A_inter = ${users.carol.pub}^${u.priv} mod ${p}` };
        if (user === 'bob' && users.alice.pub) return { formula: 'B_inter = A^b mod p', sub: `B_inter = ${users.alice.pub}^${u.priv} mod ${p}` };
        if (user === 'carol' && users.bob.pub) return { formula: 'C_inter = B^c mod p', sub: `C_inter = ${users.bob.pub}^${u.priv} mod ${p}` };
    }
    if (type === 'final') {
        if (mode === 2) {
            if (user === 'alice' && users.bob.pub) return { formula: 'K = B^a mod p', sub: `K = ${users.bob.pub}^${u.priv} mod ${p}` };
            if (user === 'bob' && users.alice.pub) return { formula: 'K = A^b mod p', sub: `K = ${users.alice.pub}^${u.priv} mod ${p}` };
        } else {
            if (user === 'alice' && users.carol.inter) return { formula: 'K = C_inter^a mod p', sub: `K = ${users.carol.inter}^${u.priv} mod ${p}` };
            if (user === 'bob' && users.alice.inter) return { formula: 'K = A_inter^b mod p', sub: `K = ${users.alice.inter}^${u.priv} mod ${p}` };
            if (user === 'carol' && users.bob.inter) return { formula: 'K = B_inter^c mod p', sub: `K = ${users.bob.inter}^${u.priv} mod ${p}` };
        }
    }
    return null;
  };

  // === ОБНОВЛЕННАЯ ЛОГИКА ШАГОВ (БЕЗ ДУБЛЕЙ) ===
// === ОБНОВЛЕННАЯ ЛОГИКА ШАГОВ С ЖЕСТКОЙ ПРОВЕРКОЙ P и G ===
  const nextStep = () => {
    // 1. Проверка на стартовом экране
    if (step === 0) { 
      if (!p) { setErrorMsg(d.errFill); setTimeout(()=>setErrorMsg(""), 3000); return; } 
      if (!isPrime(p)) { setErrorMsg(`${p} ${d.errPrime}`); setTimeout(()=>setErrorMsg(""), 3000); return; } 
      
      // НОВЫЕ ПРОВЕРКИ:
      if (validRoots.length === 0) { 
        setErrorMsg("Для этого P нет доступных генераторов G!"); 
        setTimeout(()=>setErrorMsg(""), 3000); 
        return; 
      }
      if (!g || !validRoots.includes(parseInt(g))) { 
        setErrorMsg("Выберите правильный генератор G!"); 
        setTimeout(()=>setErrorMsg(""), 3000); 
        return; 
      }
    }

    // 2. Проверка ввода секретных ключей
    if (step === 1 && !users.alice.priv) { setErrorMsg(`${d.errKey} ${d.alice}!`); setTimeout(()=>setErrorMsg(""), 3000); return; }
    if (step === 2 && !users.bob.priv) { setErrorMsg(`${d.errKey} ${d.bob}!`); setTimeout(()=>setErrorMsg(""), 3000); return; }
    if (mode === 3 && step === 3 && !users.carol.priv) { setErrorMsg(`${d.errKey} ${d.carol}!`); setTimeout(()=>setErrorMsg(""), 3000); return; }
    
    setErrorMsg(""); 
    const s = step + 1; 
    let u = { ...users };

    // 3. Математические вычисления для шагов
    if (mode === 2) {
      if (s === 3) u.alice.pub = powerMod(g, u.alice.priv, p); 
      if (s === 4) u.bob.pub = powerMod(g, u.bob.priv, p);
      if (s === 6) u.alice.final = powerMod(u.bob.pub, u.alice.priv, p); 
      if (s === 7) u.bob.final = powerMod(u.alice.pub, u.bob.priv, p);
    } else {
      if (s === 4) u.alice.pub = powerMod(g, u.alice.priv, p); 
      if (s === 5) u.bob.pub = powerMod(g, u.bob.priv, p); 
      if (s === 6) u.carol.pub = powerMod(g, u.carol.priv, p);
      if (s === 8) u.alice.inter = powerMod(u.carol.pub, u.alice.priv, p); 
      if (s === 9) u.bob.inter = powerMod(u.alice.pub, u.bob.priv, p); 
      if (s === 10) u.carol.inter = powerMod(u.bob.pub, u.carol.priv, p);   
      if (s === 12) u.alice.final = powerMod(u.carol.inter, u.alice.priv, p); 
      if (s === 13) u.bob.final = powerMod(u.alice.inter, u.bob.priv, p); 
      if (s === 14) u.carol.final = powerMod(u.bob.inter, u.carol.priv, p);   
    }
    setUsers(u); 
    setStep(s);
  };
  const prevStep = () => { setErrorMsg(""); setStep(Math.max(0, step - 1)); };

  const resetToMain = () => {
    setStep(0);
    setUsers({ alice: { priv: "", pub: null, inter: null, final: null }, bob: { priv: "", pub: null, inter: null, final: null }, carol: { priv: "", pub: null, inter: null, final: null } });
    setErrorMsg("");
  };

  const getFocusedCard = () => {
    if (step === 0) return 'all';
    if (mode === 2) {
       if ([1, 3, 6].includes(step)) return 'alice';
       if ([2, 4, 7].includes(step)) return 'bob';
       if ([5].includes(step)) return 'channel';
    } else {
       if ([1, 4, 8, 12].includes(step)) return 'alice';
       if ([2, 5, 9, 13].includes(step)) return 'bob';
       if ([3, 6, 10, 14].includes(step)) return 'carol';
       if ([7, 11].includes(step)) return 'channel';
    }
    return 'all';
  };
  const focused = getFocusedCard();

  const t = {
    appBg: isLight ? "bg-slate-50 text-slate-800" : "bg-[#050810] text-white",
    gridLine: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
    ctrlBar: isLight ? "bg-white/90 border-slate-300 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" : "bg-[#0B0F19]/90 border-indigo-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
  };

  return (
    // Убираем скролл (overflow-hidden)
    <div ref={appRef} className={`flex h-screen w-screen relative overflow-hidden font-sans antialiased transition-colors duration-700 ${t.appBg}`}>
      {/* Фоновая сетка на весь экран */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${t.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      {/* ПЛАВАЮЩИЕ ПАНЕЛИ СЛЕВА */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
        <button onClick={() => setIsCalcOpen(!isCalcOpen)} title={isCalcOpen ? d.hideCalc : d.showCalc} className={`w-12 h-24 flex items-center justify-center rounded-r-2xl shadow-[4px_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:w-14 active:scale-95 outline-none ${isLight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600/80 backdrop-blur-md text-white border-y border-r border-indigo-400/50 hover:bg-indigo-500/90'}`}>
          <span className="text-2xl drop-shadow-md">🧮</span>
        </button>
        <button onClick={() => setIsCheatSheetOpen(!isCheatSheetOpen)} title={d.cheatSheet} className={`w-12 h-24 flex items-center justify-center rounded-r-2xl shadow-[4px_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:w-14 active:scale-95 outline-none ${isLight ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-amber-500/80 backdrop-blur-md text-white border-y border-r border-amber-400/50 hover:bg-amber-400/90'}`}>
          <span className="text-2xl drop-shadow-md">❓</span>
        </button>
      </div>

      {/* КНОПКА СБРОСА (НА ГЛАВНУЮ) СЛЕВА СВЕРХУ */}
      <div className="absolute top-6 left-6 flex gap-4 z-40">
        <AnimatePresence>
          {activeTab === 'practice' && step > 0 && (
            <motion.button initial={{ opacity: 0, scale: 0.8, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8, x: -20 }} onClick={resetToMain} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-500 shadow-sm border ${isLight ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' : 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-900/60'}`}>
              🏠 {d.homeBtn}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* КНОПКИ ВЕРХНЕГО МЕНЮ */}
      <div className="absolute top-6 right-6 flex gap-4 z-40">
        <div className={`flex items-center p-1 rounded-full border mr-4 transition-all duration-500 ${isLight ? 'bg-white shadow-sm border-slate-300' : 'bg-[#172033] border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
          <button onClick={() => setActiveTab('theory')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'theory' ? (isLight ? 'bg-indigo-500 text-white' : 'bg-indigo-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>📚 {d.navTheory}</button>
          <button onClick={() => setActiveTab('practice')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'practice' ? (isLight ? 'bg-cyan-500 text-white' : 'bg-cyan-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>🛠 {d.navPrac}</button>
          <button onClick={() => setActiveTab('exam')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'exam' ? (isLight ? 'bg-rose-500 text-white' : 'bg-rose-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>📝 {d.navExam}</button>
        </div>
        <div className={`flex items-center p-1 rounded-full border transition-all duration-500 ${isLight ? 'bg-white shadow-sm border-slate-300' : 'bg-[#172033] border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
           {['ru', 'en', 'kk'].map((lng) => (
             <button key={lng} onClick={() => setLang(lng)} className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${lang === lng ? (isLight ? 'bg-indigo-500 text-white' : 'bg-indigo-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>{lng}</button>
           ))}
        </div>
        <button onClick={() => setIsLight(!isLight)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-500 ${isLight ? 'bg-white shadow-sm text-amber-600 border border-amber-200 hover:scale-105' : 'bg-[#172033] border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-105 hover:text-white'}`}>{isLight ? '☀️ Light' : '🌙 Dark'}</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'theory' && <motion.div key="theory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute inset-0 pt-24 overflow-y-auto z-10"><TheorySection isLight={isLight} lang={lang} /></motion.div>}
        {activeTab === 'exam' && <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pt-24 overflow-y-auto z-10"><ExamSection isLight={isLight} dict={d} /></motion.div>}

        {activeTab === 'practice' && (
          <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-10">
            
            {/* ШАГ 0: СТАРТОВЫЙ ЭКРАН */}
            <AnimatePresence>
              {step === 0 && (
                <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} transition={{ duration: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-50 w-full max-w-2xl">
                  <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 mb-8 drop-shadow-lg tracking-tight">DH.Academy Simulator</h1>
                  
                  <div className={`flex items-center p-2 rounded-full border mb-8 ${isLight ? 'bg-slate-100 border-slate-300 shadow-inner' : 'bg-[#0B0F19]/80 border-indigo-500/30'}`}>
                    {[2, 3].map((m) => (
                      <button key={m} onClick={() => { setMode(m); setStep(0); setErrorMsg(""); }} className={`relative px-10 py-3 rounded-full text-base font-bold transition-colors duration-300 outline-none ${mode === m ? (isLight ? 'text-slate-900' : 'text-white') : (isLight ? 'text-slate-500' : 'text-indigo-400')}`}>
                        {mode === m && <motion.div layoutId="glass" className={`absolute inset-0 rounded-full -z-10 ${isLight ? 'bg-white shadow border-slate-200' : 'bg-indigo-500/40 border border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`} transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
                        <span className="relative z-10">{m === 2 ? d.part2 : d.part3}</span>
                      </button>
                    ))}
                  </div>

                  <div className={`w-full p-8 rounded-3xl border backdrop-blur-xl flex justify-around items-center shadow-2xl ${isLight ? 'bg-white/90 border-slate-300' : 'bg-[#0B0F19]/90 border-indigo-500/40'}`}>
                    <div className="text-center">
                      <p className={`text-sm mb-3 uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 ${isLight ? 'text-slate-700' : 'text-indigo-300'}`}>{d.prime}</p>
                      <input type="number" value={p} onChange={e => setP(e.target.value)} className={`font-mono text-2xl font-black px-6 py-3 rounded-2xl w-48 text-center border-2 outline-none transition-colors ${!isPrime(p) ? 'border-rose-500 text-rose-500 bg-rose-500/10' : (isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-[#050810] border-indigo-500/50 focus:border-cyan-400 text-cyan-300')}`} />
                      {!isPrime(p) && <span className="block text-[10px] text-rose-500 font-bold mt-2 uppercase">Не простое число!</span>}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm mb-3 uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 ${isLight ? 'text-slate-700' : 'text-indigo-300'}`}>{d.gen}</p>
                      {validRoots.length > 0 ? (
                        <select value={g} onChange={e => setG(e.target.value)} className={`font-mono text-2xl font-black px-6 py-3 rounded-2xl w-48 text-center border-2 outline-none cursor-pointer appearance-none transition-colors ${isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-[#050810] border-indigo-500/50 focus:border-cyan-400 text-cyan-300'}`}>
                          {validRoots.map(root => (<option key={root} value={root}>{root}</option>))}
                        </select>
                      ) : (
                        <div className="font-mono text-xs font-bold text-rose-500 border-2 border-rose-500/50 bg-rose-500/10 px-6 py-4 rounded-2xl w-48 text-center">ОШИБКА P</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ОСНОВНАЯ СЦЕНА (РАСКЛАДКА ЗВЕЗДА) */}
            <motion.div animate={{ opacity: step > 0 ? 1 : 0, scale: step > 0 ? 1 : 0.9, pointerEvents: step > 0 ? 'auto' : 'none' }} transition={{ duration: 0.8 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              
              {/* Центральный Хаб (Канал связи) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-auto">
                <NetworkVisualizer step={step} mode={mode} isLight={isLight} dict={d} pubA={users.alice.pub} pubB={users.bob.pub} pubC={users.carol.pub} isFocused={focused === 'all' || focused === 'channel'} />
              </div>

              {/* Алиса (Лево) */}
              <div className={`absolute left-4 lg:left-16 xl:left-24 w-[300px] lg:w-[320px] z-10 pointer-events-auto transition-all duration-500 ${mode === 3 ? 'top-[35%]' : 'top-1/2'} -translate-y-1/2`}>
                <UserCard name={d.alice} isLight={isLight} dict={d} showPrivInput={step === 1} showPrivText={step > 1} showPub={step >= (mode === 2 ? 3 : 4)} pubMath={getMath('alice', 'pub')} showInter={step >= 8} interMath={getMath('alice', 'inter')} showFinal={step >= (mode === 2 ? 6 : 12)} finalMath={getMath('alice', 'final')} onPrivChange={(v) => updatePriv('alice', v)} isWinner={step === (mode === 2 ? 7 : 14)} isFocused={focused === 'all' || focused === 'alice'} p={p} g={g} step={step} {...users.alice} />
              </div>

              {/* Боб (Право) */}
              <div className={`absolute right-4 lg:right-16 xl:right-24 w-[300px] lg:w-[320px] z-10 pointer-events-auto transition-all duration-500 ${mode === 3 ? 'top-[35%]' : 'top-1/2'} -translate-y-1/2`}>
                <UserCard name={d.bob} isLight={isLight} dict={d} showPrivInput={step === 2} showPrivText={step > 2} showPub={step >= (mode === 2 ? 4 : 5)} pubMath={getMath('bob', 'pub')} showInter={step >= 9} interMath={getMath('bob', 'inter')} showFinal={step >= (mode === 2 ? 7 : 13)} finalMath={getMath('bob', 'final')} onPrivChange={(v) => updatePriv('bob', v)} isWinner={step === (mode === 2 ? 7 : 14)} isFocused={focused === 'all' || focused === 'bob'} p={p} g={g} step={step} {...users.bob} />
              </div>

              {/* Кэрол (Низ по центру, поднята выше чтобы не перекрываться панелью) */}
              {mode === 3 && (
                <div className="absolute bottom-28 lg:bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-20 pointer-events-auto">
                  <UserCard name={d.carol} isLight={isLight} dict={d} showPrivInput={step === 3} showPrivText={step > 3} showPub={step >= 6} pubMath={getMath('carol', 'pub')} showInter={step >= 10} interMath={getMath('carol', 'inter')} showFinal={step >= 14} finalMath={getMath('carol', 'final')} onPrivChange={(v) => updatePriv('carol', v)} isWinner={step === 14} isFocused={focused === 'all' || focused === 'carol'} p={p} g={g} step={step} isHorizontal={true} {...users.carol} />
                </div>
              )}

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ФИКСИРОВАННАЯ ПАНЕЛЬ УПРАВЛЕНИЯ ВНИЗУ */}
      <AnimatePresence>
        {activeTab === 'practice' && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 flex flex-col items-center pointer-events-none">
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mb-3 px-6 py-2 rounded-full bg-rose-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(244,63,94,0.5)]">
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`pointer-events-auto flex justify-between items-center w-full px-6 py-4 rounded-3xl backdrop-blur-2xl border transition-colors duration-500 ${t.ctrlBar}`}>
              <button onClick={prevStep} disabled={step === 0} className={`px-6 py-2.5 rounded-xl font-bold text-base transition-all disabled:opacity-30 ${isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-white/10 text-indigo-300 hover:bg-white/20'}`}>{d.prev}</button>
              <div className="text-center flex-1 mx-6">
                <p className={`font-mono text-xs mb-1 tracking-widest uppercase font-extrabold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>{d.step} {step + 1} {d.of} {currentStepsList.length}</p>
                <h3 className={`text-xl font-bold tracking-wide leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentStepsList[step]}</h3>
              </div>
              <button onClick={nextStep} disabled={step === currentStepsList.length - 1} className={`px-6 py-2.5 rounded-xl font-bold text-base transition-all ${isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'}`}>{d.next}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalcOpen && <FloatingCalculator isLight={isLight} dict={d} onClose={() => setIsCalcOpen(false)} containerRef={appRef} />}
        {isCheatSheetOpen && <FloatingCheatSheet isLight={isLight} dict={d} lang={lang} setLang={setLang} containerRef={appRef} />}
      </AnimatePresence>

    </div>
  );
}