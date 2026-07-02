# 📘 Etapa 1: Core - Fundação HTTP

> **Data:** 2026-07-01  
> **Versão Angular:** 17.3.2  
> **Status:** ✅ Concluída

---

## 🎯 Objetivo

Criar a camada base de comunicação HTTP com a API backend, incluindo:
- Serviço centralizado para requisições HTTP
- Interceptor global para tratamento de erros
- Modelos de erro padronizados

Esta é a **fundação mínima** necessária para que qualquer domínio (Currency, Pricing, Transaction) possa se comunicar com a API.

---

## 📁 Arquivos Criados

### Estrutura

```
src/app/core/
├── models/
│   └── api-error.model.ts          ✅ Interfaces de erro
├── services/
│   └── api.service.ts              ✅ Serviço HTTP base
└── interceptors/
    └── error.interceptor.ts        ✅ Interceptor de erro global

src/app/
└── app.config.ts                   ✅ Modificado (HttpClient + Interceptor)
```

**Total:** 3 arquivos novos + 1 modificado = **4 arquivos**  
**LOC:** ~165 linhas

---

## 📄 Detalhamento dos Arquivos

### 1. `api-error.model.ts` - Modelos de Erro

**Localização:** `src/app/core/models/api-error.model.ts`

#### Interface `ApiErrorResponse`

Representa o formato de erro retornado pelo backend Spring Boot:

```typescript
interface ApiErrorResponse {
  timestamp: string;      // ISO 8601
  status: number;         // HTTP status code
  errorCode: string;      // Código customizado (ex: "VALIDATION_ERROR")
  message: string;        // Mensagem legível
  path: string;           // Endpoint que gerou erro
  fieldErrors?: FieldError[];  // Erros de validação (opcional)
  traceId?: string;       // ID para rastreamento (opcional)
}
```

#### Interface `FieldError`

Detalha erros de validação de campos:

```typescript
interface FieldError {
  field: string;          // Nome do campo
  message: string;        // Mensagem de erro
  rejectedValue: unknown; // Valor rejeitado
}
```

**Por que isso é importante?**
- ✅ Tipagem forte dos erros
- ✅ Compatível com formato do backend
- ✅ Facilita debugging e tratamento de erros

---

### 2. `api.service.ts` - Serviço HTTP Base

**Localização:** `src/app/core/services/api.service.ts`

Serviço centralizado para todas as requisições HTTP.

#### Responsabilidades

1. **Centralizar URL base** da API (vem do `environment`)
2. **Métodos HTTP** prontos para uso (GET, POST, PUT, PATCH, DELETE)
3. **Construção de query params** automática

#### Métodos Públicos

| Método | Assinatura | Descrição |
|--------|-----------|-----------|
| `get<T>` | `(path, params?)` | Requisição GET com query params opcionais |
| `post<T>` | `(path, body)` | Requisição POST com body |
| `put<T>` | `(path, body)` | Requisição PUT com body |
| `patch<T>` | `(path, body?)` | Requisição PATCH com body opcional |
| `delete<T>` | `(path)` | Requisição DELETE |

#### Exemplo de Uso

```typescript
// Em um service de domínio
constructor(private api: ApiService) {}

// GET com query params
getTransactions(page: number, size: number) {
  return this.api.get<Page<Transaction>>('/transactions', { page, size });
}

// POST com body
createTransaction(data: TransactionRequest) {
  return this.api.post<TransactionResponse>('/transactions', data);
}

// PATCH sem body
settleTransaction(id: string) {
  return this.api.patch<TransactionResponse>(`/transactions/${id}/settle`);
}
```

#### Funcionalidade `buildParams`

Remove valores `undefined`, `null` ou vazios dos query params:

```typescript
// Input
{ page: 0, size: 20, status: undefined, name: '' }

// Output (HttpParams)
?page=0&size=20
```

**Por que isso é importante?**
- ✅ Evita duplicação de código
- ✅ URL base configurável por ambiente
- ✅ Query params limpos automaticamente
- ✅ Tipagem genérica para responses

---

### 3. `error.interceptor.ts` - Interceptor de Erro

**Localização:** `src/app/core/interceptors/error.interceptor.ts`

Interceptor funcional (Angular 17+) que captura **todos** os erros HTTP.

#### Fluxo de Tratamento

```
Requisição HTTP
    ↓
Backend retorna erro
    ↓
Interceptor captura HttpErrorResponse
    ↓
┌─────────────────────────────────────┐
│ Tipo de Erro?                       │
├─────────────────────────────────────┤
│ • ErrorEvent → Erro de rede/cliente │
│ • ApiErrorResponse → Erro da API    │
│ • Outro → Erro HTTP genérico        │
└─────────────────────────────────────┘
    ↓
Formata mensagem amigável
    ↓
Loga no console para debug
    ↓
Re-lança erro (throwError)
```

#### Cenários Tratados

**1. Erro de Cliente/Rede**
```typescript
// Ex: Sem internet, timeout
Erro de conexão: Failed to fetch
```

**2. Erro da API (formato padrão)**
```typescript
// Ex: Validação falhou
🔴 API Error [VALIDATION_ERROR] /api/transactions:
{
  status: 422,
  message: "Dados inválidos",
  fieldErrors: [
    { field: "faceValue", message: "Deve ser maior que zero" }
  ]
}
```

**3. Erro HTTP Genérico**
```typescript
// Ex: 404, 500
🔴 HTTP 404 error: Recurso não encontrado
```

#### Mensagens Amigáveis

| Status | Mensagem |
|--------|----------|
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 409 | Conflito - recurso foi modificado |
| 422 | Erro de validação |
| 500 | Erro interno do servidor |
| 502 | Serviço indisponível |
| 503 | Serviço temporariamente indisponível |

