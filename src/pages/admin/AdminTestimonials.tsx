import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminTestimonials() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "testimonials", { limit: 200 }],
    queryFn: async () => (await api.admin.listTestimonials(200)).testimonials,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Depoimentos</h1>
          <p className="text-sm text-muted-foreground">Gerencie depoimentos exibidos no site.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] })}>
            Atualizar
          </Button>
          <Button asChild>
            <Link to="/admin/testimonials/new">Novo depoimento</Link>
          </Button>
        </div>
      </div>

      {q.isLoading && <div className="card-premium p-6">Carregando...</div>}
      {q.isError && <div className="card-premium p-6 text-destructive">Erro ao carregar.</div>}

      {!q.isLoading && !q.isError && (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40">
                <tr className="text-left">
                  <th className="p-3">Nome</th>
                  <th className="p-3">Local</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Publicado</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(q.data || []).map((t) => (
                  <tr key={t.id} className="border-t border-border/60">
                    <td className="p-3">{t.name}</td>
                    <td className="p-3">{t.location ?? "-"}</td>
                    <td className="p-3">{t.rating ?? "-"}</td>
                    <td className="p-3">{String(t.is_published)}</td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/testimonials/${t.id}`}>Editar</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(q.data || []).length === 0 && (
                  <tr>
                    <td className="p-6 text-muted-foreground" colSpan={5}>
                      Nenhum depoimento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

