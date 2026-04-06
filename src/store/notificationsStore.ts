import { create } from 'zustand';

// Notifications are a client-side/mobile concern not yet modeled in the backend.
// For now, keep them client-side until the backend adds a notifications entity.

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent_request' | 'donation_reminder' | 'thank_you' | 'general';
  isRead: boolean;
  createdAt: string;
  relatedRequestId?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    // TODO: Replace with GraphQL query when backend adds notification support
    // For now, notifications are managed locally
    set({ isLoading: false });
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  fetchUnreadCount: async () => {
    const { notifications } = get();
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ unreadCount });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
