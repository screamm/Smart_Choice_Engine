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
  console.log("📊 Layout mode:", showAdvancedMode ? "Advanced (3-col)" : "Simple (2-col)");

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
    <div class={`grid gap-8 transition-all duration-300 ${showAdvancedMode ? 'grid-cols-12' : 'grid-cols-4'}`}>
      {/* Left Sidebar - Customer List & Real-time Monitor */}
      <div class={`space-y-8 transition-all duration-300 ${showAdvancedMode ? 'col-span-3' : 'col-span-1'}`}>
        <CustomerList 
          selectedCustomerId={selectedCustomer?.id}
        />

        {showAdvancedMode && <RealtimeUpdates />}
        
        {/* Debug info */}
        <div class="text-xs text-zinc-600 font-mono p-2 bg-zinc-900/30 rounded">
          Mode: {showAdvancedMode ? "Advanced" : "Simple"}
        </div>
      </div>

      {/* Center - Recommendations */}
      <div class={`transition-all duration-300 ${showAdvancedMode ? 'col-span-6' : 'col-span-3'}`}>
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
      <div class={`transition-all duration-300 ${showAdvancedMode ? 'col-span-3 opacity-100' : 'col-span-0 opacity-0 w-0 overflow-hidden'}`}>
        <ABTestDashboard />
      </div>
      
      {/* Simple mode info panel - only shown when advanced mode is off */}
      {/* {!showAdvancedMode && selectedCustomer && (
        <div class="fixed bottom-6 right-6 bg-gradient-to-br from-emerald-600/90 to-blue-600/90 backdrop-blur border border-emerald-500/20 rounded-xl p-4 shadow-xl max-w-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="text-lg">🚀</span>
            </div>
            <div>
              <h3 class="font-semibold text-white">Advanced Features</h3>
              <p class="text-xs text-emerald-100">Upptäck kraftfulla verktyg</p>
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-white/90">
              <div class="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
              <span>Live A/B Testing</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-white/90">
              <div class="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              <span>Real-time Analytics</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-white/90">
              <div class="w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
              <span>Algorithm Insights</span>
            </div>
          </div>
          
          <div class="text-xs text-emerald-100 text-center">
            Aktivera <span class="font-mono font-semibold">Advanced Mode</span> för att utforska
          </div>
        </div>
      )} */}
    </div>
  );
} 