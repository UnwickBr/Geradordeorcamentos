# Integração com Asaas - Instruções

## Visão Geral
Este documento fornece instruções para integrar o sistema de pagamentos com a API do Asaas.

## Configuração Inicial

### 1. Criar Conta no Asaas
1. Acesse https://www.asaas.com/
2. Crie uma conta
3. Obtenha sua API Key em: Configurações > Integrações > API Key

### 2. Ambiente de Testes
Para testes, use o ambiente sandbox:
- URL: https://sandbox.asaas.com/api/v3
- Crie uma conta de testes separada

### 3. Configurar Webhook (opcional)
Para receber notificações automáticas de pagamento:
1. Acesse Configurações > Webhooks
2. Configure a URL do seu servidor para receber notificações
3. Eventos importantes:
   - `PAYMENT_RECEIVED` - Pagamento confirmado
   - `PAYMENT_OVERDUE` - Pagamento vencido
   - `PAYMENT_DELETED` - Pagamento cancelado

## Endpoints Necessários

### Para Pagamento via Cartão de Crédito
```javascript
POST https://www.asaas.com/api/v3/payments
Headers:
  access_token: SEU_TOKEN_AQUI
  Content-Type: application/json

Body:
{
  "customer": "ID_DO_CLIENTE",
  "billingType": "CREDIT_CARD",
  "value": 29.90,
  "dueDate": "2024-03-15",
  "description": "Assinatura Mensal - Gerador de Orçamentos",
  "creditCard": {
    "holderName": "NOME NO CARTAO",
    "number": "1234567890123456",
    "expiryMonth": "12",
    "expiryYear": "2024",
    "ccv": "123"
  },
  "creditCardHolderInfo": {
    "name": "Nome Completo",
    "email": "email@exemplo.com",
    "cpfCnpj": "12345678901",
    "postalCode": "12345678",
    "addressNumber": "123",
    "phone": "11999999999"
  }
}
```

### Para Pagamento via PIX
```javascript
POST https://www.asaas.com/api/v3/payments
Headers:
  access_token: SEU_TOKEN_AQUI
  Content-Type: application/json

Body:
{
  "customer": "ID_DO_CLIENTE",
  "billingType": "PIX",
  "value": 29.90,
  "dueDate": "2024-03-15",
  "description": "Assinatura Mensal - Gerador de Orçamentos"
}

Response incluirá:
{
  "encodedImage": "BASE64_DO_QR_CODE",
  "payload": "CODIGO_PIX_COPIA_E_COLA"
}
```

### Criar Cliente
Antes de criar um pagamento, você precisa criar/obter o ID do cliente:

```javascript
POST https://www.asaas.com/api/v3/customers
Headers:
  access_token: SEU_TOKEN_AQUI
  Content-Type: application/json

Body:
{
  "name": "Nome do Cliente",
  "email": "email@exemplo.com",
  "cpfCnpj": "12345678901"
}

Response:
{
  "id": "cus_XXXXXXXXX",
  ...
}
```

## Implementação no Código

### Arquivo: /src/app/components/Payment.tsx

Substitua as funções simuladas pelas chamadas reais à API:

```typescript
// Adicione no topo do arquivo
const ASAAS_API_URL = 'https://www.asaas.com/api/v3'
const ASAAS_API_KEY = ;$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRlNDhlNTQ3LWExNDYtNDNkMi05ZDA2LTNhZGU4ZGQ2NWVkNDo6JGFhY2hfMzdiYWU5NzYtOWYyZS00ZGVlLTkzNzQtZGNlYTFjZGYxMTU1;

// Para criar pagamento com cartão
const handleCreditCardPayment = async () => {
  try {
    // 1. Criar/obter cliente
    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: cardName,
        email: currentUser.email,
        cpfCnpj: '00000000000' // Você precisará coletar isso
      })
    });
    const customer = await customerResponse.json();

    // 2. Criar pagamento
    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: 'CREDIT_CARD',
        value: 29.90,
        dueDate: new Date().toISOString().split('T')[0],
        description: 'Assinatura Mensal',
        creditCard: {
          holderName: cardName,
          number: cardNumber.replace(/\s/g, ''),
          expiryMonth: cardExpiry.split('/')[0],
          expiryYear: '20' + cardExpiry.split('/')[1],
          ccv: cardCVV
        }
      })
    });

    const payment = await paymentResponse.json();
    
    if (payment.status === 'CONFIRMED') {
      activateSubscription();
    }
  } catch (error) {
    toast.error('Erro ao processar pagamento');
  }
};

// Para PIX
const handlePixPayment = async () => {
  try {
    // Similar ao cartão, mas com billingType: 'PIX'
    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: 29.90,
        dueDate: new Date().toISOString().split('T')[0],
        description: 'Assinatura Mensal'
      })
    });

    const payment = await paymentResponse.json();
    
    // Usar payment.encodedImage para o QR Code
    // Usar payment.payload para o código copia e cola
    setPixCode(payment.payload);
    setPixQRImage(payment.encodedImage);
  } catch (error) {
    toast.error('Erro ao gerar PIX');
  }
};
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
REACT_APP_ASAAS_API_KEY=sua_api_key_aqui
REACT_APP_ASAAS_API_URL=https://www.asaas.com/api/v3
```

Para testes:
```
REACT_APP_ASAAS_API_KEY=sua_api_key_sandbox
REACT_APP_ASAAS_API_URL=https://sandbox.asaas.com/api/v3
```

## Segurança

⚠️ **IMPORTANTE**: 
- NUNCA exponha sua API Key no código front-end em produção
- As chamadas à API do Asaas devem ser feitas através de um backend
- Implemente um servidor intermediário que:
  1. Recebe a solicitação do front-end
  2. Valida os dados
  3. Faz a chamada ao Asaas com a API Key segura
  4. Retorna o resultado ao front-end

## Próximos Passos

1. Criar um backend (Node.js, PHP, etc.) para intermediar as chamadas
2. Implementar verificação de webhooks para confirmação automática
3. Adicionar lógica de renovação automática de assinaturas
4. Implementar tratamento de erros mais robusto
5. Adicionar logs de todas as transações
6. Configurar ambiente de testes separado

## Documentação Oficial

- Documentação completa: https://docs.asaas.com/
- Referência da API: https://docs.asaas.com/reference/
- Guia de integração: https://docs.asaas.com/docs/integracao

## Suporte

Em caso de dúvidas, entre em contato com o suporte do Asaas:
- Email: atendimento@asaas.com
- Chat: Disponível no dashboard do Asaas
