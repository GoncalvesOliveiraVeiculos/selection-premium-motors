import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const q = useQuery({
    queryKey: ["testimonials", { limit: 20 }],
    queryFn: async () => (await api.listTestimonials(20)).testimonials,
  });

  const testimonials = q.data || [];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[currentIndex];

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

            {q.isLoading && <p className="text-muted-foreground">Carregando depoimentos...</p>}
            {q.isError && (
              <p className="text-destructive">Erro ao carregar depoimentos. Verifique a API.</p>
            )}
            {!q.isLoading && !q.isError && testimonials.length === 0 && (
              <p className="text-muted-foreground">Nenhum depoimento publicado ainda.</p>
            )}

            {/* Stars */}
            {current && (
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(current.rating ?? 5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
            )}

            {/* Text */}
            {current && (
              <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
                "{current.text}"
              </p>
            )}

            {/* Author */}
            {current && (
              <div>
                <p className="font-display font-semibold text-foreground text-lg">
                  {current.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {current.location ?? ""}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          {testimonials.length > 0 && (
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
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
