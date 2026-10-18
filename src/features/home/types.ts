// import type { ImageSource } from "expo-image";

// export type Seller = {
//   name: string;
//   verified?: boolean;
//   productCount: number;
//   followers: string;
//   avatar?: ImageSource;
// };

// export type Product = {
//   id: string;
//   name: string;
//   seller: string;
//   price: number;
//   image: ImageSource;
//   categoryId?: string;
//   /** Used for the "Latest" sort */
//   createdAt?: number;
//   // Optional details, used by the product details screen
//   rating?: number;
//   reviewCount?: number;
//   description?: string;
//   colors?: string[];
//   stock?: number;
//   sellerInfo?: Seller;
// };

// export type Category = {
//   id: string;
//   name: string;
//   count: number;
//   image: ImageSource;
// };

// export type Banner = {
//   id: string;
//   title: string;
//   subtitle: string;
//   /** Transparent PNG cutout (bag, shoe, etc). Optional */
//   image?: ImageSource;
// };

import type { ImageSource } from "expo-image";

export type Seller = {
  name: string;
  verified?: boolean;
  productCount: number;
  followers: string;
  avatar?: ImageSource;
};

export type Product = {
  id: string;
  name: string;
  seller: string;
  price: number;
  image: ImageSource;
  categoryId?: string;
  /** Used for the "Latest" sort */
  createdAt?: number;
  // Optional details, used by the product details screen
  rating?: number;
  reviewCount?: number;
  description?: string;
  colors?: string[];
  stock?: number;
  sellerInfo?: Seller;
};

export type Category = {
  id: string;
  name: string;
  count: number;
  image: ImageSource;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  /** Small label above the title, such as "Limited offer" */
  tag?: string;
  /** Photo that fills the banner. Without it, a plain brand-colored banner is shown */
  image?: ImageSource;
  /** Button on the banner. Opens the product list for a category */
  cta?: { label: string; categoryId?: string; title?: string };
};
