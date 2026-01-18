export function formatKm(value: number | null | undefined) {
  if (value === null || value === undefined) return "";
  return `${value.toLocaleString("pt-BR")} km`;
}

export function categoryLabel(category: string | null | undefined) {
  if (category === "luxo") return "Luxo";
  if (category === "novos") return "Novo";
  if (category === "seminovos") return "Seminovo";
  return "Veículo";
}

