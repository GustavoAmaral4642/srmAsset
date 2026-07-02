# Diagramas C4 - Credit Engine

## 📐 Sobre o Modelo C4

O modelo C4 (Context, Container, Component, Code) foi criado por Simon Brown para documentar arquitetura de software de forma hierárquica e compreensível.

---

## 🌍 Nível 1: Diagrama de Contexto

Mostra o sistema como uma caixa preta e suas interações com atores externos.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMA DE CONTEXTO (C4 - Level 1)                    │
└──────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   OPERADOR  │
                                    │  Mesa de    │
                                    │  Operação   │
                                    └──────┬──────┘
                                           │
                                           │ [HTTPS/JSON]
                                           │ Simula precificação
                                           │ Registra liquidações
                                           │ Consulta extratos
                                           ▼
┌─────────────┐                 ┌─────────────────────────┐                 ┌─────────────┐
│   SISTEMA   │                 │                         │                 │   SISTEMA   │
│   DE TAXAS  │ ───────────────►│     CREDIT ENGINE       │◄─────────────── │   LEGADO    │
│   (Externo) │  [REST API]     │                         │  [Batch/File]   │   (FIDC)    │
│             │  Cotações       │  • Precificação         │  Importação     │             │
└─────────────┘  USD/BRL        │  • Liquidação           │  Carteiras      └─────────────┘
                                │  • Relatórios           │
                                │  • Gestão de Câmbio     │
                                │                         │
                                └───────────┬─────────────┘
                                            │
                                            │ [JDBC]
                                            │ Persistência ACID
                                            ▼
                                    ┌─────────────┐
                                    │  POSTGRESQL │
                                    │  Database   │
                                    │             │
                                    └─────────────┘


┌──────────────────────────────────────────────────────────────────────────────────┐
│ LEGENDA                                                                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────┐  Pessoa/Ator                                                          │
│ └───────┘                                                                        │
│                                                                                  │
│ ┌───────┐  Sistema de Software                                                  │
│ │       │                                                                        │
│ └───────┘                                                                        │
│                                                                                  │
│ ─────────► Interação/Dependência                                                │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Atores e Sistemas

| Elemento | Tipo | Descrição |
|----------|------|-----------|
| **Operador** | Pessoa | Usuário da mesa de operações que precifica e liquida ativos |
| **Credit Engine** | Sistema | Este sistema - motor de precificação e liquidação |
| **Sistema de Taxas** | Sistema Externo | Fornece cotações de câmbio (pode ser Bacen, Bloomberg, etc) |
| **Sistema Legado** | Sistema Externo | Sistema de gestão do FIDC que pode importar carteiras |
| **PostgreSQL** | Database | Armazenamento persistente com garantias ACID |

---

## 📦 Nível 2: Diagrama de Container

Mostra os containers (aplicações, bancos de dados) que compõem o sistema.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMA DE CONTAINER (C4 - Level 2)                   │
└──────────────────────────────────────────────────────────────────────────────────┘

     ┌─────────────┐
     │   OPERADOR  │
     └──────┬──────┘
            │
            │ [HTTPS]
            ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                              CREDIT ENGINE SYSTEM                                 │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│                                                                                   │
