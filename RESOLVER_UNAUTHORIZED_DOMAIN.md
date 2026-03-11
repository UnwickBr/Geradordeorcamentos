# 🔧 Resolver Erro: auth/unauthorized-domain

## ❌ Erro Completo

```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

---

## ✅ SOLUÇÃO PASSO A PASSO (COM DETALHES)

### PASSO 1: Acessar Firebase Console

1. Abra: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique no projeto: **adac-orcamentos**

---

### PASSO 2: Ir para Authentication

1. No menu lateral **esquerdo**, procure: **Authentication** (ícone de pessoa/cadeado)
2. Clique em **Authentication**

---

### PASSO 3: Ir para Settings (Configurações)

1. No topo da página, você verá abas:
   - Users
   - **Settings** ← CLIQUE AQUI
   - Usage

2. Clique na aba: **Settings**

---

### PASSO 4: Encontrar "Authorized domains"

1. Role a página para baixo
2. Procure a seção: **Authorized domains** (Domínios autorizados)
3. Você verá uma lista de domínios, provavelmente:
   - ✅ `localhost` (pode não estar)
   - ✅ `adac-orcamentos.firebaseapp.com`
   - ✅ `adac-orcamentos.web.app`

---

### PASSO 5: Adicionar "localhost"

**IMPORTANTE:** Você precisa adicionar EXATAMENTE `localhost` (sem porta, sem http://)

1. Clique no botão: **Add domain** (Adicionar domínio)

2. Uma caixa de texto aparecerá

3. Digite EXATAMENTE (sem aspas): `localhost`
   - ❌ NÃO digite: `http://localhost`
   - ❌ NÃO digite: `localhost:5173`
   - ❌ NÃO digite: `http://localhost:5173`
   - ✅ Digite APENAS: `localhost`

4. Clique em: **Add** (Adicionar)

5. Aguarde aparecer na lista

---

### PASSO 6: Verificar se foi adicionado

Na lista de domínios autorizados, você DEVE ver:

- ✅ `localhost`
- ✅ `adac-orcamentos.firebaseapp.com`
- ✅ `adac-orcamentos.web.app`

---

### PASSO 7: Aguardar Propagação

**IMPORTANTE:** Aguarde 30 segundos a 1 minuto para o Firebase processar a mudança.

---

### PASSO 8: Limpar Cache e Testar

1. **Feche TODAS as abas** do localhost no navegador

2. **Abra uma nova aba**

3. Acesse novamente: `http://localhost:5173`

4. Vá para a página de login

5. Clique em: **Entrar com Google**

6. **Deve funcionar!** ✅

---

## ⚠️ AINDA NÃO FUNCIONOU?

### Solução Alternativa 1: Adicionar com porta

Se ainda não funcionar, tente adicionar também com a porta:

1. Volte em **Authentication** → **Settings** → **Authorized domains**
2. Clique em: **Add domain**
3. Digite: `localhost:5173`
4. Clique em: **Add**
5. Aguarde 30 segundos
6. Teste novamente

---

### Solução Alternativa 2: Usar 127.0.0.1

Às vezes o navegador usa `127.0.0.1` ao invés de `localhost`:

1. Adicione também: `127.0.0.1`
2. E se necessário: `127.0.0.1:5173`

---

### Solução Alternativa 3: Verificar qual URL está usando

1. Abra o **Console do navegador** (F12)
2. Vá na aba: **Console**
3. Tente fazer login novamente
4. Veja qual domínio está sendo bloqueado na mensagem de erro
5. Adicione exatamente esse domínio no Firebase

---

### Solução Alternativa 4: Limpar Cache do Navegador

1. Pressione: **Ctrl + Shift + Delete** (Windows/Linux) ou **Cmd + Shift + Delete** (Mac)
2. Selecione:
   - ✅ Cookies e dados de sites
   - ✅ Imagens e arquivos em cache
3. Período: **Última hora**
4. Clique em: **Limpar dados**
5. Feche o navegador completamente
6. Abra novamente
7. Teste

---

### Solução Alternativa 5: Testar em outro navegador

Se estiver usando Chrome, tente:
- Firefox
- Edge
- Modo Anônimo/Privado

Isso ajuda a identificar se é problema de cache.

---

## 🔍 Checklist de Verificação

- [ ] Acessei Firebase Console
- [ ] Selecionei projeto "adac-orcamentos"
- [ ] Fui em Authentication
- [ ] Cliquei na aba "Settings"
- [ ] Rolei até "Authorized domains"
- [ ] Cliquei em "Add domain"
- [ ] Digitei exatamente: `localhost`
- [ ] Cliquei em "Add"
- [ ] Vejo "localhost" na lista
- [ ] Aguardei 30-60 segundos
- [ ] Fechei todas as abas do navegador
- [ ] Abri nova aba
- [ ] Acessei http://localhost:5173
- [ ] Testei o Google Login
- [ ] Ainda deu erro?

---

## 🎯 Domínios que DEVEM estar na lista

Após adicionar tudo, sua lista deve ter:

```
✅ localhost
✅ adac-orcamentos.firebaseapp.com
✅ adac-orcamentos.web.app
```

E opcionalmente (se os acima não funcionarem):

```
🔹 localhost:5173
🔹 127.0.0.1
🔹 127.0.0.1:5173
```

---

## 🆘 ÚLTIMA OPÇÃO

Se NADA funcionar, pode ser um problema de configuração do Google OAuth.

Nesse caso, você precisará configurar as credenciais OAuth manualmente:

1. Siga o guia: **`PROXIMO_PASSO.md`**
2. Configure a Tela de Consentimento OAuth
3. Crie as credenciais OAuth 2.0 no Google Cloud Console

---

## 📸 Onde Encontrar?

**Caminho completo no Firebase Console:**

```
Firebase Console
  └── Selecionar Projeto: "adac-orcamentos"
      └── Menu Lateral: "Authentication"
          └── Aba no topo: "Settings"
              └── Rolar para baixo: "Authorized domains"
                  └── Botão: "Add domain"
```

---

## ✅ Funcionou?

Depois que adicionar `localhost` e aguardar 1 minuto, o erro deve sumir! 🎉

---

**Tente novamente e me avise se funcionou!** 🚀