**Por que isso é importante?**
- ✅ Tratamento centralizado (não repetir em cada service)
- ✅ Logs estruturados para debug
- ✅ Mensagens amigáveis para o usuário
- ✅ Compatível com formato do backend

---

### 4. `app.config.ts` - Configuração Global (Modificado)

**Localização:** `src/app/app.config.ts`

#### Mudanças Aplicadas

**Antes:**
```typescript
providers: [
  provideRouter(routes)
]
```

**Depois:**
```typescript
providers: [
  provideRouter(routes),
  provideHttpClient(
    withInterceptors([errorInterceptor])  // ← Adicionado
  )
]
```

#### O que foi registrado?

1. **`provideHttpClient`**: Habilita `HttpClient` em toda aplicação
2. **`withInterceptors([errorInterceptor])`**: Registra interceptor funcional

**Por que isso é importante?**
- ✅ HttpClient disponível para injeção em qualquer service
- ✅ Interceptor aplica-se automaticamente a todas as requisições
- ✅ Pattern funcional (Angular 17+) ao invés de classes

---

## 🔧 Conceitos Técnicos

### Path Aliases em Ação

Todos os arquivos usam os aliases configurados na Etapa 0:

```typescript
// ✅ Com alias
import { environment } from '@environments/environment';
import { ApiErrorResponse } from '@core/models/api-error.model';
import { errorInterceptor } from '@core/interceptors/error.interceptor';

// ❌ Sem alias (evitado)
import { environment } from '../../environments/environment';
import { ApiErrorResponse } from './models/api-error.model';
```

---

### Interceptor Funcional vs Classe

**Angular 17+ (Funcional) - Usado nesta etapa:**
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError(...));
};
```

**Angular ≤16 (Classe) - Legado:**
```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req, next) { ... }
}
```

**Vantagens do funcional:**
- ✅ Menos boilerplate
- ✅ Mais fácil de testar
- ✅ Composição simplificada

---

### Serviço Singleton

`ApiService` usa `providedIn: 'root'`:

```typescript
@Injectable({
  providedIn: 'root'  // ← Singleton global
})
export class ApiService { ... }
```

**Isso significa:**
- ✅ Uma única instância em toda aplicação
- ✅ Não precisa registrar em providers
- ✅ Tree-shakeable (removido se não usado)

---

## ✅ Validação

### Build de Produção

```powershell
cd credit-engine-frontend
ng build --configuration=production
```

**Resultado esperado:**
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Output location: dist/credit-engine-frontend
```

### Verificação de Imports

Todos os imports devem resolver corretamente:

```typescript
// Paths configurados
@core/*          → src/app/core/*
@shared/*        → src/app/shared/*
@features/*      → src/app/features/*
@environments/*  → src/environments/*
```

---

## 🧪 Como Testar

### 1. Teste Manual (Console)

Injete `ApiService` em qualquer componente:

```typescript
import { Component, inject } from '@angular/core';
import { ApiService } from '@core/services/api.service';

@Component({...})
export class TestComponent {
  private api = inject(ApiService);

  ngOnInit() {
    // Testar GET (deve mostrar erro no console)
    this.api.get('/test').subscribe({
      error: (err) => console.log('Erro capturado pelo interceptor')
    });
  }
}
```

Abra o console do navegador e veja os logs do interceptor.

### 2. Teste com Backend Real

**Pré-requisito:** Backend rodando em `http://localhost:8080`

```typescript
// Exemplo: Listar taxas de câmbio (quando Etapa 2 estiver pronta)
this.api.get('/exchange-rates').subscribe({
  next: (data) => console.log('✅ Sucesso:', data),
  error: (err) => console.log('❌ Erro:', err)
});
```

---

## 📊 Comparação: Antes vs Depois

### Antes (Sem Core)

```typescript
// ❌ Cada service duplica código
@Injectable()
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}
  
  getAll() {
    return this.http.get(`${this.apiUrl}/transactions`).pipe(
      catchError(err => {
        console.error('Erro:', err);
        return throwError(() => err);
      })
    );
  }
}
```

### Depois (Com Core)

```typescript
// ✅ Código limpo e reutilizável
@Injectable()
export class TransactionService {
  constructor(private api: ApiService) {}
  
  getAll() {
    return this.api.get<Transaction[]>('/transactions');
    // Tratamento de erro automático via interceptor!
  }
}
```

**Benefícios:**
- 🔥 **70% menos código** em cada service
- ✅ URL base centralizada
- ✅ Erros tratados automaticamente
- ✅ Tipagem consistente

---

## 🚀 Próximos Passos

**ETAPA 2: Shared (Componentes Reutilizáveis)**

Arquivos a criar (4 arquivos, ~80 linhas):

```
src/app/shared/
├── models/
│   ├── page.model.ts              # Paginação Spring
│   └── currency.model.ts          # Enum de moedas
└── pipes/
    ├── currency-format.pipe.ts    # Formatação BRL/USD
    └── percent-format.pipe.ts     # Formatação %
```

**Ou pular direto para domínios:**

**ETAPA 3: Currency Domain (Primeiro domínio funcional)**
```
src/app/features/currency/
├── models/
│   └── exchange-rate.model.ts
├── services/
│   └── exchange-rate.service.ts
└── components/
    ├── exchange-rate-form/
    └── exchange-rate-list/
```

---

## 📚 Referências

- [Angular HttpClient](https://angular.io/guide/http)
- [HttpInterceptor](https://angular.io/guide/http-intercept-requests-and-responses)
- [Dependency Injection](https://angular.io/guide/dependency-injection)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

**✅ Etapa 1 concluída! A fundação HTTP está pronta para uso.**
