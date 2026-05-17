import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrambleText = ({ text, trigger }) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map(() => Math.floor(Math.random() * 10)).join(''));
      iterations++;
      if (iterations >= 10) {
        clearInterval(interval);
        setDisplay("✉️");
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text, trigger]);
  return <span>{display}</span>;
};

export const NetworkVisualizer = ({ step, mode, isLight, dict, pubA, pubB, pubC, isFocused }) => {
  const t = {
    termBg: isLight ? 'bg-slate-900 border-slate-700' : 'bg-[#050810] border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    termHeader: isLight ? 'bg-slate-800 text-slate-400' : 'bg-rose-950/50 text-rose-400 border-b border-rose-500/20',
    termText: isLight ? 'text-emerald-400' : 'text-rose-400',
    grid: isLight ? 'opacity-5' : 'opacity-10'
  };

  let hackerStatus = "STATUS: IDLE";
  let hackerLogs = ["[SYS] Подключение к каналу...", "[SYS] Ожидание пакетов..."];
  let hackerEmoji = "🦹‍♂️";
  
  let showPlaneA = false; let showPlaneB = false; let showPlaneC = false;

  // Логика полетов самолетиков (Только во время шагов обмена)
  if (mode === 2) {
    if (step === 6) { 
      hackerStatus = "STATUS: INTERCEPTING..."; hackerEmoji = "🕵️‍♂️"; 
      hackerLogs = ["[SYS] Перехват пакетов обмена!", `[DAT] От Алисы: ${pubA}`, `[DAT] От Боба: ${pubB}`, "[ERR] Расшифровка невозможна. Нет прив. ключей.", "[SYS] Пакеты доставлены адресатам."]; 
      showPlaneA = true; showPlaneB = true; 
    }
    else if (step >= 7) { hackerStatus = "STATUS: FAILED"; hackerEmoji = "😭"; hackerLogs = ["[SYS] Обмен завершен.", "[ERR] Ключ K не скомпрометирован.", "[SYS] Хакер остался ни с чем."]; }
  } else {
    // 3 Участника
    if (step === 8 || step === 12) { 
      hackerStatus = "STATUS: MASS INTERCEPT..."; hackerEmoji = "👨‍💻"; 
      hackerLogs = ["[SYS] Массовый перехват пакетов...", "[DAT] Сбор открытых ключей...", "[ERR] Слишком сложный DLP. Отмена."]; 
      showPlaneA=true; showPlaneB=true; showPlaneC=true;
    }
    else if (step >= 13) { hackerStatus = "STATUS: FAILED"; hackerEmoji = "😭"; hackerLogs = ["[SYS] Обмен завершен.", "[SYS] Хакер остался ни с чем."]; }
  }

  const focusProps = isFocused ? { scale: 1.05, opacity: 1, filter: "blur(0px)", zIndex: 10 } : { scale: 0.95, opacity: 0.4, filter: "blur(2px)", zIndex: 1 };

  const Airplane = ({ type, value, delay = 0 }) => {
    let startX = 0, startY = 0, endX = 0, endY = 0, startRot = 0, endRot = 0;
    
    // Настраиваем траектории: все летят в центр к хакеру, потом разлетаются адресатам
    if (type === 'A_to_B') { startX = -250; startY = 30; endX = 250; endY = 30; startRot = 15; endRot = 0; }
    if (type === 'B_to_A') { startX = 250; startY = -30; endX = -250; endY = -30; startRot = -15; endRot = 0; }
    
    if (type === 'A_to_B_ring') { startX = -250; startY = 0; endX = 250; endY = 0; startRot = 15; endRot = 0; }
    if (type === 'B_to_C') { startX = 250; startY = 0; endX = 0; endY = 220; startRot = 45; endRot = 90; }
    if (type === 'C_to_A') { startX = 0; startY = 220; endX = -250; endY = 0; startRot = -45; endRot = -45; }

    return (
      <motion.div
        initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
        animate={{ x: [startX, 0, 0, endX], y: [startY, 0, 0, endY], opacity: [0, 1, 1, 0], scale: [1, 2, 2, 1], rotate: [startRot, 0, 0, endRot] }}
        transition={{ duration: 4, delay: delay, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
        className={`absolute top-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center p-2 rounded-xl border backdrop-blur-md ${isLight ? 'bg-white/90 border-indigo-200 shadow-xl' : 'bg-indigo-950/80 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]'}`}
      >
        <span className="text-2xl mb-1">✈️</span>
        <span className={`font-mono font-black text-sm ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>
          <ScrambleText text={String(value || "0")} trigger={true} />
        </span>
      </motion.div>
    );
  };

  return (
    <motion.div animate={focusProps} transition={{ duration: 0.5 }} className={`relative w-full h-[320px] flex items-center justify-center rounded-2xl border overflow-hidden transition-colors duration-500 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#050810] border-rose-500/20 shadow-[inset_0_0_50px_rgba(244,63,94,0.05)]'}`}>
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] ${t.grid}`}></div>
      <span className={`absolute top-4 uppercase tracking-widest text-xs font-extrabold z-10 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{dict.openChan}</span>
      
      <AnimatePresence>
        {mode === 2 && showPlaneA && <Airplane key="pA" type="A_to_B" value={pubA} />}
        {mode === 2 && showPlaneB && <Airplane key="pB" type="B_to_A" value={pubB} />}
        
        {mode === 3 && showPlaneA && <Airplane key="p3A" type="A_to_B_ring" value={pubA} />}
        {mode === 3 && showPlaneB && <Airplane key="p3B" type="B_to_C" value={pubB} />}
        {mode === 3 && showPlaneC && <Airplane key="p3C" type="C_to_A" value={pubC} />}
      </AnimatePresence>

      <div className={`relative z-20 w-72 h-56 rounded-xl flex flex-col overflow-hidden border ${t.termBg}`}>
        <div className={`flex items-center justify-between px-3 py-2 ${t.termHeader}`}>
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div></div>
          <span className="text-[9px] font-black tracking-widest">EVE_TERMINAL.exe</span>
        </div>
        <div className="flex-1 p-4 flex flex-col items-center">
          <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">{hackerEmoji}</div>
          <div className={`w-full text-[10px] font-mono font-bold mb-2 text-center border-b pb-2 ${isLight ? 'border-slate-700 text-slate-500' : 'border-rose-900/50 text-rose-500/70'}`}>{hackerStatus}</div>
          <div className={`w-full flex-1 overflow-hidden font-mono text-[9px] leading-relaxed flex flex-col justify-end ${t.termText}`}>
            {hackerLogs.map((log, i) => (<motion.div key={`${step}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }} className={log.includes("[ERR]") ? "text-rose-500 font-bold" : ""}>{log}</motion.div>))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};