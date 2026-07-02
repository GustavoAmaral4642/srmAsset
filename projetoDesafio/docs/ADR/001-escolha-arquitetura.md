# ADR-001: Escolha da Arquitetura Base

**Status:** Aceito  
**Data:** 2026-07-01  
**Decisores:** Time de Desenvolvimento  

---

## Contexto

O projeto Credit Engine precisa de uma arquitetura que suporte:
- Regras de negócio financeiro complexas (precificação, conversão cambial)
- Alta precisão em cálculos monetários
- Transações ACID com controle de concorrência
- Manutenibilidade e testabilidade
- Evolução gradual conforme requisitos de escala

Precisamos decidir entre várias abordagens arquiteturais.

---

## Opções Consideradas

### Opção 1: MVC Tradicional
```
Controller → Service → Repository (global)
```
**Prós:**
- Simples e familiar
- Baixa curva de aprendizado

**Contras:**
- Pouco isolamento entre domínios
- Services monolíticos tendem a crescer
- Difícil testar regras de negócio isoladamente

---

### Opção 2: Layered Architecture + DDD Lite ✅ (Escolhida)
```
Organização por domínio com 3 camadas por feature
```
**Prós:**
- Separação clara de responsabilidades
- Isolamento por domínio (currency, pricing, transaction)
- Testável em cada camada
- Pode evoluir para Hexagonal se necessário
- Balanceado entre simplicidade e robustez

**Contras:**
- Mais arquivos que MVC puro
- Exige disciplina na separação de responsabilidades

---

### Opção 3: Hexagonal Architecture (Ports & Adapters)
```
Domain Core → Ports → Adapters (REST, JPA, etc)
```
**Prós:**
- Domínio completamente isolado de infraestrutura
- Facilita múltiplos adapters

**Contras:**
- Over-engineering para o escopo atual
- Muitas interfaces/abstrações desnecessárias
- Curva de aprendizado maior

---

### Opção 4: Clean Architecture
```
Entities → Use Cases → Interface Adapters → Frameworks
```
**Prós:**
- Inversão de dependência completa
- Framework-agnostic

**Contras:**
- Ainda mais complexa que Hexagonal
- Excessiva para monolito de médio porte
- Muito boilerplate

---

### Opção 5: Microservices
```
Cada domínio como serviço independente
```
**Prós:**
- Escalabilidade independente
- Deploy independente

**Contras:**
- Prematura para o momento atual
- Complexidade operacional (service mesh, tracing)
- Eventual consistency complica transações ACID

---

## Decisão

**Adotamos Layered Architecture + DDD Lite** porque:

1. **Balanceamento adequado** entre simplicidade e robustez
2. **Organização por domínio** facilita navegação e ownership
3. **3 camadas por domínio** permite testabilidade em cada nível
4. **Evolutivo**: pode migrar para Hexagonal ou Microservices se necessário
5. **Alinhado com Spring Boot**: aproveita convenções do ecossistema

---

## Consequências

### Positivas
- Código organizado por funcionalidade de negócio
- Fácil onboarding de novos desenvolvedores
- Testes unitários e de integração bem delimitados
- Relatórios podem ter arquitetura simplificada (2 camadas)

### Negativas
- Mais pastas/arquivos que MVC tradicional
- Requer documentação clara das responsabilidades
- Dependências entre domínios devem ser gerenciadas

### Riscos Mitigados
- Comunicação entre domínios: via Services (nunca Repositories diretos)
- Acoplamento: revisões de código focam em dependências
- Violação de camadas: testes de arquitetura com ArchUnit (futuro)

---

## Notas

ADR criado seguindo o template de Michael Nygard.  
Referência: https://adr.github.io/

