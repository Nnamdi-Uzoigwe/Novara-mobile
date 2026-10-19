import { apiFetch } from "@/core/api/client";
import type { Banner, Category, Product } from "@/features/home/types";
import { toBanner, toCategory, toPopularSearch, toProduct } from "./mappers";
import type {
    ApiBanner,
    ApiCategory,
    ApiPopularSearch,
    ApiProduct,
    ApiProductPage,
    PopularSearch,
    ProductPage,
    ProductQuery,
} from "./types";

const toQueryString = (params: Record<string, string | number | undefined>) => {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );

  return parts.length > 0 ? `?${parts.join("&")}` : "";
};

export const catalogApi = {
  categories: async (): Promise<Category[]> => {
    const data = await apiFetch<{ items: ApiCategory[] }>("/categories", {
      auth: false,
    });
    return data.items.map(toCategory);
  },

  banners: async (): Promise<Banner[]> => {
    const data = await apiFetch<{ items: ApiBanner[] }>("/banners", {
      auth: false,
    });
    return data.items.map(toBanner);
  },

  products: async (
    query: ProductQuery & { page?: number },
  ): Promise<ProductPage> => {
    const data = await apiFetch<ApiProductPage>(
      `/products${toQueryString({
        category: query.category,
        q: query.q,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
      })}`,
      { auth: false },
    );
    return { ...data, items: data.items.map(toProduct) };
  },

  product: async (id: string): Promise<Product> => {
    const data = await apiFetch<{ product: ApiProduct }>(
      `/products/${encodeURIComponent(id)}`,
      { auth: false },
    );
    return toProduct(data.product);
  },

  popularSearches: async (): Promise<PopularSearch[]> => {
    const data = await apiFetch<{ items: ApiPopularSearch[] }>(
      "/search/popular",
      {
        auth: false,
      },
    );
    return data.items.map(toPopularSearch);
  },

  favorites: async (): Promise<Product[]> => {
    const data = await apiFetch<{ items: ApiProduct[] }>("/me/favorites");
    return data.items.map(toProduct);
  },

  addFavorite: (id: string) =>
    apiFetch<{ favorited: boolean }>(
      `/me/favorites/${encodeURIComponent(id)}`,
      {
        method: "PUT",
      },
    ),

  removeFavorite: (id: string) =>
    apiFetch<{ favorited: boolean }>(
      `/me/favorites/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    ),
};
