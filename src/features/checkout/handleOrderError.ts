import { ApiClientError, errorMessage } from "@/core/api/ApiClientError";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useCartStore } from "@/store/cartStore";
import { Alert } from "react-native";

type Handlers = { onAddressMissing: () => void };

type StockItem = { productId: string; name: string; available?: number };

/** Turns a failed checkout into a clear message, and fixes the cart where it can */
export function handleOrderError(err: unknown, handlers: Handlers) {
  if (!(err instanceof ApiClientError)) {
    Alert.alert("Couldn't place your order", errorMessage(err));
    return;
  }

  const details = err.details as
    | {
        total?: number;
        items?: { productId: string; price?: number }[] | StockItem[];
        productIds?: string[];
      }
    | undefined;

  switch (err.code) {
    case "PRICE_CHANGED": {
      const prices = new Map(
        ((details?.items ?? []) as { productId: string; price: number }[]).map(
          (i) => [i.productId, i.price],
        ),
      );

      useCartStore.setState((state) => ({
        items: state.items.map((item) =>
          prices.has(item.productId)
            ? { ...item, price: prices.get(item.productId)! }
            : item,
        ),
      }));

      Alert.alert(
        "Prices were updated",
        `Your new total is ${formatPrice(details?.total ?? 0)}. Please review and try again.`,
      );
      return;
    }

    case "OUT_OF_STOCK": {
      const list = (details?.items ?? []) as StockItem[];

      useCartStore.setState((state) => ({
        items: state.items.flatMap((item) => {
          const hit = list.find((entry) => entry.productId === item.productId);
          if (!hit) return [item];

          const available = hit.available ?? 0;
          if (available <= 0) return [];
          return [
            {
              ...item,
              quantity: Math.min(item.quantity, available),
              stock: available,
            },
          ];
        }),
      }));

      Alert.alert(
        "Some items changed",
        list
          .map((entry) =>
            entry.available && entry.available > 0
              ? `${entry.name}: only ${entry.available} left`
              : `${entry.name}: sold out`,
          )
          .join("\n"),
      );
      return;
    }

    case "PRODUCT_UNAVAILABLE": {
      const gone = new Set(details?.productIds ?? []);

      useCartStore.setState((state) => ({
        items: state.items.filter((item) => !gone.has(item.productId)),
      }));

      Alert.alert(
        "Items removed",
        "Some items are no longer available and were removed from your cart.",
      );
      return;
    }

    case "ADDRESS_NOT_FOUND":
      handlers.onAddressMissing();
      Alert.alert("Choose an address", err.message);
      return;

    default:
      Alert.alert("Couldn't place your order", err.message);
  }
}
