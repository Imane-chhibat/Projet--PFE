import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Award, 
  Grid, 
  List as ListIcon, 
  Heart, 
  RotateCcw, 
  SlidersHorizontal, 
  Check,
  Calendar
} from 'lucide-react';
import { api } from '../utils/api';
import { CertifiedBadge } from './CertifiedBadge';

interface SearchPageProps {
  initialCity?: string;
  initialSpecialty?: string;
  onSelectArtisan: (id: string) => void;
}

export const SearchPage = ({
  initialCity = '',
  initialSpecialty = '',
  onSelectArtisan
}: SearchPageProps) => {
  // Filters state
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    initialSpecialty ? [initialSpecialty] : []
  );
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyCertified, setOnlyCertified] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(50); // slider km

  // Active filter copy before apply (for simulated form trigger)
  const [appliedFilters, setAppliedFilters] = useState({
    city: initialCity,
    specialties: initialSpecialty ? [initialSpecialty] : [],
    rating: 0,
    available: false,
    certified: false,
    distance: 50
  });

  // Controls
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'pertinence' | 'note' | 'distance'>('pertinence');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Dynamic Data State
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, categoriesData, artisansData] = await Promise.all([
          api.getCities(),
          api.getCategories(),
          api.getArtisans()
        ]);
        setCities(citiesData);
        setCategories(categoriesData);
        setArtisans(artisansData);
      } catch (error) {
        console.error("Error fetching search page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync state if props change
  useEffect(() => {
    if (initialCity || initialSpecialty) {
      setSelectedCity(initialCity);
      setSelectedSpecialties(initialSpecialty ? [initialSpecialty] : []);
      setAppliedFilters({
        city: initialCity,
        specialties: initialSpecialty ? [initialSpecialty] : [],
        rating: 0,
        available: false,
        certified: false,
        distance: 50
      });
    }
  }, [initialCity, initialSpecialty]);

  const toggleSpecialty = (sp: string) => {
    if (selectedSpecialties.includes(sp)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== sp));
    } else {
      setSelectedSpecialties([...selectedSpecialties, sp]);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      city: selectedCity,
      specialties: selectedSpecialties,
      rating: minRating,
      available: onlyAvailable,
      certified: onlyCertified,
      distance: maxDistance
    });
    setCurrentPage(1);
    setIsMobileSidebarOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCity('');
    setSelectedSpecialties([]);
    setMinRating(0);
    setOnlyAvailable(false);
    setOnlyCertified(false);
    setMaxDistance(50);
    setAppliedFilters({
      city: '',
      specialties: [],
      rating: 0,
      available: false,
      certified: false,
      distance: 50
    });
    setCurrentPage(1);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter artisans logic
  const filteredArtisans = artisans.filter(artisan => {
    // City filter
    if (appliedFilters.city && artisan.city.toLowerCase() !== appliedFilters.city.toLowerCase()) {
      return false;
    }
    // Specialty
    if (appliedFilters.specialties.length > 0) {
      // check if any selected specialty matches or maps nicely
      const match = appliedFilters.specialties.some(sp => 
        artisan.specialty.toLowerCase().includes(sp.toLowerCase()) ||
        sp.toLowerCase().includes(artisan.specialty.toLowerCase().split('&')[0].trim())
      );
      if (!match) return false;
    }
    // Rating
    if (artisan.rating < appliedFilters.rating) {
      return false;
    }
    // Availability
    if (appliedFilters.available && artisan.availability !== 'available') {
      return false;
    }
    // Certified
    if (appliedFilters.certified && !artisan.isCertified) {
      return false;
    }
    // Distance
    if (artisan.distanceKm > appliedFilters.distance) {
      return false;
    }
    return true;
  });

  // Sort logic
  filteredArtisans.sort((a, b) => {
    if (sortBy === 'note') return b.rating - a.rating;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    // pertinence defaults to review count / custom order
    return b.reviewCount - a.reviewCount;
  });

  // Pagination logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage) || 1;
  const paginatedArtisans = filteredArtisans.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full min-h-screen bg-[#F5EDE0] text-[#2A1B15] animate-fadeIn pb-16">
      
      {/* Header local persistant de page recherche */}
      <div className="bg-[#111B2F] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-[#CDB58E]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#CDB58E]">
              Annuaire & Recherche Avancée
            </h1>
            <p className="text-xs text-[#8E887F] font-sans mt-1">
              Affinez votre sélection pour dénicher le Maâlem idéal pour vos travaux.
            </p>
          </div>

          {/* Quick inline search summary state */}
          <div className="flex items-center gap-2 flex-wrap text-xs bg-[#2A1B15] p-2 rounded-lg border border-[#8E887F]/30">
            <span className="text-[#8E887F]">Filtre actif :</span>
            <span className="text-[#CDB58E] font-medium">
              {appliedFilters.city || 'Toutes villes'}
            </span>
            <span>•</span>
            <span className="text-[#CDB58E] font-medium">
              {appliedFilters.specialties.length ? appliedFilters.specialties.join(', ') : 'Toutes spécialités'}
            </span>
            <button 
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="ml-2 px-2 py-1 bg-[#603A2A] text-white rounded md:hidden flex items-center gap-1"
            >
              <SlidersHorizontal size={12} />
              <span>{isMobileSidebarOpen ? 'Fermer' : 'Filtres'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corps du layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR FILTRES (280px sur desktop) */}
          <aside className={`w-full md:w-[280px] shrink-0 bg-[#2A1B15] text-[#F5EDE0] rounded-xl p-5 shadow-xl border border-[#CDB58E]/20 ${
            isMobileSidebarOpen ? 'block' : 'hidden md:block'
          }`}>
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#8E887F]/20">
              <span className="font-display font-bold text-base text-[#CDB58E]">
                Filtres de recherche
              </span>
              <button 
                onClick={handleResetFilters}
                className="text-[11px] text-[#8E887F] hover:text-white transition-colors flex items-center gap-1 border border-[#8E887F]/40 px-2 py-0.5 rounded"
                title="Réinitialiser"
              >
                <RotateCcw size={10} />
                <span>Effacer</span>
              </button>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Section 1: Ville / Région */}
              <div>
                <label className="block text-[#CDB58E] font-badge uppercase tracking-wider mb-2 font-medium">
                  Ville / Région
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#111B2F] border border-[#8E887F]/30 rounded p-2 text-[#F5EDE0] focus:outline-none focus:border-[#CDB58E]"
                >
                  <option value="">Toutes les villes du Maroc</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Section 2: Type d'artisan */}
              <div>
                <label className="block text-[#CDB58E] font-badge uppercase tracking-wider mb-2 font-medium">
                  Spécialité
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isChecked = selectedSpecialties.includes(cat.name);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleSpecialty(cat.name)}
                        className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                          isChecked 
                            ? 'bg-[#603A2A] text-white font-medium border-l-2 border-[#CDB58E]' 
                            : 'text-[#8E887F] hover:text-[#F5EDE0] hover:bg-[#111B2F]'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isChecked && <Check size={14} className="text-[#CDB58E] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Section 4: Disponibilité */}
              <div>
                <label className="block text-[#CDB58E] font-badge uppercase tracking-wider mb-2 font-medium">
                  Disponibilité
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#111B2F] p-2 rounded hover:bg-[#111B2F]/80">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded accent-[#603A2A]"
                  />
                  <span className="text-[#F5EDE0] flex items-center gap-1.5">
                    <Calendar size={13} className="text-emerald-400" />
                    <span>Disponible cette semaine</span>
                  </span>
                </label>
              </div>

              {/* Section 5: Certifié التكوين المهني */}
              <div className="pt-2 border-t border-[#8E887F]/20">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#CDB58E] font-badge uppercase tracking-wider font-medium block">
                    Diplôme التكوين المهني
                  </label>
                  <Award size={14} className="text-[#CDB58E]" />
                </div>
                <p className="text-[10px] text-[#8E887F] mb-2 leading-tight">
                  N'afficher que les Maâlems formés par les centres d'État (OFPPT)
                </p>
                <button
                  type="button"
                  onClick={() => setOnlyCertified(!onlyCertified)}
                  className={`w-full py-1.5 px-3 rounded font-bold font-badge tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    onlyCertified 
                      ? 'bg-[#CDB58E] text-[#2A1B15] shadow-inner border border-white' 
                      : 'bg-[#111B2F] text-[#8E887F] border border-[#8E887F]/30 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${onlyCertified ? 'bg-[#2A1B15]' : 'bg-transparent'}`} />
                  <span>{onlyCertified ? 'Certifié ON' : 'Désactivé'}</span>
                </button>
              </div>
              {/* Action buttons */}
              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-full py-2.5 bg-[#603A2A] text-white hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all font-bold rounded shadow uppercase tracking-wider"
                >
                  Appliquer les filtres
                </button>
              </div>

            </div>

          </aside>

          {/* ZONE DE RÉSULTATS */}
          <main className="flex-1 space-y-6">
            
            {/* Barre supérieure : Nombre de résultats + Tri + Toggle Grille/Liste */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#CDB58E]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="text-xs text-[#8E887F]">
                Affichage de <span className="font-bold text-[#2A1B15]">{filteredArtisans.length}</span> artisan{filteredArtisans.length > 1 ? 's' : ''} correspondant{filteredArtisans.length > 1 ? 's' : ''}
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                {/* Tri */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#8E887F] shrink-0 font-badge uppercase">Trier par:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#F5EDE0] text-[#2A1B15] font-medium border border-[#CDB58E]/40 rounded px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="pertinence">Pertinence & Avis</option>
                    <option value="note">Meilleure Note</option>
                    <option value="distance">Plus Proches (GPS)</option>
                  </select>
                </div>

                {/* Toggle Grille/Liste */}
                <div className="flex items-center bg-[#F5EDE0] p-1 rounded border border-[#CDB58E]/40 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#603A2A] text-white shadow' : 'text-[#8E887F] hover:text-[#2A1B15]'}`}
                    title="Vue grille"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-[#603A2A] text-white shadow' : 'text-[#8E887F] hover:text-[#2A1B15]'}`}
                    title="Vue liste"
                  >
                    <ListIcon size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* Liste vide fallback */}
            {filteredArtisans.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-[#CDB58E]/30 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#F5EDE0] text-[#603A2A] flex items-center justify-center mx-auto">
                  <Search size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#2A1B15]">
                  Aucun artisan ne correspond à vos critères
                </h3>
                <p className="text-xs text-[#8E887F] max-w-md mx-auto">
                  Essayez d'élargir votre zone de recherche, de réduire la note minimale exigée ou de réinitialiser l'ensemble des filtres.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#603A2A] text-white rounded text-xs font-medium hover:bg-[#603A2A]/90 transition-all"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            ) : (
              <>
                {/* Rendu dynamique des cartes en fonction du toggle */}
                {viewMode === 'grid' ? (
                  
                  /* VUE GRILLE */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {paginatedArtisans.map((artisan) => {
                      const isFav = favorites.includes(artisan.id);
                      return (
                        <div
                          key={artisan.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#CDB58E]/30 hover:border-[#CDB58E] hover:-translate-y-1 group flex flex-col justify-between"
                        >
                          <div>
                            {/* Photo artisan (rectangle haut avec overlay gradient bas) */}
                            <div className="relative h-48 w-full overflow-hidden bg-[#2A1B15]">
                              <img 
                                src={artisan.avatar} 
                                alt={artisan.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-top" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B15] via-transparent to-transparent opacity-80" />
                              
                              {/* Badge Certifié coin haut-droit */}
                              {artisan.isCertified && (
                                <div className="absolute top-3 right-3">
                                  <CertifiedBadge compact />
                                </div>
                              )}

                              {/* Distance overlay en bas gauche */}
                              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-[11px] bg-[#111B2F]/80 backdrop-blur-sm px-2 py-0.5 rounded">
                                <MapPin size={10} className="text-[#CDB58E]" />
                                <span>à {artisan.distanceKm} km</span>
                              </div>

                              {/* Disponibilité overlay bas droite */}
                              <div className="absolute bottom-3 right-3 text-[10px]">
                                <span className={`px-2 py-0.5 rounded font-medium ${
                                  artisan.availability === 'available' 
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}>
                                  {artisan.availability === 'available' ? '● Immédiat' : `Occupé`}
                                </span>
                              </div>
                            </div>

                            {/* Contenu carte */}
                            <div className="p-4 space-y-3">
                              
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  {/* Nom */}
                                  <h3 className="font-display font-bold text-lg text-[#2A1B15] leading-tight">
                                    {artisan.name}
                                  </h3>
                                  {/* Spécialité */}
                                  <p className="text-xs font-sans text-[#8E887F] mt-0.5">
                                    {artisan.specialty}
                                  </p>
                                </div>
                                
                                {/* Bouton Favoris (cœur contour) */}
                                <button
                                  onClick={() => toggleFavorite(artisan.id)}
                                  className={`p-1.5 rounded-full border transition-colors shrink-0 mt-0.5 ${
                                    isFav 
                                      ? 'bg-rose-50 border-rose-200 text-rose-600 fill-rose-600' 
                                      : 'border-[#8E887F]/30 text-[#8E887F] hover:text-rose-600 hover:border-rose-200'
                                  }`}
                                  title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                >
                                  <Heart size={16} className={isFav ? 'fill-rose-600' : ''} />
                                </button>
                              </div>

                              {/* Localisation et avis */}
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="flex items-center gap-1 font-medium text-[#603A2A]">
                                  <MapPin size={13} />
                                  {artisan.city}
                                </span>

                                <div className="flex items-center gap-1">
                                  <Star size={13} className="fill-[#CDB58E] text-[#CDB58E]" />
                                  <span className="font-bold text-[#2A1B15]">{artisan.rating}</span>
                                  <span className="text-[10px] text-[#8E887F]">({artisan.reviewCount})</span>
                                </div>
                              </div>

                              {/* Années d'expérience badge discret */}
                              <div className="pt-2 border-t border-[#F5EDE0] flex items-center justify-between">
                                <span className="text-[11px] text-[#8E887F] italic">
                                  {artisan.experienceYears} années de métier
                                </span>
                                <span className="text-[10px] bg-[#F5EDE0] text-[#603A2A] px-2 py-0.5 rounded font-badge uppercase tracking-wider">
                                  Devis Gratuit
                                </span>
                              </div>

                              {/* Jours disponibles */}
                              {artisan.busyDays && artisan.busyDays.length > 0 && (
                                <div className="pt-2 border-t border-[#F5EDE0]">
                                  <p className="text-[10px] text-[#8E887F] mb-1">Jours disponibles ce mois:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {[...Array(30)].map((_, i) => {
                                      const day = i + 1;
                                      const isBusy = artisan.busyDays.includes(day);
                                      return (
                                        <span
                                          key={day}
                                          className={`w-5 h-5 flex items-center justify-center text-[9px] rounded ${
                                            isBusy
                                              ? 'bg-gray-200 text-gray-400 line-through'
                                              : 'bg-emerald-100 text-emerald-700 font-bold'
                                          }`}
                                        >
                                          {day}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>

                          {/* Bouton "Voir profil" plein */}
                          <div className="p-4 pt-0">
                            <button
                              onClick={() => onSelectArtisan(artisan.id)}
                              className="w-full py-2 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-all text-xs font-medium rounded-lg text-center shadow-sm"
                            >
                              Voir le profil & réalisations
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                ) : (
                  
                  /* VUE LISTE COMPACTE */
                  <div className="space-y-4">
                    {paginatedArtisans.map((artisan) => {
                      const isFav = favorites.includes(artisan.id);
                      return (
                        <div
                          key={artisan.id}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#CDB58E]/30 hover:border-[#CDB58E] flex flex-col sm:flex-row items-center gap-4 justify-between"
                        >
                          {/* Photo ronde et badge */}
                          <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#CDB58E]">
                              <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover object-top" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display font-bold text-base text-[#2A1B15]">
                                  {artisan.name}
                                </h3>
                                {artisan.isCertified && <CertifiedBadge compact className="scale-90 origin-left" />}
                              </div>
                              <p className="text-xs text-[#8E887F]">
                                {artisan.specialty} • <span className="text-[#603A2A] font-medium">{artisan.city}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px]">
                                <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {artisan.availability === 'available' ? 'Disponible' : 'Occupé'}
                                </span>
                                <span className="text-[#8E887F]">
                                  📍 {artisan.distanceKm} km
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stats et infos au centre */}
                          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-y sm:border-y-0 py-2 sm:py-0 border-[#F5EDE0]">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="fill-[#CDB58E] text-[#CDB58E]" />
                              <span className="font-bold text-sm text-[#2A1B15]">{artisan.rating}</span>
                              <span className="text-xs text-[#8E887F]">({artisan.reviewCount} avis)</span>
                            </div>
                            <span className="text-xs text-[#8E887F] mt-1 hidden sm:block">
                              Expérience : {artisan.experienceYears} ans
                            </span>
                          </div>

                          {/* Boutons d'action à droite */}
                          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                            <button
                              onClick={() => toggleFavorite(artisan.id)}
                              className={`p-2 rounded border transition-colors ${
                                isFav 
                                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                  : 'border-[#8E887F]/30 text-[#8E887F] hover:text-rose-600'
                              }`}
                              title="Favoris"
                            >
                              <Heart size={16} className={isFav ? 'fill-rose-600' : ''} />
                            </button>
                            
                            <button
                              onClick={() => onSelectArtisan(artisan.id)}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-colors text-xs font-medium rounded shadow-sm text-center"
                            >
                              Profil complet
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="pt-6 flex items-center justify-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1 rounded border border-[#CDB58E]/40 bg-white text-[#2A1B15] text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5EDE0] transition-colors font-medium"
                    >
                      Précédent
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? 'bg-[#603A2A] text-white shadow'
                              : 'bg-white text-[#2A1B15] border border-[#CDB58E]/40 hover:bg-[#F5EDE0]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1 rounded border border-[#CDB58E]/40 bg-white text-[#2A1B15] text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5EDE0] transition-colors font-medium"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

        </div>
      </div>

    </div>
  );
};
