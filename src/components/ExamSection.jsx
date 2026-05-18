import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { powerMod, isPrime, getPrimitiveRoots } from '../utils/cryptoMath';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const locales = {
  ru: {
    title: "DH.Academy Экзамен", subtitle: "Пройдите все уровни, чтобы доказать свои навыки и получить сертификат.",
    lvl1: "Уровень 1", lvl1Desc: "Теоретический тест (10 вопросов)",
    lvl2: "Уровень 2", lvl2Desc: "Практика: Обмен ключами (2 участника)",
    lvl3: "Уровень 3", lvl3Desc: "Практика: Обмен ключами (3 участника)",
    locked: "🔒 Заблокировано", passed: "✅ Пройдено",
    getCertBtn: "Сразу получить сертификат (Читерская кнопка 🤫)",
    qTitle: "Вопрос", qOf: "из", qRes: "Результат:", qPass: "Отлично! Вы доказали базовые знания.", qFail: "Нужно набрать минимум 8 баллов. Повторите теорию!",
    btnRetry: "Пройти заново", setupTitle: "Настройка сети", modP: "Модуль P", rootG: "Корень G", btnNext: "Далее", errP: "ОШИБКА P",
    secTitle: "Придумайте секретный ключ", btnMem: "Запомнить", formTitle: "Выберите правильную формулу",
    subTitle: "Подстановка значений", base: "Основание", exp: "Степень", mod: "Модуль", ans: "Ответ:", res: "Результат",
    btnSend: "Отправить в сеть ✈️", finK: "Финальный секрет (K)", subFin: "Подстановка для Финала", btnCheck: "Проверить ключ 🔐",
    winLvl: "Уровень пройден!", btnNextLvl: "К следующему уровню ➔",
    formDTitle: "Мини-опрос перед сертификацией", fLabel: "ФИО (как в паспорте)", aLabel: "Возраст", dobLabel: "Дата Рождения", sLabel: "Где учитесь? (или 'Нигде')", cLabel: "Страна",
    sPlaceholder: "Напр: КазНУ", cPlaceholder: "Напр: Казахстан", btnGetCert: "Сгенерировать Сертификат 🎓",
    online: "в сети", sending: "Отправляю пакет:", btnHome: "На главную",
    certLangNames: { ru: "Russian", en: "English", kk: "Kazakh" },
    examDuration: "DURATION", quizResult: "THEORY SCORE",
    questions: [
      { q: "Что такое P в алгоритме Диффи-Хеллмана?", options: ["Секретный ключ", "Простое число (модуль)", "Симметричный шифр"], ans: 1 },
      { q: "Каким свойством должен обладать генератор G?", options: ["Быть четным числом", "Быть первообразным корнем по модулю P", "Быть больше P"], ans: 1 },
      { q: "Что позволяет сделать алгоритм DH?", options: ["Безопасно обменяться ключами по открытому каналу", "Зашифровать жесткий диск", "Сжать данные"], ans: 0 },
      { q: "В чем суть проблемы дискретного логарифма?", options: ["Сложно умножать большие числа", "Легко возвести в степень, но сложно найти исходную степень зная результат", "Логарифмы занимают много памяти"], ans: 1 },
      { q: "Как вычисляется публичный ключ Алисы (A)?", options: ["A = g^a mod p", "A = p^g mod a", "A = g * a mod p"], ans: 0 },
      { q: "Что такое 'a' и 'b' в формулах?", options: ["Публичные ключи", "Случайные секретные ключи", "Идентификаторы пользователей"], ans: 1 },
      { q: "Защищает ли 'чистый' DH от атаки 'Человек посередине'?", options: ["Да, всегда", "Нет, нужна дополнительная аутентификация", "Зависит от длины P"], ans: 1 },
      { q: "Какая уязвимость связана с переиспользованием 512-битных простых чисел?", options: ["Heartbleed", "Logjam", "Spectre"], ans: 1 },
      { q: "Почему нельзя использовать составное число вместо простого P?", options: ["Увеличится скорость", "Снизится криптостойкость", "Ничего не изменится"], ans: 1 },
      { q: "Какой итоговый секрет получается у обоих участников?", options: ["g^(a+b) mod p", "g^(ab) mod p", "(g*a*b) mod p"], ans: 1 }
    ]
  },
  en: {
    title: "DH.Academy Exam", subtitle: "Pass all levels to prove your skills and get the certificate.",
    lvl1: "Level 1", lvl1Desc: "Theoretical Quiz (10 questions)", lvl2: "Level 2", lvl2Desc: "Practice: Key Exchange (2 peers)", lvl3: "Level 3", lvl3Desc: "Practice: Key Exchange (3 peers)",
    locked: "🔒 Locked", passed: "✅ Passed", getCertBtn: "Get certificate immediately (Cheat button 🤫)",
    qTitle: "Question", qOf: "of", qRes: "Result:", qPass: "Excellent! You proved your basic knowledge.", qFail: "You need at least 8 points. Review the theory!",
    btnRetry: "Try Again", setupTitle: "Network Setup", modP: "Modulus P", rootG: "Root G", btnNext: "Next", errP: "ERROR P",
    secTitle: "Create your personal secret key", btnMem: "Remember", formTitle: "Choose the correct formula",
    subTitle: "Substitute values", base: "Base", exp: "Exponent", mod: "Modulus", ans: "Answer:", res: "Result",
    btnSend: "Send to network ✈️", finK: "Final Secret (K)", subFin: "Substitution for Final", btnCheck: "Check key 🔐",
    winLvl: "Level Passed!", btnNextLvl: "Next Level ➔",
    formDTitle: "Mini-Survey Before Certification", fLabel: "Full Name (as in passport)", aLabel: "Age", dobLabel: "Date of Birth", sLabel: "Study Place? (or 'None')", cLabel: "Country",
    sPlaceholder: "Ex: Stanf, School #1", cPlaceholder: "Ex: USA", btnGetCert: "Generate Certificate 🎓",
    online: "online", sending: "Sending package:", btnHome: "Home",
    certLangNames: { ru: "Russian", en: "English", kk: "Kazakh" },
    examDuration: "DURATION", quizResult: "THEORY SCORE",
    questions: [
      { q: "What is P in the Diffie-Hellman algorithm?", options: ["Secret key", "Prime number (modulus)", "Symmetric cipher"], ans: 1 },
      { q: "What property should the generator G have?", options: ["Be an even number", "Be a primitive root modulo P", "Be greater than P"], ans: 1 },
      { q: "What does the DH algorithm allow?", options: ["Securely exchange keys over an open channel", "Encrypt a hard drive", "Compress data"], ans: 0 },
      { q: "What is the essence of the discrete logarithm problem?", options: ["Hard to multiply large numbers", "Easy to exponentiate, but hard to find the exponent knowing the result", "Logarithms take too much memory"], ans: 1 },
      { q: "How is Alice's public key (A) calculated?", options: ["A = g^a mod p", "A = p^g mod a", "A = g * a mod p"], ans: 0 },
      { q: "What are 'a' and 'b' in the formulas?", options: ["Public keys", "Random secret keys", "User IDs"], ans: 1 },
      { q: "Does 'pure' DH protect against Man-in-the-Middle attacks?", options: ["Yes, always", "No, additional authentication is needed", "Depends on P's length"], ans: 1 },
      { q: "Which vulnerability is related to the reuse of 512-bit primes?", options: ["Heartbleed", "Logjam", "Spectre"], ans: 1 },
      { q: "Why can't a composite number be used instead of a prime P?", options: ["Speed will increase", "Cryptographic strength will decrease", "Nothing will change"], ans: 1 },
      { q: "What is the final secret obtained by both participants?", options: ["g^(a+b) mod p", "g^(ab) mod p", "(g*a*b) mod p"], ans: 1 }
    ]
  },
  kk: {
    title: "DH.Academy Емтиханы", subtitle: "Дағдыларыңызды дәлелдеп, сертификат алу үшін барлық деңгейлерден өтіңіз.",
    lvl1: "1-деңгей", lvl1Desc: "Теориялық тест (10 сұрақ)", lvl2: "2-деңгей", lvl2Desc: "Тәжірибе: Кілттермен алмасу (2 қатысушы)", lvl3: "3-деңгей", lvl3Desc: "Тәжірибе: Кілттермен алмасу (3 қатысушы)",
    locked: "🔒 Бұғатталған", passed: "✅ Өтілді", getCertBtn: "Сертификатты бірден алу (Құпия батырма 🤫)",
    qTitle: "Сұрақ", qOf: "/", qRes: "Нәтиже:", qPass: "Керемет! Сіз базалық біліміңізді дәлелдедіңіз.", qFail: "Кем дегенде 8 ұпай жинау керек. Теорияны қайталаңыз!",
    btnRetry: "Қайта тапсыру", setupTitle: "Желіні баптау", modP: "P модулі", rootG: "G түбірі", btnNext: "Келесі", errP: "ҚАТЕ P",
    secTitle: "Өзіңіздің құпия кілтіңізді ойлап табыңыз", btnMem: "Есте сақтау", formTitle: "Дұрыс формуланы таңдаңыз",
    subTitle: "Мәндерді қою", base: "Негіз", exp: "Дәреже", mod: "Модуль", ans: "Жауап:", res: "Нәтиже",
    btnSend: "Желіге жіберу ✈️", finK: "Финальды құпия (K)", subFin: "Финалға мәндерді қою", btnCheck: "Кілтті тексеру 🔐",
    winLvl: "Деңгей өтілді!", btnNextLvl: "Келесі деңгейге ➔",
    formDTitle: "Сертификаттау алдындағы шағын сауалнама", fLabel: "Аты-жөніңіз (паспорт бойынша)", aLabel: "Жасы", dobLabel: "Туған күні", sLabel: "Қайда оқисыз? (немесе 'Еш жерде')", cLabel: "Елі",
    sPlaceholder: "Напр: КазҰУ", cPlaceholder: "Напр: Казахстан", btnGetCert: "Сертификатты генерациялау 🎓",
    online: "желіде", sending: "Пакетті жіберу:", btnHome: "Басты бетке",
    certLangNames: { ru: "Russian", en: "English", kk: "Kazakh" },
    examDuration: "DURATION", quizResult: "THEORY SCORE",
    questions: [
      { q: "Диффи-Хеллман алгоритміндегі P дегеніміз не?", options: ["Құпия кілт", "Жай сан (модуль)", "Симметриялық шифр"], ans: 1 },
      { q: "G генераторы қандай қасиетке ие болуы керек?", options: ["Жұп сан болуы керек", "P модулі бойынша алғашқы түбір болуы керек", "P-дан үлкен болуы керек"], ans: 1 },
      { q: "DH алгоритмі не істеуге мүмкіндік береді?", options: ["Ашық арна арқылы кілттермен қауіпсіз алмасу", "Қатты дискіні шифрлау", "Деректерді қысу"], ans: 0 },
      { q: "Дискретті логарифм мәселесінің мәні неде?", options: ["Үлкен сандарды көбейту қиын", "Дәрежеге шығару оңай, бірақ нәтижесін біле отырып, бастапқы дәрежені табу қиын", "Логарифмдер көп жадты қажет етеді"], ans: 1 },
      { q: "Алисаның ашық кілті (A) қалай есептеледі?", options: ["A = g^a mod p", "A = p^g mod a", "A = g * a mod p"], ans: 0 },
      { q: "Формулалардағы 'a' және 'b' дегеніміз не?", options: ["Ашық кілттер", "Кездейсоқ құпия кілттер", "Пайдаланушы идентификаторлары"], ans: 1 },
      { q: "'Таза' DH 'Ортадағы адам' шабуылынан қорғай ма?", options: ["Иә, әрқашан", "Жоқ, қосымша аутентификация қажет", "P ұзындығына байланысты"], ans: 1 },
      { q: "512-биттік жай сандарды қайта пайдалану қандай осалдықпен байланысты?", options: ["Heartbleed", "Logjam", "Spectre"], ans: 1 },
      { q: "Неліктен жай P санының орнына құрама санды қолдануға болмайды?", options: ["Жылдамдық артады", "Қиындық азаяды", "Ештеңе өзгермейді"], ans: 1 },
      { q: "Екі қатысушыда қандай қорытынды құпия пайда болады?", options: ["g^(a+b) mod p", "g^(ab) mod p", "(g*a*b) mod p"], ans: 1 }
    ]
  }
};

