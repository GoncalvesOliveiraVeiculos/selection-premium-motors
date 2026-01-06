import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  Car,
  Cog,
  Palette,
  Users,
  CreditCard,
  MessageCircle,
  Check,
  Share2,
} from "lucide-react";
import { getVehicleBySlug, vehicles } from "@/data/vehicles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import VehicleGallery from "@/components/VehicleGallery";
import FinancingSimulator from "@/components/FinancingSimulator";
import InterestForm from "@/components/InterestForm";

const VehicleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const vehicle = getVehicleBySlug(slug || "");

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Veículo não encontrado
            </h1>
            <p className="text-muted-foreground mb-8">
              O veículo que você procura não está disponível.
            </p>
            <Link
              to="/#veiculos"
              className="btn-primary-glow inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span>Voltar aos Veículos</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = window.location.href;
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no ${vehicle.name} (${vehicle.year}) - ${vehicle.price}. Gostaria de mais informações!`
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} | Selection Veículos`,
          text: `Confira esse ${vehicle.name} (${vehicle.year}) por ${vehicle.price}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/#veiculos"
              className="hover:text-primary transition-colors"
            >
              Veículos
            </Link>
            <span>/</span>
            <span className="text-foreground">{vehicle.name}</span>
          </motion.div>

          {/* Back Button & Actions */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link
              to="/#veiculos"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 size={20} />
              <span className="hidden md:inline">Compartilhar</span>
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VehicleGallery
                  images={vehicle.gallery}
                  vehicleName={vehicle.name}
                />
              </motion.div>

              {/* Vehicle Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-premium p-6 md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase mb-3 inline-block">
                      {vehicle.category === "luxo"
                        ? "Luxo"
                        : vehicle.category === "novos"
                        ? "Novo"
                        : "Seminovo"}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                      {vehicle.name}
                    </h1>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">A partir de</p>
                    <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                      {vehicle.price}
                    </p>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ano</p>
                      <p className="font-semibold text-foreground">
                        {vehicle.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                    <Gauge className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">KM</p>
                      <p className="font-semibold text-foreground">
                        {vehicle.km}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                    <Fuel className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Combustível</p>
                      <p className="font-semibold text-foreground">
                        {vehicle.fuel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Motor</p>
                      <p className="font-semibold text-foreground text-sm">
                        {vehicle.specs.motor.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">
                    Sobre o Veículo
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>

                {/* Detailed Specs */}
                <div className="mb-8">
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">
                    Especificações Técnicas
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Cog className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Motor</p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.motor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Gauge className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Potência</p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.potencia}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Cog className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Transmissão
                        </p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.transmissao}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Car className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tração</p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.tracao}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Palette className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cor</p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.cor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Lugares</p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.lugares} lugares
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <Car className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Portas</p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.portas} portas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Final Placa
                        </p>
                        <p className="font-medium text-foreground">
                          {vehicle.specs.final_placa}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">
                    Equipamentos e Opcionais
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium p-6 sticky top-28"
              >
                <p className="text-3xl font-display font-bold text-primary mb-4">
                  {vehicle.price}
                </p>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/5531993601885?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full flex items-center justify-center gap-2 py-4"
                  >
                    <MessageCircle size={20} />
                    <span>Falar no WhatsApp</span>
                  </a>
                  <a
                    href="tel:+5531993601885"
                    className="w-full flex items-center justify-center gap-2 py-4 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition-colors font-medium"
                  >
                    <span>Ligar: (31) 9 9360-1885</span>
                  </a>
                </div>
              </motion.div>

              {/* Financing Simulator */}
              <FinancingSimulator
                vehiclePrice={vehicle.priceNumber}
                vehicleName={vehicle.name}
              />

              {/* Interest Form */}
              <InterestForm vehicleName={vehicle.name} />
            </div>
          </div>

          {/* Related Vehicles */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              Outros Veículos que Você Pode Gostar
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {vehicles
                .filter((v) => v.id !== vehicle.id)
                .slice(0, 3)
                .map((v) => (
                  <Link
                    key={v.id}
                    to={`/veiculo/${v.slug}`}
                    className="card-premium group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {v.name}
                      </h3>
                      <p className="text-xl font-bold text-primary mt-1">
                        {v.price}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {v.year} • {v.km}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default VehicleDetail;
