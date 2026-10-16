import type { Banner, Category, Product } from "@/features/home/types";

// TODO: replace the picsum placeholders with your real product photos
const img = (seed: string, size = 600) => ({
  uri: `https://picsum.photos/seed/${seed}/${size}/${size}`,
});

const DESCRIPTION =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const COLORS = ["#A65D57", "#111111", "#2AA9BF", "#1ED760"];

export const BANNERS: Banner[] = [
  {
    id: "b1",
    title: "24% off shipping today on bag purchases",
    subtitle: "By Novara Store",
    // image: require("@/assets/images/banner-bag.png"),
  },
  {
    id: "b2",
    title: "New season sneakers just landed",
    subtitle: "By Novara Store",
  },
  {
    id: "b3",
    title: "Free delivery on orders above $100",
    subtitle: "By Novara Store",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "The Mirac Jiz",
    seller: "Lisa Robber",
    price: 195,
    image: img("bag1"),
    rating: 4.8,
    reviewCount: 320,
    description: DESCRIPTION,
    colors: COLORS,
    stock: 12,
    sellerInfo: {
      name: "Upbox Bag",
      verified: true,
      productCount: 104,
      followers: "1.3k",
    },
  },
  {
    id: "p2",
    name: "Meriza Kiles",
    seller: "Gazuna Resika",
    price: 143.45,
    image: img("bag2"),
    rating: 4.6,
    reviewCount: 187,
    description: DESCRIPTION,
    colors: COLORS.slice(0, 3),
    stock: 5,
    sellerInfo: {
      name: "Gazuna Store",
      verified: true,
      productCount: 62,
      followers: "840",
    },
  },
  {
    id: "p3",
    name: "Olive Satchel",
    seller: "Tomi Adeyemi",
    price: 120,
    image: img("bag3"),
    rating: 4.7,
    reviewCount: 96,
    description: DESCRIPTION,
    stock: 20,
    sellerInfo: { name: "Tomi Bags", productCount: 38, followers: "512" },
  },
  {
    id: "p4",
    name: "Classic Tote",
    seller: "Amaka Obi",
    price: 89.99,
    image: img("bag4"),
    rating: 4.5,
    reviewCount: 241,
    description: DESCRIPTION,
    colors: COLORS.slice(0, 2),
    stock: 8,
  },
  {
    id: "p5",
    name: "Urban Crossbody",
    seller: "Lisa Robber",
    price: 76.5,
    image: img("bag5"),
    rating: 4.4,
    reviewCount: 73,
    description: DESCRIPTION,
    stock: 15,
  },
  {
    id: "p6",
    name: "Weekend Duffel",
    seller: "Gazuna Resika",
    price: 210,
    image: img("bag6"),
    rating: 4.9,
    reviewCount: 412,
    description: DESCRIPTION,
    colors: COLORS,
    stock: 3,
    sellerInfo: {
      name: "Gazuna Store",
      verified: true,
      productCount: 62,
      followers: "840",
    },
  },
];

export const CATEGORIES: Category[] = [
  { id: "c1", name: "New Arrivals", count: 208, image: img("cat1", 400) },
  { id: "c2", name: "Clothes", count: 358, image: img("cat2", 400) },
  { id: "c3", name: "Bags", count: 160, image: img("cat3", 400) },
  { id: "c4", name: "Shoes", count: 230, image: img("cat4", 400) },
  { id: "c5", name: "Electronics", count: 120, image: img("cat5", 400) },
];

export const getProductById = (id: string) =>
  PRODUCTS.find((product) => product.id === id);
