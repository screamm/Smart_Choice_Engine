import { useEffect, useState } from "preact/hooks";

interface SystemMetrics {
  totalRecommendations: number;
  activeUsers: number;
  averageConfidence: number;
  topVariant: string;
}

interface LiveEvent {
  type: string;
  message: string;
  timestamp: string;
  severity?: string;
}

export default function RealtimeUpdates() {
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalRecommendations: 0,
    activeUsers: 0,
    averageConfidence: 0,
    topVariant: "A"
  });
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket connection
    const websocket = new WebSocket("ws://localhost:8000/ws");
    
    websocket.onopen = () => {
      console.log("🔌 WebSocket connected");
      setIsConnected(true);
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "metrics") {
          setMetrics(data.data);
        } else if (data.type === "event") {
          setEvents(prev => [data.data, ...prev].slice(0, 5));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };
    
    websocket.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setIsConnected(false);
    };
    
    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, []);

  const getMetricColor = (value: number, type: string) => {
    switch (type) {
      case "confidence":
        if (value >= 0.8) return "text-emerald-400";
        if (value >= 0.6) return "text-yellow-400";
        return "text-orange-400";
      case "users":
        if (value >= 10) return "text-emerald-400";
        if (value >= 5) return "text-yellow-400";
        return "text-zinc-400";
      default:
        return "text-zinc-300";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "RECOMMENDATION_GENERATED": return { icon: "🎯", color: "text-emerald-400" };
      case "SYSTEM_METRICS": return { icon: "📊", color: "text-blue-400" };
      case "USER_ACTIVITY": return { icon: "👤", color: "text-purple-400" };
      case "A/B_TEST": return { icon: "🧪", color: "text-yellow-400" };
      default: return { icon: "📡", color: "text-zinc-400" };
    }
  };

  return (
    <div class="bg-white/[0.02] border border-zinc-800/50 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-zinc-100">
            Live System Monitor
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <div class={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span class={`text-sm ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div class="text-right">
          <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Real-time
          </div>
          <div class="text-sm text-zinc-300">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
          <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Recommendations
          </div>
          <div class="text-2xl font-light text-zinc-100">
            {metrics.totalRecommendations}
          </div>
          <div class="text-xs text-zinc-500 mt-1">Generated today</div>
        </div>
        
        <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
          <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Active Users
          </div>
          <div class={`text-2xl font-light ${getMetricColor(metrics.activeUsers, 'users')}`}>
            {metrics.activeUsers}
          </div>
          <div class="text-xs text-zinc-500 mt-1">Currently online</div>
        </div>
        
        <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
          <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Avg Confidence
          </div>
          <div class={`text-2xl font-light ${getMetricColor(metrics.averageConfidence, 'confidence')}`}>
            {(metrics.averageConfidence * 100).toFixed(1)}%
          </div>
          <div class="text-xs text-zinc-500 mt-1">ML accuracy</div>
        </div>
        
        <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
          <div class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Top Variant
          </div>
          <div class="text-2xl font-light text-emerald-400">
            {metrics.topVariant}
          </div>
          <div class="text-xs text-zinc-500 mt-1">Best performing</div>
        </div>
      </div>

      {/* Live Events Feed */}
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span class="text-sm font-medium text-zinc-300">Live Events</span>
          <div class="text-xs text-zinc-500">
            (Last {events.length})
          </div>
        </div>
        
        <div class="space-y-2 max-h-48 overflow-y-auto">
          {events.length === 0 ? (
            <div class="text-center py-6">
              <div class="text-zinc-500 text-sm">
                {isConnected ? "Waiting for events..." : "Connect to see live events"}
              </div>
            </div>
          ) : (
            events.map((event, index) => {
              const eventStyle = getEventIcon(event.type);
              
              return (
                <div key={index} class="group p-3 bg-zinc-900/20 border border-zinc-800/30 rounded-lg hover:bg-zinc-900/40 transition-colors">
                  <div class="flex items-start gap-3">
                    <div class={`text-lg ${eventStyle.color} flex-shrink-0`}>
                      {eventStyle.icon}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-zinc-300 leading-relaxed">
                        {event.message}
                      </div>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          {event.type.replace('_', ' ')}
                        </span>
                        <span class="text-xs text-zinc-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Connection Status Indicator */}
      {!isConnected && (
        <div class="mt-4 p-3 border border-red-500/20 bg-red-500/10 rounded-lg">
          <div class="flex items-center gap-2 text-red-400 text-sm">
            <div class="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            <span>Connection lost. Attempting to reconnect...</span>
          </div>
        </div>
      )}
    </div>
  );
} 