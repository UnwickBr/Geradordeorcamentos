import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, User, Mail, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { ThemeToggle } from "./ThemeToggle";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";

interface User {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  googleId?: string;
  blocked?: boolean;
}

export function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (username.length < 3) {
      setError("O usuário deve ter no mínimo 3 caracteres");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    // Get existing users
    const usersData = localStorage.getItem("users");
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    // Check if username already exists (case-insensitive)
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError("Este usuário já existe");
      return;
    }

    // Check if email already exists (case-insensitive)
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError("Este email já está cadastrado");
      return;
    }

    // Create new user
    const newUser: User = {
      username,
      email,
      password,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Conta criada com sucesso!", {
      description: "Você já pode fazer login",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const usersData = localStorage.getItem("users");
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      let existingUser = users.find(u => u.googleId === googleUser.uid);
      
      if (!existingUser) {
        // Create new user
        const newUser: User = {
          username: googleUser.displayName || googleUser.email?.split('@')[0] || "user",
          password: "",
          email: googleUser.email || "",
          isAdmin: false,
          createdAt: new Date().toISOString(),
          googleId: googleUser.uid,
          blocked: false,
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        existingUser = newUser;
      } else {
        // Check if user is blocked
        if (existingUser.blocked) {
          toast.error("Conta bloqueada", {
            description: "Sua conta foi bloqueada. Entre em contato com o administrador.",
          });
          setIsGoogleLoading(false);
          return;
        }
      }
      
      // Set current user
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      toast.success("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao criar conta com Google:", error);
      toast.error("Erro ao criar conta com o Google", {
        description: error.message || "Tente novamente"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
      <Toaster position="top-right" />
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-xl dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-2 dark:text-slate-200 dark:hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center dark:text-white">Criar Conta</CardTitle>
          <CardDescription className="text-center dark:text-slate-400">
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="dark:text-slate-200">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-slate-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-slate-200">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-slate-200">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
              Criar Conta
            </Button>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Fazer login
              </Link>
            </div>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Ou crie conta com o Google
            </div>

            <Button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? "Carregando..." : "Criar conta com o Google"}
            </Button>

            <div className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
              <p>Usuários padrão podem criar e gerenciar seus próprios orçamentos.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}