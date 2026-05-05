import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { generatePrivateKey } from '../utils/cryptoMath';

const MathSequence = ({ math, result, resultColor, isLight }) => {
  if (!math) return null;
  return (
    <div className={`mt-3 p-4 rounded-xl border font-mono text-base overflow-hidden transition-colors duration-500 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/50 border-slate-700/50 shadow-inner'}`}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className={`mb-3 flex items-center gap-3 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
        <span className={`text-xs px-2 py-1 rounded font-sans tracking-widest uppercase font-bold ${isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-200'}`}>Формула</span>
        {math.formula}
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className={`mb-4 flex items-center gap-3 font-bold ${isLight ? 'text-indigo-700' : 'text-indigo-300'}`}>
        <span className={`text-xs border px-2 py-1 rounded font-sans tracking-widest uppercase ${isLight ? 'bg-indigo-100 border-indigo-200 text-indigo-800' : 'bg-indigo-900/30 border-indigo-800/50 text-indigo-400'}`}>Подстановка</span>
        {math.sub}
      </motion.div>
      {result != null && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 1.2 }} className={`font-extrabold text-2xl pt-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-700/50'} ${resultColor}`}>
          = {result}
        </motion.div>
      )}
    </div>
  );
};

export const UserCard = ({
  name, isLight,
  priv, pub, inter, final,
  showPrivInput, showPrivText, showPub, showInter, showFinal,
  pubMath, interMath, finalMath, onPrivChange
}) => {
  let cardStyle, titleColor, privColor, pubColor, interColor, finalColor;

  if (name === "Алиса") {
    cardStyle = isLight ? "bg-white/80 border-cyan-200 shadow-[0_10px_40px_rgba(34,211,238,0.15)]" : "bg-[#172033]/60 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]";
    titleColor = isLight ? "text-slate-900" : "text-white";
    privColor = "text-cyan-600 dark:text-cyan-500";
    pubColor = isLight ? "text-sky-700" : "text-sky-400";
    interColor = isLight ? "text-indigo-700" : "text-indigo-400";
    finalColor = isLight ? "text-amber-700" : "text-amber-400";
  } else if (name === "Боб") {
    cardStyle = isLight ? "bg-white/80 border-rose-200 shadow-[0_10px_40px_rgba(244,63,94,0.1)]" : "bg-[#172033]/60 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]";
    titleColor = isLight ? "text-slate-900" : "text-white";
    privColor = "text-rose-600 dark:text-rose-500";
    pubColor = isLight ? "text-rose-700" : "text-rose-400";
    interColor = isLight ? "text-fuchsia-700" : "text-fuchsia-400";
    finalColor = isLight ? "text-amber-700" : "text-amber-400";
  } else {
    cardStyle = isLight ? "bg-white/80 border-violet-200 shadow-[0_10px_40px_rgba(139,92,246,0.1)]" : "bg-[#172033]/60 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]";
    titleColor = isLight ? "text-slate-900" : "text-white";
    privColor = "text-violet-600 dark:text-violet-500";
    pubColor = isLight ? "text-violet-700" : "text-violet-400";
    interColor = isLight ? "text-purple-700" : "text-purple-400";
    finalColor = isLight ? "text-amber-700" : "text-amber-400";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col p-8 rounded-2xl backdrop-blur-lg border transition-colors duration-500 w-full min-h-[300px] ${cardStyle}`}>
      <h2 className={`text-3xl font-extrabold mb-6 transition-colors duration-500 ${titleColor}`}>{name}</h2>
      <div className="space-y-6">
        {(showPrivInput || showPrivText) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl border transition-colors duration-500 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-slate-700/50'}`}>
            <p className={`text-sm mb-3 uppercase tracking-wider font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Секретный ключ</p>
            {showPrivInput ? (
              <div className="flex gap-3">
                <input
                  type="number" value={priv} onChange={(e) => onPrivChange(e.target.value)}
                  className={`font-mono text-lg font-bold px-4 py-2 rounded-lg outline-none border w-full transition-colors ${isLight ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500' : 'bg-[#050810] border-slate-700 text-slate-100 focus:border-cyan-400'}`}
                  placeholder="Введите число..."
                />
                <button onClick={() => onPrivChange(generatePrivateKey())} className={`px-4 py-2 rounded-lg transition font-bold text-lg ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'}`} title="Сгенерировать случайно">🎲</button>
              </div>
            ) : (
              <div className={`text-2xl font-mono font-bold ${privColor}`}>
                <Tooltip text={priv || '?'} explanation="Случайное число, которое участник держит в строгом секрете." isLight={isLight}/>
              </div>
            )}
          </motion.div>
        )}

        {showPub && pub && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <p className={`text-sm mb-2 uppercase tracking-wider font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Публичный ключ</p>
            <MathSequence math={pubMath} result={pub} resultColor={pubColor} isLight={isLight} />
          </motion.div>
        )}

        {showInter && inter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <p className={`text-sm mb-2 uppercase tracking-wider font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>Промежуточный ключ</p>
            <MathSequence math={interMath} result={inter} resultColor={interColor} isLight={isLight} />
          </motion.div>
        )}

        {showFinal && final && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 p-6 rounded-2xl relative overflow-hidden border transition-colors duration-500 ${isLight ? 'bg-amber-50 border-amber-300 shadow-inner' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <div className={`absolute top-0 left-0 w-1.5 h-full ${isLight ? 'bg-amber-500' : 'bg-amber-500'}`}></div>
            <p className={`text-sm mb-2 uppercase tracking-wider font-extrabold pl-3 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>Финальный общий секрет (K)</p>
            <MathSequence math={finalMath} result={final} resultColor={`text-4xl ${finalColor}`} isLight={isLight} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};