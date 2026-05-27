import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { api } from '../utils/api';

interface ChangePasswordProps {
  onBack: () => void;
}

export const ChangePassword = ({ onBack }: ChangePasswordProps) => {
  const [pwdForm, setPwdForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    setIsLoading(true);
    
    if (pwdForm.password !== pwdForm.password_confirmation) {
      setPwdError("Les nouveaux mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await api.changePassword(pwdForm);
      setPwdSuccess(res.message || "Mot de passe modifié avec succès.");
      setTimeout(() => {
        onBack(); // Rediriger vers le site
      }, 2000);
    } catch (err: any) {
      setPwdError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-[#111B2F] flex flex-col relative animate-fadeIn overflow-hidden">
      {/* Pattern de fond global */}
      <div className="absolute inset-0 zellige-pattern opacity-5 pointer-events-none" />
      
      {/* Bouton Retour en haut */}
      <div className="p-6 relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#CDB58E] hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#2A1B15] border border-[#CDB58E]/30 flex items-center justify-center group-hover:bg-[#CDB58E] group-hover:text-[#2A1B15] transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium font-sans">Retour</span>
        </button>
      </div>

      {/* Conteneur principal centré */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 -mt-20">
        
        {/* Titre et icône en haut de la carte */}
        <div className="mb-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#603A2A]/20 border-2 border-[#CDB58E] flex items-center justify-center mx-auto text-[#CDB58E] shadow-[0_0_30px_rgba(205,181,142,0.2)]">
            <Lock size={28} />
          </div>
          <h2 className="font-display font-bold text-3xl text-white">Sécurité du compte</h2>
          <p className="text-[#8E887F] text-sm">Renouvelez votre mot de passe pour protéger votre profil.</p>
        </div>

        {/* Carte du formulaire */}
        <div className="bg-[#2A1B15]/80 backdrop-blur-md rounded-2xl w-full max-w-md p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#CDB58E]/30">
          
          {pwdSuccess ? (
            <div className="py-6 text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-white">Changement réussi !</h3>
              <p className="text-emerald-400/80 text-sm">
                Redirection automatique vers votre espace...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {pwdError && (
                <div className="bg-red-950/50 text-red-400 p-3.5 rounded-lg text-sm border border-red-900/50 flex items-start gap-3">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{pwdError}</span>
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#CDB58E] uppercase tracking-wider">
                  Ancien mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={pwdForm.current_password}
                    onChange={e => setPwdForm({...pwdForm, current_password: e.target.value})}
                    className="w-full bg-[#111B2F]/60 border border-[#8E887F]/30 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-[#CDB58E] focus:ring-1 focus:ring-[#CDB58E] transition-all placeholder-[#8E887F]/50"
                    placeholder="Saisissez le mot de passe actuel"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#CDB58E] uppercase tracking-wider">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={pwdForm.password}
                    onChange={e => setPwdForm({...pwdForm, password: e.target.value})}
                    className="w-full bg-[#111B2F]/60 border border-[#8E887F]/30 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-[#CDB58E] focus:ring-1 focus:ring-[#CDB58E] transition-all placeholder-[#8E887F]/50"
                    placeholder="Au moins 6 caractères"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#CDB58E] uppercase tracking-wider">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={pwdForm.password_confirmation}
                    onChange={e => setPwdForm({...pwdForm, password_confirmation: e.target.value})}
                    className="w-full bg-[#111B2F]/60 border border-[#8E887F]/30 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-[#CDB58E] focus:ring-1 focus:ring-[#CDB58E] transition-all placeholder-[#8E887F]/50"
                    placeholder="Répétez le nouveau mot de passe"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 bg-[#CDB58E] hover:bg-white text-[#2A1B15] transition-all font-bold rounded-xl text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(205,181,142,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Vérification...' : 'Changer mon mot de passe'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
