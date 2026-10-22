import { queryClient } from "@/core/api/queryClient";
import { useAddressStore } from "@/store/addressStore";
import { useCartStore } from "@/store/cartStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useSearchStore } from "@/store/searchStore";
import { useUserStore } from "@/store/userStore";

/** Wipes everything tied to the signed-in account. Theme and app settings stay */
export function clearAccountData() {
  useUserStore.getState().clear();
  useCartStore.getState().clear();
  useAddressStore.getState().clear();
  usePaymentStore.getState().reset();
  useSearchStore.getState().clear();
  useNotificationsStore.getState().reset();
  // Orders, addresses, favorites and any other downloaded data
  queryClient.clear();
  // TODO: also delete the saved session token from expo-secure-store once sign-in is real
}
