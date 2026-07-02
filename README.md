# 🏦 Credit Engine — Plataforma de Cessão de Crédito Multimoedas

> Sistema completo para precificação e liquidação de ativos financeiros (duplicatas, contratos, recebíveis) com suporte a múltiplas moedas (BRL/USD)

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Visão Geral

Este repositório contém a solução **full-stack** desenvolvida como parte de um desafio técnico para posição de **Tech Lead**, demonstrando:

- 🏗️ Arquitetura de software para aplicações financeiras
- 🎯 Padrões de projeto (Strategy, Repository, DTO)
- 📚 Documentação técnica profissional (ADRs, C4, ER)
- ✅ Boas práticas de código e organização
- 🤖 Uso responsável de IA como ferramenta de produtividade

---

## 📁 Estrutura do Monorepo

```
srmAsset/
├── 📂 projetoDesafio/                    # 🔵 Backend (Java/Spring Boot)
│   ├── src/                              # Código-fonte
│   ├── docs/                             # Documentação técnica
│   │   ├── ARCHITECTURE.md               # Arquitetura do sistema
│   │   ├── ER_DIAGRAM.md                 # Modelo de dados
│   │   ├── C4_DIAGRAM.md                 # Diagramas C4
│   │   ├── DDL.sql                       # Scripts SQL
│   │   └── ADR/                          # Architecture Decision Records
│   ├── pom.xml                           # Dependências Maven
│   └── README.md                         # Documentação do backend
│
├── 📂 projetoDesafioFront/               # 🔴 Frontend (Angular)
│   └── credit-engine-frontend/
│       ├── src/                          # Código-fonte
│       ├── docs/                         # Documentação por etapa
│       ├── package.json                  # Dependências npm
│       └── README.md                     # Documentação do frontend
│
└── README.md                             # ⬅️ Este arquivo
```

---

## 🚀 Acesso Rápido

### 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| **Backend** | |
| [📘 README Backend](projetoDesafio/README.md) | Guia completo do backend |
| [🏗️ Arquitetura](projetoDesafio/docs/ARCHITECTURE.md) | Layered Architecture + DDD Lite |
| [📊 Diagrama ER](projetoDesafio/docs/ER_DIAGRAM.md) | Modelo Entidade-Relacionamento |
| [🗺️ Diagrama C4](projetoDesafio/docs/C4_DIAGRAM.md) | Context, Container, Component |
| [💾 DDL.sql](projetoDesafio/docs/DDL.sql) | Scripts de criação do banco |
| [📝 ADR-001](projetoDesafio/docs/ADR/001-escolha-arquitetura.md) | Decisão: Arquitetura |
| [📝 ADR-002](projetoDesafio/docs/ADR/002-escolha-banco-dados.md) | Decisão: Banco de Dados |
| [🤖 AI_USAGE.md](projetoDesafio/AI_USAGE.md) | Uso de IA no desenvolvimento |
| **Frontend** | |
| [📗 README Frontend](projetoDesafioFront/credit-engine-frontend/README.md) | Guia completo do frontend |
| [📋 Etapa 0](projetoDesafioFront/credit-engine-frontend/docs/etapa0/README.md) | Setup inicial |
| [📋 Etapa 1](projetoDesafioFront/credit-engine-frontend/docs/etapa1/README.md) | Core HTTP |

---

## 🛠️ Stack Tecnológica

### Backend — [projetoDesafio/](projetoDesafio/)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| ☕ **Java** | 17 LTS | Linguagem principal |
| 🍃 **Spring Boot** | 3.3.1 | Framework backend |
| 🗄️ **PostgreSQL** | 16+ | Banco de dados |
| 📄 **OpenAPI/Swagger** | 2.5.0 | Documentação da API |
| 🔄 **Resilience4j** | 2.2.0 | Circuit breaker, retry |
| 📊 **Micrometer** | - | Métricas |

