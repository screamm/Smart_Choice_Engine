import { useSignal } from "@preact/signals";
import MainApp from "../islands/MainApp.tsx";

export default function Home() {
  const showAdvancedMode = useSignal(true);

  console.log("🏠 Home route rendering (SSR)");

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header class="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-light text-zinc-100 mb-1">
                Smart Choice Engine
              </h1>
              <p class="text-sm text-zinc-400 font-mono">
                AI-Powered Recommendation System with Real-time Updates & A/B Testing
              </p>
            </div>
            
            {/* Advanced mode toggle */}
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showAdvancedMode.value}
                  onChange={(e) => showAdvancedMode.value = e.currentTarget.checked}
                  class="sr-only"
                />
                <div class={`w-10 h-6 rounded-full transition-colors ${showAdvancedMode.value ? 'bg-emerald-600' : 'bg-zinc-700'}`}>
                  <div class={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ${showAdvancedMode.value ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </div>
                <span class="text-sm font-mono text-zinc-400">Advanced Mode</span>
              </label>
              
              <div class="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Live System</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-6 py-8">
        <MainApp showAdvancedMode={showAdvancedMode.value} />
      </div>
    </div>
  );
}
