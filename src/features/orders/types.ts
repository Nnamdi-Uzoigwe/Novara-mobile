import type { Address } from "@/features/checkout/types";
import type { CartItem } from "@/store/cartStore";

export type OrderStatus = "in_progress" | "completed";

export type Order = {
  id: string;
  items: CartItem[];
  address: Address;
  /** Masked text only, such as "Mastercard" and "**** 7424" */
  paymentTitle: string;
  paymentDetail: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
};
