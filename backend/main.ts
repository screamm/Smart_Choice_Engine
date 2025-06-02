// main.ts - Deno Backend Server för Voyado Recommendation Engine
import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

interface Customer {
  id: number;
  name: string;
  age: number;
  location: string;
  totalPurchases: number;
  avgOrderValue: number;
  favoriteCategories: string[];
  lastActive: string;
  purchaseHistory: string[];
  behaviorScore: number;
  segment: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
  popularity: number;
}

interface Recommendation extends Product {
  recommendationScore: number;
  reason: string;
  algorithms: string[];
  confidence: number;
}

class MLRecommendationEngine {
  private customers: Customer[] = [
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

  private products: Product[] = [
    {
      id: 1,
      name: "Premium Jeansjacka",
      category: "Fashion",
      price: 899,
      image: "👕",
      tags: ["denim", "casual", "trendig"],
      popularity: 0.78
    },
    {
      id: 2,
      name: "Trådlöst Gaming Headset",
      category: "Elektronik",
      price: 1299,
      image: "🎧",
      tags: ["gaming", "trådlös", "premium"],
      popularity: 0.84
    },
    {
      id: 3,
      name: "Anti-Age Serum",
      category: "Skönhet",
      price: 649,
      image: "💄",
      tags: ["hudvård", "anti-age", "premium"],
      popularity: 0.69
    },
    {
      id: 4,
      name: "Läder Axelremsväska",
      category: "Accessories",
      price: 1199,
      image: "👜",
      tags: ["läder", "handväska", "elegant"],
      popularity: 0.73
    },
    {
      id: 5,
      name: "4K Gaming Skärm",
      category: "Elektronik",
      price: 3299,
      image: "🖥️",
      tags: ["gaming", "4k", "skärm"],
      popularity: 0.81
    },
    {
      id: 6,
      name: "Vitamin C Ansiktsmask",
      category: "Skönhet",
      price: 299,
      image: "🧴",
      tags: ["hudvård", "vitamin-c", "mask"],
      popularity: 0.65
    }
  ];

  public generateRecommendations(customerId: number, limit = 4): Recommendation[] {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return [];

    // ML-algoritm simulering
    const recommendations = this.products
      .map(product => {
        let score = 0;
        
        // Kategori-matchning (40% vikt)
        if (customer.favoriteCategories.includes(product.category)) {
          score += 0.4;
        }
        
        // Popularitet (30% vikt)
        score += product.popularity * 0.3;
        
        // Kundbeteende (30% vikt)
        score += customer.behaviorScore * 0.3;
        
        // Lägg till lite slumpmässighet för variation
        score += (Math.random() - 0.5) * 0.1;
        
        return {
          ...product,
          recommendationScore: Math.min(score, 1),
          reason: this.getRecommendationReason(customer, product, score),
          algorithms: ['collaborative_filtering', 'content_based'],
          confidence: Math.min(score, 1)
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);

    return recommendations;
  }

  private getRecommendationReason(customer: Customer, product: Product, score: number): string {
    const reasons = [
      `Populär bland ${customer.segment}-kunder`,
      `Matchar ditt intresse för ${product.category}`,
      `Köps ofta av kunder i ${customer.location}`,
      `Liknar ditt senaste ${customer.purchaseHistory[0]}-köp`,
      `Trendande i din åldersgrupp (${customer.age} år)`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  public getCustomers(): Customer[] {
    return this.customers;
  }

  public getAnalytics() {
    return {
      totalCustomers: this.customers.length,
      totalProducts: this.products.length,
      avgBehaviorScore: this.customers.reduce((sum, c) => sum + c.behaviorScore, 0) / this.customers.length,
      modelAccuracy: 0.87,
      lastModelUpdate: new Date().toISOString()
    };
  }
}

// Initiera app
const app = new Application();
const router = new Router();
const mlEngine = new MLRecommendationEngine();

// Middleware
app.use(oakCors({
  origin: ["http://localhost:8090", "http://127.0.0.1:8090"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// API Routes
router.get('/api/customers', (ctx: Context) => {
  ctx.response.body = mlEngine.getCustomers();
});

router.get('/api/recommendations/:customerId', (ctx: Context) => {
  const customerId = parseInt(ctx.params.customerId);
  const limit = parseInt(ctx.request.url.searchParams.get('limit') || '4');
  
  if (isNaN(customerId)) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Ogiltigt kund-ID' };
    return;
  }

  const recommendations = mlEngine.generateRecommendations(customerId, limit);
  ctx.response.body = {
    customerId,
    recommendations,
    generatedAt: new Date().toISOString()
  };
});

router.get('/api/analytics', (ctx: Context) => {
  ctx.response.body = mlEngine.getAnalytics();
});

// Health check
router.get('/health', (ctx: Context) => {
  ctx.response.body = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const port = 8000;
const hostname = "0.0.0.0"; // Bind till alla interfaces

console.log(`🚀 Voyado Recommendation Engine API startar på ${hostname}:${port}`);
console.log(`📊 ML Engine initierad med ${mlEngine.getCustomers().length} kunder`);
console.log(`🧠 Multi-algoritm rekommendationssystem redo`);

try {
  await app.listen({ port, hostname });
} catch (error) {
  console.error("❌ Fel vid start av server:", error);
  Deno.exit(1);
} 