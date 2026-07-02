# 💰 Credit Engine - Frontend

> Plataforma de Cessão de Crédito Multimoedas (BRL/USD) para Fundos de Investimento em Direitos Creditórios (FIDCs)

[![Angular](https://img.shields.io/badge/Angular-17.3.2-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Sobre o Projeto

Frontend da plataforma **Credit Engine**, um sistema robusto para precificação e liquidação de ativos financeiros (duplicatas, contratos, recebíveis) com suporte a operações multimoedas.

### 🎯 Objetivo

Prover uma interface moderna e intuitiva para:
- 💱 Gestão de taxas de câmbio (USD/BRL)
- 📊 Simulação de precificação com cálculo de deságio
- 💳 Registro e acompanhamento de transações
- 📈 Relatórios analíticos de liquidação

### 🏗️ Arquitetura

- **Pattern:** Domain-Driven Feature Modules
- **Comunicação:** RESTful API com backend Spring Boot
- **Estado:** Services com RxJS Observables
- **Estilo:** SCSS com variáveis customizadas

---

## 🚀 Status do Projeto

### ✅ Etapas Concluídas

- **[Etapa 0](docs/etapa0/README.md)** - Setup Inicial
  - ✅ Projeto Angular 17 criado
  - ✅ Path aliases configurados (`@core`, `@shared`, `@features`, `@environments`)
  - ✅ Environments (dev/prod) configurados
  - ✅ Build validado

- **[Etapa 1](docs/etapa1/README.md)** - Core (Fundação HTTP)
  - ✅ `ApiService` - Cliente HTTP centralizado
  - ✅ `ErrorInterceptor` - Tratamento global de erros
  - ✅ `ApiErrorResponse` - Modelos de erro tipados
  - ✅ `HttpClient` configurado com interceptor

### 🔜 Próximas Etapas

- **Etapa 2** - Shared (Componentes Reutilizáveis)
  - 🔲 Modelos de paginação (Spring Data)
  - 🔲 Pipes de formatação (moeda, porcentagem)
  - 🔲 Enum de moedas (Currency)

- **Etapa 3** - Currency Domain (Câmbio)
  - 🔲 Formulário de cadastro de taxa
  - 🔲 Lista de taxas vigentes
  - 🔲 Service de integração com API

- **Etapa 4** - Pricing Domain (Precificação)
  - 🔲 Simulador de valor presente
  - 🔲 Seletor de tipo de recebível
  - 🔲 Exibição de breakdown do cálculo

- **Etapa 5** - Transaction Domain (Transações)
  - 🔲 Grid paginado com filtros
  - 🔲 Formulário de criação
  - 🔲 Ações de liquidação/cancelamento

- **Etapa 6** - Report Domain (Relatórios)
  - 🔲 Extrato de liquidações
  - 🔲 Filtros avançados
  - 🔲 Export para CSV/Excel

- **Etapa 7** - Layout + Shell
  - 🔲 Header com navegação
  - 🔲 Sidebar menu
  - 🔲 Router integration

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Framework** | Angular | 17.3.2 |
| **Linguagem** | TypeScript | 5.2.2 |
| **Estilo** | SCSS | - |
| **Build** | Angular CLI | 17.3.2 |
| **Runtime** | Node.js | 18.19.1 |
| **Package Manager** | npm | 10.2.4 |

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 10+ (incluído com Node.js)
- Angular CLI 17+ (opcional)

### Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/credit-engine-frontend.git
cd credit-engine-frontend
```

### Instalar Dependências

```bash
npm install
```

---

## 🚀 Como Executar

### Desenvolvimento

```bash
npm start
# ou
ng serve
```

Acesse: `http://localhost:4200/`

A aplicação recarrega automaticamente ao salvar arquivos (Hot Reload).

### Build de Produção

```bash
npm run build
# ou
ng build --configuration=production
```

Arquivos gerados em: `dist/credit-engine-frontend/`

### Build de Desenvolvimento

```bash
ng build --configuration=development
```

---

## 📁 Estrutura do Projeto

```
credit-engine-frontend/
├── docs/                           # 📚 Documentação por etapa
│   ├── etapa0/                     # Setup inicial
│   └── etapa1/                     # Core HTTP
├── src/
│   ├── app/
│   │   ├── core/                   # 🔧 Serviços globais
│   │   │   ├── models/             # Modelos compartilhados
│   │   │   ├── services/           # ApiService
│   │   │   └── interceptors/       # ErrorInterceptor
│   │   ├── shared/                 # 🧩 Componentes reutilizáveis (futuro)
│   │   ├── features/               # 🎯 Domínios de negócio (futuro)
│   │   │   ├── currency/
│   │   │   ├── pricing/
│   │   │   ├── transaction/
│   │   │   └── report/
│   │   ├── app.component.ts
│   │   ├── app.config.ts           # Configuração global
│   │   └── app.routes.ts           # Rotas
│   ├── environments/               # 🌍 Configurações de ambiente
│   │   ├── environment.ts          # Dev
│   │   └── environment.prod.ts     # Prod
│   ├── assets/
│   └── styles.scss                 # Estilos globais
├── angular.json                    # Configuração Angular CLI
├── tsconfig.json                   # TypeScript config (com paths)
└── package.json
```

---

## 🔗 Integração com Backend

### URLs Configuradas

| Ambiente | URL da API |
|----------|-----------|
| **Desenvolvimento** | `http://localhost:8080/api` |
| **Produção** | `https://api.creditengine.com/api` |

### Backend Relacionado

- **Repositório:** [credit-engine-backend](https://github.com/seu-usuario/credit-engine-backend)
- **Tecnologia:** Spring Boot 3.3.1 + Java 17
- **Documentação API:** `http://localhost:8080/swagger-ui.html`

### Exemplo de Uso

```typescript
// Injetar ApiService em qualquer component/service
constructor(private api: ApiService) {}

// Fazer requisições tipadas
this.api.get<ExchangeRate[]>('/exchange-rates').subscribe({
  next: (rates) => console.log('Taxas:', rates),
  error: (err) => console.error('Erro:', err) // Tratado pelo interceptor
});
```

---

## 🧪 Testes

### Executar Testes Unitários

```bash
npm test
# ou
ng test
```

### Executar com Cobertura

```bash
ng test --code-coverage
```

---

## 📐 Padrões de Código

### Path Aliases

Use os aliases configurados para imports limpos:

```typescript
// ✅ Correto
import { ApiService } from '@core/services/api.service';
import { environment } from '@environments/environment';

// ❌ Evitar
import { ApiService } from '../../core/services/api.service';
```

### Estrutura de Component

```typescript
@Component({
  selector: 'app-feature-name',
  standalone: true,
  imports: [...],
  templateUrl: './feature-name.component.html',
  styleUrl: './feature-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureNameComponent implements OnInit {
  // Lógica aqui
}
```

### Convenções de Nomenclatura

- **Components:** `kebab-case` (ex: `exchange-rate-form.component.ts`)
- **Services:** `camelCase` com sufixo (ex: `exchangeRate.service.ts`)
- **Models:** `camelCase` com sufixo (ex: `exchangeRate.model.ts`)
- **Interfaces:** `PascalCase` (ex: `ExchangeRateResponse`)

---

## 🤝 Contribuindo

### Workflow

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Commits Convencionais

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de build/config
```

---

## 📖 Documentação

- **[Etapa 0 - Setup](docs/etapa0/README.md)**: Criação do projeto e configurações iniciais
- **[Etapa 1 - Core](docs/etapa1/README.md)**: Fundação HTTP (ApiService, ErrorInterceptor)

---

## 🐛 Issues Conhecidas

Nenhuma no momento.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Seu Nome** - [GitHub](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- Desafio técnico proposto para avaliação de habilidades em desenvolvimento full-stack
- Comunidade Angular pelo excelente framework
- Spring Boot pela API robusta e bem documentada

---

## 📞 Contato

- **Email:** seu-email@example.com
- **LinkedIn:** [Seu Perfil](https://linkedin.com/in/seu-perfil)

---

**Desenvolvido com ❤️ usando Angular 17 + TypeScript**
