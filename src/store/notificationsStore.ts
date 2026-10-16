import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NotificationKind = "purchase" | "message" | "promo" | "shipping";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  /** Shown instead of an icon for messages */
  sender?: { name: string; avatarUri?: string };
  /** Small link under the text, such as "Reply the message" */
  actionLabel?: string;
};

const MINUTE = 60_000;

// TODO: replace with notifications from your API
const seed = (): AppNotification[] => {
  const now = Date.now();
  return [
    {
      id: "n1",
      kind: "purchase",
      title: "Purchase Completed!",
      body: "You have successfully purchased 334 headphones, thank you and wait for your package to arrive.",
      createdAt: now - 2 * MINUTE,
      read: false,
    },
    {
      id: "n2",
      kind: "message",
      title: "Jerremy Sent You a Message",
      body: "Hello your package has almost arrived, are you at home now?",
      createdAt: now - 3 * MINUTE,
      read: false,
      sender: { name: "Jerremy" },
      actionLabel: "Reply the message",
    },
    {
      id: "n3",
      kind: "promo",
      title: "Flash Sale!",
      body: "Get 20% discount for first transaction in this month!",
      createdAt: now - 4 * MINUTE,
      read: false,
    },
    {
      id: "n4",
      kind: "shipping",
      title: "Package Sent",
      body: "Hi your package has been sent from New York.",
      createdAt: now - 10 * MINUTE,
      read: true,
    },
  ];
};

type NotificationsState = {
  /** Newest first */
  items: AppNotification[];
  markAllRead: () => void;
  add: (input: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  reset: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      items: seed(),

      markAllRead: () =>
        set((state) =>
          state.items.some((n) => !n.read)
            ? { items: state.items.map((n) => ({ ...n, read: true })) }
            : state,
        ),

      add: (input) =>
        set((state) => ({
          items: [
            {
              ...input,
              id: `n-${Date.now()}`,
              createdAt: Date.now(),
              read: false,
            },
            ...state.items,
          ],
        })),

      reset: () => set({ items: seed() }),
    }),
    {
      name: "novara-notifications",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
