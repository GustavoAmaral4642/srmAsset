# 📤 Export: Fase 1 + Fase 8 — Credit Engine Backend

> Documento de handoff para integração com Frontend Angular

**Data de Export:** 2026-07-01  
**Backend:** Spring Boot 3.3.1 / Java 17  
**Frontend Target:** Angular (VSCode)

---

## 📋 Índice

1. [Resumo do Projeto](#1-resumo-do-projeto)
2. [Arquitetura Backend](#2-arquitetura-backend)
3. [API Endpoints Planejados](#3-api-endpoints-planejados)
4. [DTOs e Contratos](#4-dtos-e-contratos)
5. [Configuração CORS](#5-configuração-cors)
6. [Ambiente de Desenvolvimento](#6-ambiente-de-desenvolvimento)
7. [Próximas Fases](#7-próximas-fases)

---

## 1. Resumo do Projeto

### O que é o Credit Engine?

Plataforma de **Cessão de Crédito Multimoedas** para fundos de investimento (FIDCs):

- **Gestão de Câmbio**: Cadastro e consulta de taxas USD ↔ BRL
- **Motor de Precificação**: Cálculo de valor presente com deságio (Strategy Pattern)
- **Liquidação**: Registro de transações de cessão com ACID
- **Relatórios**: Extratos com filtros avançados

### Stack Backend

| Tecnologia | Versão |
|------------|--------|
| Java | 17 LTS |
| Spring Boot | 3.3.1 |
| Spring Data JPA | 3.x |
| PostgreSQL | 16+ |
| OpenAPI/Swagger | 3.0 |

### URLs de Desenvolvimento

| Recurso | URL |
|---------|-----|
| API Base | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |
| Health Check | `http://localhost:8080/actuator/health` |

---

## 2. Arquitetura Backend

### Layered Architecture + DDD Lite

```
┌─────────────────────────────────────────────────────┐
│               PRESENTATION LAYER                     │
│         (Controllers, DTOs Request/Response)         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                 BUSINESS LAYER                       │
│         (Services, Strategies, Domain Logic)         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│               PERSISTENCE LAYER                      │
│         (Repositories, Entities, JPA)                │
└─────────────────────────────────────────────────────┘
```

### Estrutura de Domínios

```
src/main/java/com/projeto/desafio/
├── config/          # Configurações globais
├── shared/          # Código compartilhado (DTOs, Exceptions)
├── currency/        # 💱 Domínio: Câmbio
├── pricing/         # 📊 Domínio: Precificação
├── transaction/     # 💳 Domínio: Transações
└── report/          # 📈 Domínio: Relatórios
```

---

## 3. API Endpoints Planejados

### 💱 Câmbio (Exchange Rates)

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/exchange-rates` | Lista todas as taxas | 🔲 Fase 2 |
| `GET` | `/api/exchange-rates/current` | Taxa atual por par de moedas | 🔲 Fase 2 |
| `POST` | `/api/exchange-rates` | Cadastra nova taxa | 🔲 Fase 2 |

**Query Params (GET /current):**
- `from`: Moeda origem (ex: `USD`)
- `to`: Moeda destino (ex: `BRL`)

---

### 📊 Precificação (Pricing)

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `POST` | `/api/pricing/simulate` | Simula cálculo PV | 🔲 Fase 3 |
| `GET` | `/api/pricing/receivable-types` | Lista tipos de recebíveis | 🔲 Fase 3 |

---

### 💳 Transações (Transactions)

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/transactions` | Lista transações (paginado) | 🔲 Fase 4 |
| `GET` | `/api/transactions/{id}` | Detalhe de transação | 🔲 Fase 4 |
| `POST` | `/api/transactions` | Cria liquidação | 🔲 Fase 4 |
| `PATCH` | `/api/transactions/{id}/settle` | Confirma liquidação | 🔲 Fase 4 |
| `PATCH` | `/api/transactions/{id}/cancel` | Cancela transação | 🔲 Fase 4 |

**Query Params (GET /transactions):**
- `page`: Número da página (0-indexed)
- `size`: Itens por página (default: 20)
- `sort`: Campo de ordenação (ex: `createdAt,desc`)
- `status`: Filtro por status
- `cedentId`: Filtro por cedente
- `currency`: Filtro por moeda

---

### 📈 Relatórios (Reports)

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/reports/settlement-extract` | Extrato de liquidações | 🔲 Fase 5 |

**Query Params:**
- `startDate`: Data início (ISO 8601)
- `endDate`: Data fim (ISO 8601)
- `cedentId`: Filtro por cedente
- `currency`: Filtro por moeda
- `page`, `size`: Paginação

---

## 4. DTOs e Contratos

### 4.1 Resposta de Erro Padrão

```typescript
// Angular: src/app/shared/models/api-error.model.ts

interface ApiErrorResponse {
  timestamp: string;        // ISO 8601
  status: number;           // HTTP status code
  errorCode: string;        // Ex: "VALIDATION_ERROR", "BUSINESS_ERROR"
  message: string;          // Mensagem legível
  path: string;             // Endpoint que gerou erro
  fieldErrors?: FieldError[];  // Erros de validação
  traceId?: string;         // Para suporte
}

interface FieldError {
  field: string;            // Nome do campo
  message: string;          // Mensagem de erro
  rejectedValue: any;       // Valor rejeitado
}
```

---

### 4.2 Exchange Rate (Câmbio)

```typescript
// Angular: src/app/features/currency/models/exchange-rate.model.ts

// Request: POST /api/exchange-rates
interface ExchangeRateRequest {
  fromCurrency: string;     // ISO 4217 (ex: "USD")
  toCurrency: string;       // ISO 4217 (ex: "BRL")
  rate: number;             // Ex: 5.25
  effectiveDate: string;    // ISO 8601 date (ex: "2026-07-01")
}

// Response: GET /api/exchange-rates
interface ExchangeRateResponse {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
  createdAt: string;
}
```

---

### 4.3 Pricing (Precificação)

```typescript
// Angular: src/app/features/pricing/models/pricing.model.ts

// Enum de tipos de recebíveis
enum ReceivableType {
  DUPLICATA_MERCANTIL = 'DUPLICATA_MERCANTIL',
  CHEQUE_PRE_DATADO = 'CHEQUE_PRE_DATADO',
  NOTA_PROMISSORIA = 'NOTA_PROMISSORIA',
  CONTRATO_SERVICO = 'CONTRATO_SERVICO'
}

// Request: POST /api/pricing/simulate
interface PricingRequest {
  faceValue: number;              // Valor de face
  dueDate: string;                // Data vencimento (ISO 8601)
  receivableType: ReceivableType; // Tipo do recebível
  originalCurrency: string;       // Moeda original (BRL/USD)
  settlementCurrency: string;     // Moeda de liquidação
}

// Response
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
  exchangeRateUsed?: number;      // Se cross-currency
  convertedValue?: number;        // Valor na moeda de liquidação
}
```

---

### 4.4 Transaction (Transação)

```typescript
// Angular: src/app/features/transaction/models/transaction.model.ts

enum TransactionStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED'
}

// Request: POST /api/transactions
interface TransactionRequest {
  cedentId: number;
  receivableTypeId: number;
  faceValue: number;
  dueDate: string;
  originalCurrency: string;
  settlementCurrency: string;
}

// Response
interface TransactionResponse {
  id: string;                     // UUID
  cedent: CedentSummary;
  receivableType: ReceivableTypeSummary;
  faceValue: number;
  presentValue: number;
  discountValue: number;
  baseRate: number;
  spreadRate: number;
  termDays: number;
  originalCurrency: string;
  settlementCurrency: string;
  exchangeRateUsed?: number;
  convertedValue?: number;
  dueDate: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt?: string;
}

interface CedentSummary {
  id: number;
  name: string;
  document: string;
}

interface ReceivableTypeSummary {
  id: number;
  code: string;
  name: string;
}
```

---

### 4.5 Paginação (Spring Data)

```typescript
// Angular: src/app/shared/models/page.model.ts

interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;           // Página atual (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

---

## 5. Configuração CORS

O backend precisará de configuração CORS para aceitar requisições do Angular (porta 4200):

```java
// Já planejado para Fase 2
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

**Para o Angular** (`environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

## 6. Ambiente de Desenvolvimento

### Rodando o Backend

```powershell
# Navegar para o projeto
cd D:\Desenvolvimento\Projetos\srmAsset\projetoDesafio

# Rodar com H2 (modo dev)
.\mvnw.cmd spring-boot:run

# Ou com profile específico
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Testando Conectividade

```powershell
# Health check
curl http://localhost:8080/actuator/health

# Swagger UI (abrir no navegador)
start http://localhost:8080/swagger-ui.html
```

### Docker (PostgreSQL)

```powershell
# Subir PostgreSQL para testes de integração
docker run -d `
  --name credit-engine-db `
  -e POSTGRES_DB=creditengine `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  postgres:16-alpine
```

---

## 7. Próximas Fases

### Status Geral

| Fase | Descrição | Status | Impacto no Frontend |
|------|-----------|--------|---------------------|
| 1 | Fundação | ✅ Concluída | Exception handling padrão |
| 2 | Currency | 🔲 Pendente | Tela de taxas de câmbio |
| 3 | Pricing | 🔲 Pendente | Simulador de precificação |
| 4 | Transaction | 🔲 Pendente | Grid de transações |
| 5 | Report | 🔲 Pendente | Extratos/relatórios |
| 8 | Documentação | ✅ Concluída | - |

### Ordem Recomendada para Frontend

1. **Criar estrutura base Angular** (módulos, serviços, interceptors)
2. **Implementar interceptor de erro** baseado no `ApiErrorResponse`
3. **Aguardar Fase 2** para implementar tela de câmbio
4. **Aguardar Fase 3** para implementar simulador
5. **Aguardar Fase 4** para implementar grid de transações

---

## 📎 Arquivos de Referência

| Arquivo | Path | Descrição |
|---------|------|-----------|
| Arquitetura | `docs/ARCHITECTURE.md` | Layered + DDD Lite |
| ER Diagram | `docs/ER_DIAGRAM.md` | Modelo de dados |
| C4 Diagrams | `docs/C4_DIAGRAM.md` | Visão de sistema |
| DDL | `docs/DDL.sql` | Scripts PostgreSQL |
| ADRs | `docs/ADR/*.md` | Decisões técnicas |

---

**Próximo passo:** Quando o backend completar a Fase 2 (Currency), este documento será atualizado com os endpoints implementados e testados.

