import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { powerMod, isPrime, getNextPrime } from './utils/cryptoMath';
import { UserCard } from './components/UserCard';
import { Tooltip } from './components/Tooltip';
import { ColorMixer } from './components/ColorMixer';

export default function App() {
  const [mode, setMode] = useState(2); 
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isTheoryOpen, setIsTheoryOpen] = useState(true);
  const [isLight, setIsLight] = useState(false);

  const [p, setP] = useState("23"); 
  const [g, setG] = useState("5");

  const [users, setUsers] = useState({
    alice: { priv: "", pub: null, inter: null, final: null },
    bob: { priv: "", pub: null, inter: null, final: null },
    carol: { priv: "", pub: null, inter: null, final: null } 
  });

  const updatePriv = (user, val) => setUsers(prev => ({ ...prev, [user]: { ...prev[user], priv: val } }));

  const steps2 = ["Инициализация", "Параметры p и g", "Алиса задает секрет", "Боб задает секрет", "Алиса считает публ. ключ", "Боб считает публ. ключ", "Обмен ключами", "Алиса вычисляет финал", "Боб вычисляет финал"];
  const steps3 = ["Инициализация", "Параметры p и g", "Алиса задает секрет", "Боб задает секрет", "Кэрол задает секрет", "Алиса считает публ. ключ", "Боб считает публ. ключ", "Кэрол считает публ. ключ", "Обмен 1 (Публ. ключи)", "Алиса считает промежут.", "Боб считает промежут.", "Кэрол считает промежут.", "Обмен 2 (Промежут.)", "Алиса считает финал", "Боб считает финал", "Кэрол считает финал"];
  const currentStepsList = mode === 2 ? steps2 : steps3;

  const getMath = (user, type) => {
    const u = users[user];
    if (!u.priv) return null;
    if (type === 'pub') {
        const char = user === 'alice' ? 'A' : user === 'bob' ? 'B' : 'C';
        const pow = user === 'alice' ? 'a' : user === 'bob' ? 'b' : 'c';
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

  const getTheoryContent = () => {
    if (mode === 2) {
      switch(step) {
        case 0: return { title: "Суть алгоритма", text: "Диффи-Хеллман позволяет создать общий секретный ключ через открытый интернет, который прослушивают хакеры. Участники не пересылают сам ключ, они собирают его по частям.", formula: "Асимметричная криптография" };
        case 1: return { title: "Открытые параметры (p и g)", text: "Участники договариваются о модуле p (предел вычислений) и генераторе g. Хакер видит эти числа, но без приватных ключей они бесполезны.", formula: "p — простое число, g — корень" };
        case 2: return { title: "Секретный ключ a", text: "Алиса придумывает случайное число. Это её абсолютно секретная переменная. Она никогда не покинет её устройство.", formula: "Приватный ключ (a)" };
        case 3: return { title: "Секретный ключ b", text: "Боб делает то же самое. Если кто-то узнает эти числа — вся защита будет мгновенно взломана.", formula: "Приватный ключ (b)" };
        case 4: return { title: "Смешивание (Алиса)", text: "Алиса вычисляет свой публичный ключ. Эту операцию возведения в степень по модулю легко сделать, но почти невозможно обратить (Задача дискретного логарифма).", formula: "A = g^a mod p" };
        case 5: return { title: "Смешивание (Боб)", text: "Боб проводит такую же математическую операцию со своим секретом.", formula: "B = g^b mod p" };
        case 6: return { title: "Обмен по каналу", text: "Алиса и Боб пересылают публичные ключи (A и B) друг другу. Хакер их перехватывает, но не может извлечь из них a или b.", formula: "Перехват безопасен" };
        case 7: return { title: "Сборка (Алиса)", text: "Алиса возводит чужой публичный ключ (B) в степень своего секрета (a). Получается финальный ключ.", formula: "K = B^a mod p = g^(ab) mod p" };
        case 8: return { title: "Сборка (Боб)", text: "Боб возводит публичный ключ Алисы (A) в степень своего секрета (b). Степени умножаются, и Боб получает в точности то же самое число!", formula: "K = A^b mod p = g^(ab) mod p" };
        default: return null;
      }
    } else {
      if (step <= 1) return { title: "Кольцевой обмен", text: "Для трех участников логика усложняется: им нужно передавать ключи по кругу дважды, чтобы каждый подмешал свой секрет.", formula: "Параметры p и g" };
      if (step >= 2 && step <= 4) return { title: "Генерация секретов", text: "Каждый из участников генерирует свой случайный приватный ключ.", formula: "Секреты: a, b, c" };
      if (step >= 5 && step <= 7) return { title: "Первый слой", text: "Каждый вычисляет свой публичный ключ, чтобы передать его соседу (Алиса -> Бобу -> Кэрол -> Алисе).", formula: "X = g^x mod p" };
      if (step === 8) return { title: "Первый обмен", text: "Участники передают базовые публичные ключи.", formula: "Сдвиг по кольцу" };
      if (step >= 9 && step <= 11) return { title: "Промежуточный ключ", text: "Каждый возводит чужой ключ в свой секрет. Теперь в этих ключах замешаны секреты ДВУХ участников.", formula: "X_inter = Y^x mod p" };
      if (step === 12) return { title: "Второй обмен", text: "Передача промежуточных ключей дальше по кругу.", formula: "Сдвиг по кольцу" };
      if (step >= 13) return { title: "Финальная сборка", text: "Возведение двойного ключа в третий секрет. Теперь ключ содержит все переменные: a, b, c.", formula: "K = g^(abc) mod p" };
    }
  };

  const theory = getTheoryContent();

  const nextStep = () => {
    if (step === 1) {
      if (!p || !g) { setErrorMsg("Заполните оба поля!"); return; }
      if (!isPrime(p)) { setErrorMsg(`Ошибка: ${p} не является простым числом! Ближайшее: ${getNextPrime(p)}`); return; }
    }
    if (step === 2 && !users.alice.priv) { setErrorMsg("Введите ключ для Алисы!"); return; }
    if (step === 3 && !users.bob.priv) { setErrorMsg("Введите ключ для Боба!"); return; }
    if (mode === 3 && step === 4 && !users.carol.priv) { setErrorMsg("Введите ключ для Кэрол!"); return; }
    
    setErrorMsg(""); 
    const s = step + 1;
    let u = { ...users };

    if (mode === 2) {
      if (s === 4) u.alice.pub = powerMod(g, u.alice.priv, p);
      if (s === 5) u.bob.pub = powerMod(g, u.bob.priv, p);
      if (s === 7) u.alice.final = powerMod(u.bob.pub, u.alice.priv, p);
      if (s === 8) u.bob.final = powerMod(u.alice.pub, u.bob.priv, p);
    } else {
      if (s === 5) u.alice.pub = powerMod(g, u.alice.priv, p);
      if (s === 6) u.bob.pub = powerMod(g, u.bob.priv, p);
      if (s === 7) u.carol.pub = powerMod(g, u.carol.priv, p);
      if (s === 9) u.alice.inter = powerMod(u.carol.pub, u.alice.priv, p); 
      if (s === 10) u.bob.inter = powerMod(u.alice.pub, u.bob.priv, p);     
      if (s === 11) u.carol.inter = powerMod(u.bob.pub, u.carol.priv, p);   
      if (s === 13) u.alice.final = powerMod(u.carol.inter, u.alice.priv, p); 
      if (s === 14) u.bob.final = powerMod(u.alice.inter, u.bob.priv, p);     
      if (s === 15) u.carol.final = powerMod(u.bob.inter, u.carol.priv, p);   
    }
    setUsers(u); setStep(s);
  };

  const prevStep = () => { setErrorMsg(""); setStep(Math.max(0, step - 1)); };

  const t = {
    appBg: isLight ? "bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 to-slate-200 text-slate-800" : "bg-[#0B0F19] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#172033] to-[#0B0F19] text-white",
    titleGrad: isLight ? "from-cyan-600 via-indigo-600 to-violet-600" : "from-cyan-400 via-indigo-400 to-violet-400",
    pillCont: isLight ? "bg-white/80 border-slate-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]" : "bg-[#0B0F19]/60 border-indigo-500/20 shadow-[inset_0_2px_15px_rgba(0,0,0,0.6)]",
    pillBtnTextAct: isLight ? "text-slate-900" : "text-white",
    pillBtnTextInact: isLight ? "text-slate-500 hover:text-slate-700" : "text-indigo-300 hover:text-indigo-100",
    pillActCyan: isLight ? "bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-slate-200" : "bg-indigo-500/30 border-white/10 shadow-[0_0_25px_rgba(99,102,241,0.3)]",
    ctrlCont: isLight ? "bg-white/90 border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]" : "bg-[#172033]/80 border-indigo-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
    btnPrev: isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300" : "bg-[#0B0F19] text-indigo-200 hover:bg-indigo-900/50 border-indigo-500/20",
    btnNext: isLight ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)] border-indigo-500" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border-indigo-400/50",
    stepTxt: isLight ? "text-indigo-700" : "text-indigo-400",
    stepTitle: isLight ? "text-slate-900" : "text-white",
    theoryTglBtn: isLight ? "bg-white border-slate-300 text-indigo-700 hover:bg-slate-50 shadow-md" : "bg-[#0B0F19] border-indigo-500/30 text-indigo-400 hover:bg-indigo-950 shadow-[0_4px_15px_rgba(0,0,0,0.8)]",
    theoryCont: isLight ? "bg-white/90 border-slate-300 shadow-[0_15px_40px_rgba(0,0,0,0.08)]" : "bg-[#172033]/90 border-indigo-500/30 shadow-2xl",
    theoryText: isLight ? "text-slate-700 font-medium" : "text-indigo-50 font-medium",
    theoryFormBox: isLight ? "bg-slate-50 border-slate-200 shadow-inner" : "bg-[#0B0F19] border-indigo-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]",
    theoryFormLbl: isLight ? "text-slate-500" : "text-indigo-400/80",
    theoryFormTxt: isLight ? "text-cyan-700" : "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]",
    chanCont: isLight ? "bg-white/60 border-slate-300 shadow-[inset_0_0_30px_rgba(0,0,0,0.03)]" : "bg-[#0B0F19]/50 border-indigo-500/20 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]",
    chanTitle: isLight ? "text-slate-500" : "text-indigo-400/80",
    chanInpBox: isLight ? "bg-white/90 border-slate-300 shadow-sm" : "bg-indigo-950/30 border-indigo-500/20",
    chanInpLbl: isLight ? "text-slate-700" : "text-indigo-200",
    chanInp: isLight ? "bg-slate-50 text-slate-900 border-slate-300 focus:border-indigo-500" : "bg-[#050810] text-indigo-300 border-indigo-500/30 focus:border-cyan-400",
    chanInpVal: isLight ? "text-indigo-700" : "text-indigo-400"
  };

  const centralChannel = (
    <div className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border min-h-[350px] h-full w-full transition-colors duration-500 ${t.chanCont}`}>
      <span className={`absolute top-5 uppercase tracking-widest text-sm font-extrabold ${t.chanTitle}`}>Открытый канал связи</span>
      {step >= 1 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-8 mt-10">
          <div className={`text-center p-5 rounded-xl backdrop-blur-sm border transition-colors duration-500 ${t.chanInpBox}`}>
            <p className={`text-sm mb-3 flex items-center justify-center gap-2 uppercase tracking-wider font-extrabold ${t.chanInpLbl}`}>Простое число p <Tooltip text="?" explanation="Предел вычислений (модуль)." isLight={isLight}/></p>
            {step === 1 ? <input type="number" value={p} onChange={e => setP(e.target.value)} className={`font-mono text-lg font-bold px-3 py-2 rounded-lg w-28 text-center border outline-none transition-colors duration-500 ${t.chanInp}`} /> : <div className={`text-3xl font-mono font-extrabold ${t.chanInpVal}`}>{p}</div>}
          </div>
          <div className={`text-center p-5 rounded-xl backdrop-blur-sm border transition-colors duration-500 ${t.chanInpBox}`}>
            <p className={`text-sm mb-3 flex items-center justify-center gap-2 uppercase tracking-wider font-extrabold ${t.chanInpLbl}`}>Генератор g <Tooltip text="?" explanation="Базовое число для возведения в степень." isLight={isLight}/></p>
            {step === 1 ? <input type="number" value={g} onChange={e => setG(e.target.value)} className={`font-mono text-lg font-bold px-3 py-2 rounded-lg w-28 text-center border outline-none transition-colors duration-500 ${t.chanInp}`} /> : <div className={`text-3xl font-mono font-extrabold ${t.chanInpVal}`}>{g}</div>}
          </div>
        </motion.div>
      )}
      {step > 1 && <ColorMixer step={step} mode={mode} isLight={isLight} />}
    </div>
  );

  return (
    <div className={`min-h-screen antialiased transition-colors duration-700 p-6 pb-24 ${t.appBg}`}>
      <button 
        onClick={() => setIsLight(!isLight)} 
        className={`absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base transition-all duration-500 z-50 ${isLight ? 'bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-amber-600 border border-amber-200 hover:scale-105' : 'bg-[#172033] border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-105 hover:text-white hover:border-cyan-400'}`}
      >
        {isLight ? '☀️ Светлая' : '🌙 Темная'}
      </button>

      <header className="text-center mb-12 flex flex-col items-center pt-4">
        <h1 className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r mb-8 drop-shadow-lg tracking-tight transition-colors duration-500 ${t.titleGrad}`}>Интерактивный Диффи-Хеллман</h1>
        
        <div className={`relative flex items-center p-2 backdrop-blur-xl rounded-full border transition-colors duration-500 ${t.pillCont}`}>
          {[2, 3].map((m) => {
            const isActive = mode === m;
            return (
              <button key={m} onClick={() => { setMode(m); setStep(0); setErrorMsg(""); setIsTheoryOpen(true); }} className={`relative px-10 py-3 rounded-full text-base font-bold transition-colors duration-300 z-10 outline-none ${isActive ? t.pillBtnTextAct : t.pillBtnTextInact}`}>
                {isActive && <motion.div layoutId="glass-pill" className={`absolute inset-0 rounded-full backdrop-blur-md -z-10 transition-colors duration-500 ${t.pillActCyan}`} initial={false} transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
                <span className="relative z-10">{m} Участника</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex flex-col">
        <div className={`relative p-5 rounded-2xl backdrop-blur-md border flex flex-col items-center mb-10 z-20 transition-colors duration-500 ${t.ctrlCont}`}>
          <div className="flex justify-between items-center w-full mb-2">
            <button onClick={prevStep} disabled={step === 0} className={`px-6 py-2.5 rounded-lg disabled:opacity-50 transition-all font-bold text-base border ${t.btnPrev}`}>Назад</button>
            <div className="text-center flex-1 mx-6">
              <p className={`font-mono text-sm mb-2 tracking-widest uppercase font-extrabold transition-colors duration-500 ${t.stepTxt}`}>ШАГ {step} из {currentStepsList.length - 1}</p>
              <h3 className={`text-2xl font-bold tracking-wide transition-colors duration-500 ${t.stepTitle}`}>{currentStepsList[step]}</h3>
            </div>
            <button onClick={nextStep} disabled={step === currentStepsList.length - 1} className={`px-6 py-2.5 rounded-lg font-bold text-base transition-all border ${t.btnNext}`}>Далее</button>
          </div>
          {errorMsg && <div className="text-rose-500 font-bold bg-rose-100 dark:bg-rose-950/50 px-5 py-3 rounded-xl w-full text-center border border-rose-500 mt-4 animate-pulse text-lg">{errorMsg}</div>}
          
          <button onClick={() => setIsTheoryOpen(!isTheoryOpen)} className={`absolute -bottom-4 rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border ${t.theoryTglBtn}`}>
            {isTheoryOpen ? "Скрыть теорию" : "Показать теорию"}
            <motion.span animate={{ rotate: isTheoryOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>▼</motion.span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {theory && isTheoryOpen && (
            <motion.div
              key="theory-box"
              initial={{ height: 0, opacity: 0, scaleX: 0.05, scaleY: 0, y: -40, filter: "blur(12px)", marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, scaleX: 1, scaleY: 1, y: 0, filter: "blur(0px)", marginBottom: "3rem" }}
              exit={{ height: 0, opacity: 0, scaleX: 0.05, scaleY: 0, y: -40, filter: "blur(12px)", marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              style={{ transformOrigin: "top center" }}
            >
              <div className={`w-full relative overflow-hidden backdrop-blur-2xl border rounded-2xl transition-colors duration-500 ${t.theoryCont}`}>
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 via-indigo-500 to-violet-500"></div>
                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-indigo-500/20 border-indigo-500/30 text-2xl'}`}><span className={isLight ? "text-2xl" : ""}>💡</span></div>
                      <h4 className={`font-extrabold uppercase text-base tracking-widest transition-colors duration-500 ${isLight ? 'text-indigo-800' : 'text-indigo-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}>{theory.title}</h4>
                    </div>
                    <p className={`text-lg leading-relaxed transition-colors duration-500 ${t.theoryText}`}>{theory.text}</p>
                  </div>
                  <div className={`p-6 rounded-2xl border min-w-[320px] text-center relative overflow-hidden transition-colors duration-500 ${t.theoryFormBox}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
                    <span className={`text-xs uppercase font-bold block mb-3 tracking-widest transition-colors duration-500 ${t.theoryFormLbl}`}>Текущая формула</span>
                    <span className={`font-mono text-2xl font-bold transition-colors duration-500 ${t.theoryFormTxt}`}>{theory.formula}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-[1500px] mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-8">
          <div className="w-full">
            <UserCard name="Алиса" isLight={isLight}
              showPrivInput={step === 2} showPrivText={step > 2} 
              showPub={step >= (mode === 2 ? 4 : 5)} pubMath={getMath('alice', 'pub')} 
              showInter={step >= 9} interMath={getMath('alice', 'inter')} 
              showFinal={step >= (mode === 2 ? 7 : 13)} finalMath={getMath('alice', 'final')}
              onPrivChange={(v) => updatePriv('alice', v)} {...users.alice} />
          </div>
          <div className="w-full flex flex-col gap-8">
            {centralChannel}
            {mode === 3 && (
              <div className="w-full">
                <UserCard name="Кэрол" isLight={isLight}
                  showPrivInput={step === 4} showPrivText={step > 4} 
                  showPub={step >= 7} pubMath={getMath('carol', 'pub')} 
                  showInter={step >= 11} interMath={getMath('carol', 'inter')} 
                  showFinal={step >= 15} finalMath={getMath('carol', 'final')}
                  onPrivChange={(v) => updatePriv('carol', v)} {...users.carol} />
              </div>
            )}
          </div>
          <div className="w-full">
            <UserCard name="Боб" isLight={isLight}
              showPrivInput={step === 3} showPrivText={step > 3} 
              showPub={step >= (mode === 2 ? 5 : 6)} pubMath={getMath('bob', 'pub')} 
              showInter={step >= 10} interMath={getMath('bob', 'inter')} 
              showFinal={step >= (mode === 2 ? 8 : 14)} finalMath={getMath('bob', 'final')}
              onPrivChange={(v) => updatePriv('bob', v)} {...users.bob} />
          </div>
        </div>
      </div>
    </div>
  );
}