// main.ts - Deno Backend Server för Smart Choice Engine
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const router = new Router();
const app = new Application();

// WebSocket connections storage
const websocketClients = new Set<WebSocket>();

// A/B Testing Framework
interface ABTestVariant {
  id: string;
  name: string;
  weights: {
    collaborative: number;
    content: number;
    behavioral: number;
  };
  description: string;
}

const abTestVariants: ABTestVariant[] = [
  {
    id: "variant_a",
    name: "Collaborative Focus",
    weights: { collaborative: 0.6, content: 0.25, behavioral: 0.15 },
    description: "Emphasizes user similarity patterns"
  },
  {
    id: "variant_b", 
    name: "Content Focus",
    weights: { collaborative: 0.25, content: 0.6, behavioral: 0.15 },
    description: "Emphasizes product category matching"
  },
  {
    id: "variant_c",
    name: "Behavioral Focus", 
    weights: { collaborative: 0.25, content: 0.25, behavioral: 0.5 },
    description: "Emphasizes customer behavior patterns"
  }
];

// A/B Test tracking
interface ABTestResult {
  customerId: number;
  variant: string;
  timestamp: string;
  recommendations: any[];
  interactions?: {
    clicks: number;
    conversions: number;
    timeSpent: number;
  };
}

let abTestResults: ABTestResult[] = [];
let systemMetrics = {
  totalRecommendations: 0,
  activeUsers: 0,
  averageConfidence: 0,
  topPerformingVariant: "variant_a"
};

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

// WebSocket upgrade middleware
app.use(async (ctx, next) => {
  if (ctx.request.headers.get("upgrade") === "websocket") {
    const ws = ctx.upgrade();
    
    websocketClients.add(ws);
    console.log(`🔌 WebSocket client connected. Total: ${websocketClients.size}`);
    
    // Send initial system metrics after a short delay to ensure connection is ready
    setTimeout(() => {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "system_metrics",
            data: systemMetrics
          }));
        }
      } catch (error) {
        console.error("Error sending initial metrics:", error);
      }
    }, 100);
    
    ws.onclose = () => {
      websocketClients.delete(ws);
      console.log(`❌ WebSocket client disconnected. Total: ${websocketClients.size}`);
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      websocketClients.delete(ws);
    };
    
    return;
  }
  await next();
});

// Broadcast function for real-time updates
function broadcastToClients(data: any) {
  const message = JSON.stringify(data);
  websocketClients.forEach(ws => {
    try {
      // Only send if WebSocket is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      } else {
        // Remove closed connections
        websocketClients.delete(ws);
      }
    } catch (error) {
      console.error("Error sending to WebSocket client:", error);
      websocketClients.delete(ws);
    }
  });
}

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
    rating: 4.5,
    popularity: 0.78
  },
  {
    id: 2,
    name: "Trådlöst Gaming Headset",
    category: "Electronics",
    price: 1299,
    description: "Professionellt gaming headset med surround sound",
    image: "🎧", 
    inStock: true,
    rating: 4.7,
    popularity: 0.84
  },
  {
    id: 3,
    name: "Anti-Age Serum",
    category: "Beauty",
    price: 449,
    description: "Avancerat anti-age serum med retinol",
    image: "🧴",
    inStock: true,
    rating: 4.3,
    popularity: 0.69
  },
  {
    id: 4,
    name: "Läder Axelremsväska",
    category: "Accessories",
    price: 1599,
    description: "Handgjord läderväska i italienskt läder",
    image: "👜",
    inStock: true,
    rating: 4.6,
    popularity: 0.73
  },
  {
    id: 5,
    name: "4K Gaming Skärm",
    category: "Electronics", 
    price: 3299,
    description: "27-tums 4K gaming monitor med 144Hz",
    image: "🖥️",
    inStock: false,
    rating: 4.8,
    popularity: 0.81
  },
  {
    id: 6,
    name: "Vitamin C Ansiktsmask",
    category: "Beauty",
    price: 199,
    description: "Uppljusande ansiktsmask med vitamin C",
    image: "✨",
    inStock: true,
    rating: 4.1,
    popularity: 0.65
  },
  {
    id: 7,
    name: "Smartwatch Pro",
    category: "Electronics",
    price: 2499,
    description: "Avancerad smartwatch med fitness tracking",
    image: "⌚",
    inStock: true,
    rating: 4.4,
    popularity: 0.76
  },
  {
    id: 8,
    name: "Designer Solglasögon",
    category: "Fashion",
    price: 799,
    description: "Polariserade designersolglasögon",
    image: "🕶️", 
    inStock: true,
    rating: 4.2,
    popularity: 0.67
  }
];

