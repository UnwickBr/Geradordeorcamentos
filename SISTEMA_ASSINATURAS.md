# Sistema de Assinaturas - ADAC Farias Estofados

## 📋 Visão Geral

Sistema completo de geração de orçamentos com funcionalidades de assinaturas mensais, gerenciamento de usuários e pagamentos via PIX ou Cartão de Crédito.

## ✨ Funcionalidades Implementadas

### 1. **Página de Perfil do Usuário** (`/profile`)
- **Informações do Perfil**:
  - Visualizar e editar email
  - Alterar senha (com confirmação)
  - Nome de usuário (não editável)

- **Aba de Assinatura**:
  - Status da assinatura (Ativo/Inativo/Trial)
  - Data de renovação/expiração
  - Detalhes do plano mensal (R$ 29,90/mês)
  - Benefícios inclusos:
    - Orçamentos ilimitados
    - Histórico completo
    - Geração de PDF profissional
    - Suporte prioritário
  - Botão para assinar (redireciona para `/payment`)

### 2. **Página de Pagamento** (`/payment`)
- **Métodos de Pagamento**:
  
  **Cartão de Crédito**:
  - Número do cartão (formatação automática)
  - Nome no cartão
  - Data de validade (MM/AA)
  - CVV
  - Validação de campos
  - Processamento seguro via Asaas
  
  **PIX**:
  - Geração de QR Code
  - Código Copia e Cola
  - Botão para copiar código
  - Verificação automática de pagamento
  - Status "Aguardando pagamento"

- **Resumo do Pedido**:
  - Detalhes do plano
  - Período de assinatura
  - Valor total: R$ 29,90
  - Lista de benefícios inclusos

### 3. **Gerenciamento de Planos (Admin)** (`/users`)
- **Estatísticas no Dashboard**:
  - Total de usuários
  - Assinaturas ativas (contador em tempo real)
  - Usuários sem assinatura

- **Abas de Gerenciamento**:
  
  **Aba "Usuários"**:
  - Lista completa de usuários
  - Badge indicando status de assinatura
  - Ícone de cartão para gerenciar assinatura individual
  - Data de criação da conta
  - Data de renovação/expiração da assinatura
  
  **Aba "Assinaturas"**:
  - Lista de todos os usuários (exceto admins)
  - Status (Ativo/Inativo)
  - Data de renovação ou expiração
  - Botões para ativar/desativar assinatura manualmente
  - Card com detalhes do plano disponível

- **Ações do Administrador**:
  - Ativar assinatura de um usuário (válida por 30 dias)
  - Desativar assinatura de um usuário
  - Excluir usuários (com confirmação)
  - Visualizar histórico de todos os orçamentos

### 4. **Navegação Aprimorada**
- Todos os headers agora incluem botão "Perfil"
- Acesso rápido entre páginas:
  - Gerador de Orçamentos (Home)
  - Histórico
  - Perfil
  - Gerenciamento de Usuários (Admin)
  - Logout

## 🔐 Sistema de Autenticação

### Usuário Administrador
- **Login**: `unwick`
- **Senha**: `01043678vV@`
- **Permissões**:
  - Acesso total ao sistema
  - Gerenciar todos os usuários
  - Gerenciar planos e assinaturas
  - Visualizar todos os orçamentos
  - Ativar/desativar assinaturas manualmente

### Usuários Padrão
- Podem criar conta em `/signup`
- Visualizam apenas seus próprios orçamentos
- Podem gerenciar seu perfil
- Podem assinar o plano mensal
- Não têm acesso à página de administração

## 💳 Integração com Asaas

O sistema está preparado para integração completa com o Asaas para processamento de pagamentos.

### Funcionalidades de Pagamento:
1. **Simulação Atual** (Demonstração):
   - Pagamentos simulados localmente
   - Ativação instantânea da assinatura
   - Assinatura válida por 30 dias

2. **Integração Real** (Produção):
   - Consulte o arquivo `/ASAAS_INTEGRATION.md` para instruções completas
   - Endpoints configurados para:
     - Criar clientes
     - Processar cartão de crédito
     - Gerar PIX com QR Code
     - Receber webhooks de confirmação

### Status de Assinatura:
- **Active (Ativo)**: Assinatura válida e funcionando
- **Inactive (Inativo)**: Sem assinatura ou expirada
- **Trial (Teste)**: Período de testes (futuro)

## 📊 Estrutura de Dados

