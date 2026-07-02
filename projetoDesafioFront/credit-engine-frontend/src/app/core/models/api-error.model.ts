/**
 * Modelo de erro padrão retornado pela API
 * Baseado no formato do Spring Boot Global Exception Handler
 */
export interface ApiErrorResponse {
  /**
   * Timestamp do erro (ISO 8601)
   */
  timestamp: string;

  /**
   * HTTP status code (400, 404, 500, etc)
   */
  status: number;

  /**
   * Código de erro customizado da aplicação
   * Ex: "VALIDATION_ERROR", "BUSINESS_ERROR", "NOT_FOUND"
   */
  errorCode: string;

  /**
   * Mensagem legível para o usuário
   */
  message: string;

  /**
   * Endpoint que gerou o erro
   */
  path: string;

  /**
   * Erros de validação de campos (opcional)
   */
  fieldErrors?: FieldError[];

  /**
   * Trace ID para rastreamento (opcional)
   */
  traceId?: string;
}

/**
 * Erro específico de um campo (validação)
 */
export interface FieldError {
  /**
   * Nome do campo com erro
   */
  field: string;

  /**
   * Mensagem de erro do campo
   */
  message: string;

  /**
   * Valor que foi rejeitado
   */
  rejectedValue: unknown;
}
