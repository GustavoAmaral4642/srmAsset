-- ============================================================================
-- CREDIT ENGINE - Data Definition Language (DDL)
-- Banco de Dados: PostgreSQL 16+
-- Encoding: UTF-8
-- ============================================================================

-- ============================================================================
-- EXTENSÕES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Para UUID generation

-- ============================================================================
-- TIPOS ENUMERADOS
-- ============================================================================

-- Status de uma transação de cessão
CREATE TYPE transaction_status AS ENUM ('PENDING', 'SETTLED', 'CANCELLED');

-- ============================================================================
-- TABELA: exchange_rate (Taxas de Câmbio)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exchange_rate (
    id                  BIGSERIAL PRIMARY KEY,
    from_currency       VARCHAR(3) NOT NULL,
    to_currency         VARCHAR(3) NOT NULL,
    rate                NUMERIC(18, 8) NOT NULL,
    effective_date      DATE NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          VARCHAR(100),

    -- Constraints
    CONSTRAINT chk_exchange_rate_positive CHECK (rate > 0),
    CONSTRAINT chk_exchange_rate_currencies CHECK (from_currency <> to_currency),
    CONSTRAINT uq_exchange_rate UNIQUE (from_currency, to_currency, effective_date)
);

-- Índices
CREATE INDEX idx_exchange_rate_effective_date ON exchange_rate (effective_date DESC);
CREATE INDEX idx_exchange_rate_currencies ON exchange_rate (from_currency, to_currency);

-- Comentários
COMMENT ON TABLE exchange_rate IS 'Taxas de câmbio entre moedas';
COMMENT ON COLUMN exchange_rate.rate IS 'Taxa de conversão: 1 from_currency = rate to_currency';

-- ============================================================================
-- TABELA: receivable_type (Tipos de Recebíveis)
-- ============================================================================
CREATE TABLE IF NOT EXISTS receivable_type (
    id                  BIGSERIAL PRIMARY KEY,
    code                VARCHAR(50) NOT NULL UNIQUE,
    name                VARCHAR(100) NOT NULL,
    spread_rate         NUMERIC(10, 6) NOT NULL,
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_receivable_type_spread_positive CHECK (spread_rate >= 0)
);

-- Comentários
COMMENT ON TABLE receivable_type IS 'Tipos de recebíveis com spread de risco associado';
COMMENT ON COLUMN receivable_type.spread_rate IS 'Spread mensal de risco (ex: 0.015 = 1.5%)';

