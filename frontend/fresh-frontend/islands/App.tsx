import { useState, useEffect } from "preact/hooks";
import AppHeader from "./AppHeader.tsx";
import MainApp from "./MainApp.tsx";

export default function App() {
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);

  useEffect(() => {
    console.log("🎮 App island mounted");
  }, []);

  console.log("🎮 App island rendering, Advanced Mode:", showAdvancedMode);

  const handleAdvancedModeChange = (enabled: boolean) => {
    console.log("🔄 Advanced Mode changed to:", enabled);
    setShowAdvancedMode(enabled);
  };

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader onAdvancedModeChange={handleAdvancedModeChange} />
      
      <div class="max-w-7xl mx-auto px-6 py-8">
        <MainApp showAdvancedMode={showAdvancedMode} />
      </div>
    </div>
  );
} 