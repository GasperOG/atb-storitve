// lib/types.ts

export type Rental = {
  id: string;
  customer: string;
  itemId: string;
  startDate: string;
  endDate: string;
  hasOwnMount?: boolean;
  thuleKit?: string;
  thuleNoge?: string;
  thulePalice?: string;
  keyNumber?: string;
};


export interface Kovcek {
  id: string;
  name: string;
  desc: string;
}
