# Diagrama Entidade-Relacionamento (ER)

## 📊 Visão Geral do Modelo de Dados

O modelo de dados foi projetado para suportar operações de cessão de crédito multimoedas com:
- Precisão decimal para valores financeiros
- Auditoria completa de transações
- Suporte a múltiplas moedas
- Optimistic Locking para concorrência

---

## 🗂️ Diagrama ER (Notação Chen)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CREDIT ENGINE - ER DIAGRAM                      │
└─────────────────────────────────────────────────────────────────────────────┘

                            ┌───────────────────┐
                            │   EXCHANGE_RATE   │
                            ├───────────────────┤
                            │ PK id             │
                            │    from_currency  │
                            │    to_currency    │
                            │    rate           │
                            │    effective_date │
                            │    created_at     │
                            │    created_by     │
                            └─────────┬─────────┘
                                      │
                                      │ consulta taxa
                                      │ (não FK, runtime)
                                      │
┌───────────────────┐                 │                 ┌───────────────────┐
│  RECEIVABLE_TYPE  │                 │                 │      CEDENT       │
├───────────────────┤                 │                 ├───────────────────┤
│ PK id             │                 │                 │ PK id             │
│    code           │◄────────────────┼─────────────────│    name           │
│    name           │                 │                 │    document       │
│    spread_rate    │                 │                 │    email          │
│    active         │                 │                 │    active         │
│    created_at     │                 │                 │    created_at     │
└─────────┬─────────┘                 │                 └─────────┬─────────┘
          │                           │                           │
          │ 1                         │                        1  │
          │                           │                           │
          │                           │                           │
          │ N                         │                        N  │
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 TRANSACTION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id (UUID)                                                                │
│ FK receivable_type_id ──────────────────────────────────────────────────────┤
│ FK cedent_id ───────────────────────────────────────────────────────────────┤
│                                                                             │
│    face_value            DECIMAL(19,4)    Valor de face do recebível       │
│    present_value         DECIMAL(19,4)    Valor presente calculado         │
│    discount_value        DECIMAL(19,4)    Valor do deságio                 │
│    base_rate             DECIMAL(10,6)    Taxa base aplicada               │
│    spread_rate           DECIMAL(10,6)    Spread por tipo                  │
│    term_days             INTEGER          Prazo em dias                    │
│                                                                             │
│    original_currency     VARCHAR(3)       Moeda original (BRL/USD)          │
│    settlement_currency   VARCHAR(3)       Moeda de liquidação              │
│    exchange_rate_used    DECIMAL(10,6)    Taxa de câmbio no momento        │
│    converted_value       DECIMAL(19,4)    Valor convertido (se aplicável)  │
│                                                                             │
│    due_date              DATE             Data de vencimento               │
│    status                VARCHAR(20)      PENDING/SETTLED/CANCELLED        │
│    version               INTEGER          Optimistic Locking               │
│                                                                             │
│    created_at            TIMESTAMP        Data de criação                  │
│    updated_at            TIMESTAMP        Data de atualização              │
│    created_by            VARCHAR(100)     Usuário que criou                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Relacionamentos

| Entidade Origem | Cardinalidade | Entidade Destino | Descrição |
|-----------------|---------------|------------------|-----------|
| `RECEIVABLE_TYPE` | 1:N | `TRANSACTION` | Um tipo pode ter muitas transações |
| `CEDENT` | 1:N | `TRANSACTION` | Um cedente pode ter muitas transações |
| `EXCHANGE_RATE` | - | `TRANSACTION` | Sem FK direta (valor copiado no momento) |

---

## 📋 Dicionário de Dados

### Tabela: `EXCHANGE_RATE` (Taxas de Câmbio)

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | BIGINT | PK | Identificador único |
| `from_currency` | VARCHAR(3) | NOT NULL | Moeda de origem (ISO 4217) |
| `to_currency` | VARCHAR(3) | NOT NULL | Moeda de destino (ISO 4217) |
| `rate` | DECIMAL(18,8) | NOT NULL | Taxa de conversão |
| `effective_date` | DATE | NOT NULL | Data de vigência |
| `created_at` | TIMESTAMP | NOT NULL | Data de criação |
| `created_by` | VARCHAR(100) | NULL | Usuário que criou |

