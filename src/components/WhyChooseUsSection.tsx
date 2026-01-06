import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, TrendingUp, MapPin } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Qualidade",
    description: "Veículos 100% revisados e certificados",
  },
  {
    icon: Users,
    title: "Atendimento",
    description: "Consultoria personalizada e dedicada",
  },
  {
    icon: TrendingUp,
    title: "Oportunidades",
    description: "Melhores deals do mercado automotivo",
  },
  {
    icon: MapPin,
    title: "Localização",
    description: "Belo Horizonte, MG - Fácil acesso",
  },
];

const WhyChooseUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Por Que Escolher a{" "}
            <span className="text-gradient">Selection?</span>
          </h2>
          <p className="section-subtitle">
            Somos referência em veículos premium em Belo Horizonte, oferecendo
            as melhores condições e atendimento do mercado.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="card-premium p-8 text-center h-full">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                  <reason.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
