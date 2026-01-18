import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminVehicleUpsertRequest, VehicleCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

function toIntOrNull(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function AdminVehicleEdit({ mode }: { mode: "new" | "edit" }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const id = mode === "edit" ? Number(params.id) : null;
  const isEdit = mode === "edit";

  const vehicleQ = useQuery({
    queryKey: ["admin", "vehicle", id],
    enabled: isEdit && Number.isFinite(id),
    queryFn: async () => api.admin.getVehicle(id as number),
  });

  const [form, setForm] = useState<AdminVehicleUpsertRequest>({
    slug: "",
    title: "",
    status: "draft",
    featured: false,
    category: null,
    features: [],
  });

  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => {
    if (!vehicleQ.data?.vehicle) return;
    const v = vehicleQ.data.vehicle;
    setForm({
      slug: v.slug ?? "",
      title: v.title ?? "",
      brand: v.brand ?? null,
      model: v.model ?? null,
      year: v.year ?? null,
      priceCents: v.price_cents ?? null,
      mileageKm: v.mileage_km ?? null,
      fuel: v.fuel ?? null,
      transmission: v.transmission ?? null,
      color: v.color ?? null,
      description: v.description ?? null,
      status: v.status ?? "draft",
      featured: Boolean(v.featured),
      category: v.category ?? null,
      motor: v.motor ?? null,
      power: v.power ?? null,
      traction: v.traction ?? null,
      doors: v.doors ?? null,
      seats: v.seats ?? null,
      plateFinal: v.plate_final ?? null,
      features: Array.isArray(v.features) ? v.features : [],
    });
    setFeaturesText((Array.isArray(v.features) ? v.features : []).join("\n"));
  }, [vehicleQ.data]);

  const images = useMemo(() => vehicleQ.data?.images || [], [vehicleQ.data]);

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload: AdminVehicleUpsertRequest = {
        ...form,
        features: featuresText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (isEdit) return api.admin.updateVehicle(id as number, payload);
      return api.admin.createVehicle(payload);
    },
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      toast({ title: "Salvo com sucesso" });
      if (!isEdit) {
        const newId = (data as { vehicle?: { id?: number } }).vehicle?.id;
        if (newId) navigate(`/admin/vehicles/${newId}`, { replace: true });
      }
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  const uploadMut = useMutation({
    mutationFn: async (file: File) => {
      if (!isEdit) throw new Error("Salve o veículo antes de adicionar imagens.");
      const up = await api.admin.upload(file);
      await api.admin.addVehicleImage(id as number, {
        url: up.upload.url,
        cloudinaryPublicId: up.upload.cloudinary_public_id,
        isCover: images.length === 0,
      });
      return true;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "vehicle", id] });
      toast({ title: "Imagem adicionada" });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  const setCoverMut = useMutation({
    mutationFn: async (imageId: number) => api.admin.patchVehicleImage(imageId, { isCover: true }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "vehicle", id] });
      toast({ title: "Capa atualizada" });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  const deleteImageMut = useMutation({
    mutationFn: async (imageId: number) => api.admin.deleteVehicleImage(imageId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "vehicle", id] });
      toast({ title: "Imagem removida" });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {isEdit ? "Editar veículo" : "Novo veículo"}
          </h1>
          <p className="text-sm text-muted-foreground">Campos principais + imagens (Cloudinary).</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/vehicles">Voltar</Link>
        </Button>
      </div>

      {isEdit && vehicleQ.isLoading && <div className="card-premium p-6">Carregando...</div>}
      {isEdit && vehicleQ.isError && <div className="card-premium p-6 text-destructive">Erro ao carregar.</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.category ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, category: (e.target.value || null) as VehicleCategory | null }))}
              >
                <option value="">(vazio)</option>
                <option value="novos">Novos</option>
                <option value="seminovos">Seminovos</option>
                <option value="luxo">Luxo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.status ?? "draft"}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AdminVehicleUpsertRequest["status"] }))}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="sold">sold</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <Input
                value={form.year ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, year: toIntOrNull(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço (centavos)</label>
              <Input
                value={form.priceCents ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, priceCents: toIntOrNull(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">KM</label>
              <Input
                value={form.mileageKm ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, mileageKm: toIntOrNull(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Combustível</label>
              <Input value={form.fuel ?? ""} onChange={(e) => setForm((p) => ({ ...p, fuel: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transmissão</label>
              <Input
                value={form.transmission ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor</label>
              <Input value={form.color ?? ""} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={6}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Motor</label>
              <Input value={form.motor ?? ""} onChange={(e) => setForm((p) => ({ ...p, motor: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Potência</label>
              <Input value={form.power ?? ""} onChange={(e) => setForm((p) => ({ ...p, power: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tração</label>
              <Input
                value={form.traction ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, traction: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Final placa</label>
              <Input
                value={form.plateFinal ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, plateFinal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Portas</label>
              <Input
                value={form.doors ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, doors: toIntOrNull(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lugares</label>
              <Input
                value={form.seats ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, seats: toIntOrNull(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Checkbox
              checked={Boolean(form.featured)}
              onCheckedChange={(v) => setForm((p) => ({ ...p, featured: Boolean(v) }))}
              id="featured"
            />
            <label htmlFor="featured" className="text-sm">
              Destaque (featured)
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Opcionais (1 por linha)</label>
            <Textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={8} />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              {saveMut.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <div className="card-premium p-6 space-y-4">
          <div>
            <h2 className="font-display font-bold text-foreground">Imagens</h2>
            <p className="text-xs text-muted-foreground">Upload via Cloudinary + vínculo no banco.</p>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadMut.mutate(f);
              e.currentTarget.value = "";
            }}
            disabled={uploadMut.isPending}
          />

          {uploadMut.isPending && <p className="text-sm text-muted-foreground">Enviando...</p>}

          <div className="space-y-3">
            {images.map((img) => (
              <div key={img.id} className="flex items-center gap-3">
                <div className="w-20 h-14 rounded-md overflow-hidden bg-secondary/40">
                  <img src={img.url} alt={`Imagem ${img.id}`} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">{img.url}</p>
                  <p className="text-xs">{img.isCover ? "Capa" : "—"}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCoverMut.mutate(img.id)}
                    disabled={setCoverMut.isPending}
                  >
                    Definir capa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteImageMut.mutate(img.id)}
                    disabled={deleteImageMut.isPending}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            {isEdit && images.length === 0 && <p className="text-sm text-muted-foreground">Sem imagens ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

