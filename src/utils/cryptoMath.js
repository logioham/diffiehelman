// Возведение в степень по модулю (Алгоритм быстрого возведения в степень)
export const powerMod = (base, exp, mod) => {
  if (!base || !exp || !mod) return null;
  try {
    let b = BigInt(base);
    let e = BigInt(exp);
    let m = BigInt(mod);
    
    if (m === 0n) return null;
    if (m === 1n) return "0";

    let result = 1n;
    b = b % m;

    while (e > 0n) {
      if (e % 2n === 1n) result = (result * b) % m;
      e = e / 2n;
      b = (b * b) % m;
    }
    return result.toString();
  } catch (err) {
    return null;
  }
};

// Проверка числа на простоту
export const isPrime = (num) => {
  const n = parseInt(num);
  if (isNaN(n) || n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

export const getNextPrime = (num) => {
  let n = parseInt(num);
  if (isNaN(n)) return 23;
  if (n <= 1) return 2;
  let prime = n;
  let found = false;
  while (!found) { prime++; if (isPrime(prime)) found = true; }
  return prime;
};

export const generatePrivateKey = () => {
  return Math.floor(Math.random() * 49) + 2; 
};

// === НОВАЯ НАУЧНАЯ МАТЕМАТИКА ===

// Поиск простых множителей числа (нужно для поиска корней)
const getPrimeFactors = (n) => {
  const factors = new Set();
  while (n % 2 === 0) { factors.add(2); n /= 2; }
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) { factors.add(i); n /= i; }
  }
  if (n > 2) factors.add(n);
  return Array.from(factors);
};

// Поиск ПЕРВООБРАЗНЫХ КОРНЕЙ для заданного простого числа P
// Поиск ПЕРВООБРАЗНЫХ КОРНЕЙ для заданного простого числа P
export const getPrimitiveRoots = (p) => {
  const pInt = parseInt(p);
  if (!isPrime(pInt)) return [];
  
  const roots = [];
  const phi = pInt - 1;
  const factors = getPrimeFactors(phi);

  // Ищем ВСЕ возможные корни (но ставим защиту от зависания на 5000 элементов)
  // Для любых учебных чисел (p до 10000) этот алгоритм найдет абсолютно все корни.
  for (let r = 2; r < pInt; r++) {
    let isRoot = true;
    for (let factor of factors) {
      if (powerMod(r, Math.floor(phi / factor), pInt) === "1") {
        isRoot = false;
        break;
      }
    }
    if (isRoot) {
      roots.push(r);
      if (roots.length >= 5000) break; // Скрытый предохранитель от краша браузера
    }
  }
  return roots;
};