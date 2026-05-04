package com.narxoz.diffie_hellman.strategy;

import org.springframework.stereotype.Component;
import java.math.BigInteger;

/**
 * Стратегия для вычисления итогового общего секрета (K).
 */
@Component("finalSecretStrategy")
public class FinalSecretStrategy implements CalculationStrategy {
    @Override
    public BigInteger calculate(BigInteger base, BigInteger privateKey, BigInteger p) {
        // base здесь - промежуточный ключ (для 3 участников) или публичный ключ (для 2 участников)
        return base.modPow(privateKey, p);
    }

    @Override
    public String getStepName() {
        return "Вычисление финального общего секрета (Этап 3)";
    }
}