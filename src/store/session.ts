import { useAddressStore } from "@/store/addressStore";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { useOrdersStore } from "@/store/ordersStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useSearchStore } from "@/store/searchStore";
import { useUserStore } from "@/store/userStore";

/** Wipes everything tied to the signed-in account. Theme and app settings stay */
export function clearAccountData() {
  useUserStore.getState().clear();
  useCartStore.getState().clear();
  useOrdersStore.getState().clear();
  useAddressStore.getState().clear();
  usePaymentStore.getState().reset();
  useFavoritesStore.getState().clear();
  useSearchStore.getState().clear();
  useNotificationsStore.getState().reset();
  // TODO: also delete the saved session token from expo-secure-store once sign-in is real
}
