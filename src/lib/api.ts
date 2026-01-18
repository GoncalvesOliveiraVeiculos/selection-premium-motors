import { getAdminApiKey } from "@/lib/admin-key";
import type {
  AdminLeadRow,
  AdminTestimonialDbRow,
  AdminTestimonialUpsertRequest,
  AdminVehicleDbRow,
  AdminVehicleUpsertRequest,
  LeadCreateRequest,
  Testimonial,
  VehicleDetail,
  VehicleListItem,
} from "@/lib/types";

type ApiOk<T> = T & { ok: true };
type ApiErr = { error: string; details?: unknown };

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err: ApiErr = data || { error: "Erro inesperado" };
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return data as T;
}

function withAdminHeaders(init?: RequestInit): RequestInit {
  const key = getAdminApiKey();
  return {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(key ? { "x-admin-key": key } : {}),
    },
  };
}

export const api = {
  health: () => apiFetch<ApiOk<{ ok: true }>>("/api/health"),

  listVehicles: (params?: { category?: string; featured?: boolean; limit?: number }) => {
    const usp = new URLSearchParams();
    if (params?.category) usp.set("category", params.category);
    if (params?.featured !== undefined) usp.set("featured", String(params.featured));
    if (params?.limit) usp.set("limit", String(params.limit));
    const qs = usp.toString();
    return apiFetch<ApiOk<{ vehicles: VehicleListItem[] }>>(`/api/vehicles${qs ? `?${qs}` : ""}`);
  },

  getVehicleBySlug: (slug: string) => apiFetch<ApiOk<{ vehicle: VehicleDetail }>>(`/api/vehicles/${encodeURIComponent(slug)}`),

  listTestimonials: (limit = 20) =>
    apiFetch<ApiOk<{ testimonials: Testimonial[] }>>(`/api/testimonials?limit=${encodeURIComponent(String(limit))}`),

  createLead: (payload: LeadCreateRequest) =>
    apiFetch<ApiOk<{ lead: { id: number; created_at: string } }>>("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }),

  admin: {
    listVehicles: (params?: { status?: string; limit?: number }) => {
      const usp = new URLSearchParams();
      if (params?.status) usp.set("status", params.status);
      if (params?.limit) usp.set("limit", String(params.limit));
      const qs = usp.toString();
      return apiFetch<ApiOk<{ vehicles: VehicleListItem[] }>>(`/api/admin/vehicles${qs ? `?${qs}` : ""}`, withAdminHeaders());
    },

    getVehicle: (id: number) =>
      apiFetch<ApiOk<{ vehicle: AdminVehicleDbRow; images: Array<{ id: number; url: string; isCover: boolean; sortOrder: number }> }>>(
        `/api/admin/vehicles/${id}`,
        withAdminHeaders(),
      ),

    createVehicle: (payload: AdminVehicleUpsertRequest) =>
      apiFetch<ApiOk<{ vehicle: { id: number; slug: string } }>>("/api/admin/vehicles", {
        method: "POST",
        headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
        body: JSON.stringify(payload),
      }),

    updateVehicle: (id: number, payload: AdminVehicleUpsertRequest) =>
      apiFetch<ApiOk<{ vehicle: { id: number; slug: string } }>>(`/api/admin/vehicles/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
        body: JSON.stringify(payload),
      }),

    archiveVehicle: (id: number) =>
      apiFetch<ApiOk<{ ok: true }>>(`/api/admin/vehicles/${id}`, { method: "DELETE", ...withAdminHeaders() }),

    upload: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return apiFetch<ApiOk<{ upload: { id: number; url: string; cloudinary_public_id: string | null } }>>(
        "/api/admin/uploads",
        withAdminHeaders({ method: "POST", body: fd }),
      );
    },

    addVehicleImage: (vehicleId: number, payload: { url: string; cloudinaryPublicId?: string | null; isCover?: boolean }) =>
      apiFetch<ApiOk<{ image: { id: number; url: string } }>>(`/api/admin/vehicles/${vehicleId}/images`, {
        method: "POST",
        headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
        body: JSON.stringify(payload),
      }),

    patchVehicleImage: (id: number, payload: { isCover?: boolean; sortOrder?: number }) =>
      apiFetch<ApiOk<{ image: { id: number; vehicle_id: number; is_cover: boolean; sort_order: number } }>>(
        `/api/admin/vehicle-images/${id}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
          body: JSON.stringify(payload),
        },
      ),

    deleteVehicleImage: (id: number) =>
      apiFetch<ApiOk<{ ok: true }>>(`/api/admin/vehicle-images/${id}`, { method: "DELETE", ...withAdminHeaders() }),

    listLeads: (limit = 200) => apiFetch<ApiOk<{ leads: AdminLeadRow[] }>>(`/api/admin/leads?limit=${limit}`, withAdminHeaders()),

    updateLeadStatus: (id: number, status: string) =>
      apiFetch<ApiOk<{ lead: { id: number; status: string } }>>(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
        body: JSON.stringify({ status }),
      }),

    listTestimonials: (limit = 200) =>
      apiFetch<ApiOk<{ testimonials: AdminTestimonialDbRow[] }>>(`/api/admin/testimonials?limit=${limit}`, withAdminHeaders()),

    getTestimonial: (id: number) =>
      apiFetch<ApiOk<{ testimonial: AdminTestimonialDbRow }>>(`/api/admin/testimonials/${id}`, withAdminHeaders()),

    createTestimonial: (payload: AdminTestimonialUpsertRequest) =>
      apiFetch<ApiOk<{ testimonial: { id: number } }>>("/api/admin/testimonials", {
        method: "POST",
        headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
        body: JSON.stringify(payload),
      }),

    updateTestimonial: (id: number, payload: AdminTestimonialUpsertRequest) =>
      apiFetch<ApiOk<{ testimonial: { id: number } }>>(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json", ...(withAdminHeaders().headers as Record<string, string>) },
        body: JSON.stringify(payload),
      }),

    deleteTestimonial: (id: number) =>
      apiFetch<ApiOk<{ ok: true }>>(`/api/admin/testimonials/${id}`, { method: "DELETE", ...withAdminHeaders() }),
  },
};

