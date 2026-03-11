# 🔧 Resolver Erro Firebase API Key

## ❌ Erro

```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

---

## ✅ SOLUÇÃO - O que fazer AGORA

### Passo 1: Reiniciar o Servidor de Desenvolvimento

**IMPORTANTE:** Após criar/atualizar o arquivo `.env`, você DEVE reiniciar o servidor!

1. No terminal onde está rodando `npm run dev`:
   - Pressione **Ctrl + C** (Windows/Linux) ou **Cmd + C** (Mac)
   - Aguarde o servidor parar

2. Execute novamente:
   ```bash
   npm run dev
   ```

3. Aguarde o servidor iniciar

4. Teste o Google Login novamente

---

## 🔍 Por que isso aconteceu?

O Vite (ferramenta de build) carrega as variáveis de ambiente apenas quando o servidor inicia. Se você criar ou modificar o arquivo `.env` com o servidor rodando, ele não detecta as mudanças automaticamente.

---

## ✅ Arquivos Criados/Atualizados

- ✅ **`.env`** - Variáveis de ambiente com suas credenciais
- ✅ **`.env.example`** - Template para referência
- ✅ **`/src/config/firebase.ts`** - Configuração atualizada

---

## 🎯 Checklist de Verificação

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] Arquivo `.env` tem todas as variáveis (sem aspas, sem espaços extras)
- [ ] Servidor foi REINICIADO após criar/atualizar `.env`
- [ ] Navegador foi recarregado (F5 ou Ctrl+R)
- [ ] Testou o Google Login novamente

---

## ⚠️ Ainda não funciona?

### Problema: API Key Inválida

A API Key que você forneceu pode não estar ativa no Firebase. Verifique:

#### 1. Verificar se a API Key está correta no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **adac-orcamentos**
3. Clique no ícone de **Engrenagem** ⚙️ → **Configurações do projeto**
4. Role até **Seus aplicativos** → **SDK do Firebase**
5. Verifique se a **apiKey** é: `AIzaSyCPRSVzdMERazzGzEC5l5wBtOeWkiJ2KEA`

Se for diferente, copie a API Key correta e cole no arquivo `.env`

#### 2. Habilitar Authentication no Firebase

1. No Firebase Console, no menu lateral: **Authentication**
2. Clique em: **Começar** (se ainda não iniciou)
3. Vá na aba: **Sign-in method**
4. Clique em: **Google**
5. Ative o botão: **Ativar**
6. Preencha:
   - **Nome do projeto voltado ao público**: ADAC - Farias Estofados
   - **Email de suporte do projeto**: (seu email)
7. Clique em: **Salvar**

#### 3. Verificar Domínios Autorizados

Ainda em **Authentication** → **Settings** → **Authorized domains**:

Certifique-se de que `localhost` está na lista. Se não estiver:

1. Clique em: **Adicionar domínio**
2. Digite: `localhost`
3. Clique em: **Adicionar**

---

## 🔑 Configuração Completa do Google OAuth

Se o erro persistir após habilitar Authentication, você precisa configurar o Google OAuth:

### Passo 1: Acessar Google Cloud Console

1. Vá em: https://console.cloud.google.com
2. Selecione o projeto: **adac-orcamentos**

### Passo 2: Habilitar a API

1. No menu lateral (☰): **APIs e serviços** → **Biblioteca**
2. Pesquise: `Google+ API` ou `Google Identity Toolkit`
3. Clique em: **Ativar**

### Passo 3: Configurar Tela de Consentimento

Siga o guia em: **`PROXIMO_PASSO.md`**

---

## 🆘 Erro Diferente?

### `auth/operation-not-allowed`
→ Você precisa habilitar Google Sign-in no Firebase Authentication (Passo 2)

### `auth/unauthorized-domain`
→ Adicione `localhost` nos domínios autorizados (Passo 3)

### `auth/popup-blocked`
→ Seu navegador está bloqueando popups. Permita popups para localhost

### `auth/cancelled-popup-request`
→ Você abriu/fechou o popup muito rápido. Tente novamente

---

## 📋 Resumo Rápido

1. ✅ Reiniciar servidor (`Ctrl+C` → `npm run dev`)
2. ✅ Recarregar navegador (F5)
3. ✅ Habilitar Google em Authentication no Firebase
4. ✅ Adicionar `localhost` nos domínios autorizados
5. ✅ Testar Google Login

---

## 🎉 Funcionou?

Se o Google Login funcionou, você está pronto para fazer deploy!

Próximo passo: **`COMO_SUBIR_NO_GITHUB.md`**

---

**Boa sorte! 🚀**
