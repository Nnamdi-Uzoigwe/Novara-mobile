import type { SortKey } from "@/features/catalog/types";
import type { Product } from "@/features/home/types";

type Options = {
  search?: string;
  sort?: SortKey;
  minPrice?: number;
  maxPrice?: number;
};

/** Search, price filter and sort on a list the app already has, such as favorites */
export function filterAndSort(
  products: Product[],
  options: Options,
): Product[] {
  let list = products;

  const text = options.search?.trim().toLowerCase();
  if (text) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(text) ||
        p.seller.toLowerCase().includes(text),
    );
  }
  if (options.minPrice !== undefined) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }
  if (options.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  const sorted = [...list];

  switch (options.sort) {
    case "latest":
      sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      break;
    case "popular":
      sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
    case "cheapest":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "rated":
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      // Keep the order as it came, which is newest saved first for favorites
      break;
  }

  return sorted;
}
