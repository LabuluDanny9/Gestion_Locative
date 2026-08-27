export type PropertyStatus = "active" | "maintenance" | "inactive";
export type UnitStatus = "occupied" | "available" | "maintenance" | "reserved";

export type Property = {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  units: number;
  occupied: number;
  available: number;
  monthlyRevenue: number;
  currency: "USD" | "CDF";
  buildings: number;
  floors: number;
  status: PropertyStatus;
  image: string;
  description: string;
};

export type Unit = {
  id: string;
  code: string;
  type: string;
  propertyId: string;
  propertyName: string;
  building: string;
  floor: string;
  bedrooms: number;
  livingRooms: number;
  bathrooms: number;
  kitchens: number;
  area: number;
  rent: number;
  currency: "USD" | "CDF";
  status: UnitStatus;
  tenant?: { id: string; name: string; code: string; contractStart: string; contractEnd: string };
  image: string;
};

const propertyImage = "/images/properties/residence-grace.png";

export const properties: Property[] = [
  {
    id: "residence-grace",
    name: "Résidence Grâce",
    type: "Immeuble résidentiel",
    city: "Lubumbashi, RDC",
    address: "Avenue des Érables, Golf",
    units: 12,
    occupied: 10,
    available: 2,
    monthlyRevenue: 3500,
    currency: "USD",
    buildings: 2,
    floors: 4,
    status: "active",
    image: propertyImage,
    description: "Résidence contemporaine organisée autour de deux bâtiments, avec accès sécurisé et espaces extérieurs entretenus.",
  },
  {
    id: "villa-mwezi",
    name: "Villa Mwezi",
    type: "Maison individuelle",
    city: "Lubumbashi, RDC",
    address: "Quartier Golf Météo",
    units: 1,
    occupied: 1,
    available: 0,
    monthlyRevenue: 1200,
    currency: "USD",
    buildings: 1,
    floors: 2,
    status: "active",
    image: propertyImage,
    description: "Villa familiale lumineuse avec jardin et stationnement privatif.",
  },
  {
    id: "immeuble-upemba",
    name: "Immeuble Upemba",
    type: "Immeuble mixte",
    city: "Kolwezi, RDC",
    address: "Boulevard Kasa-Vubu",
    units: 18,
    occupied: 14,
    available: 3,
    monthlyRevenue: 6200,
    currency: "USD",
    buildings: 1,
    floors: 5,
    status: "maintenance",
    image: propertyImage,
    description: "Immeuble urbain associant logements et surfaces commerciales.",
  },
  {
    id: "residence-katanga",
    name: "Résidence Katanga",
    type: "Appartements meublés",
    city: "Lubumbashi, RDC",
    address: "Avenue Kapenda",
    units: 8,
    occupied: 6,
    available: 2,
    monthlyRevenue: 4800,
    currency: "USD",
    buildings: 1,
    floors: 3,
    status: "active",
    image: propertyImage,
    description: "Résidence meublée pensée pour les séjours professionnels de moyenne durée.",
  },
];

export const units: Unit[] = [
  { id: "appartement-a03", code: "A03", type: "Appartement", propertyId: "residence-grace", propertyName: "Résidence Grâce", building: "Bâtiment A", floor: "2e étage", bedrooms: 2, livingRooms: 1, bathrooms: 1, kitchens: 1, area: 82, rent: 350, currency: "USD", status: "occupied", tenant: { id: "jean-kabulo", name: "Jean Kabulo", code: "LOC-2026-0023", contractStart: "01/09/2026", contractEnd: "31/08/2027" }, image: propertyImage },
  { id: "appartement-a04", code: "A04", type: "Appartement", propertyId: "residence-grace", propertyName: "Résidence Grâce", building: "Bâtiment A", floor: "2e étage", bedrooms: 2, livingRooms: 1, bathrooms: 1, kitchens: 1, area: 80, rent: 350, currency: "USD", status: "available", image: propertyImage },
  { id: "studio-b01", code: "B01", type: "Studio", propertyId: "residence-grace", propertyName: "Résidence Grâce", building: "Bâtiment B", floor: "Rez-de-chaussée", bedrooms: 1, livingRooms: 0, bathrooms: 1, kitchens: 1, area: 42, rent: 240, currency: "USD", status: "occupied", tenant: { id: "grace-tshibangu", name: "Grâce Tshibangu", code: "LOC-2026-0018", contractStart: "01/07/2026", contractEnd: "30/06/2027" }, image: propertyImage },
  { id: "appartement-b04", code: "B04", type: "Appartement", propertyId: "residence-grace", propertyName: "Résidence Grâce", building: "Bâtiment B", floor: "1er étage", bedrooms: 3, livingRooms: 1, bathrooms: 2, kitchens: 1, area: 108, rent: 520, currency: "USD", status: "maintenance", image: propertyImage },
  { id: "villa-m01", code: "M01", type: "Maison", propertyId: "villa-mwezi", propertyName: "Villa Mwezi", building: "Maison principale", floor: "Duplex", bedrooms: 4, livingRooms: 2, bathrooms: 3, kitchens: 1, area: 240, rent: 1200, currency: "USD", status: "occupied", tenant: { id: "patrick-mwamba", name: "Patrick Mwamba", code: "LOC-2025-0096", contractStart: "01/12/2025", contractEnd: "30/11/2026" }, image: propertyImage },
  { id: "appartement-u12", code: "U12", type: "Appartement", propertyId: "immeuble-upemba", propertyName: "Immeuble Upemba", building: "Tour principale", floor: "4e étage", bedrooms: 2, livingRooms: 1, bathrooms: 1, kitchens: 1, area: 76, rent: 420, currency: "USD", status: "occupied", tenant: { id: "amina-kasongo", name: "Amina Kasongo", code: "LOC-2025-0072", contractStart: "05/11/2025", contractEnd: "04/11/2026" }, image: propertyImage },
];

export function getProperty(id: string) {
  return properties.find((property) => property.id === id);
}

export function getUnit(id: string) {
  return units.find((unit) => unit.id === id);
}

export function getPropertyUnits(propertyId: string) {
  return units.filter((unit) => unit.propertyId === propertyId);
}
