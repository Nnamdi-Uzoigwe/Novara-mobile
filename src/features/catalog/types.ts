import type { Product } from "@/features/home/types";
import type { ImageSource } from "expo-image";

export type SortKey = "all" | "latest" | "popular" | "cheapest" | "rated";

export type ProductQuery = {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
  limit?: number;
};

export type ProductPage = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type PopularBadge = "Hot" | "New" | "Popular";

export type PopularSearch = {
  id: string;
  term: string;
  searchesToday: string;
  badge: PopularBadge;
  image?: ImageSource;
};

// What the server sends

export type ApiSeller = {
  name: string;
  verified: boolean;
  productCount: number;
  followers: string;
  avatar: string | null;
};

export type ApiProduct = {
  id: string;
  name: string;
  seller: string;
  price: number;
  image: string;
  categoryId: string;
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  colors: string[];
  sellerInfo: ApiSeller | null;
  publishedAt: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  image: string;
  count: number;
};

export type ApiBanner = {
  id: string;
  tag: string | null;
  title: string;
  subtitle: string;
  image: string | null;
  cta: {
    label: string;
    categoryId: string | null;
    title: string | null;
  } | null;
};

export type ApiPopularSearch = {
  id: string;
  term: string;
  searchesToday: string;
  badge: PopularBadge;
  image: string | null;
};

export type ApiProductPage = {
  items: ApiProduct[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