### Interface User (localStorage - `users`):
```typescript
{
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  subscriptionEndDate?: string;
  subscriptionPlan?: string;
}
```

### Orçamentos (localStorage - `savedBudgets`):
- Cada orçamento inclui campo `createdBy` com username
- Administradores veem todos os orçamentos
- Usuários padrão veem apenas seus próprios

## 🎨 Design e Interface

### Cores Principais:
- **Admin**: Roxo (#7C3AED - purple-600)
- **Usuários**: Azul (#2563EB - blue-600)
- **Assinaturas Ativas**: Verde (#16A34A - green-600)
- **Pagamentos**: Verde (#16A34A - green-600)
- **Alertas/Avisos**: Amarelo (#CA8A04 - yellow-600)
- **Exclusão/Cancelar**: Vermelho (#DC2626 - red-600)

### Componentes Utilizados:
- Cards com sombras
- Badges para status
- Tabs para organização
- Dialogs para confirmações
- Toasts para notificações
- Inputs formatados automaticamente

## 🚀 Rotas do Sistema

| Rota | Componente | Acesso | Descrição |
|------|-----------|--------|-----------|
| `/` | BudgetGenerator | Protegido | Página principal - criar orçamentos |
| `/login` | Login | Público | Login de usuários |
| `/signup` | SignUp | Público | Cadastro de novos usuários |
| `/history` | BudgetHistory | Protegido | Histórico de orçamentos |
| `/profile` | UserProfile | Protegido | Perfil e assinatura do usuário |
| `/payment` | Payment | Protegido | Página de pagamento |
| `/users` | UserManagement | Admin | Gerenciamento de usuários e planos |

## 📱 Responsividade

Todas as páginas são totalmente responsivas:
- Desktop: Layout em grid com múltiplas colunas
- Tablet: Adaptação de colunas
- Mobile: Layout em coluna única

## 🔄 Fluxo de Assinatura

1. **Usuário acessa `/profile`**
2. **Visualiza status da assinatura na aba "Assinatura"**
3. **Clica em "Assinar Agora"**
4. **Redirecionado para `/payment`**
5. **Escolhe método de pagamento**:
   - **Cartão**: Preenche dados → Processa → Ativa assinatura
   - **PIX**: Gera código → Paga no banco → Confirma automaticamente → Ativa assinatura
6. **Redirecionado de volta para `/profile`**
7. **Status atualizado para "Ativo"**
8. **Assinatura válida por 30 dias**

## 🛡️ Segurança

### Implementado:
- Rotas protegidas (ProtectedRoute)
- Rotas exclusivas para admin (AdminRoute)
- Validação de senhas (mínimo 6 caracteres)
- Confirmação para exclusões
- Prevenção de auto-exclusão do admin
- Proteção da conta principal (unwick)

### Recomendações para Produção:
- ⚠️ **NÃO usar localStorage para dados sensíveis**
- ⚠️ **Implementar backend com banco de dados**
- ⚠️ **Hash de senhas (bcrypt)**
- ⚠️ **Tokens JWT para autenticação**
- ⚠️ **HTTPS obrigatório**
- ⚠️ **Validação server-side**
- ⚠️ **Rate limiting**
- ⚠️ **Logs de auditoria**

## 📝 Próximos Passos Recomendados

### Curto Prazo:
1. ✅ Integrar com API do Asaas (veja `/ASAAS_INTEGRATION.md`)
2. ✅ Implementar webhooks para confirmação automática de pagamento PIX
3. ✅ Adicionar campo CPF/CNPJ no cadastro
4. ✅ Implementar sistema de renovação automática

### Médio Prazo:
1. 🔄 Migrar para banco de dados (PostgreSQL/MySQL)
2. 🔄 Implementar backend (Node.js/Express)
3. 🔄 Sistema de emails (confirmação, renovação, vencimento)
4. 🔄 Planos diferenciados (Basic, Pro, Enterprise)
5. 🔄 Relatórios financeiros para admin

### Longo Prazo:
1. 📊 Dashboard analytics
2. 📱 Aplicativo mobile
3. 🤝 Integração com CRM
4. 📧 Sistema de marketing por email
5. 💬 Chat de suporte

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em `/ASAAS_INTEGRATION.md`
2. Consulte os logs no console do navegador
3. Verifique o localStorage para debug
4. Entre em contato com o administrador do sistema

## 📄 Licença

Sistema desenvolvido para ADAC - Farias Estofados
© 2024 - Todos os direitos reservados
