import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Star,
  Navigation,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../utils/api';

// Fix icônes Leaflet avec Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icône utilisateur (point bleu)
const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;background:#3B82F6;border:3px solid white;
    border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Icône artisan (rond marron avec initiale)
const makeArtisanIcon = (nom: string, photoUrl: string | null, isSelected: boolean) =>
  L.divIcon({
    className: '',
    html: photoUrl
      ? `<div style="
          width:${isSelected ? 52 : 44}px;
          height:${isSelected ? 52 : 44}px;
          border-radius:50%;
          border:3px solid ${isSelected ? '#CDB58E' : 'white'};
          overflow:hidden;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          transition:all 0.2s;
        ">
          <img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;" />
        </div>`
      : `<div style="
          width:${isSelected ? 52 : 44}px;
          height:${isSelected ? 52 : 44}px;
          border-radius:50%;
          background:#603A2A;
          border:3px solid ${isSelected ? '#CDB58E' : 'white'};
          display:flex;align-items:center;justify-content:center;
          color:#CDB58E;font-weight:bold;font-size:18px;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
        ">${nom?.charAt(0).toUpperCase() || 'A'}</div>`,
    iconSize: [isSelected ? 52 : 44, isSelected ? 52 : 44],
    iconAnchor: [isSelected ? 26 : 22, isSelected ? 26 : 22],
  });

// Composant interne pour recentrer la carte quand userPos change
const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 1.2 });
  }, [lat, lng]);
  return null;
};

interface Artisan {
  id: number;
  nom: string;
  metier: string;
  categorie: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  note: number;
  photo_url: string | null;
  est_disponible: boolean;
  badge: string | null;
}

interface GpsPageProps {
  onSelectArtisan: (id: string) => void;
}