│ │  ┌─────────────────────┐              ┌─────────────────────┐               │  │
│    │    SPA FRONTEND     │              │    API BACKEND      │                  │
│ │  │    (React/Vue)      │ ──────────── │    (Spring Boot)    │               │  │
│    │                     │   [REST]     │                     │                  │
│ │  │ • Painel Operador   │              │ • REST Controllers  │               │  │
│    │ • Grid Transações   │              │ • Services          │                  │
│ │  │ • Simulação         │              │ • Repositories      │               │  │
│    │                     │              │ • Strategy Pattern  │                  │
│ │  └─────────────────────┘              └──────────┬──────────┘               │  │
│                                                    │                             │
│ │                                                  │ [JDBC/JPA]               │  │
│                                                    │                             │
│ │                                         ┌────────┴────────┐                 │  │
│                                           │                 │                    │
│ │                              ┌──────────▼───────┐  ┌──────▼───────┐         │  │
│                                │   POSTGRESQL     │  │    REDIS     │            │
│ │                              │   (Primary DB)   │  │   (Cache)    │         │  │
│                                │                  │  │  [Opcional]  │            │
│ │                              │ • Transactions   │  │              │         │  │
│                                │ • Exchange Rates │  │ • Taxas      │            │
│ │                              │ • Cedents        │  │ • Sessions   │         │  │
│                                │ • Types          │  │              │            │
│ │                              └──────────────────┘  └──────────────┘         │  │
│                                                                                   │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
└───────────────────────────────────────────────────────────────────────────────────┘
                    │
                    │ [HTTPS]
                    ▼
          ┌─────────────────────┐
          │  OBSERVABILITY      │
          │  STACK              │
          │                     │
          │ • Prometheus        │
          │ • Grafana           │
          │ • (Opcional)        │
          └─────────────────────┘
```

### Containers

| Container | Tecnologia | Responsabilidade |
|-----------|------------|------------------|
| **SPA Frontend** | React/Vue/Angular | Interface do operador, simulação em tempo real |
| **API Backend** | Spring Boot 3.3 / Java 17 | Lógica de negócio, API REST, persistência |
| **PostgreSQL** | PostgreSQL 16 | Armazenamento primário com ACID |
| **Redis** | Redis 7 (Opcional) | Cache de taxas de câmbio, sessões |
| **Prometheus/Grafana** | Monitoring Stack | Métricas, alertas, dashboards |

---

## 🔧 Nível 3: Diagrama de Componentes (API Backend)

Mostra os componentes internos do backend.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         DIAGRAMA DE COMPONENTES (C4 - Level 3)                   │
│                                   API BACKEND                                    │
└──────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────────┐
│                              SPRING BOOT APPLICATION                              │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                         PRESENTATION LAYER                                   │ │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │ │
│  │  │ ExchangeRate     │ │ Pricing          │ │ Transaction      │             │ │
│  │  │ Controller       │ │ Controller       │ │ Controller       │             │ │
│  │  │ /api/exchange-   │ │ /api/pricing     │ │ /api/transactions│             │ │
│  │  │ rates            │ │                  │ │                  │             │ │
│  │  └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘             │ │
│  │           │                    │                    │                       │ │
│  │  ┌────────┴────────────────────┴────────────────────┴──────────────────┐    │ │
│  │  │                      Global Exception Handler                        │    │ │
│  │  │                      OpenAPI Documentation                           │    │ │
│  │  └─────────────────────────────────────────────────────────────────────┘    │ │
│  └──────────────────────────────────────────────────────┬──────────────────────┘ │
│                                                         │                        │
│  ┌──────────────────────────────────────────────────────▼──────────────────────┐ │
│  │                          BUSINESS LAYER                                      │ │
│  │                                                                              │ │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │ │
│  │  │ ExchangeRate     │ │ Pricing          │ │ Transaction      │             │ │
│  │  │ Service          │ │ Service          │ │ Service          │             │ │
│  │  │                  │ │                  │ │                  │             │ │
│  │  │ • getCurrentRate │ │ • simulate()     │ │ • create()       │             │ │
│  │  │ • saveRate       │ │ • calculate()    │ │ • settle()       │             │ │
│  │  └──────────────────┘ └────────┬─────────┘ │ • cancel()       │             │ │
│  │           ▲                    │           └──────────────────┘             │ │
│  │           │                    ▼                                            │ │
│  │           │           ┌──────────────────────────────────────┐              │ │
│  │           │           │        STRATEGY PATTERN              │              │ │
│  │           │           │  ┌────────────────────────────────┐  │              │ │
│  │           │           │  │     PricingStrategy            │  │              │ │
│  │           │           │  │     <<interface>>              │  │              │ │
│  │           │           │  └───────────────┬────────────────┘  │              │ │
│  │           │           │         ┌────────┴────────┐          │              │ │
│  │           │           │         ▼                 ▼          │              │ │
│  │           │           │  ┌─────────────┐   ┌─────────────┐   │              │ │
│  │           │           │  │ Duplicata   │   │ Cheque      │   │              │ │
│  │           │           │  │ Strategy    │   │ Strategy    │   │              │ │
│  │           │           │  │ Spread 1.5% │   │ Spread 2.5% │   │              │ │
│  │           │           │  └─────────────┘   └─────────────┘   │              │ │
│  │           │           └──────────────────────────────────────┘              │ │
│  │           │                                                                 │ │
│  └───────────┼─────────────────────────────────────────────────────────────────┘ │
│              │                                                                   │
│  ┌───────────▼─────────────────────────────────────────────────────────────────┐ │
│  │                        PERSISTENCE LAYER                                     │ │
│  │                                                                              │ │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │ │
│  │  │ ExchangeRate     │ │ ReceivableType   │ │ Transaction      │             │ │
│  │  │ Repository       │ │ Repository       │ │ Repository       │             │ │
│  │  │                  │ │                  │ │                  │             │ │
│  │  │ JpaRepository    │ │ JpaRepository    │ │ JpaRepository    │             │ │
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘             │ │
│  │                              │                                              │ │
│  │  ┌───────────────────────────▼───────────────────────────────┐              │ │
│  │  │                   Report Repository                        │              │ │
│  │  │                   (Native SQL Queries)                     │              │ │
│  │  └────────────────────────────────────────────────────────────┘              │ │
│  │                                                                              │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                         │                                        │
└─────────────────────────────────────────┼────────────────────────────────────────┘
                                          │ [JDBC]
                                          ▼
                                   ┌──────────────┐
                                   │  POSTGRESQL  │
                                   └──────────────┘
```

