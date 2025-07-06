"use client";

import { createContext, useContext } from "react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { NotificationContainer } from "@/components/NotificationContainer";

interface NotificationContextType {
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { success, error, warning, info } = useNotifications();

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}
