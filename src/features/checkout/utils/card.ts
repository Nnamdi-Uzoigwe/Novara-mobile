import type { PaymentMethod } from "@/features/checkout/types";

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const formatCardNumber = (value: string) =>
  onlyDigits(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiry = (value: string) => {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
};

/** Standard card number checksum, catches most typing mistakes */
export const passesLuhn = (digits: string) => {
  if (digits.length < 13) return false;

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
};

export const isExpiryValid = (value: string) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const detectBrand = (digits: string): PaymentMethod["type"] => {
  const first2 = Number(digits.slice(0, 2));
  const first4 = Number(digits.slice(0, 4));

  if (digits.startsWith("4")) return "visa";
  if (first2 >= 51 && first2 <= 55) return "mastercard";
  if (first4 >= 2221 && first4 <= 2720) return "mastercard";
  return "card";
};

export const brandTitle = (type: PaymentMethod["type"]) =>
  type === "visa" ? "Visa" : type === "mastercard" ? "Mastercard" : "Card";
