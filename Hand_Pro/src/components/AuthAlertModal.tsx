import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

export function AuthAlertModal({ isOpen, onClose, onLoginClick }: AuthAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#CDB58E]/30 text-center p-6 animate-[slideIn_0.3s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-[#2A1B15] mb-2 font-display">Accès Restreint</h3>
        <p className="text-[#8E887F] text-sm mb-6">
          Oups ! Vous devez d'abord vous inscrire ou vous connecter pour accéder à cette page
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              if (onLoginClick) onLoginClick();
            }}
            className="w-full py-2.5 bg-[#603A2A] text-white font-bold rounded-lg hover:bg-[#4B2E2A] transition shadow-md"
          >
            Connexion
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 text-[#2A1B15] font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Annuler
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
