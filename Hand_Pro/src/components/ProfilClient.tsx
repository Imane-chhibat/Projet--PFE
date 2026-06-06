import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Settings, LogOut, Camera, Star, Heart, Clock, Search, MapPin, Map as MapIcon, Image as ImageIcon, Calendar, MessageSquare, UserCheck, UserX } from 'lucide-react';
import logoHand from '../images/logo_hand.png';

interface ProfilClientProps {
  onNavigateToInscription?: () => void;
  onNavigateToArtisanProfile?: (artisanId: string) => void;
  onNavigateToHome?: () => void;
}

export function ProfilClient({ onNavigateToInscription = () => {}, onNavigateToArtisanProfile = () => {}, onNavigateToHome = () => {} }: ProfilClientProps) {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", city: "", email: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  // Confirm modal state for deletes and cancels
  const [confirmAction, setConfirmAction] = useState<{ type: 'review' | 'comment' | 'cancel_request'; id: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  const isLoggedIn = !!localStorage.getItem("auth_token");

  useEffect(() => {
    api.getCities().then(setCities).catch(() => {});
    if (isLoggedIn) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, reqRes, favRes, reviewsRes, commentsRes, statsRes] = await Promise.allSettled([
        api.getClientProfile(),
        api.getClientRequests(),
        api.getClientFavorites(),
        api.getClientReviews(),
        api.getClientComments(),
        api.getAdminStats(),
      ]);

      // Profile is mandatory — if it fails, show error
      if (profileRes.status === 'rejected') {
        throw new Error(profileRes.reason?.message || 'Profil non trouvé');
      }
      const profile = profileRes.value;
      console.log("Profile response:", profile);
      setUser(profile.user);
      setEditForm({
        name: profile.user?.name || "",
        phone: profile.user?.phone || "",
        city: profile.user?.city || "",
        email: profile.user?.email || "",
      });

      // Other calls are non-critical — graceful fallback to empty arrays
      if (reqRes.status === 'fulfilled') setRequests(reqRes.value.requests || []);
      if (favRes.status === 'fulfilled') setFavorites(favRes.value.favorites || []);
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.reviews || []);
      else console.warn("Could not load reviews:", reviewsRes.reason);
      if (commentsRes.status === 'fulfilled') setComments(commentsRes.value.comments || []);
      else console.warn("Could not load comments:", commentsRes.reason);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);

    } catch (err) {
      console.error("Error loading profile:", err);
      alert("Erreur lors du chargement du profil. Veuillez vous reconnecter.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", editForm.name);
      fd.append("email", editForm.email);
      fd.append("phone", editForm.phone);
      fd.append("city", editForm.city);
      if (avatarFile) fd.append("avatar", avatarFile);
      const res = await api.updateClientProfile(fd);
      setUser(res.user);
      
      // Update localStorage so other components know about the change immediately
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        localStorage.setItem('auth_user', JSON.stringify({ ...u, ...res.user }));
      }
      
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      alert("Profil mis à jour avec succès !");
      
      // Notify Navbar to update its avatar
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err: any) {
      alert(err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = async (e: React.MouseEvent, artisanId: string) => {
    e.stopPropagation();
    try {
      await api.removeFavorite(artisanId);
      setFavorites(favorites.filter((fav: any) => fav.artisan?.id !== parseInt(artisanId)));
      alert("Artisan retiré des favoris");
    } catch (err: any) {
      alert(err.message || "Erreur lors du retrait des favoris");
    }
  };

  const handleDeleteReview = async (id: number) => {
    setConfirmAction({ type: 'review', id });
  };

  const handleDeleteComment = async (id: number) => {
    setConfirmAction({ type: 'comment', id });
  };

  const handleCancelRequest = (id: number) => {
    setConfirmAction({ type: 'cancel_request', id });
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;
    setProcessing(true);
    try {
      if (confirmAction.type === 'review') {
        await api.deleteClientReview(confirmAction.id);
        setReviews(reviews.filter(r => r.id !== confirmAction.id));
      } else if (confirmAction.type === 'comment') {
        await api.deleteClientComment(confirmAction.id);
        setComments(comments.filter(c => c.id !== confirmAction.id));
      } else if (confirmAction.type === 'cancel_request') {
        const res = await api.cancelClientRequest(confirmAction.id);
        // Update request status locally
        setRequests(requests.map(req => req.id === confirmAction.id ? { ...req, status: 'cancelled' } : req));
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'opération');
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "accepted")
      return (
        <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 14px", borderRadius: 9999, fontSize: 13, fontWeight: 700 }}>
          ✓ Accepté
        </span>
      );
    if (status === "rejected")
      return (
        <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 14px", borderRadius: 9999, fontSize: 13, fontWeight: 700 }}>
          ✗ Refusé
        </span>
      );
    if (status === "cancelled")
      return (
        <span style={{ background: "#f3f4f6", color: "#4b5563", padding: "4px 14px", borderRadius: 9999, fontSize: 13, fontWeight: 700 }}>
          🚫 Annulé
        </span>
      );
    return (
      <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 14px", borderRadius: 9999, fontSize: 13, fontWeight: 700 }}>
        ⏳ En attente
      </span>
    );
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch { return d; }
  };

  // ── Not logged in → show inscription CTA ──
  if (!isLoggedIn) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');
          .profil-client-container { background-color: #F5EDE0; color: #221b04; font-family: 'Manrope', sans-serif; min-height: 100vh; width: 100%; }
        `}</style>
        <div className="profil-client-container">
          <main style={{ maxWidth: 600, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#e8d9b4", margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#745b19" }}>
              👤
            </div>
            <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 40, fontWeight: 600, color: "#09152e", marginBottom: 12 }}>
              Mon Profil Client
            </h1>
            <p style={{ fontSize: 16, color: "#45464d", marginBottom: 40, lineHeight: 1.6 }}>
              Vous n'êtes pas encore inscrit. Créez votre compte pour accéder à votre espace personnel et suivre vos rendez-vous.
            </p>
            <button
              onClick={onNavigateToInscription}
              style={{
                padding: "16px 48px", background: "#745b19", color: "white", border: "none",
                borderRadius: 9999, fontFamily: "Manrope, sans-serif", fontSize: 16, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.03em", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(116,91,25,0.3)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              S'inscrire maintenant
            </button>
          </main>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5EDE0" }}>
        <div style={{ textAlign: "center", color: "#45464d" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #e8d9b4", borderTopColor: "#745b19", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          Chargement du profil...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .profil-client-container { background-color: #F5EDE0; color: #221b04; font-family: 'Manrope', sans-serif; overflow-x: hidden; min-height: 100vh; width: 100%; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; display: inline-block; vertical-align: middle; }
        .glass-card { background: rgba(255,255,255,0.4); backdrop-filter: blur(20px); border: 1px solid rgba(232,220,200,0.5); }
        .artisan-shadow { box-shadow: 0 10px 30px -15px rgba(31,42,68,0.15); }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(31,42,68,0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F5EDE0; }
        ::-webkit-scrollbar-thumb { background: #e8d9b4; border-radius: 10px; }
      `}</style>

      <div className="profil-client-container">
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px", display: "flex", flexDirection: "column", gap: 64 }}>

          {/* ── Profile Header ── */}
          <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 32, borderBottom: "1px solid rgba(198,198,206,0.3)", paddingBottom: 48 }}>
            {/* Avatar */}
            <div style={{ position: "relative" }}>
              <div className="artisan-shadow" style={{ width: 200, height: 200, borderRadius: "50%", overflow: "hidden", border: "4px solid white", background: "#2A1B15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {avatarPreview || user?.avatar ? (
                  <img 
                    src={avatarPreview || user.avatar} 
                    alt={user?.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.avatar-fallback');
                      if (fallback) fallback.removeAttribute('style');
                    }}
                  />
                ) : null}
                
                <span className="avatar-fallback" style={{ fontSize: 80, color: "#CDB58E", fontWeight: 700, display: (avatarPreview || user?.avatar) ? 'none' : 'block' }}>
                  {user?.name?.charAt(0).toUpperCase() || "C"}
                </span>
              </div>
              {editing && (
                <label style={{ position: "absolute", bottom: 8, right: 8, background: "#CDB58E", color: "#2A1B15", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }} title="Changer la photo de profil">
                  <Camera size={20} />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Nom complet" style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, fontWeight: 600, color: "#09152e", background: "white", border: "2px solid #e8d9b4", borderRadius: 12, padding: "8px 16px", outline: "none" }} />
                  <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" type="email" style={{ fontSize: 16, color: "#45464d", background: "white", border: "2px solid #e8d9b4", borderRadius: 12, padding: "8px 16px", outline: "none" }} />
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Téléphone" style={{ fontSize: 16, color: "#45464d", background: "white", border: "2px solid #e8d9b4", borderRadius: 12, padding: "8px 16px", outline: "none" }} />
                  <select value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} style={{ fontSize: 16, color: "#45464d", background: "white", border: "2px solid #e8d9b4", borderRadius: 12, padding: "8px 16px", outline: "none" }}>
                    <option value="">Sélectionnez votre ville</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ) : (
                <>
                  <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 56, fontWeight: 600, color: "#09152e", lineHeight: 1.1, marginBottom: 8 }}>
                    {user?.name || "Client"}
                  </h1>
                  <p style={{ fontSize: 18, color: "#45464d", display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: "#745b19" }}>verified_user</span>
                    Membre depuis {user?.created_at ? formatDate(user.created_at) : "récemment"}
                  </p>
                  <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {user?.city && (
                      <span style={{ padding: "6px 16px", background: "#f6e7c1", color: "#45464d", borderRadius: 9999, fontSize: 14, fontWeight: 600 }}>
                        📍 {user.city}
                      </span>
                    )}
                    {user?.phone && (
                      <span style={{ padding: "6px 16px", background: "#f6e7c1", color: "#45464d", borderRadius: 9999, fontSize: 14, fontWeight: 600 }}>
                        📞 {user.phone}
                      </span>
                    )}
                    {user?.email && (
                      <span style={{ padding: "6px 16px", background: "#f6e7c1", color: "#45464d", borderRadius: 9999, fontSize: 14, fontWeight: 600 }}>
                        ✉ {user.email}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Edit / Save button */}
            {editing ? (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleSaveProfile} disabled={saving} style={{ border: "none", color: "white", background: "#745b19", padding: "12px 32px", borderRadius: 9999, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button onClick={() => { setEditing(false); setAvatarFile(null); setAvatarPreview(null); }} style={{ border: "1px solid #ccc", color: "#45464d", background: "transparent", padding: "12px 24px", borderRadius: 9999, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                style={{ border: "1px solid #745b19", color: "#745b19", background: "transparent", padding: "12px 32px", borderRadius: 9999, fontSize: 14, fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(116,91,25,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Modifier Profil
              </button>
            )}
          </section>

          {/* ── Mes Favoris ── */}
          <section>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 700, color: "#745b19", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Artisans préférés
              </span>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 40, fontWeight: 500, color: "#09152e" }}>
                Mes Favoris
              </h2>
            </div>

            {favorites.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, borderRadius: 16, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
                <p style={{ fontSize: 16, color: "#45464d", marginBottom: 8 }}>Aucun favori pour le moment</p>
                <p style={{ fontSize: 14, color: "#8E887F" }}>Les artisans que vous ajoutez en favori apparaîtront ici.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {favorites.map((fav: any) => (
                  <article
                    key={fav.id}
                    className="glass-card hover-lift"
                    style={{ padding: 24, borderRadius: 16, display: "flex", flexDirection: "column", gap: 16, cursor: "pointer" }}
                    onClick={() => onNavigateToArtisanProfile(`artisan-${fav.artisan?.id}`)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 12, background: "#e8d9b4", display: "flex", alignItems: "center", justifyContent: "center", color: "#745b19", fontSize: 28, flexShrink: 0, overflow: "hidden" }}>
                        {fav.artisan?.avatar ? (
                          <img src={fav.artisan.avatar} alt={fav.artisan.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span>{fav.artisan?.name?.charAt(0).toUpperCase() || "A"}</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, fontWeight: 600, color: "#09152e", marginBottom: 4 }}>
                          {fav.artisan?.name || "Artisan"}
                        </h4>
                        <p style={{ fontSize: 13, color: "#45464d" }}>
                          {fav.artisan?.specialty || "Artisan"}
                        </p>
                        <p style={{ fontSize: 12, color: "#8E887F", marginTop: 2 }}>
                          📍 {fav.artisan?.city || "Ville"}
                        </p>
                      </div>
                      <div
                        onClick={(e) => handleRemoveFavorite(e, String(fav.artisan?.id))}
                        style={{ color: "#e11d48", fontSize: 24, cursor: "pointer", padding: 8 }}
                        title="Retirer des favoris"
                      >
                        ❤️
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── Mes Rendez-vous ── */}
          <section>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 700, color: "#745b19", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Suivi des demandes
              </span>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 40, fontWeight: 500, color: "#09152e" }}>
                Mes Rendez-vous
              </h2>
            </div>

            {requests.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, borderRadius: 16, textAlign: "center" }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Calendar size={48} color="#745b19" /></div>
                <p style={{ fontSize: 16, color: "#45464d", marginBottom: 8 }}>Aucun rendez-vous pour le moment</p>
                <p style={{ fontSize: 14, color: "#8E887F" }}>Vos demandes de rendez-vous envoyées aux artisans apparaîtront ici.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {requests.map((req: any) => (
                  <article key={req.id} className="glass-card hover-lift" style={{ padding: 24, borderRadius: 16, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 250 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 12, background: "#e8d9b4", display: "flex", alignItems: "center", justifyContent: "center", color: "#745b19", fontSize: 24, flexShrink: 0, overflow: "hidden" }}>
                        {req.artisan?.avatar ? (
                          <img src={req.artisan.avatar} alt={req.artisan.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span>{req.artisan?.name?.charAt(0).toUpperCase() || "A"}</span>
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 600, color: "#09152e", marginBottom: 4 }}>
                          {req.artisan?.name || "Artisan"}
                        </h4>
                        <p style={{ fontSize: 14, color: "#45464d" }}>
                          <Calendar size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} /> Date demandée : <strong>{formatDate(req.requested_date)}</strong>
                        </p>
                        <p style={{ fontSize: 12, color: "#8E887F", marginTop: 2 }}>
                          Envoyée le {formatDate(req.created_at)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {getStatusBadge(req.status)}
                      {(req.status === 'pending' || req.status === 'accepted') && (
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          style={{
                            padding: "6px 12px",
                            background: "transparent",
                            color: "#e11d48",
                            border: "1px solid #e11d48",
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(225,29,72,0.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── Mes Commentaires ── */}
          <section>
            <div style={{ marginBottom: 40 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 700, color: "#745b19", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Vos avis et témoignages
              </span>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: 40, fontWeight: 500, color: "#09152e" }}>
                Mes Commentaires
              </h2>
            </div>

            {reviews.length === 0 && comments.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, borderRadius: 16, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                <p style={{ fontSize: 16, color: "#45464d", marginBottom: 8 }}>Vous n'avez pas encore laissé de commentaires</p>
                <p style={{ fontSize: 14, color: "#8E887F" }}>Partagez votre expérience avec les artisans ou sur le site.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                
                {/* Avis sur les Artisans */}
                {reviews.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontWeight: 600, color: "#09152e", marginBottom: 16 }}>Avis sur les Artisans</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                      {reviews.map((rev: any) => (
                        <article key={rev.id} className="glass-card" style={{ padding: 24, borderRadius: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            style={{ position: "absolute", top: 16, right: 16, background: "rgba(225,29,72,0.1)", color: "#e11d48", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
                            title="Supprimer l'avis"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                          </button>
                          
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: rev.artisan?.id ? 'pointer' : 'default' }}
                            onClick={() => rev.artisan?.id && onNavigateToArtisanProfile(`artisan-${rev.artisan.id}`)}
                            title={rev.artisan?.id ? `Voir le profil de ${rev.artisan?.name || "l'artisan"}` : ''}
                          >
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e8d9b4', overflow: 'hidden', flexShrink: 0, border: '2px solid transparent', transition: 'border-color 0.2s' }}
                              onMouseEnter={e => rev.artisan?.id && ((e.currentTarget as HTMLElement).style.borderColor = '#745b19')}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'transparent')}
                            >
                              {rev.artisan?.avatar ? (
                                <img src={rev.artisan.avatar} alt={rev.artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#745b19', fontWeight: 'bold' }}>
                                  {rev.artisan?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#09152e', textDecoration: rev.artisan?.id ? 'underline' : 'none', textDecorationColor: '#745b19', textDecorationStyle: 'dotted' }}>
                                {rev.artisan?.name || 'Artisan inconnu'}
                              </div>
                              <div style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                            </div>
                          </div>
                          <p style={{ fontSize: 14, color: "#45464d", fontStyle: "italic", lineHeight: 1.5 }}>"{rev.comment}"</p>
                          <div style={{ fontSize: 12, color: "#8E887F", marginTop: "auto" }}>Le {formatDate(rev.created_at)}</div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Témoignages sur le Site */}
                {comments.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontWeight: 600, color: "#09152e", marginBottom: 16 }}>Témoignages sur le site</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                      {comments.map((comment: any) => (
                        <article key={comment.id} className="glass-card" style={{ padding: 24, borderRadius: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            style={{ position: "absolute", top: 16, right: 16, background: "rgba(225,29,72,0.1)", color: "#e11d48", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
                            title="Supprimer le témoignage"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                          </button>
                          
                          <button
                            onClick={onNavigateToHome}
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, transition: "opacity 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            title="Aller à l'accueil HandPro"
                          >
                            <img src={logoHand} alt="HandPro Logo" style={{ width: 18, height: 18, objectFit: "contain" }} />
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#603A2A", letterSpacing: "0.5px" }}>HANDPRO</span>
                          </button>
                          <p style={{ fontSize: 14, color: "#45464d", lineHeight: 1.5 }}>{comment.body}</p>
                          <div style={{ fontSize: 12, color: "#8E887F", marginTop: "auto" }}>Le {formatDate(comment.created_at)}</div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </section>

        </main>
      </div>

      {/* ── Confirmation Modal ── */}
      {confirmAction && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(9,21,46,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: '40px 36px', maxWidth: 420, width: '100%',
            boxShadow: '0 32px 80px rgba(9,21,46,0.2)', textAlign: 'center', animation: 'fadeIn 0.25s ease'
          }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef2f2', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#e11d48' }}>
                {confirmAction.type === 'cancel_request' ? 'cancel' : 'delete'}
              </span>
            </div>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: 24, fontWeight: 600, color: '#09152e', marginBottom: 12 }}>
              {confirmAction.type === 'cancel_request' ? 'Confirmer l\'annulation' : 'Confirmer la suppression'}
            </h3>
            <p style={{ fontSize: 14, color: '#45464d', lineHeight: 1.6, marginBottom: 28 }}>
              {confirmAction.type === 'review' && 'Voulez-vous vraiment supprimer cet avis ? Cette action est irréversible et la note de l\'artisan sera mise à jour.'}
              {confirmAction.type === 'comment' && 'Voulez-vous vraiment supprimer ce témoignage ? Cette action est irréversible.'}
              {confirmAction.type === 'cancel_request' && 'Voulez-vous vraiment annuler ce rendez-vous ? Un message sera envoyé à l\'artisan.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={processing}
                style={{ padding: '12px 28px', border: '1.5px solid #e8d9b4', background: 'transparent', color: '#45464d', borderRadius: 9999, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Non, revenir
              </button>
              <button
                onClick={confirmActionHandler}
                disabled={processing}
                style={{ padding: '12px 28px', background: '#e11d48', color: 'white', border: 'none', borderRadius: 9999, fontSize: 14, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {processing ? (
                  <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />En cours...</>
                ) : (
                  <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {confirmAction.type === 'cancel_request' ? 'cancel' : 'delete'}
                  </span>Confirmer</>  
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
