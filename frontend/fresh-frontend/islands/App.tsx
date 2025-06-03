import { useState, useEffect } from "preact/hooks";
import AppHeader from "./AppHeader.tsx";
import MainApp from "./MainApp.tsx";
import MobileNavigation from "../components/MobileNavigation.tsx";

export default function App() {
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [mobileView, setMobileView] = useState<'customers' | 'recommendations' | 'analytics'>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    console.log("🎮 App island mounted");
    
    // Detect tablet/screen size
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024); // iPad size
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  console.log("🎮 App island rendering, Advanced Mode:", showAdvancedMode, "Tablet:", isTablet);

  // Handle customer selection for mobile/tablet navigation
  useEffect(() => {
    const handleCustomerSelected = (event: any) => {
      if (event.detail) {
        setSelectedCustomer(event.detail);
        // Auto-switch to recommendations view on mobile/tablet when customer is selected
        if (window.innerWidth < 1024) {
          setMobileView('recommendations');
        }
      }
    };

    const handleMobileViewChange = (event: any) => {
      if (event.detail) {
        setMobileView(event.detail);
      }
    };

    const handleAdvancedModeChange = (event: any) => {
      if (typeof event.detail === 'boolean') {
        setShowAdvancedMode(event.detail);
      }
    };

    window.addEventListener('customerSelected', handleCustomerSelected);
    window.addEventListener('mobileViewChange', handleMobileViewChange);
    window.addEventListener('advancedModeChange', handleAdvancedModeChange);
    
    return () => {
      window.removeEventListener('customerSelected', handleCustomerSelected);
      window.removeEventListener('mobileViewChange', handleMobileViewChange);
      window.removeEventListener('advancedModeChange', handleAdvancedModeChange);
    };
  }, []);

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader onAdvancedModeChange={setShowAdvancedMode} />
      
      <MobileNavigation 
        currentView={mobileView}
        onViewChange={setMobileView}
        showAdvancedMode={showAdvancedMode}
        selectedCustomerName={selectedCustomer?.name}
        onAdvancedModeToggle={setShowAdvancedMode}
        isTablet={isTablet}
      />
      
      <div class={`max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8 ${isTablet ? 'pb-24' : 'pb-20'} lg:pb-8`}>
        <MainApp 
          showAdvancedMode={showAdvancedMode} 
          mobileView={mobileView}
          selectedCustomer={selectedCustomer}
          isTablet={isTablet}
        />
      </div>
    </div>
  );
} 