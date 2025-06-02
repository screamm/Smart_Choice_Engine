import { useEffect, useState } from "preact/hooks";

interface SystemMetrics {
  totalRecommendations: number;
  activeUsers: number;
  averageConfidence: number;
  topPerformingVariant: string;
}

interface RealtimeEvent {
  type: string;
  data: any;
}

export default function RealtimeUpdates() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalRecommendations: 0,
    activeUsers: 0,
    averageConfidence: 0,
    topPerformingVariant: "variant_a"
  });
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket("ws://localhost:8000/ws");
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log("🔌 WebSocket connected");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastUpdate(new Date().toLocaleTimeString());
        
        // Update metrics if received
        if (data.type === "system_metrics") {
          setMetrics(data.data);
        }
        
        // Add to events feed
        setEvents(prev => [{
          type: data.type,
          data: data.data
        }, ...prev].slice(0, 5)); // Keep only last 5 events
        
        // Update specific metrics based on event type
        if (data.type === "recommendation_generated") {
          setMetrics(prev => ({
            ...prev,
            totalRecommendations: prev.totalRecommendations + 1,
            averageConfidence: data.data.averageConfidence || prev.averageConfidence
          }));
        }
        
        if (data.type === "user_activity") {
          setMetrics(prev => ({
            ...prev,
            activeUsers: data.data.activeUsers || prev.activeUsers
          }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      console.log("❌ WebSocket disconnected");
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "recommendation_generated": return "🎯";
      case "user_activity": return "👤";
      case "system_metrics": return "📊";
      default: return "⚡";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "recommendation_generated": return "text-emerald-400";
      case "user_activity": return "text-blue-400";
      case "system_metrics": return "text-yellow-400";
      default: return "text-zinc-400";
    }
  };

  return (
    <div class="bg-zinc-900 border border-zinc-800 p-4">
      {/* Header with connection status */}
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-mono uppercase tracking-wider text-zinc-400">
          Live System Monitor
        </h3>
        <div class="flex items-center gap-2">
          <div class={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span class="text-xs font-mono text-zinc-500">
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* Real-time metrics grid */}
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-zinc-800 border border-zinc-700 p-3 hover:border-emerald-400/50 transition-colors">
          <div class="text-xs font-mono text-zinc-500 uppercase mb-1">Recommendations</div>
          <div class="text-lg font-light text-emerald-400">{metrics.totalRecommendations}</div>
        </div>
        
        <div class="bg-zinc-800 border border-zinc-700 p-3 hover:border-blue-400/50 transition-colors">
          <div class="text-xs font-mono text-zinc-500 uppercase mb-1">Active Users</div>
          <div class="text-lg font-light text-blue-400">{metrics.activeUsers}</div>
        </div>
        
        <div class="bg-zinc-800 border border-zinc-700 p-3 hover:border-yellow-400/50 transition-colors">
          <div class="text-xs font-mono text-zinc-500 uppercase mb-1">Avg Confidence</div>
          <div class="text-lg font-light text-yellow-400">
            {(metrics.averageConfidence * 100).toFixed(1)}%
          </div>
        </div>
        
        <div class="bg-zinc-800 border border-zinc-700 p-3 hover:border-purple-400/50 transition-colors">
          <div class="text-xs font-mono text-zinc-500 uppercase mb-1">Top Variant</div>
          <div class="text-sm font-light text-purple-400">
            {metrics.topPerformingVariant?.replace('variant_', '').toUpperCase() || 'A'}
          </div>
        </div>
      </div>

      {/* Live events feed */}
      <div class="border-t border-zinc-800 pt-3">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-mono text-zinc-500 uppercase">Live Events</h4>
          {lastUpdate && (
            <span class="text-xs font-mono text-zinc-600">
              Last: {lastUpdate}
            </span>
          )}
        </div>
        
        <div class="space-y-1 max-h-32 overflow-y-auto">
          {events.length === 0 ? (
            <div class="text-xs text-zinc-600 font-mono">Waiting for events...</div>
          ) : (
            events.map((event, index) => (
              <div key={index} class="flex items-center gap-2 text-xs font-mono py-1">
                <span class="text-lg">{getEventIcon(event.type)}</span>
                <span class={getEventColor(event.type)}>
                  {event.type.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span class="text-zinc-600 flex-1">
                  {event.data?.customerId && `Customer ${event.data.customerId}`}
                  {event.data?.count && ` • ${event.data.count} items`}
                  {event.data?.variant && ` • ${event.data.variant}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 