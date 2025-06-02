import type { Customer, Recommendation } from "../types.ts";

// Backend API URL för framtida integration
export const API_URL = "http://localhost:8000/api";

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Emma Andersson",
    age: 28,
    location: "Stockholm",
    totalPurchases: 12,
    avgOrderValue: 1250,
    favoriteCategories: ["Fashion", "Accessories"],
    lastActive: "2 timmar sedan",
    purchaseHistory: ["Jeans", "Tröja", "Handväska", "Sneakers"],
    behaviorScore: 0.85,
    segment: "Mode-entusiast"
  },
  {
    id: 2,
    name: "Johan Karlsson",
    age: 35,
    location: "Göteborg",
    totalPurchases: 8,
    avgOrderValue: 2100,
    favoriteCategories: ["Elektronik", "Gaming"],
    lastActive: "1 dag sedan",
    purchaseHistory: ["Laptop", "Hörlurar", "Gaming-mus", "Skärm"],
    behaviorScore: 0.72,
    segment: "Teknikintresserad"
  },
  {
    id: 3,
    name: "Lisa Nilsson",
    age: 31,
    location: "Malmö",
    totalPurchases: 15,
    avgOrderValue: 890,
    favoriteCategories: ["Skönhet", "Hudvård"],
    lastActive: "30 minuter sedan",
    purchaseHistory: ["Foundation", "Serum", "Fuktkräm", "Läppstift"],
    behaviorScore: 0.91,
    segment: "Skönhetsexpert"
  }
];

// Alla tillgängliga produkter
const allProducts = [
  {
    id: 1,
    name: "Premium Jeansjacka",
    category: "Fashion",
    price: 899,
    image: "👕",
    tags: ["denim", "casual", "trendig"]
  },
  {
    id: 2,
    name: "Läder Axelremsväska",
    category: "Accessories",
    price: 1199,
    image: "👜",
    tags: ["läder", "handväska", "elegant"]
  },
  {
    id: 3,
    name: "Trådlöst Gaming Headset",
    category: "Elektronik",
    price: 1299,
    image: "🎧",
    tags: ["gaming", "trådlös", "premium"]
  },
  {
    id: 4,
    name: "4K Gaming Skärm",
    category: "Elektronik",
    price: 3299,
    image: "🖥️",
    tags: ["gaming", "4k", "skärm"]
  },
  {
    id: 5,
    name: "Anti-Age Serum",
    category: "Skönhet",
    price: 649,
    image: "💄",
    tags: ["hudvård", "anti-age", "premium"]
  },
  {
    id: 6,
    name: "Vitamin C Ansiktsmask",
    category: "Skönhet",
    price: 299,
    image: "🧴",
    tags: ["hudvård", "vitamin-c", "mask"]
  },
  {
    id: 7,
    name: "Designer Solglasögon",
    category: "Accessories",
    price: 799,
    image: "🕶️",
    tags: ["designer", "solglasögon", "trendig"]
  },
  {
    id: 8,
    name: "Smart Fitness Tracker",
    category: "Elektronik",
    price: 1599,
    image: "⌚",
    tags: ["fitness", "smart", "hälsa"]
  }
];

export function getRecommendationsForCustomer(customerId: number): Recommendation[] {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (!customer) return [];

  // Generera personliga rekommendationer baserat på kundprofil
  const personalizedProducts = allProducts
    .map(product => {
      let score = 0.4; // Baspoäng
      
      // Öka poäng för favoritkategorier (40% vikt)
      if (customer.favoriteCategories.includes(product.category)) {
        score += 0.4;
      }
      
      // Kundbeteende påverkar (30% vikt)
      score += customer.behaviorScore * 0.3;
      
      // Slumpmässig variation för diversifiering (10% vikt)
      score += (Math.random() - 0.5) * 0.1;
      
      // Begränsa till max 1.0
      score = Math.min(score, 1.0);

      return {
        ...product,
        recommendationScore: score,
        reason: generateRecommendationReason(customer, product, score),
        algorithms: selectAlgorithms(customer, product, score)
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 4); // Visa topp 4 rekommendationer

  return personalizedProducts;
}

function generateRecommendationReason(customer: Customer, product: any, score: number): string {
  const reasons = [
    `Populär bland ${customer.segment}-kunder`,
    `Matchar ditt intresse för ${product.category}`,
    `Köps ofta av kunder i ${customer.location}`,
    `Liknar ditt senaste ${customer.purchaseHistory[0]}-köp`,
    `Trendande i din åldersgrupp (${customer.age} år)`,
    `Passar din budget (⌀ ${customer.avgOrderValue} SEK)`,
    `Hög kvalitet för ${customer.segment}`,
    `Rekommenderas för aktiva köpare`
  ];
  
  // Välj anledning baserat på kund och produkt
  if (customer.favoriteCategories.includes(product.category)) {
    return `Matchar ditt intresse för ${product.category}`;
  }
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}

function selectAlgorithms(customer: Customer, product: any, score: number): string[] {
  const algorithms = [];
  
  if (customer.favoriteCategories.includes(product.category)) {
    algorithms.push('content_based');
  }
  
  if (score > 0.7) {
    algorithms.push('collaborative_filtering');
  }
  
  if (customer.behaviorScore > 0.8) {
    algorithms.push('behavioral_analysis');
  }
  
  // Säkerställ att vi alltid har minst en algoritm
  if (algorithms.length === 0) {
    algorithms.push('hybrid_recommendation');
  }
  
  return algorithms;
}
