import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="font-display font-bold text-2xl text-foreground tracking-wider">
                SELECTION
              </span>
              <span className="font-display text-sm text-primary tracking-[0.3em] block">
                VEÍCULOS
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Qualidade e atendimento premium em veículos de luxo. Encontre o
              carro dos seus sonhos em Belo Horizonte, MG.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-foreground" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-foreground" />
              </a>
              <a
                href="https://wa.me/5531997864381"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[hsl(var(--whatsapp))]/20 flex items-center justify-center hover:bg-[hsl(var(--whatsapp))]/30 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} className="text-[hsl(var(--whatsapp))]" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm mt-4">
              CNPJ: 64.451.458/0001-40
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Links Rápidos
            </h4>
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("#home")}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("#sobre")}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Sobre Nós
              </button>
              <button
                onClick={() => scrollToSection("#veiculos")}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Veículos
              </button>
              <button
                onClick={() => scrollToSection("#contato")}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Contato
              </button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Contato
            </h4>
            <div className="space-y-3 text-muted-foreground">
              <p>Rua Exemplo, 123</p>
              <p>Belo Horizonte, MG</p>
              <a
                href="tel:+5531997864381"
                className="block hover:text-primary transition-colors"
              >
                (31) 9 7864-4381
              </a>
              <a
                href="https://wa.me/5531997864381"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[hsl(var(--whatsapp))] hover:opacity-80 transition-opacity"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Selection Veículos CNPJ 64.451.458/0001-40. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
