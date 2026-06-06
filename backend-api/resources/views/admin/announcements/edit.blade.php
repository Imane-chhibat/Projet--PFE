@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-12 col-lg-8">

            <!-- En-tête -->
            <div class="d-flex align-items-center gap-3 mb-4">
                <a href="{{ route('admin.announcements.index') }}" class="btn btn-outline-secondary btn-sm">
                    &larr; Retour à mes annonces
                </a>
                <h1 class="fw-bold mb-0">Modifier l'annonce</h1>
            </div>

            <!-- Affichage des erreurs de validation -->
            @if($errors->any())
                <div class="alert alert-danger">
                    <strong>Veuillez corriger les erreurs suivantes :</strong>
                    <ul class="mb-0 ps-3 mt-2">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Formulaire pré-rempli -->
            <div class="card shadow-sm border-0 rounded-4">
                <div class="card-body p-5">
                    <form 
                        action="{{ route('admin.announcements.update', $announcement->id) }}"
                        method="POST"
                    >
                        @csrf
                        @method('PUT')

                        <!-- Rangée 1 : Nom entreprise + Catégorie -->
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label for="company_name" class="form-label fw-bold">Nom de l'entreprise *</label>
                                <input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    class="form-control @error('company_name') is-invalid @enderror"
                                    value="{{ old('company_name', $announcement->company_name ?? $announcement->company) }}"
                                    placeholder="Ex: Atlas Construction"
                                    required
                                >
                                @error('company_name')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-md-6">
                                <label for="category" class="form-label fw-bold">Catégorie *</label>
                                <select id="category" name="category" class="form-select @error('category') is-invalid @enderror" required>
                                    <option value="">Sélectionnez une catégorie</option>
                                    @foreach($categories as $cat)
                                        <option value="{{ $cat }}" {{ old('category', $announcement->category) === $cat ? 'selected' : '' }}>
                                            {{ $cat }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('category')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <!-- Titre -->
                        <div class="mb-4">
                            <label for="title" class="form-label fw-bold">Titre de l'offre *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                class="form-control @error('title') is-invalid @enderror"
                                value="{{ old('title', $announcement->title) }}"
                                placeholder="Ex: Recherche électricien expérimenté"
                                required
                            >
                            @error('title')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Description -->
                        <div class="mb-4">
                            <label for="description" class="form-label fw-bold">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                class="form-control @error('description') is-invalid @enderror"
                                placeholder="Décrivez le poste, les compétences requises, les conditions..."
                                required
                            >{{ old('description', $announcement->description) }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <hr class="my-4">
                        <h5 class="fw-bold mb-4">📋 Informations de contact</h5>

                        <!-- Rangée 2 : Email + Téléphone -->
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label for="contact_email" class="form-label fw-bold">Email de contact *</label>
                                <input
                                    type="email"
                                    id="contact_email"
                                    name="contact_email"
                                    class="form-control @error('contact_email') is-invalid @enderror"
                                    value="{{ old('contact_email', $announcement->contact_email) }}"
                                    placeholder="contact@entreprise.ma"
                                    required
                                >
                                @error('contact_email')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-md-6">
                                <label for="contact_phone" class="form-label fw-bold">Téléphone *</label>
                                <input
                                    type="text"
                                    id="contact_phone"
                                    name="contact_phone"
                                    class="form-control @error('contact_phone') is-invalid @enderror"
                                    value="{{ old('contact_phone', $announcement->contact_phone) }}"
                                    placeholder="+212 6 00 00 00 00"
                                    required
                                >
                                @error('contact_phone')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <!-- Rangée 3 : Ville + Adresse -->
                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label for="city" class="form-label fw-bold">Ville *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    class="form-control @error('city') is-invalid @enderror"
                                    value="{{ old('city', $announcement->city) }}"
                                    placeholder="Ex: Casablanca"
                                    required
                                >
                                @error('city')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-md-6">
                                <label for="contact_address" class="form-label fw-bold">Adresse <span class="text-muted fw-normal">(optionnel)</span></label>
                                <input
                                    type="text"
                                    id="contact_address"
                                    name="contact_address"
                                    class="form-control"
                                    value="{{ old('contact_address', $announcement->contact_address) }}"
                                    placeholder="Ex: Hay Mohamadi, Rue 12"
                                >
                            </div>
                        </div>

                        <!-- Rangée 4 : Site web + Date d'expiration -->
                        <div class="row g-4 mb-5">
                            <div class="col-md-6">
                                <label for="website" class="form-label fw-bold">Site web <span class="text-muted fw-normal">(optionnel)</span></label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    class="form-control @error('website') is-invalid @enderror"
                                    value="{{ old('website', $announcement->website) }}"
                                    placeholder="https://www.entreprise.ma"
                                >
                                @error('website')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="col-md-6">
                                <label for="expires_at" class="form-label fw-bold">Date d'expiration <span class="text-muted fw-normal">(optionnel)</span></label>
                                <input
                                    type="date"
                                    id="expires_at"
                                    name="expires_at"
                                    class="form-control @error('expires_at') is-invalid @enderror"
                                    value="{{ old('expires_at', $announcement->expires_at ? \Carbon\Carbon::parse($announcement->expires_at)->format('Y-m-d') : '') }}"
                                    min="{{ date('Y-m-d', strtotime('+1 day')) }}"
                                >
                                @error('expires_at')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <!-- Boutons d'action -->
                        <div class="d-flex gap-3 justify-content-end">
                            <a href="{{ route('admin.announcements.index') }}" class="btn btn-outline-secondary px-4">
                                Annuler
                            </a>
                            <button type="submit" class="btn btn-dark fw-bold px-5">
                                💾 Enregistrer les modifications
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            <!-- Informations actuelles (rappel visuel) -->
            <div class="card mt-4 border-0 bg-light rounded-4">
                <div class="card-body p-4">
                    <h6 class="fw-bold text-muted mb-3">ℹ️ Informations actuelles</h6>
                    <div class="row g-3 text-sm">
                        <div class="col-md-6">
                            <small class="text-muted d-block">Créée le</small>
                            <strong>{{ $announcement->created_at->format('d/m/Y à H:i') }}</strong>
                        </div>
                        <div class="col-md-6">
                            <small class="text-muted d-block">Dernière modification</small>
                            <strong>{{ $announcement->updated_at->format('d/m/Y à H:i') }}</strong>
                        </div>
                        <div class="col-md-6">
                            <small class="text-muted d-block">Statut</small>
                            @if($announcement->expires_at && \Carbon\Carbon::parse($announcement->expires_at)->isPast())
                                <span class="badge bg-danger">Expirée</span>
                            @else
                                <span class="badge bg-success">Active</span>
                            @endif
                        </div>
                        <div class="col-md-6">
                            <small class="text-muted d-block">ID</small>
                            <strong>#{{ $announcement->id }}</strong>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
