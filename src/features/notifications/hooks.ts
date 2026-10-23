import { errorMessage } from "@/core/api/ApiClientError";
import {
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";
import { Alert } from "react-native";
import { notificationsApi } from "./api";
import type { NotificationSettings, NotificationsData } from "./types";

export const notificationKeys = {
  list: ["notifications"] as const,
  settings: ["notification-settings"] as const,
};

const selectUnread = (data: NotificationsData) => data.unreadCount;

export const useNotifications = () =>
  useQuery({
    queryKey: notificationKeys.list,
    queryFn: notificationsApi.list,
    staleTime: 30_000,
    // New order updates arrive on the server, so check now and then
    refetchInterval: 60_000,
  });

/** Number behind the red dot on the Home bell */
export function useUnreadCount() {
  const { data } = useQuery({
    queryKey: notificationKeys.list,
    queryFn: notificationsApi.list,
    select: selectUnread,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  return data ?? 0;
}

/** Marks everything read. The dots clear at once, and the server catches up */
export async function markAllRead(client: QueryClient) {
  const current = client.getQueryData<NotificationsData>(notificationKeys.list);
  if (!current || current.unreadCount === 0) return;

  client.setQueryData<NotificationsData>(notificationKeys.list, {
    unreadCount: 0,
    items: current.items.map((item) => ({ ...item, read: true })),
  });

  try {
    await notificationsApi.readAll();
  } catch {
    client.invalidateQueries({ queryKey: notificationKeys.list });
  }
}

export const useNotificationSettings = () =>
  useQuery({
    queryKey: notificationKeys.settings,
    queryFn: notificationsApi.getSettings,
    staleTime: 60_000,
  });

export function useUpdateNotificationSettings() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<NotificationSettings>) =>
      notificationsApi.putSettings(patch),

    onMutate: async (patch) => {
      await client.cancelQueries({ queryKey: notificationKeys.settings });
      const previous = client.getQueryData<NotificationSettings>(
        notificationKeys.settings,
      );

      client.setQueryData<NotificationSettings>(
        notificationKeys.settings,
        (current) => (current ? { ...current, ...patch } : current),
      );
      return { previous };
    },

    onError: (err, _patch, context) => {
      client.setQueryData(notificationKeys.settings, context?.previous);
      Alert.alert("Couldn't save your settings", errorMessage(err));
    },

    onSettled: () =>
      client.invalidateQueries({ queryKey: notificationKeys.settings }),
  });
}
