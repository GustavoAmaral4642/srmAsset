package com.projeto.desafio.shared.exception;

import lombok.Getter;

/**
 * Exceção base para erros de negócio da aplicação.
 * Todas as exceções de domínio devem estender esta classe.
 */
@Getter
public class BusinessException extends RuntimeException {

    private final String errorCode;
    private final transient Object[] args;

    public BusinessException(String message) {
        super(message);
        this.errorCode = "BUSINESS_ERROR";
        this.args = new Object[0];
    }

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.args = new Object[0];
    }

    public BusinessException(String errorCode, String message, Object... args) {
        super(message);
        this.errorCode = errorCode;
        this.args = args;
    }

    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.args = new Object[0];
    }
}

