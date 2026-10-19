import type { Banner, Category, Product } from "@/features/home/types";
import type {
    ApiBanner,
    ApiCategory,
    ApiPopularSearch,
    ApiProduct,
    PopularSearch,
} from "./types";

export const toProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  seller: p.seller,
  price: p.price,
  image: { uri: p.image },
  categoryId: p.categoryId,
  createdAt: Date.parse(p.publishedAt),
  description: p.description,
  rating: p.rating,
  reviewCount: p.reviewCount,
  stock: p.stock,
  colors: p.colors,
  sellerInfo: p.sellerInfo
    ? {
        name: p.sellerInfo.name,
        verified: p.sellerInfo.verified,
        productCount: p.sellerInfo.productCount,
        followers: p.sellerInfo.followers,
        avatar: p.sellerInfo.avatar ? { uri: p.sellerInfo.avatar } : undefined,
      }
    : undefined,
});

export const toCategory = (c: ApiCategory): Category => ({
  id: c.id,
  name: c.name,
  count: c.count,
  image: { uri: c.image },
});

export const toBanner = (b: ApiBanner): Banner => ({
  id: b.id,
  title: b.title,
  subtitle: b.subtitle,
  tag: b.tag ?? undefined,
  image: b.image ? { uri: b.image } : undefined,
  cta: b.cta
    ? {
        label: b.cta.label,
        categoryId: b.cta.categoryId ?? undefined,
        title: b.cta.title ?? undefined,
      }
    : undefined,
});

export const toPopularSearch = (s: ApiPopularSearch): PopularSearch => ({
  id: s.id,
  term: s.term,
  searchesToday: s.searchesToday,
  badge: s.badge,
  image: s.image ? { uri: s.image } : undefined,
});
