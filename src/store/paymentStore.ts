import type { PaymentMethod } from "@/features/checkout/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// TODO: replace with the saved methods from your backend or payment provider
const DEFAULT_METHODS: PaymentMethod[] = [
  {
    id: "paypal",
    type: "paypal",
    title: "Paypal",
    detail: "sask****@mail.com",
  },
  {
    id: "mastercard",
    type: "mastercard",
    title: "Mastercard",
    detail: "**** **** **** 7424",
  },
];

type PaymentState = {
  methods: PaymentMethod[];
  selectedId: string | null;
  select: (id: string) => void;
  addMethod: (method: PaymentMethod) => void;
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      methods: DEFAULT_METHODS,
      selectedId: "mastercard",
      select: (id) => set({ selectedId: id }),
      addMethod: (method) =>
        set((state) => ({
          methods: [...state.methods, method],
          selectedId: method.id,
        })),
    }),
    {
      name: "novara-payment",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        methods: state.methods,
        selectedId: state.selectedId,
      }),
    },
  ),
);
