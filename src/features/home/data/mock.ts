// import type { Banner, Category, Product } from "@/features/home/types";

// // TODO: replace the picsum placeholders with your real product photos
// const img = (seed: string, size = 600) => ({
//   uri: `https://picsum.photos/seed/${seed}/${size}/${size}`,
// });

// const DAY = 86_400_000;
// const NOW = Date.now();

// const DESCRIPTION =
//   "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

// const COLORS = ["#A65D57", "#111111", "#2AA9BF", "#1ED760"];

// const UPBOX = {
//   name: "Upbox Bag",
//   verified: true,
//   productCount: 104,
//   followers: "1.3k",
// };
// const GAZUNA = {
//   name: "Gazuna Store",
//   verified: true,
//   productCount: 62,
//   followers: "840",
// };
// const TOMI = { name: "Tomi Bags", productCount: 38, followers: "512" };

// /** "New Arrivals" is a virtual category: every product, newest first */
// export const NEW_ARRIVALS_CATEGORY_ID = "c1";

// type ProductInput = Pick<
//   Product,
//   | "id"
//   | "name"
//   | "seller"
//   | "price"
//   | "categoryId"
//   | "rating"
//   | "reviewCount"
//   | "stock"
//   | "colors"
//   | "sellerInfo"
// > & { seed: string; daysAgo: number };

// const product = ({ seed, daysAgo, ...rest }: ProductInput): Product => ({
//   ...rest,
//   image: img(seed),
//   description: DESCRIPTION,
//   createdAt: NOW - daysAgo * DAY,
// });

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
//   product({
//     id: "p1",
//     name: "The Mirac Jiz",
//     seller: "Lisa Robber",
//     price: 195,
//     seed: "bag1",
//     categoryId: "c3",
//     rating: 4.8,
//     reviewCount: 320,
//     stock: 12,
//     colors: COLORS,
//     sellerInfo: UPBOX,
//     daysAgo: 1,
//   }),
//   product({
//     id: "p2",
//     name: "Meriza Kiles",
//     seller: "Gazuna Resika",
//     price: 143.45,
//     seed: "bag2",
//     categoryId: "c3",
//     rating: 4.6,
//     reviewCount: 187,
//     stock: 5,
//     colors: COLORS.slice(0, 3),
//     sellerInfo: GAZUNA,
//     daysAgo: 2,
//   }),
//   product({
//     id: "p3",
//     name: "Olive Satchel",
//     seller: "Tomi Adeyemi",
//     price: 120,
//     seed: "bag3",
//     categoryId: "c3",
//     rating: 4.7,
//     reviewCount: 96,
//     stock: 20,
//     sellerInfo: TOMI,
//     daysAgo: 3,
//   }),
//   product({
//     id: "p4",
//     name: "Classic Tote",
//     seller: "Amaka Obi",
//     price: 89.99,
//     seed: "bag4",
//     categoryId: "c3",
//     rating: 4.5,
//     reviewCount: 241,
//     stock: 8,
//     colors: COLORS.slice(0, 2),
//     daysAgo: 6,
//   }),
//   product({
//     id: "p5",
//     name: "Urban Crossbody",
//     seller: "Lisa Robber",
//     price: 76.5,
//     seed: "bag5",
//     categoryId: "c3",
//     rating: 4.4,
//     reviewCount: 73,
//     stock: 15,
//     daysAgo: 9,
//   }),
//   product({
//     id: "p6",
//     name: "Weekend Duffel",
//     seller: "Gazuna Resika",
//     price: 210,
//     seed: "bag6",
//     categoryId: "c3",
//     rating: 4.9,
//     reviewCount: 412,
//     stock: 3,
//     colors: COLORS,
//     sellerInfo: GAZUNA,
//     daysAgo: 12,
//   }),
//   product({
//     id: "p7",
//     name: "Linen Shirt",
//     seller: "Amaka Obi",
//     price: 54,
//     seed: "shirt1",
//     categoryId: "c2",
//     rating: 4.3,
//     reviewCount: 128,
//     stock: 25,
//     colors: ["#E8E2D0", "#2E4057", "#7A9E7E"],
//     daysAgo: 4,
//   }),
//   product({
//     id: "p8",
//     name: "Denim Jacket",
//     seller: "Tomi Adeyemi",
//     price: 98,
//     seed: "jacket1",
//     categoryId: "c2",
//     rating: 4.6,
//     reviewCount: 204,
//     stock: 10,
//     colors: ["#3B5B8C", "#111111"],
//     daysAgo: 15,
//   }),
//   product({
//     id: "p9",
//     name: "Street Sneakers",
//     seller: "Lisa Robber",
//     price: 120,
//     seed: "shoe1",
//     categoryId: "c4",
//     rating: 4.7,
//     reviewCount: 356,
//     stock: 14,
//     colors: ["#FFFFFF", "#111111", "#C0392B"],
//     daysAgo: 5,
//   }),
//   product({
//     id: "p10",
//     name: "Trail Runners",
//     seller: "Gazuna Resika",
//     price: 135,
//     seed: "shoe2",
//     categoryId: "c4",
//     rating: 4.5,
//     reviewCount: 142,
//     stock: 9,
//     daysAgo: 20,
//   }),
//   product({
//     id: "p11",
//     name: "Box Headphone 234",
//     seller: "Upbox Bag",
//     price: 66,
//     seed: "phone1",
//     categoryId: "c5",
//     rating: 4.8,
//     reviewCount: 521,
//     stock: 30,
//     colors: ["#111111", "#E8D5C4"],
//     sellerInfo: UPBOX,
//     daysAgo: 7,
//   }),
//   product({
//     id: "p12",
//     name: "Box Headphone 992",
//     seller: "Upbox Bag",
//     price: 74,
//     seed: "phone2",
//     categoryId: "c5",
//     rating: 4.4,
//     reviewCount: 167,
//     stock: 18,
//     sellerInfo: UPBOX,
//     daysAgo: 25,
//   }),
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

