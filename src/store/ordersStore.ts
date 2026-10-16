import type { Order } from "@/features/orders/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NewOrder = Omit<Order, "id" | "status" | "createdAt">;

type OrdersState = {
  orders: Order[];
  placeOrder: (input: NewOrder) => Order;
  markCompleted: (id: string) => void;
  clear: () => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],

      placeOrder: (input) => {
        const order: Order = {
          ...input,
          id: `ORD-${Date.now()}`,
          status: "in_progress",
          createdAt: Date.now(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      markCompleted: (id) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: "completed" } : order,
          ),
        })),

      clear: () => set({ orders: [] }),
    }),
    {
      name: "novara-orders",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
);
