import { motion } from "framer-motion";
import { MessageCircle, Phone, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-car.jpg";

const HeroSection = () => {
  const scrollToVehicles = () => {
    const element = document.querySelector("#veiculos");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Showroom Selection Veículos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-foreground mb-2">
              SELECTION
            </h1>
            <p className="font-display text-xl md:text-3xl tracking-[0.5em] text-primary font-semibold">
              VEÍCULOS
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-silver-light mb-4"
          >
            Qualidade Premium em Belo Horizonte, MG
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Veículos selecionados com excelência e atendimento personalizado.
            Encontre a melhor oportunidade para você.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://wa.me/5531993601885"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex items-center gap-3 text-lg px-8 py-4 rounded-xl w-full sm:w-auto justify-center"
            >
              <MessageCircle size={22} />
              <span>Fale pelo WhatsApp</span>
            </a>
            <a
              href="tel:+5531993601885"
              className="btn-primary-glow flex items-center gap-3 text-lg px-8 py-4 rounded-xl w-full sm:w-auto justify-center border border-primary/30"
            >
              <Phone size={22} />
              <span>Ligar Agora</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={scrollToVehicles}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary animate-bounce cursor-pointer"
          aria-label="Scroll para ver veículos"
        >
          <ChevronDown size={32} />
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
