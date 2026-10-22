import { apiFetch } from "@/core/api/client";
import type { Address, AddressInput, ApiAddress } from "./types";

const toAddress = (a: ApiAddress): Address => ({
  id: a.id,
  label: a.label,
  recipientName: a.recipientName,
  phone: a.phone,
  line1: a.line1,
  city: a.city,
  region: a.region,
  postalCode: a.postalCode ?? undefined,
  isDefault: a.isDefault,
});

export const addressesApi = {
  list: async (): Promise<Address[]> => {
    const data = await apiFetch<{ items: ApiAddress[] }>("/addresses");
    return data.items.map(toAddress);
  },

  create: async (input: AddressInput): Promise<Address> => {
    const data = await apiFetch<{ address: ApiAddress }>("/addresses", {
      method: "POST",
      body: input,
    });
    return toAddress(data.address);
  },

  update: async (id: string, input: AddressInput): Promise<Address> => {
    const data = await apiFetch<{ address: ApiAddress }>(`/addresses/${id}`, {
      method: "PATCH",
      body: input,
    });
    return toAddress(data.address);
  },

  remove: (id: string) =>
    apiFetch<{ message: string }>(`/addresses/${id}`, { method: "DELETE" }),
};
