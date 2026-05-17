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
      if (e % 2n === 1n) {
        result = (result * b) % m;
      }
      e = e / 2n;
      b = (b * b) % m;
    }
    return result.toString();
  } catch (err) {
    return null;
  }
};

// Проверка числа на простоту (Тест простоты)
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

// Поиск ближайшего простого числа (если пользователь ввел составное)
export const getNextPrime = (num) => {
  let n = parseInt(num);
  if (isNaN(n)) return 23;
  if (n <= 1) return 2;
  let prime = n;
  let found = false;
  while (!found) {
    prime++;
    if (isPrime(prime)) found = true;
  }
  return prime;
};

// НОВАЯ ФУНКЦИЯ ДЛЯ КНОПКИ КУБИКА 🎲 (Генерация приватного ключа)
export const generatePrivateKey = () => {
  // Генерируем случайное число от 2 до 50
  return Math.floor(Math.random() * 49) + 2; 
};