import type { Order } from "@/features/orders/types";
import { useCartStore } from "@/store/cartStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback } from "react";

/** Puts every item from a past order back in the cart and opens the cart */
export function useBuyAgain() {
  const addItem = useCartStore((s) => s.addItem);

  return useCallback(
    (order: Order) => {
      order.items.forEach((item) => {
        addItem(
          {
            id: item.productId,
            name: item.name,
            seller: "",
            price: item.price,
            image: item.image,
            stock: item.stock,
          },
          item.quantity,
          item.color,
        );
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.navigate("/(tabs)/cart");
    },
    [addItem],
  );
}
