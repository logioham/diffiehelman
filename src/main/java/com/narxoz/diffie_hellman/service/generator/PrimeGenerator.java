package com.narxoz.diffie_hellman.service.generator;

import org.springframework.stereotype.Component;
import java.math.BigInteger;
import java.security.SecureRandom;

/**
 * Класс, отвечающий за криптографически стойкую генерацию чисел.
 */
@Component
public class PrimeGenerator {
    
    private final SecureRandom random = new SecureRandom();
    // Используем длину в 512 бит для учебных целей (достаточно большое, но быстро считается)
    private static final int BIT_LENGTH = 512; 

    /**
     * Генерирует большое простое число p.
     */
    public BigInteger generatePrime() {
        // В реальной криптографии используется безопасное простое число (Safe Prime),
        // но для образовательного демо достаточно probablePrime.
        return BigInteger.probablePrime(BIT_LENGTH, random);
    }

    /**
     * Возвращает первообразный корень g по модулю p.
     * Для упрощения демо-версии возвращаем надежное дефолтное значение или небольшое простое число.
     * (В реальных системах, таких как IPsec, часто используют 2 или 5).
     */
    public BigInteger generatePrimitiveRoot(BigInteger p) {
        // Для учебного проекта и алгоритма Диффи-Хеллмана g=2 является популярным и рабочим значением, 
        // если p сгенерировано корректно. 
        return BigInteger.valueOf(2); 
    }
}