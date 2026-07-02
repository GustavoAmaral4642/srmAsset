# 🚀 Guia Rápido: Deploy no GitHub

Este guia mostra como subir o projeto para o GitHub pela primeira vez.

---

## 📋 Pré-requisitos

- Git instalado ([Download](https://git-scm.com/))
- Conta no GitHub ([Criar conta](https://github.com/join))

---

## 🎯 Passo a Passo

### 1. Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name:** `credit-engine-frontend`
   - **Description:** `Plataforma de Cessão de Crédito Multimoedas - Frontend Angular`
   - **Visibility:** Público ou Privado (sua escolha)
   - ⚠️ **NÃO** marque "Initialize with README" (já temos um)
3. Clique em **Create repository**

---

### 2. Inicializar Git Local

```bash
# Navegue até a pasta do projeto
cd D:\Desenvolvimento\Projetos\srmAsset\projetoDesafioFront\credit-engine-frontend

# Inicialize o repositório Git
git init

# Configure seu nome e email (se ainda não fez)
git config user.name "Seu Nome"
git config user.email "seu-email@example.com"
```

---

### 3. Fazer o Primeiro Commit

```bash
# Adicione todos os arquivos
git add .

# Verifique o que será commitado
git status

# Faça o commit inicial
git commit -m "feat: setup inicial do projeto Angular 17

- Configuração do projeto com routing e SCSS
- Path aliases configurados (@core, @shared, @features, @environments)
- ApiService para comunicação HTTP
- ErrorInterceptor para tratamento global de erros
- Documentação completa (Etapa 0 e Etapa 1)
- README, LICENSE, CONTRIBUTING e CHANGELOG"
```

---

### 4. Conectar ao GitHub

```bash
# Adicione o remote (substitua SEU-USUARIO pelo seu usuário GitHub)
git remote add origin https://github.com/SEU-USUARIO/credit-engine-frontend.git

# Verifique se foi adicionado corretamente
git remote -v
```

---

### 5. Push Inicial

```bash
# Renomeie a branch para 'main' (padrão GitHub)
git branch -M main

# Faça o push inicial
git push -u origin main
```

---

### 6. Criar Tag de Versão (Opcional)

```bash
# Crie uma tag para a versão 0.1.0
git tag -a v0.1.0 -m "Release v0.1.0: Fundação HTTP e Setup Inicial"

# Envie a tag para o GitHub
git push origin v0.1.0
```

---

## ✅ Verificar

1. Acesse `https://github.com/SEU-USUARIO/credit-engine-frontend`
2. Você deve ver:
   - ✅ README formatado
   - ✅ Estrutura de pastas
   - ✅ Badge de licença MIT
   - ✅ Tag v0.1.0 (se criou)

---

## 🔄 Próximos Commits

Para commits futuros:

```bash
# Faça suas mudanças...

# Adicione os arquivos modificados
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona domínio Currency"

# Push
git push
```

---

## 📝 Boas Práticas de Commit

Use **Conventional Commits**:

```bash
# Nova funcionalidade
git commit -m "feat: adiciona formulário de taxa de câmbio"

# Correção de bug
git commit -m "fix: corrige validação do campo valor"

# Documentação
git commit -m "docs: atualiza README com instruções de API"

# Refatoração
git commit -m "refactor: extrai lógica para service separado"

# Testes
git commit -m "test: adiciona testes para PricingService"

# Configuração/Build
git commit -m "chore: atualiza Angular para versão 17.3.3"
```

---

## 🔗 Configurar GitHub Pages (Opcional)

Para hospedar a aplicação gratuitamente:

```bash
# Instale o pacote angular-cli-ghpages
npm install -g angular-cli-ghpages

# Build de produção
ng build --configuration=production --base-href=/credit-engine-frontend/

# Deploy para gh-pages
npx angular-cli-ghpages --dir=dist/credit-engine-frontend
```

Acesse: `https://SEU-USUARIO.github.io/credit-engine-frontend/`

---

## 🐛 Problemas Comuns

### Erro: "remote origin already exists"

```bash
# Remove o remote existente
git remote remove origin

# Adicione novamente
git remote add origin https://github.com/SEU-USUARIO/credit-engine-frontend.git
```

### Erro: "permission denied"

Use HTTPS em vez de SSH ou configure SSH keys:
- [Guia de SSH GitHub](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh)

### Arquivos grandes

Se tiver arquivos grandes (>100MB), use Git LFS:
```bash
git lfs install
git lfs track "*.zip"
git add .gitattributes
```

---

## 📚 Recursos

- [GitHub Docs](https://docs.github.com/pt)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/)

---

**Pronto! Seu projeto está no GitHub! 🎉**
