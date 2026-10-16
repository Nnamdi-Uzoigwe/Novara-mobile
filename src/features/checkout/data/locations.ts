import type { Address } from "@/features/checkout/types";

// TODO: replace with the user's saved addresses from your API
export const LOCATIONS: Address[] = [
  {
    id: "la",
    label: "House",
    city: "Los Angeles",
    description: "Los Angeles, United States",
    line1: "1234 Sunset Blvd",
    region: "California (CA)",
    postalCode: "90028",
  },
  {
    id: "sf",
    label: "House",
    city: "San Francisco",
    description: "San Francisco, United States",
    line1: "88 Market St",
    region: "California (CA)",
    postalCode: "94105",
  },
  {
    id: "ny",
    label: "House",
    city: "New York",
    description: "New York, United States",
    line1: "350 5th Ave",
    region: "New York (NY)",
    postalCode: "10118",
  },
  {
    id: "sd",
    label: "House",
    city: "San Diego",
    description: "San Diego, United States",
    line1: "5482 Adobe Falls Rd #15",
    region: "California (CA)",
    postalCode: "92120",
  },
];
