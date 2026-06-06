import React, { useState } from 'react';
import { Mail, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';

interface ForgotPasswordProps {
  onBack: () => void;
  onResetSuccess: () => void;
}

export default function ForgotPassword({ onBack, onResetSuccess }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
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
            {sent ? (
              <CheckCircle size={28} className="text-green-600" />
            ) : (
              <KeyRound size={28} className="text-[#603A2A]" />
            )}
          </div>
          <h2 className="font-display text-3xl font-bold text-[#2A1B15]">
            {sent ? 'Email envoyé !' : 'Mot de passe oublié'}
          </h2>
          <p className="text-sm text-[#8E887F] mt-2 font-sans">
            {sent 
              ? 'Consultez votre boîte de réception pour réinitialiser votre mot de passe.'
              : 'Entrez votre adresse email pour recevoir un lien de réinitialisation.'
            }
          </p>
        </div>

        {error && (
          <div className="relative z-10 mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
            <span className="text-lg leading-none">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {sent ? (
          <div className="relative z-10 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              <p className="font-bold mb-1">📧 Vérifiez votre email</p>
              <p>
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
                Le lien expire dans 60 minutes.
              </p>
            </div>
            <p className="text-xs text-center text-[#8E887F]">
              Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou{' '}
              <button 
                onClick={() => { setSent(false); setError(''); }}
                className="text-[#603A2A] font-bold hover:underline"
              >
                réessayez
              </button>.
            </p>
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-[#603A2A] text-[#F5EDE0] hover:bg-[#603A2A]/90 transition-all font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#2A1B15] mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F5EDE0]/50 border border-[#CDB58E]/40 rounded-xl focus:ring-2 focus:ring-[#CDB58E] focus:border-transparent outline-none transition-all text-[#2A1B15]"
                  placeholder="vous@exemple.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E887F]" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#603A2A] text-[#F5EDE0] hover:bg-[#603A2A]/90 transition-all font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
