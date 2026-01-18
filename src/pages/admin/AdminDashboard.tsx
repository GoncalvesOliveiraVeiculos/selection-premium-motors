import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const vehiclesQ = useQuery({
    queryKey: ["admin", "vehicles", { limit: 1 }],
    queryFn: async () => (await api.admin.listVehicles({ limit: 1 })).vehicles,
  });
  const leadsQ = useQuery({
    queryKey: ["admin", "leads", { limit: 1 }],
    queryFn: async () => (await api.admin.listLeads(1)).leads,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral rápida do painel.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-premium p-5">
          <p className="text-sm text-muted-foreground">Veículos (consulta)</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {vehiclesQ.isLoading ? "Carregando..." : vehiclesQ.isError ? "Erro" : "OK"}
          </p>
          {vehiclesQ.isError && <p className="text-sm text-destructive mt-2">Falha ao consultar veículos.</p>}
        </div>

        <div className="card-premium p-5">
          <p className="text-sm text-muted-foreground">Leads (consulta)</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {leadsQ.isLoading ? "Carregando..." : leadsQ.isError ? "Erro" : "OK"}
          </p>
          {leadsQ.isError && <p className="text-sm text-destructive mt-2">Falha ao consultar leads.</p>}
        </div>
      </div>
    </div>
  );
}

