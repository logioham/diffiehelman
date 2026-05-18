import React, { useState, useEffect } from 'react';

export const TheorySection = ({ isLight, lang }) => {
  const [activeSection, setActiveSection] = useState('history');

  const sections = {
    ru: [
      { id: 'history', title: '1. Введение и История создания' },
      { id: 'analogy', title: '2. Наглядная концепция (Аналогия с красками)' },
      { id: 'crypto-math', title: '3. Математика и Криптография' },
      { id: 'variants', title: '4. Эфемерные, Статические ключи и 3-DH' },
      { id: 'multiparty', title: '5. Групповой DH (3 и более участников)' },
      { id: 'security', title: '6. Безопасность, Уязвимости и Атаки' },
      { id: 'formal-proofs', title: '7. Formal Proofs (PCL)' },
      { id: 'new-directions', title: '8. Фундамент 1976 года и Новые направления' }
    ],
    en: [
      { id: 'history', title: '1. Introduction & History' },
      { id: 'analogy', title: '2. Visual Concept (Color Analogy)' },
      { id: 'crypto-math', title: '3. Mathematics & Cryptography' },
      { id: 'variants', title: '4. Ephemeral, Static Keys & 3-DH' },
      { id: 'multiparty', title: '5. Multiparty DH (3+ Participants)' },
      { id: 'security', title: '6. Security, Vulnerabilities & Attacks' },
      { id: 'formal-proofs', title: '7. Formal Security Proofs (PCL)' },
      { id: 'new-directions', title: '8. 1976 Foundation & New Directions' }
    ],
    kk: [
      { id: 'history', title: '1. Кіріспе және Құрылу тарихы' },
      { id: 'analogy', title: '2. Көрнекі түсінік (Бояулар аналогиясы)' },
      { id: 'crypto-math', title: '3. Математика және Криптография' },
      { id: 'variants', title: '4. Эфемерлі, Статикалық кілттер және 3-DH' },
      { id: 'multiparty', title: '5. Топтық DH (3 немесе одан көп қатысушы)' },
      { id: 'security', title: '6. Қауіпсіздік, Осалдықтар және Шабуылдар' },
      { id: 'formal-proofs', title: '7. Қалыпты қауіпсіздік дәлелдемелері (PCL)' },
      { id: 'new-directions', title: '8. 1976 жылғы іргетас және Жаңа бағыттар' }
    ]
  };

  const currentSections = sections[lang] || sections.ru;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    currentSections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [lang]);

  const t = {
    bg: isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#172033]/90 border-indigo-500/20 shadow-lg",
    h1: isLight ? "text-slate-900" : "text-white", 
    h2: isLight ? "text-slate-800" : "text-indigo-300",
    text: isLight ? "text-slate-700" : "text-slate-300", 
    boxBg: isLight ? "bg-slate-50 border-slate-200" : "bg-[#0B0F19] border-indigo-500/30",
    accent: isLight ? "border-indigo-500 text-indigo-800" : "border-indigo-400 text-indigo-300",
    navBg: isLight ? "bg-slate-50/80 border-slate-200" : "bg-[#050810]/80 border-indigo-500/30",
    navText: isLight ? "text-slate-600 hover:text-indigo-600" : "text-slate-400 hover:text-indigo-300",
    navActive: isLight ? "border-indigo-500 text-indigo-700 font-bold bg-indigo-50" : "border-indigo-400 text-indigo-300 font-bold bg-indigo-900/20"
  };

  const navTitle = { ru: "Содержание", en: "Contents", kk: "Мазмұны" };
  const mainDesc = {
    ru: "Полная академическая справка, математическая основа и формальные доказательства безопасности.",
    en: "Complete academic reference, mathematical foundation, and formal security proofs.",
    kk: "Толық академиялық анықтама, математикалық негіз және қалыпты қауіпсіздік дәлелдемелері."
  };

  const content = {
    ru: (
      <>
        <header className="mb-10">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${t.h1}`}>Алгоритм Диффи-Хеллмана <span className="text-indigo-500">(DH)</span></h1>
          <p className="text-lg opacity-80">{mainDesc.ru}</p>
        </header>

        <section id="history" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>1. Введение и История создания</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Протокол обмена ключами Диффи-Хеллмана (DH) — это математический метод безопасной генерации симметричного криптографического ключа по открытому, незащищенному каналу связи. Исторически, защищенная зашифрованная связь между двумя сторонами требовала предварительного обмена ключами физическим путем (например, через доверенных курьеров с бумажными списками).</p>
            <p>Алгоритм был опубликован в 1976 году Уитфилдом Диффи и Мартином Хеллманом, и это была первая публично известная работа, предложившая идею разделения на закрытый и открытый ключи. Однако в 2006 году Хеллман предложил называть этот алгоритм «Обмен ключами Диффи-Хеллмана-Меркла», чтобы признать равный вклад Ральфа Меркла в разработку концепции криптографии с открытым ключом. Истекший патент США 4200770 (от 1977 года) также указывает Хеллмана, Диффи и Меркла как полноправных изобретателей.</p>
            <div className={`p-4 mt-4 rounded-xl border-l-4 ${t.boxBg} ${t.accent}`}>
              <strong>Исторический факт:</strong> Хотя схема была опубликована в 1976 году, в 1997 году выяснилось, что математики Джеймс Эллис, Клиффорд Кокс и Малкольм Уильямсон из британского разведывательного агентства GCHQ изобрели аналогичную концепцию асимметричного шифрования еще в 1969 году, но их работа была засекречена государством.
            </div>
          </div>
        </section>

        <section id="analogy" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>2. Наглядная концепция (Аналогия с красками)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Основную идею обмена открытыми ключами можно проиллюстрировать с помощью аналогии смешивания цветов вместо огромных чисел.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Стороны (Алиса и Боб) публично договариваются о произвольном начальном цвете, который не нужно хранить в тайне (например, желтый).</li>
              <li>Каждый выбирает свой секретный цвет (например, Алиса — красный, Боб — голубой).</li>
              <li>Они смешивают свой секретный цвет с публичным желтым. У Алисы получается оранжевый, у Боба — светло-синий.</li>
              <li>Они обмениваются получившимися смесями по открытому каналу.</li>
              <li>Наконец, каждый добавляет свой личный секретный цвет в полученную от партнера смесь.</li>
            </ol>
            <p>Результатом становится финальная смесь красок (в данном случае желто-коричневая), которая абсолютно идентична у обоих участников. Третья сторона (злоумышленник), прослушивающая канал, будет знать только желтый, оранжевый и светло-синий цвета. Но определить финальный цвет крайне сложно, так как процесс "разделения красок" вычислительно невозможен, что имитирует математическую задачу алгоритма.</p>
          </div>
        </section>

        <section id="crypto-math" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>3. Математика и Криптография</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>В простейшей и оригинальной реализации протокола, стандартизированной в RFC 7919 (Finite Field Diffie-Hellman), используется мультипликативная группа целых чисел по модулю <i>p</i>, где <i>p</i> — простое число, а <i>g</i> — примитивный корень (генератор) по модулю <i>p</i>. Эти два значения (<i>p</i> и <i>g</i>) выбираются так, чтобы разделяемый секрет мог принимать любое значение от 1 до <i>p-1</i>.</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">Процесс вычисления:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Алиса и Боб открыто договариваются об использовании <i>p</i> и <i>g</i>.</li>
              <li>Алиса выбирает секретное число <i>a</i> и отправляет Бобу вычисленный открытый ключ: <i>A = g<sup>a</sup> mod p</i>.</li>
              <li>Боб выбирает секретное число <i>b</i> и отправляет Алисе: <i>B = g<sup>b</sup> mod p</i>.</li>
              <li>Алиса вычисляет финальный секрет <i>s = B<sup>a</sup> mod p</i>.</li>
              <li>Боб вычисляет финальный секрет <i>s = A<sup>b</sup> mod p</i>.</li>
            </ul>
            
            <p className="mt-4">Оба получают одинаковый результат, потому что согласно правилам модульной арифметики: <i>s = (g<sup>b</sup> mod p)<sup>a</sup> mod p = (g<sup>a</sup> mod p)<sup>b</sup> mod p = g<sup>ab</sup> mod p</i>. Только значения <i>a</i> и <i>b</i> остаются в секрете, а перехватив публичные <i>A</i> и <i>B</i>, злоумышленник не сможет найти <i>g<sup>ab</sup> mod p</i> за разумное время. Данная вычислительная сложность известна как проблема дискретного логарифма (Discrete Logarithm Problem, DLP).</p>
            <p>Вычисление <i>g<sup>a</sup> mod p</i> (модульное возведение в степень) выполняется очень быстро, в то время как обратная функция крайне трудна. Такая функция называется односторонней функцией (one-way function). Примечательно, что сам по себе генератор <i>g</i> не обязан быть большим числом, на практике часто используются числа вроде 2 или 5.</p>
          </div>
        </section>

        <section id="variants" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>4. Вариации ключей: Эфемерные, Статические и 3-DH</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Ключи в протоколе DH могут быть эфемерными (одноразовыми) или статическими (долгосрочными), и их комбинирование создает различные свойства безопасности (описано, например, в стандарте NIST SP 800-56A):</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Эфемерный-Эфемерный:</strong> Используется для согласования ключей (DHE). Обеспечивает совершенную прямую секретность (forward secrecy), так как ключи уничтожаются сразу после завершения сессии, что защищает от их будущей компрометации. Не предоставляет аутентификации.</li>
              <li><strong>Статический-Статический:</strong> Генерирует долгосрочный общий секрет. Дает неявную аутентификацию, но уязвим для атак повторного воспроизведения (replay attacks) и не обеспечивает прямой секретности.</li>
              <li><strong>Эфемерный-Статический:</strong> Применяется в таких протоколах, как Integrated Encryption Scheme (IES) или шифровании Эль-Гамаля. Дает одностороннюю аутентификацию, но не имеет forward secrecy.</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-2">Triple Diffie-Hellman (3-DH) и X3DH</h3>
            <p>В 1997 году Саймон Блейк-Уилсон предложил алгоритм Triple DH (усовершенствованный Кудлой и Патерсоном в 2005), где стороны используют как долгосрочные (<i>a, b</i>), так и эфемерные (<i>x, y</i>) ключи одновременно. Итоговый ключ вычисляется с помощью функции деривации ключа: <i>K = KDF(g<sup>xy</sup>, g<sup>xb</sup>, g<sup>ya</sup>, A, B)</i>. Это обеспечивает и аутентификацию, и прямую секретность.</p>
            <p>Дальнейшее развитие привело к протоколу <strong>Extended Triple Diffie-Hellman (X3DH)</strong>, который является ядром алгоритма Double Ratchet (используется в мессенджере Signal). Он оперирует пятью ключами на базе эллиптических кривых: Алиса использует ключи идентификации (IKA) и эфемерные ключи (EKA), а Боб заранее загружает на server идентификационный (IKB), подписанный предварительный (SPKB) и одноразовый (OPKB) ключи. Протокол X3DH дополнительно обеспечивает криптографическое отрицание авторства (deniability).</p>
          </div>
        </section>

        <section id="multiparty" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>5. Групповой DH (3 и более участников)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Протокол DH можно масштабировать для любого количества участников. Ключевой принцип: секрет формируется путем возведения базового <i>g</i> в степень каждого из приватных ключей участников в любом порядке. Последний участник, возводящий число в свою степень, получает готовый секретный ключ, который никогда не должен передаваться по сети.</p>
            <p>Существуют два основных подхода для <i>N</i> участников:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Круговой метод:</strong> Участники передают промежуточные значения по кругу. Этот метод наиболее прост, но крайне неэффективен, так как заставляет каждого из <i>N</i> пользователей выполнить ровно <i>N</i> ресурсоемких модульных возведений в степень.</li>
              <li><strong>学术 "Разделяй и властвуй":</strong> Более умный подход, использующий дублирование ключей. Он позволяет сократить число математических операций для каждого участника до <i>log<sub>2</sub>(N) + 1</i>. Например, для 8 человек (A, B, C, D, E, F, G, H), группы могут параллельно вычислять <i>g<sup>abcd</sup></i> и <i>g<sup>efgh</sup></i>, обменяться ими, и выполнить финальные операции для получения <i>g<sup>abcdefgh</sup></i> всего за 4 шага вычислений на каждого, вместо 8.</li>
            </ol>
          </div>
        </section>

        <section id="security" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>6. Безопасность, Уязвимости и Атаки</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Атака "Человек посередине" (Man-in-the-Middle, MitM)</h4>
              <p>В оригинальном описании DH не предусмотрена аутентификация сторон. Активный злоумышленник (Мэллори) может перехватить передачу ключей и установить две отдельные сессии связи — одну с Алисой, другую с Бобом. Мэллори будет расшифровывать и перешифровывать все сообщения, а Алиса и Боб будут думать, что общаются напрямую. Чтобы этого избежать, алгоритм DH используют вместе со схемами цифровой подписи или в протоколах типа STS и IKE.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Атака Logjam на интернет-трафик</h4>
              <p>Самым эффективным классическим алгоритмом взлома дискретного логарифма является алгоритм "Решето числового поля" (Number Field Sieve, NFS). Первые три шага этого алгоритма зависят только от порядка группы (модуля <i>p</i>), а не от перехваченных данных. Выяснилось, что огромная часть серверов в интернете годами использовала одни и те же стандартные простые числа длиной 512 бит (так называемые экспортные шифры).</p>
              <p>Осуществив массовые предвычисления (занявшие неделю на нескольких тысячах ядер), хакеры смогли ломать индивидуальные сессии всего за минуту. По оценкам исследователей, создание предвычислений для 1024-битного модуля обошлось бы примерно в 100 млн долларов, что вполне по карману АНБ США. На данный момент категорически рекомендуется использовать <i>p</i> длиной не менее 2048 бит.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Отказ в обслуживании (DoS) и D(HE)at</h4>
              <p>Уязвимость CVE-2002-20001 описывает DoS-атаку D(HE)at, при которой злоумышленник отправляет жертве специально сгенерированные произвольные числа вместо открытых ключей. Это заставляет сервер тратить огромные вычислительные мощности на бесполезные модульные возведения в степень. Дополнительные CVE выявили, что реализации иногда используют излишне длинные приватные экспоненты, усугубляя проблему загрузки процессора.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Квантовые компьютеры</h4>
              <p>Квантовые компьютеры способны полностью уничтожить классическую криптографию на открытых ключах. Алгоритм Шора может за полиномиальное время решать задачи факторизации и дискретного логарифмирования. Для защиты от этой угрозы в 2023 году был предложен постквантовый алгоритм, комбинирующий старую эллиптическую кривую X25519 с квантово-устойчивым протоколом CRYSTALS-Kyber.</p>
            </div>
          </div>
        </section>

        <section id="formal-proofs" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>7. Формальные доказательства безопасности (PCL)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Надежность сетевых стандартов, использующих DH (таких как IPSEC IKEv2 и Kerberos), не принимается на веру, а доказывается с использованием формальных систем, таких как Логика Композиции Протоколов (Protocol Composition Logic, PCL). PCL напрямую оперирует свойствами выполнения протоколов вероятностными машинами Тьюринга в полиномиальное время.</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">Предикаты секретности: DHSecretive и DHStrongSecretive</h3>
            <p>В ходе исследований криптографы ввели два ключевых предиката для формализации правильного использования ключей потоками (threads):</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>DHSecretive(X, Y, k):</strong> Означает, что потоки сгенерировали ключи, но существует теоретическая вероятность атак на связанных ключах. Доказательство безопасности в этом случае требует использования модели случайного оракула (Random Oracle Model).</li>
              <li><strong>DHStrongSecretive(X, Y, k):</strong> Более строгое условие, требующее, чтобы потоки X и Y использовали <em>исключительно</em> DH-экспоненты друг друга для вычисления общего секрета <i>k</i>. Если это условие выполняется, ключ обладает свойством IND-CCA в рамках строгой "стандартной модели", без случайных оракулов.</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-2">Анализ Kerberos (DHINIT) и IKEv2</h3>
            <p>При использовании формальной логики для анализа первой стадии протокола Kerberos (DHINIT) был выявлен дефект: сервер аутентификации (KAS) не аутентифицируется клиентом должным образом после первой стадии, так как клиент не может разобрать зашифрованный тикет (TGT), не имея долгосрочного ключа сервера. Эту проблему можно легко устранить, заставив сервер включать идентификатор клиента внутрь своей цифровой подписи.</p>
            <p>Анализ протокола IKEv2 (стандарт IPSEC) показал гораздо более надежные результаты. IKEv2 избегает повторного использования экспонент и требует от сторон подписывать как свои собственные, так и чужие (полученные от партнера) DH-экспоненты. Это удовлетворяет условию DHStrongSecretive и позволяет доказать полную секретность ключей и аутентификацию в стандартной криптографической модели.</p>
          </div>
        </section>

        <section id="new-directions" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>8. Фундамент 1976 года и Новые направления</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Историческая статья Уитфилда Диффи и Мартина Хеллмана "New Directions in Cryptography" (1976) не просто предложила алгоритм, она заложила философский фундамент современных сетей. В ней утверждалось, что с развитием телекоммуникаций классическая криптография упрется в проблему распространения ключей, требующую безопасных физических каналов.</p>
            
            <p>Статья выделила две главные проблемы и пути их решения:</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Проблема приватности (Privacy):</strong> Решается созданием криптосистемы с открытым ключом, где алгоритмы шифрования (<i>E</i>) и расшифрования (<i>D</i>) разделены так, что знание публичного <i>E</i> не позволяет вычислительно восстановить <i>D</i>.</li>
              <li><strong>Проблема односторонней аутентификации (One-way Authentication):</strong> Предложено использовать "Функции с потайным входом" (Trap-door one-way functions). Их легко вычислить в прямом направлении, но крайне сложно обратить, если только у вас нет специальной "потайной" информации (закрытого ключа).</li>
            </ul>

            <p className="mt-4">До этого безопасность доказывалась эмпирическим путем — атаками криптоаналитиков. Диффи и Хеллман впервые связали криптографию с теорией сложности вычислений (Computational Complexity). Они доказали, что криптографические проблемы не могут быть проще, чем класс NP, и предложили использовать NP-полные задачи, такие как Задача о Рюкзаке (Knapsack problem) для создания безопасных шифров.</p>
          </div>
        </section>
      </>
    ),
    en: (
      <>
        <header className="mb-10">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${t.h1}`}>Diffie-Hellman Algorithm <span className="text-indigo-500">(DH)</span></h1>
          <p className="text-lg opacity-80">{mainDesc.en}</p>
        </header>

        <section id="history" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>1. Introduction & History</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>The Diffie–Hellman (DH) key exchange protocol is a mathematical method of securely generating a symmetric cryptographic key over an open, public communication channel. Traditionally, secure communication required exchanging keys via trusted physical couriers.</p>
            <p>Published in 1976 by Whitfield Diffie and Martin Hellman, this was the first public work to propose the concept of public-private key pairs. In 2006, Hellman suggested calling it "Diffie-Hellman-Merkle key exchange" to recognize Ralph Merkle's equal contribution to public-key cryptography. US Patent 4200770 credits all three as inventors.</p>
            <div className={`p-4 mt-4 rounded-xl border-l-4 ${t.boxBg} ${t.accent}`}>
              <strong>Historical Note:</strong> Although published in 1976, it was revealed in 1997 that James H. Ellis, Clifford Cocks, and Malcolm J. Williamson of GCHQ (British intelligence agency) had secretly discovered public-key cryptography earlier in 1969.
            </div>
          </div>
        </section>

        <section id="analogy" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>2. Visual Concept (Color Analogy)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>The core concept can be beautifully illustrated using paint mixing instead of large numbers.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Alice and Bob publicly agree on a non-secret starting color (e.g., yellow).</li>
              <li>Each selects a secret private color (e.g., red for Alice, cyan for Bob).</li>
              <li>They mix their private color with the common yellow, producing orange-tan and light-blue mixtures respectively.</li>
              <li>They exchange these mixtures over the public channel.</li>
              <li>Finally, each adds their own private color to the mixture received from the partner.</li>
            </ol>
            <p>The resulting yellow-brown mixture is perfectly identical for both parties. An eavesdropper overhearing the transmission only learns the starting yellow and the intermediate mixtures, but separating mixed paints is computationally impossible, mimicking the mathematical challenge.</p>
          </div>
        </section>

        <section id="crypto-math" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>3. Mathematics & Cryptography</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>The original implementation, formalized as Finite Field Diffie-Hellman in RFC 7919, utilizes the multiplicative group of integers modulo <i>p</i>, where <i>p</i> is a prime number and <i>g</i> is a primitive root modulo <i>p</i>. These values ensure the shared secret can take any value from 1 to <i>p-1</i>.</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">Calculation Flow:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Alice and Bob agree on <i>p</i> and <i>g</i>.</li>
              <li>Alice picks secret <i>a</i>, sends public key: <i>A = g<sup>a</sup> mod p</i>.</li>
              <li>Bob picks secret <i>b</i>, sends public key: <i>B = g<sup>b</sup> mod p</i>.</li>
              <li>Alice computes shared secret <i>s = B<sup>a</sup> mod p</i>.</li>
              <li>Bob computes shared secret <i>s = A<sup>b</sup> mod p</i>.</li>
            </ul>
            
            <p className="mt-4">Both arrive at the same key due to modular arithmetic rules: <i>s = (g<sup>b</sup> mod p)<sup>a</sup> mod p = (g<sup>a</sup> mod p)<sup>b</sup> mod p = g<sup>ab</sup> mod p</i>. Only <i>a</i> and <i>b</i> are private; all other parameters travel in the clear. Inverting this process to find the secret from public keys is known as the Discrete Logarithm Problem (DLP), making it a reliable one-way function. In practice, <i>g</i> can be a small integer like 2 or 5.</p>
          </div>
        </section>

        <section id="variants" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>4. Ephemeral, Static Keys & 3-DH</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Keys can be ephemeral (session-based) or static (long-term). Their mixing provides distinct security qualities outlined in NIST SP 800-56A:</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Ephemeral-Ephemeral:</strong> Used in DHE. Provides perfect forward secrecy because keys are discarded after session closure, neutralizing future compromise. Lacks explicit authenticity.</li>
              <li><strong>Static-Static:</strong> Generates a long-term shared secret. Offers implicit authenticity but fails forward secrecy and is vulnerable to replay attacks.</li>
              <li><strong>Ephemeral-Static:</strong> Used in ElGamal and Integrated Encryption Schemes (IES). Offers one-sided authenticity.</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-2">Triple Diffie-Hellman (3-DH) & X3DH</h3>
            <p>Triple DH combines long-term (<i>a, b</i>) and ephemeral (<i>x, y</i>) keys: <i>K = KDF(g<sup>xy</sup>, g<sup>xb</sup>, g<sup>ya</sup>, A, B)</i>, securing both identity and forward secrecy. This evolved into <strong>Extended Triple DH (X3DH)</strong>, the core handshake for the Double Ratchet Algorithm in the Signal Protocol, which utilizes five keys over elliptic curves and provides cryptographic deniability.</p>
          </div>
        </section>

        <section id="multiparty" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>5. Multiparty DH (3+ Participants)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>DH easily scales to multiple parties. The fundamental rule is applying everyone's private exponent to the base <i>g</i> exactly once, in any order. The final recipient applies their key last to unveil the shared secret.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Circular Method:</strong> Keys rotate in a ring. Simple but highly inefficient, demanding <i>N</i> exponentiations from each of the <i>N</i> participants.</li>
              <li><strong>Divide-and-Conquer Method:</strong> A structured approach lowering operations to <i>log<sub>2</sub>(N) + 1</i> per participant. For 8 people, groups calculate <i>g<sup>abcd</sup></i> and <i>g<sup>efgh</sup></i> concurrently, exchange them, and finalize the sequence in 4 steps instead of 8.</li>
            </ol>
          </div>
        </section>

        <section id="security" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>6. Security, Vulnerabilities & Attacks</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Man-in-the-Middle Attack (MitM)</h4>
              <p>Vanilla DH lacks peer authentication. An active interceptor (Mallory) can establish independent handshakes with Alice and Bob separately, decrypting and re-encrypting traffic on the fly. To stop MitM, DH must be bound to digital signatures (like in IKE or STS).</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Logjam Network Attack</h4>
              <p>The Number Field Sieve (NFS) algorithm cracks discrete logs in four stages, the first three depending purely on the prime group modulus <i>p</i>. Attackers precomputed data for the most common 512-bit internet primes ("export grade") to solve active logarithms in under a minute. Precomputing for 1024-bit primes is estimated to cost around $100M, within reach for national intelligence agencies. Primes of at least 2048 bits are now strictly required.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Denial of Service (DoS) & D(HE)at</h4>
              <p>CVE-2002-20001 details the D(HE)at attack where an adversary floods a server with invalid public keys, forcing expensive modular computations that crash the processor. Further CVEs warn against overly long private exponents that trigger identical infrastructure exhaustion.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Quantum Threat</h4>
              <p>Shor's quantum algorithm solves discrete logarithms in polynomial time, fully threatening classical public-key infrastructure. Post-quantum mitigations introduced in 2023 combine elliptic curves (X25519) with quantum-safe lattice frameworks like CRYSTALS-Kyber.</p>
            </div>
          </div>
        </section>

        <section id="formal-proofs" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>7. Formal Security Proofs (PCL)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>The integrity of complex protocols (like IPSEC IKEv2 and Kerberos) is audited mathematically using Protocol Composition Logic (PCL) over probabilistic polynomial-time Turing machines.</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">Secrecy Predicates: DHSecretive vs DHStrongSecretive</h3>
            <p>PCL establishes formal security by tracking execution traces via two vital predicates:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>DHSecretive(X, Y, k):</strong> Indicates keys were formed, but allows theoretical related-key exposures, demanding the Random Oracle Model for full security validation.</li>
              <li><strong>DHStrongSecretive(X, Y, k):</strong> A stricter condition ensuring both parties used <i>exclusively</i> each other's genuine DH parameters. This enables full IND-CCA validation in the standard model.</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-2">Auditing Kerberos (DHINIT) and IKEv2</h3>
            <p>PCL analysis exposed that the Kerberos KAS is not fully authenticated to the client after the first stage because the client cannot inspect the encrypted TGT payload. Requiring the KAS to embed the client's identity inside the signature fixes this defect. In contrast, IKEv2 forces peers to sign both their own and received DH exponentials, satisfying DHStrongSecretive natively in the standard model.</p>
          </div>
        </section>

        <section id="new-directions" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>8. 1976 Foundation & New Directions</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Diffie and Hellman's landmark 1976 paper "New Directions in Cryptography" restructured digital security by outlining the critical barriers of physical key distribution in burgeoning data networks.</p>
            <p>The paper formalized two paramount architectures:</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Privacy:</strong> Splitting operations into encryption (<i>E</i>) and decryption (<i>D</i>) families where finding <i>D</i> from public <i>E</i> is computationally infeasible.</li>
              <li><strong>One-Way Authentication:</strong> Solving digital signatures using trap-door one-way functions, which are cheap to calculate forward but impossible to invert without the private trap-door parameters.</li>
            </ul>
            <p className="mt-4">Moving past historical empirical certification, they linked cryptography directly to Computational Complexity theory, establishing that cryptanalysis is fundamentally an NP-complete problem, and pioneered the use of problems like the Knapsack Problem for designing secure ciphers.</p>
          </div>
        </section>
      </>
    ),
    kk: (
      <>
        <header className="mb-10">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${t.h1}`}>Диффи-Хеллман алгоритмі <span className="text-indigo-500">(DH)</span></h1>
          <p className="text-lg opacity-80">{mainDesc.kk}</p>
        </header>

        <section id="history" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>1. Кіріспе және Құрылу тарихы</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Диффи-Хеллман (DH) кілттермен алмасу хаттамасы — ашық, қорғалмаған байланыс арнасы арқылы симметриялық криптографиялық кілтті қауіпсіз генерациялаудың математикалық әдісі болып табылады. Тарихи тұрғыдан алғанда, екі тарап арасындағы қорғалған байланыс кілттерді сенімді курьерлер арқылы физикалық түрде тасымалдауды талап ететін.</p>
            <p>Бұл алгоритмді 1976 жылы Уитфилд Диффи мен Мартин Хеллман жариялады, бұл жабық және ашық кілттер идеясын ұсынған алғашқы жария жұмыс болды. Алайда, 2006 жылы Хеллман Ральф Мерклдің асимметриялық криптографияға қосқан зор үлесін мойындау үшін бұл хаттаманы «Диффи-Хеллман-Меркл алмасуы» деп атауды ұсынды. АҚШ-тың 4200770 патенті үш зерттеушіні де өнертапқыш ретінде бекітеді.</p>
            <div className={`p-4 mt-4 rounded-xl border-l-4 ${t.boxBg} ${t.accent}`}>
              <strong>Тарихи дерек:</strong> Схема 1976 жылы жарияланғанымен, 1997 Mod жылы Ұлыбританияның GCHQ барлау агенттігінен Джеймс Эллис, Клиффорд Кокс және Малкольм Уильямсон бұл құпия тұжырымдаманы әлдеқайда ерте, 1969 жылы ашқаны белгілі болды.
            </div>
          </div>
        </section>

        <section id="analogy" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>2. Көрнекі түсінік (Бояулар аналогиясы)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Ашық кілттермен алмасудың негізгі мәнін үлкен сандардың орнына бояуларды араластыру мысалымен наглядно көрсетуге болады.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Қатысушылар (Алиса мен Боб) құпия емес бастапқы ортақ түсті таңдайды (мысалы, сары).</li>
              <li>Әрқайсысы өздеріне ғана мәлім құпия түсті таңдайды (Алиса — қызыл, Боб — көгілдір).</li>
              <li>Олар өз құпия түстерін ортақ сары түспен араластырады. Алисада қызғылт сары, Бобта ашық көк түс пайда болады.</li>
              <li>Олар осы қоспаларды ашық арна арқылы өзара алмасады.</li>
              <li>Соңында, әрқайсысы серіктесінен алған қоспаға өзінің жеке құпия түсін қосады.</li>
            </ol>
            <p>Нәтижесінде екі тарапта да пайда болған соңғы қоспа (сары-қоңыр түс) бір-біріне мүлдем ұқсас болып шығады. Арнаны тыңдап тұрған үшінші тарап (шабуылдаушы) тек сары, қызғылт сары және ашық көк түстерді ғана көре алады, бірақ қоспадан бастапқы құпия түстерді бөліп алу математикалық тұрғыдан мүмкін емес.</p>
          </div>
        </section>

        <section id="crypto-math" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>3. Математика және Криптография</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>RFC 7919 стандартында бекітілген хаттаманың түпнұсқалық нұсқасы (Finite Field Diffie-Hellman) целых сандардың мультипликативті тобын <i>p</i> модулі бойынша қолданады, мұндағы <i>p</i> — жай сан, ал <i>g</i> — <i>p</i> модулі бойынша алғашқы түбір (генератор). Бұл екі мән ортақ құпияның 1-ден <i>p-1</i>-ге дейінгі кез келген мәнді қабылдауы үшін таңдалады.</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">Есептеу кезеңдері:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Алиса мен Боб ортақ <i>p</i> және <i>g</i> параметрлерін бекітеді.</li>
              <li>Алиса құпия <i>a</i> санын таңдап, Бобқа ашық кілтті жібереді: <i>A = g<sup>a</sup> mod p</i>.</li>
              <li>Боб құпия <i>b</i> санын таңдап, Алисаға жібереді: <i>B = g<sup>b</sup> mod p</i>.</li>
              <li>Алиса соңғы құпияны есептейді: <i>s = B<sup>a</sup> mod p</i>.</li>
              <li>Боб соңғы құпияны есептейді: <i>s = A<sup>b</sup> mod p</i>.</li>
            </ul>
            
            <p className="mt-4">Модульдік арифметика ережелеріне сәйкес екі нәтиже де тең болады: <i>s = (g<sup>b</sup> mod p)<sup>a</sup> mod p = (g<sup>a</sup> mod p)<sup>b</sup> mod p = g<sup>ab</sup> mod p</i>. Тек <i>a</i> және <i>b</i> мәндері ғана құпия сақталады. Ашық мәндерден құпия кілтті табу есептеу тұрғысынан өте күрделі және ол дискретті логарифмдеу есебі (DLP) деп аталады. Іс жүзінде <i>g</i> үшін 2 немесе 5 сияқты шағын сандар қолданылады.</p>
          </div>
        </section>

        <section id="variants" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>4. Кілттердің нұсқалары: Эфемерлі, Статикалық кілттер және 3-DH</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>DH хаттамасындағы кілттер эфемерлі (бір реттік) немесе статикалық (ұзақ мерзімді) болуы мүмкін. Олардың үйлесімі әртүрлі қауіпсіздік қасиеттерін береді (NIST SP 800-56A стандарты):</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Эфемерлі-Эфемерлі:</strong> Көбінесе сессиялық кілттерді келісуде қолданылады (DHE). Кемшілігі — аутентификацияның жоқтығы, бірақ артықшылығы — мінсіз тікелей құпиялылықты (forward secrecy) қамтамасыз етеді, өйткені кілттер сессия аяқталған бойда жойылады.</li>
              <li><strong>Статикалық-Статикалық:</strong> Ұзақ мерзімді ортақ құпияны құрады. Жасырын аутентификацияны береді, бірақ қайталау шабуылдарына (replay attacks) қарсы тұра алмайды.</li>
              <li><strong>Эфемерлі-Статикалық:</strong> ElGamal немесе IES жүйелерінде қолданылады. Біржақты аутентификацияны қамтамасыз етеді.</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-2">Triple Diffie-Hellman (3-DH) және X3DH</h3>
            <p>1997 жылы ұсынылған Triple DH жүйесінде тараптар статикалық (<i>a, b</i>) және эфемерлі (<i>x, y</i>) кілттерді бір уақытта қолданады: <i>K = KDF(g<sup>xy</sup>, g<sup>xb</sup>, g<sup>ya</sup>, A, B)</i>. Бұл бағыт одан әрі дамып, Signal мессенджерінің негізі болып табылатын <strong>Extended Triple DH (X3DH)</strong> хаттамасына айналды, ол эллипстік қисықтарда жұмыс істейді және авторлықты криптографикалық түрде жоққа шығару (deniability) мүмкіндігін береді.</p>
          </div>
        </section>

        <section id="multiparty" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>5. Топтық DH (3 немесе одан көп қатысушы)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>DH хаттамасын кез келген қатысушылар санына масштабтауға болады. Негізгі шарт: бастапқы <i>g</i> мәні әр қатысушының жеке құпия дәрежесіне кез келген ретпен бір реттен көтерілуі тиіс. Ең соңғы дәрежелеуді орындаған пайдаланушы желіге ешқашан шықпайтын дайын құпия кілтті алады.</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Сақиналық әдіс:</strong> Аралық мәндер шеңбер бойымен беріледі. Қарапайым, бірақ тиімсіз, өйткені әрбір <i>N</i> қатысушыдан дәл <i>N</i> рет дәрежелеуді талап етеді.</li>
              <li><strong>"Бөліп ал да, билей бер" әдісі:</strong> Кілттерді дубликациялау арқылы операциялар санын әр қатысушы үшін <i>log<sub>2</sub>(N) + 1</i> деңгейіне дейін азайтады. Мысалы, 8 адам үшін топтар параллельді түрде <i>g<sup>abcd</sup></i> және <i>g<sup>efgh</sup></i> мәндерін есептеп, өзара алмасады және соңғы құпияға 8 қадамның орнына 4 қадамда қол жеткізеді.</li>
            </ol>
          </div>
        </section>

        <section id="security" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>6. Қауіпсіздік, Осалдықтар және Шабуылдар</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">"Ортадағы адам" шабуылы (Man-in-the-Middle, MitM)</h4>
              <p>Түпнұсқа DH-да аутентификация қарастырылмаған. Белсенді шабуылдаушы (Мэллори) кілттерді алмасу сәтінде араға түсіп, Алисамен де, Бобпен де бөлек сессия орната алады. Ол хабарламаларды шифрдан шешіп, қайта шифрлап отырады. Бұған жол бермеу үшін DH міндетті түрде цифрлық қолтаңбамен (IKE немесе STS хаттамаларындағыдай) бірге қолданылады.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Интернет-трафикке Logjam шабуылы</h4>
              <p>Дискретті логарифмді бұзудың ең тиімді классикалық әдісі — "Сандық өріс елегі" алгоритмі (NFS). Оның алғашқы үш қадамы тек <i>p</i> модуліне ғана тәуелді. Көптеген интернет серверлері жылдар бойы стандартты 512-биттік жай сандарды (экспорттық шифрлар) қолданған болып шықты.</p>
              <p>Ауқымды алдын ала есептеулерді орындау арқылы хакерлер жеке сессияларды бір минутта бұзу мүмкіндігіне ие болды. 1024-биттік модульді алдын ала есептеу шамамен 100 млн долларды талап етеді, бұл ұлттық барлау агенттіктерінің (мысалы, АҚШ ҰҚА) бюджетіне толықтай сәйкес келеді. Қазіргі уақытта <i>p</i> ұзындығын кем дегенде 2048 бит етіп таңдау қатаң талап етіледі.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Қызмет көрсетуден бас тарту (DoS) және D(HE)at</h4>
              <p>CVE-2002-20001 осалдығы D(HE)at шабуылын сипаттайды, мұнда шабуылдаушы серверге ашық кілттердің орнына жалған кездейсоқ сандарды жібереді. Бұл серверді ешқандай пайдасы жоқ модульдік дәрежелеу амалдарына үлкен процессорлық қуат жұмсауға мәжбүрлеп, жүйені істен шығарады.</p>
            </div>

            <div className={`p-5 rounded-2xl mb-6 border ${t.boxBg}`}>
              <h4 className="font-bold mb-2">Кванттық компьютерлер қаупі</h4>
              <p>Кванттық компьютерлер Шор алгоритмін қолдану арқылы дискретті логарифмдеу және факторизация есептерін полиномиалды уақытта шешіп, классикалық асимметриялық криптографияны толықтай жоя алады. Бұған қарсы тұру үшін 2023 жылы X25519 эллипстік қисығы мен CRYSTALS-Kyber торлы құрылымдық хаттамасын біріктіретін посткванттық нұсқалар ұсынылды.</p>
            </div>
          </div>
        </section>

        <section id="formal-proofs" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.kk}`}>7. Қалыпты қауіпсіздік дәлелдемелері (PCL)</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>DH негізіндегі күрделі желілік стандарттардың (IPSEC IKEv2 және Kerberos сияқты) сенімділігі Протоколдар Композициясының Логикасы (PCL) арқылы ықтималды полиномиалды Тьюринг машиналарында математикалық тұрғыдан дәлелденеді.</p>
            
            <h3 className="text-xl font-bold mt-6 mb-2">Құпиялылық предикаттары: DHSecretive және DHStrongSecretive</h3>
            <p>Қауіпсіздікті қалыптастыру үшін PCL логикасы екі маңызды предикатты енгізеді:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>DHSecretive(X, Y, k):</strong> Кілттердің жасалғанын білдіреді, бірақ байланысты кілттердегі шабуылдардың теориялық ықтималдығын қалдырады, бұл жағдайда қауіпсіздікті толық дәлелдеу үшін Кездейсоқ Оракул Моделі (Random Oracle Model) қажет болады.</li>
              <li><strong>DHStrongSecretive(X, Y, k):</strong> Екі тараптың да ортақ құпияны есептеу үшін <i>тек қана</i> бір-бірінің нақты DH мәндерін пайдаланғанын қамтамасыз ететін қатаң шарт. Бұл кездейсоқ оракулдарсыз-ақ стандартты модельде IND-CCA қасиетін толық дәлелдеуге мүмкіндік береді.</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-2">Kerberos (DHINIT) және IKEv2 хаттамаларын аудиттеу</h3>
            <p>Логикалық талдау Kerberos (DHINIT) хаттамасының бірінші кезеңінде кемшілікті анықтады: аутентификация сервері (KAS) бірінші кезеңнен кейін клиент тарапынан толық аутентификацияланбайды, себебі клиент шифрланған TGT билетін сервердің ұзақ мерзімді кілтісіз аша алмайды. Бұл ақаулықты түзету үшін KAS өз цифрлық қолтаңбасының ішіне клиенттің идентификаторын енгізуі қажет. Ал IKEv2 хаттамасында тараптар өздерінің де, серіктесінің де DH мәндерін қолтаңбамен бекітуге міндетті, бұл DHStrongSecretive шартын бірден орындайды.</p>
          </div>
        </section>

        <section id="new-directions" className="scroll-mt-28">
          <h2 className={`text-3xl font-bold mb-6 border-b pb-2 ${t.h2}`}>8. 1976 жылғы іргетас және Жаңа бағыттар</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            <p>Уитфилд Диффи мен Мартин Хеллманның "New Directions in Cryptography" (1976) атты тарихи еңбегі деректер желісіндегі физикалық кілттерді таратудың шектеулерін көрсете отырып, заманауи ақпараттық қауіпсіздіктің негізін қалады.</p>
            <p>Мақала екі негізгі архитектураны айқындады:</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Құпиялылық (Privacy):</strong> Операцияларды шифрлау (<i>E</i>) және шифрдан шешу (<i>D</i>) отбасыларына бөлу, мұнда ашық <i>E</i> мәнінен жабық <i>D</i> кілтін табу есептеу тұрғысынан мүмкін емес.</li>
              <li><strong>Біржақты аутентификация (One-way Authentication):</strong> Электрондық құжаттар мен цифрлық қолтаңбаларды құпия есігі бар біржақты функциялар (Trap-door one-way functions) арқылы шешу. Оларды тура бағытта есептеу оңай, бірақ жабық кілтсіз кері айналдыру мүмкін емес.</li>
            </ul>
            <p className="mt-4">Бұрын қауіпсіздік тек криптоаналитиктердің εμπпирикалық шабуылдарымен ғана тексерілетін. Диффи мен Хеллман криптографияны алғаш рет Есептеу күрделілігі теориясымен (Computational Complexity) байланыстырды, криптоанализдің NP-толық есеп екенін дәлелдеді және қауіпсіз шифрларды жасау үшін Рюкзак есебі (Knapsack problem) сияқты күрделі мәселелерді қолдануды ұсынды.</p>
          </div>
        </section>
      </>
    )
  };

  return (
    <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-4 md:p-8 font-sans ${t.text}`}>
      
      {/* ВИКИ-НАВИГАЦИЯ СБОКУ */}
      <nav className={`hidden lg:block w-1/4 shrink-0 sticky top-28 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border p-5 backdrop-blur-xl ${t.navBg}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 border-b pb-2 ${isLight ? 'text-slate-400 border-slate-200' : 'text-slate-600 border-slate-800'}`}>
          {navTitle[lang] || navTitle.ru}
        </h3>
        <ul className="space-y-1">
          {currentSections.map(sec => (
            <li key={sec.id}>
              <a 
                href={`#${sec.id}`}
                className={`block px-3 py-2 rounded-r-lg border-l-2 transition-all text-sm ${activeSection === sec.id ? t.navActive : `border-transparent ${t.navText}`}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sec.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {sec.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="w-full lg:w-3/4 space-y-12 pb-32">
        {content[lang] || content.ru}
      </div>

    </div>
  );
};