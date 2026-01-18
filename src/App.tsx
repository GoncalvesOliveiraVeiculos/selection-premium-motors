import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import VehicleDetail from "./pages/VehicleDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminVehicleEdit from "./pages/admin/AdminVehicleEdit";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminTestimonialEdit from "./pages/admin/AdminTestimonialEdit";
import { getAdminApiKey } from "./lib/admin-key";

const queryClient = new QueryClient();

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const key = getAdminApiKey();
  if (!key) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/veiculo/:slug" element={<VehicleDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="vehicles/new" element={<AdminVehicleEdit mode="new" />} />
            <Route path="vehicles/:id" element={<AdminVehicleEdit mode="edit" />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="testimonials/new" element={<AdminTestimonialEdit />} />
            <Route path="testimonials/:id" element={<AdminTestimonialEdit />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
