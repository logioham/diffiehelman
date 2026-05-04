package com.narxoz.diffie_hellman.service;

import com.narxoz.diffie_hellman.dto.DhParametersDto;
import com.narxoz.diffie_hellman.service.generator.PrimeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

/**
 * Сервис-фасад для координации математических операций и генерации.
 */
@Service
public class MathService {

    private final PrimeGenerator primeGenerator;

    @Autowired
    public MathService(PrimeGenerator primeGenerator) {
        this.primeGenerator = primeGenerator;
    }

    /**
     * Генерирует общие параметры для алгоритма (p и g).
     */
    public DhParametersDto generateParameters() {
        BigInteger p = primeGenerator.generatePrime();
        BigInteger g = primeGenerator.generatePrimitiveRoot(p);
        return new DhParametersDto(p, g);
    }
}