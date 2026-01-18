import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminApiKey } from "@/lib/admin-key";
import { Button } from "@/components/ui/button";

function AdminNavLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Selection</p>
            <p className="font-display font-bold text-foreground">Painel Administrativo</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              clearAdminApiKey();
              navigate("/admin/login", { replace: true });
            }}
          >
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="card-premium p-4 h-fit">
          <nav className="space-y-2">
            <AdminNavLink to="/admin" label="Dashboard" />
            <AdminNavLink to="/admin/vehicles" label="Veículos" />
            <AdminNavLink to="/admin/leads" label="Leads" />
            <AdminNavLink to="/admin/testimonials" label="Depoimentos" />
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

