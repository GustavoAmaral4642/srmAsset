import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from '@core/interceptors/error.interceptor';

/**
 * Configuração principal da aplicação
 * 
 * Providers configurados:
 * - Router: Sistema de rotas
 * - HttpClient: Cliente HTTP com interceptor de erro global
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([errorInterceptor])
    )
  ]
};
