# 🔥 SOLUÇÃO DEFINITIVA - Google Login

## 🎯 O Problema

O erro `auth/unauthorized-domain` acontece porque o Firebase está bloqueando o domínio que você está usando para fazer login.

---

## ✅ SOLUÇÃO PASSO A PASSO (FAÇA EXATAMENTE ASSIM)

### ETAPA 1: Verificar qual URL está sendo bloqueada

1. **Abra o navegador**
2. **Acesse:** http://localhost:5173
3. **Pressione F12** (abre as Ferramentas do Desenvolvedor)
4. **Vá na aba "Console"** (no topo das ferramentas)
5. **Você verá uma mensagem começando com:** `🔥 Firebase Config:`
6. **Anote o valor de:** `currentHost` (ex: `localhost:5173`)

---

### ETAPA 2: Adicionar TODOS os domínios possíveis no Firebase

1. **Acesse:** https://console.firebase.google.com/
2. **Selecione:** adac-orcamentos
3. **Menu lateral:** Authentication
4. **Aba:** Settings (no topo)
5. **Role até:** Authorized domains

Agora, adicione **CADA UM** dos domínios abaixo (um por vez):

#### Domínios para adicionar:

1. `localhost`
2. `localhost:5173`
3. `127.0.0.1`
4. `127.0.0.1:5173`

**Como adicionar cada um:**

- Clique em: **Add domain**
- Digite: (o domínio, ex: `localhost`)
- Clique em: **Add**
- Repita para os outros 3 domínios

---

### ETAPA 3: Verificar se todos foram adicionados

Depois de adicionar, sua lista deve ter **PELO MENOS**:

```
✅ localhost
✅ localhost:5173
✅ 127.0.0.1
✅ 127.0.0.1:5173
✅ adac-orcamentos.firebaseapp.com
✅ adac-orcamentos.web.app
```

---

### ETAPA 4: Aguardar e Limpar

1. **Aguarde 2 minutos completos** (o Firebase precisa processar)

2. **Limpe o cache do navegador:**
   - Pressione: **Ctrl + Shift + Delete**
   - Marque: Cookies e Cache
   - Período: Última hora
   - Clique em: Limpar dados

3. **Feche TODAS as abas** do navegador

4. **Reinicie o servidor:**
   ```bash
   # No terminal:
   Ctrl + C
   npm run dev
   ```

---

### ETAPA 5: Testar

1. **Abra uma nova aba** do navegador
2. **Acesse:** http://localhost:5173
3. **Vá para a página de login**
4. **Pressione F12** (abrir Console)
5. **Clique em:** Entrar com Google
6. **Veja se aparece algum erro no Console**

---

## 🔍 Se AINDA der erro

### Opção A: Verificar no Console

No Console do navegador (F12 → Console), procure por:

- Mensagens de erro vermelhas
- Qual domínio está sendo bloqueado
- Copie exatamente esse domínio
- Adicione no Firebase (Authorized domains)

---

### Opção B: Configurar OAuth manualmente

O problema pode ser que o Google OAuth não está configurado. Vamos configurar:

#### 1. Acessar Google Cloud Console

1. Vá em: https://console.cloud.google.com/
2. No topo, selecione o projeto: **adac-orcamentos**
   - Se não aparecer, clique na seta ao lado do nome do projeto atual
   - Procure por "adac-orcamentos"

#### 2. Ativar APIs necessárias

1. No menu lateral (☰): **APIs e serviços** → **Biblioteca**
2. Pesquise: `Google+ API`
3. Clique nela e: **Ativar** (se ainda não estiver ativo)
4. Volte e pesquise: `Identity Toolkit API`
5. Clique nela e: **Ativar**

#### 3. Configurar Tela de Consentimento OAuth

1. No menu lateral: **APIs e serviços** → **Tela de consentimento OAuth**

2. Escolha: **Externo**

3. Clique em: **Criar**

