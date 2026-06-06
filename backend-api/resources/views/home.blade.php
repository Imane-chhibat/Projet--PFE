@extends('layouts.app')

@section('content')
<div class="container py-5">
    <h1 class="mb-5 text-center fw-bold">Nos Dernières Annonces</h1>

    <div class="row g-4">
        @forelse($announcements as $announcement)
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card h-100 shadow-sm border-0 hover-lift">
                    <div class="card-body d-flex flex-column">
                        <div class="mb-3">
                            <span class="badge bg-warning text-dark text-uppercase px-3 py-2" style="font-size: 0.75rem; letter-spacing: 1px;">
                                {{ $announcement->category ?? 'Offre' }}
                            </span>
                        </div>
                        
                        <h5 class="card-title fw-bold text-dark mb-2">
                            {{ $announcement->title }}
                        </h5>

                        <h6 class="card-subtitle text-muted mb-3 d-flex align-items-center gap-2">
                            <i>🏢</i> {{ $announcement->company_name ?? $announcement->company }}
                        </h6>

                        <p class="card-text text-secondary mb-4" style="font-size: 0.9rem;">
                            {{ Str::limit($announcement->description, 80, '...') }}
                        </p>

                        <div class="mt-auto mb-3 text-muted fw-semibold" style="font-size: 0.85rem;">
                            <i>📍</i> {{ $announcement->city }}
                        </div>

                        <a href="{{ route('announcements.show', $announcement->id) }}" class="btn btn-dark w-100 mt-auto fw-bold py-2">
                            Voir Détail &rarr;
                        </a>
                    </div>
                    
                    <div class="card-footer bg-white border-0 pt-0 pb-3 text-center">
                        <small class="text-muted">Publié le {{ $announcement->created_at->format('d/m/Y') }}</small>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">Aucune annonce disponible pour le moment.</h4>
            </div>
        @endforelse
    </div>

    <div class="d-flex justify-content-center mt-5">
        {{ $announcements->links('pagination::bootstrap-5') }}
    </div>

</div>

<style>
    .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .hover-lift:hover {
        transform: translateY(-8px);
        box-shadow: 0 1rem 2rem rgba(0,0,0,.1)!important;
    }
</style>
@endsection