### Frontend — [projetoDesafioFront/](projetoDesafioFront/credit-engine-frontend/)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| 🅰️ **Angular** | 17.3.2 | Framework frontend |
| 📘 **TypeScript** | 5.2 | Linguagem |
| 🎨 **SCSS** | - | Estilos |
| 📦 **Node.js** | 18.19.1 | Runtime |

---

## 🚧 Status do Projeto

### Backend (Java/Spring Boot)

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Fundação (Config, Exceptions, OpenAPI) | ✅ Concluída |
| 2 | Currency — Gestão de Câmbio | 🔲 Pendente |
| 3 | Pricing — Motor de Precificação | 🔲 Pendente |
| 4 | Transaction — Liquidação ACID | 🔲 Pendente |
| 5 | Report — Extratos Analíticos | 🔲 Pendente |
| 6 | Observabilidade (Logs, Métricas) | 🔲 Pendente |
| 7 | Infraestrutura (Docker, CI/CD) | 🔲 Pendente |
| 8 | Documentação Técnica | ✅ Concluída |

### Frontend (Angular)

| Etapa | Descrição | Status |
|-------|-----------|--------|
| 0 | Setup Inicial (projeto, environments) | ✅ Concluída |
| 1 | Core (ApiService, ErrorInterceptor) | ✅ Concluída |
| 2 | Shared (Components reutilizáveis) | 🔲 Pendente |
| 3 | Currency Domain | 🔲 Pendente |
| 4 | Pricing Domain | 🔲 Pendente |
| 5 | Transaction Domain | 🔲 Pendente |
| 6 | Report Domain | 🔲 Pendente |
| 7 | Layout + Shell | 🔲 Pendente |

---

## 🚀 Como Executar

### Pré-requisitos

- **Java 17+** ([Download](https://adoptium.net/))
- **Maven 3.9+** ([Download](https://maven.apache.org/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker** (opcional) ([Download](https://www.docker.com/))

### Backend

```bash
# Entrar na pasta do backend
cd projetoDesafio

# Executar (modo dev com H2)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Acessar Swagger UI
open http://localhost:8080/swagger-ui.html
```

### Frontend

```bash
# Entrar na pasta do frontend
cd projetoDesafioFront/credit-engine-frontend

# Instalar dependências
npm install

# Executar (dev server)
npm start

# Acessar aplicação
open http://localhost:4200
```

### Ambos (Full Stack)

```bash
# Terminal 1 - Backend
cd projetoDesafio && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2 - Frontend
cd projetoDesafioFront/credit-engine-frontend && npm start
```

---

## 🔗 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:4200 | Aplicação Angular |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentação interativa |
| **H2 Console** | http://localhost:8080/h2-console | Banco dev (apenas dev) |
| **Health Check** | http://localhost:8080/actuator/health | Status do backend |

---

## 📐 Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Angular)                        │
│                     http://localhost:4200                         │
└─────────────────────────────┬────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                        BACKEND (Spring Boot)                      │
│                     http://localhost:8080                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │  Currency   │  │   Pricing   │  │ Transaction │               │
│  │   Domain    │  │   Domain    │  │   Domain    │               │
│  │ (Câmbio)    │  │(Precificação)│ │ (Liquidação)│               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└─────────────────────────────┬────────────────────────────────────┘
                              │ JDBC
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       PostgreSQL Database                         │
│                        (localhost:5432)                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Conventional Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
refactor: refatoração
test: adição de testes
chore: tarefas de build/config
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja os arquivos LICENSE em cada subprojeto.

---

## 👨‍💻 Autor

**Gustavo Amaral**

- GitHub: [@GustavoAmaral4642](https://github.com/GustavoAmaral4642)

---

<p align="center">
  <strong>🚧 Projeto em desenvolvimento ativo 🚧</strong>
  <br><br>
  Backend: ☕ Java 17 + Spring Boot 3.3.1
  <br>
  Frontend: 🅰️ Angular 17 + TypeScript
</p>

