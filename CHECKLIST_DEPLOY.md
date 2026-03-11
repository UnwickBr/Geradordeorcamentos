# ✅ Checklist de Deploy - ADAC Farias Estofados

Use este checklist para fazer o deploy passo a passo.

---

## 📋 ANTES DO DEPLOY

### Firebase Setup
- [x] Criar conta no Firebase (https://console.firebase.google.com)
- [x] Criar novo projeto "adac-orcamentos"
- [ ] Ativar Authentication
- [ ] Ativar Google como provedor de login
- [ ] Adicionar email de suporte
- [ ] Copiar configurações do Firebase (apiKey, authDomain, etc.)

### Google OAuth Setup
- [ ] Acessar Google Cloud Console (https://console.cloud.google.com)
- [ ] Selecionar o mesmo projeto do Firebase
- [ ] Configurar tela de consentimento OAuth
- [ ] Criar credenciais OAuth 2.0
- [ ] Adicionar `http://localhost:5173` nas origens autorizadas
- [ ] Adicionar `http://localhost:5173` nos redirecionamentos

---

## 🚀 DEPLOY NO VERCEL

### Preparação
- [ ] Criar conta no Vercel (https://vercel.com)
- [ ] Conectar repositório Git (ou importar do Figma)
- [ ] Verificar que o projeto está selecionado

### Configuração
- [ ] Adicionar variável: `VITE_FIREBASE_API_KEY`
- [ ] Adicionar variável: `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Adicionar variável: `VITE_FIREBASE_PROJECT_ID`
- [ ] Adicionar variável: `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Adicionar variável: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Adicionar variável: `VITE_FIREBASE_APP_ID`
- [ ] Verificar Build Command: `npm run build`
- [ ] Verificar Output Directory: `dist`

### Deploy
- [ ] Clicar em "Deploy"
- [ ] Aguardar build (2-3 minutos)
- [ ] Verificar se deu sucesso
- [ ] Copiar URL do site (ex: `https://adac-orcamentos.vercel.app`)

---

## 🔧 APÓS O DEPLOY

### Atualizar Firebase
- [ ] Voltar ao Firebase Console
- [ ] Ir em Authentication → Settings
- [ ] Adicionar domínio Vercel em "Authorized domains"
  - Exemplo: `adac-orcamentos.vercel.app` (sem https://)

### Atualizar Google OAuth
- [ ] Voltar ao Google Cloud Console
- [ ] Ir em APIs e serviços → Credenciais
- [ ] Editar credenciais OAuth criadas
- [ ] Adicionar em "Origens JavaScript autorizadas":
  - `https://adac-orcamentos.vercel.app` (com https://)
- [ ] Adicionar em "URIs de redirecionamento":
  - `https://adac-orcamentos.firebaseapp.com/__/auth/handler`
- [ ] Salvar

### Atualizar Tela de Consentimento
- [ ] Ir em APIs e serviços → Tela de consentimento OAuth
- [ ] Clicar em "Editar app"
- [ ] Adicionar em "Domínios autorizados":
  - `vercel.app`
  - `firebaseapp.com`
- [ ] Salvar

---

## 🧪 TESTES

### Teste 1: Login Normal
- [ ] Acessar o site publicado
- [ ] Tentar login com usuário: `unwick` / senha: `01043678vV@`
- [ ] Verificar se entrou no sistema
- [ ] Verificar se modo noturno funciona
- [ ] Fazer logout

### Teste 2: Cadastro Normal
- [ ] Clicar em "Criar conta"
- [ ] Preencher formulário
- [ ] Verificar se criou conta
- [ ] Fazer login com a conta criada

### Teste 3: Login com Google
- [ ] Na tela de login, clicar em "Entrar com o Google"
- [ ] Verificar se popup do Google abre
- [ ] Selecionar conta Google
- [ ] Verificar se fez login com sucesso
- [ ] Verificar se o nome do usuário aparece correto

### Teste 4: Cadastro com Google
- [ ] Fazer logout
- [ ] Ir em "Criar conta"
- [ ] Clicar em "Criar conta com o Google"
- [ ] Selecionar conta Google
- [ ] Verificar se criou conta e fez login

### Teste 5: Funcionalidades
- [ ] Criar um novo orçamento
- [ ] Adicionar itens ao orçamento
- [ ] Gerar PDF
- [ ] Verificar histórico
- [ ] Testar modo noturno
- [ ] Testar responsividade (mobile)

### Teste 6: Admin
- [ ] Fazer login como admin (unwick)
- [ ] Acessar gerenciamento de usuários
- [ ] Verificar se vê todos os usuários
- [ ] Verificar se pode deletar usuários

---

## 📱 COMPARTILHAR

### URLs para salvar
- [ ] Site publicado: `_______________________`
- [ ] Firebase Console: https://console.firebase.google.com
- [ ] Google Cloud: https://console.cloud.google.com
- [ ] Vercel Dashboard: https://vercel.com/dashboard

### Informações importantes
```
Login Admin:
- Usuário: unwick
- Senha: 01043678vV@

Asaas API (Pagamentos):
- Chave Sandbox: (já configurada)
- Plano: R$ 29,90/mês
```

---

## ⚠️ PROBLEMAS COMUNS

### Firebase error: auth/unauthorized-domain
**Solução:**
- [ ] Verificar se o domínio está em "Authorized domains" no Firebase

### Error 400: redirect_uri_mismatch
**Solução:**
- [ ] Verificar se adicionou `https://seu-projeto.firebaseapp.com/__/auth/handler` no Google OAuth

### Popup do Google não abre
**Solução:**
- [ ] Verificar se as variáveis de ambiente estão corretas no Vercel
- [ ] Tentar em modo anônimo
- [ ] Limpar cache do navegador

### Site não carrega (404)
**Solução:**
- [ ] Verificar se o arquivo `vercel.json` está no projeto
- [ ] Fazer redeploy no Vercel

---

## 🎉 FINALIZAÇÃO

### Quando tudo estiver funcionando:
- [ ] Compartilhar URL com clientes/equipe
- [ ] Adicionar URL aos favoritos
- [ ] Fazer backup do código
- [ ] Documentar credenciais de acesso (em local seguro)

### Opcional (melhorias futuras):
- [ ] Adicionar domínio personalizado (ex: orcamentos.adacfarias.com.br)
- [ ] Configurar favicon personalizado
- [ ] Adicionar Google Analytics
- [ ] Configurar emails transacionais
- [ ] Migrar dados para Firestore (backup na nuvem)

---

## 📊 TEMPO ESTIMADO

| Etapa | Tempo |
|-------|-------|
| Firebase Setup | 10 min |
| Google OAuth | 5 min |
| Deploy Vercel | 5 min |
| Configurações pós-deploy | 5 min |
| Testes | 10 min |
| **TOTAL** | **~35 min** |

---

## ✅ PRONTO!

Quando todos os checkboxes estiverem marcados, seu sistema estará online e funcionando perfeitamente!

**Lembre-se:**
- 💾 Dados salvos no localStorage (navegador)
- 🔒 Login admin: unwick / 01043678vV@
- 💰 Assinatura: R$ 29,90/mês via Asaas
- 📱 Funciona em desktop e mobile

**Bom trabalho! 🚀**
