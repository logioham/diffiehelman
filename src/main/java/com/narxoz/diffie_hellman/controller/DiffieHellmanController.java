package com.narxoz.diffie_hellman.controller;

import com.narxoz.diffie_hellman.dto.CalculationRequestDto;
import com.narxoz.diffie_hellman.dto.CalculationResponseDto;
import com.narxoz.diffie_hellman.dto.DhParametersDto;
import com.narxoz.diffie_hellman.service.MathService;
import com.narxoz.diffie_hellman.strategy.CalculationStrategy;
import com.narxoz.diffie_hellman.strategy.StrategyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

/**
 * REST-контроллер для предоставления API фронтенду.
 */
@RestController
@RequestMapping("/api/dh")
@CrossOrigin(origins = "*") // Разрешаем запросы с любого фронтенда
public class DiffieHellmanController {

    private final MathService mathService;
    private final StrategyFactory strategyFactory;

    @Autowired
    public DiffieHellmanController(MathService mathService, StrategyFactory strategyFactory) {
        this.mathService = mathService;
        this.strategyFactory = strategyFactory;
    }

    /**
     * Эндпоинт 1: Получить начальные параметры P и G.
     */
    @GetMapping("/parameters")
    public ResponseEntity<DhParametersDto> getParameters() {
        return ResponseEntity.ok(mathService.generateParameters());
    }

    /**
     * Эндпоинт 2: Пошаговое вычисление.
     * @param step может быть: "publicKeyStrategy", "intermediateKeyStrategy", "finalSecretStrategy"
     */
    @PostMapping("/calculate/{step}")
    public ResponseEntity<CalculationResponseDto> calculate(
            @PathVariable String step,
            @RequestBody CalculationRequestDto request) {
        
        // 1. Получаем нужную стратегию через фабрику
        CalculationStrategy strategy = strategyFactory.getStrategy(step);
        
        // 2. Выполняем математическое действие (base^privateKey mod p)
        BigInteger result = strategy.calculate(request.getBase(), request.getPrivateKey(), request.getP());
        
        // 3. Формируем ответ
        CalculationResponseDto response = new CalculationResponseDto(result, strategy.getStepName());
        
        return ResponseEntity.ok(response);
    }
}