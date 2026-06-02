import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function CustomAlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<{id: number, message: string}[]>([]);

  useEffect(() => {
    // Intercept native window.alert
    const originalAlert = window.alert;
    window.alert = (message: string) => {
      const id = Date.now() + Math.random();
      setAlerts(prev => [...prev, { id, message }]);
      
      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }, 4000);
    };

    return () => {
      window.alert = originalAlert; // Restore on unmount (though this is global)
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className="bg-white border-l-4 border-[#603A2A] shadow-2xl rounded-lg p-4 flex items-start gap-3 w-80 sm:w-96 animate-[slideInRight_0.3s_ease-out] pointer-events-auto"
          >
            <AlertCircle className="w-5 h-5 text-[#CDB58E] shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-[#2A1B15] font-medium leading-relaxed">
              {alert.message}
            </div>
            <button 
              onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
              className="text-gray-400 hover:text-gray-700 transition"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
