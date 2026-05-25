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

  async register(data: RegisterInput) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de l\'inscription');
    }
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
};
