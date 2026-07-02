# ADR-002: Escolha do Banco de Dados

**Status:** Aceito  
**Data:** 2026-07-01  
**Decisores:** Time de Desenvolvimento  

---

## Contexto

O sistema Credit Engine precisa persistir transações financeiras com:
- Alta precisão decimal (valores monetários)
- Garantias ACID para transações
- Optimistic Locking para controle de concorrência
- Performance em consultas analíticas (relatórios)
- Suporte a operações multimoedas

---

## Opções Consideradas

### Opção 1: Oracle Database
**Prós:**
- Excelente precisão numérica (NUMBER(38,18))
- ACID robusto e maduro
- Suporte corporativo

**Contras:**
- Custo de licenciamento elevado
- Docker image pesada (~8GB)
- Setup complexo para desenvolvimento

---

### Opção 2: PostgreSQL ✅ (Escolhida)
**Prós:**
- NUMERIC com precisão arbitrária
- ACID completo com isolation levels
- Open-source, sem custo de licença
- Docker image leve (~150MB)
- Excelente suporte a JSON (futuro: audit logs)
- Comunidade ativa

**Contras:**
- Suporte comercial requer contrato adicional

---

### Opção 3: MySQL
**Prós:**
- Popular e amplamente usado
- Fácil setup

**Contras:**
- DECIMAL tem limitações em operações complexas
- Isolation levels menos completos
- ⚠️ Não recomendado para sistemas financeiros críticos

---

### Opção 4: SQL Server
**Prós:**
- Bom para ambiente Microsoft
- DECIMAL robusto

**Contras:**
- Custo de licenciamento
- Menos comum em stack Java

---

## Decisão

**Adotamos PostgreSQL** como banco de dados primário porque:

1. **Precisão financeira**: NUMERIC suporta precisão arbitrária
2. **ACID completo**: Transações robustas, todos os isolation levels
3. **Custo-benefício**: Open-source sem licenciamento
4. **DevOps friendly**: Docker image leve, fácil CI/CD
5. **Ecossistema**: Suporte excelente em Spring Data JPA
6. **Extensibilidade**: JSON, arrays, functions nativas

---

## Configurações Específicas

### Tipos Numéricos
```sql
-- Valores monetários
NUMERIC(19, 4)  -- Até quadrilhões com 4 casas

-- Taxas e percentuais
NUMERIC(10, 6)  -- Ex: 0.015000 (1.5%)

-- Taxas de câmbio
NUMERIC(18, 8)  -- Alta precisão para cotações
```

### Configurações de Performance
```properties
# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000

# Statement caching
spring.jpa.properties.hibernate.jdbc.batch_size=25
spring.jpa.properties.hibernate.order_inserts=true
```

---

## Consequências

### Positivas
- Zero custo de licenciamento
- Desenvolvimento local rápido
- CI/CD simplificado com containers
- Performance excelente para o volume esperado

### Negativas
- Sem suporte Oracle oficial (mitigado: comunidade + EnterpriseDB)
- Migração de scripts Oracle legados (se houver)

### Ambiente de Desenvolvimento
- **Local:** H2 em modo PostgreSQL para testes rápidos
- **Integration Tests:** Testcontainers com PostgreSQL real
- **Produção:** PostgreSQL 16+ gerenciado (RDS, Cloud SQL, etc)

---

## Notas

Para migração de Oracle existente, considerar pg_loader ou scripts customizados de ETL.

