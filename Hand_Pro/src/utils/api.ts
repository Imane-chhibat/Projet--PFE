const API_BASE = 'http://localhost:8000/api';

export interface ReviewInput {
  clientName: string;
  clientAvatar?: string;
  comment: string;
  rating: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'Registered User' | 'Artisan' | 'Visitor';
  specialty?: string;
  category_id?: string;
  city?: string;
  phone?: string;
}

export const api = {
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getCities() {
    const res = await fetch(`${API_BASE}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
  },

  async getStatistics() {
    const res = await fetch(`${API_BASE}/statistics`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  async getArtisans(filters?: { category?: string; city?: string }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);

    const res = await fetch(`${API_BASE}/artisans?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch artisans');
    return res.json();
  },

  async getArtisan(id: string) {
    const res = await fetch(`${API_BASE}/artisans/${id}`);
    if (!res.ok) throw new Error('Failed to fetch artisan');
    return res.json();
  },

  async getAnnouncements() {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async getTestimonials() {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Identifiants incorrects');
    }
    return res.json();
  },

  async register(data: RegisterInput | FormData) {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: isFormData ? {
        'Accept': 'application/json'
      } : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de l\'inscription');
    }
    return res.json();
  },

  async forgotPassword(method: 'email' | 'phone', value: string) {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ method, value }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erreur lors de la demande de réinitialisation');
    }
    return data;
  },

  async resetPassword(data: { method: 'email' | 'phone', value: string, code: string, password: string, password_confirmation: string }) {
    const res = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Erreur lors de la réinitialisation du mot de passe');
    }
    return result;
  },

  async createClientRequest(artisanId: string, requestedDate: string) {
    const token = localStorage.getItem('auth_token');
    // Extract numeric ID from formatted artisan ID (e.g. "artisan-5" → 5)
    const numericId = artisanId.replace('artisan-', '');
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ artisan_id: numericId, requested_date: requestedDate }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la création de la demande');
    }
    return res.json();
  },

  async getArtisanRequests() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/artisan/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des demandes');
    return res.json();
  },

  async acceptClientRequest(requestId: string | number) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/requests/${requestId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors de la validation de la demande');
    return res.json();
  },

  async rejectClientRequest(requestId: string | number) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors du refus de la demande');
    return res.json();
  },

  async markRequestsAsRead() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/artisan/requests/mark-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour des notifications');
    return res.json();
  },

  async addReview(artisanId: string, review: ReviewInput) {
    const res = await fetch(`${API_BASE}/artisans/${artisanId}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(review),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de l\'ajout de l\'avis');
    }
    return res.json();
  },

  async getMyProfile() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/my-profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Profil non trouvé');
    return res.json();
  },

  async updateMyProfile(formData: FormData) {
    const token = localStorage.getItem('auth_token');
    formData.append('_method', 'PUT'); // Workaround for Laravel PUT with files
    const res = await fetch(`${API_BASE}/my-profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la mise à jour');
    }
    return res.json();
  },

  async uploadPortfolioImage(file: File, caption: string) {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    const res = await fetch(`${API_BASE}/my-profile/portfolio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de l\'ajout de l\'image');
    }
    return res.json();
  },

  async deletePortfolioImage(itemId: string) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/my-profile/portfolio/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la suppression de l\'image');
    }
    return res.json();
  },

  async changePassword(data: {current_password: string, password: string, password_confirmation: string}) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/change-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Erreur lors du changement de mot de passe');
    return result;
  },

  async getClientRequests() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/client/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des rendez-vous');
    return res.json();
  },

  async getClientProfile() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/client/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Profil non trouvé');
    return res.json();
  },

  async updateClientProfile(formData: FormData) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/client/profile/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la mise à jour');
    }
    return res.json();
  },

  async addFavorite(artisanId: string) {
    const token = localStorage.getItem('auth_token');
    const numericId = artisanId.replace('artisan-', '');
    const res = await fetch(`${API_BASE}/client/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ artisan_id: numericId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de l\'ajout aux favoris');
    }
    return res.json();
  },

  async removeFavorite(artisanId: string) {
    const token = localStorage.getItem('auth_token');
    const numericId = artisanId.replace('artisan-', '');
    const res = await fetch(`${API_BASE}/client/favorites/${numericId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la suppression des favoris');
    }
    return res.json();
  },

  async getClientFavorites() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/client/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des favoris');
    return res.json();
  },

  async getAdminStats() {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return res.json();
  },

  async createAnnouncement(data: { title: string; content: string }) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin/announcements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la création de l\'annonce');
    }
    return res.json();
  },

  async deleteAnnouncement(id: string) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la suppression de l\'annonce');
    }
    return res.json();
  },

  async updateAnnouncement(id: string, data: { title: string; content: string; category?: string; company?: string; city?: string }) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la mise à jour de l\'annonce');
    }
    return res.json();
  },

  async getAnnouncementApplications(announcementId: string) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin/announcements/${announcementId}/applications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la récupération des candidatures');
    }
    return res.json();
  },

  async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected') {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la mise à jour du statut');
    }
    return res.json();
  },

  async applyToAnnouncement(announcementId: string, message?: string) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/announcements/${announcementId}/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la candidature');
    }
    return res.json();
  },
};
