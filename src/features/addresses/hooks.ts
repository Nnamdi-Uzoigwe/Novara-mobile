import { useAddressStore } from "@/store/addressStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { addressesApi } from "./api";
import type { AddressInput } from "./types";

export const addressKeys = { all: ["addresses"] as const };

export const useAddresses = () =>
  useQuery({
    queryKey: addressKeys.all,
    queryFn: addressesApi.list,
    staleTime: 60_000,
  });

/** The chosen address, else the default one, else the first one */
export function useSelectedAddress() {
  const { data, isLoading } = useAddresses();
  const selectedId = useAddressStore((s) => s.selectedId);

  const address = useMemo(
    () =>
      data?.find((a) => a.id === selectedId) ??
      data?.find((a) => a.isDefault) ??
      data?.[0] ??
      null,
    [data, selectedId],
  );

  return { address, isLoading };
}

export function useSaveAddress() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: AddressInput }) =>
      id ? addressesApi.update(id, input) : addressesApi.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useDeleteAddress() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: addressKeys.all }),
  });
}
