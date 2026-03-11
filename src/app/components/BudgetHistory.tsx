import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FileText, Search, Eye, Trash2, LogOut, Plus, Users, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BudgetPreview } from "./BudgetPreview";
import type { BudgetData } from "./BudgetGenerator";
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
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

interface SavedBudget extends BudgetData {
  savedAt: string;
}

export function BudgetHistory() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<SavedBudget[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<SavedBudget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<SavedBudget | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setIsAdmin(userData.isAdmin);
      setCurrentUsername(userData.username);
    }
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    const saved = localStorage.getItem("savedBudgets");
    const currentUser = localStorage.getItem("currentUser");
    
    if (saved && currentUser) {
      const userData = JSON.parse(currentUser);
      const allBudgets = JSON.parse(saved);
      
      // If admin, show all budgets. Otherwise, show only user's budgets (case-insensitive)
      if (userData.isAdmin) {
        setBudgets(allBudgets);
      } else {
        const userBudgets = allBudgets.filter((b: any) => 
          b.createdBy?.toLowerCase() === userData.username?.toLowerCase()
        );
        setBudgets(userBudgets);
      }
    }
  };

  const handleDeleteBudget = (budget: SavedBudget) => {
    const updated = budgets.filter(b => b.budgetNumber !== budget.budgetNumber);
    localStorage.setItem("savedBudgets", JSON.stringify(updated));
    setBudgets(updated);
    setBudgetToDelete(null);
    if (selectedBudget?.budgetNumber === budget.budgetNumber) {
      setSelectedBudget(null);
    }
    toast.success("Orçamento excluído", {
      description: `Orçamento Nº ${budget.budgetNumber} foi removido`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const filteredBudgets = budgets.filter(budget =>
    budget.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.budgetNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50">
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
                  Histórico de Orçamentos
                </h1>
                <p className="text-sm text-slate-600">
                  {budgets.length} {budgets.length === 1 ? "orçamento" : "orçamentos"} 
                  {isAdmin ? " (Todos os usuários)" : ` de ${currentUsername}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Orçamento
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Budgets List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle>Orçamentos</CardTitle>
                <CardDescription>
                  Selecione um orçamento para visualizar
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por cliente ou número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Budget List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredBudgets.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      {searchTerm ? "Nenhum orçamento encontrado" : "Nenhum orçamento salvo"}
                    </div>
                  ) : (
                    filteredBudgets.map((budget) => (
                      <div
                        key={budget.budgetNumber}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedBudget?.budgetNumber === budget.budgetNumber
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-slate-200 hover:border-blue-200"
                        }`}
                        onClick={() => setSelectedBudget(budget)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                                Nº {budget.budgetNumber}
                              </span>
                              <span className="text-xs text-slate-500">
                                {budget.date}
                              </span>
                            </div>
                            <p className="font-semibold text-slate-900">{budget.client}</p>
                            <p className="text-sm text-slate-600">{budget.phone}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-slate-500">
                                {budget.items.length} {budget.items.length === 1 ? "item" : "itens"}
                              </p>
                              {isAdmin && (budget as any).createdBy && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs text-slate-500">
                                    por {(budget as any).createdBy}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBudget(budget);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBudgetToDelete(budget);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Preview */}
          <div className="lg:col-span-3">
            <BudgetPreview budgetData={selectedBudget} />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento Nº {budgetToDelete?.budgetNumber} do cliente{" "}
              <strong>{budgetToDelete?.client}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => budgetToDelete && handleDeleteBudget(budgetToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}