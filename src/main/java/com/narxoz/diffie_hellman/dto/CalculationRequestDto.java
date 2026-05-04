package com.narxoz.diffie_hellman.dto;

import java.math.BigInteger;

/**
 * DTO для запроса на вычисление.
 * base - это 'g' (для публичного ключа), либо чужой публичный/промежуточный ключ.
 */
public class CalculationRequestDto {
    private BigInteger base;
    private BigInteger privateKey;
    private BigInteger p;

    public BigInteger getBase() { return base; }
    public void setBase(BigInteger base) { this.base = base; }
    
    public BigInteger getPrivateKey() { return privateKey; }
    public void setPrivateKey(BigInteger privateKey) { this.privateKey = privateKey; }
    
    public BigInteger getP() { return p; }
    public void setP(BigInteger p) { this.p = p; }
}