import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Eye, Gauge, Calendar, Fuel } from "lucide-react";

import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";

interface Vehicle {
  id: number;
  image: string;
  name: string;
  price: string;
  year: string;
  km: string;
  fuel: string;
  category: "todos" | "novos" | "seminovos" | "luxo";
}

const vehicles: Vehicle[] = [
  {
    id: 1,
    image: car1,
    name: "Lamborghini Urus",
    price: "R$ 2.890.000",
    year: "2024",
    km: "5.000 km",
    fuel: "Gasolina",
    category: "luxo",
  },
  {
    id: 2,
    image: car2,
    name: "Porsche 911 Turbo S",
    price: "R$ 1.650.000",
    year: "2023",
    km: "12.000 km",
    fuel: "Gasolina",
    category: "luxo",
  },
  {
    id: 3,
    image: car3,
    name: "Mercedes-AMG GT",
    price: "R$ 980.000",
    year: "2024",
    km: "3.500 km",
    fuel: "Gasolina",
    category: "novos",
  },
  {
    id: 4,
    image: car4,
    name: "Ferrari 488 GTB",
    price: "R$ 2.450.000",
    year: "2022",
    km: "18.000 km",
    fuel: "Gasolina",
    category: "luxo",
  },
  {
    id: 5,
    image: car5,
    name: "BMW M4 Competition",
    price: "R$ 720.000",
    year: "2024",
    km: "1.200 km",
    fuel: "Gasolina",
    category: "novos",
  },
  {
    id: 6,
    image: car6,
    name: "Audi RS7 Sportback",
    price: "R$ 890.000",
    year: "2023",
    km: "22.000 km",
    fuel: "Gasolina",
    category: "seminovos",
  },
];

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

  const filteredVehicles =
    activeFilter === "todos"
      ? vehicles
      : vehicles.filter((v) => v.category === activeFilter);

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
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card-premium group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    {vehicle.category === "luxo"
                      ? "Luxo"
                      : vehicle.category === "novos"
                      ? "Novo"
                      : "Seminovo"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  {vehicle.name}
                </h3>
                <p className="text-2xl font-display font-bold text-primary mb-4">
                  {vehicle.price}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-primary" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge size={14} className="text-primary" />
                    <span>{vehicle.km}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel size={14} className="text-primary" />
                    <span>{vehicle.fuel}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/5531993601885"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp flex-1 flex items-center justify-center gap-2 text-sm py-3"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                  <button className="flex-1 flex items-center justify-center gap-2 text-sm py-3 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                    <Eye size={16} />
                    <span>Detalhes</span>
                  </button>
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
