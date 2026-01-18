import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminLeads() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [limit, setLimit] = useState(200);

  const q = useQuery({
    queryKey: ["admin", "leads", { limit }],
    queryFn: async () => (await api.admin.listLeads(limit)).leads,
  });

  const mut = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => api.admin.updateLeadStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      toast({ title: "Lead atualizado" });
    },
    onError: (err) => toast({ title: "Erro", description: String((err as Error)?.message || err), variant: "destructive" }),
  });

  const rows = useMemo(() => q.data || [], [q.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">Leads gerados pelos formulários do site.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <Button variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ["admin", "leads"] })}>
            Atualizar
          </Button>
        </div>
      </div>

      {q.isLoading && <div className="card-premium p-6">Carregando...</div>}
      {q.isError && <div className="card-premium p-6 text-destructive">Erro ao carregar leads.</div>}

      {!q.isLoading && !q.isError && (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40">
                <tr className="text-left">
                  <th className="p-3">Data</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Telefone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Vehicle ID</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="border-t border-border/60">
                    <td className="p-3">{l.created_at ? new Date(l.created_at).toLocaleString("pt-BR") : "-"}</td>
                    <td className="p-3">{l.name}</td>
                    <td className="p-3">{l.phone || "-"}</td>
                    <td className="p-3">{l.email || "-"}</td>
                    <td className="p-3">{l.vehicle_id ?? "-"}</td>
                    <td className="p-3">{l.source ?? "-"}</td>
                    <td className="p-3">{l.status}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <select
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                          value={l.status}
                          onChange={(e) => mut.mutate({ id: l.id, status: e.target.value })}
                          disabled={mut.isPending}
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="converted">converted</option>
                          <option value="archived">archived</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="p-6 text-muted-foreground" colSpan={8}>
                      Nenhum lead ainda.
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

