import { useState, useEffect } from "preact/hooks";

interface Props {
  onAdvancedModeChange: (enabled: boolean) => void;
}

export default function AppHeader({ onAdvancedModeChange }: Props) {
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);

  useEffect(() => {
    console.log("🎮 AppHeader island mounted");
  }, []);

  const handleToggle = (checked: boolean) => {
    console.log("🔄 Advanced Mode toggle clicked:", checked);
    setShowAdvancedMode(checked);
    try {
      onAdvancedModeChange(checked);
    } catch (error) {
      console.error("Error in onAdvancedModeChange:", error);
    }
  };

  return (
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
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="flex flex-col items-end">
                <span class="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                  Advanced Mode
                </span>
                <span class="text-xs text-zinc-500 font-mono">
                  {showAdvancedMode ? "A/B Testing & Analytics" : "Enkel vy"}
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={showAdvancedMode}
                onChange={(e) => {
                  e.stopPropagation();
                  console.log("🎯 Checkbox onChange triggered:", e.currentTarget.checked);
                  handleToggle(e.currentTarget.checked);
                }}
                class="sr-only"
              />
              <div 
                class={`relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer ${
                  showAdvancedMode 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-600/30' 
                    : 'bg-zinc-700 group-hover:bg-zinc-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("🎯 Toggle div clicked, current state:", showAdvancedMode);
                  handleToggle(!showAdvancedMode);
                }}
              >
                <div class={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                  showAdvancedMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}>
                  {showAdvancedMode && (
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </label>
            
            <div class="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Live System</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 