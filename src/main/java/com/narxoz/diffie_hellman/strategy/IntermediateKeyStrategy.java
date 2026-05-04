package com.narxoz.diffie_hellman.strategy;

import org.springframework.stereotype.Component;
import java.math.BigInteger;

/**
 * Стратегия для вычисления промежуточного ключа в алгоритме для 3 участников.
 * Например: (g^a)^b mod p
 */
@Component("intermediateKeyStrategy")
public class IntermediateKeyStrategy implements CalculationStrategy {
    @Override
    public BigInteger calculate(BigInteger base, BigInteger privateKey, BigInteger p) {
        // base здесь - публичный ключ другого участника
        return base.modPow(privateKey, p);
    }

    @Override
    public String getStepName() {
        return "Генерация промежуточного ключа (Этап 2 для 3-х участников)";
    }
}