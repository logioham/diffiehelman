import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { powerMod, generatePrivateKey } from './utils/cryptoMath';
import { UserCard } from './components/UserCard';
import { Tooltip } from './components/Tooltip';
import { ColorMixer } from './components/ColorMixer';

export default function App() {
  const [mode, setMode] = useState(2); 
  const [step, setStep] = useState(0);

  const p = 23n; 
  const g = 5n;

  const [users, setUsers] = useState({
    alice: { priv: null, pub: null, inter: null, final: null },
    bob: { priv: null, pub: null, inter: null, final: null },
    carol: { priv: null, pub: null, inter: null, final: null } 
  });

  const nextStep = () => {
    const s = step + 1;
    setStep(s);
    let newUsers = { ...users };

    if (s === 2) {
      newUsers.alice.priv = generatePrivateKey();
      newUsers.bob.priv = generatePrivateKey();
      if (mode === 3) newUsers.carol.priv = generatePrivateKey();
    } 
    else if (s === 3) {
      newUsers.alice.pub = powerMod(g, newUsers.alice.priv, p);
      newUsers.bob.pub = powerMod(g, newUsers.bob.priv, p);
      if (mode === 3) newUsers.carol.pub = powerMod(g, newUsers.carol.priv, p);
    }
    else if (s === 5) {
      if (mode === 2) {
        newUsers.alice.final = powerMod(newUsers.bob.pub, newUsers.alice.priv, p);
        newUsers.bob.final = powerMod(newUsers.alice.pub, newUsers.bob.priv, p);
      } else if (mode === 3) {
        // Промежуточный обмен: Алиса берет ключ Кэрол, Боб -> Алисы, Кэрол -> Боба
        newUsers.alice.inter = powerMod(newUsers.carol.pub, newUsers.alice.priv, p); 
        newUsers.bob.inter = powerMod(newUsers.alice.pub, newUsers.bob.priv, p);     
        newUsers.carol.inter = powerMod(newUsers.bob.pub, newUsers.carol.priv, p);   
      }
    }
    else if (s === 7 && mode === 3) {
      // Финальный расчет: каждый возводит полученный промежуточный ключ в свою степень
      newUsers.alice.final = powerMod(newUsers.carol.inter, newUsers.alice.priv, p); 
      newUsers.bob.final = powerMod(newUsers.alice.inter, newUsers.bob.priv, p);     
      newUsers.carol.final = powerMod(newUsers.bob.inter, newUsers.carol.priv, p);   
    }
    
    setUsers(newUsers);
  };

  const prevStep = () => setStep(Math.max(0, step - 1));

  // Вынес центральный канал в отдельную переменную для чистоты кода
  const centralChannel = (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-2xl border-2 border-dashed border-slate-700 min-h-[300px] h-full">
      <span className="absolute top-4 text-slate-500 uppercase tracking-widest text-sm font-bold">Открытый канал связи</span>
      {step >= 1 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-6 mt-8">
          <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-sm text-yellow-200 mb-2">Простое число</p>
            <div className="text-2xl font-mono text-yellow-400"><Tooltip text={`p = ${p}`} explanation="..." /></div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-sm text-yellow-200 mb-2">Генератор</p>
            <div className="text-2xl font-mono text-yellow-400"><Tooltip text={`g = ${g}`} explanation="..." /></div>
          </div>
        </motion.div>
      )}
      {step >= 1 && <ColorMixer step={step} />}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 text-white p-8 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">Интерактивный Диффи-Хеллман</h1>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setMode(2); setStep(0); }} className={`px-6 py-2 rounded-full border transition-all ${mode === 2 ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-transparent border-gray-500'}`}>2 Участника</button>
          <button onClick={() => { setMode(3); setStep(0); }} className={`px-6 py-2 rounded-full border transition-all ${mode === 3 ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-transparent border-gray-500'}`}>3 Участника</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto mb-10 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
        <button onClick={prevStep} disabled={step === 0} className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50">Назад</button>
        <div className="text-center flex-1 mx-4">
          <p className="text-emerald-400 font-mono text-sm mb-1">ШАГ {step} из {mode === 2 ? 5 : 7}</p>
          <h3 className="text-lg font-semibold">Нажимай "Далее", чтобы увидеть магию</h3>
        </div>
        <button onClick={nextStep} disabled={(mode === 2 && step === 5) || step === 7} className="px-4 py-2 bg-blue-600 rounded">Далее</button>
      </div>

      <div className={`max-w-7xl mx-auto grid gap-6 ${mode === 2 ? 'grid-cols-[1fr_1.5fr_1fr]' : 'grid-cols-3'}`}>
        
        {/* Рендер для 2 участников */}
        {mode === 2 && (
          <>
            <UserCard name="Алиса" role="Alice" colorClass="shadow-blue-500/20" mode={mode} step={step} {...users.alice} />
            {centralChannel}
            <UserCard name="Боб" role="Bob" colorClass="shadow-red-500/20" mode={mode} step={step} {...users.bob} />
          </>
        )}

        {/* Рендер для 3 участников */}
        {mode === 3 && (
          <>
            <UserCard name="Алиса" role="Alice" colorClass="shadow-blue-500/20" mode={mode} step={step} {...users.alice} />
            <UserCard name="Боб" role="Bob" colorClass="shadow-red-500/20" mode={mode} step={step} {...users.bob} />
            <UserCard name="Кэрол" role="Carol" colorClass="shadow-purple-500/20" mode={mode} step={step} {...users.carol} />
            <div className="col-span-3">
              {centralChannel}
            </div>
          </>
        )}

      </div>
    </div>
  );
}