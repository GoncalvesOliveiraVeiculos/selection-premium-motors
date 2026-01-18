import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminApiKey } from "@/lib/admin-key";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  const masked = useMemo(() => (key.length > 6 ? `${key.slice(0, 3)}...${key.slice(-2)}` : key), [key]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      setAdminApiKey(key.trim());
      // Ping um endpoint admin existente (vai falhar se a chave estiver errada e ADMIN_API_KEY estiver setado no server)
      await api.admin.listVehicles({ limit: 1 });
      toast({ title: "Acesso liberado", description: `Chave salva (${masked})` });
      navigate("/admin", { replace: true });
    } catch (err) {
      setAdminApiKey("");
      toast({
        title: "Falha no login",
        description: String((err as Error)?.message || err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card-premium w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Informe a <strong>ADMIN_API_KEY</strong> para acessar.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Chave</label>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Cole a ADMIN_API_KEY aqui"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            A chave fica salva no seu navegador (localStorage).
          </p>
        </div>

        <Button type="submit" disabled={!key.trim() || loading} className="w-full">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

