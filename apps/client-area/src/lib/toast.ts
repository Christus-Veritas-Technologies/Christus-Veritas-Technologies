import { toast as sonnerToast } from "sonner";

// Create a wrapper that checks notification settings
// The settings are stored in localStorage and can be accessed synchronously

type NotificationType = 
  | "newUser" 
  | "newPayment" 
  | "newService" 
  | "weeklySummary" 
  | "general";

interface NotificationSettings {
  emailNewUser: boolean;
  emailNewPayment: boolean;
  emailNewService: boolean;
  emailWeeklySummary: boolean;
  inAppNotifications: boolean;
}

function getNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") {
    return {
      emailNewUser: true,
      emailNewPayment: true,
      emailNewService: true,
      emailWeeklySummary: true,
      inAppNotifications: true,
    };
  }

  try {
    const stored = localStorage.getItem("app-settings");
    if (stored) {
      const settings = JSON.parse(stored);
      return settings.notifications || {
        emailNewUser: true,
        emailNewPayment: true,
        emailNewService: true,
        emailWeeklySummary: true,
        inAppNotifications: true,
      };
    }
  } catch {
    // Ignore parse errors
  }

  return {
    emailNewUser: true,
    emailNewPayment: true,
    emailNewService: true,
    emailWeeklySummary: true,
    inAppNotifications: true,
  };
}

function shouldShowNotification(type?: NotificationType): boolean {
  const settings = getNotificationSettings();

  // First check if in-app notifications are enabled at all
  if (!settings.inAppNotifications) {
    return false;
  }

  // If no specific type, or "general" type, just check inAppNotifications
  if (!type || type === "general") {
    return true;
  }

  // Check specific notification type
  switch (type) {
    case "newUser":
      return settings.emailNewUser;
    case "newPayment":
      return settings.emailNewPayment;
    case "newService":
      return settings.emailNewService;
    case "weeklySummary":
      return settings.emailWeeklySummary;
    default:
      return true;
  }
}

// Wrapper toast functions that respect notification settings
export const toast = {
  success: (message: string, type?: NotificationType) => {
    if (shouldShowNotification(type)) {
      sonnerToast.success(message);
    }
  },
  error: (message: string, type?: NotificationType) => {
    // Always show error toasts - they're important
    sonnerToast.error(message);
  },
  warning: (message: string, type?: NotificationType) => {
    if (shouldShowNotification(type)) {
      sonnerToast.warning(message);
    }
  },
  info: (message: string, type?: NotificationType) => {
    if (shouldShowNotification(type)) {
      sonnerToast.info(message);
    }
  },
  message: (message: string, type?: NotificationType) => {
    if (shouldShowNotification(type)) {
      sonnerToast.message(message);
    }
  },
  // For cases where you need the raw sonner toast (e.g., custom rendering)
  raw: sonnerToast,
};

export { type NotificationType };
