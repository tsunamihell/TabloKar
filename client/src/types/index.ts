export interface Role {
  id: number;
  name: string;
  title: string;
  permissions?: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  phone?: string | null;
  role: Role;
}

export interface ShopSetting {
  id: number;
  shopName: string;
  tagline?: string | null;
  city: string;
  address: string;
  phone: string;
  mobile?: string | null;
  currency: string;
  receiptHeader?: string | null;
  receiptFooter?: string | null;
  logoUrl?: string | null;
  updatedAt?: string;
}

export interface ProductTypeCatalog {
  id: number;
  code: string;
  name: string;
  unit: string;
  defaultBasePrice: number;
  description?: string | null;
  isActive: boolean;
}

