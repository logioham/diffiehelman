 package com.narxoz.diffie_hellman.dto;

import java.math.BigInteger;

/**
 * DTO для передачи сгенерированных публичных параметров p и g.
 */
public class DhParametersDto {
    private BigInteger p;
    private BigInteger g;

    public DhParametersDto(BigInteger p, BigInteger g) {
        this.p = p;
        this.g = g;
    }

    public BigInteger getP() { return p; }
    public void setP(BigInteger p) { this.p = p; }
    public BigInteger getG() { return g; }
    public void setG(BigInteger g) { this.g = g; }
}