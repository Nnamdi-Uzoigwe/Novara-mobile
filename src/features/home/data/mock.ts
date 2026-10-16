// import type { Banner, Category, Product } from "@/features/home/types";

// // TODO: replace the picsum placeholders with your real product photos
// const img = (seed: string, size = 600) => ({
//   uri: `https://picsum.photos/seed/${seed}/${size}/${size}`,
// });

// const DESCRIPTION =
//   "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

// const COLORS = ["#A65D57", "#111111", "#2AA9BF", "#1ED760"];

// export const BANNERS: Banner[] = [
//   {
//     id: "b1",
//     title: "24% off shipping today on bag purchases",
//     subtitle: "By Novara Store",
//     // image: require("@/assets/images/banner-bag.png"),
//   },
//   {
//     id: "b2",
//     title: "New season sneakers just landed",
//     subtitle: "By Novara Store",
//   },
//   {
//     id: "b3",
//     title: "Free delivery on orders above $100",
//     subtitle: "By Novara Store",
//   },
// ];

// export const PRODUCTS: Product[] = [
//   {
//     id: "p1",
//     name: "The Mirac Jiz",
//     seller: "Lisa Robber",
//     price: 195,
//     image: img("bag1"),
//     rating: 4.8,
//     reviewCount: 320,
//     description: DESCRIPTION,
//     colors: COLORS,
//     stock: 12,
//     sellerInfo: {
//       name: "Upbox Bag",
//       verified: true,
//       productCount: 104,
//       followers: "1.3k",
//     },
//   },
//   {
//     id: "p2",
//     name: "Meriza Kiles",
//     seller: "Gazuna Resika",
//     price: 143.45,
//     image: img("bag2"),
//     rating: 4.6,
//     reviewCount: 187,
//     description: DESCRIPTION,
//     colors: COLORS.slice(0, 3),
//     stock: 5,
//     sellerInfo: {
//       name: "Gazuna Store",
//       verified: true,
//       productCount: 62,
//       followers: "840",
//     },
//   },
//   {
//     id: "p3",
//     name: "Olive Satchel",
//     seller: "Tomi Adeyemi",
//     price: 120,
//     image: img("bag3"),
//     rating: 4.7,
//     reviewCount: 96,
//     description: DESCRIPTION,
//     stock: 20,
//     sellerInfo: { name: "Tomi Bags", productCount: 38, followers: "512" },
//   },
//   {
//     id: "p4",
//     name: "Classic Tote",
//     seller: "Amaka Obi",
//     price: 89.99,
//     image: img("bag4"),
//     rating: 4.5,
//     reviewCount: 241,
//     description: DESCRIPTION,
//     colors: COLORS.slice(0, 2),
//     stock: 8,
//   },
//   {
//     id: "p5",
//     name: "Urban Crossbody",
//     seller: "Lisa Robber",
//     price: 76.5,
//     image: img("bag5"),
//     rating: 4.4,
//     reviewCount: 73,
//     description: DESCRIPTION,
//     stock: 15,
//   },
//   {
//     id: "p6",
//     name: "Weekend Duffel",
//     seller: "Gazuna Resika",
//     price: 210,
//     image: img("bag6"),
//     rating: 4.9,
//     reviewCount: 412,
//     description: DESCRIPTION,
//     colors: COLORS,
//     stock: 3,
//     sellerInfo: {
//       name: "Gazuna Store",
//       verified: true,
//       productCount: 62,
//       followers: "840",
//     },
//   },
// ];

// export const CATEGORIES: Category[] = [
//   { id: "c1", name: "New Arrivals", count: 208, image: img("cat1", 400) },
//   { id: "c2", name: "Clothes", count: 358, image: img("cat2", 400) },
//   { id: "c3", name: "Bags", count: 160, image: img("cat3", 400) },
//   { id: "c4", name: "Shoes", count: 230, image: img("cat4", 400) },
//   { id: "c5", name: "Electronics", count: 120, image: img("cat5", 400) },
// ];

// export const getProductById = (id: string) =>
//   PRODUCTS.find((product) => product.id === id);

import type { Banner, Category, Product } from "@/features/home/types";

// TODO: replace the picsum placeholders with your real product photos
const img = (seed: string, size = 600) => ({
  uri: `https://picsum.photos/seed/${seed}/${size}/${size}`,
});

const DAY = 86_400_000;
const NOW = Date.now();

const DESCRIPTION =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const COLORS = ["#A65D57", "#111111", "#2AA9BF", "#1ED760"];

const UPBOX = {
  name: "Upbox Bag",
  verified: true,
  productCount: 104,
  followers: "1.3k",
};
const GAZUNA = {
  name: "Gazuna Store",
  verified: true,
  productCount: 62,
  followers: "840",
};
const TOMI = { name: "Tomi Bags", productCount: 38, followers: "512" };

