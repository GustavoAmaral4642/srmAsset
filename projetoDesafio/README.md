# Credit Engine 💰

> Plataforma de Cessão de Crédito Multimoedas

Motor de precificação e liquidação de ativos (duplicatas, contratos, recebíveis) com suporte a múltiplas moedas (BRL e USD).

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow.svg)]()

---

## 🚧 Status do Projeto

> **⚠️ Este projeto está em desenvolvimento ativo.**

### Progresso Atual

| Fase | Descrição | Status |
|------|-----------|--------|
| **Fase 1** | Fundação (Config, Exceptions, OpenAPI) | ✅ Concluída |
| **Fase 2** | Currency - Gestão de Câmbio | 🔲 Pendente |
| **Fase 3** | Pricing - Motor de Precificação | 🔲 Pendente |
| **Fase 4** | Transaction - Liquidação ACID | 🔲 Pendente |
| **Fase 5** | Report - Extratos Analíticos | 🔲 Pendente |
| **Fase 6** | Observabilidade (Logs, Métricas) | 🔲 Pendente |
| **Fase 7** | Infraestrutura (Docker, CI/CD) | 🔲 Pendente |
| **Fase 8** | Documentação Técnica | ✅ Concluída |

### O que já está implementado

- ✅ Estrutura base do projeto (Layered Architecture + DDD Lite)
- ✅ Configuração de profiles (dev/test/prod)
- ✅ GlobalExceptionHandler com respostas padronizadas
- ✅ Configuração OpenAPI/Swagger
- ✅ Documentação arquitetural completa (ADRs, ER, C4)
- ✅ Scripts DDL para PostgreSQL

### Próximas entregas