const transliterate = (text) => {
  const map = {
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya',
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
    'Қ':'Q','қ':'q','Ғ':'Gh','ғ':'gh','Ң':'Ng','ң':'ng','Ү':'U','ү':'u','Ұ':'U','ұ':'u','Ө':'O','ө':'o','Ә':'A','ә':'a','І':'I','і':'i'
  };
  return text.split('').map(c => map[c] || c).join('');
};

const TelegramAnimation = ({ sender, receiver, value, onComplete, isLight, d }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const chatBg = isLight ? 'bg-[#e5ddd5]' : 'bg-[#0e1621]';
  const headerBg = isLight ? 'bg-white border-b border-slate-200' : 'bg-[#242f3d] border-b border-slate-700/50';
  const msgBg = isLight ? 'bg-[#eeffde] text-slate-800' : 'bg-[#2b5278] text-white';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center w-full py-4">
      <div className="w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl border border-slate-500/20 relative">
        <div className={`px-4 py-3 flex items-center gap-4 z-10 relative ${headerBg}`}>
           <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-2xl shadow-inner">👤</div>
           <div>
             <div className={`font-extrabold text-base leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{receiver}</div>
             <div className="text-xs text-indigo-400 font-semibold tracking-wide">{d.online}</div>
           </div>
        </div>
        <div className={`p-6 h-56 flex flex-col justify-end relative overflow-hidden ${chatBg}`} style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}>
           <motion.div initial={{ scale: 0.5, opacity: 0, x: 20, y: 20 }} animate={{ scale: 1, opacity: 1, x: 0, y: 0 }} transition={{ type: "spring", delay: 0.5, bounce: 0.5 }} className={`self-end px-4 py-3 rounded-2xl rounded-tr-sm min-w-[60%] max-w-[85%] shadow-md relative z-10 ${msgBg}`}>
              <p className="mb-1 opacity-70 text-[10px] font-black uppercase tracking-wider">{sender}</p>
              <span className="text-sm">{d.sending}</span> 
              <strong className={`font-mono text-2xl block mt-1 ${isLight ? 'text-indigo-600' : 'text-amber-400'}`}>{value}</strong>
              <span className="text-[10px] opacity-50 ml-2 absolute bottom-2 right-3">12:00 ✓✓</span>
              <motion.div initial={{ x: 0, y: 0, scale: 0.5, opacity: 0, rotate: 0 }} animate={{ x: -350, y: -250, scale: 4, opacity: [0, 1, 1, 0], rotate: -25 }} transition={{ delay: 1.5, duration: 2.5, ease: "easeIn" }} className="absolute -top-4 -left-4 text-5xl drop-shadow-2xl z-50 pointer-events-none">✈️</motion.div>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const QuizLevel = ({ onCompleteQuiz, isLight, t, d }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = d.questions;

  const handleAnswer = (idx) => {
    let nextScore = score;
    if (idx === questions[currentQ].ans) nextScore++;
    setScore(nextScore);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else setShowResult(true);
  };

  if (showResult) {
    return (
      <div className="text-center py-10">
        <h2 className={`text-4xl font-black mb-4 ${t.title}`}>{d.qRes} {score} / 10</h2>
        {score >= 8 ? (
          <div><p className="text-emerald-500 font-bold text-xl mb-6">{d.qPass}</p><button onClick={() => onCompleteQuiz(score)} className={`px-8 py-3 rounded-xl font-bold text-lg ${t.btn}`}>{d.btnNextLvl}</button></div>
        ) : (
          <div><p className="text-rose-500 font-bold text-xl mb-6">{d.qFail}</p><button onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); }} className={`px-8 py-3 rounded-xl font-bold text-lg ${t.btn}`}>{d.btnRetry}</button></div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 w-full">
      <h3 className={`text-2xl font-bold mb-2 ${t.title}`}>{d.qTitle} {currentQ + 1} {d.qOf} 10</h3>
      <div className="w-full bg-slate-500/20 h-2 rounded-full mb-8 overflow-hidden"><div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQ) / 10) * 100}%` }}></div></div>
      <p className={`text-xl font-bold mb-8 text-center max-w-2xl ${t.text}`}>{questions[currentQ].q}</p>
      <div className="flex flex-col gap-4 w-full max-w-xl">
        {questions[currentQ].options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className={`p-4 rounded-xl font-bold border transition-all hover:scale-[1.02] active:scale-95 text-left shadow-sm ${isLight ? 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-indigo-50' : 'bg-[#050810] border-slate-700 text-indigo-200 hover:bg-indigo-900/40'}`}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

const Certificate = ({ isLight, onBack, d, userData, quizScore, duration, submissionLang }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const buildPdf = async () => {
      try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([841.89, 595.28]);

        page.drawRectangle({ x: 0, y: 0, width: 841.89, height: 595.28, color: rgb(0.97, 0.98, 0.99) });
        page.drawRectangle({ x: 20, y: 20, width: 801.89, height: 555.28, borderColor: rgb(0.12, 0.11, 0.29), borderWidth: 16 });
        page.drawRectangle({ x: 42, y: 42, width: 757.89, height: 511.28, borderColor: rgb(0.12, 0.11, 0.29), borderWidth: 2 });

        const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
        const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

        const wmText = "DH.ACADEMY";
        page.drawText(wmText, { x: (841.89 - helveticaBold.widthOfTextAtSize(wmText, 140)) / 2, y: 250, size: 140, font: helveticaBold, color: rgb(0.94, 0.95, 0.96) });

        const drawCentered = (txt, y, f, size, col) => page.drawText(txt, { x: (841.89 - f.widthOfTextAtSize(txt, size)) / 2, y, size, font: f, color: col });

        drawCentered('CERTIFICATE OF ACCOMPLISHMENT', 450, timesBold, 36, rgb(0.12, 0.11, 0.29));
        drawCentered('DIFFIE-HELLMAN CRYPTOSYSTEM FUNDAMENTALS', 415, helvetica, 14, rgb(0.28, 0.33, 0.41));
        drawCentered('This is to certify that', 360, timesRoman, 16, rgb(0.28, 0.33, 0.41));
        
        const safeName = transliterate(userData?.fullName || "Student Name");
        drawCentered(safeName, 300, timesBold, 48, rgb(0.01, 0.02, 0.09));

        const bText = `has successfully completed the complete multi-level certification program at DH.Academy. They have demonstrated an exceptional understanding of public-key cryptography principles, specifically the mathematical foundations of the Diffie-Hellman key exchange algorithm, discrete logarithms, modular arithmetic, and primitive roots.`;
        drawCentered(bText.substring(0, 120), 235, timesRoman, 12, rgb(0.2, 0.25, 0.33));
        drawCentered(bText.substring(120, 240), 215, timesRoman, 12, rgb(0.2, 0.25, 0.33));
        drawCentered(bText.substring(240), 195, timesRoman, 12, rgb(0.2, 0.25, 0.33));

        page.drawLine({ start: { x: 100, y: 150 }, end: { x: 741.89, y: 150 }, thickness: 1, color: rgb(0.88, 0.91, 0.94) });

        page.drawText(d.quizResult, { x: 170, y: 125, size: 9, font: helveticaBold, color: rgb(0.39, 0.45, 0.54) });
        page.drawText(`${quizScore} / 10 Points`, { x: 170, y: 105, size: 14, font: helveticaBold, color: rgb(0.06, 0.09, 0.16) });

        page.drawText(d.examDuration, { x: 380, y: 125, size: 9, font: helveticaBold, color: rgb(0.39, 0.45, 0.54) });
        page.drawText(duration || "N/A", { x: 380, y: 105, size: 14, font: helveticaBold, color: rgb(0.06, 0.09, 0.16) });

        page.drawText('EXAM LANGUAGE', { x: 580, y: 125, size: 9, font: helveticaBold, color: rgb(0.39, 0.45, 0.54) });
        page.drawText(locales[submissionLang]?.certLangNames[submissionLang] || "English", { x: 580, y: 105, size: 14, font: helveticaBold, color: rgb(0.06, 0.09, 0.16) });

        const safeAge = transliterate(userData?.age || "--");
        const safeDob = transliterate(userData?.dob || "--");
        const safeStudy = transliterate(userData?.studyPlace || "--");
        const safeCountry = transliterate(userData?.country || "--");
        const profile = `Profile: Age ${safeAge}, DoB ${safeDob}, Study at ${safeStudy}, from ${safeCountry}.`;
        drawCentered(profile, 85, helvetica, 8, rgb(0.6, 0.65, 0.7));

        page.drawLine({ start: { x: 80, y: 70 }, end: { x: 280, y: 70 }, thickness: 1, color: rgb(0.12, 0.11, 0.29) });
        page.drawText('Akzhigit Dias', { x: 180 - (helveticaBold.widthOfTextAtSize('Akzhigit Dias', 12)/2), y: 55, size: 12, font: helveticaBold, color: rgb(0.12, 0.16, 0.23) });
        page.drawText('Course Director, DH.Academy', { x: 180 - (helvetica.widthOfTextAtSize('Course Director, DH.Academy', 9)/2), y: 42, size: 9, font: helvetica, color: rgb(0.39, 0.45, 0.54) });
        page.drawText('Akzhigit Dias', { x: 180 - (timesItalic.widthOfTextAtSize('Akzhigit Dias', 26)/2), y: 78, size: 26, font: timesItalic, color: rgb(0.1, 0.1, 0.5) });

        page.drawLine({ start: { x: 561.89, y: 70 }, end: { x: 761.89, y: 70 }, thickness: 1, color: rgb(0.12, 0.11, 0.29) });
        page.drawText('Koshkinbai Nurbek', { x: 661.89 - (helveticaBold.widthOfTextAtSize('Koshkinbai Nurbek', 12)/2), y: 55, size: 12, font: helveticaBold, color: rgb(0.12, 0.16, 0.23) });
        page.drawText('Chief Cryptographer, Nurkot Inc.', { x: 661.89 - (helvetica.widthOfTextAtSize('Chief Cryptographer, Nurkot Inc.', 9)/2), y: 42, size: 9, font: helvetica, color: rgb(0.39, 0.45, 0.54) });
        page.drawText('K. Nurbek', { x: 661.89 - (timesItalic.widthOfTextAtSize('K. Nurbek', 26)/2), y: 78, size: 26, font: timesItalic, color: rgb(0.1, 0.1, 0.5) });

        page.drawCircle({ x: 740, y: 100, radius: 25, borderColor: rgb(0.62, 0.07, 0.22), borderWidth: 2 });
        page.drawCircle({ x: 740, y: 100, radius: 22, borderColor: rgb(0.62, 0.07, 0.22), borderWidth: 0.5 });
        page.drawText('NURKOT INC.', { x: 722, y: 110, size: 6, font: helveticaBold, color: rgb(0.62, 0.07, 0.22), rotate: { angle: -10, type: 'degrees' } });
        page.drawText('CORPORATION', { x: 718, y: 103, size: 5, font: helveticaBold, color: rgb(0.62, 0.07, 0.22), rotate: { angle: -10, type: 'degrees' } });
        page.drawText('N', { x: 733, y: 92, size: 20, font: timesBold, color: rgb(0.62, 0.07, 0.22), rotate: { angle: -10, type: 'degrees' } });
        page.drawText('APPROVED', { x: 725, y: 88, size: 4, font: helveticaBold, color: rgb(0.62, 0.07, 0.22), rotate: { angle: -10, type: 'degrees' } });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) { console.error(err); } finally { setIsGenerating(false); }
    };
    buildPdf();
  }, [userData, quizScore, duration, submissionLang, d]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const safeName = transliterate(userData?.fullName || "Student");
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${safeName.replace(/\s+/g, '_')}_DH_Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculatedHeight = containerWidth * 0.707;

  return (
    <div className="flex flex-col items-center w-full px-4">
      <div className="flex gap-4 mb-6">
        <button onClick={onBack} className={`px-6 py-2 rounded-xl font-bold border transition-all hover:scale-105 ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-[#1e293b] text-[#cbd5e1]'}`}>{d.btnHome}</button>
        <button onClick={handleDownload} disabled={!pdfUrl || isGenerating} className={`px-8 py-2 rounded-xl font-bold text-white shadow-lg transition-all ${isGenerating ? 'bg-[#34d399] cursor-wait' : 'bg-[#059669] hover:bg-[#10b981] hover:scale-105'}`}>{isGenerating ? '⏳ Рендер PDF...' : '⬇️ Скачать PDF'}</button>
      </div>
      <div ref={containerRef} style={{ height: `${calculatedHeight}px` }} className={`w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-900 border-slate-800'} relative transition-[height] duration-100`}>
        {pdfUrl ? (
          <iframe src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className="w-full h-full border-none absolute inset-0" title="PDF Preview" />
        ) : (
          <div className="flex items-center justify-center h-full"><span className="animate-pulse text-indigo-500 font-bold tracking-widest">ГЕНЕРАЦИЯ ОФИЦИАЛЬНОГО БЛАНКА А4...</span></div>
        )}
      </div>
    </div>
  );
};
const ExamEngine = ({ mode, onComplete, isLight, t, d }) => {
  const [step, setStep] = useState(0);
  const [p, setP] = useState("23"); const [g, setG] = useState("5");
  const [validRoots, setValidRoots] = useState([]);
  const [secrets, setSecrets] = useState({ A: "", B: "", C: "" });
  const [formulas, setFormulas] = useState([]);
  const [subBase, setSubBase] = useState(""); const [subExp, setSubExp] = useState(""); const [subMod, setSubMod] = useState(""); const [calcRes, setCalcRes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (p && isPrime(p)) {
      const roots = getPrimitiveRoots(p);
      setValidRoots(roots);
      if (!roots.includes(parseInt(g)) && roots.length > 0) setG(String(roots[0]));
    } else { setValidRoots([]); }
  }, [p]);

  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 3500); };

  let activeUser = 'ALL';
  if (step >= 1 && step <= 4) activeUser = 'A'; 
  if (step >= 5 && step <= 8) activeUser = 'B'; 
  if (mode === 3 && step >= 9 && step <= 12) activeUser = 'C'; 
  if (step === 16 && mode === 2) activeUser = 'A'; 
  if (step === 16 && mode === 3) activeUser = 'A'; 

  const handleSetup = () => {
    if (!p || !isPrime(p)) return showError("P должно быть простым числом!");
    if (validRoots.length === 0 || !validRoots.includes(parseInt(g))) return showError("Неверный генератор G!");
    setStep(1);
  };

  const handleSecret = (person) => {
    if (!secrets[person]) return showError("Введите секрет!");
    let options = [];
    if (person === 'A') options = [{ text: "A = g^a mod p", correct: true }, { text: "A = a^g mod p", correct: false }];
    if (person === 'B') options = [{ text: "B = g^b mod p", correct: true }, { text: "B = b^g mod p", correct: false }];
    if (person === 'C') options = [{ text: "C = g^c mod p", correct: true }, { text: "C = c^g mod p", correct: false }];
    setFormulas(options.sort(() => Math.random() - 0.5));
    setStep(prev => prev + 1);
  };

  const handleFormulaSelect = (opt) => {
    if (!opt.correct) return showError("Неверная формула! Подумайте еще.");
    setSubBase(""); setSubExp(""); setSubMod(""); setCalcRes(""); 
    setStep(prev => prev + 1);
  };

  const handleSubstitutionCheck = (expectedBase, expectedExp, expectedRes, nextStepNum) => {
    if (String(subBase) !== String(expectedBase) || String(subExp) !== String(expectedExp) || String(subMod) !== String(p)) return showError("Ошибка в подстановке переменных!");
    if (String(calcRes) !== String(expectedRes)) return showError("Правильная подстановка, но арифметическая ошибка!");
    setStep(nextStepNum);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <AnimatePresence>{error && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-20 z-50 bg-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl">⚠️ {error}</motion.div>}</AnimatePresence>

      {step > 0 && (
        <div className={`flex flex-wrap justify-center items-center gap-3 mb-8 p-4 rounded-2xl border ${t.card}`}>
          <div className={`px-4 py-1.5 rounded-lg font-mono font-bold text-sm shadow-sm ${isLight?'bg-slate-200 text-slate-800':'bg-slate-800 text-slate-200'}`}>P = {p}</div>
          <div className={`px-4 py-1.5 rounded-lg font-mono font-bold text-sm shadow-sm ${isLight?'bg-slate-200 text-slate-800':'bg-slate-800 text-slate-200'}`}>G = {g}</div>
          {(activeUser === 'A' || step > 12) && secrets.A && <div className={`px-4 py-1.5 rounded-lg font-mono font-bold text-sm bg-cyan-100 text-cyan-800`}>a = {secrets.A}</div>}
          {(activeUser === 'B') && secrets.B && <div className={`px-4 py-1.5 rounded-lg font-mono font-bold text-sm bg-rose-100 text-rose-800`}>b = {secrets.B}</div>}
          {(activeUser === 'C') && secrets.C && <div className={`px-4 py-1.5 rounded-lg font-mono font-bold text-sm bg-violet-100 text-violet-800`}>c = {secrets.C}</div>}
        </div>
      )}

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
          <h3 className={`text-3xl font-bold mb-8 ${t.title}`}>{d.setupTitle}</h3>
          <div className="flex gap-6 mb-10 w-full max-w-lg">
            <div className="flex-1"><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.modP}</label><input type="number" value={p} onChange={e=>setP(e.target.value)} className={`w-full p-4 text-2xl font-bold rounded-2xl text-center outline-none border ${t.input}`}/></div>
            <div className="flex-1"><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.rootG}</label>
              {validRoots.length > 0 ? (
                <select value={g} onChange={e=>setG(e.target.value)} className={`w-full p-4 text-2xl font-bold rounded-2xl text-center outline-none border ${t.input}`}>{validRoots.map(r => <option key={r} value={r}>{r}</option>)}</select>
              ) : <div className="p-4 text-rose-500 bg-rose-500/10 rounded-2xl text-center font-bold">{d.errP}</div>}
            </div>
          </div>
          <button onClick={handleSetup} className={`px-12 py-4 rounded-2xl font-bold text-xl ${t.btn}`}>{d.btnNext}</button>
        </motion.div>
      )}

      {[1, 5, 9].includes(step) && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
          <h3 className={`text-3xl font-extrabold mb-4 ${t.title}`}>{step === 1 ? 'Алиса' : (step === 5 ? 'Боб' : 'Кэрол')}</h3>
          <p className={`mb-8 text-lg ${t.text}`}>{d.secTitle}</p>
          <input type="number" value={step===1?secrets.A:(step===5?secrets.B:secrets.C)} onChange={e=>setSecrets({...secrets, [step===1?'A':(step===5?'B':'C')]: e.target.value})} className={`w-64 p-5 text-4xl font-black rounded-3xl text-center outline-none border mb-10 ${t.input}`}/>
          <button onClick={() => handleSecret(step===1?'A':(step===5?'B':'C'))} className={`px-12 py-4 rounded-2xl font-bold text-xl ${t.btn}`}>{d.btnMem}</button>
        </motion.div>
      )}

      {[2, 6, 10, 16].includes(step) && (
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center w-full">
          <h3 className={`text-3xl font-bold mb-8 ${t.title}`}>{step === 16 ? d.finK : d.formTitle}</h3>
          <div className="flex flex-col gap-5 w-full max-w-xl">
            {formulas.map((f, i) => (
              <button key={i} onClick={() => handleFormulaSelect(f)} className={`p-5 rounded-2xl font-mono text-xl font-bold border transition-all hover:scale-[1.02] shadow-sm ${isLight ? 'bg-white hover:bg-indigo-50 border-slate-300' : 'bg-[#050810] hover:bg-indigo-900/40 border-slate-700 text-indigo-300'}`}>{f.text}</button>
            ))}
          </div>
        </motion.div>
      )}

      {[3, 7, 11, 17].includes(step) && (() => {
        let expectedBase = g, expectedExp = step===3?secrets.A:(step===7?secrets.B:secrets.C);
        let expectedRes = powerMod(g, expectedExp, p);
        if (step === 17) {
            expectedBase = powerMod(g, secrets.B, p); expectedExp = secrets.A; expectedRes = powerMod(expectedBase, expectedExp, p);
            if (mode === 3) { expectedBase = powerMod(powerMod(g, secrets.B, p), secrets.C, p); expectedExp = secrets.A; expectedRes = powerMod(expectedBase, expectedExp, p); }
        }
        return (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center w-full">
            <h3 className={`text-3xl font-bold mb-8 ${t.title}`}>{step === 17 ? d.subFin : d.subTitle}</h3>
            <div className={`p-6 rounded-3xl flex flex-wrap items-center justify-center gap-4 w-full max-w-3xl mb-10 border ${t.card}`}>
              <span className={`text-4xl font-black mr-2 ${isLight?'text-slate-800':'text-white'}`}>{step===17?'K':(step===3?'A':(step===7?'B':'C'))} =</span>
              <input type="number" placeholder={d.base} value={subBase} onChange={e=>setSubBase(e.target.value)} className={`w-32 p-3 text-center text-2xl font-bold rounded-2xl border ${t.input}`}/>
              <span className={`text-3xl font-black ${t.text}`}>^</span>
              <input type="number" placeholder={d.exp} value={subExp} onChange={e=>setSubExp(e.target.value)} className={`w-32 p-3 text-center text-2xl font-bold rounded-2xl border ${t.input}`}/>
              <span className={`text-3xl font-black ${t.text}`}>mod</span>
              <input type="number" placeholder={d.mod} value={subMod} onChange={e=>setSubMod(e.target.value)} className={`w-32 p-3 text-center text-2xl font-bold rounded-2xl border ${t.input}`}/>
            </div>
            <div className="flex items-center gap-6 mb-10">
              <span className={`text-3xl font-black ${t.text}`}>{d.ans}</span>
              <input type="number" placeholder={d.res} value={calcRes} onChange={e=>setCalcRes(e.target.value)} className={`w-48 p-4 text-3xl text-center font-black rounded-2xl border ${t.input}`}/>
            </div>
            <button onClick={() => handleSubstitutionCheck(expectedBase, expectedExp, expectedRes, step+1)} className={`px-12 py-4 rounded-2xl font-bold text-xl ${t.btn}`}>{step===17?d.btnCheck:d.btnSend}</button>
          </motion.div>
        );
      })()}

      {step === 4 && <TelegramAnimation sender="Алиса👩🎓" receiver="Всем👥" value={powerMod(g, secrets.A, p)} onComplete={() => setStep(5)} isLight={isLight} d={d} />}
      {step === 8 && <TelegramAnimation sender="Боб👨🎓" receiver="Всем👥" value={powerMod(g, secrets.B, p)} onComplete={() => { if(mode===2){ setFormulas([{text:"K = B^a mod p", correct:true}]); setStep(16); } else setStep(9); }} isLight={isLight} d={d} />}
      {step === 12 && <TelegramAnimation sender="Кэрол👩🎓" receiver="Всем👥" value={powerMod(g, secrets.C, p)} onComplete={() => { setFormulas([{text:"K = (g^bc)^a mod p", correct:true}]); setStep(16); }} isLight={isLight} d={d} />}

      {step === 18 && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center py-10 w-full">
          <div className="text-8xl mb-8 animate-bounce">👍</div>
          <h2 className="text-4xl font-extrabold text-emerald-500 mb-6">{d.winLvl}</h2>
          <button onClick={onComplete} className={`px-12 py-4 rounded-2xl font-bold text-xl ${t.btn}`}>{d.btnNextLvl}</button>
        </motion.div>
      )}
    </div>
  );
};

