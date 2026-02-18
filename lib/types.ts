// lib/types.ts

export interface Rental {
  id: string;
  customer: string;
  itemId: string;
  startDate: string;
  endDate: string;
  hasOwnKovcek: boolean;  
  hasOwnNosilci: boolean; 
  thuleKit: string;
  thuleNoge: string;
  thulePalice: string;
  keyNumber: string;
  address: string;
  phone: string;
}


export interface Kovcek {
  id: string;
  name: string;
  desc: string;
  purchasePrice?: number;
  sellPrice?: number;
}

export interface Nosilec {
  id: string;
  name: string;
  desc?: string;
  quantity?: number;
  location?: string;
  purchasePrice?: number;
  sellPrice?: number;
}

export type ThuleCategory = "kit" | "foot" | "bars" | "bike_stand" | "ski_stand";

export interface ThuleItem {
  id: string; // serial number (#1, #2, #3...)
  category: ThuleCategory;
  title: string; // e.g. 'Kit 1001' or 'WingBar Evo' or '753'
  series?: string; // e.g. '1***' or 'SquareBar' (the model type)
  model?: string; // e.g. '1023' (the specific number)
  note?: string; // opomba (not desc)
  variant?: string; // e.g. 'stari' | 'novi' for feet
  length?: string; // e.g. length for bars (stored as string)
  condition?: "NOVO" | "RABLJENO" | "NEPOPOLNO"; // condition for all
  quantity?: number; // default 1
  purchasePrice?: number;
  sellPrice?: number;
}