-- ============================================================================
-- TABELA: cedent (Cedentes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cedent (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(200) NOT NULL,
    document            VARCHAR(18) NOT NULL UNIQUE,  -- CPF ou CNPJ
    email               VARCHAR(100),
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_cedent_document_length CHECK (LENGTH(document) >= 11)
);

-- Índices
CREATE INDEX idx_cedent_active ON cedent (active) WHERE active = TRUE;

-- Comentários
COMMENT ON TABLE cedent IS 'Empresas cedentes de recebíveis';
COMMENT ON COLUMN cedent.document IS 'CPF (11 dígitos) ou CNPJ (14 dígitos)';

-- ============================================================================
-- TABELA: transaction (Transações de Cessão)
-- ============================================================================
CREATE TABLE IF NOT EXISTS transaction (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receivable_type_id      BIGINT NOT NULL REFERENCES receivable_type(id),
    cedent_id               BIGINT NOT NULL REFERENCES cedent(id),

    -- Valores financeiros
    face_value              NUMERIC(19, 4) NOT NULL,
    present_value           NUMERIC(19, 4) NOT NULL,
    discount_value          NUMERIC(19, 4) NOT NULL,

    -- Taxas aplicadas
    base_rate               NUMERIC(10, 6) NOT NULL,
    spread_rate             NUMERIC(10, 6) NOT NULL,
    term_days               INTEGER NOT NULL,

    -- Moedas
    original_currency       VARCHAR(3) NOT NULL DEFAULT 'BRL',
    settlement_currency     VARCHAR(3) NOT NULL DEFAULT 'BRL',
    exchange_rate_used      NUMERIC(18, 8),
    converted_value         NUMERIC(19, 4),

    -- Datas e Status
    due_date                DATE NOT NULL,
    status                  VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    -- Controle de Concorrência
    version                 INTEGER NOT NULL DEFAULT 0,

    -- Auditoria
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE,
    created_by              VARCHAR(100),

    -- Constraints
    CONSTRAINT chk_transaction_values_positive CHECK (face_value > 0 AND present_value > 0),
    CONSTRAINT chk_transaction_discount CHECK (discount_value >= 0),
    CONSTRAINT chk_transaction_term_positive CHECK (term_days > 0),
    CONSTRAINT chk_transaction_status CHECK (status IN ('PENDING', 'SETTLED', 'CANCELLED')),
    CONSTRAINT chk_transaction_cross_currency CHECK (
        (original_currency = settlement_currency AND exchange_rate_used IS NULL)
        OR (original_currency <> settlement_currency AND exchange_rate_used IS NOT NULL)
    )
);

-- Índices para relatórios
CREATE INDEX idx_transaction_cedent_date ON transaction (cedent_id, created_at DESC);
CREATE INDEX idx_transaction_status_date ON transaction (status, created_at DESC);
CREATE INDEX idx_transaction_currency_date ON transaction (settlement_currency, created_at DESC);
CREATE INDEX idx_transaction_due_date ON transaction (due_date);

-- Comentários
COMMENT ON TABLE transaction IS 'Transações de cessão de crédito';
COMMENT ON COLUMN transaction.face_value IS 'Valor de face/nominal do recebível';
COMMENT ON COLUMN transaction.present_value IS 'Valor presente após aplicação do deságio';
COMMENT ON COLUMN transaction.discount_value IS 'Valor do deságio (face_value - present_value)';
COMMENT ON COLUMN transaction.version IS 'Campo para Optimistic Locking';

-- ============================================================================
-- TRIGGER: Atualização automática de updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_transaction_updated_at
    BEFORE UPDATE ON transaction
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DADOS INICIAIS: Tipos de Recebíveis
-- ============================================================================
INSERT INTO receivable_type (code, name, spread_rate) VALUES
    ('DUPLICATA_MERCANTIL', 'Duplicata Mercantil', 0.015),
    ('CHEQUE_PRE_DATADO', 'Cheque Pré-datado', 0.025),
    ('NOTA_PROMISSORIA', 'Nota Promissória', 0.020),
    ('CONTRATO_SERVICO', 'Contrato de Serviço', 0.018)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- DADOS INICIAIS: Taxa de Câmbio de Exemplo
-- ============================================================================
INSERT INTO exchange_rate (from_currency, to_currency, rate, effective_date, created_by) VALUES
    ('USD', 'BRL', 5.2500, CURRENT_DATE, 'SYSTEM'),
    ('BRL', 'USD', 0.1905, CURRENT_DATE, 'SYSTEM')
ON CONFLICT (from_currency, to_currency, effective_date) DO NOTHING;

-- ============================================================================
-- VIEW: Extrato de Liquidações (para relatórios)
-- ============================================================================
CREATE OR REPLACE VIEW vw_settlement_extract AS
SELECT
    t.id,
    t.created_at,
    c.name AS cedent_name,
    c.document AS cedent_document,
    rt.name AS receivable_type_name,
    t.face_value,
    t.present_value,
    t.discount_value,
    t.original_currency,
    t.settlement_currency,
    t.exchange_rate_used,
    t.converted_value,
    t.due_date,
    t.status,
    t.base_rate + t.spread_rate AS total_rate,
    t.term_days
FROM transaction t
JOIN cedent c ON c.id = t.cedent_id
JOIN receivable_type rt ON rt.id = t.receivable_type_id;

COMMENT ON VIEW vw_settlement_extract IS 'View otimizada para extrato de liquidações';

-- ============================================================================
-- FIM DO SCRIPT DDL
-- ============================================================================