4. Preencha (Página 1):
   - **Nome do app:** ADAC - Farias Estofados
   - **Email de suporte do usuário:** (seu email)
   - **Domínios autorizados:** (deixe em branco por enquanto)
   - **Informações de contato do desenvolvedor:** (seu email)

5. Clique em: **Salvar e continuar**

6. Página 2 (Escopos):
   - Clique em: **Salvar e continuar** (sem adicionar nada)

7. Página 3 (Usuários de teste):
   - Clique em: **+ Add Users**
   - Adicione seu email do Google
   - Clique em: **Salvar e continuar**

8. Página 4 (Resumo):
   - Clique em: **Voltar ao painel**

#### 4. Criar Credenciais OAuth

1. No menu lateral: **APIs e serviços** → **Credenciais**

2. Clique em: **+ Criar credenciais** → **ID do cliente OAuth**

3. Escolha:
   - **Tipo de aplicativo:** Aplicativo da Web
   - **Nome:** ADAC Orçamentos Web

4. Em **Origens JavaScript autorizadas**, clique em **+ Adicionar URI**:
   - Adicione: `http://localhost:5173`
   - Adicione: `http://localhost`
   - Adicione: `http://127.0.0.1:5173`
   - Adicione: `http://127.0.0.1`

5. Em **URIs de redirecionamento autorizados**, clique em **+ Adicionar URI**:
   - Adicione: `http://localhost:5173`
   - Adicione: `https://adac-orcamentos.firebaseapp.com/__/auth/handler`

6. Clique em: **Criar**

7. **IMPORTANTE:** Uma janela aparecerá com:
   - ID do cliente
   - Código secreto do cliente
   
   **NÃO precisa copiar** (o Firebase já tem isso configurado automaticamente)

8. Clique em: **OK**

---

### Opção C: Usar deployment temporário

Se localhost não funcionar de jeito nenhum, você pode fazer deploy temporário:

1. Faça deploy no Vercel (grátis)
2. Use a URL do Vercel (ex: `adac-orcamentos.vercel.app`)
3. Adicione essa URL no Firebase (Authorized domains)
4. Teste o Google Login na URL do Vercel

**Guia de deploy:** `COMO_SUBIR_NO_GITHUB.md` → Passo 7

---

## 📋 Checklist Final

- [ ] Abri F12 e vi qual é o `currentHost`
- [ ] Adicionei `localhost` no Firebase
- [ ] Adicionei `localhost:5173` no Firebase
- [ ] Adicionei `127.0.0.1` no Firebase
- [ ] Adicionei `127.0.0.1:5173` no Firebase
- [ ] Aguardei 2 minutos
- [ ] Limpei cache do navegador (Ctrl+Shift+Delete)
- [ ] Fechei todas as abas
- [ ] Reiniciei o servidor (Ctrl+C → npm run dev)
- [ ] Abri nova aba
- [ ] Testei o Google Login
- [ ] Se ainda deu erro → Configurei OAuth manualmente

---

## 🆘 ÚLTIMA OPÇÃO (Se NADA funcionou)

### Desabilitar temporariamente o Google Login

Se você precisa continuar desenvolvendo:

1. Use apenas login com **usuário e senha**
2. Crie uma conta normal: `/signup`
3. Entre com essa conta
4. Continue desenvolvendo
5. Resolva o Google Login depois

**Conta admin (já existe):**
- Usuário: `unwick`
- Senha: `01043678vV@`

---

## 💡 Dica

O erro mais comum é **não aguardar** os 2 minutos após adicionar os domínios. O Firebase precisa desse tempo para atualizar as permissões.

**Seja paciente!** 😊

---

## ✅ Funcionou?

Se funcionou depois de seguir TODOS os passos, ótimo! 🎉

Se não, me envie:
1. Screenshot do Console (F12)
2. Screenshot da lista de Authorized domains no Firebase
3. O valor exato de `currentHost` que aparece no Console

---

**Boa sorte! 🚀**
