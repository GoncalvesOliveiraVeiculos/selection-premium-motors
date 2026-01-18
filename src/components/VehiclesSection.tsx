import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Eye, Gauge, Calendar, Fuel } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { categoryLabel, formatKm } from "@/lib/format";

const filters = [
  { id: "todos", label: "Todos" },
  { id: "novos", label: "Novos" },
  { id: "seminovos", label: "Seminovos" },
  { id: "luxo", label: "Luxo" },
];

const VehiclesSection = () => {
  const [activeFilter, setActiveFilter] = useState("todos");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const q = useQuery({
    queryKey: ["vehicles", { category: activeFilter }],
    queryFn: async () =>
      (
        await api.listVehicles({
          category: activeFilter === "todos" ? undefined : activeFilter,
          limit: 60,
        })
      ).vehicles,
  });
  const vehicles = q.data || [];

  return (
    <section id="veiculos" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Nossos <span className="text-gradient">Veículos</span>
          </h2>
          <p className="section-subtitle">
            Descubra nossa seleção exclusiva de veículos premium. Cada carro é
            escolhido a dedo para garantir excelência e qualidade.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/20"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Vehicles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {q.isLoading && (
            <div className="card-premium p-6 text-muted-foreground">Carregando veículos...</div>
          )}
          {q.isError && (
            <div className="card-premium p-6 text-destructive">Erro ao carregar veículos.</div>
          )}
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card-premium group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {vehicle.coverImageUrl ? (
                  <img
                    src={vehicle.coverImageUrl}
                    alt={vehicle.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    {categoryLabel(vehicle.category)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  {vehicle.title}
                </h3>
                <p className="text-2xl font-display font-bold text-primary mb-4">
                  {vehicle.price ?? ""}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-primary" />
                    <span>{vehicle.year ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge size={14} className="text-primary" />
                    <span>{formatKm(vehicle.mileageKm) || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel size={14} className="text-primary" />
                    <span>{vehicle.fuel ?? "-"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/5531993601885?text=${encodeURIComponent(`Olá! Tenho interesse no ${vehicle.title} (${vehicle.year ?? ""}) - ${vehicle.price ?? ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp flex-1 flex items-center justify-center gap-2 text-sm py-3"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                  <Link
                    to={`/veiculo/${vehicle.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 text-sm py-3 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Eye size={16} />
                    <span>Detalhes</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Não encontrou o que procura?
          </p>
          <a
            href="https://wa.me/5531993601885"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-glow inline-flex items-center gap-2"
          >
            <MessageCircle size={18} />
            <span>Fale conosco pelo WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default VehiclesSection;
