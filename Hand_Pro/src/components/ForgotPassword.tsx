import React, { useState } from 'react';
import { Mail, Phone, KeyRound, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

interface ForgotPasswordProps {
  onBack: () => void;
  onResetSuccess: () => void;
}

export default function ForgotPassword({ onBack, onResetSuccess }: ForgotPasswordProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!value.trim()) {
      setError('Veuillez entrer une valeur valide.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(method, value);
      // Simulation: display the code in an alert for local testing
      if (res.simulated_code) {
        alert(`[Simulation Envoi] Votre code de réinitialisation est : ${res.simulated_code}\n\nEn production, ce code serait envoyé par ${method === 'email' ? 'Email' : 'SMS'}.`);
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F5EDE0] text-[#2A1B15] animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-[#CDB58E]/30 relative overflow-hidden">
        
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-[#603A2A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-[#CDB58E]/10 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onBack}
          className="relative z-10 flex items-center gap-2 text-[#8E887F] hover:text-[#603A2A] transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Retour à la connexion</span>
        </button>

        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 bg-[#F5EDE0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#CDB58E]/40">
            <KeyRound size={28} className="text-[#603A2A]" />
          </div>
          <h2 className="font-display text-3xl font-bold text-[#2A1B15]">
            Mot de passe oublié
          </h2>
          <p className="text-sm text-[#8E887F] mt-2 font-sans">
            {step === 1 && "Choisissez comment recevoir votre code de réinitialisation."}
            {step === 2 && "Entrez le code reçu pour vérifier votre identité."}
            {step === 3 && "Créez votre nouveau mot de passe sécurisé."}
          </p>
        </div>

        {error && (
          <div className="relative z-10 mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
            <span className="text-lg leading-none">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* STEP 1: Request Temporary Password */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="relative z-10 space-y-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  method === 'email' 
                    ? 'bg-[#F5EDE0] border-[#603A2A] text-[#603A2A] shadow-inner' 
                    : 'bg-white border-[#CDB58E]/30 text-[#8E887F] hover:border-[#CDB58E]'
                }`}
              >
                <Mail size={24} />
                <span className="text-sm font-bold">Email</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className={`flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  method === 'phone' 
                    ? 'bg-[#F5EDE0] border-[#603A2A] text-[#603A2A] shadow-inner' 
                    : 'bg-white border-[#CDB58E]/30 text-[#8E887F] hover:border-[#CDB58E]'
                }`}
              >
                <Phone size={24} />
                <span className="text-sm font-bold">SMS</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2A1B15] mb-2">
                {method === 'email' ? 'Adresse Email' : 'Numéro de téléphone'}
              </label>
              <div className="relative">
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F5EDE0]/50 border border-[#CDB58E]/40 rounded-xl focus:ring-2 focus:ring-[#CDB58E] focus:border-transparent outline-none transition-all text-[#2A1B15]"
                  placeholder={method === 'email' ? 'vous@exemple.com' : '06...'}
                  required
                />
                {method === 'email' ? (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E887F]" size={20} />
                ) : (
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E887F]" size={20} />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#603A2A] text-[#F5EDE0] hover:bg-[#603A2A]/90 transition-all font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Envoi en cours..." : "Envoyer le mot de passe temporaire"}
            </button>
          </form>
        )}

        {/* STEP 2: Success Message */}
        {step === 2 && (
          <div className="relative z-10 text-center">
            <p className="text-lg text-[#603A2A] font-bold mb-4">Mot de passe temporaire envoyé avec succès !</p>
            <p className="text-sm text-[#8E887F] mb-6">Veuillez vérifier votre {method === 'email' ? 'email' : 'SMS'} pour le mot de passe temporaire et vous connecter.</p>
            <button
              type="button"
              className="w-full py-3.5 bg-[#603A2A] text-[#F5EDE0] hover:bg-[#603A2A]/90 transition-all font-bold rounded-xl shadow-lg"
              onClick={onResetSuccess}
            >
              Retour à la connexion
            </button>
          </div>
        )}



      </div>
    </div>
  );
}
