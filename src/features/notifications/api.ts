import { apiFetch } from "@/core/api/client";
import type {
    ApiNotification,
    AppNotification,
    NotificationSettings,
    NotificationsData,
} from "./types";

const toNotification = (n: ApiNotification): AppNotification => ({
  id: n.id,
  kind: n.kind,
  title: n.title,
  body: n.body,
  read: n.read,
  createdAt: Date.parse(n.createdAt),
  orderId: n.orderId ?? undefined,
});

export const notificationsApi = {
  list: async (): Promise<NotificationsData> => {
    const data = await apiFetch<{
      items: ApiNotification[];
      unreadCount: number;
    }>("/notifications?limit=30");
    return {
      items: data.items.map(toNotification),
      unreadCount: data.unreadCount,
    };
  },

  readAll: () =>
    apiFetch<{ message: string }>("/notifications/read-all", {
      method: "POST",
    }),

  getSettings: async (): Promise<NotificationSettings> =>
    (
      await apiFetch<{ settings: NotificationSettings }>(
        "/me/notification-settings",
      )
    ).settings,

  putSettings: async (
    patch: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> =>
    (
      await apiFetch<{ settings: NotificationSettings }>(
        "/me/notification-settings",
        {
          method: "PUT",
          body: patch,
        },
      )
    ).settings,
};
