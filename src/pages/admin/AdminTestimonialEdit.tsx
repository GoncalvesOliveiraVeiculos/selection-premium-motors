import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminTestimonialUpsertRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

function toIntOrNull(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function AdminTestimonialEdit() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === "new";
  const id = !isNew ? Number(params.id) : null;

  const q = useQuery({
    queryKey: ["admin", "testimonial", id],
    enabled: !isNew && Number.isFinite(id),
    queryFn: async () => api.admin.getTestimonial(id as number),
  });

  const [form, setForm] = useState<AdminTestimonialUpsertRequest>({
    name: "",
    title: "",
    location: "",
    rating: 5,
    content: "",
    isPublished: true,
  });

  useEffect(() => {
    const t = q.data?.testimonial;
    if (!t) return;
    setForm({
      name: t.name ?? "",
      title: t.title ?? "",
      location: t.location ?? "",
      rating: t.rating ?? 5,
      content: t.content ?? "",
      isPublished: Boolean(t.is_published ?? true),
    });
  }, [q.data]);

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload: AdminTestimonialUpsertRequest = {
        name: form.name,
        title: form.title || null,
        location: form.location || null,
        rating: form.rating ?? null,
        content: form.content,
        isPublished: Boolean(form.isPublished),
      };
      if (isNew) return api.admin.createTestimonial(payload);
      return api.admin.updateTestimonial(id as number, payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      toast({ title: "Salvo com sucesso" });
      navigate("/admin/testimonials", { replace: true });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async () => api.admin.deleteTestimonial(id as number),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      toast({ title: "Removido" });
      navigate("/admin/testimonials", { replace: true });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {isNew ? "Novo depoimento" : "Editar depoimento"}
          </h1>
          <p className="text-sm text-muted-foreground">Isso alimenta a seção de depoimentos no site.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/testimonials">Voltar</Link>
        </Button>
      </div>

      {!isNew && q.isLoading && <div className="card-premium p-6">Carregando...</div>}
      {!isNew && q.isError && <div className="card-premium p-6 text-destructive">Erro ao carregar.</div>}

      <div className="card-premium p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Local</label>
            <Input value={form.location ?? ""} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Título (opcional)</label>
            <Input value={form.title ?? ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating (1-5)</label>
            <Input
              value={form.rating ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, rating: toIntOrNull(e.target.value) }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Conteúdo</label>
          <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={6} />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            checked={Boolean(form.isPublished)}
            onCheckedChange={(v) => setForm((p) => ({ ...p, isPublished: Boolean(v) }))}
            id="published"
          />
          <label htmlFor="published" className="text-sm">
            Publicado
          </label>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? "Salvando..." : "Salvar"}
          </Button>
          {!isNew && (
            <Button variant="destructive" onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending}>
              Remover
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

