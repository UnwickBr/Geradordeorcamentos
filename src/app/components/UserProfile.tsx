import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Lock, CreditCard, Calendar, CheckCircle, XCircle, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { Badge } from "./ui/badge";

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

export function UserProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
    setEmail(user.email);
  }, [navigate]);

  const handleUpdateProfile = () => {
    if (!currentUser) return;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) {
      toast.error("Erro ao atualizar perfil");
      return;
    }

    // Update email
    users[userIndex].email = email;

    // Update password if provided
    if (newPassword) {
      if (users[userIndex].password !== currentPassword) {
        toast.error("Senha atual incorreta");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("A nova senha deve ter pelo menos 6 caracteres");
        return;
      }

      users[userIndex].password = newPassword;
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
    setCurrentUser(users[userIndex]);

    toast.success("Perfil atualizado com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubscribe = () => {
    navigate("/payment");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser) return null;

  const subscriptionStatus = currentUser.subscriptionStatus || 'inactive';
  const subscriptionEndDate = currentUser.subscriptionEndDate 
    ? new Date(currentUser.subscriptionEndDate).toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Meu Perfil
                </h1>
                <p className="text-sm text-slate-600">
                  {currentUser.username}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Informações do Perfil</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Conta</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e senha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    value={currentUser.username}
                    disabled
                    className="bg-slate-100"
                  />
                  <p className="text-xs text-slate-500">
                    O nome de usuário não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Alterar Senha</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleUpdateProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Assinatura</CardTitle>
                <CardDescription>
                  Gerencie sua assinatura mensal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Status */}
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {subscriptionStatus === 'active' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900">Status da Assinatura</h3>
                        <p className="text-sm text-slate-600">
                          {subscriptionStatus === 'active' && 'Assinatura Ativa'}
                          {subscriptionStatus === 'trial' && 'Período de Teste'}
                          {subscriptionStatus === 'inactive' && 'Sem Assinatura Ativa'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        subscriptionStatus === 'active'
                          ? 'bg-green-600'
                          : subscriptionStatus === 'trial'
                          ? 'bg-yellow-600'
                          : 'bg-slate-600'
                      }
                    >
                      {subscriptionStatus === 'active' && 'Ativo'}
                      {subscriptionStatus === 'trial' && 'Trial'}
                      {subscriptionStatus === 'inactive' && 'Inativo'}
                    </Badge>
                  </div>

                  {subscriptionEndDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {subscriptionStatus === 'active' 
                          ? `Renova em: ${subscriptionEndDate}`
                          : `Expirou em: ${subscriptionEndDate}`
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Plan Details */}
                <div className="grid gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Plano Mensal</h3>
                          <p className="text-sm text-slate-600">
                            Acesso completo ao sistema
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">R$ 29,90</div>
                          <div className="text-sm text-slate-600">/mês</div>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Orçamentos ilimitados</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Histórico completo</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Geração de PDF profissional</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Suporte prioritário</span>
                        </li>
                      </ul>

                      <Button
                        onClick={handleSubscribe}
                        className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                        disabled={subscriptionStatus === 'active'}
                      >
                        <CreditCard className="w-4 h-4" />
                        {subscriptionStatus === 'active' ? 'Assinatura Ativa' : 'Assinar Agora'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {subscriptionStatus === 'active' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Nota:</strong> Para cancelar sua assinatura, entre em contato com o suporte.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}