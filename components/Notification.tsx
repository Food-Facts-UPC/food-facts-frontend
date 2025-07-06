import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Notification({ 
  type, 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: NotificationProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          messageColor: "text-green-700"
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: XCircle,
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          messageColor: "text-red-700"
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: AlertCircle,
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          messageColor: "text-yellow-700"
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: Info,
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          messageColor: "text-blue-700"
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-5 duration-300`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${styles.titleColor}`}>
            {title}
          </h3>
          {message && (
            <p className={`text-sm mt-1 ${styles.messageColor}`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${styles.iconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
