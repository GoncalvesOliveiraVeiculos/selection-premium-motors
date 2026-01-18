export type VehicleCategory = "novos" | "seminovos" | "luxo";

export interface VehicleListItem {
  id: number;
  slug: string;
  title: string;
  category: VehicleCategory | null;
  year: number | null;
  priceCents: number | null;
  price: string | null;
  mileageKm: number | null;
  fuel: string | null;
  status: "draft" | "published" | "sold" | "archived";
  featured: boolean;
  coverImageUrl: string | null;
}

export interface VehicleDetail {
  id: number;
  slug: string;
  title: string;
  category: VehicleCategory | null;
  year: number | null;
  priceCents: number | null;
  price: string | null;
  mileageKm: number | null;
  fuel: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  status: "draft" | "published" | "sold" | "archived";
  featured: boolean;
  specs: {
    motor: string | null;
    potencia: string | null;
    transmissao: string | null;
    tracao: string | null;
    cor: string | null;
    portas: number | null;
    lugares: number | null;
    final_placa: string | null;
  };
  features: string[];
  images: Array<{ id: number; url: string; isCover: boolean; sortOrder: number }>;
}

export interface Testimonial {
  id: number;
  name: string;
  title: string | null;
  rating: number | null;
  text: string;
  location: string | null;
}

export interface LeadCreateRequest {
  vehicleId?: number;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  source?: string;
}

export interface AdminVehicleUpsertRequest {
  slug: string;
  title: string;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  priceCents?: number | null;
  mileageKm?: number | null;
  fuel?: string | null;
  transmission?: string | null;
  color?: string | null;
  description?: string | null;
  status?: "draft" | "published" | "sold" | "archived";
  featured?: boolean;
  category?: VehicleCategory | null;
  motor?: string | null;
  power?: string | null;
  traction?: string | null;
  doors?: number | null;
  seats?: number | null;
  plateFinal?: string | null;
  features?: string[] | null;
}

export interface AdminTestimonialUpsertRequest {
  name: string;
  title?: string | null;
  location?: string | null;
  rating?: number | null;
  content: string;
  isPublished?: boolean;
}

export interface AdminVehicleDbRow {
  id: number;
  slug: string;
  title: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  price_cents: number | null;
  mileage_km: number | null;
  fuel: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  status: "draft" | "published" | "sold" | "archived";
  featured: boolean;
  category: VehicleCategory | null;
  motor: string | null;
  power: string | null;
  traction: string | null;
  doors: number | null;
  seats: number | null;
  plate_final: string | null;
  features: unknown;
}

export interface AdminLeadRow {
  id: number;
  vehicle_id: number | null;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  source: string | null;
  status: "new" | "contacted" | "converted" | "archived";
  created_at: string;
  updated_at: string;
}

export interface AdminTestimonialDbRow {
  id: number;
  name: string;
  title: string | null;
  rating: number | null;
  content: string;
  is_published: boolean;
  location: string | null;
  created_at: string;
  updated_at: string;
}
