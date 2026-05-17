import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { powerMod, isPrime, getNextPrime } from './utils/cryptoMath';
import { UserCard } from './components/UserCard';
import { Tooltip } from './components/Tooltip';
import { NetworkVisualizer } from './components/NetworkVisualizer';

// === СЛОВАРИ ДЛЯ UI ИНТЕРФЕЙСА ===
const translations = {
  ru: {
    navTheory: "Научная База", navPrac: "Симулятор сети", navExam: "Экзамен (Практика)", title: "Интерактивный Диффи-Хеллман",
    part2: "2 Участника", part3: "3 Участника", step: "ШАГ", of: "из", prev: "Назад", next: "Далее",
    hideT: "Скрыть схему", showT: "Показать схему", currentForm: "Текущая формула",
    alice: "Алиса", bob: "Боб", carol: "Кэрол", openChan: "Открытый канал связи", prime: "Простое число p", gen: "Генератор g",
    secretKey: "Секретный ключ", pubKey: "Публичный ключ", interKey: "Промежуточный ключ", finalKey: "Финальный секрет (K)",
    formulaWord: "Формула", substituteWord: "Подстановка", visProcess: "Визуализация процесса",
    errFill: "Заполните оба поля!", errPrime: "не простое число!", errKey: "Введите ключ для",
    steps2: ["Инициализация", "Параметры p и g", "Алиса задает секрет", "Боб задает секрет", "Алиса считает публ. ключ", "Боб считает публ. ключ", "Обмен ключами", "Алиса вычисляет финал", "Боб вычисляет финал"],
    steps3: ["Инициализация", "Параметры p и g", "Алиса задает секрет", "Боб задает секрет", "Кэрол задает секрет", "Алиса считает публ. ключ", "Боб считает публ. ключ", "Кэрол считает публ. ключ", "Обмен 1 (Публ. ключи)", "Алиса считает промежут.", "Боб считает промежут.", "Кэрол считает промежут.", "Обмен 2 (Промежут.)", "Алиса считает финал", "Боб считает финал", "Кэрол считает финал"],
    calcTitle: "Калькулятор", calcBtn: "Посчитать", showCalc: "Показать калькулятор", hideCalc: "Скрыть калькулятор",
    cheatSheet: "Шпаргалка",
    examTitle: "Режим вычислений", examDesc: "Решите алгоритм самостоятельно. Используйте крипто-калькулятор (кнопка слева).",
    exStart: "Начать вычисления", exCheck: "Проверить ответы", exCorrect: "Верно!", exWrong: "Ошибка в расчетах! Попробуйте еще раз.",
    exS1: "1. Начальные данные", exS2: "2. Публичные ключи", exS3: "3. Общий секрет (K)", exFinish: "Экзамен сдан!"
  },
  en: {
    navTheory: "Theory Base", navPrac: "Network Sim", navExam: "Exam (Practice)", title: "Interactive Diffie-Hellman",
    part2: "2 Participants", part3: "3 Participants", step: "STEP", of: "of", prev: "Back", next: "Next",
    hideT: "Hide Schema", showT: "Show Schema", currentForm: "Current Formula",
    alice: "Alice", bob: "Bob", carol: "Carol", openChan: "Public Channel", prime: "Prime Number p", gen: "Generator g",
    secretKey: "Secret Key", pubKey: "Public Key", interKey: "Intermediate Key", finalKey: "Final Secret (K)",
    formulaWord: "Formula", substituteWord: "Substitution", visProcess: "Visualization",
    errFill: "Fill both fields!", errPrime: "is not a prime!", errKey: "Enter key for",
    steps2: ["Initialization", "Parameters p & g", "Alice sets secret", "Bob sets secret", "Alice calcs pub key", "Bob calcs pub key", "Key Exchange", "Alice calcs final", "Bob calcs final"],
    steps3: ["Initialization", "Parameters p & g", "Alice sets secret", "Bob sets secret", "Carol sets secret", "Alice calcs pub key", "Bob calcs pub key", "Carol calcs pub key", "Exchange 1", "Alice calcs inter", "Bob calcs inter", "Carol calcs inter", "Exchange 2", "Alice calcs final", "Bob calcs final", "Carol calcs final"],
    calcTitle: "Calculator", calcBtn: "Calculate", showCalc: "Show Calculator", hideCalc: "Hide Calculator",
    cheatSheet: "Cheat Sheet",
    examTitle: "Manual Calculation", examDesc: "Solve the algorithm manually using the calculator in the left menu.",
    exStart: "Start", exCheck: "Check Answers", exCorrect: "Correct!", exWrong: "Error! Try again.",
    exS1: "1. Initial Data", exS2: "2. Public Keys", exS3: "3. Shared Secret (K)", exFinish: "Exam Passed!"
  },
  kk: {
    navTheory: "Теория негізі", navPrac: "Симулятор", navExam: "Емтихан (Практика)", title: "Интерактивті Диффи-Хеллман",
    part2: "2 Қатысушы", part3: "3 Қатысушы", step: "ҚАДАМ", of: "/", prev: "Артқа", next: "Келесі",
    hideT: "Сызбаны жасыру", showT: "Сызбаны көрсету", currentForm: "Ағымдағы формула",
    alice: "Алиса", bob: "Боб", carol: "Кэрол", openChan: "Ашық арна", prime: "Жай сан p", gen: "Генератор g",
    secretKey: "Құпия кілт", pubKey: "Ашық кілт", interKey: "Аралық кілт", finalKey: "Ортақ құпия (K)",
    formulaWord: "Формула", substituteWord: "Алмастыру", visProcess: "Визуалдау",
    errFill: "Өрістерді толтырыңыз!", errPrime: "жай сан емес!", errKey: "Кілтті енгізіңіз:",
    steps2: ["Инициализация", "p және g", "Алиса құпиясы", "Боб құпиясы", "Алиса ашық кілті", "Боб ашық кілті", "Алмасу", "Алиса финалы", "Боб финалы"],
    steps3: ["Инициализация", "p және g", "Алиса құпиясы", "Боб құпиясы", "Кэрол құпиясы", "Алиса ашық кілті", "Боб ашық кілті", "Кэрол ашық кілті", "Алмасу 1", "Алиса аралық", "Боб аралық", "Кэрол аралық", "Алмасу 2", "Алиса финалы", "Боб финалы", "Кэрол финалы"],
    calcTitle: "Калькулятор", calcBtn: "Есептеу", showCalc: "Калькуляторды көрсету", hideCalc: "Калькуляторды жасыру",
    cheatSheet: "Шпаргалка",
    examTitle: "Есептеу режимі", examDesc: "Сол жақтағы калькуляторды пайдаланып алгоритмді қолмен шешіңіз.",
    exStart: "Бастау", exCheck: "Тексеру", exCorrect: "Дұрыс!", exWrong: "Қате! Қайталаңыз.",
    exS1: "1. Бастапқы деректер", exS2: "2. Ашық кілттер", exS3: "3. Ортақ құпия (K)", exFinish: "Емтихан тапсырылды!"
  }
};

