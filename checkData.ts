export interface washingMachine {
  imageUrl: string;
  brandRef: string; ?
  websiteRef: string;
  name: string;
  brand: string;
  price: number;
  energyClass: string;
  loadingType: 'Hublot' | 'top';
  energyConsumption: number;
  waterConsumption: number;
  wringingEfficacity: string;
  sparePartsAvailability: number;
  reparabilityIndex: number;
  fabricationOrigin: string;
  weight: number;
}

const example = {
  imageUrl:
    'https://www.electromenager-compare.com/images/pdts/xl/HIGWF580DW701T.jpg',
  brandRef: 'WF580DW701T',
  websiteRef:
    'https://www.electromenager-compare.com/lave-linge-HIGWF580DW701T-HIGH-ONE-WF-580-D-W701T.htm',
  name: 'HIGH ONE WF 580 D W701T',
  brand: 'HIGH ONE',
  price: 194.98,
  energyClass: 'A++',
  loadingType: 'Hublot',
  energyConsumption: 147,
  waterConsumption: 9240,
  wringingEfficacity: 'D',
  sparePartsAvailability: 6,
  reparabilityIndex: null,
  fabricationOrigin: null,
  weight: 58.5,
};