const img = (photoId: string, size = 600) => ({
  uri: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${size}&h=${size}&q=85`,
});

/** Accepts an Unsplash photo id ("photo-1483985988355-763728e1935b") or a full image link */
const unsplash = (photo: string) => {
  const base = photo.startsWith("http")
    ? photo.split("?")[0]
    : `https://images.unsplash.com/${photo}`;
  return { uri: `${base}?auto=format&fit=crop&w=1000&q=80` };
};

const DAY = 86_400_000;
const NOW = Date.now();

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

const TOMI = {
  name: "Tomi Bags",
  productCount: 38,
  followers: "512",
};

/** "New Arrivals" is a virtual category: every product, newest first. */
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
> & {
  imageId: string;
  description: string;
  daysAgo: number;
};

const product = ({
  imageId,
  description,
  daysAgo,
  ...rest
}: ProductInput): Product => ({
  ...rest,
  image: img(imageId),
  description,
  createdAt: NOW - daysAgo * DAY,
});

// export const BANNERS: Banner[] = [
//   {
//     id: "b1",
//     title: "Find your everyday carry, for less",
//     subtitle: "Discover bags made for every occasion",
//   },
//   {
//     id: "b2",
//     title: "Step into something new",
//     subtitle: "Fresh sneakers for wherever life takes you",
//   },
//   {
//     id: "b3",
//     title: "Your next favourite find is here",
//     subtitle: "Explore the latest arrivals at Novara",
//   },
// ];

export const BANNERS: Banner[] = [
  {
    id: "b1",
    tag: "Limited offer",
    title: "24% off shipping today on bag purchases",
    subtitle: "By Novara Store",
    image: unsplash("photo-1483985988355-763728e1935b"),
    cta: { label: "Shop bags", categoryId: "c3", title: "Bags" },
  },
  {
    id: "b2",
    tag: "New season",
    title: "Fresh sneakers just landed",
    subtitle: "By Novara Store",
    image: unsplash("photo-1491553895911-0055eca6402d"),
    cta: { label: "Shop shoes", categoryId: "c4", title: "Shoes" },
  },
  {
    id: "b3",
    tag: "Free delivery",
    title: "Free delivery on orders above $100",
    subtitle: "By Novara Store",
    image: unsplash("photo-1523381210434-271e8be1f52b"),
    cta: {
      label: "Start shopping",
      categoryId: NEW_ARRIVALS_CATEGORY_ID,
      title: "New Arrivals",
    },
  },
];

export const PRODUCTS: Product[] = [
  // BAGS
  product({
    id: "p1",
    name: "The Everyday Leather Tote",
    seller: "Lisa Robber",
    price: 195,
    imageId: "photo-1548036328-c9fa89d128fa",
    description:
      "A timeless tote with a structured silhouette and a refined finish. Spacious enough for your daily essentials, it transitions effortlessly from workdays to weekend outings. Pair it with tailored pieces or relaxed everyday looks.",
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
    name: "The Minimalist Shoulder Bag",
    seller: "Gazuna Resika",
    price: 143.45,
    imageId: "photo-1584917865442-de89df76afd3",
    description:
      "Understated, versatile, and easy to style. This shoulder bag brings a polished touch to everyday outfits while keeping your phone, wallet, keys, and other essentials close at hand.",
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
    name: "Olive Everyday Satchel",
    seller: "Tomi Adeyemi",
    price: 120,
    imageId: "photo-1590874103328-eac38a683ce7",
    description:
      "A practical satchel with a classic shape and an easygoing look. Its versatile design works beautifully with casual outfits, smart-casual clothing, and weekend essentials.",
    categoryId: "c3",
    rating: 4.7,
    reviewCount: 96,
    stock: 20,
    sellerInfo: TOMI,
    daysAgo: 3,
  }),

  product({
    id: "p4",
    name: "Classic Canvas Tote",
    seller: "Amaka Obi",
    price: 89.99,
    imageId: "photo-1591561954557-26941169b49e",
    description:
      "Your reliable everyday carry for errands, coffee runs, and days on the go. The clean, understated design makes it an easy match for denim, linen, and relaxed weekend outfits.",
    categoryId: "c3",
    rating: 4.5,
    reviewCount: 241,
    stock: 8,
    colors: COLORS.slice(0, 2),
    daysAgo: 6,
  }),

  product({
    id: "p5",
    name: "City Mini Crossbody",
    seller: "Lisa Robber",
    price: 76.5,
    imageId: "photo-1553062407-98eeb64c6a62",
    description:
      "Keep your essentials within easy reach with a compact bag designed for busy days. Its casual profile suits city walks, travel, and quick outings when you want to carry less without leaving the important things behind.",
    categoryId: "c3",
    rating: 4.4,
    reviewCount: 73,
    stock: 15,
    daysAgo: 9,
  }),

  product({
    id: "p6",
    name: "Weekender Travel Duffel",
    seller: "Gazuna Resika",
    price: 210,
    imageId: "photo-1553062407-98eeb64c6a62",
    description:
      "Made for short getaways and overnight trips, this roomy duffel keeps your travel essentials together in one convenient bag. Its versatile style works just as well for a weekend away as it does for a trip to the gym.",
    categoryId: "c3",
    rating: 4.9,
    reviewCount: 412,
    stock: 3,
    colors: COLORS,
    sellerInfo: GAZUNA,
    daysAgo: 12,
  }),

  // CLOTHING
  product({
    id: "p7",
    name: "Relaxed Linen Shirt",
    seller: "Amaka Obi",
    price: 54,
    imageId: "photo-1598033129183-c4f50c736f10",
    description:
      "An easy wardrobe staple with a relaxed fit and a clean, timeless look. Wear it tucked into tailored trousers for a smart finish or leave it untucked with jeans for effortless everyday style.",
    categoryId: "c2",
    rating: 4.3,
    reviewCount: 128,
    stock: 25,
    colors: ["#E8E2D0", "#2E4057", "#7A9E7E"],
    daysAgo: 4,
  }),

  product({
    id: "p8",
    name: "Classic Denim Jacket",
    seller: "Tomi Adeyemi",
    price: 98,
    imageId: "photo-1543076447-215ad9ba6923",
    description:
      "A dependable layering piece that never goes out of style. Throw it over a basic tee, pair it with dark trousers, or wear it with your favourite sneakers for a relaxed, put-together look.",
    categoryId: "c2",
    rating: 4.6,
    reviewCount: 204,
    stock: 10,
    colors: ["#3B5B8C", "#111111"],
    daysAgo: 15,
  }),

  // FOOTWEAR
  product({
    id: "p9",
    name: "Everyday Street Sneakers",
    seller: "Lisa Robber",
    price: 120,
    imageId: "photo-1542291026-7eec264c27ff",
    description:
      "Bring a sporty edge to your everyday rotation with sneakers that complement jeans, joggers, and casual fits. A versatile pick for daily outings, city walks, and laid-back weekends.",
    categoryId: "c4",
    rating: 4.7,
    reviewCount: 356,
    stock: 14,
    colors: ["#FFFFFF", "#111111", "#C0392B"],
    daysAgo: 5,
  }),

  product({
    id: "p10",
    name: "Active Trail Runners",
    seller: "Gazuna Resika",
    price: 135,
    imageId: "photo-1552346154-21d32810aba3",
    description:
      "Designed for an active lifestyle, these sporty runners bring a performance-inspired look to your footwear collection. Style them with training gear or everyday athleisure for a comfortable-looking, versatile outfit.",
    categoryId: "c4",
    rating: 4.5,
    reviewCount: 142,
    stock: 9,
    daysAgo: 20,
  }),

  // ELECTRONICS
  product({
    id: "p11",
    name: "Studio Wireless Headphones",
    seller: "Upbox Bag",
    price: 66,
    imageId: "photo-1505740420928-5e560c06d30e",
    description:
      "Settle into your favourite playlists, podcasts, and videos with a sleek pair of over-ear headphones. The clean design makes them a stylish companion for your desk setup, commute, or downtime.",
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
    name: "Essential Everyday Headphones",
    seller: "Upbox Bag",
    price: 74,
    imageId: "photo-1484704849700-f032a568e944",
    description:
      "A minimalist audio companion for work sessions, travel, and everyday listening. Its understated appearance fits neatly into a modern setup, making it an easy addition to your everyday tech essentials.",
    categoryId: "c5",
    rating: 4.4,
    reviewCount: 167,
    stock: 18,
    sellerInfo: UPBOX,
    daysAgo: 25,
  }),
];

export const CATEGORIES: Category[] = [
  {
    id: "c1",
    name: "New Arrivals",
    count: 208,
    image: img("photo-1441986300917-64674bd600d8", 400),
  },
  {
    id: "c2",
    name: "Clothes",
    count: 358,
    image: img("photo-1521572163474-6864f9cf17ab", 400),
  },
  {
    id: "c3",
    name: "Bags",
    count: 160,
    image: img("photo-1548036328-c9fa89d128fa", 400),
  },
  {
    id: "c4",
    name: "Shoes",
    count: 230,
    image: img("photo-1542291026-7eec264c27ff", 400),
  },
  {
    id: "c5",
    name: "Electronics",
    count: 120,
    image: img("photo-1505740420928-5e560c06d30e", 400),
  },
];

export const getProductById = (id: string) =>
  PRODUCTS.find((product) => product.id === id);
