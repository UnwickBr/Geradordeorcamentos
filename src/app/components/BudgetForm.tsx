import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { BudgetData, BudgetItem } from "./BudgetGenerator";

interface BudgetFormProps {
  onGenerateBudget: (data: BudgetData) => void;
}

export function BudgetForm({ onGenerateBudget }: BudgetFormProps) {
  // Get current user to check if fields should be pre-filled
  const currentUserData = localStorage.getItem("currentUser");
  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
  const shouldPreFill = currentUser && (currentUser.username === "unwick" || currentUser.username === "Farias");

  // Company info
  const [companyName, setCompanyName] = useState(shouldPreFill ? "ADAC" : "");
  const [companySubtitle, setCompanySubtitle] = useState(shouldPreFill ? "Farias Estofados" : "");
  const [companyAddress, setCompanyAddress] = useState(
    shouldPreFill ? "Rua Elza Nader Borges, 524 - Village do Sol\nGuarapari - ES" : ""
  );
  const [companyCNPJ, setCompanyCNPJ] = useState(shouldPreFill ? "45.299.216.0001/38" : "");
  const [companyPhone, setCompanyPhone] = useState(shouldPreFill ? "(27) 99619-1126" : "");
  const [companyEmail, setCompanyEmail] = useState(shouldPreFill ? "fariasestofados@hotmail.com.br" : "");

  // Client info
  const [client, setClient] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentCondition, setPaymentCondition] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(shouldPreFill ? "15 dias" : "");

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    description: "",
    quantity: "",
    unit: "",
    unitPrice: "",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleAddItem = () => {
    if (
      !currentItem.description ||
      !currentItem.quantity ||
      !currentItem.unit ||
      !currentItem.unitPrice
    ) {
      return;
    }

    const unitPrice = parseFloat(currentItem.unitPrice);
    const quantity = parseFloat(currentItem.quantity);
    const total = quantity * unitPrice;

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: currentItem.description,
      quantity: currentItem.quantity,
      unit: currentItem.unit,
      unitPrice,
      total,
    };

    setItems([...items, newItem]);
    setCurrentItem({ description: "", quantity: "", unit: "", unitPrice: "" });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getNextBudgetNumber = () => {
    const currentCounter = parseInt(localStorage.getItem("budgetCounter") || "0");
    const nextNumber = currentCounter + 1;
    return nextNumber.toString().padStart(4, "0");
  };

  const handleConfirmGenerate = () => {
    setShowConfirmDialog(false);
    handleGenerateBudget();
  };

  const handleGenerateBudget = () => {
    const budgetNumber = getNextBudgetNumber();
    localStorage.setItem("budgetCounter", budgetNumber);
    const date = new Date().toLocaleDateString("pt-BR");

    const budgetData: BudgetData = {
      companyName,
      companySubtitle,
      companyAddress,
      companyCNPJ,
      companyPhone,
      companyEmail,
      budgetNumber,
      date,
      client,
      street,
      city,
      cep,
      uf,
      phone,
      paymentCondition,
      downPayment,
      deliveryTime,
      items,
    };

    onGenerateBudget(budgetData);
  };

  const totalBudget = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>Informações do Orçamento</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Dados da Empresa</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySubtitle">Subtítulo</Label>
              <Input
                id="companySubtitle"
                value={companySubtitle}
                onChange={(e) => setCompanySubtitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress">Endereço da Empresa</Label>
            <Textarea
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="companyCNPJ">CNPJ</Label>
              <Input
                id="companyCNPJ"
                value={companyCNPJ}
                onChange={(e) => setCompanyCNPJ(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone">Telefone da Empresa</Label>
              <Input
                id="companyPhone"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail">Email</Label>
            <Input
              id="companyEmail"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-slate-900">Dados do Cliente</h3>

          <div className="space-y-2">
            <Label htmlFor="client">Cliente *</Label>
            <Input
              id="client"
              placeholder="Nome do cliente"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Rua/Endereço *</Label>
            <Input
              id="street"
              placeholder="-----"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="----"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                placeholder="----"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF *</Label>
              <Input
                id="uf"
                placeholder="ES"
                maxLength={2}
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              placeholder="(xx) xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Condição de Pagamento *</Label>
            <Input
              id="payment"
              placeholder="50% de entrada, restante na entrega | PIX: 45.299.216.0001/38 (CNPJ)"
              value={paymentCondition}
              onChange={(e) => setPaymentCondition(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="downPayment">Entrada</Label>
              <Input
                id="downPayment"
                placeholder="DD/MM/AAAA"
                maxLength={10}
                value={downPayment}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2);
                  }
                  if (value.length >= 5) {
                    value = value.slice(0, 5) + "/" + value.slice(5, 9);
                  }
                  setDownPayment(value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Previsão de Entrega</Label>
              <Input
                id="deliveryTime"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-slate-900">Itens do Orçamento</h3>

          {/* Add Item Form */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="------------------------------------"
                value={currentItem.description}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  placeholder="xx"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, quantity: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  placeholder="xx"
                  value={currentItem.unit}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, unit: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Valor Unitário (R$)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="xx.xx,xxx"
                  min="0"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, unitPrice: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleAddItem}
              className="w-full"
              variant="outline"
              disabled={
                !currentItem.description ||
                !currentItem.quantity ||
                !currentItem.unit ||
                !currentItem.unitPrice
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Itens adicionados
                </span>
                <span className="text-sm text-slate-600">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </span>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 bg-white border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{item.description}</p>
                    <p className="text-sm text-slate-600">
                      {item.quantity} x {item.unit} - R${" "}
                      {item.unitPrice.toFixed(2)} = R$ {item.total.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    R$ {totalBudget.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={() => setShowConfirmDialog(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
          disabled={
            !client ||
            !street ||
            !city ||
            !cep ||
            !uf ||
            !phone ||
            !paymentCondition ||
            items.length === 0
          }
        >
          Gerar Orçamento
        </Button>

        {/* Confirm Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Geração de Orçamento</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>Você tem certeza que deseja gerar este orçamento?</p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    ⚠️ Atenção:
                  </p>
                  <p className="text-sm text-blue-800">
                    Será gerado um novo número de série sequencial:
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    Nº {getNextBudgetNumber()}
                  </p>
                </div>
                <p className="text-sm text-slate-600">
                  Esta ação não poderá ser desfeita e o número será incrementado permanentemente.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmGenerate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirmar e Gerar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}