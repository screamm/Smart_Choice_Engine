import { useEffect, useState } from "preact/hooks";

export default function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Visa loading vid form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', () => setIsLoading(true));
    });

    // Dölj loading när sidan laddats
    window.addEventListener('load', () => setIsLoading(false));
    
    return () => {
      forms.forEach(form => {
        form.removeEventListener('submit', () => setIsLoading(true));
      });
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
      <div class="text-center">
        <div class="w-16 h-16 border-2 border-zinc-700 border-t-emerald-400 animate-spin"></div>
        <p class="mt-4 text-xs font-mono text-zinc-500 uppercase">Processing Request</p>
      </div>
    </div>
  );
} 