const UserDataForm = ({ isLight, d, t, onSubmit }) => {
  const [data, setData] = useState({ fullName: "", age: "", dob: "", studyPlace: "", country: "" });
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(data); };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="flex flex-col items-center py-10 w-full max-w-3xl mx-auto">
      <h3 className={`text-4xl font-black mb-10 ${t.title}`}>{d.formDTitle}</h3>
      <div className="grid grid-cols-2 gap-6 w-full mb-10">
        <div className="col-span-2"><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.fLabel}</label><input required name="fullName" value={data.fullName} onChange={handleChange} className={`w-full p-4 rounded-xl border ${t.input}`}/></div>
        <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.aLabel}</label><input required type="number" name="age" value={data.age} onChange={handleChange} className={`w-full p-4 rounded-xl border ${t.input}`}/></div>
        <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.dobLabel}</label><input required type="date" name="dob" value={data.dob} onChange={handleChange} className={`w-full p-4 rounded-xl border ${t.input}`}/></div>
        <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.sLabel}</label><input required name="studyPlace" value={data.studyPlace} onChange={handleChange} placeholder={d.sPlaceholder} className={`w-full p-4 rounded-xl border ${t.input}`}/></div>
        <div><label className={`block text-xs font-bold uppercase mb-2 ${t.text}`}>{d.cLabel}</label><input required name="country" value={data.country} onChange={handleChange} placeholder={d.cPlaceholder} className={`w-full p-4 rounded-xl border ${t.input}`}/></div>
      </div>
      <button type="submit" className={`px-12 py-4 rounded-2xl font-bold text-xl ${t.btn}`}>{d.btnGetCert}</button>
    </motion.form>
  );
};

