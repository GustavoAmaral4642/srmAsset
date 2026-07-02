import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '@core/models/api-error.model';

/**
 * Interceptor funcional para tratamento global de erros HTTP
 * 
 * Intercepta todas as respostas de erro da API e:
 * - Identifica erros da API (formato ApiErrorResponse)
 * - Formata erros de rede/cliente
 * - Loga erros no console para debug
 * 
 * @example
 * // Registrado em app.config.ts
 * provideHttpClient(withInterceptors([errorInterceptor]))
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        // Erro do cliente (rede, etc)
        errorMessage = `Erro de conexão: ${error.error.message}`;
        console.error('🔴 Client-side error:', error.error.message);
      } else if (error.error && isApiError(error.error)) {
        // Erro da API (formato padronizado)
        const apiError = error.error as ApiErrorResponse;
        errorMessage = apiError.message;

        // Se houver erros de validação de campos, concatenar
        if (apiError.fieldErrors && apiError.fieldErrors.length > 0) {
          const fieldMessages = apiError.fieldErrors
            .map(fe => `${fe.field}: ${fe.message}`)
            .join(', ');
          errorMessage = `${apiError.message} - ${fieldMessages}`;
        }

        // Log detalhado para debug
        console.error(
          `🔴 API Error [${apiError.errorCode}] ${apiError.path}:`,
          {
            status: apiError.status,
            message: apiError.message,
            fieldErrors: apiError.fieldErrors,
            traceId: apiError.traceId
          }
        );
      } else {
        // Erro HTTP genérico
        errorMessage = getHttpErrorMessage(error.status);
        console.error(`🔴 HTTP ${error.status} error:`, errorMessage);
      }

      // Aqui você pode adicionar notificações toast/snackbar
      // Ex: this.toastr.error(errorMessage, 'Erro');

      return throwError(() => error);
    })
  );
};

/**
 * Verifica se o erro está no formato ApiErrorResponse
 */
function isApiError(error: any): error is ApiErrorResponse {
  return (
    error &&
    typeof error.errorCode === 'string' &&
    typeof error.message === 'string' &&
    typeof error.status === 'number'
  );
}

/**
 * Retorna mensagem amigável baseada no status HTTP
 */
function getHttpErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Requisição inválida',
    401: 'Não autenticado',
    403: 'Acesso negado',
    404: 'Recurso não encontrado',
    409: 'Conflito - recurso foi modificado',
    422: 'Erro de validação',
    500: 'Erro interno do servidor',
    502: 'Serviço indisponível',
    503: 'Serviço temporariamente indisponível'
  };
  
  return messages[status] || `Erro HTTP ${status}`;
}
