import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, MessageCircle, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = encodeURIComponent(
      `Olá! Meu nome é ${formData.name}. ${formData.message} Meu telefone: ${formData.phone}`
    );
    
    window.open(`https://wa.me/5531997864381?text=${message}`, "_blank");
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Complete seu contato pelo WhatsApp!",
    });
    
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contato" className="py-24 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Entre em <span className="text-gradient">Contato</span>
          </h2>
          <p className="section-subtitle">
            Estamos prontos para ajudá-lo a encontrar o veículo perfeito
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="card-premium p-8">
              <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
                Envie sua mensagem
              </h3>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                    placeholder="(31) 9 9999-9999"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground outline-none transition-colors resize-none"
                    placeholder="Descreva o veículo que você procura..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-glow w-full flex items-center justify-center gap-2 py-4"
                >
                  <Send size={18} />
                  <span>Enviar Mensagem</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card-premium p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Endereço
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Av. Barão Homem de Melo, 4386
                      <br />
                      Estoril - Belo Horizonte, MG
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Telefone
                    </h4>
                    <a
                      href="tel:+5531997864381"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      (31) 9 7864-4381
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--whatsapp))]/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-[hsl(var(--whatsapp))]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      WhatsApp
                    </h4>
                    <a
                      href="https://wa.me/5531997864381"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground text-sm hover:text-[hsl(var(--whatsapp))] transition-colors"
                    >
                      Clique para conversar
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Horário
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Seg - Sáb: 9h - 18h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card-premium overflow-hidden h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240218.13127067!2d-44.04713825!3d-19.9166813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa690cacacf2c33%3A0x5b35795e3ad23997!2sBelo%20Horizonte%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1704067200000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Selection Veículos"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
