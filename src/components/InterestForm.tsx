import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface InterestFormProps {
  vehicleId: number;
  vehicleName: string;
}

const InterestForm = ({ vehicleId, vehicleName }: InterestFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: `Olá! Tenho interesse no ${vehicleName}. Gostaria de mais informações.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createLead({
        vehicleId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        source: "vehicle_interest_form",
      });

      toast({
        title: "Interesse registrado!",
        description: "Enviamos seus dados. Você pode continuar pelo WhatsApp se quiser.",
      });

      const whatsappMessage = encodeURIComponent(
        `*Formulário de Interesse*\n\n` +
          `*Veículo:* ${vehicleName}\n` +
          `*Nome:* ${formData.name}\n` +
          `*Telefone:* ${formData.phone}\n` +
          `*E-mail:* ${formData.email}\n\n` +
          `*Mensagem:*\n${formData.message}`
      );
      window.open(`https://wa.me/5531993601885?text=${whatsappMessage}`, "_blank");

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: `Olá! Tenho interesse no ${vehicleName}. Gostaria de mais informações.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description: String((err as Error)?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-premium p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Tenho Interesse
          </h3>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para entrarmos em contato
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-secondary border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="tel"
            name="phone"
            placeholder="(00) 0 0000-0000"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-secondary border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-secondary border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Sua mensagem..."
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-secondary border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-glow w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          <span>{isSubmitting ? "Enviando..." : "Enviar Interesse"}</span>
        </button>
      </form>
    </motion.div>
  );
};

export default InterestForm;
