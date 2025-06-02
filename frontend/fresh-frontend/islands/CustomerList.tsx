import { useEffect, useState } from "preact/hooks";

interface Customer {
  id: number;
  name: string;
  segment: string;
  location: string;
  totalPurchases: number;
  avgOrderValue: number;
  behaviorScore: number;
}

interface Props {
  selectedCustomerId?: number;
}

// Declare global callback
declare global {
  interface Window {
    handleCustomerSelect?: (customer: Customer) => void;
  }
}

export default function CustomerList({ selectedCustomerId }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("🏃 CustomerList island rendering");

  const fetchCustomers = async () => {
    console.log("🔍 Fetching customers from API...");
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8000/api/customers");
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("📦 Response data:", result);
      
      if (result.success && result.data) {
        setCustomers(result.data);
        console.log("✅ Customers loaded:", result.data.length);
      } else {
        throw new Error("API response not successful");
      }
    } catch (error) {
      console.error("🚨 Error fetching customers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 CustomerList useEffect running");
    fetchCustomers();
  }, []);

  const handleCustomerClick = (customer: Customer) => {
    console.log("🎯 Customer clicked:", customer.name);
    
    // Try multiple approaches
    if (window.handleCustomerSelect) {
      console.log("✅ Using global callback");
      window.handleCustomerSelect(customer);
    } else {
      console.log("📡 Using custom event");
      window.dispatchEvent(new CustomEvent('customerSelected', { 
        detail: customer 
      }));
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "Fashion Enthusiast": return { 
        text: "text-pink-300", 
        bg: "bg-pink-500/10", 
        border: "border-pink-500/20",
        dot: "bg-pink-400"
      };
      case "Tech Professional": return { 
        text: "text-blue-300", 
        bg: "bg-blue-500/10", 
        border: "border-blue-500/20",
        dot: "bg-blue-400"
      };
      case "Beauty Expert": return { 
        text: "text-purple-300", 
        bg: "bg-purple-500/10", 
        border: "border-purple-500/20",
        dot: "bg-purple-400"
      };
      default: return { 
        text: "text-zinc-300", 
        bg: "bg-zinc-500/10", 
        border: "border-zinc-500/20",
        dot: "bg-zinc-400"
      };
    }
  };

  const getBehaviorColor = (score: number) => {
    if (score >= 0.8) return "text-emerald-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-zinc-100">
            Customers
          </h2>
          <p class="text-sm text-zinc-400 mt-1">
            {customers.length} available
          </p>
        </div>
        <button 
          onClick={() => fetchCustomers()}
          class="px-3 py-2 text-sm bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 rounded-lg font-medium transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      
      <div class="space-y-3">
        {error ? (
          <div class="p-4 border border-red-500/20 bg-red-500/10 rounded-lg text-center">
            <div class="text-red-400 text-sm font-medium">Error loading customers</div>
            <div class="text-red-500/80 text-xs mt-1">{error}</div>
          </div>
        ) : loading ? (
          <div class="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} class="p-4 border border-zinc-800/50 rounded-lg">
                <div class="animate-pulse">
                  <div class="h-4 bg-zinc-800/50 rounded mb-2"></div>
                  <div class="h-3 bg-zinc-800/30 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div class="p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg text-center">
            <div class="text-yellow-400 text-sm font-medium">No customers found</div>
            <div class="text-yellow-500/80 text-xs mt-1">API returned empty data</div>
          </div>
        ) : (
          customers.map(customer => {
            const segmentStyle = getSegmentColor(customer.segment);
            const isSelected = selectedCustomerId === customer.id;
            
            return (
              <div
                key={customer.id}
                onClick={() => handleCustomerClick(customer)}
                class={`group p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-emerald-400/50 bg-emerald-400/5 shadow-lg shadow-emerald-500/10' 
                    : 'border-zinc-800/50 hover:border-zinc-700/70 hover:bg-white/[0.02]'
                }`}
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class={`w-10 h-10 ${segmentStyle.bg} ${segmentStyle.border} border rounded-full flex items-center justify-center`}>
                      <div class={`w-2 h-2 ${segmentStyle.dot} rounded-full`}></div>
                    </div>
                    <div>
                      <h3 class="font-medium text-zinc-100 group-hover:text-white transition-colors">
                        {customer.name}
                      </h3>
                      <p class="text-sm text-zinc-400">
                        {customer.location}
                      </p>
                    </div>
                  </div>
                  
                  <div class={`px-2 py-1 ${segmentStyle.bg} ${segmentStyle.border} border rounded-md`}>
                    <span class={`text-xs font-medium ${segmentStyle.text}`}>
                      {customer.segment.split(' ')[0]}
                    </span>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div class="text-sm font-semibold text-zinc-300">
                      {customer.totalPurchases}
                    </div>
                    <div class="text-xs text-zinc-500">Purchases</div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-zinc-300">
                      {(customer.avgOrderValue / 1000).toFixed(1)}k
                    </div>
                    <div class="text-xs text-zinc-500">Avg Order</div>
                  </div>
                  <div>
                    <div class={`text-sm font-semibold ${getBehaviorColor(customer.behaviorScore)}`}>
                      {(customer.behaviorScore * 100).toFixed(0)}%
                    </div>
                    <div class="text-xs text-zinc-500">Engagement</div>
                  </div>
                </div>

                {isSelected && (
                  <div class="mt-3 pt-3 border-t border-emerald-400/20">
                    <div class="flex items-center gap-2 text-xs text-emerald-400">
                      <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span>Selected for recommendations</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 