import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, Eye, MessageSquare, Megaphone, Edit2, Trash2, PlusCircle, Infinity as InfinityIcon, AlertCircle, CheckCircle, Save, Send, Building2, MapPin, Mail, Phone, Calendar, GraduationCap, UserMinus } from "lucide-react";
import { api } from "../utils/api";

export function ProfilAdmin() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    category: '',
    title: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    website: '',
    city: '',
    expires_at: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, announcementsRes] = await Promise.all([
        api.getAdminStats().catch(() => ({})),
        api.getAnnouncements().catch(() => []),
      ]);
      setStats(statsRes);
      setAnnouncements(Array.isArray(announcementsRes) ? announcementsRes : []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.company_name) errors.company_name = 'Nom de l\'entreprise requis';
    if (!formData.category) errors.category = 'Catégorie requise';
    if (!formData.title) errors.title = 'Titre requis';
    if (!formData.description) errors.description = 'Description requise';
    
    if (!formData.contact_email && !formData.contact_phone) {
      errors.contact_email = 'Email ou téléphone requis';
      errors.contact_phone = 'Email ou téléphone requis';
    } else {
      if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
        errors.contact_email = 'Email valide requis';
      }
    }
    
    if (!formData.city) errors.city = 'Ville requise';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        company_name: formData.company_name,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_address: formData.contact_address || null,
        website: formData.website || null,
        city: formData.city,
        expires_at: formData.expires_at || null,
      };

      console.log('Submitting announcement:', payload);

      if (editingAnnouncement) {
        await api.updateAnnouncement(editingAnnouncement.id, payload);
        alert('✅ Annonce modifiée avec succès');
      } else {
        await api.createAnnouncement(payload);
        alert('✅ Annonce publiée ! Visible sur la page d\'accueil.');
      }

      setShowForm(false);
      setEditingAnnouncement(null);
      resetForm();
      await loadDashboardData();

    } catch (err: any) {
      console.error('Submit error details:', err);
      alert('❌ ' + (err.message || 'Erreur inconnue'));
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '', category: '', title: '', description: '',
      contact_email: '', contact_phone: '', contact_address: '',
      website: '', city: '', expires_at: '',
    });
    setFormErrors({});
  };

  const handleEdit = (ann: any) => {
    setEditingAnnouncement(ann);
    setFormData({
      company_name: ann.company_name || ann.company || '',
      category: ann.category || '',
      title: ann.title || '',
      description: ann.description || ann.content || '',
      contact_email: ann.contact_email || ann.email || '',
      contact_phone: ann.contact_phone || ann.phone || '',
      contact_address: ann.contact_address || ann.address || '',
      website: ann.website || '',
      city: ann.city || '',
      expires_at: ann.expires_at ? ann.expires_at.substring(0, 10) : '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [announcementToDelete, setAnnouncementToDelete] = useState<any>(null);

  const confirmDelete = (ann: any) => {
    setAnnouncementToDelete(ann);
  };

  const executeDelete = async () => {
    if (!announcementToDelete) return;
    try {
      await api.deleteAnnouncement(announcementToDelete.id);
      loadDashboardData();
      alert("Annonce supprimée avec succès");
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression de l'annonce");
    } finally {
      setAnnouncementToDelete(null);
    }
  };

  const getExpiryStatus = (expires_at: string | null) => {
    if (!expires_at) return {
      icon: <InfinityIcon size={14} />,
      text: 'Pas de date limite',
      color: '#6b7280',
      bg: '#f3f4f6',
      isExpired: false
    };
    const expiry = new Date(expires_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry < today) return {
      icon: <AlertCircle size={14} />,
      text: `Expirée le ${expiry.toLocaleDateString('fr-FR')}`,
      color: '#dc2626',
      bg: '#fee2e2',
      isExpired: true
    };
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
    return {
      icon: <CheckCircle size={14} />,
      text: `Expire dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`,
      color: '#16a34a',
      bg: '#dcfce7',
      isExpired: false
    };
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5" }}>
        <div style={{ fontSize: 24, color: "#745b19" }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header - centered */}
        <div style={{ marginBottom: 30, textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 42, fontWeight: 600, color: "#09152e", marginBottom: 6 }}>
            États du Site
          </h1>
          <p style={{ fontSize: 15, color: "#8E887F" }}>Statistiques en temps réel et vue d’ensemble de la plateforme</p>
        </div>

        {/* Statistics Cards — 3 per row, 2 rows */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>

          {/* Artisans Certifiés — chapeau de diplôme */}
          <div className="glass-card" style={{ padding: 16, borderRadius: 10, background: "#ecfdf5", borderLeft: "4px solid #10b981", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", userSelect: 'none' }}>
            <GraduationCap className="mb-2" style={{ color: "#10b981", width: 24, height: 24 }} />
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 2 }}>
              Artisans Certifiés
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#10b981", marginBottom: 2 }}>
              {stats?.certified_artisans_count || 0}
            </p>
            <p style={{ fontSize: 11, color: "#8E887F" }}>Inscrits et vérifiés</p>
          </div>

          {/* Artisans Non Certifiés — icone simple */}
          <div className="glass-card" style={{ padding: 16, borderRadius: 10, background: "#fffbeb", borderLeft: "4px solid #f59e0b", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", userSelect: 'none' }}>
            <UserMinus className="mb-2" style={{ color: "#f59e0b", width: 24, height: 24 }} />
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 2 }}>
              Artisans Non Certifiés
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#f59e0b", marginBottom: 2 }}>
              {stats?.non_certified_artisans_count || 0}
            </p>
            <p style={{ fontSize: 11, color: "#8E887F" }}>Inscrits </p>
          </div>

          <div className="glass-card" style={{ padding: 16, borderRadius: 10, background: "#fdf8e7", borderLeft: "4px solid #745b19", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", userSelect: 'none' }}>
            <Users className="mb-2" style={{ color: "#745b19", width: 24, height: 24 }} />
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 2 }}>
              Clients Inscrits
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#745b19", marginBottom: 2 }}>
              {stats?.clients_count || 0}
            </p>
            <p style={{ fontSize: 11, color: "#8E887F" }}>Utilisateurs clients</p>
          </div>

          <div className="glass-card" style={{ padding: 16, borderRadius: 10, background: "#eff6ff", borderLeft: "4px solid #3b82f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", userSelect: 'none' }}>
            <Eye className="mb-2" style={{ color: "#3b82f6", width: 24, height: 24 }} />
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 2 }}>
              Visiteurs du site
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6", marginBottom: 2 }}>
              {stats?.visitors_count || 1520}
            </p>
            <p style={{ fontSize: 11, color: "#8E887F" }}>Trafic global (non inscrits)</p>
          </div>

          <div className="glass-card" style={{ padding: 16, borderRadius: 10, background: "#fef2f2", borderLeft: "4px solid #ef4444", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", userSelect: 'none' }}>
            <Megaphone className="mb-2" style={{ color: "#ef4444", width: 24, height: 24 }} />
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 2 }}>
              annonce d'emploi
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#ef4444", marginBottom: 2 }}>
              {stats?.announcements_count || announcements.length || 0}
            </p>
            <p style={{ fontSize: 11, color: "#8E887F" }}>Disponibles sur le site</p>
          </div>

          {/* Commentaires / Avis Home */}
          <div className="glass-card" style={{ padding: 16, borderRadius: 10, background: "#f5f3ff", borderLeft: "4px solid #8b5cf6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", userSelect: 'none' }}>
            <MessageSquare className="mb-2" style={{ color: "#8b5cf6", width: 24, height: 24 }} />
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 2 }}>
              Voix de Nos Clients
            </h3>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#8b5cf6", marginBottom: 2 }}>
              {stats?.comments_count || 0}
            </p>
            <p style={{ fontSize: 11, color: "#8E887F" }}>Commentaires sur l'accueil</p>
          </div>

        </div>

        {/* Announcements Section */}
        <div style={{ marginBottom: 40 }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{
                fontFamily: "'EB Garamond', serif", fontSize: 36,
                fontWeight: 600, color: '#09152e', marginBottom: 6
              }}>
                Annonces
              </h2>
              <p style={{ fontSize: 15, color: '#8E887F' }}>
                {announcements.length} annonce{announcements.length > 1 ? 's' : ''} publiée{announcements.length > 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={() => { resetForm(); setEditingAnnouncement(null); setShowForm(true); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#745b19', color: 'white',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <PlusCircle size={18} /> Nouvelle annonce
              </button>
            </div>
          </div>

          {/* Form Add / Edit */}
          {showForm && (
            <div style={{
              background: 'white', borderRadius: 12, padding: '20px 24px',
              marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #745b19'
            }}>
              <h3 style={{
                fontFamily: "'EB Garamond', serif", fontSize: 20,
                color: '#09152e', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
              }}>
                {editingAnnouncement ? <><Edit2 size={18} /> Modifier l'annonce</> : <><Megaphone size={18} /> Nouvelle annonce</>}
              </h3>

              {/* Row 1: Entreprise | Catégorie | Ville */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Entreprise *</label>
                  <input type="text" value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Atlas Construction"
                    style={{ width: '100%', padding: '8px 10px', border: formErrors.company_name ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                  {formErrors.company_name && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.company_name}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Catégorie *</label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: formErrors.category ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', background: 'white', color: '#09152e', fontWeight: 500 }}>
                    <option value="">Sélectionner...</option>
                    <option value="Électricité">Électricité</option>
                    <option value="Menuiserie">Menuiserie</option>
                    <option value="Plomberie">Plomberie</option>
                    <option value="Climatisation">Climatisation</option>
                    <option value="Maçonnerie">Maçonnerie</option>
                    <option value="Peinture">Peinture</option>
                    <option value="Carrelage">Carrelage</option>
                    <option value="Ferronnerie">Ferronnerie</option>
                    <option value="Jardinage">Jardinage</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {formErrors.category && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.category}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Ville *</label>
                  <input type="text" value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Casablanca"
                    style={{ width: '100%', padding: '8px 10px', border: formErrors.city ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                  {formErrors.city && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.city}</p>}
                </div>
              </div>

              {/* Row 2: Titre (full width) */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Titre de l'offre *</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Recherche Électricien Qualifié"
                  style={{ width: '100%', padding: '8px 10px', border: formErrors.title ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                {formErrors.title && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.title}</p>}
              </div>

              {/* Row 3: Description */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Description * <span style={{ color: '#8E887F', fontWeight: 400, textTransform: 'none', fontSize: 11 }}>({formData.description.length}/300)</span>
                </label>
                <textarea value={formData.description}
                  onChange={(e) => { if (e.target.value.length <= 300) setFormData({ ...formData, description: e.target.value }); }}
                  placeholder="Décrivez brièvement le poste et les compétences recherchées..."
                  style={{ width: '100%', padding: '8px 10px', border: formErrors.description ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, minHeight: 72, resize: 'vertical', boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                {formErrors.description && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.description}</p>}
              </div>

              {/* Row 4: Email | Téléphone | Date expiration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Email *</label>
                  <input type="email" value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@entreprise.com"
                    style={{ width: '100%', padding: '8px 10px', border: formErrors.contact_email ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                  {formErrors.contact_email && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.contact_email}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Téléphone *</label>
                  <input type="text" value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+212 6 XX XX XX XX"
                    style={{ width: '100%', padding: '8px 10px', border: formErrors.contact_phone ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                  {formErrors.contact_phone && <p style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{formErrors.contact_phone}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Expiration <span style={{ fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                  <input type="date" value={formData.expires_at}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                </div>
              </div>

              {/* Row 5: Adresse | Site web */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Adresse <span style={{ fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                  <input type="text" value={formData.contact_address}
                    onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                    placeholder="12 Rue Hassan II, Casablanca"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#09152e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Site web <span style={{ fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                  <input type="url" value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.entreprise.com"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, boxSizing: 'border-box', color: '#09152e', fontWeight: 500 }} />
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                <button onClick={handleSubmit}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '9px 24px', background: '#745b19', color: 'white',
                    border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}>
                  {editingAnnouncement ? <><Save size={15} /> Enregistrer les modifications</> : <><Send size={15} /> Publier l'annonce</>}
                </button>
                <button onClick={() => { setShowForm(false); setEditingAnnouncement(null); resetForm(); }}
                  style={{
                    padding: '9px 20px', background: '#f3f4f6', color: '#09152e',
                    border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Announcements List */}
          {announcements.length === 0 ? (
            <div style={{
              padding: 48, background: 'white', borderRadius: 16,
              textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Megaphone size={48} color="#8E887F" />
              </div>
              <p style={{ color: '#45464d', fontSize: 16 }}>Aucune annonce publiée</p>
              <p style={{ color: '#8E887F', fontSize: 14, marginTop: 4 }}>
                Cliquez sur "+ Nouvelle annonce" pour commencer
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {announcements.map((ann) => {
                const expiry = getExpiryStatus(ann.expires_at);
                const isExpired = expiry.isExpired;
                return (
                  <div key={ann.id} style={{
                    background: 'white', borderRadius: 12, padding: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: `4px solid ${isExpired ? '#dc2626' : '#745b19'}`,
                    opacity: isExpired ? 0.6 : 1
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: 16, flexWrap: 'wrap'
                    }}>
                      <div style={{ flex: 1 }}>

                        <div style={{
                          display: 'flex', alignItems: 'center',
                          gap: 8, marginBottom: 6, flexWrap: 'wrap'
                        }}>
                          <span style={{
                            padding: '2px 8px', background: '#745b19',
                            color: 'white', borderRadius: 20, fontSize: 10,
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}>
                            {ann.category || 'Offre'}
                          </span>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '2px 8px', background: expiry.bg,
                            color: expiry.color, borderRadius: 20,
                            fontSize: 10, fontWeight: 700
                          }}>
                            {expiry.icon} {expiry.text}
                          </span>
                        </div>

                        <h4 style={{
                          fontFamily: "'EB Garamond', serif", fontSize: 18,
                          fontWeight: 600, color: '#09152e', marginBottom: 2
                        }}>
                          {ann.title}
                        </h4>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#745b19', fontWeight: 600, marginBottom: 6 }}>
                          <Building2 size={14} /> {ann.company_name || ann.company}
                        </p>
                        <p style={{
                          fontSize: 12, color: '#45464d',
                          lineHeight: 1.5, marginBottom: 8
                        }}>
                          {ann.description || ann.content}
                        </p>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: '#8E887F' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {ann.city || 'Non spécifié'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {ann.contact_email || ann.email || 'Non spécifié'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {ann.contact_phone || ann.phone || 'Non spécifié'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> Publiée le {new Date(ann.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => handleEdit(ann)}
                          style={{
                            padding: '6px', background: '#f3f4f6', border: 'none',
                            borderRadius: 6, cursor: 'pointer', color: '#09152e'
                          }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => confirmDelete(ann)}
                          style={{
                            padding: '6px', background: '#fee2e2', border: 'none',
                            borderRadius: 6, cursor: 'pointer', color: '#dc2626'
                          }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Modal de confirmation de suppression */}
        {announcementToDelete && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: 'white', padding: 40, borderRadius: 20, maxWidth: 450,
              width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{
                marginBottom: 20, background: '#fee2e2',
                width: 100, height: 100, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <Trash2 size={48} color="#dc2626" />
              </div>
              <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: '#09152e', marginBottom: 16 }}>
                Supprimer l'annonce ?
              </h3>
              <p style={{ color: '#45464d', marginBottom: 32, fontSize: 16, lineHeight: 1.5 }}>
                Êtes-vous sûr de vouloir supprimer définitivement l'annonce <strong style={{ color: '#dc2626' }}>"{announcementToDelete.title}"</strong> ? Cette action est irréversible.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <button
                  onClick={() => setAnnouncementToDelete(null)}
                  style={{ flex: 1, padding: '14px 24px', background: '#f3f4f6', color: '#09152e', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Annuler
                </button>
                <button
                  onClick={executeDelete}
                  style={{ flex: 1, padding: '14px 24px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                >
                  Oui, supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
