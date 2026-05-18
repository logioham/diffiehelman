import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { powerMod } from '../utils/cryptoMath';

// Эффект превращения цифр в цифровой шум (для красоты)
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

export const FloatingCalculator = ({ isLight, dict, onClose, containerRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Мощный обработчик математики
  const safeEval = (expr) => {
    try {
      let cleanExpr = expr.replace(/\s+/g, ' ').trim();
      
      // Сначала проверяем, не классический ли это Диффи-Хеллман a^b mod p
      const dhMatch = cleanExpr.match(/^(\d+)\s*\^\s*(\d+)\s*mod\s*(\d+)$/);
      if (dhMatch) return powerMod(dhMatch[1], dhMatch[2], dhMatch[3]) || "Ошибка";
      
      // Заменяем наши символы на понятные JavaScript
      let jsExpr = cleanExpr
        .replace(/mod/g, '%')
        .replace(/\^/g, '**')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');

      // Обработка факториала (например 5!)
      jsExpr = jsExpr.replace(/(\d+)!/g, '(function(n){let r=1;for(let i=2;i<=n;i++)r*=i;return r;})($1)');

      let res = Function(`'use strict'; return (${jsExpr})`)();
      if (typeof res === 'number' && !Number.isInteger(res)) return parseFloat(res.toFixed(6));
      return res;
    } catch (e) { 
      return "Ошибка"; 
    }
  };

  const handleBtn = (val) => {
    if (val === 'AC') { setDisplay(""); setHistory(""); return; }
    if (val === 'DEL') { setDisplay(display.trim().slice(0, -1)); return; }
    if (val === '=') { if (!display) return; setHistory(display + " ="); setDisplay(String(safeEval(display))); return; }
    
    // Если это функция, сразу добавляем скобку
    if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(val)) {
      setDisplay(display + val + "(");
    } else if (['+', '-', '*', '/', 'mod', '^'].includes(val)) {
      setDisplay(display + " " + val + " ");
    } else {
      setDisplay(display + val);
    }
  };

  // Сетка инженерного калькулятора (6 строк по 5 колонок)
  const buttons = [
    '(', ')', '!', 'AC', 'DEL',
    'log', 'ln', '^', 'mod', '/',
    '√', 'π', '7', '8', '9',
    'sin', 'cos', '4', '5', '6',
    'tan', 'e', '1', '2', '3',
    '+', '-', '*', '0', '='
  ];

  const getBtnStyle = (btn) => {
    const base = "h-10 sm:h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center transition-all active:scale-95 shadow-sm ";
    if (['AC', 'DEL'].includes(btn)) return base + (isLight ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30");
    if (['^', 'mod', '!', '√', 'log', 'ln', 'sin', 'cos', 'tan', '(', ')'].includes(btn)) return base + (isLight ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30");
    if (['/', '*', '-', '+', '='].includes(btn)) return base + (isLight ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30");
    return base + (isLight ? "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50" : "bg-[#172033] text-white border border-indigo-500/20 hover:bg-[#1E293B]");
  };

  return (
    <motion.div
      drag dragConstraints={containerRef} dragMomentum={false}
      onDragStart={() => setIsDragging(true)} onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
      initial={{ opacity: 0, scale: 0.8, x: -50 }} 
      animate={{ opacity: 1, scale: 1, x: 0, width: isOpen ? 360 : 64, height: isOpen ? 'auto' : 64, borderRadius: isOpen ? 24 : 32 }} 
      exit={{ opacity: 0, scale: 0.8, x: -50 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ position: 'absolute', top: '30%', left: 60, zIndex: 9999 }}
      className={`shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col border ${isLight ? 'bg-slate-50/90 backdrop-blur-xl border-slate-300' : 'bg-[#050810]/90 backdrop-blur-xl border-indigo-500/40'}`}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          <div className={`p-4 border-b flex justify-between items-center cursor-grab active:cursor-grabbing ${isLight ? 'border-slate-200 bg-white/50' : 'border-indigo-500/20 bg-white/5'}`}>
             <div className="flex items-center gap-2"><span className={`opacity-40 text-xl leading-none ${isLight ? 'text-slate-400' : 'text-indigo-300'}`}>⋮⋮</span><span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-indigo-800' : 'text-indigo-400'}`}>{dict.calcTitle}</span></div>
             <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsOpen(false)} className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isLight ? 'bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-600' : 'bg-white/10 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400'}`}>✕</button>
          </div>
          <div className="p-4 flex-1 flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
            <div className={`p-4 rounded-xl mb-4 text-right flex flex-col justify-end min-h-[80px] overflow-hidden transition-colors ${isLight ? 'bg-white border border-slate-300 shadow-sm' : 'bg-[#0B0F19] border border-indigo-500/40 shadow-inner'}`}>
              <div className={`text-xs h-4 mb-1 overflow-x-auto whitespace-nowrap scrollbar-hide ${isLight ? 'text-slate-400' : 'text-indigo-400/50'}`}>{history}</div><div className={`text-2xl font-mono font-bold overflow-x-auto whitespace-nowrap scrollbar-hide ${isLight ? 'text-slate-800' : 'text-cyan-400'}`}>{display || "0"}</div>
            </div>
            {/* Сетка из 5 колонок */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {buttons.map((btn, i) => (<button key={i} onClick={() => handleBtn(btn)} className={getBtnStyle(btn)}>{btn}</button>))}
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => { if (!isDragging) setIsOpen(true); }} className={`w-full h-full text-3xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isLight ? 'text-indigo-600 bg-white' : 'text-indigo-300'}`}>🧮</button>
      )}
    </motion.div>
  );
};