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

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "Fashion Enthusiast": return "text-pink-400 bg-pink-400/10";
      case "Tech Professional": return "text-blue-400 bg-blue-400/10";
      case "Beauty Expert": return "text-purple-400 bg-purple-400/10";
      default: return "text-zinc-400 bg-zinc-400/10";
    }
  };

  const getBehaviorColor = (score: number) => {
    if (score >= 0.8) return "text-emerald-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

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

  return (
    <div class="bg-zinc-900 border border-zinc-800 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-mono uppercase tracking-wider text-zinc-400">
          Select Customer ({customers.length} loaded)
        </h2>
        <button 
          onClick={() => fetchCustomers()}
          class="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded font-mono transition-colors"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      
      <div class="space-y-2">
        {error ? (
          <div class="p-3 border border-red-700 bg-red-900/20 text-center">
            <div class="text-red-400 text-sm">Error loading customers</div>
            <div class="text-red-500 text-xs mt-1">{error}</div>
          </div>
        ) : loading ? (
          <div class="p-3 border border-zinc-700 text-center">
            <div class="text-zinc-500 text-sm">Loading customers...</div>
            <div class="text-zinc-600 text-xs mt-1">
              Fetching from http://localhost:8000/api/customers
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div class="p-3 border border-yellow-700 bg-yellow-900/20 text-center">
            <div class="text-yellow-400 text-sm">No customers found</div>
            <div class="text-yellow-500 text-xs mt-1">API returned empty data</div>
          </div>
        ) : (
          customers.map(customer => (
            <div
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              class={`p-3 border cursor-pointer transition-all duration-200 ${
                selectedCustomerId === customer.id 
                  ? 'border-emerald-400 bg-emerald-400/5' 
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-zinc-200">{customer.name}</span>
                <span class={`text-xs px-2 py-1 rounded ${getSegmentColor(customer.segment)}`}>
                  {customer.segment.split(' ')[0]}
                </span>
              </div>
              
              <div class="text-xs text-zinc-500 space-y-1">
                <div class="flex justify-between">
                  <span>Purchases:</span>
                  <span>{customer.totalPurchases}</span>
                </div>
                <div class="flex justify-between">
                  <span>Avg Value:</span>
                  <span>{customer.avgOrderValue.toLocaleString()} kr</span>
                </div>
                <div class="flex justify-between">
                  <span>Behavior:</span>
                  <span class={getBehaviorColor(customer.behaviorScore)}>
                    {(customer.behaviorScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 