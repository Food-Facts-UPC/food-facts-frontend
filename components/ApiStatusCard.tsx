"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ApiStatus {
  profiles: boolean;
  restaurants: boolean;
  products: boolean;
}

export default function ApiStatusCard() {
  const [status, setStatus] = useState<ApiStatus>({
    profiles: false,
    restaurants: false,
    products: false,
  });
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setLoading(true);
    const newStatus: ApiStatus = {
      profiles: false,
      restaurants: false,
      products: false,
    };

    // Test profiles API
    try {
      await api.profiles.getAll();
      newStatus.profiles = true;
    } catch (e) {
      console.warn("Profiles API not available:", e);
    }

    // Test restaurants API
    try {
      await api.restaurants.getAll();
      newStatus.restaurants = true;
    } catch (e) {
      console.warn("Restaurants API not available:", e);
    }

    // Test products API
    try {
      await api.products.getAll();
      newStatus.products = true;
    } catch (e) {
      console.warn("Products API not available:", e);
    }

    setStatus(newStatus);
    setLastChecked(new Date());
    setLoading(false);
  };

  useEffect(() => {
    checkApiStatus();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (isOnline: boolean) => {
    if (isOnline) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (isOnline: boolean) => {
    if (isOnline) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
          Online
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
        Offline
      </span>
    );
  };

  const overallStatus = Object.values(status).every(Boolean);

  return (
    <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
          {overallStatus ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          )}
          Estado de la API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.profiles)}
              <span className="text-sm font-medium">Profiles</span>
            </div>
            {getStatusBadge(status.profiles)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.restaurants)}
              <span className="text-sm font-medium">Restaurants</span>
            </div>
            {getStatusBadge(status.restaurants)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.products)}
              <span className="text-sm font-medium">Products</span>
            </div>
            {getStatusBadge(status.products)}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {lastChecked && (
                <span>
                  Última verificación: {lastChecked.toLocaleTimeString()}
                </span>
              )}
            </div>
            <Button
              onClick={checkApiStatus}
              disabled={loading}
              variant="outline"
              size="sm"
              className="h-8"
            >
              {loading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
