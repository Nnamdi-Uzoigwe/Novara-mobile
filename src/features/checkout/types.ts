export type Address = {
  id: string;
  /** Short name shown on the payment screen, such as "House" */
  label: string;
  city: string;
  /** Subtitle shown on the location card, such as "Los Angeles, United States" */
  description: string;
  line1: string;
  region: string;
  postalCode: string;
};

export type PaymentMethod = {
  id: string;
  /** "card" covers any card that is not Visa or Mastercard, such as Verve */
  type: "paypal" | "mastercard" | "visa" | "card";
  title: string;
  /** Masked text only. Never store a full card number or CVV */
  detail: string;
};
