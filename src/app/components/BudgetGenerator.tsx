import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BudgetForm } from "./BudgetForm";
import { BudgetPreview } from "./BudgetPreview";
import { FileText, History, LogOut, Users, User } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { ThemeToggle } from "./ThemeToggle";

export interface BudgetItem {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface BudgetData {
  // Company info
  companyName: string;
  companySubtitle: string;
  companyAddress: string;
  companyCNPJ: string;
  companyPhone: string;
  companyEmail: string;
  
  // Budget info
  budgetNumber: string;
  date: string;
  
  // Client info
  client: string;
  street: string;
  city: string;
  cep: string;
  uf: string;
  phone: string;
  paymentCondition: string;
  downPayment: string;
  deliveryTime: string;
  
  items: BudgetItem[];
}

export function BudgetGenerator() {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setIsAdmin(userData.isAdmin);
      setCurrentUsername(userData.username);
    }
  }, []);

  const handleGenerateBudget = (data: BudgetData) => {
    // Save budget to localStorage
    const savedBudgets = localStorage.getItem("savedBudgets");
    const budgets = savedBudgets ? JSON.parse(savedBudgets) : [];
    
    const budgetWithTimestamp = {
      ...data,
      savedAt: new Date().toISOString(),
      createdBy: currentUsername,
    };
    
    budgets.push(budgetWithTimestamp);
    localStorage.setItem("savedBudgets", JSON.stringify(budgets));
    
    setBudgetData(data);
    
    toast.success("Orçamento gerado com sucesso!", {
      description: `Orçamento Nº ${data.budgetNumber} para ${data.client}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gerador de Orçamentos
                </h1>
                <p className="text-sm text-slate-600">
                  {currentUsername ? `Bem-vindo, ${currentUsername}` : "Crie orçamentos profissionais de forma rápida e fácil"}
                  {isAdmin && " (Administrador)"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/history")}
                variant="outline"
                className="gap-2"
              >
                <History className="w-4 h-4" />
                Histórico
              </Button>
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Perfil
              </Button>
              {isAdmin && (
                <Button
                  onClick={() => navigate("/users")}
                  variant="outline"
                  className="gap-2 text-purple-600 hover:text-purple-700"
                >
                  <Users className="w-4 h-4" />
                  Usuários
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <BudgetForm onGenerateBudget={handleGenerateBudget} />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <BudgetPreview budgetData={budgetData} />
          </div>
        </div>
      </main>
    </div>
  );
}