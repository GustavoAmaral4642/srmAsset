# Documentação de Uso de IA (AI_USAGE.md)

## 📋 Visão Geral

Este documento registra o uso de Inteligência Artificial (LLMs) durante o desenvolvimento do projeto **Credit Engine**, conforme política definida no desafio técnico.

---

## 🤖 Ferramentas de IA Utilizadas

| Ferramenta | Versão/Modelo | Uso Principal |
|------------|---------------|---------------|
| GitHub Copilot | Claude | Scaffolding, documentação, revisão de código |

---

## 📝 Prompts Estratégicos Utilizados

### 1. Arquitetura e Estrutura do Projeto

**Prompt:**
> "Crie um plano de implementação para um sistema de cessão de crédito multimoedas em Java Spring Boot, usando Layered Architecture + DDD Lite, dividido em etapas atômicas pequenas para commits incrementais."

**Resultado:**
- Estrutura de pastas organizada por domínio
- Fases de implementação bem definidas
- Separação clara de responsabilidades

**Avaliação:** ✅ Útil - Economizou tempo na definição arquitetural

---

### 2. Geração de Documentação Técnica

**Prompt:**
> "Explique Layered Architecture + DDD Lite com diagramas ASCII para documentação markdown, focando em por que essa combinação é adequada para APIs REST financeiras."

**Resultado:**
- Documentação ARCHITECTURE.md completa
- Diagramas de fluxo e estrutura
- Comparação com outras arquiteturas

**Avaliação:** ✅ Muito útil - Documentação clara e didática

---

### 3. Modelagem de Dados

**Prompt:**
> "Crie um diagrama ER para um sistema de cessão de crédito com suporte a múltiplas moedas, incluindo precisão adequada para valores financeiros e campos de auditoria."

**Resultado:**
- DDL completo com tipos corretos
- Constraints de validação
- Índices para relatórios

**Avaliação:** ✅ Útil - Precisou ajuste em algumas constraints

---

### 4. Exception Handling

**Prompt:**
> "Crie um GlobalExceptionHandler para Spring Boot que trate exceções de negócio, validação, concorrência e infraestrutura com respostas padronizadas RFC 7807."

**Resultado:**
- Handler completo com múltiplos métodos
- DTO de erro estruturado
- Logs apropriados por tipo de erro

**Avaliação:** ✅ Útil - Código funcional sem ajustes

---

## ⚠️ Correções Necessárias (Alucinações/Erros)

### 1. Dependência Incorreta de Spring Boot

**Problema:** IA sugeriu `spring-boot-starter-webmvc` que não existe  
**Correção:** Substituído por `spring-boot-starter-web`  
**Impacto:** Baixo - Detectado na compilação

---

### 2. Versão de Spring Boot Futura

**Problema:** POM inicial tinha `spring-boot-starter-parent:4.0.7`  
**Correção:** Ajustado para `3.3.1` (versão estável atual)  
**Impacto:** Médio - Poderia quebrar build em CI

---

### 3. Sugestão de Lombok com Records

**Problema:** IA misturou `@Builder` de Lombok com Java Records em alguns casos  
**Correção:** Separado corretamente - Lombok para classes mutáveis, Records para DTOs imutáveis  
**Impacto:** Baixo - Questão de estilo

---

## 📊 Análise de Produtividade

### Onde a IA Economizou Tempo

| Tarefa | Tempo Estimado Manual | Tempo com IA | Economia |
|--------|----------------------|--------------|----------|
| Estrutura de pastas | 30 min | 5 min | 83% |
| pom.xml completo | 45 min | 10 min | 78% |
| GlobalExceptionHandler | 60 min | 15 min | 75% |
| Documentação (ARCH, ER, C4) | 4h | 45 min | 81% |
| DDL com constraints | 90 min | 20 min | 78% |
| ADRs | 60 min | 15 min | 75% |

**Economia Total Estimada:** ~6 horas

### Onde a IA Atrapalhou ou Não Ajudou

| Situação | Problema | Solução |
|----------|----------|---------|
| Lógica de BigDecimal para cálculos | Sugestões genéricas sem MathContext | Implementação manual com RoundingMode.HALF_EVEN |
| Configurações específicas de PostgreSQL | Misturou sintaxe com outros bancos | Revisão manual da documentação oficial |
| Testes de integração com Testcontainers | Configuração parcialmente incorreta | Seguir documentação oficial do Testcontainers |

---

## 🔒 Revisão de Segurança

Todos os trechos gerados por IA foram revisados para:

- [ ] Sem credenciais hardcoded
- [ ] Input validation presente
- [ ] SQL injection prevention (uso de JPA/PreparedStatements)
- [ ] Logs não expõem dados sensíveis
- [ ] Exception messages não vazam stack traces em produção

---

## 🎓 Lições Aprendidas

1. **IA acelera scaffolding, não substitui design**
   - Estrutura e boilerplate são pontos fortes
   - Decisões críticas de negócio requerem expertise humana

2. **Sempre validar dependências e versões**
   - LLMs podem sugerir versões inexistentes ou futuras
   - Verificar compatibilidade no Maven Central

3. **Código financeiro precisa de revisão extra**
   - BigDecimal e precisão requerem atenção manual
   - Regras de arredondamento (banker's rounding) não são default

4. **Documentação é ponto forte**
   - Markdown, diagramas ASCII, ADRs
   - Economiza muito tempo sem comprometer qualidade

---

## 📜 Declaração de Autoria

Declaro que:

1. Compreendo 100% do código presente neste repositório
2. Sou capaz de explicar e defender cada decisão técnica
3. A IA foi usada como ferramenta de produtividade, não como substituto de conhecimento
4. Todos os trechos gerados foram revisados, testados e validados

**Autor:** [Nome do Desenvolvedor]  
**Data:** 2026-07-01

