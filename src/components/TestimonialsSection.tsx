import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "João S.",
    text: "Atendimento impecável! Encontrei o carro dos meus sonhos com condições incríveis. Melhor decisão da minha vida.",
    rating: 5,
    location: "Belo Horizonte, MG",
  },
  {
    id: 2,
    name: "Maria L.",
    text: "Profissionais extremamente qualificados. O processo de compra foi transparente e rápido. Recomendo a todos!",
    rating: 5,
    location: "Nova Lima, MG",
  },
  {
    id: 3,
    name: "Carlos A.",
    text: "Já comprei 3 carros na Selection. Sempre com a mesma qualidade e atenção aos detalhes. São os melhores!",
    rating: 5,
    location: "Contagem, MG",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            O Que Nossos{" "}
            <span className="text-gradient">Clientes Dizem</span>
          </h2>
          <p className="section-subtitle">
            A satisfação dos nossos clientes é nosso maior orgulho
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Testimonial Card */}
          <div className="card-premium p-8 md:p-12 text-center relative overflow-hidden">
            {/* Quote Icon */}
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-primary text-primary"
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>

            {/* Author */}
            <div>
              <p className="font-display font-semibold text-foreground text-lg">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-muted-foreground text-sm">
                {testimonials[currentIndex].location}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-muted hover:bg-primary/50"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
