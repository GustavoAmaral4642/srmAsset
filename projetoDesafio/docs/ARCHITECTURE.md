# Arquitetura: Layered Architecture + DDD Lite

## 📚 Visão Geral

Este projeto utiliza uma combinação de **Layered Architecture** (Arquitetura em Camadas) com conceitos de **Domain-Driven Design (DDD) Lite**, adaptada para uma aplicação de médio porte com foco em clareza e manutenibilidade.

---

## 🏗️ Por que Layered Architecture?

### O que é?

Arquitetura em Camadas é um padrão arquitetural que organiza o código em camadas horizontais, cada uma com responsabilidade bem definida. As camadas se comunicam de forma **unidirecional** (de cima para baixo).

### Camadas do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              (Controllers, DTOs de Request/Response)         │
│    • Recebe requisições HTTP                                 │
│    • Valida entrada (JSR-380)                               │
│    • Converte DTOs ↔ Domain Objects                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                           │
│                   (Services, Strategies)                     │
│    • Contém regras de negócio                               │
│    • Orquestra operações                                    │
│    • Gerencia transações (@Transactional)                   │
│    • Implementa padrões (Strategy, Factory)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                          │
│               (Repositories, Entities, DAOs)                 │
│    • Acessa banco de dados                                  │
│    • Mapeia objetos para tabelas (JPA)                      │
│    • Executa queries nativas (relatórios)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│                      (PostgreSQL)                            │
└─────────────────────────────────────────────────────────────┘
```

### Vantagens

| Benefício | Descrição |
|-----------|-----------|
| **Separação de Responsabilidades** | Cada camada tem um propósito único |
| **Testabilidade** | Camadas podem ser testadas isoladamente |
| **Manutenibilidade** | Mudanças em uma camada não afetam outras |
| **Onboarding** | Desenvolvedores entendem rapidamente a estrutura |
| **Substituibilidade** | Ex: trocar JPA por JDBC sem afetar Services |

### Desvantagens

| Ponto de Atenção | Mitigação |
|------------------|-----------|
| **Over-engineering** para apps simples | Usamos DDD "Lite", não full |
| **Rigidez** em casos muito complexos | Pode evoluir para Hexagonal se necessário |
| **Duplicação** de mapeamentos (DTO ↔ Entity) | Aceitável pelo isolamento que provê |

---

## 🎯 Por que DDD Lite?

### O que é DDD?

**Domain-Driven Design** é uma abordagem de design de software que coloca o domínio de negócio no centro das decisões arquiteturais. Foi criado por Eric Evans em 2003.

### DDD Completo vs DDD Lite

| Conceito | DDD Completo | DDD Lite (Este Projeto) |
|----------|--------------|-------------------------|
| **Bounded Contexts** | Múltiplos contextos isolados | 1 contexto (Monolito Modular) |
| **Aggregates** | Raízes de agregação rígidas | Entities com relacionamentos JPA |
| **Domain Events** | Event Sourcing, CQRS | Não implementado (pode evoluir) |
| **Value Objects** | Imutáveis, sem ID | Usado em DTOs e alguns domínios |
| **Ubiquitous Language** | ✅ Linguagem do negócio no código | ✅ Sim |
| **Repositories** | Interface no domínio | Interface Spring Data no módulo |

### O que utilizamos do DDD

1. **Organização por Domínio/Feature** (não por camada técnica global)
2. **Linguagem Ubíqua** (termos do negócio financeiro no código)
3. **Encapsulamento de Regras** (lógica de negócio na camada de serviço)
4. **Entities com comportamento** (não apenas getters/setters)

---

## 📁 Estrutura de Pastas do Projeto

```
src/main/java/com/projeto/desafio/
│
├── config/                          # 🔧 Configurações transversais
│   ├── GlobalExceptionHandler.java  # Handler de exceções
│   └── OpenApiConfig.java           # Swagger/OpenAPI
│
├── shared/                          # 🔄 Código compartilhado
│   ├── dto/                         # DTOs base (ApiErrorResponse)
│   └── exception/                   # Exceções de negócio
│
├── currency/                        # 💱 DOMÍNIO: Câmbio
│   ├── controller/                  # [PRESENTATION] REST endpoints
│   │   └── ExchangeRateController.java
│   ├── dto/                         # [PRESENTATION] Request/Response
│   │   ├── ExchangeRateRequest.java
│   │   └── ExchangeRateResponse.java
│   ├── service/                     # [BUSINESS] Regras de negócio
│   │   └── ExchangeRateService.java
│   ├── repository/                  # [PERSISTENCE] Acesso a dados
│   │   └── ExchangeRateRepository.java
│   └── entity/                      # [PERSISTENCE] Mapeamento JPA
│       └── ExchangeRate.java
│
├── pricing/                         # 📊 DOMÍNIO: Precificação
│   ├── controller/
│   ├── dto/
│   ├── service/
│   ├── strategy/                    # [BUSINESS] Strategy Pattern
│   │   ├── PricingStrategy.java
│   │   ├── DuplicataMercantilStrategy.java
│   │   └── ChequePreDatadoStrategy.java
│   └── ...
│
├── transaction/                     # 💳 DOMÍNIO: Transações
│   ├── controller/
│   ├── dto/
│   ├── service/
│   ├── repository/
│   └── entity/
│
└── report/                          # 📈 DOMÍNIO: Relatórios
    ├── controller/                  # [PRESENTATION]
    ├── repository/                  # [PERSISTENCE] Query nativa
    └── dto/                         # [PRESENTATION]
    # ⚠️ Sem camada de SERVICE (acesso direto ao repo)
