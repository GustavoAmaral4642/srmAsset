import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * Serviço base para comunicação HTTP com a API
 * Centraliza a configuração de URL base e métodos HTTP
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * URL base da API (vem do environment)
   */
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Requisição GET
   * @param path Caminho relativo do endpoint (ex: '/transactions')
   * @param params Parâmetros de query string (opcional)
   */
  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams });
  }

  /**
   * Requisição POST
   * @param path Caminho relativo do endpoint
   * @param body Corpo da requisição
   */
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  /**
   * Requisição PUT
   * @param path Caminho relativo do endpoint
   * @param body Corpo da requisição
   */
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  /**
   * Requisição PATCH
   * @param path Caminho relativo do endpoint
   * @param body Corpo da requisição (opcional)
   */
  patch<T>(path: string, body?: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body || {});
  }

  /**
   * Requisição DELETE
   * @param path Caminho relativo do endpoint
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }

  /**
   * Converte objeto de parâmetros em HttpParams
   * Remove valores undefined, null ou vazios
   * @private
   */
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
