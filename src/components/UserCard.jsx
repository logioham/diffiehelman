import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { generatePrivateKey } from '../utils/cryptoMath';

const Confetti = () => {
  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-2xl">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2.5 h-2.5 rounded-sm ${colors[Math.floor(Math.random() * colors.length)]}`}
          initial={{ top: "100%", left: `${Math.random() * 100}%`, opacity: 1, rotate: 0 }}
          animate={{ top: "-20%", left: `${Math.random() * 100}%`, rotate: 720, opacity: [1, 1, 0] }}
          transition={{ duration: 1.5 + Math.random() * 2, ease: "easeOut", repeat: Infinity, delay: Math.random() * 1 }}
        />
      ))}
    </div>
  );
};

const MathSequence = ({ math, result, resultColor, isLight, dict }) => {
  if (!math) return null;
  return (
    <div className={`mt-2 p-3 rounded-xl border font-mono text-sm overflow-hidden transition-colors duration-500 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-slate-700/50 shadow-inner'}`}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className={`mb-2 flex items-center gap-3 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
        <span className={`text-[10px] px-2 py-0.5 rounded font-sans tracking-widest uppercase font-bold ${isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-200'}`}>{dict.formulaWord}</span>
        {math.formula}
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className={`mb-3 flex items-center gap-3 font-bold ${isLight ? 'text-indigo-700' : 'text-indigo-300'}`}>
        <span className={`text-[10px] border px-2 py-0.5 rounded font-sans tracking-widest uppercase ${isLight ? 'bg-indigo-100 border-indigo-200 text-indigo-800' : 'bg-indigo-900/30 border-indigo-800/50 text-indigo-400'}`}>{dict.substituteWord}</span>
        {math.sub}
      </motion.div>
      {result != null && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 0.8 }} className={`font-extrabold text-xl pt-2 border-t ${isLight ? 'border-slate-300' : 'border-slate-700/50'} ${resultColor}`}>
          = {result}
        </motion.div>
      )}
    </div>
  );
};

export const UserCard = ({
  name, isLight, dict,
  priv, pub, inter, final,
  showPrivInput, showPrivText, showPub, showInter, showFinal,
  pubMath, interMath, finalMath, onPrivChange, isWinner, isFocused
}) => {
  let cardStyle, titleColor, privColor, pubColor, interColor, finalColor, avatar;
  const isAlice = name === dict.alice;
  const isBob = name === dict.bob;

  if (isAlice) {
    avatar = "👩‍🎓"; cardStyle = isLight ? "bg-white/80 border-cyan-200 shadow-[0_10px_40px_rgba(34,211,238,0.15)]" : "bg-[#172033]/60 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]"; titleColor = isLight ? "text-slate-900" : "text-white"; privColor = "text-cyan-600 dark:text-cyan-500"; pubColor = isLight ? "text-sky-700" : "text-sky-400"; interColor = isLight ? "text-indigo-700" : "text-indigo-400"; finalColor = isLight ? "text-amber-700" : "text-amber-400";
  } else if (isBob) {
    avatar = "👨‍🎓"; cardStyle = isLight ? "bg-white/80 border-rose-200 shadow-[0_10px_40px_rgba(244,63,94,0.1)]" : "bg-[#172033]/60 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]"; titleColor = isLight ? "text-slate-900" : "text-white"; privColor = "text-rose-600 dark:text-rose-500"; pubColor = isLight ? "text-rose-700" : "text-rose-400"; interColor = isLight ? "text-fuchsia-700" : "text-fuchsia-400"; finalColor = isLight ? "text-amber-700" : "text-amber-400";
  } else {
    avatar = "🧑‍🎓"; cardStyle = isLight ? "bg-white/80 border-violet-200 shadow-[0_10px_40px_rgba(139,92,246,0.1)]" : "bg-[#172033]/60 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]"; titleColor = isLight ? "text-slate-900" : "text-white"; privColor = "text-violet-600 dark:text-violet-500"; pubColor = isLight ? "text-violet-700" : "text-violet-400"; interColor = isLight ? "text-purple-700" : "text-purple-400"; finalColor = isLight ? "text-amber-700" : "text-amber-400";
  }

  const focusProps = isFocused 
    ? { scale: 1.03, opacity: 1, filter: "blur(0px)", zIndex: 20 } 
    : { scale: 0.95, opacity: 0.4, filter: "blur(2px)", zIndex: 1 };

  if (isWinner) {
    focusProps.scale = 1; focusProps.opacity = 1; focusProps.filter = "blur(0px)"; focusProps.zIndex = 10;
  }

  return (
    <motion.div 
      animate={focusProps}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`flex flex-col p-6 rounded-2xl backdrop-blur-lg border transition-all duration-500 w-full relative overflow-hidden ${isWinner ? (isLight ? 'bg-emerald-50 border-emerald-400' : 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]') : cardStyle}`}
    >
      {isWinner && <Confetti />}

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <span className="text-4xl drop-shadow-md">{avatar}</span>
        <h2 className={`text-2xl font-extrabold transition-colors duration-500 ${isWinner ? 'text-emerald-500' : titleColor}`}>{name}</h2>
        <AnimatePresence>
          {showPrivInput && isFocused && (
            <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="text-2xl ml-auto animate-bounce">
              📝✍️
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4 relative z-10">
        {(showPrivInput || showPrivText) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 rounded-xl border transition-colors duration-500 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-slate-700/50'}`}>
            <p className={`text-xs mb-2 uppercase tracking-wider font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{dict.secretKey}</p>
            {showPrivInput ? (
              <div className="flex gap-2">
                <input type="number" value={priv} onChange={(e) => onPrivChange(e.target.value)} placeholder="..." className={`font-mono text-base font-bold px-3 py-1.5 rounded-lg outline-none border w-full transition-colors ${isLight ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500' : 'bg-[#050810] border-slate-700 text-slate-100 focus:border-cyan-400'}`} />
                <button onClick={() => onPrivChange(generatePrivateKey())} className={`px-3 py-1.5 rounded-lg transition font-bold text-base ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'}`} title="Random">🎲</button>
              </div>
            ) : (
              <div className={`text-xl font-mono font-bold ${privColor}`}>
                <Tooltip text={priv || '?'} explanation="" isLight={isLight}/>
              </div>
            )}
          </motion.div>
        )}
        
        {showPub && pub && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
            <p className={`text-xs mb-1 uppercase tracking-wider font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{dict.pubKey}</p>
            <MathSequence math={pubMath} result={pub} resultColor={pubColor} isLight={isLight} dict={dict} />
          </motion.div>
        )}
        
        {showInter && inter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
            <p className={`text-xs mb-1 uppercase tracking-wider font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{dict.interKey}</p>
            <MathSequence math={interMath} result={inter} resultColor={interColor} isLight={isLight} dict={dict} />
          </motion.div>
        )}
        
        {showFinal && final && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`mt-4 p-4 rounded-xl relative overflow-hidden border transition-all duration-500 ${isWinner ? 'bg-emerald-500 border-emerald-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]' : (isLight ? 'bg-amber-50 border-amber-300 shadow-inner' : 'bg-amber-500/10 border-amber-500/30')}`}>
            <p className={`text-xs mb-1 uppercase tracking-wider font-extrabold relative z-10 ${isWinner ? 'text-emerald-950' : (isLight ? 'text-amber-800' : 'text-amber-300')}`}>{isWinner ? '🏆 SUCCESS: WIIIN!' : dict.finalKey}</p>
            <div className={`font-mono font-black text-3xl mt-2 relative z-10 ${isWinner ? 'text-white drop-shadow-md' : finalColor}`}>
              = {final}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};