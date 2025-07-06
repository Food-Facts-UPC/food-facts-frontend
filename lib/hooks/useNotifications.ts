import { useState, useCallback } from "react";

interface NotificationState {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationState, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationState = {
      id,
      autoClose: true,
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Utility methods for common notification types
  const success = useCallback((title: string, message?: string) => {
    return addNotification({ type: "success", title, message });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string) => {
    return addNotification({ type: "error", title, message });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string) => {
    return addNotification({ type: "warning", title, message });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string) => {
    return addNotification({ type: "info", title, message });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}