export const GpsPage: React.FC<GpsPageProps> = ({ onSelectArtisan }) => {
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hoveredArtisanId, setHoveredArtisanId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userLocationSimulated, setUserLocationSimulated] = useState<boolean>(true);
  const [userPos, setUserPos] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>('');

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  React.useEffect(() => {
    api.getCategories()
      .then(c => setCategories(c))
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    if (userPos) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        api.getNearbyArtisans(userPos.lat, userPos.lng, radiusKm, selectedCategory)
          .then((data) => {
            setArtisans(data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            alert("Erreur réseau: impossible de récupérer les artisans à proximité.");
            setIsLoading(false);
          });
      }, 500);

      // @ts-ignore : Simulation de l'appel Leaflet comme demandé
      if (typeof map !== 'undefined') {
        // map.flyTo([userPos.lat, userPos.lng], 13);
      }
      console.log(`Centrage de la carte sur : ${userPos.lat}, ${userPos.lng} avec rayon ${radiusKm}km`);

      return () => clearTimeout(timeoutId);
    }
  }, [userPos, radiusKm, selectedCategory]);

  const filteredArtisans = artisans; // Filtrage déjà fait côté API

  // Active Popup Artisan object
  const popupArtisan = artisans.find(a => a.id === selectedId);

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
              <span>
                {userPos && cityName
                  ? `📍 Position détectée : ${cityName} — ${artisans.length} artisan(s) trouvé(s)`
                  : 'Activez votre localisation pour voir les artisans disponibles près de chez vous'
                }
              </span>
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

          {/* Barre supérieure de contrôles */}
          <div className="relative z-[1000] bg-[#FFFFFF]/95 backdrop-blur-md p-3 m-3 rounded-xl border border-[#CDB58E]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">

            {/* Bouton Ma position */}
            <button
              onClick={() => {
                setRadiusKm(15);
                setSelectedCategory('');
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                      const lat = pos.coords.latitude;
                      const lng = pos.coords.longitude;
                      setUserPos({ lat, lng });
                      try {
                        const r = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                        );
                        const d = await r.json();
                        const city = d.address?.city
                          || d.address?.town
                          || d.address?.village
                          || d.address?.county
                          || d.display_name?.split(',')[0]
                          || `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
                        setCityName(city);
                      } catch {
                        setCityName(`${lat.toFixed(3)}, ${lng.toFixed(3)}`);
                      }
                    },
                    () => alert("Géolocalisation refusée ou indisponible")
                  );
                }
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 bg-[#603A2A] text-white transition-colors rounded-lg flex items-center gap-1.5 shrink-0 font-medium w-full sm:w-auto justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#603A2A]/80'}`}
            >
              <Navigation size={13} className={`fill-white ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Recherche...' : 'Ma position'}</span>
            </button>

            {/* Slider rayon */}
            <div className="flex items-center gap-2 w-full sm:w-48 bg-[#F9F9F9] px-3 py-1.5 rounded-lg border border-[#8E887F]/30">
              <span className="text-[#8E887F] shrink-0 font-badge">Rayon:</span>
              <input
                type="range" min="1" max="50" value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-[#CDB58E] h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[#CDB58E] font-bold shrink-0 w-8 text-right">{radiusKm}km</span>
            </div>

            {/* Filtre catégorie */}
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

          {/* VRAIE CARTE LEAFLET */}
          <div className="flex-1 relative" style={{ minHeight: '350px' }}>
            <MapContainer
              center={userPos ? [userPos.lat, userPos.lng] : [31.9, -6.9]}
              zoom={userPos ? 13 : 6}
              style={{ width: '100%', height: '100%', minHeight: '350px' }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              {/* Tuiles OpenStreetMap style sobre */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Recentrer la carte quand userPos change */}
              {userPos && <MapRecenter lat={userPos.lat} lng={userPos.lng} />}

              {/* Marqueur position utilisateur */}
              {userPos && (
                <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                  <Popup>
                    <div className="text-center text-xs font-bold text-[#603A2A]">
                      📍 {cityName || 'Vous êtes ici'}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Cercle rayon de recherche */}
              {userPos && (
                <Circle
                  center={[userPos.lat, userPos.lng]}
                  radius={radiusKm * 1000}
                  pathOptions={{
                    color: '#CDB58E',
                    fillColor: '#CDB58E',
                    fillOpacity: 0.08,
                    dashArray: '6 4',
                    weight: 1.5,
                  }}
                />
              )}

              {/* Marqueurs artisans */}
              {artisans.map((artisan) => (
                artisan.latitude && artisan.longitude ? (
                  <Marker
                    key={artisan.id}
                    position={[artisan.latitude, artisan.longitude]}
                    icon={makeArtisanIcon(artisan.nom, artisan.photo_url, selectedId === artisan.id)}
                    eventHandlers={{
                      click: () => {
                        setSelectedId(artisan.id);
                        document.getElementById(`artisan-card-${artisan.id}`)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      },
                    }}
                  >
                    <Popup>
                      <div style={{ minWidth: '160px' }}>
                        <div style={{ fontWeight: 'bold', color: '#603A2A', fontSize: '13px' }}>
                          {artisan.nom}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8E887F' }}>{artisan.metier}</div>
                        <div style={{ fontSize: '11px', marginTop: '4px' }}>
                          ⭐ {artisan.note} &nbsp;•&nbsp; 📍 {artisan.distance_km} km
                        </div>
                        {artisan.badge === 'OFPPT' && (
                          <span style={{
                            fontSize: '9px', background: '#603A2A', color: '#CDB58E',
                            padding: '1px 6px', borderRadius: '4px', marginTop: '4px',
                            display: 'inline-block'
                          }}>OFPPT</span>
                        )}
                        <button
                          onClick={() => onSelectArtisan(artisan.id.toString())}
                          style={{
                            marginTop: '8px', width: '100%', background: '#603A2A',
                            color: 'white', border: 'none', borderRadius: '6px',
                            padding: '5px', fontSize: '11px', cursor: 'pointer'
                          }}
                        >
                          Voir le profil →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              ))}

            </MapContainer>

            {/* Message si pas encore de position */}
            {!userPos && (
              <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm border border-[#CDB58E]/40 rounded-xl px-6 py-4 text-center shadow-lg">
                  <div className="text-3xl mb-2">📍</div>
                  <p className="text-sm font-bold text-[#603A2A]">Activez votre position</p>
                  <p className="text-xs text-[#8E887F] mt-1">
                    Cliquez sur "Ma position" ci-dessus
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer carte */}
          <div className="bg-[#FFFFFF]/90 text-[10px] text-center text-[#8E887F] py-1 border-t border-[#8E887F]/10 relative z-10">
            {userPos && cityName
              ? `📍 ${cityName} — ${artisans.length} artisan(s) dans un rayon de ${radiusKm} km`
              : 'Carte OpenStreetMap • Cliquez sur un marqueur pour voir le profil'
            }
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
              <div className="text-center py-12 text-[#8E887F] space-y-3">
                {!userPos ? (
                  <>
                    <div className="text-3xl">📍</div>
                    <p className="text-sm font-medium text-[#2A1B15]">
                      Activez votre position GPS
                    </p>
                    <p className="text-xs text-[#8E887F]">
                      Cliquez sur "Ma position" pour trouver<br/>les artisans près de chez vous
                    </p>
                  </>
                ) : isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-[#CDB58E] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs">Recherche en cours...</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs">Aucun Maâlem détecté dans ce rayon.</p>
                    <button
                      onClick={() => setRadiusKm(prev => Math.min(prev + 10, 50))}
                      className="text-xs text-[#CDB58E] underline"
                    >
                      Élargir le rayon à {Math.min(radiusKm + 10, 50)} km
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3 pr-1">
                {filteredArtisans.map((artisan) => {
                  const isHovered = hoveredArtisanId === artisan.id;
                  const isSelected = selectedId === artisan.id;

                  return (
                    <div
                      key={artisan.id}
                      id={`artisan-card-${artisan.id}`}
                      onMouseEnter={() => setHoveredArtisanId(artisan.id)}
                      onMouseLeave={() => setHoveredArtisanId(null)}
                      onClick={() => {
                        setSelectedId(artisan.id);
                        // @ts-ignore
                        if (typeof map !== 'undefined') {
                          // map.flyTo([artisan.latitude, artisan.longitude], 15, { duration: 0.8 });
                        }
                      }}
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
                          {artisan.photo_url ? (
                            <img src={artisan.photo_url} alt={artisan.nom} className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F5EDE0] text-[#603A2A] font-display font-bold text-xl">
                              {artisan.nom?.charAt(0).toUpperCase() || "A"}
                            </div>
                          )}
                        </div>

                        {/* Informations */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-display font-bold text-sm text-white truncate">
                              {artisan.nom}
                            </h4>
                            {/* Distance affichée en #CDB58E */}
                            <span className="text-xs font-bold text-[#CDB58E] shrink-0 font-badge">
                              {artisan.distance_km} km
                            </span>
                          </div>

                          <p className="text-xs text-[#F5EDE0] truncate font-sans">
                            {artisan.metier}
                          </p>

                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#CDB58E]">★ {artisan.note}</span>
                              {artisan.badge === 'OFPPT' && (
                                <span className="text-[9px] bg-[#CDB58E] text-[#2A1B15] px-1 rounded font-badge uppercase font-bold">
                                  OFPPT
                                </span>
                              )}
                            </div>

                            <span className={`text-[9px] px-1.5 py-0.2 rounded ${artisan.est_disponible ? 'text-emerald-400' : 'text-amber-400'
                              }`}>
                              {artisan.est_disponible ? '● Dispo' : 'Occupé'}
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
