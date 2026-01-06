import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";

export interface Vehicle {
  id: number;
  slug: string;
  image: string;
  gallery: string[];
  name: string;
  price: string;
  priceNumber: number;
  year: string;
  km: string;
  fuel: string;
  category: "todos" | "novos" | "seminovos" | "luxo";
  specs: {
    motor: string;
    potencia: string;
    transmissao: string;
    tracao: string;
    cor: string;
    portas: string;
    lugares: string;
    final_placa: string;
  };
  features: string[];
  description: string;
}

export const vehicles: Vehicle[] = [
  {
    id: 1,
    slug: "lamborghini-urus",
    image: car1,
    gallery: [car1, car2, car3],
    name: "Lamborghini Urus",
    price: "R$ 2.890.000",
    priceNumber: 2890000,
    year: "2024",
    km: "5.000 km",
    fuel: "Gasolina",
    category: "luxo",
    specs: {
      motor: "4.0 V8 Biturbo",
      potencia: "650 cv",
      transmissao: "Automático 8 marchas",
      tracao: "Integral (AWD)",
      cor: "Preto Metálico",
      portas: "5",
      lugares: "5",
      final_placa: "3",
    },
    features: [
      "Bancos em couro Alcantara",
      "Sistema de som Bang & Olufsen",
      "Teto panorâmico",
      "Rodas 23 polegadas",
      "Freios cerâmicos carbono",
      "Suspensão pneumática",
      "Head-up display",
      "Assistente de estacionamento",
    ],
    description:
      "O Lamborghini Urus redefine o conceito de SUV esportivo. Com motor V8 biturbo de 650 cv, oferece performance incomparável combinada com o luxo italiano característico da marca.",
  },
  {
    id: 2,
    slug: "porsche-911-turbo-s",
    image: car2,
    gallery: [car2, car1, car4],
    name: "Porsche 911 Turbo S",
    price: "R$ 1.650.000",
    priceNumber: 1650000,
    year: "2023",
    km: "12.000 km",
    fuel: "Gasolina",
    category: "luxo",
    specs: {
      motor: "3.8 Boxer 6 cilindros Biturbo",
      potencia: "650 cv",
      transmissao: "PDK 8 velocidades",
      tracao: "Integral (AWD)",
      cor: "Branco Carrara",
      portas: "2",
      lugares: "4",
      final_placa: "7",
    },
    features: [
      "Sport Chrono Package",
      "PASM Sport Suspension",
      "Bancos esportivos adaptativos",
      "Sistema Burmester",
      "Rodas 20/21 polegadas",
      "PDCC Sport",
      "Escapamento esportivo",
      "Rear-axle steering",
    ],
    description:
      "O ícone da Porsche em sua versão mais potente. O 911 Turbo S combina tradição e tecnologia de ponta, entregando uma experiência de condução incomparável.",
  },
  {
    id: 3,
    slug: "mercedes-amg-gt",
    image: car3,
    gallery: [car3, car5, car6],
    name: "Mercedes-AMG GT",
    price: "R$ 980.000",
    priceNumber: 980000,
    year: "2024",
    km: "3.500 km",
    fuel: "Gasolina",
    category: "novos",
    specs: {
      motor: "4.0 V8 Biturbo",
      potencia: "585 cv",
      transmissao: "AMG Speedshift DCT 7G",
      tracao: "Traseira (RWD)",
      cor: "Cinza Selenite",
      portas: "2",
      lugares: "2",
      final_placa: "1",
    },
    features: [
      "AMG Track Pace",
      "Bancos AMG Performance",
      "Painel digital MBUX",
      "Escapamento AMG",
      "Suspensão AMG Ride Control",
      "Diferencial traseiro blocante",
      "Modo Race",
      "Launch Control",
    ],
    description:
      "Engenharia alemã em sua forma mais pura. O Mercedes-AMG GT oferece desempenho brutal com o refinamento característico da marca da estrela.",
  },
  {
    id: 4,
    slug: "ferrari-488-gtb",
    image: car4,
    gallery: [car4, car2, car1],
    name: "Ferrari 488 GTB",
    price: "R$ 2.450.000",
    priceNumber: 2450000,
    year: "2022",
    km: "18.000 km",
    fuel: "Gasolina",
    category: "luxo",
    specs: {
      motor: "3.9 V8 Biturbo",
      potencia: "670 cv",
      transmissao: "F1 DCT 7 velocidades",
      tracao: "Traseira (RWD)",
      cor: "Rosso Corsa",
      portas: "2",
      lugares: "2",
      final_placa: "5",
    },
    features: [
      "Manettino Ferrari",
      "SSC - Side Slip Control",
      "Bancos Daytona",
      "Apple CarPlay",
      "Câmeras 360°",
      "Sensor de estacionamento",
      "Levantador dianteiro",
      "Telemetria Ferrari",
    ],
    description:
      "A essência de Maranello em cada detalhe. O Ferrari 488 GTB é uma obra-prima da engenharia italiana, oferecendo emoção pura a cada curva.",
  },
  {
    id: 5,
    slug: "bmw-m4-competition",
    image: car5,
    gallery: [car5, car3, car6],
    name: "BMW M4 Competition",
    price: "R$ 720.000",
    priceNumber: 720000,
    year: "2024",
    km: "1.200 km",
    fuel: "Gasolina",
    category: "novos",
    specs: {
      motor: "3.0 6 cilindros Biturbo",
      potencia: "510 cv",
      transmissao: "M Steptronic 8 marchas",
      tracao: "Traseira (RWD)",
      cor: "Verde Isle of Man",
      portas: "2",
      lugares: "4",
      final_placa: "9",
    },
    features: [
      "M Drive Professional",
      "Bancos M Carbon",
      "Head-up Display",
      "Harman Kardon",
      "Rodas 19/20 forjadas",
      "Freios M Compound",
      "M Traction Control",
      "Driving Assistant Pro",
    ],
    description:
      "Performance bávara sem compromissos. O BMW M4 Competition entrega adrenalina pura com tecnologia de ponta e acabamento impecável.",
  },
  {
    id: 6,
    slug: "audi-rs7-sportback",
    image: car6,
    gallery: [car6, car4, car5],
    name: "Audi RS7 Sportback",
    price: "R$ 890.000",
    priceNumber: 890000,
    year: "2023",
    km: "22.000 km",
    fuel: "Gasolina",
    category: "seminovos",
    specs: {
      motor: "4.0 V8 TFSI Biturbo",
      potencia: "600 cv",
      transmissao: "Tiptronic 8 velocidades",
      tracao: "Integral quattro",
      cor: "Azul Navarra",
      portas: "5",
      lugares: "5",
      final_placa: "2",
    },
    features: [
      "Audi Virtual Cockpit Plus",
      "Matrix LED",
      "Bang & Olufsen 3D",
      "Teto solar panorâmico",
      "Suspensão adaptativa RS",
      "Diferencial esportivo",
      "Pacote RS Design",
      "Assistente de condução",
    ],
    description:
      "Elegância e brutalidade em perfeita harmonia. O Audi RS7 Sportback combina design arrebatador com a potência de um autêntico supercarro.",
  },
];

export const getVehicleBySlug = (slug: string): Vehicle | undefined => {
  return vehicles.find((v) => v.slug === slug);
};