- 🔜 **Fase 2**: Endpoints de câmbio funcionais
- 🔜 **Fase 3**: Motor de precificação com Strategy Pattern
- 🔜 **Fase 4**: CRUD de transações com Optimistic Locking
- 🔜 **Frontend**: Aplicação Angular (em desenvolvimento paralelo)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints-planejados)
- [Roadmap](#-roadmap)
- [Documentação](#-documentação)
- [Contribuição](#-contribuição)

---

## 🎯 Sobre o Projeto

O **Credit Engine** é uma plataforma desenvolvida para fundos de investimento (FIDCs) que necessitam precificar e liquidar ativos de cessão de crédito com:

- **Precisão Decimal**: Cálculos financeiros com `BigDecimal` e arredondamento bancário
- **Multimoedas**: Suporte a operações em BRL e USD com conversão cambial
- **Motor de Precificação**: Strategy Pattern para diferentes tipos de recebíveis
- **Transações ACID**: Garantia de integridade com Optimistic Locking
- **Auditoria Completa**: Rastreabilidade de todas as operações

### Funcionalidades Planejadas

- 🔲 Gestão de taxas de câmbio (USD ↔ BRL)
- 🔲 Simulação de precificação (cálculo de deságio)
- 🔲 Liquidação de transações de cessão
- 🔲 Extratos analíticos com filtros avançados
- ✅ API RESTful documentada com OpenAPI/Swagger

---

## 🏗️ Arquitetura

O projeto utiliza **Layered Architecture + DDD Lite**:

```
┌─────────────────────────────────────────────────────┐
│               PRESENTATION LAYER                     │
│         (Controllers, DTOs, Validation)              │
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

**Por que essa arquitetura?**  
→ [Leia o ADR-001](/docs/ADR/001-escolha-arquitetura.md)

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Linguagem** | Java | 17 LTS |
| **Framework** | Spring Boot | 3.3.1 |
| **Persistência** | Spring Data JPA + Hibernate | 6.x |
| **Banco de Dados** | PostgreSQL | 16+ |
| **Documentação** | SpringDoc OpenAPI | 2.5.0 |
| **Resiliência** | Resilience4j | 2.2.0 |
| **Observabilidade** | Micrometer + Prometheus | - |
| **Testes** | JUnit 5 + Testcontainers | 1.19.8 |
| **Build** | Maven | 3.9+ |

---

## 📦 Pré-requisitos

- **Java 17+** ([Download](https://adoptium.net/))
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))
- **Docker** (opcional, para PostgreSQL) ([Download](https://www.docker.com/))

---

## 🚀 Como Executar

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/credit-engine.git
cd credit-engine
```

### 2. Execute com H2 (Desenvolvimento)

```bash
# Modo dev com banco H2 em memória
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Execute com PostgreSQL (Docker)

```bash
# Subir PostgreSQL
docker run -d \
  --name credit-engine-db \
  -e POSTGRES_DB=creditengine \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Executar aplicação
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### 4. Acesse a Aplicação

| Recurso | URL |
|---------|-----|
| **API Base** | http://localhost:8080/api |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8080/v3/api-docs |
| **H2 Console** | http://localhost:8080/h2-console (apenas dev) |
| **Health Check** | http://localhost:8080/actuator/health |
| **Metrics** | http://localhost:8080/actuator/prometheus |

---

## 📁 Estrutura do Projeto

```
src/main/java/com/projeto/desafio/
├── config/                     # Configurações globais
│   ├── GlobalExceptionHandler  # Tratamento de exceções
│   └── OpenApiConfig           # Swagger/OpenAPI
│
├── shared/                     # Código compartilhado
│   ├── dto/                    # DTOs base
│   └── exception/              # Exceções de negócio
│
├── currency/                   # 💱 Domínio: Câmbio
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── entity/
│
├── pricing/                    # 📊 Domínio: Precificação
│   ├── controller/
│   ├── service/
│   ├── strategy/               # Strategy Pattern
│   └── dto/
│
├── transaction/                # 💳 Domínio: Transações
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── entity/
│
└── report/                     # 📈 Domínio: Relatórios
    ├── controller/
    ├── repository/             # SQL nativo
    └── dto/
```

---

## 🔌 API Endpoints (Planejados)

> **Nota:** Estes endpoints serão implementados nas próximas fases.

### Câmbio (Exchange Rates) — Fase 2

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/exchange-rates` | Lista taxas de câmbio | 🔲 |
| `GET` | `/api/exchange-rates/current` | Taxa atual por par de moedas | 🔲 |
| `POST` | `/api/exchange-rates` | Cadastra nova taxa | 🔲 |

### Precificação (Pricing) — Fase 3

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `POST` | `/api/pricing/simulate` | Simula cálculo de valor presente | 🔲 |
| `GET` | `/api/pricing/receivable-types` | Lista tipos de recebíveis | 🔲 |

### Transações (Transactions) — Fase 4

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/transactions` | Lista transações (paginado) | 🔲 |
| `GET` | `/api/transactions/{id}` | Detalhe de uma transação | 🔲 |
| `POST` | `/api/transactions` | Cria nova liquidação | 🔲 |
| `PATCH` | `/api/transactions/{id}/settle` | Confirma liquidação | 🔲 |
| `PATCH` | `/api/transactions/{id}/cancel` | Cancela transação | 🔲 |

### Relatórios (Reports) — Fase 5

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/api/reports/settlement-extract` | Extrato de liquidações | 🔲 |

---

## 🗺️ Roadmap

### Q3 2026

- [x] **Fase 1**: Fundação do projeto
- [x] **Fase 8**: Documentação técnica completa
- [ ] **Fase 2**: Módulo de Câmbio (Currency)
- [ ] **Fase 3**: Motor de Precificação (Strategy Pattern)

### Q4 2026

- [ ] **Fase 4**: Transações com ACID e Optimistic Locking
- [ ] **Fase 5**: Relatórios com SQL nativo
- [ ] **Fase 6**: Observabilidade (Logs estruturados, Prometheus)
- [ ] **Fase 7**: Docker Compose e CI/CD
- [ ] **Frontend**: Aplicação Angular completa

---

## 📚 Documentação

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [ARCHITECTURE.md](/docs/ARCHITECTURE.md) | Arquitetura Layered + DDD Lite | ✅ |
| [ER_DIAGRAM.md](/docs/ER_DIAGRAM.md) | Diagrama Entidade-Relacionamento | ✅ |
| [C4_DIAGRAM.md](/docs/C4_DIAGRAM.md) | Diagramas C4 (Context, Container, Component) | ✅ |
| [DDL.sql](/docs/DDL.sql) | Scripts de criação do banco | ✅ |
| [ADR/](/docs/ADR/) | Architecture Decision Records | ✅ |
| [AI_USAGE.md](/AI_USAGE.md) | Documentação de uso de IA | ✅ |

### ADRs Disponíveis

- [ADR-001: Escolha da Arquitetura](/docs/ADR/001-escolha-arquitetura.md)
- [ADR-002: Escolha do Banco de Dados](/docs/ADR/002-escolha-banco-dados.md)

---

## 🧪 Testes

> **Nota:** Testes serão implementados junto com cada fase de funcionalidade.

```bash
# Executar todos os testes
./mvnw test

# Executar com cobertura (Jacoco)
./mvnw test jacoco:report

# Ver relatório de cobertura
open target/site/jacoco/index.html
```

### Estratégia de Testes Planejada

| Tipo | Escopo | Ferramenta |
|------|--------|------------|
| **Unitários** | Services, Strategies | JUnit 5 + Mockito |
| **Integração** | Repositories, Controllers | Testcontainers + H2 |
| **E2E** | Fluxos completos | MockMvc |

---

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commits semânticos (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Conventional Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
refactor: refatoração sem mudança de comportamento
test: adição ou correção de testes
chore: tarefas de build, CI, etc
```

---

## 🎯 Decisões Técnicas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Arquitetura** | Layered + DDD Lite | Balanceamento entre simplicidade e organização por domínio |
| **Banco** | PostgreSQL | Precisão decimal, ACID, open-source |
| **Lombok** | Sim | Redução de boilerplate |
| **QueryDSL** | Não | SQL nativo para relatórios (mais controle) |
| **Java** | 17 LTS | Suporte de longo prazo, features modernas |

> Veja mais detalhes nos [ADRs](/docs/ADR/)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Sobre

Este projeto foi desenvolvido como parte de um desafio técnico para posição de **Tech Lead**, demonstrando:

- Arquitetura de software para aplicações financeiras
- Padrões de projeto (Strategy, Repository, DTO)
- Documentação técnica profissional (ADRs, C4, ER)
- Boas práticas de código e organização
- Uso responsável de IA como ferramenta de produtividade

---

## 📞 Contato

**Desenvolvedor:** [Seu Nome]  
**Email:** [seu-email@exemplo.com]  
**LinkedIn:** [seu-linkedin]

---

<p align="center">
  <strong>🚧 Projeto em desenvolvimento ativo 🚧</strong>
  <br><br>
  Feito com ☕ e Spring Boot
</p>

