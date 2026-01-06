import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, CheckCircle, Award, Sparkles } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: "Veículos Premium",
      description: "Seleção criteriosa dos melhores veículos do mercado",
    },
    {
      icon: CheckCircle,
      title: "Inspeção Completa",
      description: "Todos os veículos passam por rigorosa vistoria",
    },
    {
      icon: Award,
      title: "Melhor Preço",
      description: "Negociações transparentes e preços competitivos",
    },
  ];

  return (
    <section id="sobre" className="py-24 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Nosso Pilar:{" "}
            <span className="text-gradient">Qualidade e Atendimento</span>
          </h2>
          <p className="section-subtitle">
            Na Selection Veículos, priorizamos veículos de alta qualidade,
            inspecionados rigorosamente. Nosso atendimento é personalizado para
            encontrar as melhores oportunidades de negócio em Belo Horizonte e
            região.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card-premium p-8 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-12"
        >
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">
              25+
            </p>
            <p className="text-muted-foreground mt-2">Veículos Disponíveis</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">
              500+
            </p>
            <p className="text-muted-foreground mt-2">Clientes Satisfeitos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">
              10+
            </p>
            <p className="text-muted-foreground mt-2">Anos de Experiência</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
