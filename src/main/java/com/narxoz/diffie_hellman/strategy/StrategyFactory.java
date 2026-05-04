package com.narxoz.diffie_hellman.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Map;

/**
 * Фабрика для получения нужной стратегии вычислений по её типу.
 * Демонстрирует паттерн Factory.
 */
@Component
public class StrategyFactory {
    
    private final Map<String, CalculationStrategy> strategies;

    @Autowired
    public StrategyFactory(Map<String, CalculationStrategy> strategies) {
        this.strategies = strategies;
    }

    public CalculationStrategy getStrategy(String strategyType) {
        CalculationStrategy strategy = strategies.get(strategyType);
        if (strategy == null) {
            throw new IllegalArgumentException("Неизвестный тип стратегии вычисления: " + strategyType);
        }
        return strategy;
    }
}