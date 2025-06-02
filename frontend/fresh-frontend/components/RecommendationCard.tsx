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
  recommendation: Recommendation;
  onSelect?: (productId: number) => void;
}

export default function RecommendationCard({ recommendation, onSelect }: Props) {
  const handleClick = () => {
    onSelect?.(recommendation.productId);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    if (confidence >= 0.6) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    if (confidence >= 0.4) return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.9) return "VERY HIGH";
    if (confidence >= 0.8) return "HIGH";
    if (confidence >= 0.6) return "MODERATE";
    if (confidence >= 0.4) return "LOW";
    return "VERY LOW";
  };

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case "COLLABORATIVE": return "👥";
      case "CONTENT": return "🏷️";
      case "BEHAVIORAL": return "🧠";
      case "HYBRID": return "⚡";
      default: return "🔮";
    }
  };

  const getVariantBadge = (variant?: string) => {
    if (!variant) return null;
    
    const colors = {
      variant_a: "bg-emerald-600",
      variant_b: "bg-blue-600", 
      variant_c: "bg-purple-600"
    };
    
    return (
      <span class={`text-xs px-2 py-0.5 rounded font-mono text-white ${colors[variant as keyof typeof colors] || 'bg-zinc-600'}`}>
        {variant.replace('variant_', 'V').toUpperCase()}
      </span>
    );
  };

  return (
    <div 
      class="bg-zinc-900 border border-zinc-800 hover:border-emerald-400/50 transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      {/* Header with variant badge */}
      <div class="p-4 border-b border-zinc-800">
        <div class="flex items-start justify-between mb-2">
          <div class="text-2xl">{recommendation.image}</div>
          {getVariantBadge(recommendation.variant)}
        </div>
        
        <h3 class="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
          {recommendation.name}
        </h3>
        
        <div class="text-lg font-light text-emerald-400 mt-1">
          {recommendation.price.toLocaleString()} kr
        </div>
      </div>

      {/* Advanced ML Confidence Section */}
      <div class="p-4 border-b border-zinc-800">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono text-zinc-500 uppercase">AI Confidence</span>
          <div class={`px-2 py-1 rounded text-xs font-mono border ${getConfidenceColor(recommendation.confidence)}`}>
            {getConfidenceLevel(recommendation.confidence)}
          </div>
        </div>
        
        {/* Confidence bar with gradient */}
        <div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
          <div 
            class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${recommendation.confidence * 100}%` }}
          ></div>
        </div>
        
        <div class="flex items-center justify-between text-xs">
          <span class="font-mono text-zinc-400">
            {(recommendation.confidence * 100).toFixed(1)}% certainty
          </span>
          <span class="font-mono text-zinc-500">
            Score: {recommendation.recommendationScore.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Algorithm Analysis */}
      {recommendation.scores && (
        <div class="p-4 border-b border-zinc-800">
          <div class="text-xs font-mono text-zinc-500 uppercase mb-3">Algorithm Breakdown</div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span>👥</span>
                <span class="text-zinc-300">Collaborative</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-16 bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${recommendation.scores.collaborative * 100}%` }}
                  ></div>
                </div>
                <span class="font-mono text-blue-400 w-8 text-right">
                  {(recommendation.scores.collaborative * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span>🏷️</span>
                <span class="text-zinc-300">Content</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-16 bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${recommendation.scores.content * 100}%` }}
                  ></div>
                </div>
                <span class="font-mono text-yellow-400 w-8 text-right">
                  {(recommendation.scores.content * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span>🧠</span>
                <span class="text-zinc-300">Behavioral</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-16 bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-purple-400 transition-all duration-300"
                    style={{ width: `${recommendation.scores.behavioral * 100}%` }}
                  ></div>
                </div>
                <span class="font-mono text-purple-400 w-8 text-right">
                  {(recommendation.scores.behavioral * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Algorithms used */}
      <div class="p-4 border-b border-zinc-800">
        <div class="text-xs font-mono text-zinc-500 uppercase mb-2">Active Algorithms</div>
        <div class="flex flex-wrap gap-1">
          {recommendation.algorithms.map(algorithm => (
            <span 
              key={algorithm}
              class="inline-flex items-center gap-1 text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-mono border border-zinc-700"
            >
              <span>{getAlgorithmIcon(algorithm)}</span>
              {algorithm}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendation reason */}
      <div class="p-4">
        <div class="text-xs font-mono text-zinc-500 uppercase mb-2">AI Reasoning</div>
        <p class="text-sm text-zinc-300 leading-relaxed">
          {recommendation.reason}
        </p>
        
        {/* Trust indicators */}
        <div class="flex items-center gap-4 mt-3 text-xs text-zinc-500">
          <div class="flex items-center gap-1">
            <span>🔒</span>
            <span class="font-mono">Transparent</span>
          </div>
          <div class="flex items-center gap-1">
            <span>⚡</span>
            <span class="font-mono">Real-time</span>
          </div>
          <div class="flex items-center gap-1">
            <span>🎯</span>
            <span class="font-mono">Personalized</span>
          </div>
        </div>
      </div>
    </div>
  );
} 