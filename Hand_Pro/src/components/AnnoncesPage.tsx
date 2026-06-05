import { useState, useEffect } from 'react';
import { MapPin, Search, Briefcase, ChevronRight, Calendar, X, Filter, Building2, Mail, Phone, Globe, ClipboardList, Inbox, Wrench, Eye } from 'lucide-react';
import { api } from '../utils/api';

const getRelativeDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays >= 2 && diffDays <= 6) {
    return `Il y a ${diffDays} jours`;
  } else if (diffDays >= 7 && diffDays <= 27) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
};

interface AnnoncesPageProps {
  onBack: () => void;
}

export const AnnoncesPage = ({ onBack }: AnnoncesPageProps) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [categories] = useState<string[]>([
    'Électricité', 'Menuiserie', 'Plomberie', 'Climatisation',
    'Maçonnerie', 'Peinture', 'Carrelage', 'Ferronnerie', 'Jardinage', 'Autre'
  ]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annData, citiesData] = await Promise.all([
          api.getAnnouncements(),
          api.getCities(),
        ]);
        setAnnouncements(Array.isArray(annData) ? annData : annData.announcements || []);
        setCities(citiesData);
      } catch (err) {
        console.error('Error fetching announcements data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchCity = !filterCity || ann.city?.toLowerCase() === filterCity.toLowerCase();
    const matchCategory = !filterCategory || ann.category?.toLowerCase() === filterCategory.toLowerCase();
    return matchCity && matchCategory;
  });

  const activeFilterCount = (filterCity ? 1 : 0) + (filterCategory ? 1 : 0);

  const clearFilters = () => {
    setFilterCity('');
    setFilterCategory('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5EDE0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CDB58E] border-t-[#603A2A] rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-[#603A2A] font-medium">Chargement des annonces...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE0] animate-fadeIn">

      {/* HERO HEADER */}
      <section className="bg-[#09152e] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#09152e] via-[#0d1f3c] to-[#09152e]"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 zellige-pattern"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          {/* Breadcrumb */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#CDB58E]/70 hover:text-[#CDB58E] transition-colors mb-6 text-sm group"
          >
            <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#745b19] text-xs font-bold tracking-widest uppercase mb-3">
                <Briefcase size={14} />
                <span>Espace B2B & Recrutement Pro</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
                Toutes les Annonces
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-xl">
                Explorez toutes les opportunités publiées par les entreprises du bâtiment et de l'artisanat marocain.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#745b19] text-2xl font-bold">{filteredAnnouncements.length}</span>
              <span className="text-gray-400 text-sm">
                annonce{filteredAnnouncements.length !== 1 ? 's' : ''} trouvée{filteredAnnouncements.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS + CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden w-full flex items-center justify-between bg-white rounded-xl p-4 mb-4 shadow-sm border border-[#CDB58E]/20"
        >
          <div className="flex items-center gap-2 text-[#09152e] font-bold text-sm">
            <Filter size={16} />
            <span>Filtres</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#745b19] text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
            )}
          </div>
          <ChevronRight size={16} className={`text-[#8E887F] transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">

          {/* SIDEBAR FILTERS */}
          <aside className={`md:w-72 shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl border border-[#CDB58E]/20 shadow-sm p-5 sticky top-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-bold text-[#09152e]">Filtrer par</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#745b19] hover:text-[#5a4614] font-medium flex items-center gap-1 transition-colors"
                  >
                    <X size={12} />
                    Effacer
                  </button>
                )}
              </div>

              {/* Filter by City */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-[#09152e] mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#745b19]" />
                  Ville
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full p-3 bg-[#F5EDE0]/50 border border-[#CDB58E]/30 rounded-xl text-sm text-[#09152e] focus:outline-none focus:border-[#745b19] focus:ring-1 focus:ring-[#745b19]/30 transition-all cursor-pointer"
                >
                  <option value="">Toutes les villes</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Category */}
              <div className="mb-2">
                <label className="block text-sm font-bold text-[#09152e] mb-2 flex items-center gap-1.5">
                  <Search size={14} className="text-[#745b19]" />
                  Type d'artisan
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 bg-[#F5EDE0]/50 border border-[#CDB58E]/30 rounded-xl text-sm text-[#09152e] focus:outline-none focus:border-[#745b19] focus:ring-1 focus:ring-[#745b19]/30 transition-all cursor-pointer"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Active filters pills */}
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-[#CDB58E]/20">
                  <p className="text-xs text-[#8E887F] mb-2 font-medium uppercase tracking-wider">Filtres actifs</p>
                  <div className="flex flex-wrap gap-2">
                    {filterCity && (
                      <span className="inline-flex items-center gap-1 bg-[#745b19]/10 text-[#745b19] text-xs font-medium px-3 py-1 rounded-full">
                        <MapPin size={12} className="shrink-0" /> {filterCity}
                        <button onClick={() => setFilterCity('')} className="hover:text-[#5a4614]"><X size={12} /></button>
                      </span>
                    )}
                    {filterCategory && (
                      <span className="inline-flex items-center gap-1 bg-[#745b19]/10 text-[#745b19] text-xs font-medium px-3 py-1 rounded-full">
                        <Wrench size={12} className="shrink-0" /> {filterCategory}
                        <button onClick={() => setFilterCategory('')} className="hover:text-[#5a4614]"><X size={12} /></button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ANNOUNCEMENTS GRID */}
          <div className="flex-1">
            {filteredAnnouncements.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#CDB58E]/20 shadow-sm p-12 text-center">
                <div className="mb-4 flex justify-center"><Inbox size={48} className="text-[#CDB58E]" /></div>
                <h3 className="font-display text-xl font-bold text-[#09152e] mb-2">
                  Aucune annonce trouvée
                </h3>
                <p className="text-sm text-[#8E887F] mb-4">
                  Essayez de modifier vos filtres pour voir plus de résultats.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-[#745b19] text-white rounded-lg text-sm font-bold hover:bg-[#5a4614] transition-colors"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-[#09152e] rounded-2xl p-5 border border-[#8E887F]/20 hover:border-[#745b19]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative shadow-lg hover:shadow-xl group"
                  >
                    <div className="flex flex-col items-start gap-4">
                      {/* Category badge */}
                      <span className="inline-block px-3 py-1 bg-[#745b19] text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
                        {ann.category}
                      </span>

                      {/* Company */}
                      <p className="text-lg text-[#745b19] font-bold flex items-center gap-1.5">
                        <Building2 size={18} className="text-[#745b19]" /> {ann.company}
                      </p>

                      {/* City */}
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} className="text-gray-400" />
                          {ann.city}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => setSelectedAnnouncement(ann)}
                        className="w-full py-2.5 rounded-lg bg-[#09152e] border border-[#8E887F]/20 text-white font-medium text-sm hover:bg-[#745b19]/10 hover:border-[#745b19] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye size={14} /> Voir plus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1B15]/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[520px] w-full shadow-2xl relative text-left flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#09152e] transition-colors text-2xl font-bold leading-none"
            >
              &times;
            </button>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#745b19] text-white text-[10px] font-bold tracking-wider uppercase rounded-full mb-3">
                {selectedAnnouncement.category}
              </span>
              <p className="text-2xl text-[#09152e] font-bold flex items-center gap-2">
                <Building2 size={22} className="text-[#745b19]" /> {selectedAnnouncement.company}
              </p>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto pr-2 flex-1">
              <div className="mb-6">
                <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Titre de l'offre</p>
                <h3 className="font-sans font-bold text-xl text-[#09152e] leading-tight">
                  {selectedAnnouncement.title}
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Description</p>
                <p className="text-base text-gray-600 italic leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedAnnouncement.description}
                </p>
              </div>

              <hr className="border-gray-200 my-6" />

              {/* CONTACT SECTION */}
              <div className="bg-[#fdf8ee] rounded-xl p-4 mb-6">
                <h4 className="font-bold text-[#745b19] mb-4 flex items-center gap-2">
                  <ClipboardList size={16} className="text-[#745b19]" /> Informations de contact
                </h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><Mail size={12} className="text-[#745b19]" /> Email :</span>
                    <a href={`mailto:${selectedAnnouncement.email || 'contact@example.com'}`} className="text-[#745b19] hover:underline font-medium break-all">
                      {selectedAnnouncement.email || 'contact@example.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><Phone size={12} className="text-[#745b19]" /> Tél. :</span>
                    <a href={`tel:${selectedAnnouncement.phone || '+212600000000'}`} className="text-[#09152e] hover:underline font-medium">
                      {selectedAnnouncement.phone || '+212 6 00 00 00 00'}
                    </a>
                  </div>
                  {(selectedAnnouncement.address || selectedAnnouncement.city) && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><MapPin size={12} className="text-[#745b19]" /> Adresse :</span>
                      <span className="text-gray-600 flex-1">
                        {selectedAnnouncement.address || selectedAnnouncement.city}
                      </span>
                    </div>
                  )}
                  {selectedAnnouncement.website && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium w-24 shrink-0 flex items-center gap-1"><Globe size={12} className="text-[#745b19]" /> Site web :</span>
                      <a href={selectedAnnouncement.website} target="_blank" rel="noopener noreferrer" className="text-[#745b19] hover:underline font-medium break-all">
                        {selectedAnnouncement.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <span className="text-sm text-gray-400 font-medium">
                Publié {getRelativeDate(selectedAnnouncement.created_at || selectedAnnouncement.date)}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-6 py-2.5 rounded-lg bg-[#09152e] text-white font-bold text-sm hover:bg-[#09152e]/90 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
