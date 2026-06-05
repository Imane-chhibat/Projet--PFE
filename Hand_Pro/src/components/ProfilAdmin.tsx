import { useState, useEffect } from "react";
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
        api.getAdminStats(),
        api.getAnnouncements(),
      ]);
      setStats(statsRes);
      setAnnouncements(Array.isArray(announcementsRes) ? announcementsRes : (announcementsRes.announcements || []));
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      alert("Erreur lors du chargement des données du dashboard");
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
    if (!formData.contact_email || !/\S+@\S+\.\S+/.test(formData.contact_email)) 
      errors.contact_email = 'Email valide requis';
    if (!formData.contact_phone) errors.contact_phone = 'Téléphone requis';
    if (!formData.city) errors.city = 'Ville requise';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (editingAnnouncement) {
        await api.updateAnnouncement(editingAnnouncement.id, formData);
        alert('Annonce modifiée avec succès');
      } else {
        await api.createAnnouncement(formData);
        alert('Annonce ajoutée avec succès');
      }
      setShowForm(false);
      setEditingAnnouncement(null);
      resetForm();
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
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

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
    try {
      await api.deleteAnnouncement(id);
      loadDashboardData();
      alert("Annonce supprimée avec succès");
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression de l'annonce");
    }
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
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 48, fontWeight: 500, color: "#09152e", marginBottom: 8 }}>
            Dashboard Admin
          </h1>
          <p style={{ fontSize: 16, color: "#8E887F" }}>Vue d'ensemble de la plateforme</p>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 48 }}>
          <div className="glass-card" style={{ padding: 32, borderRadius: 16, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 600, color: "#09152e", marginBottom: 8 }}>
              Clients
            </h3>
            <p style={{ fontSize: 48, fontWeight: 700, color: "#745b19", marginBottom: 8 }}>
              {stats?.clients_count || 0}
            </p>
            <p style={{ fontSize: 14, color: "#8E887F" }}>Utilisateurs inscrits</p>
          </div>

          <div className="glass-card" style={{ padding: 32, borderRadius: 16, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 600, color: "#09152e", marginBottom: 8 }}>
              Artisans Certifiés
            </h3>
            <p style={{ fontSize: 48, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>
              {stats?.certified_artisans_count || 0}
            </p>
            <p style={{ fontSize: 14, color: "#8E887F" }}>Professionnels vérifiés</p>
          </div>

          <div className="glass-card" style={{ padding: 32, borderRadius: 16, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 600, color: "#09152e", marginBottom: 8 }}>
              Artisans Non Certifiés
            </h3>
            <p style={{ fontSize: 48, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>
              {stats?.non_certified_artisans_count || 0}
            </p>
            <p style={{ fontSize: 14, color: "#8E887F" }}>En attente de vérification</p>
          </div>
        </div>

        {/* Announcements Section */}
        <div style={{ marginBottom: 40 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, 
              fontWeight: 500, color: '#09152e', marginBottom: 4 }}>
                Annonces
              </h2>
              <p style={{ fontSize: 14, color: '#8E887F' }}>
                {announcements.length} annonce{announcements.length > 1 ? 's' : ''} publiée{announcements.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setEditingAnnouncement(null); setShowForm(true); }}
              style={{ padding: '12px 24px', background: '#745b19', color: 'white',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              + Nouvelle annonce
            </button>
          </div>

          {/* Form Add / Edit */}
          {showForm && (
            <div style={{ background: 'white', borderRadius: 16, padding: 32, 
            marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #745b19' }}>
              <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, 
              color: '#09152e', marginBottom: 24 }}>
                {editingAnnouncement ? '✏️ Modifier l\'annonce' : '📢 Nouvelle annonce'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                
                {/* company_name */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>Nom de l'entreprise *</label>
                  <input type="text" value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Ex: Atlas Construction"
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.company_name ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  {formErrors.company_name && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.company_name}</p>}
                </div>

                {/* category */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>Catégorie *</label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.category ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: 'white' }}>
                    <option value="">Sélectionner une catégorie</option>
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
                  {formErrors.category && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.category}</p>}
                </div>

                {/* title - full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>Titre de l'offre *</label>
                  <input type="text" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Recherche Électricien Qualifié"
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.title ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  {formErrors.title && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.title}</p>}
                </div>

                {/* description - full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>
                    Description * 
                    <span style={{ color: '#8E887F', fontWeight: 400, marginLeft: 8 }}>
                      ({formData.description.length}/300)
                    </span>
                  </label>
                  <textarea value={formData.description}
                    onChange={(e) => { if (e.target.value.length <= 300) 
                      setFormData({ ...formData, description: e.target.value }); }}
                    placeholder="Décrivez brièvement le poste et les compétences recherchées..."
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.description ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, minHeight: 100, resize: 'vertical', boxSizing: 'border-box' }} />
                  {formErrors.description && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.description}</p>}
                </div>

                {/* contact_email */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>Email de contact *</label>
                  <input type="email" value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@entreprise.com"
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.contact_email ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  {formErrors.contact_email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.contact_email}</p>}
                </div>

                {/* contact_phone */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>Téléphone *</label>
                  <input type="text" value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+212 6 XX XX XX XX"
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.contact_phone ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  {formErrors.contact_phone && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.contact_phone}</p>}
                </div>

                {/* city */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>Ville *</label>
                  <input type="text" value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Casablanca"
                    style={{ width: '100%', padding: '10px 12px', border: formErrors.city ? '1px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  {formErrors.city && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.city}</p>}
                </div>

                {/* expires_at */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>
                    Date d'expiration 
                    <span style={{ color: '#8E887F', fontWeight: 400, marginLeft: 4 }}>(optionnel)</span>
                  </label>
                  <input type="date" value={formData.expires_at}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                  <p style={{ fontSize: 11, color: '#8E887F', marginTop: 4 }}>
                    L'annonce sera automatiquement masquée après cette date
                  </p>
                </div>

                {/* contact_address - full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>
                    Adresse complète
                    <span style={{ color: '#8E887F', fontWeight: 400, marginLeft: 4 }}>(optionnel)</span>
                  </label>
                  <input type="text" value={formData.contact_address}
                    onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                    placeholder="Ex: 12 Rue Hassan II, Casablanca"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                </div>

                {/* website - full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, 
                  color: '#09152e', marginBottom: 6 }}>
                    Site web
                    <span style={{ color: '#8E887F', fontWeight: 400, marginLeft: 4 }}>(optionnel)</span>
                  </label>
                  <input type="url" value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.entreprise.com"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
                    borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                </div>

              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: 12, marginTop: 24, 
              paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleSubmit}
                  style={{ padding: '12px 32px', background: '#745b19', color: 'white',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {editingAnnouncement ? '💾 Enregistrer les modifications' : '📢 Publier l\'annonce'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingAnnouncement(null); resetForm(); }}
                  style={{ padding: '12px 24px', background: '#f3f4f6', color: '#09152e',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Announcements List */}
          {announcements.length === 0 ? (
            <div style={{ padding: 48, background: 'white', borderRadius: 16, 
            textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📢</div>
              <p style={{ color: '#45464d', fontSize: 16 }}>Aucune annonce publiée</p>
              <p style={{ color: '#8E887F', fontSize: 14, marginTop: 4 }}>
                Cliquez sur "+ Nouvelle annonce" pour commencer
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {announcements.map((ann) => {
                const isExpired = ann.expires_at && new Date(ann.expires_at) < new Date();
                return (
                  <div key={ann.id} style={{ 
                    background: 'white', borderRadius: 16, padding: 24,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
                    borderLeft: `4px solid ${isExpired ? '#dc2626' : '#745b19'}`,
                    opacity: isExpired ? 0.75 : 1
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', 
                        gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                          <span style={{ padding: '3px 10px', background: '#745b19', 
                          color: 'white', borderRadius: 20, fontSize: 11, 
                          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {ann.category || 'Offre'}
                          </span>
                          {isExpired && (
                            <span style={{ padding: '3px 10px', background: '#fee2e2', 
                            color: '#dc2626', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                              ⚠️ Expirée
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, 
                        fontWeight: 600, color: '#09152e', marginBottom: 4 }}>
                          {ann.title}
                        </h4>
                        <p style={{ fontSize: 14, color: '#745b19', fontWeight: 600, marginBottom: 6 }}>
                          🏢 {ann.company_name || ann.company}
                        </p>
                        <p style={{ fontSize: 13, color: '#45464d', 
                        lineHeight: 1.6, marginBottom: 10 }}>
                          {ann.description || ann.content}
                        </p>

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#8E887F' }}>
                          <span>📍 {ann.city || 'Non spécifié'}</span>
                          <span>📧 {ann.contact_email || ann.email || 'Non spécifié'}</span>
                          <span>📞 {ann.contact_phone || ann.phone || 'Non spécifié'}</span>
                          <span>📅 Publiée le {new Date(ann.created_at).toLocaleDateString('fr-FR')}</span>
                          {ann.expires_at && (
                            <span style={{ color: isExpired ? '#dc2626' : '#f59e0b', fontWeight: 600 }}>
                              ⏳ Expire le {new Date(ann.expires_at).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button onClick={() => handleEdit(ann)}
                          style={{ padding: '8px 20px', background: '#eff6ff', 
                          color: '#2563eb', border: 'none', borderRadius: 6, 
                          fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          ✏️ Modifier
                        </button>
                        <button onClick={() => handleDeleteAnnouncement(ann.id)}
                          style={{ padding: '8px 20px', background: '#fee2e2', 
                          color: '#dc2626', border: 'none', borderRadius: 6, 
                          fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
