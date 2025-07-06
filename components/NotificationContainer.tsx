import { Notification } from "./Notification";
import { useNotifications } from "@/lib/hooks/useNotifications";

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
          autoClose={notification.autoClose}
          duration={notification.duration}
        />
      ))}
    </div>
  );
}
