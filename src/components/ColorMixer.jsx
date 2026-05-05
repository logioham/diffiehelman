import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ColorMixer = ({ step, mode = 2, isLight = false }) => {
  const textColor = isLight ? "text-slate-700" : "text-slate-200";
  const signColor = isLight ? "text-slate-500" : "text-slate-400";

  const Drop = ({ color, label, size = "w-14 h-14", delay = 0 }) => (
    <motion.div
      initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", delay, stiffness: 200 }}
      className="flex flex-col items-center"
    >
      <div className={`${size} rounded-full border ${isLight ? 'border-black/5' : 'border-white/20'} relative`} style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}${isLight ? '40' : '80'}` }} />
      {label && <p className={`text-xs ${textColor} mt-3 text-center max-w-[90px] leading-tight font-bold tracking-wide`}>{label}</p>}
    </motion.div>
  );

  const LiquidMerge = ({ c1, c2, finalC, label, delay = 0 }) => (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-20 flex items-center justify-center" style={{ filter: 'url(#goo)' }}>
        <motion.div initial={{ x: -25, backgroundColor: c1 }} animate={{ x: 0, backgroundColor: finalC }} transition={{ duration: 1.5, ease: "easeInOut", delay: delay + 0.2 }} className="absolute w-12 h-12 rounded-full" />
        <motion.div initial={{ x: 25, backgroundColor: c2 }} animate={{ x: 0, backgroundColor: finalC }} transition={{ duration: 1.5, ease: "easeInOut", delay: delay + 0.2 }} className="absolute w-12 h-12 rounded-full" />
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + 1.2 }} className={`text-xs ${textColor} font-bold uppercase tracking-wider text-center mt-2`}>
        {label}
      </motion.div>
    </div>
  );

  const Plus = () => <span className={`text-3xl ${signColor} font-bold mx-3 pb-6`}>+</span>;
  const MathRow = ({ children }) => <div className="flex items-center justify-center w-full">{children}</div>;

  const RingExchange = ({ step }) => {
    const isFirst = step === 8;
    const d1 = isFirst ? { c: "#0EA5E9", t: "A → Боб" } : { c: "#6366F1", t: "A+C → Боб" };
    const d2 = isFirst ? { c: "#E11D48", t: "B → Кэрол" } : { c: "#9333EA", t: "B+A → Кэрол" };
    const d3 = isFirst ? { c: "#9333EA", t: "C → Алиса" } : { c: "#4F46E5", t: "C+B → Алиса" };

    return (
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="absolute top-2 left-[calc(50%-120px)] flex flex-col items-center opacity-70"><div className="w-3 h-3 rounded-full bg-cyan-500 mb-1"/><span className={`text-xs uppercase tracking-wider font-bold ${textColor}`}>Алиса</span></div>
        <div className="absolute top-2 right-[calc(50%-120px)] flex flex-col items-center opacity-70"><div className="w-3 h-3 rounded-full bg-rose-500 mb-1"/><span className={`text-xs uppercase tracking-wider font-bold ${textColor}`}>Боб</span></div>
        <div className="absolute bottom-2 left-[50%] -translate-x-1/2 flex flex-col items-center opacity-70"><span className={`text-xs mb-1 uppercase tracking-wider font-bold ${textColor}`}>Кэрол</span><div className="w-3 h-3 rounded-full bg-violet-500"/></div>

        <motion.div animate={{ x: [-100, 100], y: [-20, -20], scale: [0.6, 1.1, 0.6], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute">
          <div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full border-2 border-white/30" style={{backgroundColor: d1.c, boxShadow: `0 0 20px ${d1.c}`}}/><span className={`text-xs mt-2 font-bold ${textColor}`}>{d1.t}</span></div>
        </motion.div>
        <motion.div animate={{ x: [100, 0], y: [-20, 60], scale: [0.6, 1.1, 0.6], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute">
           <div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full border-2 border-white/30" style={{backgroundColor: d2.c, boxShadow: `0 0 20px ${d2.c}`}}/><span className={`text-xs mt-2 font-bold ${textColor}`}>{d2.t}</span></div>
        </motion.div>
        <motion.div animate={{ x: [0, -100], y: [60, -20], scale: [0.6, 1.1, 0.6], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} className="absolute">
           <div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full border-2 border-white/30" style={{backgroundColor: d3.c, boxShadow: `0 0 20px ${d3.c}`}}/><span className={`text-xs mt-2 font-bold ${textColor}`}>{d3.t}</span></div>
        </motion.div>
      </div>
    );
  };

  let content = null;
  const BASE = "#818CF8"; 
  const ALI = "#22D3EE";  
  const BOB = "#FB7185";  
  const CAR = "#A78BFA";  
  const PUB_A = "#0EA5E9"; 
  const PUB_B = "#E11D48"; 
  const PUB_C = "#9333EA"; 
  const FINAL = "#FBBF24"; 

  if (mode === 2) {
    if (step === 1) content = <Drop color={BASE} label="Общая база (g)" size="w-20 h-20" />;
    else if (step === 2) content = <MathRow><Drop color={BASE} label="Общая" /><Plus /><Drop color={ALI} label="Секрет Алисы" delay={0.2} /></MathRow>;
    else if (step === 3) content = <MathRow><Drop color={BASE} label="Общая" /><Plus /><Drop color={BOB} label="Секрет Боба" delay={0.2} /></MathRow>;
    else if (step === 4) content = <LiquidMerge c1={BASE} c2={ALI} finalC={PUB_A} label="Публичный A" />;
    else if (step === 5) content = <div className="flex gap-10 w-full justify-center"><LiquidMerge c1={BASE} c2={ALI} finalC={PUB_A} label="Публ. A" /><LiquidMerge c1={BASE} c2={BOB} finalC={PUB_B} label="Публ. B" delay={0.2} /></div>;
    else if (step === 6) content = <div className="relative w-full h-32 flex items-center justify-center overflow-hidden"><motion.div animate={{ x: [-140, 140] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} className="absolute"><Drop color={PUB_A} label="A → Боб" size="w-14 h-14" /></motion.div><motion.div animate={{ x: [140, -140] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} className="absolute"><Drop color={PUB_B} label="B → Алиса" size="w-14 h-14" /></motion.div></div>;
    else if (step === 7) content = <LiquidMerge c1={PUB_B} c2={ALI} finalC={FINAL} label="Общий Секрет!" />;
    else if (step >= 8) content = <div className="flex gap-10 w-full justify-center"><LiquidMerge c1={PUB_B} c2={ALI} finalC={FINAL} label="Секрет Алисы" /><LiquidMerge c1={PUB_A} c2={BOB} finalC={FINAL} label="Секрет Боба" delay={0.2} /></div>;
  } else {
    if (step <= 1) content = <Drop color={BASE} label="Общая база" />;
    else if (step >= 2 && step <= 4) content = <div className="flex gap-8"><Drop color={ALI} label="Секр. A" /><Drop color={BOB} label="Секр. B" /><Drop color={CAR} label="Секр. C" /></div>;
    else if (step >= 5 && step <= 7) content = <div className="flex gap-4 md:gap-8"><LiquidMerge c1={BASE} c2={ALI} finalC={PUB_A} label="Публ. A" /><LiquidMerge c1={BASE} c2={BOB} finalC={PUB_B} label="Публ. B" delay={0.2}/><LiquidMerge c1={BASE} c2={CAR} finalC={PUB_C} label="Публ. C" delay={0.4}/></div>;
    else if (step === 8 || step === 12) content = <RingExchange step={step} />;
    else if (step >= 9 && step <= 11) content = <div className="flex gap-4 md:gap-8"><LiquidMerge c1={PUB_C} c2={ALI} finalC="#6366F1" label="Промеж. A" /><LiquidMerge c1={PUB_A} c2={BOB} finalC="#BE123C" label="Промеж. B" delay={0.2}/><LiquidMerge c1={PUB_B} c2={CAR} finalC="#4C1D95" label="Промеж. C" delay={0.4}/></div>;
    else if (step >= 13) content = <div className="flex gap-4 md:gap-8"><LiquidMerge c1="#4C1D95" c2={ALI} finalC={FINAL} label="Финал A" /><LiquidMerge c1="#6366F1" c2={BOB} finalC={FINAL} label="Финал B" delay={0.2}/><LiquidMerge c1="#BE123C" c2={CAR} finalC={FINAL} label="Финал C" delay={0.4}/></div>;
  }

  return (
    <div className={`mt-6 p-6 border rounded-xl w-full max-w-xl mx-auto relative transition-colors duration-500 ${isLight ? 'bg-white/50 border-slate-200 shadow-sm' : 'bg-[#0B0F19]/60 border-indigo-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]'}`}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        </filter>
      </svg>
      <h4 className={`text-center text-xs font-bold mb-6 uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-indigo-400/70'}`}>Визуализация процесса</h4>
      <div className="flex justify-center items-center min-h-[180px] w-full">
         <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full flex justify-center">
               {content || <span className={`text-base font-medium ${textColor}`}>Ожидание...</span>}
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
};