export type PropertyStatus = "active" | "maintenance" | "inactive";
export type UnitStatus = "occupied" | "available" | "maintenance" | "reserved";
export type Property = { id: string; name: string; type: string; city: string; address: string; units: number; occupied: number; available: number; monthlyRevenue: number; currency: "USD" | "CDF"; buildings: number; floors: number; status: PropertyStatus; image: string; description: string };
export type Unit = { id: string; code: string; type: string; propertyId: string; propertyName: string; building: string; floor: string; bedrooms: number; livingRooms: number; bathrooms: number; kitchens: number; area: number; rent: number; currency: "USD" | "CDF"; status: UnitStatus; tenant?: { id: string; name: string; code: string; contractId: string; contractStart: string; contractEnd: string }; image: string; photos?: { src: string; label: string }[] };

// Les données sont toujours chargées depuis Supabase par rental-read-models.
export const properties: Property[] = [];
export const units: Unit[] = [];
export const getProperty = (id: string) => properties.find((property) => property.id === id);
export const getUnit = (id: string) => units.find((unit) => unit.id === id);
export const getPropertyUnits = (propertyId: string) => units.filter((unit) => unit.propertyId === propertyId);
