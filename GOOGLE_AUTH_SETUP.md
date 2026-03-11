# 🔐 Configuração de Login com Google - Guia Completo

## ⚠️ IMPORTANTE
Para que o login com Google funcione, você precisa configurar o Google OAuth no dashboard do Supabase. Siga as instruções abaixo.

---

## 📋 Pré-requisitos

- Conta no Supabase (já configurada)
- Conta no Google Cloud Console

---

## 🚀 Passo a Passo

### 1. Configurar Google Cloud Console

#### 1.1 Criar um Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Anote o **Project ID**

#### 1.2 Configurar Tela de Consentimento OAuth
1. No menu lateral, vá em **APIs & Services** → **OAuth consent screen**
2. Selecione **External** como tipo de usuário
3. Clique em **Create**
4. Preencha os campos obrigatórios:
   - **App name**: ADAC - Gerador de Orçamentos
   - **User support email**: seu@email.com
   - **Developer contact information**: seu@email.com
5. Clique em **Save and Continue**
6. Em **Scopes**, clique em **Add or Remove Scopes**
7. Adicione os seguintes escopos:
   - `openid`
   - `email`
   - `profile`
8. Clique em **Save and Continue**
9. Em **Test users**, adicione seus emails de teste
10. Clique em **Save and Continue**

#### 1.3 Criar Credenciais OAuth
1. No menu lateral, vá em **APIs & Services** → **Credentials**
2. Clique em **+ Create Credentials** → **OAuth client ID**
3. Selecione **Web application** como tipo
4. Preencha os campos:
   - **Name**: ADAC OAuth Client
   - **Authorized JavaScript origins**: 
     ```
     https://tngnahvjhlpvjnhbimql.supabase.co
     ```
   - **Authorized redirect URIs**:
     ```
     https://tngnahvjhlpvjnhbimql.supabase.co/auth/v1/callback
     ```

     ```
     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 / 979041848107-90md3tfdojcrb3dk4hi0k9equvrdsm87.apps.googleusercontent.com
     ```
     
5. Clique em **Create**
6. **Copie o Client ID e Client Secret** (você vai precisar deles)

---

### 2. Configurar Supabase

#### 2.1 Acessar Dashboard do Supabase
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, vá em **Authentication** → **Providers**

#### 2.2 Habilitar Google Provider
1. Procure por **Google** na lista de providers
2. Clique em **Enable**
3. Preencha os campos:
   - **Client ID**: Cole o Client ID do Google Cloud Console
   - **Client Secret**: Cole o Client Secret do Google Cloud Console
4. Clique em **Save**

---

## ✅ Testar Integração

### No Ambiente de Desenvolvimento
1. Acesse a página de Login
2. Clique em **Continuar com Google**
3. Você será redirecionado para a tela de login do Google
4. Após fazer login, será redirecionado de volta para a aplicação
5. A conta será criada automaticamente no sistema

### Fluxo de Autenticação
```
1. Usuário clica em "Continuar com Google"
2. Redirecionado para Google OAuth
3. Usuário faz login com conta Google
4. Google redireciona para Supabase callback URL
5. Supabase cria sessão e redireciona para /login
6. Aplicação detecta sessão do Google
7. Cria usuário no localStorage (se não existir)
8. Faz login automático
```

---

## 🔧 Configurações Avançadas (Opcional)

### Personalizar Redirect URL
Se quiser personalizar para onde o usuário é redirecionado após o login:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/dashboard'
  }
});
```

### Solicitar Escopos Adicionais
Se precisar de mais informações do usuário:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'openid email profile https://www.googleapis.com/auth/userinfo.profile'
  }
});
```

---

## 🐛 Troubleshooting

### Erro: "provider is not enabled"
**Solução**: Certifique-se de que habilitou o Google Provider no Supabase Dashboard.

### Erro: "redirect_uri_mismatch"
**Solução**: 
1. Verifique se a URL de callback está correta no Google Cloud Console
2. Deve ser exatamente: `https://tngnahvjhlpvjnhbimql.supabase.co/auth/v1/callback`

### Erro: "invalid client"
**Solução**: Verifique se o Client ID e Client Secret estão corretos no Supabase.

### Login não funciona em localhost
**Solução**: Adicione `http://localhost:5173` nas Authorized JavaScript origins do Google Cloud Console.

---

## 📊 Estrutura de Dados

### Usuário criado via Google
Quando um usuário faz login com Google, os seguintes dados são salvos:

```typescript
{
  username: "email@gmail.com" (parte antes do @),
  password: "", // Vazio para usuários do Google
  email: "email@gmail.com",
  isAdmin: false,
  createdAt: "2026-03-11T...",
  googleId: "unique-google-user-id"
}
```

---

## 🔒 Segurança

### Boas Práticas
- ✅ Sempre use HTTPS em produção
- ✅ Mantenha o Client Secret seguro
- ✅ Não exponha credenciais no código frontend
- ✅ Use variáveis de ambiente para dados sensíveis
- ✅ Revise periodicamente os escopos solicitados

### Permissões
- Usuários do Google têm as mesmas permissões que usuários normais
- Apenas o admin (unwick) tem privilégios de administrador
- Usuários do Google NÃO podem fazer login com senha (apenas com Google)

---

## 📚 Recursos Adicionais

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Social Login](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## ✨ Resultado Final

Após a configuração, você terá:
- ✅ Botão "Continuar com Google" nas páginas de Login e Cadastro
- ✅ Autenticação automática via Google
- ✅ Criação automática de contas para novos usuários
- ✅ Integração perfeita com o sistema existente
- ✅ Modo noturno funcionando em todas as páginas

---

## 🎯 Próximos Passos

1. **Desenvolvimento**: Teste com sua conta Google pessoal
2. **Testes**: Adicione contas de teste no Google Cloud Console
3. **Produção**: 
   - Mude o OAuth consent screen de "Testing" para "Published"
   - Atualize as URLs de callback para domínio de produção
   - Considere adicionar mais providers (Facebook, GitHub, etc.)

---

**Status**: Sistema pronto para uso após configuração! 🎉
