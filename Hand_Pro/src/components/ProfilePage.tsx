import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Award, 
  Heart, 
  Share2, 
  Phone, 
  CheckCircle, 
  ZoomIn, 
  X, 
  MessageSquarePlus,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { api } from '../utils/api';

interface ProfilePageProps {
  artisanId: string;
  userType: 'Visitor' | 'Registered User' | 'Artisan';
  setUserType: (type: 'Visitor' | 'Registered User' | 'Artisan') => void;
  onBackToSearch?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  artisanId, 
  userType, 
  setUserType,
  onBackToSearch 
}) => {
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'services' | 'reviews' | 'calendar'>('about');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [lightboxImg, setLightboxImg] = useState<{url: string; caption: string} | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  
  // Modal RDV state
  const [showRdvModal, setShowRdvModal] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [rdvConfirmed, setRdvConfirmed] = useState<boolean>(false);
  const [rdvForm, setRdvForm] = useState({ name: '', phone: '', service: '', note: '' });

  // Reviews state
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  React.useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        const data = await api.getArtisan(artisanId);
        setArtisan(data);
        setReviewsList(data.reviews || []);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchArtisan();
  }, [artisanId]);

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    
    let clientName = userType === 'Artisan' ? 'Maâlem Partenaire' : 'Client Vérifié';
    const storedUserStr = localStorage.getItem('handpro_user');
    if (storedUserStr) {
      try {
        const u = JSON.parse(storedUserStr);
        if (u && u.name) clientName = u.name;
      } catch (err) {}
    }

    try {
      const res = await api.addReview(artisan.id, {
        clientName,
        clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        comment: newReviewText,
        rating: newReviewRating
      });

      if (res && res.review) {
        setReviewsList([res.review, ...reviewsList]);
        
        // Update artisan memory reference
        artisan.reviews = [res.review, ...(artisan.reviews || [])];
        artisan.rating = res.updated_rating;
        artisan.reviewCount = res.updated_review_count;

        setNewReviewText('');
        alert("Merci ! Votre avis a été publié et comptera dans la moyenne globale de ce Maâlem.");
      }
    } catch (err: any) {
      alert("Erreur lors de la publication de l'avis: " + err.message);
    }
  };

  const triggerRdv = (dayNumber?: number) => {
    setSelectedDay(dayNumber || 18);
    setShowRdvModal(true);
    setRdvConfirmed(false);
  };

  const handleConfirmRdv = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === 'Visitor') {
      alert("Vous devez être connecté pour envoyer une demande.");
      return;
    }

    if (!selectedDay) return;

    try {
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const dayStr = String(selectedDay).padStart(2, '0');
      const dateStr = `${new Date().getFullYear()}-${month}-${dayStr}`;
      
      await api.createClientRequest(artisan.id, dateStr);
      
      setRdvConfirmed(true);
      setTimeout(() => {
        setShowRdvModal(false);
        setRdvConfirmed(false);
        // Refresh artisan data to update calendar
        api.getArtisan(artisanId).then(data => setArtisan(data));
        alert(`Demande de rendez-vous envoyée à ${artisan.name} pour le ${dayStr}/${month}. L'artisan vous contactera après validation.`);
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'envoi de la demande");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#603A2A]"></div>
        <span className="ml-3 text-[#2A1B15] font-medium">Chargement du profil...</span>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE0]">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || "Artisan introuvable"}</p>
          {onBackToSearch && (
            <button onClick={onBackToSearch} className="mt-4 text-[#603A2A] underline">Retour à la recherche</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5EDE0] text-[#2A1B15] min-h-screen animate-fadeIn pb-20">
      
      {/* HEADER DU PROFIL */}
      <section className="w-full bg-[#2A1B15] relative overflow-hidden">
        
        {/* Photo de couverture : zone dégradée #2A1B15 → #603A2A avec motif géométrique marocain subtil */}
        <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-[#2A1B15] via-[#603A2A] to-[#2A1B15]">
          {artisan.coverPhoto ? (
            <img 
              src={artisan.coverPhoto} 
              alt="Couverture" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay object-center" 
            />
          ) : null}
          {/* Geometric pattern overlay overlay */}
          <div className="absolute inset-0 zellige-pattern opacity-60" />
          
          {/* Navigation back helper */}
          {onBackToSearch && (
            <button 
              onClick={onBackToSearch}
              className="absolute top-4 left-4 z-20 bg-[#2A1B15]/80 text-[#CDB58E] hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-[#CDB58E]/30 flex items-center gap-1 backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={14} />
              <span>Retour aux résultats</span>
            </button>
          )}
        </div>

        {/* Contenu principal du header superposé en bas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-8">
          
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 md:-mt-20 relative z-10">
            
            {/* Colonne Gauche: Photo + Titres */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left w-full md:w-auto">
              
              {/* Photo de profil : grande (120px), ronde, bordure blanche 4px + ombre */}
              <div className="relative shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-[#2A1B15] flex items-center justify-center text-[#CDB58E] font-bold text-5xl overflow-hidden">
                {artisan.avatar ? (
                  <img 
                    src={artisan.avatar} 
                    alt={artisan.name} 
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span>{artisan.name?.charAt(0).toUpperCase() || 'A'}</span>
                )}
                
                {/* Si certifié : badge diplôme doré overlaid en bas-droit de la photo */}
                {artisan.isCertified && (
                  <div className="absolute bottom-1 right-1 bg-[#CDB58E] text-[#2A1B15] p-1.5 rounded-full shadow border-2 border-white" title="Lauréat OFPPT">
                    <Award size={18} className="fill-[#2A1B15] text-[#CDB58E]" />
                  </div>
                )}
              </div>

              {/* Informations du nom et spécialité */}
              <div className="space-y-1 pb-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {/* Nom : Playfair Display, taille XL, couleur #CDB58E */}
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#CDB58E]">
                    {artisan.name}
                  </h1>
                </div>

                {/* Titre/Spécialité : DM Sans, blanc, #8E887F */}
                <p className="text-sm sm:text-base text-white font-medium">
                  {artisan.specialty}
                </p>

                {/* Infos rapides en ligne */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-[#8E887F] pt-2">
                  <span className="flex items-center gap-1 text-[#F5EDE0]">
                    <MapPin size={12} className="text-[#CDB58E]" />
                    {artisan.city}
                  </span>
                  <span>•</span>
                  {artisan.reviewCount > 0 ? (
                    <span className="flex items-center gap-1 text-[#CDB58E] font-bold">
                      <Star size={12} className="fill-[#CDB58E]" />
                      {artisan.rating} ({artisan.reviewCount} avis)
                    </span>
                  ) : (
                    <span className="text-[#CDB58E] font-bold text-[10px] uppercase bg-[#603A2A]/40 px-2 py-0.5 rounded">
                      Nouveau Maâlem
                    </span>
                  )}
                  <span>•</span>
                  <span>🔧 {artisan.experienceYears} ans de métier</span>
                  
                  {artisan.isCertified && (
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
              
              {/* "Prendre RDV" → #603A2A, plein, taille large */}
              <button
                onClick={() => triggerRdv()}
                className="px-6 py-2.5 bg-[#603A2A] text-white hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all rounded-lg font-bold text-xs sm:text-sm shadow-md"
              >
                Prendre RDV
              </button>

              {/* "Contacter" → bordure #CDB58E, texte #CDB58E */}
              <button
                onClick={() => {
                  if (userType === 'Visitor') {
                    alert("Numéro masqué pour les visiteurs. Basculement de la simulation en mode Utilisateur Connecté.");
                    setUserType('Registered User');
                  } else {
                    alert(`Appel direct initié au ${artisan.phone}`);
                  }
                }}
                className="px-4 py-2.5 bg-transparent border border-[#CDB58E] text-[#CDB58E] hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5"
              >
                <Phone size={14} />
                <span>Contacter</span>
              </button>

              {/* "Ajouter aux favoris" → cœur icône */}
              <button
                onClick={async () => {
                  if (userType === 'Visitor') {
                    alert("Vous devez être connecté pour ajouter aux favoris.");
                    setUserType('Registered User');
                    return;
                  }
                  setFavoriteLoading(true);
                  try {
                    if (isFavorited) {
                      await api.removeFavorite(artisanId);
                      setIsFavorited(false);
                    } else {
                      await api.addFavorite(artisanId);
                      setIsFavorited(true);
                    }
                  } catch (err: any) {
                    alert(err.message || "Erreur lors de la gestion des favoris");
                  } finally {
                    setFavoriteLoading(false);
                  }
                }}
                disabled={favoriteLoading}
                className={`p-2.5 rounded-lg border transition-all ${
                  isFavorited
                    ? 'bg-rose-950 border-rose-800 text-rose-400'
                    : 'bg-[#111B2F] border-[#8E887F]/30 text-[#8E887F] hover:text-[#CDB58E]'
                } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Favoris"
              >
                <Heart size={16} className={isFavorited ? 'fill-rose-400' : ''} />
              </button>

              {/* "Partager" → icône */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  alert("Lien du profil copié dans le presse-papier !");
                }}
                className="p-2.5 rounded-lg bg-[#111B2F] border border-[#8E887F]/30 text-[#8E887F] hover:text-[#CDB58E] transition-colors"
                title="Partager"
              >
                <Share2 size={16} />
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* CORPS : fond #F5EDE0, disposition 2 colonnes (sidebar droite + contenu principal) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CONTENU PRINCIPAL (8 colonnes sur desktop) */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Onglets navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-[#CDB58E]/30 p-1.5 flex items-center justify-between sm:justify-start gap-1 overflow-x-auto text-xs sm:text-sm">
              {([
                { id: 'about', label: 'À propos' },
                { id: 'portfolio', label: `Portfolio (${artisan.portfolio?.length || 0})` },
                { id: 'services', label: 'Services & Tarifs' },
                { id: 'reviews', label: `Avis (${reviewsList.length})` },
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
                
                {/* Description complète (texte) */}
                <div>
                  <h3 className="font-display font-bold text-lg text-[#2A1B15] mb-2 border-b border-[#F5EDE0] pb-2">
                    Présentation du Maâlem
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8E887F] leading-relaxed font-sans text-justify">
                    {artisan.description || (
                      <span className="italic">
                        Cet artisan vient de s'inscrire sur HandPro. Son profil détaillé sera bientôt complété.
                      </span>
                    )}
                  </p>
                </div>

                {/* Certifications / Diplômes (si التكوين المهني : encadré spécial doré avec sceau) */}
                {artisan.isCertified && (
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

                {/* Services proposés (badges/tags fond #603A2A) */}
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#2A1B15] uppercase tracking-wider mb-2 text-[#8E887F]">
                    Expertises Principales
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {artisan.services && artisan.services.length > 0 ? (
                      artisan.services.map((srv: any, index: number) => (
                        <span 
                          key={index}
                          className="bg-[#603A2A] text-[#F5EDE0] text-xs px-3 py-1 rounded-full font-medium shadow-xs"
                        >
                          ✓ {srv.name}
                        </span>
                      ))
                    ) : (
                      <span className="bg-[#F5EDE0] text-[#8E887F] text-xs px-3 py-1 rounded-full font-medium italic border border-[#CDB58E]/30">
                        Prestations définies sur devis ou appel
                      </span>
                    )}
                    {artisan.services && artisan.services.length > 0 && (
                      <span className="bg-[#2A1B15] text-[#CDB58E] text-xs px-3 py-1 rounded-full font-medium">
                        + Sur-mesure
                      </span>
                    )}
                  </div>
                </div>

                {/* Compétences (barres de progression couleur #CDB58E) */}
                {artisan.skills && artisan.skills.length > 0 && (
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#2A1B15] uppercase tracking-wider mb-3 text-[#8E887F]">
                      Compétences Techniques & Précision
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {artisan.skills.map((skill: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-[#2A1B15]">{skill.name}</span>
                            <span className="font-bold text-[#CDB58E] font-badge">{skill.percentage}%</span>
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
                )}

                {/* Informations de base complémentaires */}
                <div className="pt-2 border-t border-[#F5EDE0] grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#F5EDE0]/50 p-2 rounded">
                    <span className="text-[#8E887F] block text-[10px] uppercase">Expérience</span>
                    <span className="font-bold text-[#603A2A] font-display">{artisan.experienceYears} ans</span>
                  </div>
                  <div className="bg-[#F5EDE0]/50 p-2 rounded">
                    <span className="text-[#8E887F] block text-[10px] uppercase">Intervention</span>
                    <span className="font-bold text-[#603A2A] font-display">{artisan.city} & Rayon</span>
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
                      Cliquez sur une image pour examiner les détails d'assemblage et de finition.
                    </p>
                  </div>
                  <span className="text-xs bg-[#F5EDE0] text-[#603A2A] font-bold px-2.5 py-1 rounded">
                    {artisan.portfolio?.length || 0} Photos
                  </span>
                </div>

                {/* Grille masonry de photos de réalisations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {artisan.portfolio?.map((item: any) => (
                    <div 
                      key={item.id}
                      onClick={() => setLightboxImg({ url: item.url, caption: item.caption })}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#CDB58E]/20 group cursor-pointer relative aspect-video"
                    >
                      <img 
                        src={item.url} 
                        alt={item.caption} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B15]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white" />
                      
                      {/* Zoom hint button */}
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2A1B15]/80 text-[#CDB58E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={16} />
                      </div>

                      {/* Légende discrète sous chaque photo */}
                      <div className="absolute bottom-0 left-0 right-0 bg-[#2A1B15]/80 backdrop-blur-xs p-2 text-[11px] text-[#F5EDE0] truncate text-center">
                        {item.caption}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Placeholder si peu d'images */}
                {(!artisan.portfolio || artisan.portfolio.length <= 2) && (
                  <div className="bg-white/60 rounded-xl p-8 text-center border border-dashed border-[#8E887F]/30">
                    <p className="text-xs text-[#8E887F] italic">
                      D'autres chantiers récents sont en cours de validation photographique par l'équipe HandPro.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* ONGLET : SERVICES */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 space-y-4 animate-fadeIn">
                <h3 className="font-display font-bold text-lg text-[#2A1B15] mb-2 border-b border-[#F5EDE0] pb-2">
                  Prestations détaillées & Estimations
                </h3>

                {/* Liste des services avec description courte et prix optionnel */}
                <div className="space-y-4">
                  {artisan.services?.map((srv: any, idx: number) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-lg bg-[#F5EDE0]/40 border border-[#CDB58E]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-[#F5EDE0] transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-sm text-[#603A2A]">
                          {srv.name}
                        </h4>
                        <p className="text-xs text-[#8E887F]">
                          {srv.description}
                        </p>
                      </div>

                      {/* Optionnel : fourchette de prix */}
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
                
                {/* Résumé note globale (grand chiffre #CDB58E + barres par étoile) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  <div className="sm:col-span-4 text-center border-b sm:border-b-0 sm:border-r border-[#F5EDE0] pb-4 sm:pb-0">
                    <span className="font-display text-5xl font-bold text-[#CDB58E] block">
                      {artisan.rating}
                    </span>
                    <div className="flex justify-center text-[#CDB58E] my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#CDB58E]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#8E887F] block">
                      Basé sur {reviewsList.length} avis certifiés
                    </span>
                  </div>

                  {/* Barres par étoile simulées */}
                  <div className="sm:col-span-8 space-y-1.5 text-xs">
                    {[
                      { stars: '5★', pct: 90, count: Math.round(reviewsList.length * 0.9) || 1 },
                      { stars: '4★', pct: 10, count: Math.round(reviewsList.length * 0.1) || 0 },
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

                {/* Formulaire "Laisser un avis" (visible uniquement si connecté) */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20">
                  <h3 className="font-display font-bold text-base text-[#2A1B15] mb-3 flex items-center gap-2">
                    <MessageSquarePlus size={18} className="text-[#603A2A]" />
                    <span>Laisser un avis sur {artisan.name.split(' ')[1] || 'cet artisan'}</span>
                  </h3>

                  {userType === 'Visitor' ? (
                    <div className="bg-[#F5EDE0]/60 p-4 rounded-lg text-center space-y-2 border border-[#8E887F]/20">
                      <Lock size={16} className="mx-auto text-[#8E887F]" />
                      <p className="text-xs text-[#8E887F]">
                        Vous devez être connecté en tant que client ou professionnel pour publier une évaluation.
                      </p>
                      <button
                        onClick={() => setUserType('Registered User')}
                        className="px-3 py-1 bg-[#603A2A] text-white rounded text-xs font-medium hover:bg-[#603A2A]/90 transition-all"
                      >
                        Simuler la Connexion
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAddReviewSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs text-[#8E887F] mb-1 font-medium">Votre note</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <button
                              type="button"
                              key={st}
                              onClick={() => setNewReviewRating(st)}
                              className={`p-1 rounded text-sm ${newReviewRating >= st ? 'text-[#CDB58E]' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="text-xs text-[#603A2A] font-bold ml-2 self-center">{newReviewRating} / 5</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#8E887F] mb-1 font-medium">Votre commentaire détaillé</label>
                        <textarea
                          rows={3}
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="Décrivez les travaux réalisés, le respect des délais, la propreté du chantier..."
                          className="w-full bg-[#F5EDE0]/30 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A] text-[#2A1B15]"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 rounded text-xs font-bold transition-all"
                      >
                        Publier l'évaluation
                      </button>
                    </form>
                  )}
                </div>

                {/* Liste d'avis */}
                <div className="space-y-4">
                  {reviewsList.length === 0 ? (
                    <p className="text-xs text-[#8E887F] italic text-center py-4">Aucun avis rédigé pour le moment.</p>
                  ) : (
                    reviewsList.map((rev) => (
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
                      Disponibilités de Juin 2026
                    </h3>
                    <p className="text-xs text-[#8E887F]">
                      Sélectionnez une date libre pour formuler une demande de visite technique.
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

                  {/* Compute current month calendar */}
                  {(() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth(); // 0-indexed
                    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
                    // Convert to Mon=0 format
                    const offset = firstDay === 0 ? 6 : firstDay - 1;
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const today = now.getDate();
                    
                    const busyDatesSet = new Set(artisan.busyDates || []);
                    
                    const cells = [];
                    
                    // Empty offset cells for previous month
                    for (let i = 0; i < offset; i++) {
                      cells.push(
                        <div key={`empty-${i}`} className="p-2 text-gray-300 bg-gray-50 rounded"></div>
                      );
                    }

                    // Real days
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isBusy = busyDatesSet.has(dateStr);
                      const isPast = day < today;
                      const isDisabled = isBusy || isPast;

                      cells.push(
                        <button
                          key={day}
                          disabled={isDisabled}
                          onClick={() => triggerRdv(day)}
                          className={`p-2 sm:p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
                            isBusy 
                              ? 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed line-through opacity-70' 
                              : isPast
                                ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed opacity-50'
                                : 'bg-emerald-50/40 text-[#2A1B15] border-emerald-300/60 hover:bg-emerald-100 hover:border-emerald-400 font-bold cursor-pointer shadow-xs'
                          }`}
                          title={isBusy ? 'Journée réservée' : isPast ? 'Jour passé' : 'Cliquer pour prendre RDV'}
                        >
                          <span className="text-sm block">{day}</span>
                          {isBusy && <span className="text-[8px] block font-sans">Occupé</span>}
                          {!isBusy && !isPast && <span className="text-[8px] text-emerald-600 block font-sans">Dispo</span>}
                        </button>
                      );
                    }

                    return cells;
                  })()}
                </div>

                <div className="text-[11px] text-[#8E887F] text-center pt-2 italic">
                  * Le calendrier est synchronisé quotidiennement par l'artisan via son application mobile HandPro.
                </div>

              </div>
            )}

          </main>

          {/* SIDEBAR DROITE (sticky) (4 colonnes sur desktop) */}
          <aside className="lg:col-span-4 w-full space-y-6 sticky top-24">
            
            {/* Fond : fond blanc / crème, bordure fine #CDB58E */}
            <div className="bg-white rounded-xl p-5 shadow-md border-2 border-[#CDB58E] space-y-5">
              
              {/* Disponibilité : "Disponible cette semaine" (vert) ou "Occupé jusqu'au…" (orange) */}
              <div className="text-center pb-3 border-b border-[#F5EDE0]">
                <span className="text-xs text-[#8E887F] block uppercase font-badge tracking-wider mb-1">
                  Statut de réservation
                </span>
                
                {artisan.availability === 'available' ? (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Disponible cette semaine</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Occupé jusqu'au {artisan.busyUntil || '15 du mois'}</span>
                  </div>
                )}
              </div>

              {/* Bouton RDV proéminent */}
              <div className="space-y-2">
                <button
                  onClick={() => triggerRdv()}
                  className="w-full py-3 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-all font-bold rounded-lg shadow text-center block text-sm uppercase tracking-wider"
                >
                  📅 Demander un Devis / RDV
                </button>
                <p className="text-[10px] text-[#8E887F] text-center">
                  Réponse habituelle sous 2 heures par SMS
                </p>
              </div>

              {/* Numéro de téléphone (visible après connexion) */}
              <div className="pt-2 border-t border-[#F5EDE0]">
                <span className="text-xs text-[#8E887F] block mb-1.5 font-medium">Ligne téléphonique directe</span>
                
                {userType === 'Visitor' ? (
                  <div className="bg-[#111B2F] text-white p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-mono tracking-widest text-[#8E887F]">+212 6 •• •• •• ••</span>
                    <button
                      onClick={() => {
                        setUserType('Registered User');
                        alert("Simulation: Vous êtes désormais authentifié. Numéro déverrouillé.");
                      }}
                      className="bg-[#CDB58E] text-[#2A1B15] px-2 py-0.5 rounded font-badge uppercase text-[10px] font-bold"
                    >
                      Révéler
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#F5EDE0] p-2.5 rounded-lg flex items-center justify-between text-xs border border-[#CDB58E]/40">
                    <span className="font-mono font-bold text-[#603A2A] text-sm tracking-wide">
                      {artisan.phone}
                    </span>
                    <a 
                      href={`tel:${artisan.phone}`}
                      className="text-[10px] bg-[#603A2A] text-white px-2 py-1 rounded hover:bg-[#603A2A]/80 font-medium"
                    >
                      Appeler
                    </a>
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
                    src={`https://maps.google.com/maps?q=${artisan.lat},${artisan.lng}&hl=fr&z=14&output=embed`}
                    className="absolute inset-0 grayscale contrast-125 opacity-80"
                  />
                  <div className="absolute bottom-2 left-2 z-10 text-center p-1.5 px-3 bg-[#2A1B15]/90 rounded border border-[#CDB58E]/40 shadow-sm backdrop-blur-sm">
                    <span className="text-[10px] text-[#CDB58E] font-bold block">📍 {artisan.city}</span>
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

            {/* Assistance encadré */}
            <div className="bg-[#111B2F] text-[#F5EDE0] p-4 rounded-xl border border-[#8E887F]/30 text-xs text-center space-y-2 shadow">
              <span className="text-[#CDB58E] font-display font-bold block">Besoin d'assistance ?</span>
              <p className="text-[11px] text-[#8E887F]">
                Notre service conciergerie vous aide à comparer les devis de menuiserie ou d'agencement.
              </p>
              <button 
                onClick={() => alert("Un conseiller HandPro va vous recontacter d'ici peu.")}
                className="text-[#CDB58E] underline text-[10px] font-bold"
              >
                Contacter le support client
              </button>
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

      {/* MODAL PRISE DE RDV */}
      {showRdvModal && (
        <div className="fixed inset-0 z-50 bg-[#2A1B15]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-[#2A1B15] shadow-2xl border-2 border-[#CDB58E] relative">
            
            <button
              onClick={() => setShowRdvModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <span className="text-xs font-badge tracking-wider text-[#603A2A] uppercase block">
                Réservation Sécurisée
              </span>
              <h3 className="font-display font-bold text-xl text-[#2A1B15]">
                Rendez-vous avec {artisan.name}
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Créneau présélectionné : <strong className="text-[#603A2A]">Juin {selectedDay || 18}, 2026</strong>
              </p>
            </div>

            {rdvConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-scaleUp">
                  ✓
                </div>
                <h4 className="font-display font-bold text-base text-emerald-900">
                  Transmission en cours...
                </h4>
                <p className="text-xs text-[#8E887F]">
                  L'artisan reçoit actuellement une alerte sur son terminal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRdv} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#8E887F] mb-1 font-medium">Votre nom complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yassine El Mansouri"
                    value={rdvForm.name}
                    onChange={e => setRdvForm({...rdvForm, name: e.target.value})}
                    className="w-full bg-[#F5EDE0]/40 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8E887F] mb-1 font-medium">Numéro de téléphone marocain</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 06 61 00 00 00"
                    value={rdvForm.phone}
                    onChange={e => setRdvForm({...rdvForm, phone: e.target.value})}
                    className="w-full bg-[#F5EDE0]/40 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8E887F] mb-1 font-medium">Service souhaité</label>
                  <select
                    value={rdvForm.service}
                    onChange={e => setRdvForm({...rdvForm, service: e.target.value})}
                    className="w-full bg-[#F5EDE0]/40 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                  >
                    <option value="">Sélectionnez dans la liste</option>
                    {artisan.services.map((s:{name: string},i: number) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Autre">Autre projet / Devis global</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#8E887F] mb-1 font-medium">Détails de l'intervention (optionnel)</label>
                  <textarea
                    rows={2}
                    placeholder="Précisez la nature de la panne ou du meuble..."
                    value={rdvForm.note}
                    onChange={e => setRdvForm({...rdvForm, note: e.target.value})}
                    className="w-full bg-[#F5EDE0]/40 border border-[#8E887F]/30 rounded p-2 text-xs focus:outline-none focus:border-[#603A2A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-all font-bold rounded text-xs uppercase tracking-wider shadow"
                  >
                    Confirmer la demande
                  </button>
                </div>

                <p className="text-[10px] text-[#8E887F] text-center pt-1">
                  En cliquant sur confirmer, vous acceptez d'être recontacté par ce professionnel.
                </p>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
