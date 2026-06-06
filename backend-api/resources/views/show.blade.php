@extends('layouts.app')

@section('content')
<div class="container py-5">
    <a href="{{ route('home') }}" class="btn btn-outline-secondary mb-4">
        &larr; Retour aux annonces
    </a>

    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div class="card-header bg-dark text-white p-4">
            <span class="badge bg-warning text-dark px-3 py-2 text-uppercase mb-3">
                {{ $announcement->category ?? 'Non catégorisé' }}
            </span>
            <h1 class="card-title fw-bold">{{ $announcement->title }}</h1>
            <h5 class="text-light mb-0">
                <i>🏢</i> {{ $announcement->company_name ?? $announcement->company }}
            </h5>
        </div>

        <div class="card-body p-5">
            <h4 class="fw-bold mb-3">Description du poste / de l'offre</h4>
            <p class="text-secondary mb-5" style="font-size: 1.1rem; line-height: 1.8;">
                {!! nl2br(e($announcement->description)) !!}
            </p>

            <hr class="mb-4">

            <h5 class="fw-bold mb-4">Informations de contact</h5>
            
            <div class="row g-4">
                @if($announcement->contact_email)
                <div class="col-md-6">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-light p-3 rounded-circle text-primary"><i>📧</i></div>
                        <div>
                            <small class="text-muted d-block text-uppercase fw-bold">Email</small>
                            <a href="mailto:{{ $announcement->contact_email }}" class="text-dark fw-semibold text-decoration-none">
                                {{ $announcement->contact_email }}
                            </a>
                        </div>
                    </div>
                </div>
                @endif

                @if($announcement->contact_phone)
                <div class="col-md-6">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-light p-3 rounded-circle text-success"><i>📞</i></div>
                        <div>
                            <small class="text-muted d-block text-uppercase fw-bold">Téléphone</small>
                            <a href="tel:{{ $announcement->contact_phone }}" class="text-dark fw-semibold text-decoration-none">
                                {{ $announcement->contact_phone }}
                            </a>
                        </div>
                    </div>
                </div>
                @endif

                <div class="col-md-6">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-light p-3 rounded-circle text-danger"><i>📍</i></div>
                        <div>
                            <small class="text-muted d-block text-uppercase fw-bold">Ville / Localisation</small>
                            <span class="text-dark fw-semibold">
                                {{ $announcement->city }} 
                                {{ $announcement->contact_address ? ' - ' . $announcement->contact_address : '' }}
                            </span>
                        </div>
                    </div>
                </div>

                @if($announcement->website)
                <div class="col-md-6">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-light p-3 rounded-circle text-info"><i>🌐</i></div>
                        <div>
                            <small class="text-muted d-block text-uppercase fw-bold">Site Web</small>
                            <a href="{{ $announcement->website }}" target="_blank" class="text-dark fw-semibold text-decoration-none">
                                Visiter le site web
                            </a>
                        </div>
                    </div>
                </div>
                @endif
            </div>
        </div>

        <div class="card-footer bg-light p-4 text-center text-muted">
            Publiée le {{ $announcement->created_at->format('d/m/Y à H:i') }}
            @if($announcement->expires_at)
                | <strong>Expire le :</strong> {{ $announcement->expires_at->format('d/m/Y') }}
            @endif
        </div>
    </div>
</div>
@endsection
