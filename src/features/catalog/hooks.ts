import { errorMessage } from "@/core/api/ApiClientError";
import type { Product } from "@/features/home/types";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { Alert } from "react-native";
import { catalogApi } from "./api";
import type { ProductQuery } from "./types";

export const keys = {
  categories: ["categories"] as const,
  banners: ["banners"] as const,
  products: (query: ProductQuery) => ["products", query] as const,
  productsInfinite: (query: ProductQuery) =>
    ["products", "infinite", query] as const,
  product: (id: string) => ["product", id] as const,
  popular: ["popular-searches"] as const,
  favorites: ["favorites"] as const,
};

const FIVE_MINUTES = 5 * 60_000;

export const useCategories = () =>
  useQuery({
    queryKey: keys.categories,
    queryFn: catalogApi.categories,
    staleTime: FIVE_MINUTES,
  });

export const useBanners = () =>
  useQuery({
    queryKey: keys.banners,
    queryFn: catalogApi.banners,
    staleTime: FIVE_MINUTES,
  });

export const usePopularSearches = () =>
  useQuery({
    queryKey: keys.popular,
    queryFn: catalogApi.popularSearches,
    staleTime: FIVE_MINUTES,
  });

/** One page of products, such as the six newest on Home */
export const useProducts = (
  query: ProductQuery,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: keys.products(query),
    queryFn: () => catalogApi.products(query),
    enabled: options?.enabled ?? true,
  });

/** Products that load more pages as you scroll */
export const useInfiniteProducts = (query: ProductQuery) =>
  useInfiniteQuery({
    queryKey: keys.productsInfinite(query),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      catalogApi.products({ ...query, page: pageParam }),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  });

// -------------------------------------------------------------- one product

type PageLike = { items?: Product[] };

const itemsOf = (data: unknown): Product[] => {
  if (!data || typeof data !== "object") return [];
  const shape = data as { items?: Product[]; pages?: PageLike[] };

  if (Array.isArray(shape.pages))
    return shape.pages.flatMap((page) => page.items ?? []);
  return shape.items ?? [];
};

/** Finds a product the app already downloaded, so the details screen opens instantly */
function findCachedProduct(
  client: QueryClient,
  id: string,
): Product | undefined {
  for (const [, data] of client.getQueriesData({ queryKey: ["products"] })) {
    const hit = itemsOf(data).find((product) => product.id === id);
    if (hit) return hit;
  }
  return client
    .getQueryData<Product[]>(keys.favorites)
    ?.find((p) => p.id === id);
}

export function useProduct(id: string | undefined) {
  const client = useQueryClient();

  return useQuery({
    queryKey: keys.product(id ?? ""),
    queryFn: () => catalogApi.product(id as string),
    enabled: !!id,
    placeholderData: () => (id ? findCachedProduct(client, id) : undefined),
  });
}

// ---------------------------------------------------------------- favorites

const selectIds = (items: Product[]) =>
  new Set(items.map((product) => product.id));
const NO_IDS = new Set<string>();

/** The saved products, newest first. Powers the Favorites tab */
export const useFavorites = () =>
  useQuery({
    queryKey: keys.favorites,
    queryFn: catalogApi.favorites,
    staleTime: 30_000,
  });

/** Just the saved ids, for filling in hearts on any product */
export function useFavoriteIds() {
  const { data } = useQuery({
    queryKey: keys.favorites,
    queryFn: catalogApi.favorites,
    select: selectIds,
    staleTime: 30_000,
  });
  return data ?? NO_IDS;
}

/** Returns a function that saves or removes a product. The heart changes instantly */
export function useToggleFavorite() {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      product,
      favorite,
    }: {
      product: Product;
      favorite: boolean;
    }) =>
      favorite
        ? catalogApi.addFavorite(product.id)
        : catalogApi.removeFavorite(product.id),

    onMutate: async ({ product, favorite }) => {
      await client.cancelQueries({ queryKey: keys.favorites });
      const previous = client.getQueryData<Product[]>(keys.favorites);

      client.setQueryData<Product[]>(keys.favorites, (list = []) =>
        favorite
          ? [product, ...list.filter((item) => item.id !== product.id)]
          : list.filter((item) => item.id !== product.id),
      );

      return { previous };
    },

    onError: (err, _vars, context) => {
      // Put the heart back the way it was
      client.setQueryData(keys.favorites, context?.previous);
      Alert.alert("Couldn't update favorites", errorMessage(err));
    },

    onSettled: () => client.invalidateQueries({ queryKey: keys.favorites }),
  });

  const { mutate } = mutation;

  return useCallback(
    async (product: Product) => {
      const list = await client.ensureQueryData({
        queryKey: keys.favorites,
        queryFn: catalogApi.favorites,
      });

      const isFavorite = list.some((item) => item.id === product.id);
      mutate({ product, favorite: !isFavorite });
    },
    [client, mutate],
  );
}