// === АКАДЕМИЧЕСКАЯ ТЕОРИЯ ===
const TheorySection = ({ isLight, lang }) => {
  const t = { bg: isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#172033]/90 border-indigo-500/20 shadow-lg", h1: isLight ? "text-slate-900" : "text-white", h2: isLight ? "text-slate-800" : "text-white", h3: isLight ? "text-indigo-700" : "text-indigo-400", text: isLight ? "text-slate-700" : "text-slate-300", boxBg: isLight ? "bg-slate-50 border-slate-200" : "bg-[#0B0F19] border-indigo-500/30", accent: isLight ? "border-indigo-500 text-indigo-800" : "border-indigo-400 text-indigo-300", th: isLight ? "bg-slate-100 text-slate-800 border-slate-300" : "bg-[#050810] text-indigo-300 border-indigo-500/30", td: isLight ? "border-slate-200" : "border-indigo-500/10" };
  const content = {
    ru: (
      <div className={`max-w-5xl mx-auto p-8 font-sans leading-relaxed pb-32 ${t.text}`}>
        <h1 className={`text-5xl font-extrabold mb-6 tracking-tight ${t.h1}`}>Алгоритм Диффи — Хеллмана <span className="text-indigo-500">(DH)</span></h1>
        <div className={`p-6 rounded-2xl mb-12 border-l-4 font-medium text-lg shadow-sm ${t.boxBg} ${t.accent}`}><p className="mb-3"><strong>Суть:</strong> Алгоритм Диффи–Хеллмана (DH) – первый практически реализованный протокол согласования ключа с открытым ключом (Whitfield Diffie & Martin Hellman, 1976). Он позволяет двум сторонам по открытым данным получить общий секретный ключ, не передавая его напрямую. Безопасность DH основана на вычислительно сложной проблеме дискретного логарифма в конечном поле: зная g<sup>a</sup> и g<sup>b</sup>, вычислить g<sup>ab</sup> считается трудной задачей. Практические применения стандартизированы (RFC 2631, IKE/SSH, TLS и пр.), а современные рекомендации (NIST SP 800-56A Rev.3) требуют больших простых модулей (≥2048 бит).</p><p className="mb-3"><strong>Угрозы:</strong> Среди основных атак – алгоритмы решения дискретного логарифма (Pohlig–Hellman, baby-step/giant-step, Pollard-ρ) и их улучшения (Number Field Sieve), а также квантовый алгоритм Шора, который решает DLP за полиномиальное время. Другие уязвимости связаны с параметрами: повторное использование стандартных простых (Logjam, 2015) позволяет масс.-предвычислениями ослабить безопасность; неподходящие генераторы позволяют провести атаку субгруппового поглощения.</p><p><strong>Контрмеры:</strong> Рекомендуется использовать безопасные простые (p = 2q+1), проверять, что открытые значения лежат в большой подгруппе, применять временные (Ephemeral) ключи для прямой секретности (Forward Secrecy). В условиях возможных квантовых атак нужно рассматривать постквантовые альтернативы.</p></div>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">1.</span> Исторический контекст и оригинальные работы</h2><p className="mb-2">Понятие асимметричного шифрования зародилось в конце 1960-х – начале 1970-х гг. (работы британского GCHQ: Ellis 1970, Williamson 1974/1976). Однако первые опубликованные шаги в этом направлении принадлежали Р. Мерклю (Merkle, 1978) и Диффи/Хеллману (Diffie–Hellman, 1976).</p><p className="mb-2">Меркл предложил схему «головоломок» с квадратичным преимуществом для честных сторон, но вскоре Диффи и Хеллман (и позднее RSA) реализовали более сильные конструкции на основе трудности дискретного логарифма. В работе 1976 г. Diffie & Hellman описали идею разделения на открытый и закрытый ключи. Их протокол позволял двум сторонам по небезопасному каналу установить общий секрет, используя параметры (p,g).</p><p>В последующем эти идеи были формально расширены (стандарт ANSI X9.42 / RFC 2631 в 1999 г.) и применены на практике (TLS, SSH, PGP).</p></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">2.</span> Математическая основа протокола DH</h2><p className="mb-4">DH протокол работает в <strong>конечной циклической группе</strong>. Чаще всего выбирают поле GF(p) (простое p) и генератор g порядка q (при p=2q+1 — безопасный простой). Элемент g называется <em>примитивным корнем</em> по модулю p, если его степени порождают всю мультипликативную группу GF(p)<sup>*</sup>.</p><div className={`p-5 rounded-xl border mb-6 ${t.boxBg}`}><h3 className={`font-bold uppercase tracking-widest text-sm mb-2 ${t.h3}`}>Дискретный логарифм</h3><p>Для группы G = ⟨g⟩ решение уравнения g<sup>x</sup> = a (по данному a) есть дискретный логарифм числа a по основанию g. Эта задача считается вычислительно сложной в подходящих группах: пока нет полиномиальных алгоритмов для больших простых модулей (время решения растёт экспоненциально с размером p).</p></div><h3 className={`font-bold mb-3 ${t.h2}`}>Протокол DH:</h3><ul className="list-disc list-inside space-y-2 mb-6"><li>Стороны A и B согласовывают общие параметры (p,g).</li><li>Затем A выбирает секрет a, вычисляет X = g<sup>a</sup> mod p и передаёт X.</li><li>B аналогично берёт b, передаёт Y = g<sup>b</sup> mod p.</li><li>Обе стороны вычисляют общий ключ <strong>K = (g<sup>b</sup>)<sup>a</sup> mod p = (g<sup>a</sup>)<sup>b</sup> mod p = g<sup>ab</sup> mod p</strong>.</li></ul><p>Поскольку группа коммутативна, обе получают один и тот же K, скрытый от наблюдателя, не знающего a и b.</p><h3 className={`font-bold mt-8 mb-4 ${t.h2}`}>Таблица 1. Основные алгоритмы решения дискретного логарифма</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr><th className={`p-3 border ${t.th}`}>Алгоритм</th><th className={`p-3 border ${t.th}`}>Сложность времени</th><th className={`p-3 border ${t.th}`}>Память</th><th className={`p-3 border ${t.th}`}>Комментарий</th></tr></thead><tbody><tr><td className={`p-3 border ${t.td}`}>Pohlig–Hellman</td><td className={`p-3 border ${t.td}`}>зависит от разложения p-1</td><td className={`p-3 border ${t.td}`}>–</td><td className={`p-3 border ${t.td}`}>Быстро, если p-1 сильно составлено из малых простых.</td></tr><tr><td className={`p-3 border ${t.td}`}>Baby-step/Giant-step</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>Митт-ин-тем: хранит таблицу g<sup>i</sup> и ищет решение.</td></tr><tr><td className={`p-3 border ${t.td}`}>Pollard’s ρ</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>O(1)</td><td className={`p-3 border ${t.td}`}>Рандомизированный, мало памяти; параллелизуем.</td></tr><tr><td className={`p-3 border ${t.td}`}>Number Field Sieve (NFS)</td><td className={`p-3 border ${t.td}`}>L<sub>p</sub>[1/3]</td><td className={`p-3 border ${t.td}`}>–</td><td className={`p-3 border ${t.td}`}>Подэкспоненциальный. Лучший на больших p.</td></tr><tr><td className={`p-3 border ${t.td}`}>Алгоритм Шора</td><td className={`p-3 border ${t.td}`}>O(n<sup>k</sup>)</td><td className={`p-3 border ${t.td}`}>–</td><td className={`p-3 border ${t.td}`}>Квантовый. Решает DLP за полиномиальное время.</td></tr></tbody></table></div></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">3.</span> Формальные модели безопасности и аутентификация</h2><p className="mb-4">Протокол DH сам по себе не обеспечивает аутентификацию: он устанавливает секрет, но не гарантирует подлинности участников (атаку «человек посередине» MitM можно провести, если стороны не проверяют ключи). Поэтому обычно DH используют <strong>в аутентифицированных схемах</strong> (добавляя подписи или MAC).</p><ul className="space-y-3 list-disc list-inside"><li><strong>Модель IND-CPA/IND-CCA:</strong> Протокол считается безопасным, если сессионный ключ неотличим от случайного для вычислительного наблюдателя.</li><li><strong>HMQV и SIGMA:</strong> HMQV (2005) доказуемо безопасен в модели случайного оракула. SIGMA (2003) основан на «подписано+MAC» и служит основой для IKEv1/v2.</li><li>Основная криптографическая предпосылка – <strong>Computational Diffie-Hellman (CDH)</strong> и <strong>Decisional DH (DDH)</strong>: считается, что вычислить g<sup>ab</sup> или отличить его от случайной строки невозможно за полиномиальное время.</li></ul></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">4.</span> Атаки на DH и контрмеры</h2><p className="mb-4">В реальных системах встречаются уязвимости. Атака <strong>Logjam (2015)</strong> показала, что многие интернет-серверы используют одни и те же 1024-битовые группы. Атакующий может спустить соединение до 512-бит DHE_EXPORT, быстро решить DLP и прочитать трафик.</p><h3 className={`font-bold mt-8 mb-4 ${t.h2}`}>Таблица 2. Примерная сводка атак и контрмер</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr><th className={`p-3 border ${t.th}`}>Атака / Уязвимость</th><th className={`p-3 border ${t.th}`}>Описание и влияние</th><th className={`p-3 border ${t.th}`}>Контрмеры</th></tr></thead><tbody><tr><td className={`p-3 border ${t.td} font-bold`}>Решение DLP (Pollard, NFS)</td><td className={`p-3 border ${t.td}`}>Найти дискрет. логарифм (сложность O(√p) или L<sub>p</sub>[1/3]).</td><td className={`p-3 border ${t.td}`}>Увеличить p (2048+ бит); использовать ECDH.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Квантовый алгоритм Шора</td><td className={`p-3 border ${t.td}`}>Полиномиальный взлом DLP/ECDLP.</td><td className={`p-3 border ${t.td}`}>Перейти на постквантовые схемы (NTRU, Kyber).</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Малые подгруппы / Invalid curve</td><td className={`p-3 border ${t.td}`}>Недостоверный g или точка в маленькой подгруппе → утечка.</td><td className={`p-3 border ${t.td}`}>Проверять параметры: открытые ключи ∈ корректной группе.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Слабые простые (Debian 2008)</td><td className={`p-3 border ${t.td}`}>Предсказуемые параметры из-за плохого генератора случайных чисел.</td><td className={`p-3 border ${t.td}`}>Использовать качественный энтропный источник.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Сторонние каналы (тайминг, SPA)</td><td className={`p-3 border ${t.td}`}>Утечка a при неконтролируемых операциях экспоненциации.</td><td className={`p-3 border ${t.td}`}>Реализация в константном времени; маскирование значений.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Атака Logjam</td><td className={`p-3 border ${t.td}`}>Принудительное понижение до 512-бит DHE_EXPORT.</td><td className={`p-3 border ${t.td}`}>Запрет экспортных модулей; использовать 2048-бит+.</td></tr></tbody></table></div></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">5.</span> Практические реализации, Стандарты и Выводы</h2><div className="space-y-4"><p><strong>Стандарты:</strong> RFC 2631 (S/MIME), RFC 3526 (IKEv2 - наборы больших групп MODP 2048-8192 бит), RFC 7919 (TLS FFDHE группы). NIST SP 800-56A Rev.3 агрегирует лучшие практики: для 112-битной безопасности нужен p минимум 2048 бит.</p><p><strong>Сравнение с ECDH:</strong> ECDH обеспечивает ту же безопасность при гораздо меньших ключах (256-битовая эллиптическая кривая сопоставима с 3072-битным p). Однако алгоритм Шора ломает и ECDH.</p><p><strong>Доказательство корректности:</strong> Из определения K<sub>A</sub> = Y<sup>a</sup> mod p и K<sub>B</sub> = X<sup>b</sup> mod p, где X = g<sup>a</sup>, Y = g<sup>b</sup>, получаем K<sub>A</sub> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> и K<sub>B</sub> = (g<sup>a</sup>)<sup>b</sup> = g<sup>ab</sup>. Ключи полностью совпадают.</p><div className={`mt-6 p-6 rounded-xl border ${t.boxBg}`}><h3 className={`font-bold mb-2 ${t.h3}`}>Возможные вопросы комиссии:</h3><ul className="list-disc list-inside space-y-2 text-sm"><li><strong>Почему нельзя математически доказать безопасность DH?</strong> Протокол сводится к DLP/CDH, и пока неизвестно математическое доказательство их абсолютной сложности. Все утверждения носят вероятностный характер.</li><li><strong>В чем разница между DDH и CDH?</strong> CDH: вычислить g<sup>ab</sup> по g<sup>a</sup>, g<sup>b</sup>. DDH: отличить g<sup>ab</sup> от случайной строки. DDH сильнее.</li><li><strong>Зачем нужны "safe primes" (p=2q+1)?</strong> Чтобы исключить попадание в малые подгруппы (предотвращает атаки).</li></ul></div></div></section>
      </div>
    ),
    en: (
      <div className={`max-w-5xl mx-auto p-8 font-sans leading-relaxed pb-32 ${t.text}`}>
        <h1 className={`text-5xl font-extrabold mb-6 tracking-tight ${t.h1}`}>Diffie-Hellman Algorithm <span className="text-indigo-500">(DH)</span></h1>
        <div className={`p-6 rounded-2xl mb-12 border-l-4 font-medium text-lg shadow-sm ${t.boxBg} ${t.accent}`}><p className="mb-3"><strong>Essence:</strong> The Diffie-Hellman (DH) algorithm is the first practical public-key agreement protocol (Whitfield Diffie & Martin Hellman, 1976). It allows two parties to obtain a shared secret key over a public channel without transmitting it directly. Security is based on the computationally hard Discrete Logarithm Problem (DLP) in a finite field: knowing g<sup>a</sup> and g<sup>b</sup>, computing g<sup>ab</sup> is considered infeasible. Practical applications are standardized (RFC 2631, IKE/SSH, TLS), and modern recommendations (NIST SP 800-56A Rev.3) require large prime moduli (≥2048 bits).</p><p className="mb-3"><strong>Threats:</strong> Main attacks include DLP solving algorithms (Pohlig-Hellman, baby-step/giant-step, Pollard-ρ, Number Field Sieve), and Shor's quantum algorithm which solves DLP in polynomial time. Other vulnerabilities involve parameters: reusing standard primes (Logjam, 2015) weakens security through mass precomputation; inappropriate generators allow subgroup confinement attacks.</p><p><strong>Countermeasures:</strong> It is recommended to use safe primes (p = 2q+1), validate public keys to ensure they lie in a large subgroup, and use Ephemeral keys for Forward Secrecy. Against quantum attacks, post-quantum alternatives must be considered.</p></div>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">1.</span> Historical Context and Original Papers</h2><p className="mb-2">The concept of asymmetric encryption originated in the late 1960s and early 1970s (GCHQ: Ellis 1970, Williamson 1974/1976). However, the first published steps were by R. Merkle (1978) and Diffie/Hellman (1976).</p><p className="mb-2">Merkle proposed a "puzzle" scheme, but soon Diffie and Hellman (and later RSA) implemented stronger constructions based on the difficulty of the discrete logarithm. Diffie and Hellman introduced the idea of separating public and private keys. Their protocol allowed two parties to establish a shared secret over an insecure channel using parameters (p,g).</p><p>Later, these ideas were formally expanded (ANSI X9.42 / RFC 2631) and applied in practice (TLS, SSH, PGP).</p></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">2.</span> Mathematical Foundation of DH</h2><p className="mb-4">The DH protocol operates in a <strong>finite cyclic group</strong>. Commonly, the field GF(p) (prime p) and a generator g of order q are chosen (where p=2q+1 is a safe prime). Element g is a <em>primitive root</em> modulo p if its powers generate the entire multiplicative group GF(p)<sup>*</sup>.</p><div className={`p-5 rounded-xl border mb-6 ${t.boxBg}`}><h3 className={`font-bold uppercase tracking-widest text-sm mb-2 ${t.h3}`}>Discrete Logarithm</h3><p>For a group G = ⟨g⟩, solving g<sup>x</sup> = a (given a) is the discrete logarithm of a to the base g. Computing y = g<sup>x</sup> mod p is easy, but finding x given y, g, p is computationally hard for large primes.</p></div><h3 className={`font-bold mb-3 ${t.h2}`}>DH Protocol Steps:</h3><ul className="list-disc list-inside space-y-2 mb-6"><li>Parties A and B agree on parameters (p,g).</li><li>A chooses secret a, calculates X = g<sup>a</sup> mod p and sends X.</li><li>B chooses secret b, calculates Y = g<sup>b</sup> mod p and sends Y.</li><li>Both calculate the shared key <strong>K = (g<sup>b</sup>)<sup>a</sup> mod p = (g<sup>a</sup>)<sup>b</sup> mod p = g<sup>ab</sup> mod p</strong>.</li></ul><h3 className={`font-bold mt-8 mb-4 ${t.h2}`}>Table 1. Main DLP Solving Algorithms</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr><th className={`p-3 border ${t.th}`}>Algorithm</th><th className={`p-3 border ${t.th}`}>Time Complexity</th><th className={`p-3 border ${t.th}`}>Comment</th></tr></thead><tbody><tr><td className={`p-3 border ${t.td}`}>Pohlig–Hellman</td><td className={`p-3 border ${t.td}`}>Depends on p-1 factorization</td><td className={`p-3 border ${t.td}`}>Fast if p-1 is highly composite.</td></tr><tr><td className={`p-3 border ${t.td}`}>Baby-step/Giant-step</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>Stores table of g<sup>i</sup> and searches for solution.</td></tr><tr><td className={`p-3 border ${t.td}`}>Pollard’s ρ</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>Randomized, low memory; parallelizable.</td></tr><tr><td className={`p-3 border ${t.td}`}>Number Field Sieve (NFS)</td><td className={`p-3 border ${t.td}`}>L<sub>p</sub>[1/3]</td><td className={`p-3 border ${t.td}`}>Subexponential. Best for large p.</td></tr><tr><td className={`p-3 border ${t.td}`}>Shor's Algorithm</td><td className={`p-3 border ${t.td}`}>O(n<sup>k</sup>)</td><td className={`p-3 border ${t.td}`}>Quantum. Solves DLP in polynomial time.</td></tr></tbody></table></div></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">3.</span> Formal Security Models and Authentication</h2><p className="mb-4">DH protocol alone does not provide authentication: a Man-in-the-Middle (MitM) attack is possible if parties do not verify keys. Therefore, DH is used in <strong>authenticated schemes</strong> (adding signatures or MACs).</p><ul className="space-y-3 list-disc list-inside"><li><strong>IND-CPA/IND-CCA Model:</strong> The protocol is secure if the session key is indistinguishable from random.</li><li><strong>HMQV & SIGMA:</strong> HMQV (2005) is provably secure in the random oracle model. SIGMA (2003) is based on "sign-and-MAC" and is the basis for IKEv1/v2.</li><li>The main assumption is <strong>Computational Diffie-Hellman (CDH)</strong> and <strong>Decisional DH (DDH)</strong>: computing g<sup>ab</sup> or distinguishing it from a random string is infeasible in polynomial time.</li></ul></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">4.</span> Attacks and Countermeasures</h2><p className="mb-4">The <strong>Logjam attack (2015)</strong> showed that many servers use the same 1024-bit groups. An attacker can force a downgrade to 512-bit DHE_EXPORT, solve the DLP, and read traffic.</p><h3 className={`font-bold mt-8 mb-4 ${t.h2}`}>Table 2. Summary of Attacks and Countermeasures</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr><th className={`p-3 border ${t.th}`}>Attack</th><th className={`p-3 border ${t.th}`}>Description</th><th className={`p-3 border ${t.th}`}>Countermeasure</th></tr></thead><tbody><tr><td className={`p-3 border ${t.td} font-bold`}>DLP Solving (Pollard, NFS)</td><td className={`p-3 border ${t.td}`}>Find discrete log (complexity O(√p) or L<sub>p</sub>[1/3]).</td><td className={`p-3 border ${t.td}`}>Increase p (2048+ bits); use ECDH.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Shor's Quantum Algorithm</td><td className={`p-3 border ${t.td}`}>Polynomial break of DLP/ECDLP.</td><td className={`p-3 border ${t.td}`}>Switch to post-quantum schemes (NTRU, Kyber).</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Small Subgroups</td><td className={`p-3 border ${t.td}`}>Invalid g or point in a small subgroup → leakage.</td><td className={`p-3 border ${t.td}`}>Validate parameters: public keys ∈ correct group.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Weak Primes (Debian)</td><td className={`p-3 border ${t.td}`}>Predictable parameters due to poor RNG.</td><td className={`p-3 border ${t.td}`}>Use high-quality entropy source.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Side-channels (timing, SPA)</td><td className={`p-3 border ${t.td}`}>Leakage of a during uncontrolled exponentiation.</td><td className={`p-3 border ${t.td}`}>Constant-time implementation; value masking.</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Logjam Attack</td><td className={`p-3 border ${t.td}`}>Downgrade to 512-bit DHE_EXPORT.</td><td className={`p-3 border ${t.td}`}>Ban export modules; use 2048-bit+ groups.</td></tr></tbody></table></div></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">5.</span> Standards and Conclusions</h2><div className="space-y-4"><p><strong>Standards:</strong> RFC 2631 (S/MIME), RFC 3526 (IKEv2 - MODP 2048-8192 bits), RFC 7919 (TLS FFDHE groups). NIST SP 800-56A Rev.3 requires p to be at least 2048 bits for 112-bit security.</p><p><strong>Comparison with ECDH:</strong> ECDH provides the same security with much smaller keys (256-bit elliptic curve vs 3072-bit p). However, Shor's algorithm breaks ECDH too.</p><p><strong>Proof of Correctness:</strong> From K<sub>A</sub> = Y<sup>a</sup> mod p and K<sub>B</sub> = X<sup>b</sup> mod p, we get K<sub>A</sub> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> and K<sub>B</sub> = (g<sup>a</sup>)<sup>b</sup> = g<sup>ab</sup>. The keys match completely.</p><div className={`mt-6 p-6 rounded-xl border ${t.boxBg}`}><h3 className={`font-bold mb-2 ${t.h3}`}>Possible Commission Questions:</h3><ul className="list-disc list-inside space-y-2 text-sm"><li><strong>Why can't DH security be mathematically proven?</strong> It reduces to DLP/CDH, and there is no absolute mathematical proof of their hardness yet. Statements are probabilistic.</li><li><strong>Difference between DDH and CDH?</strong> CDH: compute g<sup>ab</sup> from g<sup>a</sup>, g<sup>b</sup>. DDH: distinguish g<sup>ab</sup> from a random string. DDH is a stronger assumption.</li><li><strong>Why use "safe primes" (p=2q+1)?</strong> To prevent falling into small subgroups (prevents attacks).</li></ul></div></div></section>
      </div>
    ),
    kk: (
      <div className={`max-w-5xl mx-auto p-8 font-sans leading-relaxed pb-32 ${t.text}`}>
        <h1 className={`text-5xl font-extrabold mb-6 tracking-tight ${t.h1}`}>Диффи-Хеллман алгоритмі <span className="text-indigo-500">(DH)</span></h1>
        <div className={`p-6 rounded-2xl mb-12 border-l-4 font-medium text-lg shadow-sm ${t.boxBg} ${t.accent}`}><p className="mb-3"><strong>Мәні:</strong> Диффи-Хеллман (DH) алгоритмі – ашық кілтпен келісудің алғашқы тәжірибелік протоколы (Whitfield Diffie & Martin Hellman, 1976). Ол екі тарапқа ортақ құпия кілтті тікелей жібермей-ақ алуға мүмкіндік береді. DH қауіпсіздігі шекті өрістегі дискретті логарифмді есептеудің күрделілігіне негізделген: g<sup>a</sup> және g<sup>b</sup> біле отырып, g<sup>ab</sup> табу қиын мәселе болып саналады. Қазіргі заманғы ұсыныстар (NIST SP 800-56A Rev.3) үлкен жай модульдерді (≥2048 бит) талап етеді.</p><p className="mb-3"><strong>Қауіптер:</strong> Негізгі шабуылдарға дискретті логарифмді шешу алгоритмдері (Pohlig-Hellman, baby-step/giant-step, Pollard-ρ, Number Field Sieve) және DLP-ді полиномдық уақытта шешетін Шордың кванттық алгоритмі жатады. Сондай-ақ Logjam (2015) шабуылы стандартты жай сандарды қайта пайдаланудың осалдығын көрсетті.</p><p><strong>Қарсы шаралар:</strong> Қауіпсіз жай сандарды (p = 2q+1) пайдалану, ашық кілттерді тексеру және тікелей құпиялылық үшін уақытша (Ephemeral) кілттерді қолдану ұсынылады. Кванттық шабуылдар қаупіне байланысты посткванттық баламаларды қарастыру қажет.</p></div>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">1.</span> Тарихи контекст және түпнұсқа жұмыстар</h2><p className="mb-2">Асимметриялық шифрлау ұғымы 1960 жылдардың соңында пайда болды (GCHQ: Ellis 1970, Williamson 1974/1976). Бірақ алғашқы жарияланған қадамдар Р. Меркл (1978) мен Диффи/Хеллманға (1976) тиесілі.</p><p>Диффи мен Хеллман ашық және жабық кілттерді бөлу идеясын ұсынды. Олардың протоколы екі тарапқа (p,g) параметрлерін пайдаланып қауіпсіз емес арна арқылы ортақ құпияны орнатуға мүмкіндік берді.</p></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">2.</span> DH протоколының математикалық негізі</h2><p className="mb-4">DH протоколы <strong>шекті циклдік топта</strong> жұмыс істейді. Көбінесе GF(p) өрісі (жай p) және q ретті g генераторы таңдалады.</p><div className={`p-5 rounded-xl border mb-6 ${t.boxBg}`}><h3 className={`font-bold uppercase tracking-widest text-sm mb-2 ${t.h3}`}>Дискретті логарифм</h3><p>G = ⟨g⟩ тобы үшін g<sup>x</sup> = a теңдеуінің шешімі дискретті логарифм деп аталады. y = g<sup>x</sup> mod p есептеу оңай, бірақ y, g, p біле отырып x табу есептеу жағынан өте қиын.</p></div><h3 className={`font-bold mt-8 mb-4 ${t.h2}`}>1-кесте. Дискретті логарифмді шешу алгоритмдері</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr><th className={`p-3 border ${t.th}`}>Алгоритм</th><th className={`p-3 border ${t.th}`}>Уақыт күрделілігі</th><th className={`p-3 border ${t.th}`}>Түсініктеме</th></tr></thead><tbody><tr><td className={`p-3 border ${t.td}`}>Pohlig–Hellman</td><td className={`p-3 border ${t.td}`}>p-1 жіктелуіне байланысты</td><td className={`p-3 border ${t.td}`}>Егер p-1 кіші жай сандардан құралса жылдам.</td></tr><tr><td className={`p-3 border ${t.td}`}>Baby-step/Giant-step</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>g<sup>i</sup> кестесін сақтайды.</td></tr><tr><td className={`p-3 border ${t.td}`}>Pollard’s ρ</td><td className={`p-3 border ${t.td}`}>O(√p)</td><td className={`p-3 border ${t.td}`}>Кездейсоқ, жады аз қажет.</td></tr><tr><td className={`p-3 border ${t.td}`}>Number Field Sieve (NFS)</td><td className={`p-3 border ${t.td}`}>L<sub>p</sub>[1/3]</td><td className={`p-3 border ${t.td}`}>Үлкен p үшін ең жақсысы.</td></tr><tr><td className={`p-3 border ${t.td}`}>Шор алгоритмі</td><td className={`p-3 border ${t.td}`}>O(n<sup>k</sup>)</td><td className={`p-3 border ${t.td}`}>Кванттық. DLP-ді полиномдық уақытта шешеді.</td></tr></tbody></table></div></section>
        <section className={`mb-10 p-8 rounded-3xl border ${t.bg}`}><h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${t.h2}`}><span className="text-indigo-500">3.</span> Аутентификация және Шабуылдар</h2><p className="mb-4">DH протоколы аутентификацияны қамтамасыз етпейді (MitM шабуылына осал). Сондықтан ол <strong>аутентификацияланған схемаларда</strong> (SIGMA, HMQV) қолданылады.</p><h3 className={`font-bold mt-8 mb-4 ${t.h2}`}>2-кесте. Шабуылдар мен қарсы шаралар</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr><th className={`p-3 border ${t.th}`}>Шабуыл</th><th className={`p-3 border ${t.th}`}>Сипаттамасы</th><th className={`p-3 border ${t.th}`}>Қарсы шара</th></tr></thead><tbody><tr><td className={`p-3 border ${t.td} font-bold`}>DLP шешу (NFS)</td><td className={`p-3 border ${t.td}`}>Күрделілігі O(√p) немесе L<sub>p</sub>[1/3].</td><td className={`p-3 border ${t.td}`}>p өлшемін арттыру (2048+ бит).</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Шордың кванттық алгоритмі</td><td className={`p-3 border ${t.td}`}>DLP/ECDLP полиномдық бұзуы.</td><td className={`p-3 border ${t.td}`}>Посткванттық схемаларға өту (NTRU, Kyber).</td></tr><tr><td className={`p-3 border ${t.td} font-bold`}>Logjam шабуылы</td><td className={`p-3 border ${t.td}`}>512-битке дейін төмендету.</td><td className={`p-3 border ${t.td}`}>Экспорттық модульдерге тыйым салу; 2048-бит+ қолдану.</td></tr></tbody></table></div></section>
      </div>
    )
  };
  return content[lang] || content.ru;
};

// === ПЛАВАЮЩИЙ КАЛЬКУЛЯТОР ===
const FloatingCalculator = ({ isLight, dict, onClose, containerRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const safeEval = (expr) => {
    try {
      let cleanExpr = expr.replace(/\s+/g, ' ').trim();
      const dhMatch = cleanExpr.match(/^(\d+)\s*\^\s*(\d+)\s*mod\s*(\d+)$/);
      if (dhMatch) return powerMod(dhMatch[1], dhMatch[2], dhMatch[3]) || "Ошибка";
      let jsExpr = cleanExpr.replace(/mod/g, '%').replace(/\^/g, '**');
      let res = Function(`'use strict'; return (${jsExpr})`)();
      if (typeof res === 'number' && !Number.isInteger(res)) return parseFloat(res.toFixed(4));
      return res;
    } catch (e) { return "Ошибка"; }
  };

  const handleBtn = (val) => {
    if (val === 'AC') { setDisplay(""); setHistory(""); return; }
    if (val === 'DEL') { setDisplay(display.trim().slice(0, -1)); return; }
    if (val === '=') { if (!display) return; setHistory(display + " ="); setDisplay(String(safeEval(display))); return; }
    if (['+', '-', '*', '/', 'mod', '^'].includes(val)) setDisplay(display + " " + val + " ");
    else setDisplay(display + val);
  };

  const buttons = ['AC', 'DEL', '^', 'mod', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];
  const getBtnStyle = (btn) => {
    const base = "h-12 rounded-xl font-bold text-lg flex items-center justify-center transition-all active:scale-95 shadow-sm ";
    if (['AC', 'DEL'].includes(btn)) return base + (isLight ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30");
    if (['^', 'mod'].includes(btn)) return base + (isLight ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30");
    if (['/', '*', '-', '+', '='].includes(btn)) return base + (isLight ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30");
    return base + (isLight ? "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50" : "bg-[#172033] text-white border border-indigo-500/20 hover:bg-[#1E293B]");
  };

  return (
    <motion.div
      drag dragConstraints={containerRef} dragMomentum={false}
      onDragStart={() => setIsDragging(true)} onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
      initial={{ opacity: 0, scale: 0.8, x: -50 }} animate={{ opacity: 1, scale: 1, x: 0, width: isOpen ? 320 : 64, height: isOpen ? 'auto' : 64, borderRadius: isOpen ? 24 : 32 }} exit={{ opacity: 0, scale: 0.8, x: -50 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
            <div className="grid grid-cols-4 gap-2">{buttons.map((btn, i) => (<button key={i} onClick={() => handleBtn(btn)} className={getBtnStyle(btn)}>{btn}</button>))}</div>
          </div>
        </div>
      ) : (
        <button onClick={() => { if (!isDragging) setIsOpen(true); }} className={`w-full h-full text-3xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isLight ? 'text-indigo-600 bg-white' : 'text-indigo-300'}`}>🧮</button>
      )}
    </motion.div>
  );
};

// === ПЛАВАЮЩАЯ ШПАРГАЛКА ===
const FloatingCheatSheet = ({ isLight, dict, lang, containerRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag dragConstraints={containerRef} dragMomentum={false}
      onDragStart={() => setIsDragging(true)} onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
      initial={{ opacity: 0, scale: 0.8, x: -50 }} animate={{ opacity: 1, scale: 1, x: 0, width: isOpen ? 600 : 64, height: isOpen ? '70vh' : 64, borderRadius: isOpen ? 24 : 32 }} exit={{ opacity: 0, scale: 0.8, x: -50 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ position: 'absolute', top: '50%', left: 60, zIndex: 9998 }}
      className={`shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border ${isLight ? 'bg-slate-50/95 backdrop-blur-2xl border-slate-300' : 'bg-[#0B0F19]/95 backdrop-blur-2xl border-indigo-500/40'}`}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          <div className={`p-4 border-b flex justify-between items-center cursor-grab active:cursor-grabbing ${isLight ? 'border-slate-200 bg-white/50' : 'border-indigo-500/20 bg-white/5'}`}>
             <div className="flex items-center gap-2"><span className={`opacity-40 text-xl leading-none ${isLight ? 'text-slate-400' : 'text-indigo-300'}`}>⋮⋮</span><span className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-indigo-800' : 'text-indigo-400'}`}>{dict.cheatSheet}</span></div>
             <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setIsOpen(false)} className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isLight ? 'bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-600' : 'bg-white/10 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400'}`}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto" onPointerDown={(e) => e.stopPropagation()}>
            <div className="scale-90 origin-top">
              <TheorySection isLight={isLight} lang={lang} />
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => { if (!isDragging) setIsOpen(true); }} className={`w-full h-full text-3xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isLight ? 'text-amber-500 bg-white' : 'text-amber-400'}`}>❓</button>
      )}
    </motion.div>
  );
};


// === ГЛАВНОЕ ПРИЛОЖЕНИЕ ===
export default function App() {
  const [activeTab, setActiveTab] = useState('practice'); 
  const [mode, setMode] = useState(2); 
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLight, setIsLight] = useState(false);
  const [lang, setLang] = useState('ru');
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  
  const appRef = useRef(null); 
  const d = translations[lang];

  const [p, setP] = useState("23"); const [g, setG] = useState("5");
  const [users, setUsers] = useState({ alice: { priv: "", pub: null, inter: null, final: null }, bob: { priv: "", pub: null, inter: null, final: null }, carol: { priv: "", pub: null, inter: null, final: null } });

  const updatePriv = (user, val) => setUsers(prev => ({ ...prev, [user]: { ...prev[user], priv: val } }));
  const currentStepsList = mode === 2 ? d.steps2 : d.steps3;

  const getMath = (user, type) => {
    const u = users[user];
    if (!u.priv) return null;
    if (type === 'pub') {
        const char = user === 'alice' ? 'A' : user === 'bob' ? 'B' : 'C'; const pow = user === 'alice' ? 'a' : user === 'bob' ? 'b' : 'c';
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

  const nextStep = () => {
    if (step === 1) { if (!p || !g) { setErrorMsg(d.errFill); setTimeout(()=>setErrorMsg(""), 3000); return; } if (!isPrime(p)) { setErrorMsg(`${p} ${d.errPrime}`); setTimeout(()=>setErrorMsg(""), 3000); return; } }
    if (step === 2 && !users.alice.priv) { setErrorMsg(`${d.errKey} ${d.alice}!`); setTimeout(()=>setErrorMsg(""), 3000); return; }
    if (step === 3 && !users.bob.priv) { setErrorMsg(`${d.errKey} ${d.bob}!`); setTimeout(()=>setErrorMsg(""), 3000); return; }
    if (mode === 3 && step === 4 && !users.carol.priv) { setErrorMsg(`${d.errKey} ${d.carol}!`); setTimeout(()=>setErrorMsg(""), 3000); return; }
    
    setErrorMsg(""); const s = step + 1; let u = { ...users };
    if (mode === 2) {
      if (s === 4) u.alice.pub = powerMod(g, u.alice.priv, p); if (s === 5) u.bob.pub = powerMod(g, u.bob.priv, p);
      if (s === 7) u.alice.final = powerMod(u.bob.pub, u.alice.priv, p); if (s === 8) u.bob.final = powerMod(u.alice.pub, u.bob.priv, p);
    } else {
      if (s === 5) u.alice.pub = powerMod(g, u.alice.priv, p); if (s === 6) u.bob.pub = powerMod(g, u.bob.priv, p); if (s === 7) u.carol.pub = powerMod(g, u.carol.priv, p);
      if (s === 9) u.alice.inter = powerMod(u.carol.pub, u.alice.priv, p); if (s === 10) u.bob.inter = powerMod(u.alice.pub, u.bob.priv, p); if (s === 11) u.carol.inter = powerMod(u.bob.pub, u.carol.priv, p);   
      if (s === 13) u.alice.final = powerMod(u.carol.inter, u.alice.priv, p); if (s === 14) u.bob.final = powerMod(u.alice.inter, u.bob.priv, p); if (s === 15) u.carol.final = powerMod(u.bob.inter, u.carol.priv, p);   
    }
    setUsers(u); setStep(s);
  };
  const prevStep = () => { setErrorMsg(""); setStep(Math.max(0, step - 1)); };

  const getFocusedCard = () => {
    if (step <= 1) return 'all';
    if (mode === 2) {
       if ([2, 4, 7].includes(step)) return 'alice';
       if ([3, 5, 8].includes(step)) return 'bob';
       if ([6].includes(step)) return 'channel';
    } else {
       if ([2, 5, 9, 13].includes(step)) return 'alice';
       if ([3, 6, 10, 14].includes(step)) return 'bob';
       if ([4, 7, 11, 15].includes(step)) return 'carol';
       if ([8, 12].includes(step)) return 'channel';
    }
    return 'all';
  };
  const focused = getFocusedCard();

  const t = {
    appBg: isLight ? "bg-slate-50 text-slate-800" : "bg-[#0B0F19] text-white",
    titleGrad: isLight ? "from-cyan-600 via-indigo-600 to-violet-600" : "from-cyan-400 via-indigo-400 to-violet-400",
    pillCont: isLight ? "bg-slate-100 border-slate-300 shadow-inner" : "bg-[#0B0F19]/60 border-indigo-500/20 shadow-[inset_0_2px_15px_rgba(0,0,0,0.6)]",
    pillActCyan: isLight ? "bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-slate-200" : "bg-indigo-500/30 border-white/10 shadow-[0_0_25px_rgba(99,102,241,0.3)]",
    ctrlBar: isLight ? "bg-white/90 border-slate-300 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" : "bg-[#0B0F19]/90 border-indigo-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
  };

  return (
    <div ref={appRef} className={`flex h-screen relative overflow-hidden font-sans antialiased transition-colors duration-700 ${t.appBg}`}>
      
      {/* КНОПКИ ПЛАВАЮЩИХ ПАНЕЛЕЙ (СЛЕВА) */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
        <button onClick={() => setIsCalcOpen(!isCalcOpen)} title={isCalcOpen ? d.hideCalc : d.showCalc} className={`w-12 h-24 flex items-center justify-center rounded-r-2xl shadow-[4px_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:w-14 active:scale-95 outline-none ${isLight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600/80 backdrop-blur-md text-white border-y border-r border-indigo-400/50 hover:bg-indigo-500/90'}`}>
          <span className="text-2xl drop-shadow-md">🧮</span>
        </button>
        <button onClick={() => setIsCheatSheetOpen(!isCheatSheetOpen)} title={d.cheatSheet} className={`w-12 h-24 flex items-center justify-center rounded-r-2xl shadow-[4px_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:w-14 active:scale-95 outline-none ${isLight ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-amber-500/80 backdrop-blur-md text-white border-y border-r border-amber-400/50 hover:bg-amber-400/90'}`}>
          <span className="text-2xl drop-shadow-md">❓</span>
        </button>
      </div>

      <main className="flex-1 relative overflow-y-auto scroll-smooth p-6">
        
        {/* КНОПКИ ВЕРХНЕГО МЕНЮ */}
        <div className="absolute top-6 right-6 flex gap-4 z-40">
          <div className={`flex items-center p-1 rounded-full border mr-4 transition-all duration-500 ${isLight ? 'bg-white shadow-sm border-slate-300' : 'bg-[#172033] border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
            <button onClick={() => setActiveTab('theory')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'theory' ? (isLight ? 'bg-indigo-500 text-white' : 'bg-indigo-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>📚 {d.navTheory}</button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'practice' ? (isLight ? 'bg-cyan-500 text-white' : 'bg-cyan-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>🛠 {d.navPrac}</button>
            <button onClick={() => setActiveTab('exam')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'exam' ? (isLight ? 'bg-rose-500 text-white' : 'bg-rose-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>📝 {d.navExam}</button>
          </div>

          <div className={`flex items-center p-1 rounded-full border transition-all duration-500 ${isLight ? 'bg-white shadow-sm border-slate-300' : 'bg-[#172033] border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
             {['ru', 'en', 'kk'].map((lng) => (
               <button key={lng} onClick={() => setLang(lng)} className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${lang === lng ? (isLight ? 'bg-indigo-500 text-white' : 'bg-indigo-500/50 text-white') : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-indigo-400/50 hover:text-indigo-200')}`}>{lng}</button>
             ))}
          </div>
          <button onClick={() => setIsLight(!isLight)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-500 ${isLight ? 'bg-white shadow-sm text-amber-600 border border-amber-200 hover:scale-105' : 'bg-[#172033] border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-105 hover:text-white'}`}>{isLight ? '☀️ Light' : '🌙 Dark'}</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'theory' && <motion.div key="theory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-20"><TheorySection isLight={isLight} lang={lang} /></motion.div>}
          {activeTab === 'exam' && <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20"><ExamSection isLight={isLight} dict={d} /></motion.div>}

          {activeTab === 'practice' && (
            <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-10 flex flex-col h-full">
              <header className="text-center mb-8 flex flex-col items-center pt-4">
                <h1 className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r mb-8 drop-shadow-lg tracking-tight transition-colors duration-500 ${t.titleGrad}`}>{d.title}</h1>
                <div className={`relative flex items-center p-2 rounded-full border transition-colors duration-500 ${t.pillCont}`}>
                  {[2, 3].map((m) => {
                    const isActive = mode === m;
                    return (
                      <button key={m} onClick={() => { setMode(m); setStep(0); setErrorMsg(""); }} className={`relative px-10 py-3 rounded-full text-base font-bold transition-colors duration-300 z-10 outline-none ${isActive ? (isLight ? 'text-slate-900' : 'text-white') : (isLight ? 'text-slate-500' : 'text-indigo-300')}`}>
                        {isActive && <motion.div layoutId="glass-pill" className={`absolute inset-0 rounded-full -z-10 transition-colors duration-500 ${t.pillActCyan}`} initial={false} transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
                        <span className="relative z-10">{m === 2 ? d.part2 : d.part3}</span>
                      </button>
                    );
                  })}
                </div>
              </header>

              <div className={`max-w-3xl mx-auto mb-8 p-6 rounded-2xl border backdrop-blur-md flex justify-around items-center transition-colors duration-500 z-10 ${isLight ? 'bg-white/80 border-slate-300 shadow-sm' : 'bg-[#0B0F19]/60 border-indigo-500/20 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]'}`}>
                <div className="text-center">
                  <p className={`text-sm mb-2 uppercase tracking-wider font-extrabold ${isLight ? 'text-slate-700' : 'text-indigo-200'}`}>{d.prime}</p>
                  {step <= 1 ? <input type="number" value={p} onChange={e => setP(e.target.value)} className={`font-mono text-xl font-bold px-4 py-2 rounded-xl w-32 text-center border outline-none transition-colors ${isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-[#050810] border-indigo-500/30 focus:border-cyan-400 text-indigo-300'}`} /> : <div className={`text-3xl font-mono font-extrabold ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>{p}</div>}
                </div>
                <div className="text-center">
                  <p className={`text-sm mb-2 uppercase tracking-wider font-extrabold ${isLight ? 'text-slate-700' : 'text-indigo-200'}`}>{d.gen}</p>
                  {step <= 1 ? <input type="number" value={g} onChange={e => setG(e.target.value)} className={`font-mono text-xl font-bold px-4 py-2 rounded-xl w-32 text-center border outline-none transition-colors ${isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-[#050810] border-indigo-500/30 focus:border-cyan-400 text-indigo-300'}`} /> : <div className={`text-3xl font-mono font-extrabold ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>{g}</div>}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 w-full max-w-[1600px] mx-auto relative">
                <div className="flex flex-wrap lg:flex-nowrap justify-center w-full gap-6 relative">
                  <div className="w-full lg:w-[28%] max-w-sm">
                    <UserCard name={d.alice} isLight={isLight} dict={d} showPrivInput={step === 2} showPrivText={step > 2} showPub={step >= (mode === 2 ? 4 : 5)} pubMath={getMath('alice', 'pub')} showInter={step >= 9} interMath={getMath('alice', 'inter')} showFinal={step >= (mode === 2 ? 7 : 13)} finalMath={getMath('alice', 'final')} onPrivChange={(v) => updatePriv('alice', v)} isWinner={step === (mode === 2 ? 8 : 15)} isFocused={focused === 'all' || focused === 'alice'} {...users.alice} />
                  </div>
                  <div className="w-full lg:w-[44%] max-w-2xl">
                    <NetworkVisualizer step={step} mode={mode} isLight={isLight} dict={d} pubA={users.alice.pub} pubB={users.bob.pub} pubC={users.carol.pub} p={p} g={g} isFocused={focused === 'all' || focused === 'channel'} />
                  </div>
                  <div className="w-full lg:w-[28%] max-w-sm">
                    <UserCard name={d.bob} isLight={isLight} dict={d} showPrivInput={step === 3} showPrivText={step > 3} showPub={step >= (mode === 2 ? 5 : 6)} pubMath={getMath('bob', 'pub')} showInter={step >= 10} interMath={getMath('bob', 'inter')} showFinal={step >= (mode === 2 ? 8 : 14)} finalMath={getMath('bob', 'final')} onPrivChange={(v) => updatePriv('bob', v)} isWinner={step === (mode === 2 ? 8 : 15)} isFocused={focused === 'all' || focused === 'bob'} {...users.bob} />
                  </div>
                </div>

                {mode === 3 && (
                  <div className="w-full max-w-sm z-10 mt-4 mb-32">
                    <UserCard name={d.carol} isLight={isLight} dict={d} showPrivInput={step === 4} showPrivText={step > 4} showPub={step >= 7} pubMath={getMath('carol', 'pub')} showInter={step >= 11} interMath={getMath('carol', 'inter')} showFinal={step >= 15} finalMath={getMath('carol', 'final')} onPrivChange={(v) => updatePriv('carol', v)} isWinner={step === 15} isFocused={focused === 'all' || focused === 'carol'} {...users.carol} />
                  </div>
                )}
              </div>

              {/* === НЕВИДИМЫЙ БЛОК ДЛЯ ПРОКРУТКИ ВНИЗ (ЧТОБЫ ПАНЕЛЬ НЕ ЗАКРЫВАЛА КЭРОЛ) === */}
              <div className="h-96 w-full flex-shrink-0"></div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ФИКСИРОВАННАЯ ПАНЕЛЬ УПРАВЛЕНИЯ ВНИЗУ */}
      {activeTab === 'practice' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 flex flex-col items-center pointer-events-none">
          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mb-3 px-6 py-2 rounded-full bg-rose-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(244,63,94,0.5)]">
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`pointer-events-auto flex justify-between items-center w-full px-6 py-4 rounded-3xl backdrop-blur-2xl border transition-colors duration-500 ${t.ctrlBar}`}>
            <button onClick={prevStep} disabled={step === 0} className={`px-6 py-2.5 rounded-xl font-bold text-base transition-all disabled:opacity-30 ${isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-white/10 text-indigo-300 hover:bg-white/20'}`}>{d.prev}</button>
            <div className="text-center flex-1 mx-6">
              <p className={`font-mono text-xs mb-1 tracking-widest uppercase font-extrabold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>{d.step} {step} {d.of} {currentStepsList.length - 1}</p>
              <h3 className={`text-xl font-bold tracking-wide leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentStepsList[step]}</h3>
            </div>
            <button onClick={nextStep} disabled={step === currentStepsList.length - 1} className={`px-6 py-2.5 rounded-xl font-bold text-base transition-all ${isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'}`}>{d.next}</button>
          </motion.div>
        </div>
      )}

      {/* ПЛАВАЮЩИЕ ОКНА */}
      <AnimatePresence>
        {isCalcOpen && <FloatingCalculator isLight={isLight} dict={d} onClose={() => setIsCalcOpen(false)} containerRef={appRef} />}
        {isCheatSheetOpen && <FloatingCheatSheet isLight={isLight} dict={d} lang={lang} containerRef={appRef} />}
      </AnimatePresence>

    </div>
  );
}