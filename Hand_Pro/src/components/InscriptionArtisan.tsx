import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  IdCard,
  Hash,
  Briefcase,
  BadgeCheck,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { api } from "../utils/api";

// Composant InputField
function InputField({ icon, ...props }: any) {
  return (
    <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-5 py-3.5 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
      <span className="text-white/80 mr-3 shrink-0">{icon}</span>
      <input
        {...props}
        className="bg-transparent outline-none text-white placeholder-white/70 w-full"
      />
    </div>
  );
}

// Composant SelectField
function SelectField({ icon, name, value, onChange, placeholder, options }: any) {
  return (
    <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-5 py-3.5 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
      <span className="text-white/80 mr-3 shrink-0">{icon}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`bg-transparent outline-none w-full appearance-none cursor-pointer ${
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

// Composant principal InscriptionArtisan
export default function InscriptionArtisan({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    numero: "",
    cin: "",
    telephone: "",
    email: "",
    ville: "",
    metier: "",
    certifie: false,
    password: "",
    confirmPassword: "",
    conditions: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, categoriesData] = await Promise.all([
          api.getCities(),
          api.getCategories()
        ]);
        setCities(citiesData);
        setCategories(categoriesData.map((c: any) => c.name));
      } catch (err) {
        console.error("Failed to fetch form data", err);
      }
    };
    fetchData();
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
      const data = await api.register({
        name: `${form.prenom} ${form.nom}`,
        email: form.email,
        password: form.password,
        role: "Artisan",
        specialty: form.metier,
        city: form.ville,
        phone: form.telephone,
        cin: form.cin,
        is_certified: form.certifie,
      });

      // Store token
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 sm:p-8 relative"
      style={{ backgroundColor: "#f6e7c1", minHeight: "100vh" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

      {/* Toast succès */}
      {submitted && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-[slideIn_0.3s_ease-out]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Inscription réussie !</span>
        </div>
      )}

      <div className="relative w-full max-w-3xl z-10 my-10">
        {/* Card */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-white/80 text-sm sm:text-base">
              Vous avez déjà un compte ?{" "}
              <a
                href="#"
                className="font-semibold underline underline-offset-2 hover:text-amber-300 transition"
              >
                Connexion
              </a>
            </p>
            <h1 className="text-white text-4xl sm:text-5xl font-light mt-3 tracking-wide">
              Inscription Artisan
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Rejoignez notre plateforme et développez votre activité
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom + Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* CIN + Numéro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                icon={<IdCard className="w-5 h-5" />}
                name="cin"
                placeholder="CIN (Carte d'identité)"
                value={form.cin}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<Hash className="w-5 h-5" />}
                name="numero"
                placeholder="Numéro"
                value={form.numero}
                onChange={handleChange}
                required
              />
            </div>

            {/* Téléphone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Ville + Métier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                icon={<MapPin className="w-5 h-5" />}
                name="ville"
                value={form.ville}
                onChange={handleChange}
                placeholder="Sélectionnez une ville"
                options={cities}
              />
              <SelectField
                icon={<Briefcase className="w-5 h-5" />}
                name="metier"
                value={form.metier}
                onChange={handleChange}
                placeholder="Type d'artisan"
                options={categories}
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-5 py-3.5 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
                <span className="text-white/80 mr-3">
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
                  className="bg-transparent outline-none text-white placeholder-white/70 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Afficher le mot de passe"
                >
                  {showPwd ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className="relative">
              <div className="flex items-center backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-5 py-3.5 focus-within:border-amber-300/60 focus-within:bg-white/20 transition">
                <span className="text-white/80 mr-3">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmer le mot de passe"
                  required
                  className="bg-transparent outline-none text-white placeholder-white/70 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((s) => !s)}
                  className="text-white/70 hover:text-white transition"
                  aria-label="Afficher le mot de passe"
                >
                  {showConfirmPwd ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!passwordError && (
                <p className="text-white/50 text-xs mt-1 ml-5">Veuillez saisir le même mot de passe pour confirmation</p>
              )}
              {passwordError && (
                <p className="text-red-400 text-xs mt-1 ml-5">{passwordError}</p>
              )}
            </div>

            {/* Certifié */}
            <label className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-5 py-3 cursor-pointer hover:bg-white/15 transition group">
              <input
                type="checkbox"
                name="certifie"
                checked={form.certifie}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border-2 border-white/60 flex items-center justify-center peer-checked:bg-amber-400 peer-checked:border-amber-400 transition">
                {form.certifie && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <BadgeCheck
                className={`w-5 h-5 transition ${
                  form.certifie ? "text-amber-300" : "text-white/70"
                }`}
              />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  Je suis un artisan certifié
                </p>
                <p className="text-white/60 text-xs">
                  Cochez si vous disposez d'un diplôme ou d'une certification officielle
                </p>
              </div>
            </label>

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
                <a href="#" className="underline hover:text-amber-300">
                  conditions générales
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 bg-white/80 hover:bg-white text-slate-800 font-semibold py-4 rounded-full transition shadow-lg hover:shadow-amber-300/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              S'inscrire
            </button>
          </form>
        </div>

        <p className="text-center text-white/60 text-xs mt-6">
          © 2026 Espace Artisan — Tous droits réservés
        </p>
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
