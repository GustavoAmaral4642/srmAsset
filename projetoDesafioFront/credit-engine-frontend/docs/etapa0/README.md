# 📘 Etapa 0: Setup Inicial

> **Data:** 2026-07-01  
> **Versão Angular:** 17.3.2  
> **Status:** ✅ Concluída

---

## 🎯 Objetivo

Criar a estrutura base do projeto Angular com configurações essenciais para desenvolvimento.

---

## ✅ Atividades Realizadas

### 1. Criação do Projeto Angular

```powershell
ng new credit-engine-frontend --routing --style=scss --skip-git
```

**Configurações escolhidas:**
- ✅ Routing habilitado
- ✅ SCSS como preprocessador
- ❌ Server-Side Rendering (SSR) desabilitado
- ❌ Git desabilitado (será configurado posteriormente)

**Resultado:**
- Projeto criado em: `D:\Desenvolvimento\Projetos\srmAsset\projetoDesafioFront\credit-engine-frontend`
- Estrutura padrão do Angular 17 (Standalone Components)

---

### 2. Configuração de Path Aliases

**Arquivo modificado:** `tsconfig.json`

Adicionado `baseUrl` e `paths` para imports limpos:

```json
{
  "baseUrl": "./",
  "paths": {
    "@core/*": ["src/app/core/*"],
    "@shared/*": ["src/app/shared/*"],
    "@features/*": ["src/app/features/*"],
    "@environments/*": ["src/environments/*"]
  }
}
```

**Benefícios:**
- ✅ Imports mais legíveis
- ✅ Facilita refatoração
- ✅ Evita imports relativos complexos (`../../..`)

**Exemplo de uso:**
```typescript
// Antes
import { ApiService } from '../../core/services/api.service';

// Depois
import { ApiService } from '@core/services/api.service';
```

---

### 3. Configuração de Environments

**Arquivos criados:**

#### `src/environments/environment.ts` (Desenvolvimento)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

#### `src/environments/environment.prod.ts` (Produção)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.creditengine.com/api'
};
```

**Integração com Backend:**
- Backend rodando em: `http://localhost:8080/api`
- Swagger disponível em: `http://localhost:8080/swagger-ui.html`

---

## 📁 Estrutura do Projeto Criada

```
credit-engine-frontend/
├── docs/                           # 📚 Documentação (NOVO)
│   └── etapa0/
│       └── README.md               # Este arquivo
├── src/
│   ├── app/
│   │   ├── app.component.ts        # Componente raiz
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts           # Configuração standalone
│   │   └── app.routes.ts           # Rotas principais
│   ├── environments/               # 🌍 Ambientes (NOVO)
│   │   ├── environment.ts          # Dev
│   │   └── environment.prod.ts     # Prod
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json                    # Configuração CLI
├── package.json
├── tsconfig.json                   # ✨ Modificado (paths)
└── README.md
```

---

## 🔧 Tecnologias Configuradas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Angular CLI | 17.3.2 | Framework base |
| Node.js | 18.19.1 | Runtime JavaScript |
| npm | 10.2.4 | Gerenciador de pacotes |
| TypeScript | ~5.2.2 | Linguagem tipada |
| SCSS | - | Preprocessador CSS |

---

## 🚀 Como Executar

### Desenvolvimento
```powershell
cd credit-engine-frontend
ng serve
```

Aplicação disponível em: `http://localhost:4200`

### Build de Produção
```powershell
ng build --configuration=production
```

Arquivos gerados em: `dist/credit-engine-frontend/`

---

## 📝 Próximos Passos

**Etapa 1: Core (Fundação Mínima)**
- [ ] Criar `ApiService` (base HTTP)
- [ ] Criar `ErrorInterceptor` (tratamento global)
- [ ] Criar modelos de erro (`ApiErrorResponse`)

**Estrutura a ser criada:**
```
src/app/
└── core/
    ├── services/
    │   └── api.service.ts
    ├── interceptors/
    │   └── error.interceptor.ts
    └── models/
        └── api-error.model.ts
```

---

## 📚 Decisões Técnicas

### Por que Angular 17?
- ✅ Suporte a Standalone Components (sem módulos)
- ✅ Melhorias de performance (Signals)
- ✅ Melhor TypeScript integration
- ✅ Compatível com projeto backend Spring Boot

### Por que SCSS?
- ✅ Variáveis e mixins
- ✅ Nesting de seletores
- ✅ Reutilização de código
- ✅ Fácil migração para Design System

### Por que Path Aliases?
- ✅ Código mais limpo e legível
- ✅ Facilita manutenção em projetos grandes
- ✅ Padrão de mercado em projetos enterprise

---

## 🔗 Referências

- [Angular Documentation](https://angular.io/docs)
- [Backend API](http://localhost:8080/swagger-ui.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Guide](https://sass-lang.com/guide)

---

**✅ Etapa 0 concluída com sucesso!**
