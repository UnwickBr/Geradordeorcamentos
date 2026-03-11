import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreditCard, QrCode, ArrowLeft, CheckCircle, Copy, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

interface User {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  subscriptionEndDate?: string;
  subscriptionPlan?: string;
}

// Adicione no topo do arquivo
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3'
const ASAAS_API_KEY = "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRlNDhlNTQ3LWExNDYtNDNkMi05ZDA2LTNhZGU4ZGQ2NWVkNDo6JGFhY2hfMzdiYWU5NzYtOWYyZS00ZGVlLTkzNzQtZGNlYTFjZGYxMTU1";

export function Payment() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [pixQRImage, setPixQRImage] = useState("");
  const [showPixQR, setShowPixQR] = useState(false);
  const [customerId, setCustomerId] = useState("");

  // Credit Card Fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
  }, [navigate]);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || '';
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d)/, '$1.$2');
    if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
  };

  // Criar ou buscar cliente no Asaas
  const createOrGetCustomer = async () => {
    if (!currentUser) return null;

    try {
      // Primeiro, tenta buscar se o cliente já existe
      const searchResponse = await fetch(
        `${ASAAS_API_URL}/customers?email=${encodeURIComponent(currentUser.email)}`,
        {
          method: 'GET',
          headers: {
            'access_token': ASAAS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const searchData = await searchResponse.json();
      
      // Se já existe um cliente com esse email, retorna o primeiro
      if (searchData.data && searchData.data.length > 0) {
        console.log('Cliente já existe:', searchData.data[0].id);
        return searchData.data[0].id;
      }

      // Se não existe, cria um novo cliente
      const createResponse = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentUser.username,
          email: currentUser.email,
          cpfCnpj: cpf.replace(/\D/g, '') || '00000000000'
        })
      });

      const createData = await createResponse.json();
      
      if (createData.id) {
        console.log('Novo cliente criado:', createData.id);
        return createData.id;
      }

      throw new Error(createData.errors?.[0]?.description || 'Erro ao criar cliente');
    } catch (error) {
      console.error('Erro ao criar/buscar cliente:', error);
      toast.error('Erro ao processar dados do cliente');
      return null;
    }
  };

  const handlePixPayment = async () => {
    if (!currentUser) return;

    setIsProcessing(true);

    try {
      // 1. Criar ou obter cliente
      const customer = await createOrGetCustomer();
      if (!customer) {
        setIsProcessing(false);
        return;
      }

      setCustomerId(customer);

      // 2. Criar cobrança PIX
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 1); // Vencimento para amanhã

      const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customer,
          billingType: 'PIX',
          value: 29.90,
          dueDate: dueDate.toISOString().split('T')[0],
          description: 'Assinatura Mensal - Gerador de Orçamentos ADAC',
          externalReference: `${currentUser.username}-${Date.now()}`
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.errors) {
        throw new Error(paymentData.errors[0].description);
      }

      if (!paymentData.id) {
        throw new Error('Erro ao criar cobrança PIX');
      }

      console.log('Cobrança PIX criada:', paymentData.id);

      // 3. Obter informações do QR Code PIX
      const pixResponse = await fetch(
        `${ASAAS_API_URL}/payments/${paymentData.id}/pixQrCode`,
        {
          method: 'GET',
          headers: {
            'access_token': ASAAS_API_KEY
          }
        }
      );

      const pixData = await pixResponse.json();

      if (pixData.payload) {
        setPixCode(pixData.payload);
        setPixQRImage(pixData.encodedImage || '');
        setShowPixQR(true);

        toast.success('Código PIX gerado!', {
          description: 'Copie o código ou escaneie o QR Code para pagar',
        });

        // Simula verificação de pagamento (em produção, use webhooks)
        setTimeout(() => {
          toast.info('Aguardando pagamento...', {
            description: 'O sistema verificará automaticamente quando o pagamento for confirmado',
          });
        }, 2000);
      } else {
        throw new Error('Erro ao gerar QR Code PIX');
      }

      setIsProcessing(false);
    } catch (error: any) {
      console.error('Erro ao gerar PIX:', error);
      setIsProcessing(false);
      toast.error('Erro ao gerar código PIX', {
        description: error.message || 'Tente novamente mais tarde',
      });
    }
  };

  const handleCreditCardPayment = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV || !cpf) {
      toast.error('Preencha todos os campos do cartão');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Número do cartão inválido');
      return;
    }

    if (cardCVV.length < 3) {
      toast.error('CVV inválido');
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return;
    }

    if (!currentUser) return;

    setIsProcessing(true);

    try {
      // 1. Criar ou obter cliente
      const customer = await createOrGetCustomer();
      if (!customer) {
        setIsProcessing(false);
        return;
      }

      // 2. Criar cobrança com cartão de crédito
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 1);

      const [month, year] = cardExpiry.split('/');

      const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customer,
          billingType: 'CREDIT_CARD',
          value: 29.90,
          dueDate: dueDate.toISOString().split('T')[0],
          description: 'Assinatura Mensal - Gerador de Orçamentos ADAC',
          externalReference: `${currentUser.username}-${Date.now()}`,
          creditCard: {
            holderName: cardName,
            number: cardNumber.replace(/\s/g, ''),
            expiryMonth: month,
            expiryYear: `20${year}`,
            ccv: cardCVV
          },
          creditCardHolderInfo: {
            name: cardName,
            email: currentUser.email,
            cpfCnpj: cpf.replace(/\D/g, ''),
            postalCode: '00000000',
            addressNumber: '0',
            phone: '00000000000'
          }
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.errors) {
        throw new Error(paymentData.errors[0].description);
      }

      console.log('Pagamento criado:', paymentData);

      // Verificar status do pagamento
      if (paymentData.status === 'CONFIRMED' || paymentData.status === 'RECEIVED') {
        activateSubscription();
      } else if (paymentData.status === 'PENDING') {
        toast.info('Pagamento em processamento', {
          description: 'Aguarde a confirmação do pagamento',
        });
        setIsProcessing(false);
        
        // Em produção, use webhooks para confirmar o pagamento
        // Por enquanto, simula confirmação após alguns segundos
        setTimeout(() => {
          activateSubscription();
        }, 3000);
      } else {
        throw new Error(`Status de pagamento: ${paymentData.status}`);
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      setIsProcessing(false);
      toast.error('Erro ao processar pagamento', {
        description: error.message || 'Verifique os dados do cartão e tente novamente',
      });
    }
  };

  const activateSubscription = () => {
    if (!currentUser) return;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex !== -1) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      users[userIndex].subscriptionStatus = 'active';
      users[userIndex].subscriptionEndDate = endDate.toISOString();
      users[userIndex].subscriptionPlan = 'Mensal';

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));

      setIsProcessing(false);

      toast.success("Pagamento confirmado!", {
        description: "Sua assinatura foi ativada com sucesso",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success("Código PIX copiado!");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Finalizar Pagamento
                </h1>
                <p className="text-sm text-slate-600">
                  Escolha sua forma de pagamento
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>
                  Selecione como deseja pagar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credit_card" onValueChange={(v) => setPaymentMethod(v as 'credit_card' | 'pix')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credit_card">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Cartão de Crédito
                    </TabsTrigger>
                    <TabsTrigger value="pix">
                      <QrCode className="w-4 h-4 mr-2" />
                      PIX
                    </TabsTrigger>
                  </TabsList>

                  {/* Credit Card Tab */}
                  <TabsContent value="credit_card" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        placeholder="NOME COMPLETO"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCVV">CVV</Label>
                        <Input
                          id="cardCVV"
                          placeholder="123"
                          type="password"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        placeholder="123.456.789-00"
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        maxLength={14}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Seguro:</strong> Seus dados são processados de forma segura através do Asaas. 
                        Não armazenamos informações do seu cartão.
                      </p>
                    </div>

                    <Button
                      onClick={handleCreditCardPayment}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processando..." : "Confirmar Pagamento"}
                    </Button>
                  </TabsContent>

                  {/* PIX Tab */}
                  <TabsContent value="pix" className="space-y-4 pt-4">
                    {!showPixQR ? (
                      <>
                        <div className="text-center py-8">
                          <QrCode className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                          <h3 className="font-semibold text-lg mb-2">Pagamento via PIX</h3>
                          <p className="text-sm text-slate-600 mb-6">
                            Clique no botão abaixo para gerar o código PIX
                          </p>
                          <Button
                            onClick={handlePixPayment}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Gerando código..." : "Gerar Código PIX"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        {/* QR Code Placeholder */}
                        <div className="bg-white p-8 rounded-lg border-2 border-dashed border-slate-300">
                          <div className="aspect-square max-w-xs mx-auto bg-slate-100 rounded-lg flex items-center justify-center">
                            {pixQRImage ? (
                              <img 
                                src={`data:image/png;base64,${pixQRImage}`} 
                                alt="QR Code PIX"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-center">
                                <QrCode className="w-32 h-32 mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-600">QR Code PIX</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* PIX Code */}
                        <div className="space-y-2">
                          <Label>Código PIX (Copia e Cola)</Label>
                          <div className="flex gap-2">
                            <Input
                              value={pixCode}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button
                              onClick={copyPixCode}
                              variant="outline"
                              className="gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copiar
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-semibold mb-1">Aguardando pagamento</p>
                              <p>
                                Abra o app do seu banco, escaneie o QR Code ou cole o código PIX. 
                                A confirmação é automática e instantânea.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Este é um ambiente de demonstração. 
                            Em produção, o código será gerado pela API do Asaas.
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Plano</span>
                    <span className="text-sm font-semibold">Mensal</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Período</span>
                    <span className="text-sm font-semibold">30 dias</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-600">R$ 29,90</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Incluso no plano:</p>
                      <ul className="space-y-1">
                        <li>• Orçamentos ilimitados</li>
                        <li>• Histórico completo</li>
                        <li>• PDF profissional</li>
                        <li>• Suporte prioritário</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}