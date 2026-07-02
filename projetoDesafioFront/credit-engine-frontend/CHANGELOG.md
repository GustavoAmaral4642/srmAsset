# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado
- Domínio Currency (Gestão de Câmbio)
- Domínio Pricing (Simulador de Precificação)
- Domínio Transaction (CRUD de Transações)
- Domínio Report (Relatórios Analíticos)
- Layout com Header e Sidebar
- Autenticação e autorização

---

## [0.1.0] - 2026-07-01

### Adicionado
- ✅ Projeto Angular 17.3.2 criado com CLI
- ✅ Configuração de path aliases (`@core`, `@shared`, `@features`, `@environments`)
- ✅ Environments para dev e prod
- ✅ `ApiService` para comunicação HTTP centralizada
- ✅ `ErrorInterceptor` para tratamento global de erros HTTP
- ✅ `ApiErrorResponse` interface compatível com backend Spring Boot
- ✅ Configuração de `HttpClient` com interceptor
- ✅ Documentação completa (Etapa 0 e Etapa 1)
- ✅ README.md profissional
- ✅ LICENSE (MIT)
- ✅ CONTRIBUTING.md com guia de contribuição

### Configurado
- TypeScript strict mode
- SCSS como preprocessador
- Standalone components (Angular 17+)
- Build para desenvolvimento e produção
- File replacements para environments

### Documentado
- `docs/etapa0/README.md` - Setup inicial
- `docs/etapa1/README.md` - Fundação HTTP
- Estrutura do projeto
- Padrões de código
- Como executar e contribuir

---

## Tipos de Mudanças

- `Added` (Adicionado) para novas funcionalidades
- `Changed` (Modificado) para mudanças em funcionalidades existentes
- `Deprecated` (Descontinuado) para funcionalidades que serão removidas
- `Removed` (Removido) para funcionalidades removidas
- `Fixed` (Corrigido) para correções de bugs
- `Security` (Segurança) para vulnerabilidades corrigidas

---

[Unreleased]: https://github.com/seu-usuario/credit-engine-frontend/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/seu-usuario/credit-engine-frontend/releases/tag/v0.1.0
