import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { categoryLabel, formatKm } from "@/lib/format";

export default function AdminVehicles() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin", "vehicles", { limit: 200 }],
    queryFn: async () => (await api.admin.listVehicles({ limit: 200 })).vehicles,
  });

  const archiveMut = useMutation({
    mutationFn: async (id: number) => api.admin.archiveVehicle(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      toast({ title: "Veículo arquivado" });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  const rows = useMemo(() => q.data || [], [q.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Veículos</h1>
          <p className="text-sm text-muted-foreground">CRUD de veículos (dados reais do Postgres).</p>
        </div>
        <Button asChild>
          <Link to="/admin/vehicles/new">Novo veículo</Link>
        </Button>
      </div>

      {q.isLoading && <div className="card-premium p-6">Carregando...</div>}
      {q.isError && <div className="card-premium p-6 text-destructive">Erro ao carregar veículos.</div>}

      {!q.isLoading && !q.isError && (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40">
                <tr className="text-left">
                  <th className="p-3">Veículo</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ano</th>
                  <th className="p-3">KM</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr key={v.id} className="border-t border-border/60">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/40 shrink-0">
                          {v.coverImageUrl ? (
                            <img src={v.coverImageUrl} alt={v.title} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{v.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{v.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{categoryLabel(v.category)}</td>
                    <td className="p-3">{v.status}</td>
                    <td className="p-3">{v.year ?? "-"}</td>
                    <td className="p-3">{formatKm(v.mileageKm) || "-"}</td>
                    <td className="p-3">{v.price ?? "-"}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/vehicles/${v.id}`}>Editar</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => archiveMut.mutate(v.id)}
                          disabled={archiveMut.isPending}
                        >
                          Arquivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="p-6 text-muted-foreground" colSpan={7}>
                      Nenhum veículo encontrado.
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

