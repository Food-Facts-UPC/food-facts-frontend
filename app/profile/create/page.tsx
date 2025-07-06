"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, MapPin, Mail, Phone, Home, Globe } from "lucide-react";
import { profilesApi } from "@/lib/services/profilesApi";

export default function CreateProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!user) {
      setError("Debes iniciar sesión para crear un perfil.");
      setIsLoading(false);
      return;
    }

    try {
      const newProfile = {
        firstName,
        lastName,
        email,
        street,
        number,
        city,
        postalCode,
        country,
      };
      await profilesApi.create(newProfile);
      setSuccess("¡Perfil creado exitosamente!");
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err) {
      setError("Error al crear el perfil. Por favor, verifica los datos.");
      console.error("Create profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <User className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crear tu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Completa tus datos para personalizar tu experiencia
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              Información Personal
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Proporciona tus datos básicos y dirección
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apellido *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Ingresa tu apellido"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Dirección
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Calle
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="Nombre de la calle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número
                    </Label>
                    <Input
                      id="number"
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ciudad
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="Ciudad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Código Postal
                    </Label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      País
                    </Label>
                    <Input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="País"
                    />
                  </div>
                </div>
              </div>

              {/* Mensajes de estado */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Botón de envío */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creando perfil...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Crear Perfil
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
