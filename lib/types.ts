// lib/types.ts

export interface Rental {
  id: string;
  customer: string;
  itemId: string;
  startDate: string;
  endDate: string;
}

export interface Kovcek {
  id: string;
  name: string;
  desc: string;
}
