"use client";

import { useState } from "react";
import { authApi } from "@/lib/services/authApi";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await authApi.signIn({ username, password });
      console.log("Login successful:", response);
      console.log("Login response roles:", response.roles);
      console.log("Login response full structure:", JSON.stringify(response, null, 2));
      
      // Actualizar el estado del usuario en el contexto
      login(response);
      
      // Esperar un poco para que el contexto se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirigir según el rol del usuario
      if (response.roles && (response.roles.includes('ADMIN') || response.roles.includes('ROLE_ADMIN'))) {
        console.log("Login: User is admin, redirecting to dashboard");
        window.location.href = "/dashboard";
      } else {
        console.log("Login: User is not admin, redirecting to home");
        window.location.href = "/";
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-cyan-800 dark:from-white dark:via-emerald-200 dark:to-cyan-200 bg-clip-text text-transparent mb-3">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Inicia sesión en tu cuenta de Food Facts
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-fade-in-up">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium">
                  Usuario
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in-up">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes una cuenta?{" "}
                <Link 
                  href="/register" 
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
            
            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                ← Volver al inicio
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
