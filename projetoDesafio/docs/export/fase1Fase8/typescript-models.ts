/**
 * Credit Engine - TypeScript Models
 *
 * Modelos para integração Angular ↔ Spring Boot
 * Copie estes arquivos para: src/app/shared/models/ ou por feature
 *
 * @version 1.0.0
 * @date 2026-07-01
 */

// ============================================================================
// SHARED MODELS
// ============================================================================

/**
 * Resposta padrão de erro da API
 * Usado pelo interceptor de erro global
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  fieldErrors?: FieldError[];
  traceId?: string;
}

export interface FieldError {
  field: string;
  message: string;
  rejectedValue: unknown;
}

/**
 * Paginação padrão Spring Data
 */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

/**
 * Request params para paginação
 */
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================================================
// CURRENCY MODELS (Fase 2)
// ============================================================================

/**
 * Moedas suportadas pelo sistema
 */
export type Currency = 'BRL' | 'USD';

/**
 * Request para criar taxa de câmbio
 */
export interface ExchangeRateRequest {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  effectiveDate: string; // ISO 8601 date
}

/**
 * Response de taxa de câmbio
 */
export interface ExchangeRateResponse {
  id: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  effectiveDate: string;
  createdAt: string;
  createdBy?: string;
}

/**
 * Query params para buscar taxa atual
 */
export interface ExchangeRateQuery {
  from: Currency;
  to: Currency;
  date?: string; // Optional: defaults to today
}

// ============================================================================
// PRICING MODELS (Fase 3)
// ============================================================================

/**
 * Tipos de recebíveis disponíveis
 */
export enum ReceivableType {
  DUPLICATA_MERCANTIL = 'DUPLICATA_MERCANTIL',
  CHEQUE_PRE_DATADO = 'CHEQUE_PRE_DATADO',
  NOTA_PROMISSORIA = 'NOTA_PROMISSORIA',
  CONTRATO_SERVICO = 'CONTRATO_SERVICO'
}

/**
 * Metadados do tipo de recebível
 */
export interface ReceivableTypeInfo {
  code: ReceivableType;
  name: string;
  spreadRate: number;
  active: boolean;
}

/**
 * Request para simulação de precificação
 */
export interface PricingRequest {
  faceValue: number;
  dueDate: string; // ISO 8601 date
  receivableType: ReceivableType;
  originalCurrency: Currency;
  settlementCurrency: Currency;
}

/**
 * Response da simulação
 */
export interface PricingResponse {
  // Valores
  faceValue: number;
  presentValue: number;
  discountValue: number;
  discountPercent: number;

  // Taxas aplicadas
  baseRate: number;
  spreadRate: number;
  totalRate: number;
  termDays: number;

  // Moedas
  originalCurrency: Currency;
  settlementCurrency: Currency;
  exchangeRateUsed?: number;
  convertedValue?: number;

  // Metadados
  calculatedAt: string;
}

// ============================================================================
// TRANSACTION MODELS (Fase 4)
// ============================================================================

/**
 * Status possíveis de uma transação
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED'
}

/**
 * Resumo de cedente (para listagens)
 */
export interface CedentSummary {
  id: number;
  name: string;
  document: string;
}

/**
 * Resumo de tipo de recebível
 */
export interface ReceivableTypeSummary {
  id: number;
  code: ReceivableType;
  name: string;
}

/**
 * Request para criar transação
 */
export interface TransactionRequest {
  cedentId: number;
  receivableTypeId: number;
  faceValue: number;
  dueDate: string;
  originalCurrency: Currency;
  settlementCurrency: Currency;
}

/**
 * Response completa de transação
 */
export interface TransactionResponse {
  id: string; // UUID
  cedent: CedentSummary;
  receivableType: ReceivableTypeSummary;

  // Valores
  faceValue: number;
  presentValue: number;
  discountValue: number;

  // Taxas
  baseRate: number;
  spreadRate: number;
  termDays: number;

  // Moedas
  originalCurrency: Currency;
  settlementCurrency: Currency;
  exchangeRateUsed?: number;
  convertedValue?: number;

  // Datas e Status
  dueDate: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

/**
 * Filtros para listagem de transações
 */
export interface TransactionFilter extends PageRequest {
  status?: TransactionStatus;
  cedentId?: number;
  currency?: Currency;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// REPORT MODELS (Fase 5)
// ============================================================================

/**
 * Filtros para extrato de liquidações
 */
export interface SettlementExtractFilter extends PageRequest {
  startDate: string;
  endDate: string;
  cedentId?: number;
  currency?: Currency;
}

/**
 * Item do extrato de liquidações
 */
export interface SettlementExtractItem {
  transactionId: string;
  transactionDate: string;
  cedentName: string;
  cedentDocument: string;
  receivableTypeName: string;
  faceValue: number;
  presentValue: number;
  discountValue: number;
  originalCurrency: Currency;
  settlementCurrency: Currency;
  exchangeRateUsed?: number;
  convertedValue?: number;
  dueDate: string;
  status: TransactionStatus;
}

// ============================================================================
// CEDENT MODELS (Auxiliar)
// ============================================================================

/**
 * Cedente completo
 */
export interface Cedent {
  id: number;
  name: string;
  document: string;
  email?: string;
  active: boolean;
  createdAt: string;
}

/**
 * Request para criar/atualizar cedente
 */
export interface CedentRequest {
  name: string;
  document: string;
  email?: string;
}

