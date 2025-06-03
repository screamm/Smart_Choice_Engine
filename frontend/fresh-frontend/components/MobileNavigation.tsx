interface MobileNavigationProps {
  currentView: 'customers' | 'recommendations' | 'analytics';
  onViewChange: (view: 'customers' | 'recommendations' | 'analytics') => void;
  showAdvancedMode: boolean;
  selectedCustomerName?: string;
  onAdvancedModeToggle: (enabled: boolean) => void;
  isTablet?: boolean;
}

export default function MobileNavigation({ 
  currentView, 
  onViewChange, 
  showAdvancedMode,
  selectedCustomerName,
  onAdvancedModeToggle,
  isTablet = false
}: MobileNavigationProps) {
  return (
    <>
      {/* Bottom Navigation Bar for Mobile and Tablet */}
      <div class="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 lg:hidden z-50 safe-area-inset-bottom">
        <div class={`grid ${showAdvancedMode ? 'grid-cols-3' : 'grid-cols-3'} ${isTablet ? 'h-20' : 'h-16'}`}>
          {/* Customers Tab */}
          <button
            onClick={() => onViewChange('customers')}
            class={`flex flex-col items-center justify-center transition-all relative ${
              currentView === 'customers' 
                ? 'text-emerald-400 bg-emerald-400/10' 
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
          >
            {currentView === 'customers' && (
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full"></div>
            )}
            <svg class={`${isTablet ? 'w-6 h-6' : 'w-5 h-5'} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class={`${isTablet ? 'text-sm' : 'text-xs'} font-medium`}>Kunder</span>
            {isTablet && (
              <span class="text-xs text-zinc-500 mt-0.5">Välj målgrupp</span>
            )}
          </button>

          {/* Recommendations Tab */}
          <button
            onClick={() => onViewChange('recommendations')}
            class={`flex flex-col items-center justify-center transition-all relative ${
              currentView === 'recommendations' 
                ? 'text-blue-400 bg-blue-400/10' 
                : 'text-zinc-400 hover:text-zinc-300'
            } ${!selectedCustomerName ? 'opacity-50' : ''}`}
            disabled={!selectedCustomerName}
          >
            {currentView === 'recommendations' && (
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full"></div>
            )}
            <div class="relative">
              <svg class={`${isTablet ? 'w-6 h-6' : 'w-5 h-5'} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {selectedCustomerName && (
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full flex items-center justify-center">
                  <div class="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                </div>
              )}
            </div>
            <span class={`${isTablet ? 'text-sm' : 'text-xs'} font-medium`}>
              {selectedCustomerName ? 'Produkter' : 'Produkter'}
            </span>
            {isTablet && (
              <span class="text-xs text-zinc-500 mt-0.5">
                {selectedCustomerName ? selectedCustomerName : 'Inga rekommendationer'}
              </span>
            )}
          </button>

          {/* Analytics Tab (only in advanced mode) or Settings */}
          {showAdvancedMode ? (
            <button
              onClick={() => onViewChange('analytics')}
              class={`flex flex-col items-center justify-center transition-all relative ${
                currentView === 'analytics' 
                  ? 'text-purple-400 bg-purple-400/10' 
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {currentView === 'analytics' && (
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-full"></div>
              )}
              <svg class={`${isTablet ? 'w-6 h-6' : 'w-5 h-5'} mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class={`${isTablet ? 'text-sm' : 'text-xs'} font-medium`}>Analys</span>
              {isTablet && (
                <span class="text-xs text-zinc-500 mt-0.5">A/B Tester</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onAdvancedModeToggle(true)}
              class="flex flex-col items-center justify-center text-zinc-400 hover:text-emerald-300 transition-all relative group"
            >
              <div class="relative">
                <svg class={`${isTablet ? 'w-6 h-6' : 'w-5 h-5'} mb-1 group-hover:scale-110 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div class="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span class={`${isTablet ? 'text-sm' : 'text-xs'} font-medium`}>Avancerat</span>
              {isTablet && (
                <span class="text-xs text-zinc-500 mt-0.5">Aktivera</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Header */}
      <div class="lg:hidden bg-zinc-900/50 backdrop-blur border-b border-zinc-800 sticky top-0 z-40 safe-area-inset-top">
        <div class={`px-4 ${isTablet ? 'py-4' : 'py-3'}`}>
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <h1 class={`${isTablet ? 'text-xl' : 'text-lg'} font-medium text-zinc-100`}>
                    Smart Choice
                  </h1>
                  
                  {/* Context Indicator */}
                  <div class="flex items-center gap-1">
                    {currentView === 'customers' && (
                      <div class="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-md">
                        <span class="text-xs font-medium text-emerald-400">Kunder</span>
                      </div>
                    )}
                    {currentView === 'recommendations' && selectedCustomerName && (
                      <div class="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-md">
                        <span class="text-xs font-medium text-blue-400">Produkter</span>
                      </div>
                    )}
                    {currentView === 'analytics' && showAdvancedMode && (
                      <div class="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-md">
                        <span class="text-xs font-medium text-purple-400">Analys</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Selected Customer Info */}
                {selectedCustomerName && (
                  <div class="flex items-center gap-2 px-3 py-1 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                    <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span class={`${isTablet ? 'text-sm' : 'text-xs'} text-zinc-300 truncate max-w-32`}>
                      {selectedCustomerName}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Progress Indicator */}
              {isTablet && (
                <div class="mt-2 flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <div class={`w-2 h-2 rounded-full ${currentView === 'customers' ? 'bg-emerald-400' : 'bg-zinc-600'}`}></div>
                    <div class={`w-2 h-2 rounded-full ${currentView === 'recommendations' ? 'bg-blue-400' : selectedCustomerName ? 'bg-zinc-500' : 'bg-zinc-700'}`}></div>
                    <div class={`w-2 h-2 rounded-full ${currentView === 'analytics' ? 'bg-purple-400' : showAdvancedMode ? 'bg-zinc-500' : 'bg-zinc-700'}`}></div>
                  </div>
                  <span class="text-xs text-zinc-500">
                    {currentView === 'customers' && 'Steg 1 av 3'}
                    {currentView === 'recommendations' && 'Steg 2 av 3'}
                    {currentView === 'analytics' && 'Steg 3 av 3'}
                  </span>
                </div>
              )}
            </div>
            
            <div class="flex items-center gap-3">
              {/* Advanced Mode Toggle */}
              <div class="flex flex-col items-end gap-1">
                <button
                  onClick={() => onAdvancedModeToggle(!showAdvancedMode)}
                  class={`relative ${isTablet ? 'w-12 h-7' : 'w-10 h-6'} rounded-full transition-all duration-300 ${
                    showAdvancedMode 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' 
                      : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                >
                  <div class={`absolute ${isTablet ? 'top-0.5 w-6 h-6' : 'top-0.5 w-5 h-5'} bg-white rounded-full shadow-sm transition-all duration-300 ${
                    showAdvancedMode ? (isTablet ? 'translate-x-5' : 'translate-x-4') : 'translate-x-0.5'
                  }`}>
                    {showAdvancedMode && (
                      <div class="w-full h-full flex items-center justify-center">
                        <div class={`${isTablet ? 'w-2.5 h-2.5' : 'w-2 h-2'} bg-emerald-600 rounded-full`}></div>
                      </div>
                    )}
                  </div>
                </button>
                <span class="text-xs text-zinc-500">
                  {showAdvancedMode ? 'Avancerat' : 'Enkelt'}
                </span>
              </div>
              
              {/* Status Indicator */}
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span class={`${isTablet ? 'text-sm' : 'text-xs'} text-zinc-500 font-mono`}>Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 