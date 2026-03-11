import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, Trash2, LogOut, Plus, Shield, User as UserIcon, ArrowLeft, CreditCard, CheckCircle, XCircle, Ban, Unlock, FileText, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
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
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface User {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  blocked?: boolean;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  subscriptionEndDate?: string;
  subscriptionPlan?: string;
}

interface SavedBudget {
  budgetNumber: string;
  client: string;
  date: string;
  total: number;
  createdBy: string;
  savedAt: string;
  items?: any[];
}

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToManageSubscription, setUserToManageSubscription] = useState<User | null>(null);
  const [userToToggleBlock, setUserToToggleBlock] = useState<User | null>(null);
  const [userBudgets, setUserBudgets] = useState<SavedBudget[]>([]);
  const [selectedUserForBudgets, setSelectedUserForBudgets] = useState<User | null>(null);
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    // Check if current user is admin
    const currentUserData = localStorage.getItem("currentUser");
    if (!currentUserData) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(currentUserData);
    if (!userData.isAdmin) {
      toast.error("Acesso negado", {
        description: "Apenas administradores podem acessar esta página",
      });
      navigate("/");
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const usersData = localStorage.getItem("users");
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  };

  const handleDeleteUser = (user: User) => {
    const currentUserData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    
    // Prevent admin from deleting themselves
    if (user.username === currentUserData.username) {
      toast.error("Erro", {
        description: "Você não pode excluir sua própria conta",
      });
      return;
    }

    // Prevent deleting admin account
    if (user.username === "unwick") {
      toast.error("Erro", {
        description: "A conta de administrador principal não pode ser excluída",
      });
      return;
    }

    const updated = users.filter(u => u.username !== user.username);
    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);
    setUserToDelete(null);

    // Delete all budgets from this user (case-insensitive)
    const savedBudgets = localStorage.getItem("savedBudgets");
    if (savedBudgets) {
      const budgets = JSON.parse(savedBudgets);
      const filteredBudgets = budgets.filter((b: any) => 
        b.createdBy?.toLowerCase() !== user.username?.toLowerCase()
      );
      localStorage.setItem("savedBudgets", JSON.stringify(filteredBudgets));
    }

    toast.success("Usuário excluído", {
      description: `O usuário ${user.username} foi removido do sistema`,
    });
  };

  const handleToggleSubscription = (user: User) => {
    const updated = users.map(u => {
      if (u.username === user.username) {
        if (u.subscriptionStatus === 'active') {
          return {
            ...u,
            subscriptionStatus: 'inactive' as const,
            subscriptionEndDate: new Date().toISOString(),
          };
        } else {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          return {
            ...u,
            subscriptionStatus: 'active' as const,
            subscriptionEndDate: endDate.toISOString(),
            subscriptionPlan: 'Mensal',
          };
        }
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);
    setUserToManageSubscription(null);

    const newStatus = user.subscriptionStatus === 'active' ? 'desativada' : 'ativada';
    toast.success(`Assinatura ${newStatus}`, {
      description: `A assinatura de ${user.username} foi ${newStatus}`,
    });
  };

  const handleToggleBlock = (user: User) => {
    const updated = users.map(u => {
      if (u.username === user.username) {
        return {
          ...u,
          blocked: !u.blocked,
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);
    setUserToToggleBlock(null);

    const newStatus = user.blocked ? 'desbloqueada' : 'bloqueada';
    toast.success(`Conta ${newStatus}`, {
      description: `A conta de ${user.username} foi ${newStatus}`,
    });
  };

  const handleViewUserBudgets = (user: User) => {
    const savedBudgets = localStorage.getItem("savedBudgets");
    if (savedBudgets) {
      const allBudgets: SavedBudget[] = JSON.parse(savedBudgets);
      const userSpecificBudgets = allBudgets.filter(b => 
        b.createdBy?.toLowerCase() === user.username?.toLowerCase()
      );
      setUserBudgets(userSpecificBudgets);
      setSelectedUserForBudgets(user);
    } else {
      setUserBudgets([]);
      setSelectedUserForBudgets(user);
    }
  };

  const calculateBudgetTotal = (budget: SavedBudget): number => {
    if (!budget.items || budget.items.length === 0) return 0;
    return budget.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubscriptionStats = () => {
    const active = users.filter(u => u.subscriptionStatus === 'active').length;
    const inactive = users.filter(u => u.subscriptionStatus !== 'active').length;
    return { active, inactive };
  };

  const stats = getSubscriptionStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gerenciamento de Usuários
                </h1>
                <p className="text-sm text-slate-600">
                  {users.length} {users.length === 1 ? "usuário" : "usuários"} cadastrados
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total de Usuários</p>
                  <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Assinaturas Ativas</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Sem Assinatura</p>
                  <p className="text-3xl font-bold text-slate-600">{stats.inactive}</p>
                </div>
                <XCircle className="w-8 h-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="shadow-lg">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Usuários</CardTitle>
                    <CardDescription>
                      Gerencie os usuários do sistema
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate("/signup")}
                    className="gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {users.length > 0 && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Privilégios de Administrador
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Visualizar e gerenciar todos os orçamentos do sistema</li>
                      <li>• Criar e excluir contas de usuário</li>
                      <li>• Gerenciar assinaturas e planos</li>
                      <li>• Acessar estatísticas completas do sistema</li>
                    </ul>
                  </div>
                )}
                <div className="space-y-2">
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum usuário cadastrado</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {users.map((user) => (
                        <div
                          key={user.username}
                          className="p-4 rounded-lg border bg-white border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-3 rounded-lg ${user.isAdmin ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                {user.isAdmin ? (
                                  <Shield className={`w-6 h-6 ${user.isAdmin ? 'text-purple-600' : 'text-blue-600'}`} />
                                ) : (
                                  <UserIcon className="w-6 h-6 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-slate-900">{user.username}</h3>
                                  {user.isAdmin && (
                                    <Badge className="bg-purple-600">Administrador</Badge>
                                  )}
                                  {user.username === "unwick" && (
                                    <Badge variant="outline" className="border-purple-600 text-purple-600">
                                      Principal
                                    </Badge>
                                  )}
                                  {user.username === "Farias" && (
                                    <Badge variant="outline" className="border-blue-600 text-blue-600">
                                      Conta Padrão
                                    </Badge>
                                  )}
                                  {user.blocked && (
                                    <Badge className="bg-red-600">
                                      <Ban className="w-3 h-3 mr-1" />
                                      Bloqueado
                                    </Badge>
                                  )}
                                  {user.subscriptionStatus === 'active' && (
                                    <Badge className="bg-green-600">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Assinante
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600">{user.email}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Criado em: {formatDate(user.createdAt)}
                                </p>
                                {user.subscriptionEndDate && (
                                  <p className="text-xs text-slate-500">
                                    Assinatura até: {formatDate(user.subscriptionEndDate)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewUserBudgets(user)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                title="Ver Orçamentos"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                              {!user.isAdmin && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setUserToManageSubscription(user)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="Gerenciar Assinatura"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </Button>
                              )}
                              {user.username !== "unwick" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setUserToDelete(user)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={JSON.parse(currentUser || "{}").username === user.username}
                                  title="Excluir Usuário"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                              {user.username !== "unwick" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setUserToToggleBlock(user)}
                                  className={
                                    user.blocked
                                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                      : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                  }
                                  title={user.blocked ? "Desbloquear Conta" : "Bloquear Conta"}
                                >
                                  {user.blocked ? (
                                    <Unlock className="w-4 h-4" />
                                  ) : (
                                    <Ban className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card className="shadow-lg">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle>Gerenciar Assinaturas</CardTitle>
                <CardDescription>
                  Visualize e gerencie os planos de assinatura
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {users.filter(u => !u.isAdmin).length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum usuário com assinatura</p>
                    </div>
                  ) : (
                    users.filter(u => !u.isAdmin).map((user) => (
                      <div
                        key={user.username}
                        className="p-4 rounded-lg border bg-white border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-100">
                              <UserIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{user.username}</h3>
                              <p className="text-sm text-slate-600">{user.email}</p>
                              {user.subscriptionEndDate && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {user.subscriptionStatus === 'active' 
                                    ? `Renova em: ${formatDate(user.subscriptionEndDate)}`
                                    : `Expirou em: ${formatDate(user.subscriptionEndDate)}`
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                user.subscriptionStatus === 'active'
                                  ? 'bg-green-600'
                                  : 'bg-slate-600'
                              }
                            >
                              {user.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => setUserToManageSubscription(user)}
                              variant="outline"
                              className={
                                user.subscriptionStatus === 'active'
                                  ? 'text-red-600 hover:text-red-700'
                                  : 'text-green-600 hover:text-green-700'
                              }
                            >
                              {user.subscriptionStatus === 'active' ? 'Desativar' : 'Ativar'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Plano Disponível</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-800">Plano Mensal</p>
                      <p className="text-xs text-blue-600">Acesso completo ao sistema</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">R$ 29,90</p>
                      <p className="text-xs text-blue-600">/mês</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{userToDelete?.username}</strong>? Esta ação não pode ser desfeita e todos os orçamentos deste usuário serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Subscription Dialog */}
      <AlertDialog open={!!userToManageSubscription} onOpenChange={() => setUserToManageSubscription(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerenciar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              {userToManageSubscription?.subscriptionStatus === 'active' ? (
                <>
                  Deseja desativar a assinatura de <strong>{userToManageSubscription?.username}</strong>?
                  O usuário perderá acesso aos recursos premium.
                </>
              ) : (
                <>
                  Deseja ativar a assinatura de <strong>{userToManageSubscription?.username}</strong>?
                  A assinatura será válida por 30 dias.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToManageSubscription && handleToggleSubscription(userToManageSubscription)}
              className={
                userToManageSubscription?.subscriptionStatus === 'active'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              {userToManageSubscription?.subscriptionStatus === 'active' ? 'Desativar' : 'Ativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Block Dialog */}
      <AlertDialog open={!!userToToggleBlock} onOpenChange={() => setUserToToggleBlock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerenciar Conta</AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggleBlock?.blocked ? (
                <>
                  Deseja desbloquear a conta de <strong>{userToToggleBlock?.username}</strong>?
                  O usuário poderá acessar o sistema novamente.
                </>
              ) : (
                <>
                  Deseja bloquear a conta de <strong>{userToToggleBlock?.username}</strong>?
                  O usuário não poderá acessar o sistema.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToToggleBlock && handleToggleBlock(userToToggleBlock)}
              className={
                userToToggleBlock?.blocked
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {userToToggleBlock?.blocked ? 'Desbloquear' : 'Bloquear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Budgets Dialog */}
      <Dialog open={!!selectedUserForBudgets} onOpenChange={() => setSelectedUserForBudgets(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Orçamentos de {selectedUserForBudgets?.username}
            </DialogTitle>
            <DialogDescription>
              Total de {userBudgets.length} {userBudgets.length === 1 ? 'orçamento criado' : 'orçamentos criados'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {userBudgets.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum orçamento criado por este usuário</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userBudgets.map((budget) => (
                  <div
                    key={budget.budgetNumber}
                    className="p-4 rounded-lg border bg-white border-slate-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-600">Nº {budget.budgetNumber}</Badge>
                          <span className="text-xs text-slate-500">{budget.date}</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          Cliente: {budget.client || 'Não informado'}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <p className="text-xs text-slate-500">Valor Total</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(calculateBudgetTotal(budget))}
                            </p>
                          </div>
                          {budget.items && budget.items.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-500">Itens</p>
                              <p className="text-sm font-semibold text-slate-700">
                                {budget.items.length} {budget.items.length === 1 ? 'item' : 'itens'}
                              </p>
                            </div>
                          )}
                        </div>
                        {budget.savedAt && (
                          <p className="text-xs text-slate-400 mt-2">
                            Criado em: {formatDate(budget.savedAt)}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/history')}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}