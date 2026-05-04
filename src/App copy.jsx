import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { powerMod, generatePrivateKey } from './utils/cryptoMath';
import { UserCard } from './components/UserCard';
import { Tooltip } from './components/Tooltip';
import { ColorMixer } from './components/ColorMixer';

export default function App() {
  const [mode, setMode] = useState(2); // 2 или 3 участника
  const [step, setStep] = useState(0);

  // Глобальные параметры (BigInt) - для демо берем небольшие простые числа
  const p = 23n; 
  const g = 5n;

  // Состояние пользователей
  const [users, setUsers] = useState({
    alice: { priv: null, pub: null, final: null },
    bob: { priv: null, pub: null, final: null },
    carol: { priv: null, pub: null, final: null } // Для режима 3 участников
  });

  const nextStep = () => {
    const s = step + 1;
    setStep(s);
    let newUsers = { ...users };

    if (s === 2) {
      // Генерация приватных ключей
      newUsers.alice.priv = generatePrivateKey();
      newUsers.bob.priv = generatePrivateKey();
      if (mode === 3) newUsers.carol.priv = generatePrivateKey();
    } 
    else if (s === 3) {
      // Вычисление публичных ключей (g^priv mod p)
      newUsers.alice.pub = powerMod(g, newUsers.alice.priv, p);
      newUsers.bob.pub = powerMod(g, newUsers.bob.priv, p);
      if (mode === 3) newUsers.carol.pub = powerMod(g, newUsers.carol.priv, p);
    }
    else if (s === 5 && mode === 2) {
      // Финальный секрет для 2-х: (чужой_pub ^ свой_priv) mod p
      newUsers.alice.final = powerMod(newUsers.bob.pub, newUsers.alice.priv, p);
      newUsers.bob.final = powerMod(newUsers.alice.pub, newUsers.bob.priv, p);
    }
    // TODO: Добавить шаги 5-6 для 3-х участников (промежуточный обмен)
    
    setUsers(newUsers);
  };

  const prevStep = () => setStep(Math.max(0, step - 1));

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 text-white p-8 font-sans">
      
      {/* Шапка */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          Интерактивный Диффи-Хеллман
        </h1>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { setMode(2); setStep(0); }}
            className={`px-6 py-2 rounded-full border transition-all ${mode === 2 ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-transparent border-gray-500 hover:border-gray-300'}`}
          >
            2 Участника
          </button>
          <button 
            onClick={() => { setMode(3); setStep(0); }}
            className={`px-6 py-2 rounded-full border transition-all ${mode === 3 ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-transparent border-gray-500 hover:border-gray-300'}`}
          >
            3 Участника
          </button>
        </div>
      </header>

      {/* Панель управления шагами */}
      <div className="max-w-4xl mx-auto mb-10 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex justify-between items-center">
        <button onClick={prevStep} disabled={step === 0} className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600 transition">Назад</button>
        <div className="text-center flex-1 mx-4">
          <p className="text-emerald-400 font-mono text-sm mb-1">ШАГ {step} из {mode === 2 ? 5 : 7}</p>
          <h3 className="text-lg font-semibold">
            {step === 0 && "Инициализация системы"}
            {step === 1 && "Открытые параметры сети"}
            {step === 2 && "Генерация секретных ключей"}
            {step === 3 && "Создание публичных ключей"}
            {step === 4 && "Обмен ключами по открытому каналу"}
            {step >= 5 && "Вычисление общего секрета"}
          </h3>
        </div>
        <button onClick={nextStep} disabled={(mode === 2 && step === 5) || step === 7} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition">Далее</button>
      </div>

      {/* Основная сетка */}
      <div className={`max-w-6xl mx-auto grid gap-6 ${mode === 2 ? 'grid-cols-[1fr_1.5fr_1fr]' : 'grid-cols-3'}`}>
        
        {/* Алиса */}
        <UserCard 
          name="Алиса" role="Alice" colorClass="shadow-blue-500/20"
          privateKey={users.alice.priv} publicKey={users.alice.pub} finalSecret={users.alice.final} step={step}
        />

        {/* Центральный канал (Открытая сеть) */}
        <div className="relative flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-2xl border-2 border-dashed border-slate-700 min-h-[400px]">
          <span className="absolute top-4 text-slate-500 uppercase tracking-widest text-sm font-bold">Открытый канал связи</span>
          
          {step >= 1 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-6 mt-8">
              <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-200 mb-2">Простое число</p>
                <div className="text-2xl font-mono text-yellow-400">
                  <Tooltip text={`p = ${p}`} explanation="Очень большое простое число. Оно формирует конечное поле (модульную арифметику), в котором работают вычисления." />
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-200 mb-2">Генератор</p>
                <div className="text-2xl font-mono text-yellow-400">
                  <Tooltip text={`g = ${g}`} explanation="Первообразный корень по модулю p. Базовое число, которое участники будут возводить в степень." />
                </div>
              </div>
            </motion.div>
          )}

          {/* Анимация обмена (Шаг 4) */}
          {step === 4 && mode === 2 && (
            <div className="w-full h-32 relative mt-8">
              {/* Ключ Алисы летит к Бобу */}
              <motion.div 
                initial={{ left: '0%', opacity: 1 }} animate={{ left: '100%', opacity: 0 }} transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 px-3 py-1 bg-blue-500/20 text-blue-300 font-mono text-sm border border-blue-500 rounded-full"
              >
                A = {users.alice.pub.toString()} ➔
              </motion.div>
              {/* Ключ Боба летит к Алисе */}
              <motion.div 
                initial={{ right: '0%', opacity: 1 }} animate={{ right: '100%', opacity: 0 }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-4 px-3 py-1 bg-red-500/20 text-red-300 font-mono text-sm border border-red-500 rounded-full"
              >
                ⬅ B = {users.bob.pub.toString()}
              </motion.div>
              <p className="text-center text-xs text-slate-400 mt-12">Злоумышленник видит эти данные, <br/>но без приватных ключей они бесполезны.</p>
            </div>
          )}

          {/* Подключаем смеситель цветов */}
          {step >= 1 && <ColorMixer step={step} />}
        </div>

        {/* Боб */}
        <UserCard 
          name="Боб" role="Bob" colorClass="shadow-red-500/20"
          privateKey={users.bob.priv} publicKey={users.bob.pub} finalSecret={users.bob.final} step={step}
        />

      </div>
    </div>
  );
}