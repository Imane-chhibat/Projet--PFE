@extends('layouts.app')

@section('content')
<div class="container py-5">

    <!-- En-tête -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="fw-bold mb-1">Mes Annonces</h1>
            <p class="text-muted mb-0">Gérez vos annonces publiées sur HandPro</p>
        </div>
        <a href="{{ route('admin.announcements.create') }}" class="btn btn-dark fw-bold px-4">
            + Nouvelle annonce
        </a>
    </div>

    <!-- Message de succès / erreur -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ✅ {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <!-- Tableau des annonces -->
    <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
        @if($announcements->isEmpty())
            <div class="text-center py-5">
                <div style="font-size: 3rem;">📢</div>
                <h4 class="text-muted mt-3">Vous n'avez pas encore d'annonce</h4>
                <p class="text-muted">Créez votre première annonce pour attirer des artisans qualifiés.</p>
                <a href="{{ route('admin.announcements.create') }}" class="btn btn-dark mt-2">
                    Créer une annonce
                </a>
            </div>
        @else
            <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-dark text-white">
                        <tr>
                            <th class="py-3 ps-4">Titre</th>
                            <th>Catégorie</th>
                            <th>Ville</th>
                            <th>Date d'expiration</th>
                            <th>Statut</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($announcements as $announcement)
                            @php
                                $isExpired = $announcement->expires_at && \Carbon\Carbon::parse($announcement->expires_at)->isPast();
                            @endphp
                            <tr>
                                <!-- Titre -->
                                <td class="ps-4">
                                    <div class="fw-bold text-dark">{{ $announcement->title }}</div>
                                    <small class="text-muted">{{ $announcement->company_name ?? $announcement->company }}</small>
                                </td>

                                <!-- Catégorie -->
                                <td>
                                    <span class="badge bg-warning text-dark text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $announcement->category }}
                                    </span>
                                </td>

                                <!-- Ville -->
                                <td>
                                    <span class="text-muted">📍 {{ $announcement->city }}</span>
                                </td>

                                <!-- Date d'expiration -->
                                <td>
                                    @if($announcement->expires_at)
                                        <span class="{{ $isExpired ? 'text-danger' : 'text-muted' }}">
                                            {{ \Carbon\Carbon::parse($announcement->expires_at)->format('d/m/Y') }}
                                        </span>
                                    @else
                                        <span class="text-muted fst-italic">Illimitée</span>
                                    @endif
                                </td>

                                <!-- Statut -->
                                <td>
                                    @if($isExpired)
                                        <span class="badge bg-danger">Expirée</span>
                                    @else
                                        <span class="badge bg-success">Active</span>
                                    @endif
                                </td>

                                <!-- Actions -->
                                <td class="text-end pe-4">
                                    <div class="d-flex gap-2 justify-content-end">
                                        <!-- Bouton Modifier -->
                                        <a href="{{ route('admin.announcements.edit', $announcement->id) }}"
                                           class="btn btn-sm btn-outline-dark fw-bold px-3">
                                            ✏️ Modifier
                                        </a>

                                        <!-- Bouton Supprimer avec confirmation -->
                                        <form action="{{ route('admin.announcements.destroy', $announcement->id) }}"
                                              method="POST"
                                              onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger fw-bold px-3">
                                                🗑️ Supprimer
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-center p-4">
                {{ $announcements->links('pagination::bootstrap-5') }}
            </div>
        @endif
    </div>

</div>
@endsection
