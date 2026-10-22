export type Address = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  region: string;
  postalCode?: string;
  isDefault: boolean;
};

export type AddressInput = {
  label?: string;
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  region: string;
  postalCode?: string;
  isDefault?: boolean;
};

export type ApiAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  region: string;
  postalCode: string | null;
  isDefault: boolean;
};
