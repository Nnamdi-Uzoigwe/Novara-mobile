import type { Address } from "./types";

export const formatAddress = (
  a: Pick<Address, "line1" | "city" | "region" | "postalCode">,
) =>
  [
    a.line1,
    a.city,
    a.postalCode ? `${a.region} ${a.postalCode}` : a.region,
  ].join(", ");
