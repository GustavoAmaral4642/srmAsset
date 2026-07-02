/**
 * Credit Engine - Angular Service Examples
 *
 * Exemplos de serviços e interceptors para integração
 * Adapte conforme a estrutura do seu projeto Angular
 *
 * @version 1.0.0
 * @date 2026-07-01
 */

// ============================================================================
// ENVIRONMENT CONFIG
// ============================================================================

// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// src/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://api.creditengine.com/api'
};


// ============================================================================
// ERROR INTERCEPTOR
// ============================================================================

// src/app/core/interceptors/error.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr'; // ou seu serviço de notificação

interface ApiErrorResponse {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  fieldErrors?: { field: string; message: string }[];
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  // constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';

        if (error.error instanceof ErrorEvent) {
          // Erro do cliente (rede, etc)
          errorMessage = `Erro de conexão: ${error.error.message}`;
        } else if (error.error && this.isApiError(error.error)) {
          // Erro da API (formato padronizado)
          const apiError = error.error as ApiErrorResponse;
          errorMessage = apiError.message;

          // Se houver erros de validação, concatenar
          if (apiError.fieldErrors && apiError.fieldErrors.length > 0) {
            const fieldMessages = apiError.fieldErrors
              .map(fe => `${fe.field}: ${fe.message}`)
              .join(', ');
            errorMessage = `${apiError.message} - ${fieldMessages}`;
          }

          // Log para debug
          console.error(`[${apiError.errorCode}] ${apiError.path}:`, apiError);
        } else {
          // Erro HTTP genérico
          errorMessage = this.getHttpErrorMessage(error.status);
        }

        // Notificar usuário
        // this.toastr.error(errorMessage, 'Erro');

        // Ou usar um serviço de notificação customizado
        console.error('API Error:', errorMessage);

        return throwError(() => error);
      })
    );
  }

  private isApiError(error: any): error is ApiErrorResponse {
    return error && typeof error.errorCode === 'string' && typeof error.message === 'string';
  }

  private getHttpErrorMessage(status: number): string {
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
}


// ============================================================================
// API SERVICE BASE
// ============================================================================

// src/app/core/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body?: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body || {});
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }

  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return httpParams;
  }
}


// ============================================================================
// EXCHANGE RATE SERVICE (Fase 2)
// ============================================================================

// src/app/features/currency/services/exchange-rate.service.ts

// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { ApiService } from 'src/app/core/services/api.service';

interface ExchangeRateRequest {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
}

interface ExchangeRateResponse {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private readonly path = '/exchange-rates';

  constructor(private api: ApiService) {}

  getAll(): Observable<ExchangeRateResponse[]> {
    return this.api.get<ExchangeRateResponse[]>(this.path);
  }

  getCurrentRate(from: string, to: string): Observable<ExchangeRateResponse> {
    return this.api.get<ExchangeRateResponse>(`${this.path}/current`, { from, to });
  }

  create(request: ExchangeRateRequest): Observable<ExchangeRateResponse> {
    return this.api.post<ExchangeRateResponse>(this.path, request);
  }
}


// ============================================================================
// PRICING SERVICE (Fase 3)
// ============================================================================

// src/app/features/pricing/services/pricing.service.ts

interface PricingRequest {
  faceValue: number;
  dueDate: string;
  receivableType: string;
  originalCurrency: string;
  settlementCurrency: string;
}

interface PricingResponse {
  faceValue: number;
  presentValue: number;
  discountValue: number;
  discountPercent: number;
  baseRate: number;
  spreadRate: number;
  totalRate: number;
  termDays: number;
  originalCurrency: string;
  settlementCurrency: string;
  exchangeRateUsed?: number;
  convertedValue?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private readonly path = '/pricing';

  constructor(private api: ApiService) {}

  simulate(request: PricingRequest): Observable<PricingResponse> {
    return this.api.post<PricingResponse>(`${this.path}/simulate`, request);
  }

  getReceivableTypes(): Observable<any[]> {
    return this.api.get<any[]>(`${this.path}/receivable-types`);
  }
}


// ============================================================================
// TRANSACTION SERVICE (Fase 4)
// ============================================================================

// src/app/features/transaction/services/transaction.service.ts

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

interface TransactionFilter {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
  cedentId?: number;
  currency?: string;
}

interface TransactionRequest {
  cedentId: number;
  receivableTypeId: number;
  faceValue: number;
  dueDate: string;
  originalCurrency: string;
  settlementCurrency: string;
}

interface TransactionResponse {
  id: string;
  faceValue: number;
  presentValue: number;
  status: string;
  createdAt: string;
  // ... outros campos
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly path = '/transactions';

  constructor(private api: ApiService) {}

  getAll(filter?: TransactionFilter): Observable<Page<TransactionResponse>> {
    return this.api.get<Page<TransactionResponse>>(this.path, filter);
  }

  getById(id: string): Observable<TransactionResponse> {
    return this.api.get<TransactionResponse>(`${this.path}/${id}`);
  }

  create(request: TransactionRequest): Observable<TransactionResponse> {
    return this.api.post<TransactionResponse>(this.path, request);
  }

  settle(id: string): Observable<TransactionResponse> {
    return this.api.patch<TransactionResponse>(`${this.path}/${id}/settle`);
  }

  cancel(id: string): Observable<TransactionResponse> {
    return this.api.patch<TransactionResponse>(`${this.path}/${id}/cancel`);
  }
}


// ============================================================================
// APP MODULE CONFIG
// ============================================================================

// src/app/app.module.ts (ou app.config.ts para standalone)

/*
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  imports: [
    HttpClientModule,
    // ...
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
*/


// ============================================================================
// STANDALONE CONFIG (Angular 17+)
// ============================================================================

// src/app/app.config.ts

/*
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([errorInterceptor])
    )
  ]
};
*/

