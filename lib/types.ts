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
}
