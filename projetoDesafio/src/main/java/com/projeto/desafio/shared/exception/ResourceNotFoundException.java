package com.projeto.desafio.shared.exception;

/**
 * Exceção lançada quando um recurso solicitado não é encontrado.
 */
public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String resource, Object id) {
        super(
            "RESOURCE_NOT_FOUND",
            String.format("%s não encontrado com identificador: %s", resource, id)
        );
    }

    public ResourceNotFoundException(String message) {
        super("RESOURCE_NOT_FOUND", message);
    }
}

