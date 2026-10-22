import type { ImageSource } from "expo-image";

export type OrderStatus =
  | "awaiting_payment"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  image: ImageSource;
  color?: { name: string; hex: string };
  price: number;
  quantity: number;
};

export type OrderAddress = {
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  region: string;
  postalCode?: string;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  createdAt: number;
  statusChangedAt: number;
  items: OrderItem[];
  address: OrderAddress;
  payment: { method: string; detail: string; simulated: boolean };
  subtotal: number;
  shipping: number;
  total: number;
  events: { status: OrderStatus; at: number }[];
};

export type OrdersPage = {
  items: Order[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export const isActiveStatus = (status: OrderStatus) =>
  status !== "completed" && status !== "cancelled";

// What the server sends

export type ApiOrder = {
  id: string;
  number: string;
  status: OrderStatus;
  createdAt: string;
  statusChangedAt: string;
  items: {
    productId: string;
    name: string;
    image: string;
    color: { name: string; hex: string } | null;
    price: number;
    quantity: number;
  }[];
  address: {
    label: string;
    recipientName: string;
    phone: string;
    line1: string;
    city: string;
    region: string;
    postalCode: string | null;
  };
  payment: {
    method: string;
    detail: string;
    status: string;
    simulated: boolean;
  };
  subtotal: number;
  shipping: number;
  total: number;
  events: { status: OrderStatus; at: string }[];
};

export type ApiOrdersPage = Omit<OrdersPage, "items"> & { items: ApiOrder[] };