**Índices:**
- UNIQUE(from_currency, to_currency, effective_date)
- INDEX(effective_date DESC)

---

### Tabela: `RECEIVABLE_TYPE` (Tipos de Recebíveis)

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | BIGINT | PK | Identificador único |
| `code` | VARCHAR(50) | NOT NULL | Código único (DUPLICATA_MERCANTIL) |
| `name` | VARCHAR(100) | NOT NULL | Nome exibição |
| `spread_rate` | DECIMAL(10,6) | NOT NULL | Spread de risco mensal |
| `active` | BOOLEAN | NOT NULL | Ativo para uso |
| `created_at` | TIMESTAMP | NOT NULL | Data de criação |

**Índices:**
- UNIQUE(code)

---

### Tabela: `CEDENT` (Cedentes)

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | BIGINT | PK | Identificador único |
| `name` | VARCHAR(200) | NOT NULL | Razão social |
| `document` | VARCHAR(18) | NOT NULL | CPF/CNPJ |
| `email` | VARCHAR(100) | NULL | E-mail de contato |
| `active` | BOOLEAN | NOT NULL | Cedente ativo |
| `created_at` | TIMESTAMP | NOT NULL | Data de criação |

**Índices:**
- UNIQUE(document)

---

### Tabela: `TRANSACTION` (Transações de Cessão)

| Coluna | Tipo | Nullable | Descrição |
|--------|------|----------|-----------|
| `id` | UUID | PK | Identificador único |
| `receivable_type_id` | BIGINT | FK, NOT NULL | Tipo do recebível |
| `cedent_id` | BIGINT | FK, NOT NULL | Cedente |
| `face_value` | DECIMAL(19,4) | NOT NULL | Valor de face |
| `present_value` | DECIMAL(19,4) | NOT NULL | Valor presente |
| `discount_value` | DECIMAL(19,4) | NOT NULL | Deságio |
| `base_rate` | DECIMAL(10,6) | NOT NULL | Taxa base |
| `spread_rate` | DECIMAL(10,6) | NOT NULL | Spread |
| `term_days` | INTEGER | NOT NULL | Prazo em dias |
| `original_currency` | VARCHAR(3) | NOT NULL | Moeda original |
| `settlement_currency` | VARCHAR(3) | NOT NULL | Moeda liquidação |
| `exchange_rate_used` | DECIMAL(10,6) | NULL | Taxa de câmbio |
| `converted_value` | DECIMAL(19,4) | NULL | Valor convertido |
| `due_date` | DATE | NOT NULL | Vencimento |
| `status` | VARCHAR(20) | NOT NULL | Status |
| `version` | INTEGER | NOT NULL | Optimistic Lock |
| `created_at` | TIMESTAMP | NOT NULL | Criação |
| `updated_at` | TIMESTAMP | NULL | Atualização |
| `created_by` | VARCHAR(100) | NULL | Usuário |

**Índices:**
- INDEX(cedent_id, created_at DESC) - Para relatórios por cedente
- INDEX(status, created_at DESC) - Para filtros de status
- INDEX(settlement_currency, created_at DESC) - Para filtros de moeda

---

## 🎯 Decisões de Modelagem

### 1. UUID para Transaction

Usamos UUID em vez de BIGINT serial para:
- Evitar previsibilidade de IDs (segurança)
- Facilitar merge de dados entre ambientes
- Permitir geração client-side

### 2. Snapshot de Taxas

Em vez de FK para `EXCHANGE_RATE`, copiamos `exchange_rate_used` para:
- Preservar valor histórico exato
- Evitar problemas se taxa for alterada depois
- Performance em consultas

### 3. Precisão Decimal

| Campo | Precisão | Justificativa |
|-------|----------|---------------|
| `face_value`, `present_value` | DECIMAL(19,4) | Valores monetários até trilhões |
| `rate`, `spread_rate` | DECIMAL(10,6) | Taxas com 6 casas (0.001234%) |
| `exchange_rate` | DECIMAL(18,8) | Taxas de câmbio alta precisão |

### 4. Optimistic Locking

Campo `version` incrementa a cada UPDATE, prevenindo:
- Race conditions em liquidações simultâneas
- Conflitos de edição