export const ExamSection = ({ isLight, lang }) => {
  const [level, setLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const d = locales[lang] || locales.ru;

  const [examStartTime, setExamStartTime] = useState(null);
  const [examDuration, setExamDuration] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [userData, setUserData] = useState(null);

  const t = {
    bg: isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#172033]/90 backdrop-blur-md border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)]',
    text: isLight ? 'text-slate-700' : 'text-slate-300',
    title: isLight ? 'text-slate-900' : 'text-white',
    btn: isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]',
  };

  const startExam = () => { setExamStartTime(Date.now()); setLevel(1); };
  const handleQuizComplete = (score) => { setQuizScore(score); setUnlockedLevels(2); setLevel(0); };

  const handlePracticeComplete = (completedLvl, nextUnlockedLvl) => {
    if (completedLvl === 3) {
      const diffMs = Date.now() - examStartTime;
      const mins = Math.floor(diffMs / 60000); const secs = Math.floor((diffMs % 60000) / 1000);
      setExamDuration(`${mins} min ${secs} sec`);
      setUnlockedLevels(4); setLevel(4);
    } else {
      if (nextUnlockedLvl > unlockedLevels) setUnlockedLevels(nextUnlockedLvl);
      setLevel(0);
    }
  };

  const handleDataFormSubmit = (data) => { setUserData(data); setLevel(5); };

  const LevelCard = ({ lvlNum, title, desc, baseColor, isLight }) => {
    const isUnlocked = unlockedLevels >= lvlNum; const isPassed = unlockedLevels > lvlNum;
    const colors = {
      indigo: { b: `border-indigo-300`, h: isLight?`bg-indigo-50`:`bg-indigo-900/20` },
      cyan: { b: `border-cyan-300`, h: isLight?`bg-cyan-50`:`bg-cyan-900/20` },
      rose: { b: `border-rose-300`, h: isLight?`bg-rose-50`:`bg-rose-900/20` },
      pass: { b: `border-emerald-500`, h: isLight?`bg-emerald-50`:`bg-emerald-900/20`, t: `text-emerald-500` },
      lock: { b: `border-slate-500/20`, h: isLight?`bg-slate-100`:`bg-slate-800/30`, t: `text-slate-500` }
    };
    const c = isPassed ? colors.pass : (isUnlocked ? colors[baseColor] : colors.lock);

    return (
      <div onClick={() => isUnlocked && (lvlNum===1?startExam():setLevel(lvlNum))} className={`p-8 rounded-3xl border-2 transition-transform ${isUnlocked ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed'} ${c.h} ${c.b}`}>
        <div className="flex justify-between items-start mb-4"><div className="text-5xl">{lvlNum===1?'🧠':(lvlNum===2?'💻':'🔥')}</div>
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${isPassed?'bg-emerald-500':(isUnlocked?'bg-indigo-500':'bg-slate-500')} text-white`}>{isPassed?d.passed:(isUnlocked?'Активно':d.locked)}</span>
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isUnlocked?t.title:c.t}`}>{title}</h3><p className={isUnlocked?t.text:c.t}>{desc}</p>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[75vh] pb-20 pt-4">
      <div className={`w-full max-w-5xl p-6 md:p-10 rounded-[2.5rem] border relative overflow-visible ${t.bg}`}>
        
        {(level === 1 || level === 2 || level === 3) && (
          <div className="absolute top-0 left-0 h-2 bg-indigo-500/10 w-full rounded-t-[2.5rem] overflow-hidden">
            <motion.div className="h-full bg-indigo-500" initial={{ width: 0 }} animate={{ width: level === 1 ? '33%' : (level === 2 ? '66%' : '100%') }} transition={{ duration: 0.5 }} />
          </div>
        )}

        {level === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-10 w-full">
            <h2 className={`text-5xl font-black mb-4 ${t.title}`}>{d.title}</h2><p className={`text-xl mb-12 max-w-2xl ${t.text}`}>{d.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
              <LevelCard lvlNum={1} title={d.lvl1} desc={d.lvl1Desc} baseColor="indigo" isLight={isLight} />
              <LevelCard lvlNum={2} title={d.lvl2} desc={d.lvl2Desc} baseColor="cyan" isLight={isLight} />
              <LevelCard lvlNum={3} title={d.lvl3} desc={d.lvl3Desc} baseColor="rose" isLight={isLight} />
            </div>
            <button onClick={() => { startExam(); setUnlockedLevels(4); setLevel(4); }} className={`px-6 py-2 rounded-full font-bold text-sm text-slate-500 border border-slate-500/30 hover:bg-slate-500/10`}>{d.getCertBtn}</button>
          </motion.div>
        )}

        {level === 1 && <QuizLevel onCompleteQuiz={handleQuizComplete} isLight={isLight} t={t} d={d} />}
        {level === 2 && <ExamEngine mode={2} onComplete={() => handlePracticeComplete(2, 3)} isLight={isLight} t={t} d={d} />}
        {level === 3 && <ExamEngine mode={3} onComplete={() => handlePracticeComplete(3, 4)} isLight={isLight} t={t} d={d} />}
        {level === 4 && <UserDataForm isLight={isLight} d={d} t={t} onSubmit={handleDataFormSubmit} />}
        {level === 5 && <Certificate isLight={isLight} onBack={() => setLevel(0)} d={d} userData={userData} quizScore={quizScore} duration={examDuration} submissionLang={lang} />}
        
      </div>
    </div>
  );
};