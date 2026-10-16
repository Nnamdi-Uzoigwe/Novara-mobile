import { NEW_ARRIVALS_CATEGORY_ID, PRODUCTS } from "@/features/home/data/mock";
import type { Product } from "@/features/home/types";

export type SortKey = "all" | "latest" | "popular" | "cheapest" | "rated";

export type ProductQuery = {
  /** Only these products, such as the user's favorites */
  ids?: string[];
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
};

// TODO: replace the body with a call to your API, keeping the same query shape
export function getProducts(query: ProductQuery = {}): Product[] {
  let list = PRODUCTS.slice();

  const { ids } = query;
  if (ids) list = list.filter((p) => ids.includes(p.id));

  if (query.categoryId && query.categoryId !== NEW_ARRIVALS_CATEGORY_ID) {
    list = list.filter((p) => p.categoryId === query.categoryId);
  }

  const text = query.search?.trim().toLowerCase();
  if (text) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(text) ||
        p.seller.toLowerCase().includes(text),
    );
  }

  if (query.minPrice !== undefined) {
    list = list.filter((p) => p.price >= query.minPrice!);
  }
  if (query.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= query.maxPrice!);
  }

  switch (query.sort) {
    case "latest":
      list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      break;
    case "popular":
      list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
    case "cheapest":
      list.sort((a, b) => a.price - b.price);
      break;
    case "rated":
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      // For favorites, show the most recently saved first
      if (ids) list.sort((a, b) => ids.indexOf(b.id) - ids.indexOf(a.id));
  }

  return list;
}