/** "New Arrivals" is a virtual category: every product, newest first */
export const NEW_ARRIVALS_CATEGORY_ID = "c1";

type ProductInput = Pick<
  Product,
  | "id"
  | "name"
  | "seller"
  | "price"
  | "categoryId"
  | "rating"
  | "reviewCount"
  | "stock"
  | "colors"
  | "sellerInfo"
> & { seed: string; daysAgo: number };

const product = ({ seed, daysAgo, ...rest }: ProductInput): Product => ({
  ...rest,
  image: img(seed),
  description: DESCRIPTION,
  createdAt: NOW - daysAgo * DAY,
});

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
  product({
    id: "p1",
    name: "The Mirac Jiz",
    seller: "Lisa Robber",
    price: 195,
    seed: "bag1",
    categoryId: "c3",
    rating: 4.8,
    reviewCount: 320,
    stock: 12,
    colors: COLORS,
    sellerInfo: UPBOX,
    daysAgo: 1,
  }),
  product({
    id: "p2",
    name: "Meriza Kiles",
    seller: "Gazuna Resika",
    price: 143.45,
    seed: "bag2",
    categoryId: "c3",
    rating: 4.6,
    reviewCount: 187,
    stock: 5,
    colors: COLORS.slice(0, 3),
    sellerInfo: GAZUNA,
    daysAgo: 2,
  }),
  product({
    id: "p3",
    name: "Olive Satchel",
    seller: "Tomi Adeyemi",
    price: 120,
    seed: "bag3",
    categoryId: "c3",
    rating: 4.7,
    reviewCount: 96,
    stock: 20,
    sellerInfo: TOMI,
    daysAgo: 3,
  }),
  product({
    id: "p4",
    name: "Classic Tote",
    seller: "Amaka Obi",
    price: 89.99,
    seed: "bag4",
    categoryId: "c3",
    rating: 4.5,
    reviewCount: 241,
    stock: 8,
    colors: COLORS.slice(0, 2),
    daysAgo: 6,
  }),
  product({
    id: "p5",
    name: "Urban Crossbody",
    seller: "Lisa Robber",
    price: 76.5,
    seed: "bag5",
    categoryId: "c3",
    rating: 4.4,
    reviewCount: 73,
    stock: 15,
    daysAgo: 9,
  }),
  product({
    id: "p6",
    name: "Weekend Duffel",
    seller: "Gazuna Resika",
    price: 210,
    seed: "bag6",
    categoryId: "c3",
    rating: 4.9,
    reviewCount: 412,
    stock: 3,
    colors: COLORS,
    sellerInfo: GAZUNA,
    daysAgo: 12,
  }),
  product({
    id: "p7",
    name: "Linen Shirt",
    seller: "Amaka Obi",
    price: 54,
    seed: "shirt1",
    categoryId: "c2",
    rating: 4.3,
    reviewCount: 128,
    stock: 25,
    colors: ["#E8E2D0", "#2E4057", "#7A9E7E"],
    daysAgo: 4,
  }),
  product({
    id: "p8",
    name: "Denim Jacket",
    seller: "Tomi Adeyemi",
    price: 98,
    seed: "jacket1",
    categoryId: "c2",
    rating: 4.6,
    reviewCount: 204,
    stock: 10,
    colors: ["#3B5B8C", "#111111"],
    daysAgo: 15,
  }),
  product({
    id: "p9",
    name: "Street Sneakers",
    seller: "Lisa Robber",
    price: 120,
    seed: "shoe1",
    categoryId: "c4",
    rating: 4.7,
    reviewCount: 356,
    stock: 14,
    colors: ["#FFFFFF", "#111111", "#C0392B"],
    daysAgo: 5,
  }),
  product({
    id: "p10",
    name: "Trail Runners",
    seller: "Gazuna Resika",
    price: 135,
    seed: "shoe2",
    categoryId: "c4",
    rating: 4.5,
    reviewCount: 142,
    stock: 9,
    daysAgo: 20,
  }),
  product({
    id: "p11",
    name: "Box Headphone 234",
    seller: "Upbox Bag",
    price: 66,
    seed: "phone1",
    categoryId: "c5",
    rating: 4.8,
    reviewCount: 521,
    stock: 30,
    colors: ["#111111", "#E8D5C4"],
    sellerInfo: UPBOX,
    daysAgo: 7,
  }),
  product({
    id: "p12",
    name: "Box Headphone 992",
    seller: "Upbox Bag",
    price: 74,
    seed: "phone2",
    categoryId: "c5",
    rating: 4.4,
    reviewCount: 167,
    stock: 18,
    sellerInfo: UPBOX,
    daysAgo: 25,
  }),
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
