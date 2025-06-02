import { useEffect, useState } from "preact/hooks";

interface ABVariant {
  id: string;
  name: string;
  weights: {
    collaborative: number;
    content: number;
    behavioral: number;
  };
  description: string;
  testCount: number;
  averageConfidence: number;
  lastUsed: string | null;
}

interface ABTestData {
  variants: ABVariant[];
  totalTests: number;
  recommendedVariant: ABVariant;
}

export default function ABTestDashboard() {
  const [testData, setTestData] = useState<ABTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const fetchABTestResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ab-test-results");
      const result = await response.json();
      
      if (result.success) {
        setTestData(result.data);
        setLastRefresh(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching A/B test results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchABTestResults();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchABTestResults, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getVariantColor = (variantId: string) => {
    switch (variantId) {
      case "variant_a": return "emerald";
      case "variant_b": return "blue";
      case "variant_c": return "purple";
      default: return "zinc";
    }
  };

  const getPerformanceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { level: "Excellent", color: "text-emerald-400" };
    if (confidence >= 0.6) return { level: "Good", color: "text-yellow-400" };
    if (confidence >= 0.4) return { level: "Fair", color: "text-orange-400" };
    return { level: "Poor", color: "text-red-400" };
  };

  if (loading) {
    return (
      <div class="bg-zinc-900 border border-zinc-800 p-6">
        <div class="animate-pulse">
          <div class="h-4 bg-zinc-700 rounded mb-4"></div>
          <div class="space-y-3">
            <div class="h-20 bg-zinc-800 rounded"></div>
            <div class="h-20 bg-zinc-800 rounded"></div>
            <div class="h-20 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div class="bg-zinc-900 border border-zinc-800 p-6 text-center">
        <p class="text-zinc-500 font-mono text-sm">Unable to load A/B test data</p>
      </div>
    );
  }

  return (
    <div class="bg-zinc-900 border border-zinc-800 p-6">
      {/* Header */}
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-zinc-100 mb-1">A/B Testing Dashboard</h2>
          <p class="text-xs font-mono text-zinc-500 uppercase">Algorithm Performance Analysis</p>
        </div>
        <div class="text-right">
          <div class="text-sm font-mono text-emerald-400">{testData.totalTests} Tests</div>
          <div class="text-xs text-zinc-500">Last refresh: {lastRefresh}</div>
        </div>
      </div>

      {/* Winner announcement */}
      {testData.recommendedVariant && (
        <div class="bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-400/30 p-4 rounded mb-6">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🏆</span>
            <div>
              <h3 class="font-semibold text-emerald-400">
                Best Performing: {testData.recommendedVariant.name}
              </h3>
              <p class="text-sm text-zinc-300">
                {(testData.recommendedVariant.averageConfidence * 100).toFixed(1)}% average confidence
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Variant performance cards */}
      <div class="space-y-4">
        {testData.variants.map((variant, index) => {
          const color = getVariantColor(variant.id);
          const performance = getPerformanceLevel(variant.averageConfidence);
          const isWinner = variant.id === testData.recommendedVariant?.id;
          
          return (
            <div 
              key={variant.id}
              class={`border p-4 transition-all duration-200 hover:border-${color}-400/50 ${
                isWinner ? `bg-${color}-900/20 border-${color}-400/40` : 'bg-zinc-800 border-zinc-700'
              }`}
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class={`w-3 h-3 rounded-full bg-${color}-400`}></div>
                  <div>
                    <h3 class="font-semibold text-zinc-100 flex items-center gap-2">
                      {variant.name}
                      {isWinner && <span class="text-xs bg-emerald-400 text-zinc-900 px-2 py-0.5 rounded font-mono">WINNER</span>}
                    </h3>
                    <p class="text-sm text-zinc-400">{variant.description}</p>
                  </div>
                </div>
                
                <div class="text-right">
                  <div class={`text-lg font-semibold ${performance.color}`}>
                    {(variant.averageConfidence * 100).toFixed(1)}%
                  </div>
                  <div class="text-xs text-zinc-500">{performance.level}</div>
                </div>
              </div>

              {/* Algorithm weights visualization */}
              <div class="mb-3">
                <div class="text-xs font-mono text-zinc-500 uppercase mb-2">Algorithm Weights</div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-center">
                    <div class="text-xs text-zinc-400 mb-1">Collaborative</div>
                    <div class={`text-sm font-semibold text-${color}-400`}>
                      {(variant.weights.collaborative * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-zinc-400 mb-1">Content</div>
                    <div class={`text-sm font-semibold text-${color}-400`}>
                      {(variant.weights.content * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-zinc-400 mb-1">Behavioral</div>
                    <div class={`text-sm font-semibold text-${color}-400`}>
                      {(variant.weights.behavioral * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Test statistics */}
              <div class="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{variant.testCount} tests completed</span>
                {variant.lastUsed && (
                  <span>Last used: {new Date(variant.lastUsed).toLocaleString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights section */}
      <div class="mt-6 pt-4 border-t border-zinc-800">
        <h3 class="text-sm font-mono text-zinc-400 uppercase mb-3">Data-Driven Insights</h3>
        <div class="space-y-2 text-sm text-zinc-300">
          {testData.variants.length > 0 && (
            <>
              <div class="flex items-center gap-2">
                <span class="text-emerald-400">📈</span>
                <span>
                  {testData.variants.find(v => v.averageConfidence === Math.max(...testData.variants.map(v => v.averageConfidence)))?.name} 
                  {" "}shows highest recommendation confidence
                </span>
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-blue-400">🔬</span>
                <span>
                  Total {testData.totalTests} algorithm tests provide statistical significance
                </span>
              </div>
              
              {testData.recommendedVariant && (
                <div class="flex items-center gap-2">
                  <span class="text-purple-400">💡</span>
                  <span>
                    Recommended: Focus on {testData.recommendedVariant.name.toLowerCase()} for optimal performance
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 