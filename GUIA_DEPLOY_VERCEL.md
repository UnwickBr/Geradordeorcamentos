# 🚀 Guia Completo: Deploy no Vercel com Google Login

## 📋 Pré-requisitos

Antes de começar, você precisa:
1. Uma conta no [Vercel](https://vercel.com) (gratuita)
2. Uma conta no [Google Cloud Console](https://console.cloud.google.com) (gratuita)
3. Uma conta no [Firebase](https://console.firebase.google.com) (gratuita)

---

## 🔥 PASSO 1: Configurar Firebase

### 1.1 Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `adac-orcamentos` (ou o nome que preferir)
4. Desabilite o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 1.2 Configurar Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Vamos começar"**
3. Clique na aba **"Sign-in method"**
4. Clique em **"Google"**
5. **Ative** o provedor Google
6. Escolha um **email de suporte** (seu email)
7. Clique em **"Salvar"**

### 1.3 Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de **engrenagem ⚙️**
2. Clique em **"Configurações do projeto"**
3. Role até **"Seus aplicativos"**
4. Clique no ícone **</>** (Web)
5. Nome do app: `ADAC Orçamentos Web`
6. Clique em **"Registrar app"**
7. **COPIE** todas as configurações que aparecerem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**⚠️ IMPORTANTE: Guarde essas informações! Você vai precisar delas no Vercel.**

---

## 🌐 PASSO 2: Configurar Google OAuth

### 2.1 Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. No topo da página, clique no **nome do projeto atual**
3. Selecione o **mesmo projeto que você criou no Firebase**
   - Ele aparecerá na lista com o mesmo nome
   - Ou clique em **"ABRIR"** se aparecer um banner do Firebase

### 2.2 Configurar Tela de Consentimento

1. No menu lateral (☰), vá em: **APIs e serviços** → **Tela de consentimento OAuth**
2. Selecione **"Externo"**
3. Clique em **"Criar"**
4. Preencha:
   - **Nome do app**: ADAC - Farias Estofados
   - **Email de suporte do usuário**: seu email
   - **Logo do app**: (opcional)
   - **Domínio do app**: (deixe em branco por enquanto)
   - **Domínios autorizados**: (vamos adicionar depois do deploy)
   - **Informações de contato do desenvolvedor**: seu email
5. Clique em **"Salvar e continuar"**
6. Em **"Escopos"**, clique em **"Salvar e continuar"** (sem adicionar nada)
7. Em **"Usuários de teste"**, clique em **"Salvar e continuar"**
8. Clique em **"Voltar para o painel"**

### 2.3 Criar Credenciais OAuth

1. No menu lateral, vá em: **APIs e serviços** → **Credenciais**
2. Clique em **"+ Criar credenciais"** → **"ID do cliente OAuth 2.0"**
3. Tipo de aplicativo: **"Aplicativo da Web"**
4. Nome: `ADAC Web Client`
5. Em **"Origens JavaScript autorizadas"**, adicione:
   ```
   http://localhost:5173
   ```
   *(Vamos adicionar a URL do Vercel depois do deploy)*

6. Em **"URIs de redirecionamento autorizados"**, adicione:
   ```
   http://localhost:5173
   ```
   *(Vamos adicionar a URL do Firebase depois)*

7. Clique em **"Criar"**
8. **IGNORE** as credenciais que aparecem (não precisamos delas)
9. Clique em **"OK"**

---

## 🚀 PASSO 3: Deploy no Vercel

### 3.1 Fazer Deploy

1. Acesse: https://vercel.com
2. Faça login com sua conta
3. Clique em **"Add New"** → **"Project"**
4. Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
   - **OU** importe diretamente do Figma Make (se disponível)
5. Selecione o repositório do projeto
6. Em **"Build and Output Settings"**:
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `dist` (já configurado)

### 3.2 Adicionar Variáveis de Ambiente

**ANTES DE FAZER DEPLOY**, clique em **"Environment Variables"** e adicione:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | *Cole o apiKey do Firebase* |
| `VITE_FIREBASE_AUTH_DOMAIN` | *Cole o authDomain do Firebase* |
| `VITE_FIREBASE_PROJECT_ID` | *Cole o projectId do Firebase* |
| `VITE_FIREBASE_STORAGE_BUCKET` | *Cole o storageBucket do Firebase* |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | *Cole o messagingSenderId do Firebase* |
| `VITE_FIREBASE_APP_ID` | *Cole o appId do Firebase* |

**Exemplo:**
```
VITE_FIREBASE_API_KEY = AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN = adac-orcamentos.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = adac-orcamentos
VITE_FIREBASE_STORAGE_BUCKET = adac-orcamentos.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789012
VITE_FIREBASE_APP_ID = 1:123456789012:web:abcdef123456
```

### 3.3 Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Quando terminar, você verá: **"Congratulations! 🎉"**
4. Clique em **"Visit"** para ver seu site online
5. **COPIE A URL** (exemplo: `https://adac-orcamentos.vercel.app`)

---

## 🔧 PASSO 4: Atualizar Configurações com a URL do Vercel

### 4.1 Atualizar Firebase

1. Volte ao [Firebase Console](https://console.firebase.google.com)
2. Vá em **Authentication** → **Sign-in method**
3. Clique em **"Google"**
4. Em **"Domínios autorizados"**, clique em **"Adicionar domínio"**
5. Cole a URL do Vercel: `adac-orcamentos.vercel.app` (sem https://)
6. Clique em **"Adicionar"**

### 4.2 Atualizar Google Cloud Console

1. Volte ao [Google Cloud Console](https://console.cloud.google.com)
2. Vá em **APIs e serviços** → **Credenciais**
3. Clique no **nome do cliente OAuth** que você criou
4. Em **"Origens JavaScript autorizadas"**, clique em **"+ Adicionar URI"**
5. Cole: `https://adac-orcamentos.vercel.app` (com https://)
6. Em **"URIs de redirecionamento autorizados"**, clique em **"+ Adicionar URI"**
7. Cole: `https://adac-orcamentos.firebaseapp.com/__/auth/handler`
8. Clique em **"Salvar"**

### 4.3 Atualizar Tela de Consentimento

1. Ainda no Google Cloud Console
2. Vá em **APIs e serviços** → **Tela de consentimento OAuth**
3. Clique em **"Editar app"**
4. Em **"Domínios autorizados"**, adicione:
   ```
   vercel.app
   firebaseapp.com
   ```
5. Clique em **"Salvar e continuar"** até o final

---

## ✅ PASSO 5: Testar o Sistema

### 5.1 Testar Login Normal

1. Acesse seu site no Vercel
2. Tente fazer login com:
   - **Usuário**: `unwick`
   - **Senha**: `01043678vV@`
3. ✅ Deve funcionar normalmente

### 5.2 Testar Login com Google

1. Na tela de login, clique em **"Entrar com o Google"**
2. Escolha sua conta Google
3. Aceite as permissões
4. ✅ Você deve ser redirecionado para o sistema

### 5.3 Criar Novo Usuário com Google

1. Na tela de cadastro, clique em **"Criar conta com o Google"**
2. Escolha sua conta Google
3. ✅ Conta criada e login automático

---

## 🎉 Pronto! Sistema Publicado

Seu sistema está online com:
- ✅ Login tradicional (usuário/senha)
- ✅ Login com Google
- ✅ Geração de orçamentos
- ✅ Sistema de assinaturas
- ✅ Pagamentos via Asaas
- ✅ Modo noturno

---

## 🔐 Segurança

### Dados Importantes:

1. **Login Admin**:
   - Usuário: `unwick`
   - Senha: `01043678vV@`

2. **Onde os dados ficam salvos?**
   - Todos os dados ficam no `localStorage` do navegador
   - Cada usuário vê apenas seus dados
   - Admin vê todos os orçamentos

3. **Backup dos dados**:
   - ⚠️ Os dados são locais (navegador do usuário)
   - Se limpar o cache, perde os dados
   - Recomendo adicionar backup em banco de dados futuramente

---

## 📱 URLs Importantes

Salve essas URLs:

- **Site publicado**: `https://seu-projeto.vercel.app`
- **Firebase Console**: https://console.firebase.google.com
- **Google Cloud Console**: https://console.cloud.google.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## ⚙️ Comandos Úteis

### Atualizar o site após mudanças:

1. Faça as alterações no código
2. Commit e push para o Git
3. O Vercel faz deploy automático! 🚀

### Redeploy manual:

1. Vá em: https://vercel.com/dashboard
2. Clique no projeto
3. Clique em **"Deployments"**
4. Clique nos **três pontinhos** do último deploy
5. Clique em **"Redeploy"**

---

## 🆘 Problemas Comuns

### ❌ "Firebase: Error (auth/unauthorized-domain)"

**Solução:**
1. Vá no Firebase Console → Authentication → Settings
2. Em "Authorized domains", adicione seu domínio do Vercel

### ❌ "Error 400: redirect_uri_mismatch"

**Solução:**
1. Vá no Google Cloud Console → Credenciais
2. Edite o OAuth Client
3. Adicione: `https://seu-projeto.firebaseapp.com/__/auth/handler`

### ❌ Login Google não abre popup

**Solução:**
1. Verifique se as variáveis de ambiente estão corretas
2. Limpe o cache do navegador
3. Tente em modo anônimo

---

## 📞 Suporte

Se tiver problemas:
1. Verifique o Console do navegador (F12) para erros
2. Verifique os logs no Vercel Dashboard
3. Confira se todas as variáveis de ambiente foram configuradas

---

**Criado em**: 11 de março de 2026  
**Status**: ✅ Pronto para produção
