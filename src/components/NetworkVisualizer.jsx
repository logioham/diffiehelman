import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Эффект шифрования в цифровой шум перед отправкой
const ScrambleText = ({ text, trigger }) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map(() => Math.floor(Math.random() * 10)).join(''));
      iterations++;
      if (iterations >= 10) { clearInterval(interval); setDisplay("✉️"); }
    }, 50);
    return () => clearInterval(interval);
  }, [text, trigger]);
  return <span>{display}</span>;
};

export const NetworkVisualizer = ({ step, mode, isLight, dict, pubA, pubB, pubC, isFocused }) => {
  let termBg = isLight ? 'bg-slate-900 border-slate-700' : 'bg-[#050810] border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]';
  let termHeader = isLight ? 'bg-slate-800 text-slate-400' : 'bg-rose-950/50 text-rose-400 border-b border-rose-500/20';
  let termText = isLight ? 'text-emerald-400' : 'text-rose-400';

  let hackerStatus = "STATUS: IDLE";
  let hackerLogs = [
    { text: "[SYS] Сниффинг открытого канала...", delay: 0 }, 
    { text: "[SYS] Ожидание пакетов...", delay: 0.5 }
  ];
  let hackerEmoji = "🦹‍♂️";
  
  let showPlaneA = false; let showPlaneB = false; let showPlaneC = false;

  const isFinalStep = (mode === 2 && step >= 6) || (mode === 3 && step >= 12);

  // Сценарии перехвата и логи Хакера синхронизированы по времени
  if (isFinalStep) {
    termBg = isLight ? 'bg-emerald-50 border-emerald-400 shadow-lg' : 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]';
    termHeader = isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-900/60 text-emerald-400 border-b border-emerald-500/30';
    termText = isLight ? 'text-emerald-700' : 'text-emerald-400';
    hackerStatus = "SECURE E2EE TUNNEL";
    hackerEmoji = "🔐";
    hackerLogs = [
      { text: "[SYS] Обмен завершен.", delay: 0 }, 
      { text: `[DAT] Перехвачено: A=${pubA||'?'}, B=${pubB||'?'}${mode===3 ? `, C=${pubC||'?'}` : ''}`, delay: 0.5 }, 
      { text: "[ERR] Дискретный логарифм не решен.", delay: 1 }, 
      { text: "[SYS] Полная секретность обеспечена.", delay: 1.5 }
    ];
  } else if (mode === 2) {
    if (step === 5) { 
      hackerStatus = "STATUS: INTERCEPTING..."; hackerEmoji = "🕵️‍♂️"; 
      hackerLogs = [
        { text: "[SYS] Перехват пакетов активирован...", delay: 0 }, 
        { text: `[DAT] Пакет от Алисы: ${pubA}`, delay: 1.6 }, 
        { text: `[DAT] Пакет от Боба: ${pubB}`, delay: 4.1 }, 
        { text: "[ERR] Расшифровка невозможна.", delay: 5.5 }
      ]; 
      showPlaneA = true; showPlaneB = true; 
    }
  } else {
    if (step === 7 || step === 11) { 
      hackerStatus = "STATUS: MASS INTERCEPT..."; hackerEmoji = "👨‍💻"; 
      hackerLogs = [
        { text: "[SYS] Массовый перехват...", delay: 0 }, 
        { text: `[DAT] Пакет от Алисы: ${pubA}`, delay: 1.6 }, 
        { text: `[DAT] Пакет от Боба: ${pubB}`, delay: 4.1 }, 
        { text: `[DAT] Пакет от Кэрол: ${pubC}`, delay: 6.6 }, 
        { text: "[ERR] Слишком сложный DLP. Отмена.", delay: 8 }
      ]; 
      showPlaneA=true; showPlaneB=true; showPlaneC=true;
    }
  }

  const focusProps = isFocused ? { scale: 1.1, opacity: 1, filter: "blur(0px)", zIndex: 10 } : { scale: 0.9, opacity: 0.5, filter: "blur(2px)", zIndex: 1 };

  // Цветовое кодирование для плашек участников
  const colors = {
    alice: isLight ? 'text-cyan-700 bg-cyan-100 border-cyan-300' : 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50',
    bob: isLight ? 'text-rose-700 bg-rose-100 border-rose-300' : 'text-rose-300 bg-rose-950/80 border-rose-500/50',
    carol: isLight ? 'text-violet-700 bg-violet-100 border-violet-300' : 'text-violet-300 bg-violet-950/80 border-violet-500/50'
  };

  const Airplane = ({ type, value, sender, receiver, colorClass, delay = 0 }) => {
    let startX = 0, startY = 0, endX = 0, endY = 0, startRot = 0, endRot = 0;
    
    if (type === 'A_to_B') { startX = -350; startY = 0; endX = 350; endY = 0; startRot = 15; endRot = 0; }
    if (type === 'B_to_A') { startX = 350; startY = 0; endX = -350; endY = 0; startRot = -15; endRot = 0; }
    if (type === 'A_to_B_ring') { startX = -300; startY = -50; endX = 300; endY = -50; startRot = 10; endRot = 0; }
    if (type === 'B_to_C') { startX = 300; startY = -50; endX = 0; endY = 250; startRot = 45; endRot = 90; }
    if (type === 'C_to_A') { startX = 0; startY = 250; endX = -300; endY = -50; startRot = -45; endRot = -45; }

    return (
      <motion.div
        initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
        animate={{ x: [startX, 0, 0, endX], y: [startY, 0, 0, endY], opacity: [0, 1, 1, 0], scale: [1, 1.5, 1.5, 1], rotate: [startRot, 0, 0, endRot] }}
        transition={{ duration: 4, delay: delay, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -mt-6 -ml-6 z-50 flex flex-col items-center justify-center p-2 rounded-xl border backdrop-blur-md shadow-2xl ${isLight ? 'bg-white/95 border-slate-300' : 'bg-slate-900/95 border-slate-600'}`}
      >
        {/* Яркая плашка "Кто -> Кому" */}
        <div className={`absolute -top-7 text-[10px] font-black px-2 py-0.5 rounded-md whitespace-nowrap border shadow-sm ${colorClass}`}>
          {sender} ➔ {receiver}
        </div>

        <span className="text-3xl mb-1 drop-shadow-md">✈️</span>
        <span className={`font-mono font-black text-sm ${colorClass.split(' ')[0]}`}>
          <ScrambleText text={String(value || "0")} trigger={true} />
        </span>
      </motion.div>
    );
  };

  return (
    <motion.div animate={focusProps} transition={{ duration: 0.5 }} className={`relative w-72 h-56 rounded-2xl border transition-colors duration-500 z-0 ${termBg}`}>
      <AnimatePresence>
        {mode === 2 && showPlaneA && <Airplane key="pA" type="A_to_B" value={pubA} sender={dict.alice} receiver={dict.bob} colorClass={colors.alice} delay={0} />}
        {mode === 2 && showPlaneB && <Airplane key="pB" type="B_to_A" value={pubB} sender={dict.bob} receiver={dict.alice} colorClass={colors.bob} delay={2.5} />}
        
        {mode === 3 && showPlaneA && <Airplane key="p3A" type="A_to_B_ring" value={pubA} sender={dict.alice} receiver={dict.bob} colorClass={colors.alice} delay={0} />}
        {mode === 3 && showPlaneB && <Airplane key="p3B" type="B_to_C" value={pubB} sender={dict.bob} receiver={dict.carol} colorClass={colors.bob} delay={2.5} />}
        {mode === 3 && showPlaneC && <Airplane key="p3C" type="C_to_A" value={pubC} sender={dict.carol} receiver={dict.alice} colorClass={colors.carol} delay={5.0} />}
      </AnimatePresence>

      <div className="flex flex-col h-full overflow-hidden rounded-2xl relative z-20">
        <div className={`flex items-center justify-between px-3 py-2 transition-colors duration-500 ${termHeader}`}>
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div></div>
          <span className="text-[9px] font-black tracking-widest uppercase">EVE_TERMINAL.exe</span>
        </div>
        <div className="flex-1 p-4 flex flex-col items-center">
          <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">{hackerEmoji}</div>
          <div className={`w-full text-[10px] font-mono font-bold mb-2 text-center border-b pb-2 ${isLight ? 'border-slate-700' : 'border-rose-900/50'}`}>{hackerStatus}</div>
          <div className={`w-full flex-1 overflow-hidden font-mono text-[9px] leading-relaxed flex flex-col justify-end transition-colors duration-500 ${termText}`}>
            {hackerLogs.map((log, i) => (
              <motion.div 
                key={`${step}-${i}`} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: log.delay }} 
                className={(log.text.includes("[ERR]") && !isFinalStep) ? "text-rose-500 font-bold" : ""}
              >
                {log.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};