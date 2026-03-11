# 🪑 ADAC - Farias Estofados - Sistema de Orçamentos

Sistema completo de geração de orçamentos em PDF para estofaria, com assinaturas mensais, autenticação Google e pagamentos integrados.

## 🚀 Funcionalidades

### 📋 Geração de Orçamentos
- ✅ Numeração sequencial automática (começando em 0001)
- ✅ Campos para Cliente, Telefone, Endereço e Condição de Pagamento
- ✅ Adição de múltiplos itens/serviços
- ✅ Cálculo automático de totais
- ✅ Geração de PDF profissional com cabeçalho e assinatura
- ✅ Formatação automática de data

### 👥 Sistema de Usuários
- ✅ Login com Google (Firebase Auth)
- ✅ Criação de contas de usuário padrão
- ✅ Conta de administrador:
  - **Login:** unwick
  - **Senha:** 01043678vV@
- ✅ Usuários padrão veem apenas seus orçamentos
- ✅ Admin tem acesso total ao sistema

### 💳 Sistema de Pagamentos
- ✅ Assinaturas mensais de R$ 29,90
- ✅ Integração com Asaas (sandbox)
- ✅ Pagamento via PIX (QR Code + Copia e Cola)
- ✅ Pagamento via Cartão de Crédito
- ✅ Validação completa de campos

### 🎨 Interface
- ✅ Modo noturno completo
- ✅ Design responsivo
- ✅ Interface profissional

## 🛠️ Tecnologias

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **React Router** (Data mode)
- **Firebase Auth** (Google Login)
- **Supabase** (Database)
- **jsPDF** (Geração de PDFs)
- **Lucide React** (Ícones)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/adac-orcamentos.git

# Entre na pasta
cd adac-orcamentos

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas chaves

# Execute o projeto
npm run dev
```

## 🔧 Configuração

### 1. Firebase (Google Login)

Copie o arquivo `.env.example` para `.env` e configure:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

**Consulte:** `PROXIMO_PASSO.md` para configurar Google OAuth

### 2. Supabase (Database)

Configure suas credenciais do Supabase no arquivo de configuração.

**Consulte:** A documentação do Supabase no código

### 3. Asaas (Pagamentos)

Configure sua chave da API do Asaas (sandbox ou produção).

## 🚀 Deploy

### Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Importe o projeto do GitHub
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

**Guia completo:** `GUIA_DEPLOY_VERCEL.md`

**Checklist:** `CHECKLIST_DEPLOY.md`

**Próximos passos:** `PROXIMO_PASSO.md`

## 📚 Documentação

- 📖 [Guia de Deploy no Vercel](GUIA_DEPLOY_VERCEL.md)
- ✅ [Checklist de Deploy](CHECKLIST_DEPLOY.md)
- 🎯 [Próximo Passo](PROXIMO_PASSO.md)
- 🔐 [Configuração Firebase](src/config/firebase.ts)

## 👨‍💼 Admin

**Conta de administrador:**
- Login: `unwick`
- Senha: `01043678vV@`

O admin tem acesso a:
- 👥 Gerenciamento de todos os usuários
- 📋 Visualização de todos os orçamentos
- 💰 Gerenciamento de planos e assinaturas

## 📝 Licença

Este projeto é privado e de uso exclusivo da ADAC - Farias Estofados.

## 🆘 Suporte

Para dúvidas ou problemas, consulte os guias de deploy ou entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para ADAC - Farias Estofados**
