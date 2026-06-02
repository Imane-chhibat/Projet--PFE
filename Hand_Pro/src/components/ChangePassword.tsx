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
    <div className="flex-1 w-full bg-[#111B2F] flex flex-col relative animate-fadeIn overflow-hidden min-h-screen">
      {/* Fond pattern */}
      <div className="absolute inset-0 zellige-pattern opacity-5 pointer-events-none" />

      {/* Bouton Retour */}
      <div className="p-4 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#CDB58E] hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[#2A1B15] border border-[#CDB58E]/30 flex items-center justify-center group-hover:bg-[#CDB58E] group-hover:text-[#2A1B15] transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium font-sans">Retour au profil</span>
        </button>
      </div>

      {/* Conteneur centré — espacement réduit */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 relative z-10 -mt-4">

        {/* En-tête compact */}
        <div className="mb-4 text-center space-y-1.5">
          <div className="w-12 h-12 rounded-full bg-[#603A2A]/20 border-2 border-[#CDB58E] flex items-center justify-center mx-auto text-[#CDB58E]">
            <Lock size={22} />
          </div>
          <h2 className="font-display font-bold text-xl text-white">Sécurité du compte</h2>
          <p className="text-[#8E887F] text-xs">Renouvelez votre mot de passe pour protéger votre profil.</p>
        </div>

        {/* Carte formulaire compacte */}
        <div className="bg-[#2A1B15]/80 backdrop-blur-md rounded-2xl w-full max-w-sm p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#CDB58E]/30">

          {pwdSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-white">Changement réussi !</h3>
              <p className="text-emerald-400/80 text-xs">Redirection automatique vers votre espace...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {pwdError && (
                <div className="bg-red-950/50 text-red-400 p-3 rounded-lg text-xs border border-red-900/50 flex items-start gap-2">
                  <span className="shrink-0">⚠️</span>
                  <span>{pwdError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#CDB58E] uppercase tracking-wider">
                  Ancien mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={pwdForm.current_password}
                  onChange={e => setPwdForm({...pwdForm, current_password: e.target.value})}
                  className="w-full bg-[#111B2F]/60 border border-[#8E887F]/30 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CDB58E] focus:ring-1 focus:ring-[#CDB58E] transition-all placeholder-[#8E887F]/50"
                  placeholder="Mot de passe actuel"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#CDB58E] uppercase tracking-wider">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pwdForm.password}
                  onChange={e => setPwdForm({...pwdForm, password: e.target.value})}
                  className="w-full bg-[#111B2F]/60 border border-[#8E887F]/30 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CDB58E] focus:ring-1 focus:ring-[#CDB58E] transition-all placeholder-[#8E887F]/50"
                  placeholder="Au moins 6 caractères"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#CDB58E] uppercase tracking-wider">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pwdForm.password_confirmation}
                  onChange={e => setPwdForm({...pwdForm, password_confirmation: e.target.value})}
                  className="w-full bg-[#111B2F]/60 border border-[#8E887F]/30 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#CDB58E] focus:ring-1 focus:ring-[#CDB58E] transition-all placeholder-[#8E887F]/50"
                  placeholder="Répétez le nouveau mot de passe"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-1 bg-[#CDB58E] hover:bg-white text-[#2A1B15] transition-all font-bold rounded-xl text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(205,181,142,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
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
