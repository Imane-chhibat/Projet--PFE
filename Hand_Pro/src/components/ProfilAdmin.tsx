import { useState, useEffect } from "react";
import { api } from "../utils/api";

export function ProfilAdmin() {
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

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
      setAnnouncements(announcementsRes.announcements || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      alert("Erreur lors du chargement des données du dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      await api.createAnnouncement(newAnnouncement);
      setNewAnnouncement({ title: "", content: "" });
      setShowAddAnnouncement(false);
      loadDashboardData();
      alert("Annonce ajoutée avec succès");
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'ajout de l'annonce");
    }
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, fontWeight: 500, color: "#09152e", marginBottom: 8 }}>
                Annonces
              </h2>
              <p style={{ fontSize: 14, color: "#8E887F" }}>Gérer les annonces de la plateforme</p>
            </div>
            <button
              onClick={() => setShowAddAnnouncement(true)}
              style={{
                padding: "12px 24px",
                background: "#745b19",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#5a4614"}
              onMouseOut={(e) => e.currentTarget.style.background = "#745b19"}
            >
              + Ajouter une annonce
            </button>
          </div>

          {showAddAnnouncement && (
            <div className="glass-card" style={{ padding: 32, borderRadius: 16, background: "white", marginBottom: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontWeight: 600, color: "#09152e", marginBottom: 24 }}>
                Nouvelle Annonce
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 8 }}>
                    Titre
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                    placeholder="Titre de l'annonce"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#09152e", marginBottom: 8 }}>
                    Contenu
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 14,
                      minHeight: 120,
                      resize: "vertical",
                    }}
                    placeholder="Contenu de l'annonce"
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleAddAnnouncement}
                    style={{
                      padding: "12px 24px",
                      background: "#745b19",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Publier
                  </button>
                  <button
                    onClick={() => setShowAddAnnouncement(false)}
                    style={{
                      padding: "12px 24px",
                      background: "#e5e7eb",
                      color: "#09152e",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {announcements.length === 0 ? (
            <div className="glass-card" style={{ padding: 48, borderRadius: 16, background: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📢</div>
              <p style={{ fontSize: 16, color: "#45464d", marginBottom: 8 }}>Aucune annonce pour le moment</p>
              <p style={{ fontSize: 14, color: "#8E887F" }}>Cliquez sur "Ajouter une annonce" pour créer une nouvelle annonce.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="glass-card"
                  style={{ padding: 24, borderRadius: 16, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 600, color: "#09152e", marginBottom: 8 }}>
                        {announcement.title}
                      </h4>
                      <p style={{ fontSize: 14, color: "#45464d", lineHeight: 1.6 }}>
                        {announcement.content}
                      </p>
                      <p style={{ fontSize: 12, color: "#8E887F", marginTop: 12 }}>
                        Publiée le {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#fecaca"}
                      onMouseOut={(e) => e.currentTarget.style.background = "#fee2e2"}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
