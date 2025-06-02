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
    <div class="grid grid-cols-12 gap-6">
      {/* Left Sidebar - Customer List & Real-time Monitor */}
      <div class="col-span-3 space-y-6">
        {/* Customer Selection */}
        <CustomerList 
          selectedCustomerId={selectedCustomer?.id}
        />

        {/* Real-time System Monitor */}
        {showAdvancedMode && <RealtimeUpdates />}
      </div>

      {/* Center - Recommendations */}
      <div class="col-span-6">
        {selectedCustomer ? (
          <div>
            {/* Customer Header */}
            <div class="bg-zinc-900 border border-zinc-800 p-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-zinc-100">
                    Recommendations for {selectedCustomer.name}
                  </h2>
                  <p class="text-sm text-zinc-400">
                    {selectedCustomer.segment} • {selectedCustomer.location}
                  </p>
                </div>
                
                {/* A/B Test Controls */}
                {showAdvancedMode && (
                  <div class="flex gap-2">
                    <button 
                      onClick={() => handleVariantTest("variant_a")}
                      class="px-3 py-1 text-xs bg-emerald-600 text-white rounded font-mono hover:bg-emerald-700 transition-colors"
                    >
                      Test A
                    </button>
                    <button 
                      onClick={() => handleVariantTest("variant_b")}
                      class="px-3 py-1 text-xs bg-blue-600 text-white rounded font-mono hover:bg-blue-700 transition-colors"
                    >
                      Test B
                    </button>
                    <button 
                      onClick={() => handleVariantTest("variant_c")}
                      class="px-3 py-1 text-xs bg-purple-600 text-white rounded font-mono hover:bg-purple-700 transition-colors"
                    >
                      Test C
                    </button>
                  </div>
                )}
              </div>
              
              {/* Customer Stats */}
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-lg font-light text-emerald-400">
                    {selectedCustomer.totalPurchases}
                  </div>
                  <div class="text-xs text-zinc-500 font-mono uppercase">Purchases</div>
                </div>
                <div>
                  <div class="text-lg font-light text-blue-400">
                    {selectedCustomer.avgOrderValue.toLocaleString()} kr
                  </div>
                  <div class="text-xs text-zinc-500 font-mono uppercase">Avg Order</div>
                </div>
                <div>
                  <div class={`text-lg font-light ${getBehaviorColor(selectedCustomer.behaviorScore)}`}>
                    {(selectedCustomer.behaviorScore * 100).toFixed(0)}%
                  </div>
                  <div class="text-xs text-zinc-500 font-mono uppercase">Engagement</div>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            {loading ? (
              <div class="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} class="bg-zinc-900 border border-zinc-800 p-6">
                    <div class="animate-pulse">
                      <div class="h-4 bg-zinc-700 rounded mb-2"></div>
                      <div class="h-6 bg-zinc-800 rounded mb-4"></div>
                      <div class="space-y-2">
                        <div class="h-3 bg-zinc-700 rounded"></div>
                        <div class="h-3 bg-zinc-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="grid grid-cols-2 gap-4">
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
          <div class="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h2 class="text-xl font-semibold text-zinc-300 mb-2">
              Select a Customer
            </h2>
            <p class="text-zinc-500">
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
          <div class="bg-zinc-900 border border-zinc-800 p-6">
            <h3 class="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-4">
              Analytics Preview
            </h3>
            <p class="text-sm text-zinc-500 mb-4">
              Enable Advanced Mode to access:
            </p>
            <ul class="text-xs text-zinc-600 space-y-2">
              <li>• A/B Testing Dashboard</li>
              <li>• Real-time System Monitor</li>
              <li>• Advanced ML Confidence</li>
              <li>• Algorithm Transparency</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 