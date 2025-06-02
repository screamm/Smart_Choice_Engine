import { useState } from "preact/hooks";

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
  onSelect: (productId: number) => void;
}

export default function RecommendationCard({ recommendation, onSelect }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.85) return { level: "VERY HIGH", color: "text-emerald-400", bg: "bg-emerald-500/20" };
    if (confidence >= 0.75) return { level: "HIGH", color: "text-green-400", bg: "bg-green-500/20" };
    if (confidence >= 0.65) return { level: "MODERATE", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { level: "LOW", color: "text-orange-400", bg: "bg-orange-500/20" };
  };

  const confidence = getConfidenceLevel(recommendation.confidence);
  const variantColors = {
    variant_a: "border-l-emerald-400",
    variant_b: "border-l-blue-400", 
    variant_c: "border-l-purple-400"
  };

  return (
    <div
      class={`group relative bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6 
        transition-all duration-300 cursor-pointer overflow-hidden
        hover:border-zinc-700/70 hover:bg-white/[0.03] hover:shadow-lg hover:shadow-black/20
        ${recommendation.variant ? variantColors[recommendation.variant] + " border-l-2" : ""}
        ${isHovered ? "transform hover:-translate-y-1" : ""}`}
      onClick={() => onSelect(recommendation.productId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
            {recommendation.name}
          </h3>
          <p class="text-xl font-semibold text-emerald-400 mt-1">
            {recommendation.price.toLocaleString()} kr
          </p>
        </div>
        
        {recommendation.variant && (
          <div class="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded-md">
            <div class={`w-1.5 h-1.5 rounded-full ${
              recommendation.variant === 'variant_a' ? 'bg-emerald-400' :
              recommendation.variant === 'variant_b' ? 'bg-blue-400' : 'bg-purple-400'
            }`}></div>
            <span class="text-xs font-mono text-zinc-400 uppercase">
              {recommendation.variant.split('_')[1]}
            </span>
          </div>
        )}
      </div>

      {/* Confidence Display */}
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-zinc-300">AI Confidence</span>
          <div class={`px-2 py-1 rounded-full text-xs font-medium ${confidence.bg} ${confidence.color}`}>
            {confidence.level}
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div class="relative h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <div 
            class="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${recommendation.confidence * 100}%`,
              background: `linear-gradient(90deg, 
                ${recommendation.confidence >= 0.8 ? '#10b981' : 
                  recommendation.confidence >= 0.6 ? '#f59e0b' : '#ef4444'} 0%, 
                ${recommendation.confidence >= 0.8 ? '#34d399' : 
                  recommendation.confidence >= 0.6 ? '#fbbf24' : '#f87171'} 100%)`
            }}
          ></div>
        </div>
        
        <div class="flex justify-between text-xs text-zinc-500 mt-1">
          <span>{(recommendation.confidence * 100).toFixed(1)}% certainty</span>
          <span>Score: {recommendation.recommendationScore.toFixed(3)}</span>
        </div>
      </div>

      {/* Algorithm Breakdown */}
      {recommendation.scores && (
        <div class="mb-4">
          <div class="text-sm font-medium text-zinc-300 mb-3">Algorithm Analysis</div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span class="text-sm text-zinc-400">Collaborative</span>
              </div>
              <span class="text-sm font-medium text-zinc-300">
                {Math.round(recommendation.scores.collaborative * 100)}%
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span class="text-sm text-zinc-400">Content</span>
              </div>
              <span class="text-sm font-medium text-zinc-300">
                {Math.round(recommendation.scores.content * 100)}%
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span class="text-sm text-zinc-400">Behavioral</span>
              </div>
              <span class="text-sm font-medium text-zinc-300">
                {Math.round(recommendation.scores.behavioral * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reasoning */}
      <div class="border-t border-zinc-800/50 pt-4">
        <div class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
              AI Reasoning
            </div>
            <p class="text-sm text-zinc-300 leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Active Algorithms Tags */}
      <div class="flex flex-wrap gap-1.5 mt-4">
        {recommendation.algorithms.map(algorithm => (
          <span 
            key={algorithm}
            class="px-2 py-1 text-xs font-medium bg-zinc-800/40 text-zinc-400 rounded border border-zinc-700/50"
          >
            {algorithm.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Hover Overlay */}
      <div class={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 
        rounded-xl transition-opacity duration-300 pointer-events-none
        ${isHovered ? "opacity-100" : "opacity-0"}`}>
      </div>
    </div>
  );
} 