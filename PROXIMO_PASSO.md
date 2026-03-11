# 🎯 PRÓXIMO PASSO - Configurar Google OAuth

## ✅ JÁ CONCLUÍDO

- [x] Firebase criado
- [x] Credenciais copiadas
- [x] Arquivo `firebase.ts` atualizado
- [x] Arquivo `.env` criado

---

## 📍 VOCÊ ESTÁ AQUI

**Etapa 2 de 5**: Configurar Google OAuth

---

## 🔧 O QUE FAZER AGORA

### 1️⃣ Acessar Google Cloud Console

1. Vá em: https://console.cloud.google.com
2. No topo, clique no **nome do projeto atual**
3. Selecione: **adac-orcamentos** (o projeto que você criou no Firebase)

---

### 2️⃣ Configurar Tela de Consentimento OAuth

1. No menu lateral (☰), vá em:  
   **APIs e serviços** → **Tela de consentimento OAuth**

2. Selecione: **Externo**

3. Clique em: **Criar**

4. Preencha:
   - **Nome do app**: `ADAC - Farias Estofados`
   - **Email de suporte do usuário**: (seu email)
   - **Logo do app**: (deixe em branco ou adicione logo)
   - **Domínio do app**: (deixe em branco por enquanto)
   - **Domínios autorizados**: (deixe em branco)
   - **Email do desenvolvedor**: (seu email)

5. Clique em: **Salvar e continuar**

6. Em **"Escopos"**: Clique em **Salvar e continuar** (não adicione nada)

7. Em **"Usuários de teste"**: Clique em **Salvar e continuar**

8. Clique em: **Voltar para o painel**

---

### 3️⃣ Criar Credenciais OAuth

1. No menu lateral, vá em:  
   **APIs e serviços** → **Credenciais**

2. Clique em: **+ Criar credenciais** → **ID do cliente OAuth 2.0**

3. Preencha:
   - **Tipo de aplicativo**: `Aplicativo da Web`
   - **Nome**: `ADAC Web Client`

4. Em **"Origens JavaScript autorizadas"**, clique em **+ Adicionar URI**:
   ```
   http://localhost:5173
   ```

5. Em **"URIs de redirecionamento autorizados"**, clique em **+ Adicionar URI**:
   ```
   https://adac-orcamentos.firebaseapp.com/__/auth/handler
   ```

6. Clique em: **Criar**

7. **IGNORE** as credenciais que aparecerem (não precisa copiar nada)

8. Clique em: **OK**

---

## ✅ PRONTO!

Você completou a configuração do Google OAuth! 🎉

---

## 🚀 PRÓXIMO PASSO

Agora você pode:

### Opção A: Testar Localmente (Opcional)

Se quiser testar antes de fazer deploy:

```bash
# No terminal, execute:
npm run dev
```

Acesse: http://localhost:5173/login  
Clique em "Entrar com o Google" e teste!

---

### Opção B: Deploy Direto no Vercel (Recomendado)

Continue para o **PASSO 3** do `CHECKLIST_DEPLOY.md`:

1. Acesse: https://vercel.com
2. Faça login
3. Clique em "Add New" → "Project"
4. Importe o projeto
5. **IMPORTANTE**: Adicione as variáveis de ambiente:

```
VITE_FIREBASE_API_KEY = AIzaSyCPRSVzdMERazzGzEC5l5wBtOeWkiJ2KEA
VITE_FIREBASE_AUTH_DOMAIN = adac-orcamentos.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = adac-orcamentos
VITE_FIREBASE_STORAGE_BUCKET = adac-orcamentos.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 88426956432
VITE_FIREBASE_APP_ID = 1:88426956432:web:cec4911a0e4d7826aaba15
```

6. Clique em "Deploy"

7. Aguarde 2-3 minutos

8. Copie a URL do site (ex: `https://adac-orcamentos.vercel.app`)

---

## 📋 CHECKLIST RÁPIDO

- [ ] Acessei Google Cloud Console
- [ ] Selecionei projeto "adac-orcamentos"
- [ ] Configurei tela de consentimento OAuth
- [ ] Criei credenciais OAuth 2.0
- [ ] Adicionei `http://localhost:5173` nas origens
- [ ] Adicionei o redirect URI do Firebase
- [ ] Pronto para deploy!

---

## 🆘 PROBLEMAS?

### "Não consigo encontrar o projeto adac-orcamentos"
→ Verifique se você está logado com a mesma conta do Firebase

### "Não acho onde criar as credenciais"
→ Menu lateral (☰) → APIs e serviços → Credenciais → + Criar credenciais

### "Deu erro ao criar credenciais"
→ Certifique-se de que configurou a tela de consentimento primeiro

---

## 📞 AJUDA

Consulte o arquivo completo: `GUIA_DEPLOY_VERCEL.md`

---

**Você está na etapa 2 de 5! Continue assim! 🚀**