---

## 🔄 Fluxo de Dados: Precificação com Conversão

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO: Simulação de Precificação Cross-Currency              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────┐   POST /api/pricing/simulate      ┌──────────────────┐
│  Client  │ ─────────────────────────────────►│ PricingController│
└──────────┘   {faceValue: 10000,              └────────┬─────────┘
               type: "DUPLICATA",                       │
               currency: "BRL",                         │ @Valid
               settlementCurrency: "USD"}               │
                                                        ▼
                                               ┌──────────────────┐
                                               │  PricingService  │
                                               └────────┬─────────┘
                                                        │
                    ┌───────────────────────────────────┼───────────────────────┐
                    │                                   │                       │
                    ▼                                   ▼                       ▼
           ┌──────────────────┐              ┌──────────────────┐     ┌──────────────────┐
           │ Strategy Factory │              │ ExchangeRate     │     │ Calculate PV     │
           │                  │              │ Service          │     │ with BigDecimal  │
           │ resolve(type)    │              │                  │     │                  │
           │       │          │              │ getRate(BRL,USD) │     │ PV = FV /        │
           │       ▼          │              │       │          │     │ (1+r+s)^t        │
           │ DuplicataStrategy│              │       ▼          │     │                  │
           │ spread = 1.5%    │              │ rate = 5.25      │     │                  │
           └──────────────────┘              └──────────────────┘     └──────────────────┘
                    │                                   │                       │
                    └───────────────────────────────────┼───────────────────────┘
                                                        ▼
                                               ┌──────────────────┐
                                               │ Apply Currency   │
                                               │ Conversion       │
                                               │                  │
                                               │ PV_USD = PV_BRL  │
                                               │        / 5.25    │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
┌──────────┐   200 OK                          ┌──────────────────┐
│  Client  │ ◄─────────────────────────────────│ PricingResponse  │
└──────────┘   {presentValue: 1876.54,         │                  │
               presentValueConverted: 357.43,  │ faceValue        │
               exchangeRate: 5.25,             │ presentValue     │
               spreadApplied: 0.015,           │ discount         │
               discountPercent: 12.34%}        │ rates applied    │
                                               └──────────────────┘
```

---

## 📚 Referências

- [C4 Model - Simon Brown](https://c4model.com/)
- [Structurizr - C4 Tooling](https://structurizr.com/)
- [PlantUML C4](https://github.com/plantuml-stdlib/C4-PlantUML)

