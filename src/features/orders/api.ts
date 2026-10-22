import { apiFetch } from "@/core/api/client";
import type { ApiOrder, ApiOrdersPage, Order, OrdersPage } from "./types";

const toOrder = (o: ApiOrder): Order => ({
  id: o.id,
  number: o.number,
  status: o.status,
  createdAt: Date.parse(o.createdAt),
  statusChangedAt: Date.parse(o.statusChangedAt),
  items: o.items.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: { uri: item.image },
    color: item.color ?? undefined,
    price: item.price,
    quantity: item.quantity,
  })),
  address: { ...o.address, postalCode: o.address.postalCode ?? undefined },
  payment: {
    method: o.payment.method,
    detail: o.payment.detail,
    simulated: o.payment.simulated,
  },
  subtotal: o.subtotal,
  shipping: o.shipping,
  total: o.total,
  events: o.events.map((event) => ({
    status: event.status,
    at: Date.parse(event.at),
  })),
});

export type PlaceOrderInput = {
  clientRequestId: string;
  addressId: string;
  items: {
    productId: string;
    quantity: number;
    color?: { name: string; hex: string };
  }[];
  payment: { method: string; detail: string };
  /** The total the app showed, so the server can catch price changes */
  expectedTotal: number;
};

export const ordersApi = {
  list: async (
    status: "active" | "history",
    page: number,
  ): Promise<OrdersPage> => {
    const data = await apiFetch<ApiOrdersPage>(
      `/orders?status=${status}&page=${page}&limit=20`,
    );
    return { ...data, items: data.items.map(toOrder) };
  },

  get: async (id: string): Promise<Order> => {
    const data = await apiFetch<{ order: ApiOrder }>(`/orders/${id}`);
    return toOrder(data.order);
  },

  place: async (
    input: PlaceOrderInput,
  ): Promise<{ order: Order; created: boolean }> => {
    const data = await apiFetch<{ order: ApiOrder; created: boolean }>(
      "/orders",
      {
        method: "POST",
        body: input,
      },
    );
    return { order: toOrder(data.order), created: data.created };
  },

  complete: async (id: string): Promise<Order> => {
    const data = await apiFetch<{ order: ApiOrder }>(`/orders/${id}/complete`, {
      method: "POST",
    });
    return toOrder(data.order);
  },
};