// Advanced ML-algoritmer för rekommendationer
function generateRecommendations(customerId: number, variant?: string) {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return [];

  // Välj A/B test variant (random om inte specificerad)
  const selectedVariant = variant || abTestVariants[Math.floor(Math.random() * abTestVariants.length)].id;
  const variantConfig = abTestVariants.find(v => v.id === selectedVariant) || abTestVariants[0];

  const recommendations = products.map(product => {
    // Collaborative Filtering - hitta liknande kunder
    const collaborativeScore = calculateCollaborativeScore(customer, product);
    
    // Content-Based Filtering - matcha kategorier
    const contentScore = calculateContentScore(customer, product);
    
    // Behavioral Score - använd kundens beteendepoäng
    const behaviorScore = calculateBehaviorScore(customer, product);
    
    // Advanced confidence calculation
    const confidence = calculateAdvancedConfidence(collaborativeScore, contentScore, behaviorScore);
    
    // Kombinera scores med A/B test viktning
    const finalScore = (collaborativeScore * variantConfig.weights.collaborative) + 
                      (contentScore * variantConfig.weights.content) + 
                      (behaviorScore * variantConfig.weights.behavioral);
    
    // Lägg till slumpmässig variation för diversifiering
    const randomVariation = Math.random() * 0.05;
    const adjustedScore = Math.min(finalScore + randomVariation, 1.0);
    
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      recommendationScore: adjustedScore,
      confidence: confidence,
      reason: generateAdvancedReason(customer, product, contentScore, collaborativeScore, behaviorScore),
      algorithms: determineAlgorithms(contentScore, collaborativeScore, behaviorScore),
      variant: selectedVariant,
      scores: {
        collaborative: collaborativeScore,
        content: contentScore,
        behavioral: behaviorScore
      }
    };
  });
  
  // Sortera efter score och returnera top 4
  const topRecommendations = recommendations
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 4);

  // Spara A/B test resultat
  abTestResults.push({
    customerId,
    variant: selectedVariant,
    timestamp: new Date().toISOString(),
    recommendations: topRecommendations
  });

  // Uppdatera system metrics
  systemMetrics.totalRecommendations++;
  systemMetrics.averageConfidence = topRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / topRecommendations.length;
  
  // Broadcast real-time update
  broadcastToClients({
    type: "recommendation_generated",
    data: {
      customerId,
      variant: selectedVariant,
      count: topRecommendations.length,
      averageConfidence: systemMetrics.averageConfidence,
      timestamp: new Date().toISOString()
    }
  });

  return topRecommendations;
}

function calculateCollaborativeScore(customer: any, product: any): number {
  // Förbättrad collaborative filtering
  const similarCustomers = customers.filter(c => 
    c.id !== customer.id && 
    c.favoriteCategories.some(cat => customer.favoriteCategories.includes(cat))
  );
  
  if (similarCustomers.length === 0) return 0.3;
  
  // Viktad similarity baserat på behavior score
  const weightedSimilarity = similarCustomers.reduce((sum, simCustomer) => {
    const categoryOverlap = simCustomer.favoriteCategories.filter(cat => 
      customer.favoriteCategories.includes(cat)
    ).length;
    const maxCategories = Math.max(simCustomer.favoriteCategories.length, customer.favoriteCategories.length);
    const similarity = categoryOverlap / maxCategories;
    
    return sum + (similarity * simCustomer.behaviorScore);
  }, 0) / similarCustomers.length;
  
  return Math.min(weightedSimilarity * 1.2, 1.0);
}

function calculateContentScore(customer: any, product: any): number {
  // Förbättrad content-based filtering
  const categoryMatch = customer.favoriteCategories.includes(product.category);
  
  if (categoryMatch) {
    // Justera baserat på produktens rating, popularity och kundens köphistorik
    const ratingBonus = (product.rating - 4.0) * 0.15;
    const popularityBonus = product.popularity * 0.1;
    const historyBonus = customer.purchaseHistory.some(item => 
      item.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])
    ) ? 0.2 : 0;
    
    return Math.min(0.6 + ratingBonus + popularityBonus + historyBonus, 1.0);
  }
  
  // Partial match för relaterade kategorier
  const relatedCategories: Record<string, string[]> = {
    "Fashion": ["Accessories"],
    "Electronics": ["Gaming"],
    "Beauty": ["Skincare"]
  };
  
  const partialMatch = customer.favoriteCategories.some(favCat => 
    relatedCategories[favCat]?.includes(product.category) ||
    relatedCategories[product.category]?.includes(favCat)
  );
  
  return partialMatch ? Math.random() * 0.4 + 0.1 : Math.random() * 0.2;
}

function calculateBehaviorScore(customer: any, product: any): number {
  // Avancerad behavioral analysis
  const purchaseFrequency = Math.min(customer.totalPurchases / 20, 1.0);
  const valueScore = Math.min(customer.avgOrderValue / 2000, 1.0);
  const engagementScore = customer.behaviorScore;
  
  // Price sensitivity analysis
  const priceRatio = product.price / customer.avgOrderValue;
  const priceFit = priceRatio <= 1.2 ? 1.0 : Math.max(0.2, 1.0 - (priceRatio - 1.2) * 0.5);
  
  return (purchaseFrequency * 0.3 + valueScore * 0.2 + engagementScore * 0.3 + priceFit * 0.2);
}

