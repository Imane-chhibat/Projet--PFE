import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { api } from "../utils/api";
import { ConditionsGeneralesModal } from "./ConditionsGeneralesModal";

// Composant InputField
function InputField({ icon, ...props }: any) {
  return (
    <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-4 py-2 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
      <span className="text-white/80 mr-2 shrink-0">{icon}</span>
      <input
        {...props}
        className="bg-transparent outline-none text-white placeholder-white/70 w-full text-sm"
      />
    </div>
  );
}

// Composant SelectField
function SelectField({ icon, name, value, onChange, placeholder, options }: any) {
  return (
    <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-4 py-2 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
      <span className="text-white/80 mr-2 shrink-0">{icon}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`bg-transparent outline-none w-full appearance-none cursor-pointer text-sm ${
          value ? "text-white" : "text-white/70"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 text-white/70 ml-2 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

// Composant principal InscriptionClient
interface InscriptionClientProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToChoix?: () => void;
}

export default function InscriptionClient({ onSuccess, onNavigateToLogin, onNavigateToChoix }: InscriptionClientProps) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    ville: "",
    password: "",
    confirmPassword: "",
    conditions: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [showConditionsModal, setShowConditionsModal] = useState(false);

  // Fetch cities dynamically
  useEffect(() => {
    api.getCities().then(setCities).catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Vérifier la confirmation du mot de passe
    if (name === "password" || name === "confirmPassword") {
      if (name === "password" && form.confirmPassword && value !== form.confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas");
      } else if (name === "confirmPassword" && form.password && value !== form.password) {
        setPasswordError("Les mots de passe ne correspondent pas");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.conditions) return;
    if (form.password !== form.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const { api } = await import("../utils/api");
      const res = await api.register({
        name: `${form.prenom} ${form.nom}`,
        email: form.email,
        password: form.password,
        role: "Registered User",
        city: form.ville,
        phone: form.telephone,
      });

      // Store token and user data after successful registration
      if (res.token) {
        localStorage.setItem('auth_token', res.token);
      }
      if (res.user) {
        localStorage.setItem('auth_user', JSON.stringify(res.user));
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div
      className="flex-1 w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-2 sm:p-4 relative"
      style={{ backgroundColor: "#f6e7c1", overflow: "hidden" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

      {/* Bouton Retour au choix (Outside card) */}
      {onNavigateToChoix && (
        <button
          onClick={(e) => { e.preventDefault(); onNavigateToChoix(); }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 text-white/70 hover:text-white transition flex items-center gap-1.5 text-sm bg-black/20 hover:bg-black/40 rounded-full px-4 py-2 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Retour au choix</span>
        </button>
      )}

      {/* Toast succès */}
      {submitted && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-[slideIn_0.3s_ease-out]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Inscription réussie !</span>
        </div>
      )}

      <ConditionsGeneralesModal 
        isOpen={showConditionsModal} 
        onClose={() => setShowConditionsModal(false)} 
      />

      <div className="relative w-full max-w-4xl z-10 my-1">
        {/* Card */}
        <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6">

          {/* Header */}
          <div className="text-center mb-3">
            <p className="text-white/80 text-sm sm:text-base">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={(e) => { e.preventDefault(); if (onNavigateToLogin) onNavigateToLogin(); }}
                className="font-bold text-[#2A1B15] underline underline-offset-2 hover:text-[#603A2A] transition"
              >
                Connexion
              </button>
            </p>
            <h1 className="text-white text-3xl sm:text-4xl font-light mt-1 tracking-wide">
              Inscription Client
            </h1>
            <p className="text-white/70 text-xs mt-1">
              Rejoignez notre plateforme pour trouver les meilleurs artisans
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Nom + Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                icon={<User className="w-5 h-5" />}
                name="prenom"
                placeholder="Prénom"
                value={form.prenom}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<User className="w-5 h-5" />}
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                required
              />
            </div>

            {/* Téléphone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                icon={<Phone className="w-5 h-5" />}
                name="telephone"
                type="tel"
                placeholder="Numéro de téléphone"
                value={form.telephone}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<Mail className="w-5 h-5" />}
                name="email"
                type="email"
                placeholder="Adresse e-mail"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Ville */}
            <div>
              <SelectField
                icon={<MapPin className="w-5 h-5" />}
                name="ville"
                value={form.ville}
                onChange={handleChange}
                placeholder="Sélectionnez votre ville"
                options={cities}
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-4 py-2 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
                <span className="text-white/80 mr-2">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  required
                  minLength={6}
                  className="bg-transparent outline-none text-white placeholder-white/70 w-full text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Afficher le mot de passe"
                >
                  {showPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className="relative">
              <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-4 py-2 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
                <span className="text-white/80 mr-2">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmer le mot de passe"
                  required
                  className="bg-transparent outline-none text-white placeholder-white/70 w-full text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((s) => !s)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Afficher le mot de passe"
                >
                  {showConfirmPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-[10px] mt-1 ml-4">{passwordError}</p>
              )}
            </div>

            {/* Conditions */}
            <label className="flex items-center gap-2 cursor-pointer pl-2">
              <input
                type="checkbox"
                name="conditions"
                checked={form.conditions}
                onChange={handleChange}
                className="peer sr-only"
                required
              />
              <div className="w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center peer-checked:bg-amber-400 peer-checked:border-amber-400 transition">
                {form.conditions && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white/80 text-sm">
                J'accepte les{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowConditionsModal(true); }}
                  className="underline hover:text-amber-300 font-semibold"
                >
                  conditions générales
                </button>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-1 bg-white/80 hover:bg-white text-slate-800 font-semibold py-2.5 rounded-full transition shadow-lg hover:shadow-amber-300/30 hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        select option {
          background: #1e293b;
          color: white;
        }
      `}</style>
    </div>
  );
}
