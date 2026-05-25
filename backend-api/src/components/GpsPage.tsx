import React, { useState } from 'react';
import {
  Star,
  Navigation,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../utils/api';

interface GpsPageProps {
  onSelectArtisan: (id: string) => void;
}

export const GpsPage: React.FC<GpsPageProps> = ({ onSelectArtisan }) => {
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hoveredArtisanId, setHoveredArtisanId] = useState<string | null>(null);
  const [activePopupId, setActivePopupId] = useState<string | null>('artisan-1');
  const [userLocationSimulated, setUserLocationSimulated] = useState<boolean>(true);

  const [artisans, setArtisans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([api.getArtisans(), api.getCategories()])
      .then(([a, c]) => {
        setArtisans(a);
        setCategories(c);
      })
      .catch(console.error);
  }, []);

  // Filter and sort by distance
  const filteredArtisans = artisans.filter(a => {
    if (a.distanceKm > radiusKm) return false;
    if (selectedCategory && !a.specialty.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  // Active Popup Artisan object
  const popupArtisan = artisans.find(a => a.id === activePopupId);

  return (
    <div className="w-full bg-[#FFFFFF] text-[#2A1B15] min-h-screen flex flex-col animate-fadeIn">

      {/* HEADER de la page */}
      <div className="bg-[#FFFFFF] border-b border-[#CDB58E]/30 py-6 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#CDB58E] font-badge tracking-wider uppercase mb-1">
              <Navigation size={14} className="animate-spin text-[#CDB58E]" style={{ animationDuration: '10s' }} />
              <span>Géolocalisation & Rayon Immédiat</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#CDB58E]">
              Artisans proches de vous
            </h1>
            <p className="text-xs text-[#8E887F] font-sans mt-0.5">
              Activez votre localisation pour voir les artisans disponibles près de chez vous
            </p>
          </div>

          {/* Simulateur d'état GPS */}
          <div className="flex items-center gap-2 bg-[#F9F9F9] p-2 rounded-lg border border-[#8E887F]/30 text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#8E887F]">Signal GPS:</span>
            <span className="text-[#2A1B15] font-medium">Actif (Précision Haute)</span>
            <button
              onClick={() => {
                setUserLocationSimulated(!userLocationSimulated);
                alert("Position mise à jour: Centré sur Bd Anfa, Casablanca.");
              }}
              className="ml-2 px-2 py-0.5 bg-[#603A2A] text-[#CDB58E] rounded text-[10px] hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all font-badge uppercase"
            >
              Recalibrer
            </button>
          </div>
        </div>
      </div>

      {/* Vue split : Carte interactive (60% gauche) + Liste artisans (40% droite) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-stretch overflow-hidden mb-16 lg:mb-20">

        {/* CARTE GPS (60% gauche) */}
        <section className="w-full lg:w-[60%] bg-[#FFFFFF] relative flex flex-col justify-between border-r border-[#CDB58E]/20 overflow-hidden min-h-[450px]">

          {/* Fond de carte simulé stylisé monochrome clair */}
          <div className="absolute inset-0 z-0 opacity-80 pointer-events-none select-none bg-[#F5F5F5]">
            {/* Custom SVG stylized layout representing map streets/intersections */}
            <svg className="w-full h-full stroke-[#2A1B15] stroke-[2]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#E5E5E5" strokeWidth="1" />
                </pattern>
                <radialGradient id="radiusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#CDB58E" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#CDB58E" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#CDB58E" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Simulated Moroccan coastline and highway network contours */}
              <path d="M-100 200 Q 200 150 400 300 T 900 200" fill="none" stroke="#2A1B15" strokeWidth="12" opacity="0.1" />
              <path d="M 100 -50 L 300 600" fill="none" stroke="#603A2A" strokeWidth="4" strokeDasharray="8 4" opacity="0.15" />
              <path d="M 500 0 L 200 700" fill="none" stroke="#603A2A" strokeWidth="3" opacity="0.1" />

              {/* Rayon de recherche : cercle de distance visible, couleur #CDB58E opacity 15% */}
              <circle
                cx="50%"
                cy="50%"
                r={`${Math.min(radiusKm * 7, 280)}`}
                fill="url(#radiusGlow)"
                stroke="#CDB58E"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx="50%" cy="50%" r="6" fill="#CDB58E" />
              <circle cx="50%" cy="50%" r="18" fill="none" stroke="#CDB58E" strokeWidth="1" className="animate-ping opacity-40" />
            </svg>

            {/* Custom mock labels */}
            <span className="absolute top-1/4 left-1/3 text-[10px] text-[#2A1B15]/40 font-badge tracking-widest uppercase rotate-12">
              Quartier des Habbous
            </span>
            <span className="absolute bottom-1/3 right-1/4 text-[10px] text-[#2A1B15]/40 font-badge tracking-widest uppercase -rotate-6">
              Sidi Maârouf • Technopark
            </span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-[#CDB58E] font-bold mt-4 bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#CDB58E]/30 shadow-sm">
              Vous êtes ici
            </span>
          </div>

          {/* Barre supérieure de la carte */}
          <div className="relative z-10 bg-[#FFFFFF]/90 backdrop-blur-md p-3 m-3 rounded-xl border border-[#CDB58E]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">

            {/* Bouton "Ma position" */}
            <button
              onClick={() => {
                setRadiusKm(15);
                setSelectedCategory('');
              }}
              className="px-3 py-1.5 bg-[#603A2A] text-white hover:bg-[#603A2A]/80 transition-colors rounded-lg flex items-center gap-1.5 shrink-0 font-medium w-full sm:w-auto justify-center"
            >
              <Navigation size={13} className="fill-white" />
              <span>Ma position</span>
            </button>

            {/* Slider distance (1km — 50km) */}
            <div className="flex items-center gap-2 w-full sm:w-48 bg-[#F9F9F9] px-3 py-1.5 rounded-lg border border-[#8E887F]/30">
              <span className="text-[#8E887F] shrink-0 font-badge">Rayon:</span>
              <input
                type="range"
                min="1"
                max="50"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-[#CDB58E] h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[#CDB58E] font-bold shrink-0 w-8 text-right">{radiusKm}km</span>
            </div>

            {/* Filtre rapide catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FFFFFF] text-[#2A1B15] border border-[#8E887F]/30 rounded-lg p-1.5 focus:outline-none focus:border-[#CDB58E] w-full sm:w-auto cursor-pointer"
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name.split('&')[0].trim()}>{c.name}</option>
              ))}
            </select>

          </div>

          {/* ZONE DE MARQUEURS ARTISANS SUR LA CARTE SIMULÉE */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {filteredArtisans.map((artisan, i) => {
              // Distribute pseudo-randomly but reliably around center
              // center is 50%, 50%
              // distanceKm dictates offset
              const angle = (i * 73) * (Math.PI / 180);
              const maxPxOffset = 220;
              const pxDist = (artisan.distanceKm / 50) * maxPxOffset + 30;
              const leftPercent = 50 + (Math.cos(angle) * (pxDist / 4));
              const topPercent = 50 + (Math.sin(angle) * (pxDist / 3));

              const isHovered = hoveredArtisanId === artisan.id;
              const isActive = activePopupId === artisan.id;

              return (
                <div
                  key={artisan.id}
                  style={{
                    left: `${Math.max(8, Math.min(92, leftPercent))}%`,
                    top: `${Math.max(15, Math.min(85, topPercent))}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300"
                >
                  {/* Marqueur personnalisé rond fond #603A2A photo artisan à l'intérieur */}
                  <button
                    onClick={() => setActivePopupId(artisan.id)}
                    onMouseEnter={() => setHoveredArtisanId(artisan.id)}
                    onMouseLeave={() => setHoveredArtisanId(null)}
                    className={`relative rounded-full p-0.5 transition-transform duration-200 group ${isActive || isHovered
                        ? 'scale-125 z-50 ring-4 ring-[#CDB58E] bg-[#603A2A] shadow-2xl'
                        : 'scale-100 z-10 bg-[#603A2A] hover:scale-110 shadow-md'
                      } ${artisan.isCertified ? 'border-2 border-[#CDB58E]' : 'border border-white/20'
                      }`}
                  >
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-10 h-10 rounded-full object-cover object-top"
                    />

                    {/* Sceau doré de badge certifié compact superposé */}
                    {artisan.isCertified && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CDB58E] text-[#2A1B15] rounded-full flex items-center justify-center text-[8px] font-bold shadow border border-[#2A1B15]">
                        ★
                      </span>
                    )}

                    {/* Distance tooltip minimaliste */}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#FFFFFF] text-[#CDB58E] text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#CDB58E]/30 whitespace-nowrap opacity-90 group-hover:opacity-100 shadow-sm">
                      {artisan.distanceKm} km
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* POPUP AU CLIC SUR MARQUEUR */}
          <div className="relative z-30 p-3 pointer-events-auto mt-auto">
            {popupArtisan ? (
              <div className="bg-[#FFFFFF] border-2 border-[#CDB58E] rounded-xl p-4 shadow-2xl max-w-md mx-auto animate-scaleUp flex gap-3 items-center justify-between">

                <div className="flex items-center gap-3 w-full overflow-hidden">
                  <img
                    src={popupArtisan.avatar}
                    alt={popupArtisan.name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#CDB58E] shrink-0 object-top"
                  />
                  <div className="overflow-hidden w-full">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-bold text-sm text-[#CDB58E] truncate">
                        {popupArtisan.name}
                      </h4>
                      {popupArtisan.isCertified && <span className="text-[9px] bg-[#603A2A] text-[#CDB58E] px-1 rounded">OFPPT</span>}
                    </div>

                    <p className="text-xs text-[#8E887F] truncate font-sans">
                      {popupArtisan.specialty}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="flex items-center text-[#CDB58E] font-bold">
                        <Star size={10} className="fill-[#CDB58E] mr-0.5" />
                        {popupArtisan.rating}
                      </span>
                      <span className="text-[#8E887F]">({popupArtisan.reviewCount} avis)</span>
                      <span>•</span>
                      <span className="text-[#2A1B15] font-medium">📍 à {popupArtisan.distanceKm} km</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectArtisan(popupArtisan.id)}
                  className="px-3 py-2 bg-[#603A2A] hover:bg-[#CDB58E] hover:text-[#2A1B15] text-white transition-all rounded text-xs font-medium shrink-0 shadow text-center block"
                >
                  Voir profil
                </button>

              </div>
            ) : (
              <div className="bg-[#FFFFFF]/90 backdrop-blur-sm p-2 rounded text-center text-xs text-[#8E887F] border border-[#8E887F]/20 shadow-sm">
                <Info size={12} className="inline mr-1" />
                Cliquez sur un marqueur sur la carte pour prévisualiser l'artisan
              </div>
            )}
          </div>

          {/* Instructions Map footer */}
          <div className="bg-[#FFFFFF]/90 text-[10px] text-center text-[#8E887F] py-1 border-t border-[#8E887F]/10 relative z-10">
            Carte interactive personnalisée • Rayon de détection mis à jour en temps réel
          </div>

        </section>

        {/* LISTE LATÉRALE (40% droite) */}
        <aside className="w-full lg:w-[40%] bg-[#FFFFFF] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto max-h-[650px] border-t lg:border-t-0 border-[#CDB58E]/20">

          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#8E887F]/20">
              <h3 className="font-display font-bold text-base text-[#CDB58E] flex items-center gap-2">
                <span>Résultats à proximité</span>
                <span className="text-xs bg-[#603A2A] text-white px-2 py-0.5 rounded-full font-sans">
                  {filteredArtisans.length}
                </span>
              </h3>
              <span className="text-[11px] text-[#8E887F]">
                Trié par distance
              </span>
            </div>

            {/* Cartes compactes horizontales */}
            {filteredArtisans.length === 0 ? (
              <div className="text-center py-12 text-[#8E887F] space-y-2">
                <p className="text-xs">Aucun Maâlem détecté dans ce rayon.</p>
                <button
                  onClick={() => setRadiusKm(50)}
                  className="text-xs text-[#CDB58E] underline"
                >
                  Élargir le rayon à 50 km
                </button>
              </div>
            ) : (
              <div className="space-y-3 pr-1">
                {filteredArtisans.map((artisan) => {
                  const isHovered = hoveredArtisanId === artisan.id;
                  const isSelected = activePopupId === artisan.id;

                  return (
                    <div
                      key={artisan.id}
                      onMouseEnter={() => setHoveredArtisanId(artisan.id)}
                      onMouseLeave={() => setHoveredArtisanId(null)}
                      onClick={() => setActivePopupId(artisan.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer border text-left relative ${isSelected
                          ? 'bg-[#603A2A] border-[#CDB58E] shadow-md translate-x-1'
                          : isHovered
                            ? 'bg-[#2A1B15] border-[#CDB58E]/60'
                            : 'bg-[#8E887F] border-white/20 hover:bg-[#2A1B15]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar compact */}
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#CDB58E]">
                          <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover object-top" />
                        </div>

                        {/* Informations */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-display font-bold text-sm text-white truncate">
                              {artisan.name}
                            </h4>
                            {/* Distance affichée en #CDB58E */}
                            <span className="text-xs font-bold text-[#CDB58E] shrink-0 font-badge">
                              {artisan.distanceKm} km
                            </span>
                          </div>

                          <p className="text-xs text-[#F5EDE0] truncate font-sans">
                            {artisan.specialty}
                          </p>

                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#CDB58E]">★ {artisan.rating}</span>
                              {artisan.isCertified && (
                                <span className="text-[9px] bg-[#CDB58E] text-[#2A1B15] px-1 rounded font-badge uppercase font-bold">
                                  OFPPT
                                </span>
                              )}
                            </div>

                            <span className={`text-[9px] px-1.5 py-0.2 rounded ${artisan.availability === 'available' ? 'text-emerald-400' : 'text-amber-400'
                              }`}>
                              {artisan.availability === 'available' ? '● Dispo' : 'Occupé'}
                            </span>
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <ChevronRight size={16} className={`shrink-0 transition-transform ${isSelected ? 'text-[#CDB58E] translate-x-0.5' : 'text-white/50'}`} />
                      </div>

                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#CDB58E] rounded-r" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scroll infini hint */}
          <div className="pt-4 mt-4 border-t border-[#8E887F]/10 text-center">
            <span className="inline-block text-[10px] text-[#8E887F] bg-[#F9F9F9] px-3 py-1 rounded-full shadow-sm">
              ↓ Scroll infini simulé actif • 12 autres à proximité
            </span>
          </div>

        </aside>

      </div>

    </div>
  );
};
