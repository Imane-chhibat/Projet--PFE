import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  Award, 
  Phone, 
  ZoomIn, 
  X, 
  Edit3,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';

interface ProfileData {
  id: string; 
  name: string; 
  specialty: string; 
  city: string;
  rating: number; 
  reviewCount: number; 
  isCertified: boolean;
  experienceYears: number; 
  avatar: string; 
  coverPhoto: string;
  phone: string; 
  availability: string; 
  description: string;
  services: any[]; 
  skills: any[]; 
  portfolio: any[]; 
  reviews: any[];
  busyUntil?: string;
  busyDays?: number[];
}

export default function MonProfilArtisan({ onBack }: { onBack?: () => void }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [lightboxImg, setLightboxImg] = useState<{url: string; caption: string} | null>(null);

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'services' | 'reviews' | 'calendar'>('about');
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [form, setForm] = useState({
    name: "", 
    phone: "", 
    city: "", 
    specialty: "",
    description: "", 
    experience_years: 0, 
    availability: "available",
    coverPhoto: "",
    avatar: "",
    busyDays: [] as number[]
  });

  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [newService, setNewService] = useState({ name: "", description: "", priceRange: "" });
  const [newPortfolioItem, setNewPortfolioItem] = useState({ url: "", caption: "" });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState({ name: "", percentage: 80 });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Profile state and helpers
  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await api.getArtisanRequests();
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const request = requests.find((r: any) => r.id === requestId);
      if (request && request.client?.phone) {
        // Formater le numéro de téléphone pour WhatsApp
        const phone = request.client.phone.replace(/\D/g, '');
        const message = encodeURIComponent(`Bonjour! J'ai accepté votre demande de rendez-vous pour le ${new Date(request.requested_date).toLocaleDateString('fr-FR')}. Quel type de service souhaitez-vous recevoir?`);
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
        
        // Ouvrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Mettre à jour le statut de la demande
        await api.acceptClientRequest(requestId);
        setToast("Demande acceptée avec succès !");
        loadRequests();
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await api.rejectClientRequest(requestId);
      setToast("Demande refusée");
      loadRequests();
      setTimeout(() => setToast(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [data, citiesData, categoriesData] = await Promise.all([
        api.getMyProfile(),
        api.getCities(),
        api.getCategories()
      ]);
      setProfile(data);
      setCities(citiesData);
      setCategories(categoriesData);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        city: data.city || "",
        specialty: data.specialty || "",
        description: data.description || "",
        experience_years: data.experienceYears || 0,
        availability: data.availability || "available",
        coverPhoto: data.coverPhoto || "",
        avatar: data.avatar || "",
        busyDays: data.busyDays || []
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name || "");
      formData.append('phone', form.phone || "");
      formData.append('city', form.city || "");
      formData.append('specialty', form.specialty || "");
      formData.append('description', form.description || "");
      formData.append('experience_years', (form.experience_years || 0).toString());
      formData.append('availability', form.availability || "available");
      formData.append('busyDays', JSON.stringify(form.busyDays || []));
      
      if (profile?.services) formData.append('services', JSON.stringify(profile.services));
      if (profile?.skills) formData.append('skills', JSON.stringify(profile.skills));
      
      if (avatarFile) formData.append('avatar', avatarFile);
      if (coverFile) formData.append('coverPhoto', coverFile);

      const res = await api.updateMyProfile(formData);
      setProfile(res.profile);
      setForm({
        name: res.profile.name || "",
        phone: res.profile.phone || "",
        city: res.profile.city || "",
        specialty: res.profile.specialty || "",
        description: res.profile.description || "",
        experience_years: res.profile.experienceYears || 0,
        availability: res.profile.availability || "available",
        coverPhoto: res.profile.coverPhoto || "",
        avatar: res.profile.avatar || "",
        busyDays: res.profile.busyDays || []
      });
      setEditing(false);
      setAvatarFile(null);
      setCoverFile(null);
      setToast("Profil mis à jour avec succès !");
      setTimeout(() => setToast(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    if (!newService.name) return;
    const updatedServices = [...(profile?.services || []), { ...newService, id: Date.now() }];
    setProfile({ ...profile!, services: updatedServices });
    setNewService({ name: "", description: "", priceRange: "" });
  };

  const handleDeleteService = (index: number) => {
    const updatedServices = profile?.services.filter((_, i) => i !== index) || [];
    setProfile({ ...profile!, services: updatedServices });
  };

  const handleAddPortfolio = async () => {
    if (!portfolioFile) return;
    if ((profile?.portfolio?.length || 0) >= 4) {
      setToast("La limite de 4 photos est atteinte.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    
    try {
      setSaving(true);
      const res = await api.uploadPortfolioImage(portfolioFile, newPortfolioItem.caption);
      const updatedPortfolio = [...(profile?.portfolio || []), res.item];
      setProfile({ ...profile!, portfolio: updatedPortfolio });
      setNewPortfolioItem({ url: "", caption: "" });
      setPortfolioFile(null);
      setToast("Photo ajoutée !");
      setTimeout(() => setToast(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (index: number) => {
    const itemToDelete = profile?.portfolio[index];
    if (!itemToDelete) return;

    try {
      setSaving(true);
      // Ensure we pass the ID to delete
      await api.deletePortfolioImage(itemToDelete.id.toString());
      const updatedPortfolio = profile?.portfolio.filter((_, i) => i !== index) || [];
      setProfile({ ...profile!, portfolio: updatedPortfolio });
      setToast("Photo supprimée.");
      setTimeout(() => setToast(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const updatedSkills = [...(profile?.skills || []), { ...newSkill, id: Date.now() }];
    setProfile({ ...profile!, skills: updatedSkills });
    setNewSkill({ name: "", percentage: 80 });
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = profile?.skills.filter((_, i) => i !== index) || [];
    setProfile({ ...profile!, skills: updatedSkills });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#603A2A]" />
        <span className="ml-3 text-lg text-[#2A1B15]">Chargement du profil...</span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          {onBack && (
            <button onClick={onBack} className="mt-4 text-[#603A2A] underline">Retour à l'accueil</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5EDE0] text-[#2A1B15] min-h-screen animate-fadeIn pb-20">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-[slideIn_0.3s_ease-out]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* HEADER DU PROFIL */}
      <section className="w-full bg-[#2A1B15] relative overflow-hidden">
        
        {/* Photo de couverture */}
        <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-[#2A1B15] via-[#603A2A] to-[#2A1B15]">
          {editing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
              <label className="cursor-pointer bg-white/20 hover:bg-white/30 border border-[#CDB58E]/50 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2">
                <Edit3 size={16} /> Changer la couverture
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setCoverFile(file);
                      setForm({ ...form, coverPhoto: URL.createObjectURL(file) });
                    }
                  }}
                />
              </label>
            </div>
          ) : null}
          {(form.coverPhoto || profile?.coverPhoto) ? (
            <img 
              src={form.coverPhoto || profile?.coverPhoto} 
              alt="Couverture" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay object-center absolute inset-0" 
            />
          ) : (
            <div className="w-full h-full absolute inset-0 bg-[#2A1B15] opacity-50" />
          )}
          <div className="absolute inset-0 zellige-pattern opacity-60" />
          
          {/* Navigation back helper */}
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute top-4 left-4 z-20 bg-[#2A1B15]/80 text-[#CDB58E] hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-[#CDB58E]/30 flex items-center gap-1 backdrop-blur-sm transition-all"
            >
              <X size={14} />
              <span>Retour</span>
            </button>
          )}


        </div>

        {/* Contenu principal du header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-8">
          
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 md:-mt-20 relative z-10">
            
            {/* Colonne Gauche: Photo + Titres */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left w-full md:w-auto">
              
              {/* Photo de profil et Espace Profil */}
              <div className="relative shrink-0 flex flex-col items-center">

                {editing ? (
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#603A2A]/80 flex items-center justify-center border-4 border-white shadow-xl relative overflow-hidden group cursor-pointer z-10">
                    {form.avatar || profile?.avatar ? (
                      <img 
                        src={form.avatar || profile?.avatar} 
                        alt="Avatar Preview" 
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[#CDB58E] font-bold text-5xl opacity-50">
                        {form.name?.charAt(0).toUpperCase() || profile?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    )}
                    <label className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-all">
                      <Edit3 size={24} className="mb-1" />
                      <span className="text-[10px] font-bold">Modifier</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setAvatarFile(file);
                            setForm({ ...form, avatar: URL.createObjectURL(file) });
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  (form.avatar || profile?.avatar) ? (
                    <img 
                      src={form.avatar || profile?.avatar} 
                      alt={profile?.name} 
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl object-top bg-[#2A1B15] relative z-10"
                    />
                  ) : (
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-[#2A1B15] flex items-center justify-center text-[#CDB58E] font-bold text-5xl overflow-hidden relative z-10">
                      <span>{profile?.name?.charAt(0).toUpperCase() || 'A'}</span>
                    </div>
                  )
                )}
                
                {/* Badge certifié */}
                {profile?.isCertified && (
                  <div className="absolute bottom-1 right-1 bg-[#CDB58E] text-[#2A1B15] p-1.5 rounded-full shadow border-2 border-white" title="Lauréat OFPPT">
                    <Award size={18} className="fill-[#2A1B15] text-[#CDB58E]" />
                  </div>
                )}
              </div>

              {/* Informations du nom et spécialité */}
              <div className="space-y-1 pb-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {editing ? (
                    <input 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#CDB58E] bg-transparent border-b border-[#CDB58E]/50 outline-none focus:border-[#CDB58E] w-auto"
                    />
                  ) : (
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#CDB58E]">
                      {profile?.name}
                    </h1>
                  )}
                </div>

                {editing ? (
                  <select 
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="text-sm sm:text-base text-white font-medium bg-transparent border-b border-[#CDB58E]/50 outline-none focus:border-[#CDB58E] w-auto cursor-pointer"
                  >
                    <option value="" className="text-[#2A1B15]">Sélectionner un métier</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name} className="text-[#2A1B15]">{cat.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm sm:text-base text-white font-medium">
                    {profile?.specialty}
                  </p>
                )}

                {/* Infos rapides */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-[#8E887F] pt-2">
                  <span className="flex items-center gap-1 text-[#F5EDE0]">
                    <MapPin size={12} className="text-[#CDB58E]" />
                    {editing ? (
                      <select 
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="bg-transparent border-b border-[#CDB58E]/50 outline-none focus:border-[#CDB58E] w-24 text-[#F5EDE0] cursor-pointer"
                      >
                        <option value="" className="text-[#2A1B15]">Ville</option>
                        {cities.map(c => (
                          <option key={c} value={c} className="text-[#2A1B15]">{c}</option>
                        ))}
                      </select>
                    ) : (
                      profile?.city
                    )}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#CDB58E] font-bold">
                    <Star size={12} className="fill-[#CDB58E]" />
                    {profile?.rating} ({profile?.reviewCount} avis)
                  </span>
                  <span>•</span>
                  {editing ? (
                    <span className="flex items-center gap-1">
                      <input 
                        type="number"
                        value={form.experience_years}
                        onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
                        className="bg-transparent border-b border-[#CDB58E]/50 outline-none focus:border-[#CDB58E] w-12 text-center text-[#F5EDE0]"
                      />
                      <span className="text-[#F5EDE0]">ans de métier</span>
                    </span>
                  ) : (
                    <span>🔧 {profile?.experienceYears} ans de métier</span>
                  )}
                  
                  {profile?.isCertified && (
                    <>
                      <span>•</span>
                      <span className="text-[#CDB58E] font-badge uppercase tracking-wider text-[11px] bg-[#603A2A]/80 px-2 py-0.5 rounded">
                        ✓ Certifié OFPPT
                      </span>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Colonne Droite: Boutons d'action */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 bg-[#603A2A] text-white hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all rounded-lg font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
                >
                  <Edit3 size={14} />
                  Modifier mon profil
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-500 transition-all rounded-lg font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Enregistrer
                </button>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* BARRE DE NOTIFICATION DES DEMANDES */}
      {requests.filter((r: any) => r.status === 'pending').length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-[#603A2A] to-[#8B5E3C] rounded-xl p-4 shadow-lg border border-[#CDB58E]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <h3 className="text-white font-bold text-sm">
                  {requests.filter((r: any) => r.status === 'pending').length} demande(s) en attente
                </h3>
              </div>
              <button
                onClick={() => setRequests([])}
                className="text-white/70 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>
            <div className="space-y-2">
              {requests.filter((r: any) => r.status === 'pending').slice(0, 2).map((request: any) => (
                <div
                  key={request.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                      {request.client?.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{request.client?.name || 'Client'}</p>
                      <p className="text-white/70 text-xs">
                        📅 {new Date(request.requested_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="px-2 py-1 bg-emerald-500 text-white rounded text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Accepter
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <X size={12} />
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
              {requests.filter((r: any) => r.status === 'pending').length > 2 && (
                <p className="text-white/70 text-xs text-center">
                  +{requests.filter((r: any) => r.status === 'pending').length - 2} autre(s) demande(s)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CORPS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CONTENU PRINCIPAL */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Onglets navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-[#CDB58E]/30 p-1.5 flex items-center justify-between sm:justify-start gap-1 overflow-x-auto text-xs sm:text-sm">
              {([
                { id: 'about', label: 'À propos' },
                { id: 'portfolio', label: `Portfolio (${profile?.portfolio?.length || 0})` },
                { id: 'services', label: 'Services & Tarifs' },
                { id: 'reviews', label: `Avis (${profile?.reviews?.length || 0})` },
                { id: 'calendar', label: 'Calendrier' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#603A2A] text-white shadow-sm font-bold'
                      : 'text-[#8E887F] hover:text-[#2A1B15]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ONGLET : À PROPOS */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 space-y-6 animate-fadeIn">
                
                {/* Description */}
                <div>
                  <h3 className="font-display font-bold text-lg text-[#2A1B15] mb-2 border-b border-[#F5EDE0] pb-2">
                    Présentation du Maâlem
                  </h3>
                  {editing ? (
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={6}
                      className="w-full bg-[#F5EDE0]/30 border border-[#8E887F]/30 rounded p-3 text-sm focus:outline-none focus:border-[#603A2A] text-[#2A1B15]"
                      placeholder="Décrivez votre expérience et savoir-faire..."
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-[#8E887F] leading-relaxed font-sans text-justify">
                      {profile?.description || "Aucune description. Cliquez sur Modifier pour ajouter une description."}
                    </p>
                  )}
                </div>

                {/* Certifications */}
                {profile?.isCertified && (
                  <div className="bg-gradient-to-r from-[#fff8f0] to-[#F5EDE0] p-4 rounded-xl border-2 border-[#CDB58E] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#603A2A] flex items-center justify-center shrink-0 border border-[#CDB58E]">
                      <Award size={24} className="text-[#CDB58E]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-badge font-bold text-[#603A2A] text-xs uppercase tracking-wider">
                          Certification d'État Vérifiée
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#2A1B15]">
                        Diplômé de l'Office de la Formation Professionnelle (OFPPT)
                      </h4>
                      <p className="text-xs text-[#8E887F] mt-0.5">
                        Ce statut garantit la maîtrise technique des standards de sécurité, d'isolation et de résistance mécanique en vigueur.
                      </p>
                    </div>
                  </div>
                )}

                {/* Compétences */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-sans font-bold text-xs text-[#2A1B15] uppercase tracking-wider text-[#8E887F]">
                      Compétences Techniques & Précision
                    </h4>
                    {editing && (
                      <button
                        onClick={handleAddSkill}
                        className="text-xs bg-[#603A2A] text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Plus size={12} /> Ajouter
                      </button>
                    )}
                  </div>
                  
                  {/* Formulaire ajout compétence */}
                  {editing && (
                    <div className="bg-[#F5EDE0]/40 p-3 rounded-lg mb-4 flex gap-2 items-center">
                      <input
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="Nom de la compétence"
                        className="flex-1 bg-white border border-[#CDB58E]/30 rounded px-3 py-1.5 text-xs"
                      />
                      <input
                        type="number"
                        value={newSkill.percentage}
                        onChange={(e) => setNewSkill({ ...newSkill, percentage: parseInt(e.target.value) || 0 })}
                        min="0"
                        max="100"
                        className="w-20 bg-white border border-[#CDB58E]/30 rounded px-3 py-1.5 text-xs"
                      />
                      <span className="text-xs text-[#8E887F]">%</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile?.skills?.map((skill, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs items-center">
                          <span className="font-medium text-[#2A1B15]">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#CDB58E] font-badge">{skill.percentage}%</span>
                            {editing && (
                              <button
                                onClick={() => handleDeleteSkill(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-[#F5EDE0] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#CDB58E] rounded-full transition-all duration-1000"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informations de base */}
                <div className="pt-2 border-t border-[#F5EDE0] grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#F5EDE0]/50 p-2 rounded">
                    <span className="text-[#8E887F] block text-[10px] uppercase">Expérience</span>
                    <span className="font-bold text-[#603A2A] font-display">{profile?.experienceYears} ans</span>
                  </div>
                  <div className="bg-[#F5EDE0]/50 p-2 rounded">
                    <span className="text-[#8E887F] block text-[10px] uppercase">Intervention</span>
                    <span className="font-bold text-[#603A2A] font-display">{profile?.city} & Rayon</span>
                  </div>
                  <div className="bg-[#F5EDE0]/50 p-2 rounded">
                    <span className="text-[#8E887F] block text-[10px] uppercase">Garantie</span>
                    <span className="font-bold text-[#603A2A] font-display">Assurance Pro</span>
                  </div>
                </div>

              </div>
            )}

            {/* ONGLET : PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-4 animate-fadeIn">
                
                <div className="bg-white rounded-xl p-4 border border-[#CDB58E]/20 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#2A1B15]">
                      Galerie de Réalisations
                    </h3>
                    <p className="text-xs text-[#8E887F]">
                      {editing ? "Ajoutez vos réalisations pour montrer votre savoir-faire." : "Cliquez sur une image pour examiner les détails."}
                    </p>
                  </div>
                  <span className="text-xs bg-[#F5EDE0] text-[#603A2A] font-bold px-2.5 py-1 rounded">
                    {profile?.portfolio?.length || 0} Photos
                  </span>
                </div>

                {/* Formulaire ajout portfolio */}
                {editing && (
                  <div className="bg-white rounded-xl p-4 border border-[#CDB58E]/20 space-y-3">
                    <h4 className="font-bold text-sm text-[#2A1B15]">Ajouter une réalisation</h4>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setPortfolioFile(file);
                            const url = URL.createObjectURL(file);
                            setNewPortfolioItem({ ...newPortfolioItem, url });
                          }
                        }}
                        className="w-full bg-[#F5EDE0]/30 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                      />
                      <input
                        type="text"
                        value={newPortfolioItem.caption}
                        onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, caption: e.target.value })}
                        placeholder="Description de la réalisation"
                        className="w-full bg-[#F5EDE0]/30 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                      />
                      <button
                        onClick={handleAddPortfolio}
                        disabled={saving || !portfolioFile}
                        className="px-4 py-2 bg-[#603A2A] text-white rounded text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} 
                        {saving ? "Ajout..." : "Ajouter au portfolio"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Grille portfolio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile?.portfolio?.map((item, index) => (
                    <div 
                      key={item.id || index}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#CDB58E]/20 group relative aspect-video"
                    >
                      <img 
                        src={item.url} 
                        alt={item.caption} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B15]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white" />
                      
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => setLightboxImg({ url: item.url, caption: item.caption })}
                          className="w-8 h-8 rounded-full bg-[#2A1B15]/80 text-[#CDB58E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ZoomIn size={16} />
                        </button>
                        {editing && (
                          <button
                            onClick={() => handleDeletePortfolio(index)}
                            className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-[#2A1B15]/80 backdrop-blur-xs p-2 text-[11px] text-[#F5EDE0] truncate text-center">
                        {item.caption}
                      </div>
                    </div>
                  ))}
                </div>

                {(!profile?.portfolio || profile.portfolio.length === 0) && (
                  <div className="bg-white/60 rounded-xl p-8 text-center border border-dashed border-[#8E887F]/30">
                    <p className="text-xs text-[#8E887F] italic">
                      {editing ? "Ajoutez vos premières réalisations en cliquant sur le formulaire ci-dessus." : "Aucune réalisation pour le moment."}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* ONGLET : SERVICES */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#F5EDE0] pb-2">
                  <h3 className="font-display font-bold text-lg text-[#2A1B15]">
                    Prestations détaillées & Estimations
                  </h3>
                  {editing && (
                    <button
                      onClick={handleAddService}
                      className="text-xs bg-[#603A2A] text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Plus size={12} /> Ajouter
                    </button>
                  )}
                </div>

                {/* Formulaire ajout service */}
                {editing && (
                  <div className="bg-[#F5EDE0]/40 p-4 rounded-lg space-y-3">
                    <h4 className="font-bold text-sm text-[#2A1B15]">Nouveau service</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Nom du service"
                        className="w-full bg-white border border-[#CDB58E]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                      />
                      <textarea
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder="Description du service"
                        rows={2}
                        className="w-full bg-white border border-[#CDB58E]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                      />
                      <input
                        type="text"
                        value={newService.priceRange}
                        onChange={(e) => setNewService({ ...newService, priceRange: e.target.value })}
                        placeholder="Fourchette de prix (ex: 500-1000 DH)"
                        className="w-full bg-white border border-[#CDB58E]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                      />
                      <button
                        onClick={handleAddService}
                        className="px-4 py-2 bg-[#603A2A] text-white rounded text-xs font-bold flex items-center gap-2"
                      >
                        <Plus size={12} /> Ajouter le service
                      </button>
                    </div>
                  </div>
                )}

                {/* Liste des services */}
                <div className="space-y-4">
                  {profile?.services?.map((srv, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-lg bg-[#F5EDE0]/40 border border-[#CDB58E]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-[#F5EDE0] transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans font-bold text-sm text-[#603A2A]">
                            {srv.name}
                          </h4>
                          {editing && (
                            <button
                              onClick={() => handleDeleteService(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#8E887F]">
                          {srv.description}
                        </p>
                      </div>

                      {srv.priceRange && (
                        <div className="shrink-0 bg-white px-3 py-1.5 rounded border border-[#CDB58E] text-right">
                          <span className="text-[9px] text-[#8E887F] block uppercase font-badge">Tarif indicatif</span>
                          <span className="font-bold text-xs text-[#2A1B15] whitespace-nowrap">{srv.priceRange}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50 rounded text-xs text-amber-900 border border-amber-200 mt-4">
                  💡 <strong>Note sur la tarification :</strong> Les prix sont affichés à titre indicatif. Chaque chantier nécessite un métré précis sur place ou sur plans pour la délivrance d'un devis officiel.
                </div>
              </div>
            )}

            {/* ONGLET : AVIS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Résumé note globale */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  <div className="sm:col-span-4 text-center border-b sm:border-b-0 sm:border-r border-[#F5EDE0] pb-4 sm:pb-0">
                    <span className="font-display text-5xl font-bold text-[#CDB58E] block">
                      {profile?.rating?.toFixed(1) || "0.0"}
                    </span>
                    <div className="flex justify-center text-[#CDB58E] my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#CDB58E]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#8E887F] block">
                      Basé sur {profile?.reviews?.length || 0} avis certifiés
                    </span>
                  </div>

                  {/* Barres par étoile */}
                  <div className="sm:col-span-8 space-y-1.5 text-xs">
                    {[
                      { stars: '5★', pct: 90, count: Math.round((profile?.reviews?.length || 0) * 0.9) || 1 },
                      { stars: '4★', pct: 10, count: Math.round((profile?.reviews?.length || 0) * 0.1) || 0 },
                      { stars: '3★', pct: 0, count: 0 },
                      { stars: '2★', pct: 0, count: 0 },
                      { stars: '1★', pct: 0, count: 0 },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-[#8E887F] shrink-0 font-badge">{row.stars}</span>
                        <div className="flex-1 h-2 bg-[#F5EDE0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#CDB58E] rounded-full" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-[#8E887F] text-[10px]">{row.count}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Liste d'avis */}
                <div className="space-y-4">
                  {(!profile?.reviews || profile.reviews.length === 0) ? (
                    <p className="text-xs text-[#8E887F] italic text-center py-4">Aucun avis rédigé pour le moment.</p>
                  ) : (
                    profile.reviews.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-xl p-4 shadow-xs border border-[#F5EDE0]">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <img src={rev.clientAvatar} alt={rev.clientName} className="w-8 h-8 rounded-full object-cover border border-[#CDB58E]" />
                            <div>
                              <h5 className="font-sans font-bold text-xs text-[#2A1B15]">{rev.clientName}</h5>
                              <span className="text-[9px] text-[#8E887F]">{rev.date}</span>
                            </div>
                          </div>
                          
                          <div className="flex text-[#CDB58E]">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={12} className="fill-[#CDB58E]" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-[#8E887F] font-sans leading-relaxed text-justify pl-10">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* ONGLET : CALENDRIER */}
            {activeTab === 'calendar' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#F5EDE0] pb-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#2A1B15]">
                      Disponibilités du Mois
                    </h3>
                    <p className="text-xs text-[#8E887F]">
                      {editing ? "Cliquez sur les jours pour les marquer comme occupés." : "Visualisez vos jours de disponibilité."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-[#F5EDE0] border border-[#CDB58E]" /> Libre
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-gray-100 border border-gray-300 line-through" /> Occupé
                    </span>
                  </div>
                </div>

                {/* Vue mensuelle simulée en grille */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                    <div key={d} className="py-1 text-[#CDB58E] font-badge uppercase">{d}</div>
                  ))}

                  {/* Empty offsets */}
                  <div className="p-2 text-gray-300 bg-gray-50 rounded">25</div>
                  <div className="p-2 text-gray-300 bg-gray-50 rounded">26</div>
                  <div className="p-2 text-gray-300 bg-gray-50 rounded">27</div>
                  <div className="p-2 text-gray-300 bg-gray-50 rounded">28</div>
                  <div className="p-2 text-gray-300 bg-gray-50 rounded">29</div>
                  <div className="p-2 text-gray-300 bg-gray-50 rounded">30</div>

                  {/* Real days */}
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    
                    // Extract days from actual requested appointments
                    const appointmentDays = profile?.busyDates
                      ? profile.busyDates.map((dateStr: string) => parseInt(dateStr.split('-')[2], 10))
                      : [];
                    const isAppointmentDay = appointmentDays.includes(day);
                    
                    // A day is busy if it's an appointment day, OR if it's manually marked as busy
                    const isBusy = isAppointmentDay || (editing ? form.busyDays.includes(day) : (profile?.busyDays?.includes(day) || false));

                    const toggleDay = () => {
                      if (!editing || isAppointmentDay) return;
                      const newBusyDays = form.busyDays.includes(day)
                        ? form.busyDays.filter(d => d !== day)
                        : [...form.busyDays, day];
                      setForm({ ...form, busyDays: newBusyDays });
                    };

                    return (
                      <button
                        key={day}
                        onClick={toggleDay}
                        disabled={!editing || isAppointmentDay}
                        className={`p-2 sm:p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
                          isBusy 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-60' 
                            : 'bg-[#F5EDE0]/40 text-[#2A1B15] border-[#CDB58E]/40 font-bold shadow-xs'
                        } ${editing ? 'cursor-pointer hover:bg-[#CDB58E] hover:text-[#2A1B15]' : ''}`}
                        title={isBusy ? 'Occupé' : 'Libre'}
                      >
                        <span className="text-sm block">{day}</span>
                        {!isBusy && <span className="text-[8px] text-[#603A2A] block font-sans">Dispo</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </main>

          {/* SIDEBAR DROITE */}
          <aside className="lg:col-span-4 w-full space-y-6 sticky top-24">
            
            <div className="bg-white rounded-xl p-5 shadow-md border-2 border-[#CDB58E] space-y-5">
              
              {/* Disponibilité */}
              <div className="text-center pb-3 border-b border-[#F5EDE0]">
                <span className="text-xs text-[#8E887F] block uppercase font-badge tracking-wider mb-1">
                  Statut de réservation
                </span>
                
                {editing ? (
                  <div className="flex justify-center gap-2 mt-2">
                    <button
                      onClick={() => setForm({ ...form, availability: "available" })}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${form.availability === "available" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      Disponible
                    </button>
                    <button
                      onClick={() => setForm({ ...form, availability: "busy" })}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${form.availability === "busy" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      Occupé
                    </button>
                  </div>
                ) : (
                  profile?.availability === 'available' ? (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Disponible cette semaine</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Occupé jusqu'au {profile?.busyUntil || '15 du mois'}</span>
                    </div>
                  )
                )}
              </div>

              {/* Numéro de téléphone */}
              <div className="pt-2 border-t border-[#F5EDE0]">
                <span className="text-xs text-[#8E887F] block mb-1.5 font-medium">Ligne téléphonique directe</span>
                
                {editing ? (
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full bg-[#F5EDE0] p-2.5 rounded-lg text-xs border border-[#CDB58E]/40 focus:outline-none focus:border-[#603A2A]"
                  />
                ) : (
                  <div className="bg-[#F5EDE0] p-2.5 rounded-lg flex items-center justify-between text-xs border border-[#CDB58E]/40">
                    <span className="font-mono font-bold text-[#603A2A] text-sm tracking-wide">
                      {profile?.phone || "Non renseigné"}
                    </span>
                    {/* Button removed as per request */}
                  </div>
                )}
              </div>

              {/* Zone de localisation avec carte */}
              <div className="space-y-1.5 pt-2 border-t border-[#F5EDE0]">
                <span className="text-xs text-[#8E887F] block font-medium">Zone couverte principale</span>
                
                <div className="w-full h-40 bg-[#111B2F] rounded-lg overflow-hidden relative border border-[#8E887F]/30">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${profile?.lat || 33.5731},${profile?.lng || -7.5898}&hl=fr&z=14&output=embed`}
                    className="absolute inset-0 grayscale contrast-125 opacity-80"
                  />
                  <div className="absolute bottom-2 left-2 z-10 text-center p-1.5 px-3 bg-[#2A1B15]/90 rounded border border-[#CDB58E]/40 shadow-sm backdrop-blur-sm pointer-events-none">
                    <span className="text-[10px] text-[#CDB58E] font-bold block">📍 {profile?.city}</span>
                  </div>
                </div>
              </div>

              {/* Charte de confiance */}
              <div className="bg-[#F5EDE0]/40 p-3 rounded-lg text-[11px] text-[#8E887F] space-y-1">
                <div className="font-bold text-[#2A1B15] flex items-center gap-1">
                  <CheckCircle size={12} className="text-[#603A2A]" />
                  <span>Garantie HandPro</span>
                </div>
                <p className="leading-tight text-[10px]">
                  Paiement direct à l'artisan après réception des travaux. Pas de frais de mise en relation cachés.
                </p>
              </div>

            </div>

          </aside>

        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-[#2A1B15]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 text-white hover:text-[#CDB58E] p-2 rounded-full bg-[#111B2F] border border-white/20"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl w-full text-center space-y-3">
            <img 
              src={lightboxImg.url} 
              alt={lightboxImg.caption} 
              className="max-h-[80vh] max-w-full mx-auto rounded-xl object-contain border-2 border-[#CDB58E]/40 shadow-2xl"
            />
            <p className="text-sm text-[#CDB58E] font-subtitle italic text-base">
              {lightboxImg.caption}
            </p>
            <button 
              onClick={() => setLightboxImg(null)}
              className="text-xs text-[#8E887F] hover:text-white underline"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
