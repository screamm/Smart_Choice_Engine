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
  mobileView?: 'customers' | 'recommendations' | 'analytics';
  selectedCustomer?: Customer | null;
  isTablet?: boolean;
}

export default function MainApp({ showAdvancedMode, mobileView = 'customers', selectedCustomer: propSelectedCustomer, isTablet = false }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(propSelectedCustomer || null);
  const [loading, setLoading] = useState(false);

  console.log("🎮 MainApp island rendering");
  console.log("📊 Layout mode:", showAdvancedMode ? "Advanced (3-col)" : "Simple (2-col)");
  console.log("📱 Mobile view:", mobileView, "Tablet:", isTablet);

  // Update selected customer when prop changes
  useEffect(() => {
    if (propSelectedCustomer) {
      setSelectedCustomer(propSelectedCustomer);
    }
  }, [propSelectedCustomer]);

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

  const handleAdvancedModeChange = (enabled: boolean) => {
    // This function is passed down from App.tsx, we might need to access it
    console.log("🔄 Advanced Mode toggle requested:", enabled);
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

  // Mobile/Tablet view rendering
  const renderMobileView = () => {
    switch (mobileView) {
      case 'customers':
        return (
          <div class={`${isTablet ? 'space-y-6' : 'space-y-4'}`}>
            <CustomerList selectedCustomerId={selectedCustomer?.id} />
            
            {/* Tablet: Show quick info about selected customer */}
            {isTablet && selectedCustomer && (
              <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <h3 class="text-lg font-medium text-zinc-100">Vald kund</h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-zinc-400">Namn</p>
                    <p class="text-base font-medium text-zinc-100">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p class="text-sm text-zinc-400">Segment</p>
                    <p class="text-base font-medium text-zinc-100">{selectedCustomer.segment}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    // Trigger view change through parent component
                    if (window.dispatchEvent) {
                      window.dispatchEvent(new CustomEvent('mobileViewChange', { detail: 'recommendations' }));
                    }
                  }}
                  class="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Visa rekommendationer →
                </button>
              </div>
            )}
          </div>
        );
      
      case 'recommendations':
        return selectedCustomer ? (
          <div class={`${isTablet ? 'space-y-6' : 'space-y-6'}`}>
            {/* Customer Header */}
            <div class={`bg-white/[0.02] border border-zinc-800/50 rounded-xl ${isTablet ? 'p-6' : 'p-4'}`}>
              <div class="flex items-center justify-between mb-4">
                <div class="flex-1">
                  <h2 class={`${isTablet ? 'text-2xl' : 'text-xl'} font-semibold text-zinc-100`}>
                    {selectedCustomer.name}
                  </h2>
                  <p class={`text-zinc-400 ${isTablet ? 'text-base' : 'text-sm'}`}>
                    {selectedCustomer.segment} • {selectedCustomer.location}
                  </p>
                </div>
                
                {/* Back button for mobile */}
                {!isTablet && (
                  <button 
                    onClick={() => {
                      if (window.dispatchEvent) {
                        window.dispatchEvent(new CustomEvent('mobileViewChange', { detail: 'customers' }));
                      }
                    }}
                    class="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 border border-zinc-700 rounded-lg"
                  >
                    ← Tillbaka
                  </button>
                )}
              </div>
              
              {/* Customer Stats */}
              <div class={`grid grid-cols-3 ${isTablet ? 'gap-6' : 'gap-4'} text-center`}>
                <div>
                  <div class={`${isTablet ? 'text-xl' : 'text-lg'} font-light text-emerald-400 mb-1`}>
                    {selectedCustomer.totalPurchases}
                  </div>
                  <div class={`${isTablet ? 'text-sm' : 'text-xs'} text-zinc-500 font-medium`}>
                    Köp
                  </div>
                </div>
                <div>
                  <div class={`${isTablet ? 'text-xl' : 'text-lg'} font-light text-blue-400 mb-1`}>
                    {selectedCustomer.avgOrderValue.toLocaleString()} kr
                  </div>
                  <div class={`${isTablet ? 'text-sm' : 'text-xs'} text-zinc-500 font-medium`}>
                    Snitt
                  </div>
                </div>
                <div>
                  <div class={`${isTablet ? 'text-xl' : 'text-lg'} font-light mb-1 ${getBehaviorColor(selectedCustomer.behaviorScore)}`}>
                    {(selectedCustomer.behaviorScore * 100).toFixed(0)}%
                  </div>
                  <div class={`${isTablet ? 'text-sm' : 'text-xs'} text-zinc-500 font-medium`}>
                    Engagemang
                  </div>
                </div>
              </div>

              {/* Tablet: A/B Test Controls */}
              {isTablet && showAdvancedMode && (
                <div class="mt-6 pt-6 border-t border-zinc-800/50">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-zinc-300">A/B Test Varianter</span>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      onClick={() => handleVariantTest("variant_a")}
                      class="flex-1 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Test A
                    </button>
                    <button 
                      onClick={() => handleVariantTest("variant_b")}
                      class="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Test B
                    </button>
                    <button 
                      onClick={() => handleVariantTest("variant_c")}
                      class="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Test C
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {loading ? (
              <div class={`${isTablet ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-4">
                    <div class="animate-pulse">
                      <div class="h-4 bg-zinc-800/50 rounded mb-3"></div>
                      <div class="h-6 bg-zinc-800/30 rounded mb-4"></div>
                      <div class="h-3 bg-zinc-800/30 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class={`${isTablet ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
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
          <div class={`bg-white/[0.02] border border-zinc-800/50 rounded-xl ${isTablet ? 'p-12' : 'p-8'} text-center`}>
            <div class={`${isTablet ? 'text-6xl' : 'text-4xl'} mb-4 opacity-50`}>🎯</div>
            <h2 class={`${isTablet ? 'text-xl' : 'text-lg'} font-semibold text-zinc-300 mb-2`}>
              Välj en kund först
            </h2>
            <p class={`text-zinc-500 ${isTablet ? 'text-base' : 'text-sm'} mb-6`}>
              Gå till Kunder-fliken för att välja en kund och se personaliserade rekommendationer
            </p>
            <button 
              onClick={() => {
                if (window.dispatchEvent) {
                  window.dispatchEvent(new CustomEvent('mobileViewChange', { detail: 'customers' }));
                }
              }}
              class={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors ${isTablet ? 'text-base' : 'text-sm'}`}
            >
              Välj kund →
            </button>
          </div>
        );
      
      case 'analytics':
        return showAdvancedMode ? (
          <div class={`${isTablet ? 'space-y-6' : 'space-y-4'}`}>
            {/* Tablet: Show analytics in a more organized way */}
            {isTablet ? (
              <>
                <div class="grid grid-cols-1 gap-6">
                  <ABTestDashboard />
                </div>
                <div class="grid grid-cols-1 gap-6">
                  <RealtimeUpdates />
                </div>
              </>
            ) : (
              <>
                <ABTestDashboard />
                <RealtimeUpdates />
              </>
            )}
          </div>
        ) : (
          <div class={`bg-white/[0.02] border border-zinc-800/50 rounded-xl ${isTablet ? 'p-12' : 'p-8'} text-center`}>
            <div class={`${isTablet ? 'text-6xl' : 'text-4xl'} mb-4 opacity-50`}>📊</div>
            <h2 class={`${isTablet ? 'text-xl' : 'text-lg'} font-semibold text-zinc-300 mb-2`}>
              Analys inte tillgänglig
            </h2>
            <p class={`text-zinc-500 ${isTablet ? 'text-base' : 'text-sm'} mb-6`}>
              Aktivera Advanced Mode för att se A/B tester och realtidsanalys
            </p>
            <button 
              onClick={() => {
                if (window.dispatchEvent) {
                  window.dispatchEvent(new CustomEvent('advancedModeChange', { detail: true }));
                }
              }}
              class={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors ${isTablet ? 'text-base' : 'text-sm'}`}
            >
              Aktivera Advanced Mode →
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile/Tablet Layout */}
      <div class="lg:hidden">
        {renderMobileView()}
      </div>

      {/* Desktop Layout */}
      <div class={`hidden lg:grid gap-8 transition-all duration-300 ${showAdvancedMode ? 'grid-cols-12' : 'grid-cols-4'}`}>
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
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
      </div>
    </>
  );
} 