```

### Nota sobre Relatórios

O domínio `report/` tem apenas **2 camadas** (Controller → Repository), pois:
- Não há lógica de negócio complexa
- São consultas read-only
- Performance é prioridade (SQL nativo)

Isso está alinhado com o requisito do case:
> "Relatórios podem ser organizados em duas camadas apenas sem necessidade de passar pela de negócios."

---

## 🔀 Fluxo de uma Requisição

```
[Cliente HTTP]
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  1. CONTROLLER (Presentation Layer)                         │
│     • Recebe POST /api/transactions                         │
│     • Valida @Valid TransactionRequest                      │
│     • Chama transactionService.create(request)              │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. SERVICE (Business Layer)                                │
│     • Busca taxa de câmbio atual                            │
│     • Resolve Strategy por tipo de recebível                │
│     • Calcula valor presente (BigDecimal)                   │
│     • Aplica conversão cambial se cross-currency            │
│     • @Transactional: Persiste Transaction                  │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. REPOSITORY (Persistence Layer)                          │
│     • transactionRepository.save(transaction)               │
│     • JPA/Hibernate executa INSERT                          │
│     • Optimistic Locking via @Version                       │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. DATABASE                                                │
│     • PostgreSQL persiste com ACID                          │
│     • Commit da transação                                   │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. RESPONSE                                                 │
│     • Service retorna Transaction                           │
│     • Controller converte para TransactionResponse          │
│     • HTTP 201 Created com Location header                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🆚 Comparação com Outras Arquiteturas

| Arquitetura | Complexidade | Quando Usar | Este Projeto |
|-------------|--------------|-------------|--------------|
| **MVC Tradicional** | Baixa | Apps simples, CRUDs | ❌ Pouco isolamento |
| **Layered + DDD Lite** | Média | APIs REST, domínio moderado | ✅ Escolhido |
| **Hexagonal (Ports & Adapters)** | Alta | Múltiplas integrações | ❌ Over-engineering |
| **Clean Architecture** | Alta | Domínio muito complexo | ❌ Over-engineering |
| **Microservices** | Muito Alta | Escala massiva, times distintos | ❌ Prematura |

---

## 📏 Regras de Dependência

```
┌────────────────────────────────────────────────────────┐
│                      REGRA DE OURO                      │
│                                                        │
│   Dependências SEMPRE apontam para BAIXO (↓)           │
│   Nunca para cima ou lateralmente entre domínios       │
│                                                        │
└────────────────────────────────────────────────────────┘

✅ Controller → Service → Repository
✅ PricingService → ExchangeRateService (injeção)
❌ Repository → Service
❌ Entity → Controller
❌ CurrencyService → TransactionService (circular!)
```

### Comunicação entre Domínios

Quando um domínio precisa de outro:

```java
// ✅ CORRETO: Service de um domínio injeta Service de outro
@Service
public class PricingService {
    private final ExchangeRateService exchangeRateService;
    
    public PricingResponse calculate(PricingRequest request) {
        BigDecimal rate = exchangeRateService.getCurrentRate("USD", "BRL");
        // ...
    }
}

// ❌ ERRADO: Acessar Repository de outro domínio diretamente
@Service
public class PricingService {
    private final ExchangeRateRepository exchangeRateRepository; // NÃO!
}
```

---

## 🎓 Evolução Futura

Se o projeto crescer, pode evoluir para:

1. **Hexagonal Architecture**: Se precisar de múltiplos adapters (REST, gRPC, Kafka)
2. **CQRS**: Se leitura e escrita tiverem requisitos muito distintos
3. **Event Sourcing**: Se auditoria completa e replay de eventos forem necessários
4. **Microservices**: Se domínios precisarem escalar independentemente

---

## 📖 Referências

- [Martin Fowler - Patterns of Enterprise Application Architecture](https://martinfowler.com/eaaCatalog/)
- [Eric Evans - Domain-Driven Design (Blue Book)](https://www.domainlanguage.com/ddd/)
- [Vernon - Implementing Domain-Driven Design (Red Book)](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577)
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)

