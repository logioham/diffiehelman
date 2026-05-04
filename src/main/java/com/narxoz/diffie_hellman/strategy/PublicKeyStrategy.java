package com.narxoz.diffie_hellman.strategy;

import org.springframework.stereotype.Component;
import java.math.BigInteger;

/**
 * Стратегия для вычисления публичного ключа (например, A = g^a mod p).
 */
@Component("publicKeyStrategy")
public class PublicKeyStrategy implements CalculationStrategy {
    @Override
    public BigInteger calculate(BigInteger base, BigInteger privateKey, BigInteger p) {
        // base здесь выступает в роли генератора 'g'
        return base.modPow(privateKey, p);
    }

    @Override
    public String getStepName() {
        return "Генерация публичного ключа (Этап 1)";
    }
}