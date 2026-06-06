<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ArtisanProfile;
use App\Models\Announcement;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * GET /api/admin/stats
     * Get admin statistics
     */
    public function getStats(Request $request): JsonResponse
    {
        $clientsCount = User::whereIn('role', ['Registered User', 'client', 'Client'])->count();
        
        $certifiedArtisansCount = ArtisanProfile::where('is_certified', true)->count();
        $nonCertifiedArtisansCount = ArtisanProfile::where('is_certified', false)->count();
        
        $announcementsCount = Announcement::count();
        
        // Count all types of reviews/comments to show on dashboard
        $commentsCount = 0;
        if (class_exists(\App\Models\Review::class)) $commentsCount += \App\Models\Review::count();
        if (class_exists(\App\Models\Testimonial::class)) $commentsCount += \App\Models\Testimonial::count();
        if (class_exists(\App\Models\Comment::class)) $commentsCount += \App\Models\Comment::count();

        // Visitors count (Mocked as typical analytics or DB table if exists)
        $visitorsCount = 1520; 

        return response()->json([
            'clients_count' => $clientsCount,
            'certified_artisans_count' => $certifiedArtisansCount,
            'non_certified_artisans_count' => $nonCertifiedArtisansCount,
            'announcements_count' => $announcementsCount,
            'comments_count' => $commentsCount,
            'visitors_count' => $visitorsCount,
        ]);
    }

    /**
     * GET /api/stats/public
     * Get public statistics for homepage
     */
    public function publicStats(Request $request): JsonResponse
    {
        $clientsCount = User::where('role', 'Registered User')->count();
        $artisansCount = User::where('role', 'Artisan')->count();
        $certifiedArtisansCount = ArtisanProfile::where('is_certified', true)->count();
        $citiesCount = ArtisanProfile::whereNotNull('city')->distinct()->count('city');

        return response()->json([
            'clients_count' => $clientsCount,
            'artisans_count' => $artisansCount,
            'certified_artisans_count' => $certifiedArtisansCount,
            'cities_count' => $citiesCount,
        ]);
    }

    /**
     * POST /api/admin/announcements
     * Create a new announcement
     */
    public function createAnnouncement(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'contact_address' => 'nullable|string|max:255',
            'expires_at' => 'nullable|date',
        ]);

        $announcement = Announcement::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'] ?? 'Général',
            'company' => $validated['company_name'] ?? 'Entreprise',
            'city' => $validated['city'] ?? 'Maroc',
            'website' => $validated['website'] ?? null,
            'email' => $validated['contact_email'] ?? null,
            'phone' => $validated['contact_phone'] ?? null,
            'address' => $validated['contact_address'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
            'date' => "Aujourd'hui",
        ]);

        return response()->json([
            'message' => 'Annonce créée avec succès',
            'announcement' => $announcement,
        ], 201);
    }

    /**
     * DELETE /api/admin/announcements/{id}
     * Delete an announcement
     */
    public function deleteAnnouncement(Request $request, $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json([
            'message' => 'Annonce supprimée avec succès',
        ]);
    }

    /**
     * PUT /api/admin/announcements/{id}
     * Update an announcement
     */
    public function updateAnnouncement(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'contact_address' => 'nullable|string|max:255',
            'expires_at' => 'nullable|date',
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'] ?? 'Général',
            'company' => $validated['company_name'] ?? 'Entreprise',
            'city' => $validated['city'] ?? 'Maroc',
            'website' => $validated['website'] ?? null,
            'email' => $validated['contact_email'] ?? null,
            'phone' => $validated['contact_phone'] ?? null,
            'address' => $validated['contact_address'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Annonce mise à jour avec succès',
            'announcement' => $announcement,
        ]);
    }

    /**
     * GET /api/admin/announcements/{id}/applications
     * Get applications for a specific announcement
     */
    public function getAnnouncementApplications(Request $request, $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);
        $applications = $announcement->applications()->with('artisan')->get();

        return response()->json([
            'applications' => $applications->map(function ($app) {
                $artisanProfile = $app->artisan->artisanProfile;
                $positiveReviews = 0;
                if ($artisanProfile) {
                    $positiveReviews = $artisanProfile->reviews()->where('rating', '>=', 4)->count();
                }

                return [
                    'id' => $app->id,
                    'status' => $app->status,
                    'message' => $app->message,
                    'created_at' => $app->created_at,
                    'artisan' => [
                        'id' => $app->artisan->id,
                        'name' => $app->artisan->name,
                        'email' => $app->artisan->email,
                        'city' => $app->artisan->city,
                        'avatar' => $app->artisan->avatar,
                        'positive_reviews' => $positiveReviews,
                        'total_reviews' => $artisanProfile ? $artisanProfile->review_count : 0,
                        'rating' => $artisanProfile ? $artisanProfile->rating : 0,
                    ],
                ];
            })->sortByDesc('artisan.positive_reviews')->values(),
        ]);
    }

    /**
     * PUT /api/admin/applications/{id}/status
     * Accept or reject an application
     */
    public function updateApplicationStatus(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $application = Application::findOrFail($id);
        $application->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Statut de la candidature mis à jour avec succès',
            'application' => $application,
        ]);
    }

    /**
     * POST /api/announcements/{id}/apply
     * Apply to an announcement (for artisans)
     */
    public function applyToAnnouncement(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'artisan') {
            return response()->json([
                'message' => 'Seuls les artisans peuvent postuler aux annonces',
            ], 403);
        }

        $announcement = Announcement::findOrFail($id);

        // Check if already applied
        $existingApplication = Application::where('announcement_id', $id)
            ->where('artisan_id', $user->id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'message' => 'Vous avez déjà postulé à cette annonce',
            ], 400);
        }

        $application = Application::create([
            'announcement_id' => $id,
            'artisan_id' => $user->id,
            'status' => 'pending',
            'message' => $request->input('message', null),
        ]);

        return response()->json([
            'message' => 'Candidature envoyée avec succès',
            'application' => $application,
        ], 201);
    }
}
