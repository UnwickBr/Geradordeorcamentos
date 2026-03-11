import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Loader2, User, Lock } from "lucide-react";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { ThemeToggle } from "./ThemeToggle";

interface UserData {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  googleId?: string;
  blocked?: boolean;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
  subscriptionEndDate?: string;
  subscriptionPlan?: string;
}

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize admin account if not exists
    const usersData = localStorage.getItem("users");
    const users: UserData[] = usersData ? JSON.parse(usersData) : [];
    
    // Check if admin account exists
    const adminExists = users.some(u => u.username === "unwick");
    
    if (!adminExists) {
      // Create admin account
      const adminUser: UserData = {
        username: "unwick",
        password: "01043678vV@",
        email: "fariavictor@live.com",
        isAdmin: true,
        createdAt: new Date().toISOString(),
        blocked: false,
      };
      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      // Update existing admin email if different
      const adminIndex = users.findIndex(u => u.username === "unwick");
      if (adminIndex !== -1 && users[adminIndex].email !== "fariavictor@live.com") {
        users[adminIndex].email = "fariavictor@live.com";
        localStorage.setItem("users", JSON.stringify(users));
      }
    }

    // Check if Farias account exists
    const fariasExists = users.some(u => u.username === "Farias");
    
    if (!fariasExists) {
      // Create Farias account
      const fariasUser: UserData = {
        username: "Farias",
        password: "33494410",
        email: "fariasestofados@outlook.com.br",
        isAdmin: false,
        createdAt: new Date().toISOString(),
        blocked: false,
      };
      users.push(fariasUser);
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Get users from localStorage
    const usersData = localStorage.getItem("users");
    const users: UserData[] = usersData ? JSON.parse(usersData) : [];
    
    // Find user (case-insensitive username)
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      // Check if user is blocked
      if (user.blocked && !user.isAdmin) {
        setError("Sua conta foi bloqueada. Entre em contato com o administrador.");
        return;
      }
      
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/");
    } else {
      setError("Usuário ou senha incorretos");
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const usersData = localStorage.getItem("users");
      const users: UserData[] = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      let existingUser = users.find(u => u.googleId === googleUser.uid);
      
      if (!existingUser) {
        // Create new user
        const newUser: UserData = {
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
        if (existingUser.blocked && !existingUser.isAdmin) {
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
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      toast.error("Erro ao fazer login com o Google", {
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
          <CardTitle className="text-2xl text-center dark:text-white">Bem-vindo</CardTitle>
          <CardDescription className="text-center dark:text-slate-400">
            Sistema de Gerenciamento de Orçamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <Label htmlFor="password" className="dark:text-slate-200">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              Entrar
            </Button>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Não tem uma conta?{" "}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Criar conta
              </Link>
            </div>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Ou entre com o Google
            </div>

            <Button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? "Carregando..." : "Entrar com o Google"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}