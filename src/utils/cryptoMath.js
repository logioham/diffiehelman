// Быстрое возведение в степень по модулю: (base^exponent) % modulus
export const powerMod = (baseStr, exponentStr, modulusStr) => {
  try {
    let base = BigInt(baseStr);
    let exponent = BigInt(exponentStr);
    let modulus = BigInt(modulusStr);
    
    if (modulus === 1n) return "0";
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) result = (result * base) % modulus;
      exponent = exponent / 2n;
      base = (base * base) % modulus;
    }
    return result.toString();
  } catch (e) {
    return null;
  }
};

// Проверка числа на простоту
export const isPrime = (numStr) => {
  try {
    let n = BigInt(numStr);
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;
    for (let i = 5n; i * i <= n; i += 6n) {
      if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
  } catch { return false; }
};

// Поиск ближайшего простого числа (для подсказок пользователю)
export const getNextPrime = (numStr) => {
  try {
    let n = BigInt(numStr) + 1n;
    while (!isPrime(n.toString())) n++;
    return n.toString();
  } catch { return "23"; }
};

// Генератор случайного ключа (для кнопки "Сгенерировать")
export const generatePrivateKey = () => {
  return BigInt(Math.floor(Math.random() * 50) + 5).toString();
};