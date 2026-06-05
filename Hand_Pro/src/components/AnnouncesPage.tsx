import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, Filter, X, ChevronLeft } from 'lucide-react';
import { api } from '../utils/api';

interface AnnouncesPageProps {
  onBack: () => void;
  onSelectAnnouncement: (ann: any) => void;
}

export const AnnouncesPage = ({ onBack, onSelectAnnouncement }: AnnouncesPageProps) => {

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  // Filters state
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Available filter options derived from data
  const cities = [...new Set(
    announcements.map(a => a.city || a.contact_address || '').filter(Boolean)
  )].sort();
  
  const categories = [...new Set(
    announcements.map(a => a.category || a.specialty || '').filter(Boolean)
  )].sort();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements().catch(() => []);
        const list = Array.isArray(data) ? data : (data?.announcements || []);
        setAnnouncements(list);
        setFiltered(list);
      } catch (err) {
        console.error(err);
        setAnnouncements([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...announcements];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.company_name || a.company || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter(a =>
        (a.city || a.contact_address || '') === selectedCity
      );
    }

    if (selectedCategory) {
      result = result.filter(a =>
        (a.category || a.specialty || '') === selectedCategory
      );
    }

    setFiltered(result);
  }, [searchText, selectedCity, selectedCategory, announcements]);

  const resetFilters = () => {
    setSearchText('');
    setSelectedCity('');
    setSelectedCategory('');
  };

  const hasActiveFilters = searchText || selectedCity || selectedCategory;

  const getRelativeDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const today = new Date();
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round(Math.abs(d2.getTime() - d1.getTime()) / 86400000);
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays <= 6) return `Il y a ${diffDays} jours`;
    if (diffDays <= 27) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>

      {/* HEADER */}
      <div style={{ background: '#09152e', padding: '24px 20px', 
      borderBottom: '3px solid #745b19' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: '1px solid #745b19',
            color: '#CDB58E', borderRadius: 8, padding: '8px 16px',
            cursor: 'pointer', fontSize: 14, marginBottom: 20 }}>
            <ChevronLeft size={16} /> Retour à l'accueil
          </button>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 40,
          fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Toutes les Offres
          </h1>
          <p style={{ color: '#8E887F', fontSize: 15 }}>
            {filtered.length} offre{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
            {hasActiveFilters ? ' (filtrées)' : ''}
          </p>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div style={{ background: 'white', padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
      position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search text */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, 
            top: '50%', transform: 'translateY(-50%)', color: '#8E887F' }} />
            <input
              type="text"
              placeholder="Rechercher une offre, entreprise..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 38px',
              border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14,
              boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {/* City filter */}
          <div style={{ position: 'relative', minWidth: 160 }}>
            <MapPin size={14} style={{ position: 'absolute', left: 10,
            top: '50%', transform: 'translateY(-50%)', color: '#745b19',
            pointerEvents: 'none' }} />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ padding: '10px 12px 10px 30px', border: '1px solid #e5e7eb',
              borderRadius: 8, fontSize: 14, background: 'white',
              cursor: 'pointer', appearance: 'none', minWidth: 160,
              color: selectedCity ? '#09152e' : '#8E887F' }}
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div style={{ position: 'relative', minWidth: 180 }}>
            <Filter size={14} style={{ position: 'absolute', left: 10,
            top: '50%', transform: 'translateY(-50%)', color: '#745b19',
            pointerEvents: 'none' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '10px 12px 10px 30px', border: '1px solid #e5e7eb',
              borderRadius: 8, fontSize: 14, background: 'white',
              cursor: 'pointer', appearance: 'none', minWidth: 180,
              color: selectedCategory ? '#09152e' : '#8E887F' }}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Reset filters button */}
          {hasActiveFilters && (
            <button onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', background: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: 'pointer' }}>
              <X size={14} /> Effacer
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#745b19',
          fontSize: 18 }}>Chargement des annonces...</div>

        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, color: '#09152e', fontWeight: 600,
            marginBottom: 8 }}>Aucune offre trouvée</p>
            <p style={{ fontSize: 14, color: '#8E887F', marginBottom: 24 }}>
              Essayez de modifier vos filtres de recherche
            </p>
            {hasActiveFilters && (
              <button onClick={resetFilters}
                style={{ padding: '10px 24px', background: '#745b19',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Voir toutes les offres
              </button>
            )}
          </div>

        ) : (
          <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20 }}>
            {filtered.map((ann) => (
              <div key={ann.id}
                onClick={() => setSelectedAnnouncement(ann)}
                style={{ background: '#09152e', borderRadius: 16,
                padding: 20, border: '1px solid rgba(142,136,127,0.2)',
                cursor: 'pointer', transition: 'all 0.2s',
                borderLeft: '4px solid #745b19',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', gap: 12 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div>
                  <span style={{ display: 'inline-block', padding: '3px 10px',
                  background: '#745b19', color: 'white', borderRadius: 20,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: 12 }}>
                    {ann.category || ann.specialty || 'Offre'}
                  </span>

                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white',
                  marginBottom: 6, lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ann.title || ''}
                  </h3>

                  <p style={{ fontSize: 13, color: '#745b19', fontWeight: 600,
                  marginBottom: 8 }}>
                    🏢 {ann.company_name || ann.company || ''}
                  </p>

                  <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ann.description || ''}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af',
                    display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} color="#745b19" />
                      {ann.city || ann.contact_address || ''}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af',
                    display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} />
                      {getRelativeDate(ann.created_at || ann.date || '')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedAnnouncement(ann); }}
                    style={{ width: '100%', padding: '10px',
                    background: 'rgba(116,91,25,0.15)',
                    border: '1px solid rgba(116,91,25,0.4)',
                    color: 'white', borderRadius: 8, fontSize: 13,
                    fontWeight: 600, cursor: 'pointer' }}>
                    Voir les détails →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedAnnouncement && (
        <div
          onClick={() => setSelectedAnnouncement(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, background: 'rgba(42,27,21,0.85)',
          backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'white', borderRadius: 20, padding: 32,
            maxWidth: 520, width: '100%', maxHeight: '90vh',
            overflowY: 'auto', position: 'relative',
            borderTop: '4px solid #745b19' }}
          >
            <button onClick={() => setSelectedAnnouncement(null)}
              style={{ position: 'absolute', top: 16, right: 16,
              background: 'none', border: 'none', fontSize: 24,
              cursor: 'pointer', color: '#8E887F', lineHeight: 1 }}>
              ×
            </button>

            <span style={{ display: 'inline-block', padding: '4px 12px',
            background: '#745b19', color: 'white', borderRadius: 20,
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            marginBottom: 16 }}>
              {selectedAnnouncement.category || 'Offre'}
            </span>

            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#09152e',
            marginBottom: 6 }}>
              {selectedAnnouncement.title}
            </h2>
            <p style={{ fontSize: 15, color: '#745b19', fontWeight: 600,
            marginBottom: 20 }}>
              🏢 {selectedAnnouncement.company_name || selectedAnnouncement.company}
            </p>

            <p style={{ fontSize: 14, color: '#45464d', lineHeight: 1.7,
            marginBottom: 24, fontStyle: 'italic' }}>
              {selectedAnnouncement.description}
            </p>

            <div style={{ background: '#fdf8ee', borderRadius: 12,
            padding: 16, marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#745b19',
              marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📋 Informations de contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={`mailto:${selectedAnnouncement.contact_email || selectedAnnouncement.email}`}
                  style={{ fontSize: 13, color: '#745b19', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 8 }}>
                  📧 {selectedAnnouncement.contact_email || selectedAnnouncement.email}
                </a>
                <a href={`tel:${selectedAnnouncement.contact_phone || selectedAnnouncement.phone}`}
                  style={{ fontSize: 13, color: '#09152e', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 8 }}>
                  📞 {selectedAnnouncement.contact_phone || selectedAnnouncement.phone}
                </a>
                {(selectedAnnouncement.city || selectedAnnouncement.contact_address) && (
                  <span style={{ fontSize: 13, color: '#45464d',
                  display: 'flex', alignItems: 'center', gap: 8 }}>
                    📍 {selectedAnnouncement.city || selectedAnnouncement.contact_address}
                  </span>
                )}
                {selectedAnnouncement.website && (
                  <a href={selectedAnnouncement.website} target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: '#745b19',
                    display: 'flex', alignItems: 'center', gap: 8 }}>
                    🌐 {selectedAnnouncement.website}
                  </a>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', paddingTop: 16,
            borderTop: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: 12, color: '#8E887F' }}>
                Publié {getRelativeDate(selectedAnnouncement.created_at || selectedAnnouncement.date)}
              </span>
              <button onClick={() => setSelectedAnnouncement(null)}
                style={{ padding: '10px 24px', background: '#09152e',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
