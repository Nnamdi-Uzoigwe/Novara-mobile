import { apiFetch } from "@/core/api/client";
import { useQuery } from "@tanstack/react-query";

type ShippingRule = { flat: number; freeAbove: number };

// Used until the server's rule arrives
const FALLBACK: ShippingRule = { flat: 6, freeAbove: 100 };

export function useShippingRule(): ShippingRule {
  const { data } = useQuery({
    queryKey: ["config"],
    queryFn: async () =>
      (await apiFetch<{ shipping: ShippingRule }>("/config", { auth: false }))
        .shipping,
    staleTime: 10 * 60_000,
  });

  return data ?? FALLBACK;
}

/** Shipping for a subtotal, using the same rule as the server */
export function useShippingFee(subtotal: number) {
  const rule = useShippingRule();

  if (subtotal <= 0) return 0;
  return subtotal >= rule.freeAbove ? 0 : rule.flat;
}
