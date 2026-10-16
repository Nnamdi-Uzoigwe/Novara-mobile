import type { Product } from "@/features/home/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const SHIPPING_FEE = 6;

export type CartItem = {
  /** productId plus color, so the same bag in two colors stays two rows */
  key: string;
  productId: string;
  name: string;
  price: number;
  image: Product["image"];
  color?: { name: string; hex: string };
  quantity: number;
  stock?: number;
  selected: boolean;
};

type CartState = {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    color?: CartItem["color"],
  ) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  toggleSelected: (key: string) => void;
  setAllSelected: (selected: boolean) => void;
  removeSelected: () => void;
  clear: () => void;
};

const makeKey = (productId: string, color?: CartItem["color"]) =>
  `${productId}-${color?.hex ?? "default"}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity, color) =>
        set((state) => {
          const key = makeKey(product.id, color);
          const max = product.stock ?? 99;
          const existing = state.items.find((item) => item.key === key);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, max),
                      selected: true,
                    }
                  : item,
              ),
            };
          }

          const item: CartItem = {
            key,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color,
            quantity: Math.min(quantity, max),
            stock: product.stock,
            selected: true,
          };
          return { items: [item, ...state.items] };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(quantity, item.stock ?? 99)),
                }
              : item,
          ),
        })),

      toggleSelected: (key) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, selected: !item.selected } : item,
          ),
        })),

      setAllSelected: (selected) =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        })),

      removeSelected: () =>
        set((state) => ({ items: state.items.filter((i) => !i.selected) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "novara-cart",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Selectors return plain numbers, so components only re-render when the value changes
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((n, item) => n + item.quantity, 0));

export const useCartSubtotal = () =>
  useCartStore((s) =>
    s.items.reduce(
      (sum, item) => (item.selected ? sum + item.price * item.quantity : sum),
      0,
    ),
  );

export const useSelectedCount = () =>
  useCartStore((s) => s.items.filter((item) => item.selected).length);
