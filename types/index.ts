export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  trim?: string | null;
  year: number;
  price: number;
  mileage: number;
  description: string;
  features: string[];
  images: string[];
  status: "available" | "sold" | "pending";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  msrp?: number | null;
  stockNumber?: string | null;
  vin?: string | null;
  bodyStyle?: string | null;
  transmission?: string | null;
  engine?: string | null;
  fuelType?: string | null;
  driveType?: string | null;
  doors?: number | null;
  seats?: number | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
}

export interface NavLink {
  href: string;
  label: string;
  children?: NavLink[];
}
