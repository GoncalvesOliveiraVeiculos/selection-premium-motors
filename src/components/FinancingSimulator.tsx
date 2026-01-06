import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, MessageCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FinancingSimulatorProps {
  vehiclePrice: number;
  vehicleName: string;
}

const FinancingSimulator = ({ vehiclePrice, vehicleName }: FinancingSimulatorProps) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [months, setMonths] = useState(48);
  const [interestRate] = useState(1.49); // Taxa mensal

  const calculations = useMemo(() => {
    const downPayment = (vehiclePrice * downPaymentPercent) / 100;
    const financedAmount = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100;
    
    // Fórmula Price (parcela fixa)
    const monthlyPayment =
      financedAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPaid = downPayment + monthlyPayment * months;
    const totalInterest = totalPaid - vehiclePrice;

    return {
      downPayment,
      financedAmount,
      monthlyPayment,
      totalPaid,
      totalInterest,
    };
  }, [vehiclePrice, downPaymentPercent, months, interestRate]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no ${vehicleName}.\n\nSimulação de financiamento:\n- Entrada: ${formatCurrency(calculations.downPayment)} (${downPaymentPercent}%)\n- Parcelas: ${months}x de ${formatCurrency(calculations.monthlyPayment)}\n\nGostaria de mais informações!`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Simulador de Financiamento
          </h3>
          <p className="text-sm text-muted-foreground">
            Calcule suas parcelas em tempo real
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Entrada */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">
              Entrada ({downPaymentPercent}%)
            </label>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(calculations.downPayment)}
            </span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(value) => setDownPaymentPercent(value[0])}
            min={10}
            max={70}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>10%</span>
            <span>70%</span>
          </div>
        </div>

        {/* Parcelas */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">
              Prazo ({months} meses)
            </label>
            <span className="text-lg font-bold text-primary">
              {months}x
            </span>
          </div>
          <Slider
            value={[months]}
            onValueChange={(value) => setMonths(value[0])}
            min={12}
            max={72}
            step={6}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>12 meses</span>
            <span>72 meses</span>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-secondary/50 rounded-xl p-6 border border-border/50">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Parcela mensal de</p>
            <p className="text-4xl font-display font-bold text-primary">
              {formatCurrency(calculations.monthlyPayment)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valor financiado</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(calculations.financedAmount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prazo</p>
                <p className="text-sm font-semibold text-foreground">
                  {months} meses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Taxa mensal</p>
                <p className="text-sm font-semibold text-foreground">
                  {interestRate}% a.m.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total pago</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(calculations.totalPaid)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`https://wa.me/5531993601885?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full flex items-center justify-center gap-2 py-4"
        >
          <MessageCircle size={20} />
          <span>Solicitar Financiamento via WhatsApp</span>
        </a>

        <p className="text-xs text-center text-muted-foreground">
          * Simulação sujeita a análise de crédito. Taxa e condições podem variar.
        </p>
      </div>
    </motion.div>
  );
};

export default FinancingSimulator;
