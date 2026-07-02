package com.projeto.desafio.shared.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Estrutura padrão de resposta de erro da API.
 * Segue boas práticas de RFC 7807 (Problem Details for HTTP APIs).
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    /**
     * Timestamp do erro
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime timestamp;

    /**
     * Código HTTP de status
     */
    private final int status;

    /**
     * Código de erro interno (ex: BUSINESS_ERROR, VALIDATION_ERROR)
     */
    private final String errorCode;

    /**
     * Mensagem legível para o usuário
     */
    private final String message;

    /**
     * Caminho da requisição que gerou o erro
     */
    private final String path;

    /**
     * Lista de erros de validação (quando aplicável)
     */
    private final List<FieldError> fieldErrors;

    /**
     * Trace ID para rastreamento (observabilidade)
     */
    private final String traceId;

    /**
     * Representa um erro de validação em um campo específico.
     */
    @Getter
    @Builder
    public static class FieldError {
        private final String field;
        private final String message;
        private final Object rejectedValue;
    }

    /**
     * Factory method para criar resposta de erro simples.
     */
    public static ApiErrorResponse of(int status, String errorCode, String message, String path) {
        return ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .errorCode(errorCode)
                .message(message)
                .path(path)
                .build();
    }

    /**
     * Factory method para criar resposta com erros de validação.
     */
    public static ApiErrorResponse ofValidation(String message, String path, List<FieldError> fieldErrors) {
        return ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(400)
                .errorCode("VALIDATION_ERROR")
                .message(message)
                .path(path)
                .fieldErrors(fieldErrors)
                .build();
    }
}

