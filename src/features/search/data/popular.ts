export type PopularBadge = "Hot" | "New" | "Popular";

export type PopularSearch = {
  id: string;
  /** The text that gets searched when the row is tapped */
  term: string;
  /** Product whose photo is shown on the row */
  productId: string;
  searchesToday: string;
  badge: PopularBadge;
};

// TODO: replace with trending searches from your API
export const POPULAR_SEARCHES: PopularSearch[] = [
  {
    id: "s1",
    term: "Denim Jacket",
    productId: "p8",
    searchesToday: "1.6k",
    badge: "Hot",
  },
  {
    id: "s2",
    term: "Linen Shirt",
    productId: "p7",
    searchesToday: "1k",
    badge: "New",
  },
  {
    id: "s3",
    term: "Classic Tote",
    productId: "p4",
    searchesToday: "1.2k",
    badge: "Popular",
  },
  {
    id: "s4",
    term: "Box Headphone",
    productId: "p11",
    searchesToday: "1.1k",
    badge: "New",
  },
];
