import { useEffect, useState } from "preact/hooks";
import RecommendationCard from "../components/RecommendationCard.tsx";
import CustomerList from "./CustomerList.tsx";
import RealtimeUpdates from "./RealtimeUpdates.tsx";
import ABTestDashboard from "./ABTestDashboard.tsx";

interface Customer {
  id: number;
  name: string;
  segment: string;
  location: string;
  totalPurchases: number;
  avgOrderValue: number;
  behaviorScore: number;
}

interface Recommendation {
  productId: number;
  name: string;
  price: number;
  image: string;
  recommendationScore: number;
  confidence: number;
  reason: string;
  algorithms: string[];
  variant?: string;
  scores?: {
    collaborative: number;
    content: number;
    behavioral: number;
  };
}

interface Props {
  showAdvancedMode: boolean;
}

export default function MainApp({ showAdvancedMode }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  console.log("🎮 MainApp island rendering");

  const fetchRecommendations = async (customerId: number, variant?: string) => {
    console.log("📞 Fetching recommendations for customer:", customerId, variant ? `(variant: ${variant})` : "");
    setLoading(true);
    
    try {
      const url = variant 
        ? `http://localhost:8000/api/recommendations/${customerId}?variant=${variant}`
        : `http://localhost:8000/api/recommendations/${customerId}`;
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.data);
        console.log("✅ Recommendations loaded:", result.data.length);
      }
    } catch (error) {
      console.error("🚨 Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    console.log("👤 Customer selected in MainApp:", customer.name);
    setSelectedCustomer(customer);
    fetchRecommendations(customer.id);
  };

  const handleVariantTest = (variant: string) => {
    if (selectedCustomer) {
      console.log("🧪 Testing variant:", variant);
      fetchRecommendations(selectedCustomer.id, variant);
    }
  };

  const getBehaviorColor = (score: number) => {
    if (score >= 0.8) return "text-emerald-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  // Set up customer selection handlers
  useEffect(() => {
    console.log("🔧 MainApp: Setting up customer selection handlers...");
    
    // Set global callback
    window.handleCustomerSelect = handleCustomerSelect;
    console.log("✅ Global callback set:", typeof window.handleCustomerSelect);
    
    const handleCustomerSelected = (event: any) => {
      console.log("📡 Custom event received in MainApp:", event.detail);
      if (event.detail) {
        handleCustomerSelect(event.detail);
      }
    };

    window.addEventListener('customerSelected', handleCustomerSelected);
    console.log("🎧 Event listener added for 'customerSelected'");
    
    return () => {
      console.log("🧹 Cleaning up MainApp event listeners...");
      window.removeEventListener('customerSelected', handleCustomerSelected);
      delete window.handleCustomerSelect;
    };
  }, []);

  return (
    <div class="grid grid-cols-12 gap-8">
      {/* Left Sidebar - Customer List & Real-time Monitor */}
      <div class="col-span-3 space-y-8">
        <CustomerList 
          selectedCustomerId={selectedCustomer?.id}
        />

        {showAdvancedMode && <RealtimeUpdates />}
      </div>

      {/* Center - Recommendations */}
      <div class="col-span-6">
        {selectedCustomer ? (
          <div class="space-y-6">
            {/* Customer Header */}
            <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-semibold text-zinc-100">
                    Recommendations for {selectedCustomer.name}
                  </h2>
                  <p class="text-zinc-400 mt-1">
                    {selectedCustomer.segment} • {selectedCustomer.location}
                  </p>
                </div>
                
                {/* A/B Test Controls */}
                {showAdvancedMode && (
                  <div class="flex gap-2">
                    <button 
                      onClick={() => handleVariantTest("variant_a")}
                      class="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Test A
                    </button>
                    <button 
                      onClick={() => handleVariantTest("variant_b")}
                      class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Test B
                    </button>
                    <button 
                      onClick={() => handleVariantTest("variant_c")}
                      class="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Test C
                    </button>
                  </div>
                )}
              </div>
              
              {/* Customer Stats */}
              <div class="grid grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="text-2xl font-light text-emerald-400 mb-1">
                    {selectedCustomer.totalPurchases}
                  </div>
                  <div class="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                    Purchases
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-light text-blue-400 mb-1">
                    {selectedCustomer.avgOrderValue.toLocaleString()} kr
                  </div>
                  <div class="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                    Avg Order
                  </div>
                </div>
                <div class="text-center">
                  <div class={`text-2xl font-light mb-1 ${getBehaviorColor(selectedCustomer.behaviorScore)}`}>
                    {(selectedCustomer.behaviorScore * 100).toFixed(0)}%
                  </div>
                  <div class="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                    Engagement
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            {loading ? (
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
                    <div class="animate-pulse">
                      <div class="h-6 bg-zinc-800/50 rounded mb-3"></div>
                      <div class="h-8 bg-zinc-800/30 rounded mb-4"></div>
                      <div class="space-y-2">
                        <div class="h-4 bg-zinc-800/30 rounded"></div>
                        <div class="h-4 bg-zinc-800/30 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map(recommendation => (
                  <RecommendationCard 
                    key={recommendation.productId} 
                    recommendation={recommendation}
                    onSelect={(productId) => console.log(`Selected product ${productId}`)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-12 text-center">
            <div class="text-6xl mb-6 opacity-50">🎯</div>
            <h2 class="text-2xl font-semibold text-zinc-300 mb-3">
              Select a Customer
            </h2>
            <p class="text-zinc-500 text-lg leading-relaxed max-w-md mx-auto">
              Välj en kund från listan för att se personaliserade rekommendationer
            </p>
          </div>
        )}
      </div>

      {/* Right Sidebar - A/B Testing Dashboard */}
      <div class="col-span-3">
        {showAdvancedMode ? (
          <ABTestDashboard />
        ) : (
          <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-zinc-100 mb-4">
              Analytics Preview
            </h3>
            <p class="text-zinc-400 mb-6 leading-relaxed">
              Enable Advanced Mode to access enterprise features:
            </p>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm text-zinc-500">
                <div class="w-2 h-2 bg-emerald-400/50 rounded-full"></div>
                <span>A/B Testing Dashboard</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-zinc-500">
                <div class="w-2 h-2 bg-blue-400/50 rounded-full"></div>
                <span>Real-time System Monitor</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-zinc-500">
                <div class="w-2 h-2 bg-purple-400/50 rounded-full"></div>
                <span>Advanced ML Confidence</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-zinc-500">
                <div class="w-2 h-2 bg-yellow-400/50 rounded-full"></div>
                <span>Algorithm Transparency</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 