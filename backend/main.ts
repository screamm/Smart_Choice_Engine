// main.ts - Deno Backend Server för Smart Choice Engine
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const router = new Router();
const app = new Application();

// CORS - Tillåt requests från Fresh frontend på port 8090
app.use(oakCors({
  origin: "http://localhost:8090",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware för logging
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// Mock data - Kunder
const customers = [
  {
    id: 1,
    name: "Emma Andersson",
    email: "emma@example.com",
    age: 28,
    location: "Stockholm",
    totalPurchases: 15,
    avgOrderValue: 1250,
    favoriteCategories: ["Fashion", "Accessories"],
    lastActive: "2024-01-15",
    purchaseHistory: ["Jeans", "Väska", "Skor"],
    behaviorScore: 0.85,
    segment: "Fashion Enthusiast"
  },
  {
    id: 2,
    name: "Johan Karlsson", 
    email: "johan@example.com",
    age: 34,
    location: "Göteborg",
    totalPurchases: 8,
    avgOrderValue: 2100,
    favoriteCategories: ["Electronics", "Gaming"],
    lastActive: "2024-01-14",
    purchaseHistory: ["Headset", "Tangentbord", "Mus"],
    behaviorScore: 0.72,
    segment: "Tech Professional"
  },
  {
    id: 3,
    name: "Lisa Nilsson",
    email: "lisa@example.com", 
    age: 31,
    location: "Malmö",
    totalPurchases: 22,
    avgOrderValue: 890,
    favoriteCategories: ["Beauty", "Skincare"],
    lastActive: "2024-01-16",
    purchaseHistory: ["Serum", "Mascara", "Foundation"],
    behaviorScore: 0.93,
    segment: "Beauty Expert"
  }
];

// Mock data - Produkter
const products = [
  {
    id: 1,
    name: "Premium Jeansjacka",
    category: "Fashion", 
    price: 899,
    description: "Vintage-inspirerad jeansjacka i premium denim",
    image: "👕",
    inStock: true,
    rating: 4.5
  },
  {
    id: 2,
    name: "Trådlöst Gaming Headset",
    category: "Electronics",
    price: 1299,
    description: "Professionellt gaming headset med surround sound",
    image: "🎧", 
    inStock: true,
    rating: 4.7
  },
  {
    id: 3,
    name: "Anti-Age Serum",
    category: "Beauty",
    price: 449,
    description: "Avancerat anti-age serum med retinol",
    image: "🧴",
    inStock: true,
    rating: 4.3
  },
  {
    id: 4,
    name: "Läder Axelremsväska",
    category: "Accessories",
    price: 1599,
    description: "Handgjord läderväska i italienskt läder",
    image: "👜",
    inStock: true,
    rating: 4.6
  },
  {
    id: 5,
    name: "4K Gaming Skärm",
    category: "Electronics", 
    price: 3299,
    description: "27-tums 4K gaming monitor med 144Hz",
    image: "🖥️",
    inStock: false,
    rating: 4.8
  },
  {
    id: 6,
    name: "Vitamin C Ansiktsmask",
    category: "Beauty",
    price: 199,
    description: "Uppljusande ansiktsmask med vitamin C",
    image: "✨",
    inStock: true,
    rating: 4.1
  },
  {
    id: 7,
    name: "Smartwatch Pro",
    category: "Electronics",
    price: 2499,
    description: "Avancerad smartwatch med fitness tracking",
    image: "⌚",
    inStock: true,
    rating: 4.4
  },
  {
    id: 8,
    name: "Designer Solglasögon",
    category: "Fashion",
    price: 799,
    description: "Polariserade designersolglasögon",
    image: "🕶️", 
    inStock: true,
    rating: 4.2
  }
];

// ML-algoritmer för rekommendationer
function generateRecommendations(customerId: number) {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return [];

  const recommendations = products.map(product => {
    // Collaborative Filtering - hitta liknande kunder
    const collaborativeScore = calculateCollaborativeScore(customer, product);
    
    // Content-Based Filtering - matcha kategorier
    const contentScore = calculateContentScore(customer, product);
    
    // Behavioral Score - använd kundens beteendepoäng
    const behaviorScore = customer.behaviorScore;
    
    // Kombinera scores med viktning
    const finalScore = (collaborativeScore * 0.4) + (contentScore * 0.4) + (behaviorScore * 0.2);
    
    // Lägg till slumpmässig variation för diversifiering
    const randomVariation = Math.random() * 0.1;
    const adjustedScore = Math.min(finalScore + randomVariation, 1.0);
    
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      recommendationScore: adjustedScore,
      reason: generateReason(customer, product, contentScore, collaborativeScore),
      algorithms: determineAlgorithms(contentScore, collaborativeScore, behaviorScore)
    };
  });
  
  // Sortera efter score och returnera top 4
  return recommendations
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 4);
}

function calculateCollaborativeScore(customer: any, product: any): number {
  // Simulera collaborative filtering genom att hitta liknande kunder
  const similarCustomers = customers.filter(c => 
    c.id !== customer.id && 
    c.favoriteCategories.some(cat => customer.favoriteCategories.includes(cat))
  );
  
  if (similarCustomers.length === 0) return 0.3;
  
  // Simulera att liknande kunder köpt produkten
  const score = similarCustomers.length / customers.length;
  return Math.min(score * 1.5, 1.0);
}

function calculateContentScore(customer: any, product: any): number {
  // Matcha produktkategori mot kundens favoritkategorier
  const categoryMatch = customer.favoriteCategories.includes(product.category);
  
  if (categoryMatch) {
    // Justera baserat på produktens rating och kundens köphistorik
    const ratingBonus = (product.rating - 4.0) * 0.1;
    return Math.min(0.7 + ratingBonus, 1.0);
  }
  
  return Math.random() * 0.4; // Låg score för icke-matchande kategorier
}

function generateReason(customer: any, product: any, contentScore: number, collaborativeScore: number): string {
  if (contentScore > collaborativeScore) {
    return `Perfect match för ${customer.favoriteCategories.join(' & ')}-älskare`;
  } else if (collaborativeScore > 0.6) {
    return `Populär bland kunder med liknande smak`;
  } else if (customer.behaviorScore > 0.8) {
    return `Rekommenderas för aktiva premium-kunder`;
  } else {
    return `Trending produkt i din demografiska grupp`;
  }
}

function determineAlgorithms(contentScore: number, collaborativeScore: number, behaviorScore: number): string[] {
  const algorithms = [];
  
  if (contentScore > 0.5) algorithms.push("CONTENT");
  if (collaborativeScore > 0.5) algorithms.push("COLLABORATIVE");  
  if (behaviorScore > 0.7) algorithms.push("BEHAVIORAL");
  
  return algorithms.length > 0 ? algorithms : ["HYBRID"];
}

// Routes
router.get("/health", (ctx) => {
  ctx.response.body = { 
    status: "healthy", 
    service: "Smart Choice Engine API",
    timestamp: new Date().toISOString() 
  };
});

router.get("/api/customers", (ctx) => {
  ctx.response.body = {
    success: true,
    data: customers.map(c => ({
      id: c.id,
      name: c.name,
      segment: c.segment,
      location: c.location,
      totalPurchases: c.totalPurchases,
      avgOrderValue: c.avgOrderValue,
      behaviorScore: c.behaviorScore
    }))
  };
});

router.get("/api/recommendations/:customerId", (ctx) => {
  const customerId = parseInt(ctx.params.customerId || "0");
  const recommendations = generateRecommendations(customerId);
  
  ctx.response.body = {
    success: true,
    customerId: customerId,
    data: recommendations,
    generated: new Date().toISOString()
  };
});

router.get("/api/analytics", (ctx) => {
  ctx.response.body = {
    success: true,
    data: {
      totalCustomers: customers.length,
      totalProducts: products.length,
      avgBehaviorScore: customers.reduce((sum, c) => sum + c.behaviorScore, 0) / customers.length,
      topSegments: ["Fashion Enthusiast", "Tech Professional", "Beauty Expert"]
    }
  };
});

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    ctx.response.status = 500;
    ctx.response.body = { 
      success: false, 
      error: "Internal server error" 
    };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const hostname = "0.0.0.0";
const port = 8000;

console.log(`🚀 Smart Choice Engine API startar på ${hostname}:${port}`);
console.log(`📊 Testdata: ${customers.length} kunder, ${products.length} produkter`);
console.log(`🔗 Health check: http://localhost:${port}/health`);

await app.listen({ hostname, port }); 