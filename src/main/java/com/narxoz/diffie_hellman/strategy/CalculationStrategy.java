package com.narxoz.diffie_hellman.strategy;

import java.math.BigInteger;

/**
 * Общий интерфейс для всех стратегий вычисления.
 */
public interface CalculationStrategy {
    BigInteger calculate(BigInteger base, BigInteger privateKey, BigInteger p);
    String getStepName();
}