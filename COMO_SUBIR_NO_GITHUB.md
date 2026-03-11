# 📤 Como Baixar e Subir no GitHub

Guia passo a passo para fazer download do projeto e fazer upload no GitHub.

---

## 📥 PASSO 1: Baixar o Projeto

### Opção A: Pelo Figma Make (Mais Fácil)

1. No Figma Make, procure o botão **"Download"** ou **"Export"**
2. Faça download de todo o projeto como `.zip`
3. Extraia o arquivo em uma pasta no seu computador

### Opção B: Copiar Manualmente

Se não houver botão de download, você precisará copiar os arquivos manualmente.

---

## 🔧 PASSO 2: Preparar o Ambiente Local

### 1. Instalar Node.js (se não tiver)

- Baixe em: https://nodejs.org/
- Versão recomendada: **LTS (Long Term Support)**
- Execute o instalador e siga as instruções

### 2. Instalar Git (se não tiver)

- Baixe em: https://git-scm.com/
- Execute o instalador e siga as instruções

### 3. Verificar Instalação

Abra o **terminal** (Prompt de Comando no Windows) e execute:

```bash
node --version
npm --version
git --version
```

Se todos mostrarem uma versão, está tudo pronto! ✅

---

## 📁 PASSO 3: Instalar Dependências

1. Abra o terminal na pasta do projeto:
   - **Windows:** Clique com botão direito na pasta → "Abrir no Terminal"
   - **Mac/Linux:** Navegue até a pasta usando `cd`

2. Execute:

```bash
npm install
```

Aguarde alguns minutos enquanto as dependências são instaladas.

---

## 🐙 PASSO 4: Criar Repositório no GitHub

### 1. Acessar GitHub

- Vá em: https://github.com/
- Faça login (ou crie uma conta se não tiver)

### 2. Criar Novo Repositório

1. Clique no **+** (canto superior direito) → **New repository**

2. Preencha:
   - **Repository name:** `adac-orcamentos` (ou o nome que preferir)
   - **Description:** "Sistema de Orçamentos - ADAC Farias Estofados"
   - **Visibilidade:**
     - ✅ **Private** (Recomendado - apenas você vê)
     - ou **Public** (qualquer um pode ver)
   - **NÃO** marque nenhuma das caixas:
     - [ ] Add a README file
     - [ ] Add .gitignore
     - [ ] Choose a license

3. Clique em: **Create repository**

### 3. Copiar URL do Repositório

Você verá uma página com instruções. Copie a URL que aparece, algo como:

```
https://github.com/SEU_USUARIO/adac-orcamentos.git
```

---

## 📤 PASSO 5: Fazer Upload do Projeto

Agora, no **terminal** (dentro da pasta do projeto), execute os seguintes comandos:

### 1. Inicializar Git

```bash
git init
```

### 2. Adicionar Todos os Arquivos

```bash
git add .
```

### 3. Fazer o Primeiro Commit

```bash
git commit -m "Initial commit - Sistema ADAC Orçamentos"
```

### 4. Conectar ao GitHub

Substitua `SEU_USUARIO` e `adac-orcamentos` pela URL que você copiou:

```bash
git remote add origin https://github.com/SEU_USUARIO/adac-orcamentos.git
```

### 5. Fazer o Upload

```bash
git branch -M main
git push -u origin main
```

### 6. Autenticação

O GitHub vai pedir sua autenticação:

- **Usuário:** seu username do GitHub
- **Senha:** você precisa usar um **Personal Access Token** (não a senha da conta)

#### Como criar um Personal Access Token:

1. No GitHub, clique na sua foto (canto superior direito)
2. **Settings** → **Developer settings** (no final da barra lateral)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. Preencha:
   - **Note:** "ADAC Orcamentos"
   - **Expiration:** 90 days (ou quanto quiser)
   - **Scopes:** Marque apenas **repo** (todas as sub-opções)
6. Clique em: **Generate token**
7. **COPIE O TOKEN** (você não verá ele novamente!)
8. Use esse token como "senha" no terminal

---

## ✅ PRONTO! Projeto no GitHub

Acesse: `https://github.com/SEU_USUARIO/adac-orcamentos`

Você verá todos os arquivos do projeto online! 🎉

---

## 🔄 PASSO 6: Atualizações Futuras

Quando fizer alterações no projeto e quiser atualizar o GitHub:

```bash
# 1. Adicionar arquivos modificados
git add .

# 2. Criar commit com mensagem descritiva
git commit -m "Descrição do que você mudou"

# 3. Enviar para o GitHub
git push
```

---

## 🚀 PASSO 7: Deploy no Vercel

Agora que está no GitHub, você pode fazer deploy no Vercel:

### 1. Acessar Vercel

- Vá em: https://vercel.com/
- Clique em **Sign Up** ou **Log In**
- Escolha: **Continue with GitHub**

### 2. Importar Projeto

1. Clique em: **Add New** → **Project**
2. Procure: `adac-orcamentos` na lista
3. Clique em: **Import**

### 3. Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```
VITE_FIREBASE_API_KEY = AIzaSyCPRSVzdMERazzGzEC5l5wBtOeWkiJ2KEA
VITE_FIREBASE_AUTH_DOMAIN = adac-orcamentos.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = adac-orcamentos
VITE_FIREBASE_STORAGE_BUCKET = adac-orcamentos.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 88426956432
VITE_FIREBASE_APP_ID = 1:88426956432:web:cec4911a0e4d7826aaba15
```

### 4. Deploy

1. Clique em: **Deploy**
2. Aguarde 2-3 minutos
3. 🎉 **Pronto!** Seu site está online

### 5. Copiar URL

Você receberá uma URL como:

```
https://adac-orcamentos.vercel.app
```

Essa é a URL do seu site! 🌐

---

## 🔐 IMPORTANTE: Segurança

### ⚠️ Arquivo .env

O arquivo `.env` **NÃO** será enviado para o GitHub (está no `.gitignore`).

Isso é uma medida de segurança para proteger suas chaves.

### ✅ Variáveis no Vercel

Configure as mesmas variáveis no Vercel (Passo 7.3) para funcionar online.

---

## 📋 Checklist Final

- [ ] Node.js instalado
- [ ] Git instalado
- [ ] Projeto baixado e extraído
- [ ] `npm install` executado com sucesso
- [ ] Repositório criado no GitHub
- [ ] Personal Access Token criado
- [ ] `git init` executado
- [ ] `git add .` executado
- [ ] `git commit` executado
- [ ] `git remote add origin` executado
- [ ] `git push` executado com sucesso
- [ ] Projeto visível no GitHub
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site acessível online

---

## 🆘 Problemas Comuns

### "git: command not found"
→ Git não está instalado. Instale em: https://git-scm.com/

### "Authentication failed"
→ Use um Personal Access Token ao invés da senha da conta

### "npm install" muito lento
→ É normal, pode demorar 5-10 minutos na primeira vez

### "Permission denied"
→ No Windows, execute o terminal como Administrador

### "Cannot find module"
→ Execute `npm install` novamente

---

## 📞 Suporte

Se tiver dúvidas, consulte:
- 📖 `GUIA_DEPLOY_VERCEL.md`
- ✅ `CHECKLIST_DEPLOY.md`
- 🎯 `PROXIMO_PASSO.md`

---

**Boa sorte! 🚀**
