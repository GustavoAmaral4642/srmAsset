package com.projeto.desafio.shared.exception;

/**
 * Exceção lançada quando há conflito de concorrência (Optimistic Locking).
 * Indica que outro usuário/processo modificou o recurso simultaneamente.
 */
public class ConcurrencyConflictException extends BusinessException {

    public ConcurrencyConflictException(String resource) {
        super(
            "CONCURRENCY_CONFLICT",
            String.format("Conflito de concorrência ao atualizar %s. O recurso foi modificado por outro processo.", resource)
        );
    }

    public ConcurrencyConflictException(String resource, Object id) {
        super(
            "CONCURRENCY_CONFLICT",
            String.format("Conflito de concorrência ao atualizar %s com id %s. Tente novamente.", resource, id)
        );
    }
}

