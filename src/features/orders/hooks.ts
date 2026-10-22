import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";
import { ordersApi } from "./api";
import type { Order, OrdersPage } from "./types";

export const orderKeys = {
  list: (status: "active" | "history") => ["orders", status] as const,
  detail: (id: string) => ["order", id] as const,
};

export const useOrders = (status: "active" | "history") =>
  useInfiniteQuery({
    queryKey: orderKeys.list(status),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => ordersApi.list(status, pageParam),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    // Orders move along on the server, so keep the open list fresh
    refetchInterval: status === "active" ? 30_000 : false,
  });

function findCachedOrder(client: QueryClient, id: string): Order | undefined {
  for (const [, data] of client.getQueriesData<{ pages?: OrdersPage[] }>({
    queryKey: ["orders"],
  })) {
    const hit = data?.pages
      ?.flatMap((page) => page.items)
      .find((order) => order.id === id);
    if (hit) return hit;
  }
  return undefined;
}

export function useOrder(id: string | undefined) {
  const client = useQueryClient();

  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => ordersApi.get(id as string),
    enabled: !!id,
    placeholderData: () => (id ? findCachedOrder(client, id) : undefined),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "cancelled" ? false : 15_000;
    },
  });
}

export function usePlaceOrder() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.place,
    onSuccess: ({ order }) => {
      client.setQueryData(orderKeys.detail(order.id), order);
      client.invalidateQueries({ queryKey: ["orders"] });
      // Stock changed, so refresh products and the notification list
      client.invalidateQueries({ queryKey: ["products"] });
      client.invalidateQueries({ queryKey: ["product"] });
      client.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useCompleteOrder() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.complete(id),
    onSuccess: (order) => {
      client.setQueryData(orderKeys.detail(order.id), order);
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