function calculateAdvancedConfidence(collaborative: number, content: number, behavioral: number): number {
  // Confidence baserat på agreement mellan algoritmer
  const scores = [collaborative, content, behavioral];
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
  
  // Låg variance = hög confidence (algoritmer är överens)
  const agreement = Math.max(0.1, 1.0 - variance);
  
  // Confidence också påverkas av absolut score
  const absoluteConfidence = Math.min(average * 1.2, 1.0);
  
  return (agreement * 0.6 + absoluteConfidence * 0.4);
}

function generateAdvancedReason(customer: any, product: any, contentScore: number, collaborativeScore: number, behaviorScore: number): string {
  const dominantScore = Math.max(contentScore, collaborativeScore, behaviorScore);
  
  if (dominantScore === contentScore && contentScore > 0.7) {
    return `Perfect match för ${customer.favoriteCategories.join(' & ')}-älskare som du`;
  } else if (dominantScore === collaborativeScore && collaborativeScore > 0.6) {
    return `Populär bland ${customer.segment}-kunder med liknande smak`;
  } else if (dominantScore === behaviorScore && behaviorScore > 0.7) {
    const spendingLevel = customer.avgOrderValue > 1500 ? "premium" : "smart";
    return `Rekommenderas för ${spendingLevel} kunder med ditt köpbeteende`;
  } else if (contentScore > 0.4 && collaborativeScore > 0.4) {
    return `Trending val som matchar dina intressen`;
  } else {
    return `Upptäck något nytt baserat på din profil`;
  }
}

function determineAlgorithms(contentScore: number, collaborativeScore: number, behaviorScore: number): string[] {
  const algorithms = [];
  
  if (contentScore > 0.5) algorithms.push("CONTENT");
  if (collaborativeScore > 0.5) algorithms.push("COLLABORATIVE");  
  if (behaviorScore > 0.6) algorithms.push("BEHAVIORAL");
  
  if (algorithms.length === 0) algorithms.push("HYBRID");
  
  return algorithms;
}

// Routes
router.get("/health", (ctx) => {
  ctx.response.body = { 
    status: "healthy", 
    service: "Smart Choice Engine API",
    timestamp: new Date().toISOString(),
    websocketClients: websocketClients.size,
    systemMetrics
  };
});

router.get("/api/customers", (ctx) => {
  systemMetrics.activeUsers = Math.min(systemMetrics.activeUsers + 1, 10);
  
  // Broadcast user activity
  broadcastToClients({
    type: "user_activity",
    data: {
      action: "customers_viewed",
      activeUsers: systemMetrics.activeUsers,
      timestamp: new Date().toISOString()
    }
  });

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
  const variant = ctx.request.url.searchParams.get("variant") || undefined;
  
  const recommendations = generateRecommendations(customerId, variant);
  
  ctx.response.body = {
    success: true,
    customerId: customerId,
    data: recommendations,
    generated: new Date().toISOString(),
    variant: recommendations[0]?.variant || "unknown"
  };
});

router.get("/api/ab-test-results", (ctx) => {
  // Analysera A/B test prestanda
  const variantPerformance = abTestVariants.map(variant => {
    const variantResults = abTestResults.filter(r => r.variant === variant.id);
    const avgConfidence = variantResults.length > 0 
      ? variantResults.reduce((sum, result) => {
          const confidence = result.recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / result.recommendations.length;
          return sum + confidence;
        }, 0) / variantResults.length
      : 0;
    
    return {
      ...variant,
      testCount: variantResults.length,
      averageConfidence: avgConfidence,
      lastUsed: variantResults.length > 0 ? variantResults[variantResults.length - 1].timestamp : null
    };
  });

  ctx.response.body = {
    success: true,
    data: {
      variants: variantPerformance,
      totalTests: abTestResults.length,
      recommendedVariant: variantPerformance.sort((a, b) => b.averageConfidence - a.averageConfidence)[0]
    }
  };
});

router.get("/api/analytics", (ctx) => {
  ctx.response.body = {
    success: true,
    data: {
      ...systemMetrics,
      totalCustomers: customers.length,
      totalProducts: products.length,
      topSegments: ["Fashion Enthusiast", "Tech Professional", "Beauty Expert"],
      websocketConnections: websocketClients.size,
      abTestsRunning: abTestVariants.length
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
console.log(`🌐 WebSocket: ws://localhost:${port}/ws`);
console.log(`🧪 A/B Testing: ${abTestVariants.length} variants aktiva`);

await app.listen({ hostname, port }); 