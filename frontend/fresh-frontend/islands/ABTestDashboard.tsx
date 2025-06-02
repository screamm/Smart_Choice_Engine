import { useEffect, useState } from "preact/hooks";

interface TestResult {
  testId: string;
  variant: string;
  description: string;
  performanceScore: number;
  conversionRate: number;
  userCount: number;
  confidenceLevel: number;
  algorithms: {
    collaborative: number;
    content: number;
    behavioral: number;
  };
  status: string;
  lastRun: string;
  completedTests: number;
}

interface AnalyticsData {
  totalTests: number;
  bestPerforming: TestResult | null;
  results: TestResult[];
  insights: string[];
}

export default function ABTestDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ab-test-results");
      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to frontend format
        const backendData = result.data;
        const transformedResults: TestResult[] = backendData.variants.map((variant: any) => ({
          testId: variant.id,
          variant: variant.name,
          description: variant.description,
          performanceScore: variant.averageConfidence || 0,
          conversionRate: 0.75 + Math.random() * 0.2, // Mock data
          userCount: variant.testCount || 0,
          confidenceLevel: variant.averageConfidence || 0,
          algorithms: variant.weights,
          status: "active",
          lastRun: variant.lastUsed || new Date().toISOString(),
          completedTests: variant.testCount || 0
        }));

        const bestPerforming = backendData.recommendedVariant ? {
          testId: backendData.recommendedVariant.id,
          variant: backendData.recommendedVariant.name,
          description: backendData.recommendedVariant.description,
          performanceScore: backendData.recommendedVariant.averageConfidence || 0,
          conversionRate: 0.85,
          userCount: backendData.recommendedVariant.testCount || 0,
          confidenceLevel: backendData.recommendedVariant.averageConfidence || 0,
          algorithms: backendData.recommendedVariant.weights,
          status: "winner",
          lastRun: backendData.recommendedVariant.lastUsed || new Date().toISOString(),
          completedTests: backendData.recommendedVariant.testCount || 0
        } : null;

        const insights = [
          `${transformedResults.length} variants currently running`,
          bestPerforming ? `Best performer: ${bestPerforming.variant}` : "No clear winner yet",
          `Total ${backendData.totalTests} test sessions completed`
        ];

        setData({
          totalTests: backendData.totalTests,
          bestPerforming,
          results: transformedResults,
          insights
        });
      }
    } catch (error) {
      console.error("Error fetching A/B test data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case "Collaborative Focus": return { 
        primary: "text-emerald-400", 
        bg: "bg-emerald-500/10", 
        border: "border-emerald-500/20",
        accent: "bg-emerald-400"
      };
      case "Content Focus": return { 
        primary: "text-blue-400", 
        bg: "bg-blue-500/10", 
        border: "border-blue-500/20",
        accent: "bg-blue-400"
      };
      case "Behavioral Focus": return { 
        primary: "text-purple-400", 
        bg: "bg-purple-500/10", 
        border: "border-purple-500/20",
        accent: "bg-purple-400"
      };
      default: return { 
        primary: "text-zinc-400", 
        bg: "bg-zinc-500/10", 
        border: "border-zinc-500/20",
        accent: "bg-zinc-400"
      };
    }
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 0.85) return { level: "EXCELLENT", color: "text-emerald-400" };
    if (score >= 0.75) return { level: "GOOD", color: "text-green-400" };
    if (score >= 0.65) return { level: "MODERATE", color: "text-yellow-400" };
    return { level: "POOR", color: "text-orange-400" };
  };

  if (loading) {
    return (
      <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-zinc-800/50 rounded"></div>
          <div class="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} class="h-16 bg-zinc-800/30 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
        <div class="text-center py-8">
          <div class="text-zinc-400 text-sm">No A/B test data available</div>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-zinc-100">
            A/B Testing
          </h2>
          <p class="text-sm text-zinc-400 mt-1">
            {data.totalTests} Tests • Live Analysis
          </p>
        </div>
        <div class="text-right">
          <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Last Updated
          </div>
          <div class="text-sm text-zinc-300">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Best Performing Variant */}
      {data.bestPerforming && (
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span class="text-sm font-medium text-zinc-300">Best Performing</span>
          </div>
          
          <div class={`p-4 rounded-lg border ${getVariantColor(data.bestPerforming.variant).border} ${getVariantColor(data.bestPerforming.variant).bg}`}>
            <div class="flex items-center justify-between mb-2">
              <span class={`font-medium ${getVariantColor(data.bestPerforming.variant).primary}`}>
                {data.bestPerforming.variant}
              </span>
              <span class={`text-sm ${getPerformanceLevel(data.bestPerforming.performanceScore).color}`}>
                {(data.bestPerforming.performanceScore * 100).toFixed(1)}% avg confidence
              </span>
            </div>
            <p class="text-sm text-zinc-400 leading-relaxed">
              {data.bestPerforming.description}
            </p>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div class="space-y-4">
        {data.results && data.results.length > 0 && data.results.map((result, index) => {
          const variantStyle = getVariantColor(result.variant);
          const performance = getPerformanceLevel(result.performanceScore);
          
          return (
            <div key={result.testId} class={`p-4 rounded-lg border ${variantStyle.border} ${variantStyle.bg}`}>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class={`w-3 h-3 ${variantStyle.accent} rounded-full`}></div>
                  <span class={`font-medium ${variantStyle.primary}`}>
                    {result.variant}
                  </span>
                  {result.variant === data.bestPerforming?.variant && (
                    <div class="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-xs font-medium rounded-full">
                      WINNER
                    </div>
                  )}
                </div>
                <span class={`text-sm font-medium ${performance.color}`}>
                  {performance.level}
                </span>
              </div>

              <p class="text-sm text-zinc-400 mb-4 leading-relaxed">
                {result.description}
              </p>

              {/* Algorithm Weights */}
              <div class="mb-4">
                <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Algorithm Weights
                </div>
                <div class="flex justify-between text-xs">
                  <div class="text-center">
                    <div class="text-blue-400 font-medium">
                      {Math.round(result.algorithms.collaborative * 100)}%
                    </div>
                    <div class="text-zinc-500">Collaborative</div>
                  </div>
                  <div class="text-center">
                    <div class="text-yellow-400 font-medium">
                      {Math.round(result.algorithms.content * 100)}%
                    </div>
                    <div class="text-zinc-500">Content</div>
                  </div>
                  <div class="text-center">
                    <div class="text-purple-400 font-medium">
                      {Math.round(result.algorithms.behavioral * 100)}%
                    </div>
                    <div class="text-zinc-500">Behavioral</div>
                  </div>
                </div>
              </div>

              {/* Test Stats */}
              <div class="flex justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-800/50">
                <span>{result.completedTests} tests completed</span>
                <span>Last used: {result.lastRun}</span>
              </div>
            </div>
          );
        })}
        
        {(!data.results || data.results.length === 0) && (
          <div class="text-center py-8">
            <div class="text-zinc-400 text-sm">No test results available</div>
          </div>
        )}
      </div>

      {/* Data-Driven Insights */}
      {data.insights && data.insights.length > 0 && (
        <div class="mt-6 pt-6 border-t border-zinc-800/50">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span class="text-sm font-medium text-zinc-300">Key Insights</span>
          </div>
          <div class="space-y-2">
            {data.insights.map((insight, index) => (
              <div key={index} class="flex items-start gap-2 text-sm text-zinc-400">
                <div class="w-1 h-1 bg-zinc-600 rounded-full mt-2 flex-shrink-0"></div>
                <span class="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 