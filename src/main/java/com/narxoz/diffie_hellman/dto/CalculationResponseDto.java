package com.narxoz.diffie_hellman.dto;

import java.math.BigInteger;

/**
 * DTO для возврата результата математической операции.
 */
public class CalculationResponseDto {
    private BigInteger result;
    private String stepDescription;

    public CalculationResponseDto(BigInteger result, String stepDescription) {
        this.result = result;
        this.stepDescription = stepDescription;
    }

    public BigInteger getResult() { return result; }
    public void setResult(BigInteger result) { this.result = result; }
    public String getStepDescription() { return stepDescription; }
    public void setStepDescription(String stepDescription) { this.stepDescription = stepDescription; }
}