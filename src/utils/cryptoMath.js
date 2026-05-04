// src/utils/cryptoMath.js

// Быстрое возведение в степень по модулю: (base^exponent) % modulus
export const powerMod = (base, exponent, modulus) => {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = (result * base) % modulus;
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
};

// Генерация случайного приватного ключа (для демо используем небольшие числа, 
// чтобы студенты могли проверить калькулятором, но логика работает с любыми)
export const generatePrivateKey = () => {
  return BigInt(Math.floor(Math.random() * 100) + 10);
};