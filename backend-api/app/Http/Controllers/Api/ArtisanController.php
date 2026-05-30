<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtisanProfile;
use App\Models\ClientRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtisanController extends Controller
{
    /**
     * GET /api/statistics
     */
    public function statistics(): JsonResponse
    {
        // For now, return static marketing stats or calculated from DB
        return response()->json([
            'artisans' => '1200+',
            'cities'   => '48',
            'rating'   => '4.8★'
        ]);
    }

    /**
     * GET /api/artisans?category=xxx&city=xxx
     */
    public function index(Request $request): JsonResponse
    {
        $query = ArtisanProfile::with(['user', 'category', 'services', 'skills', 'portfolioItems', 'reviews']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category)
                ->orWhere('name', 'like', '%' . $request->category . '%'));
        }

        if ($request->filled('city')) {
            $query->whereHas('user', fn ($q) => $q->where('city', 'like', '%' . $request->city . '%'));
        }

        $artisans = $query->get()->map(fn ($p) => $this->formatProfile($p));

        return response()->json($artisans);
    }

    /**
     * GET /api/artisans/{id}
     */
    public function show(string $id): JsonResponse
    {
        // Remove 'artisan-' prefix if it exists
        $id = str_replace('artisan-', '', $id);
        
        $profile = ArtisanProfile::with(['user', 'category', 'services', 'skills', 'portfolioItems', 'reviews'])
            ->findOrFail($id);

        return response()->json($this->formatProfile($profile));
    }

    /**
     * POST /api/artisans/{id}/reviews
     */
    public function addReview(Request $request, string $id): JsonResponse
    {
        $id = str_replace('artisan-', '', $id);
        $profile = ArtisanProfile::findOrFail($id);

        $validated = $request->validate([
            'clientName' => 'required|string|max:255',
            'clientAvatar' => 'nullable|string',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $review = Review::create([
            'artisan_profile_id' => $profile->id,
            'client_name'        => $validated['clientName'],
            'client_avatar'      => $validated['clientAvatar'] ?? null,
            'comment'            => $validated['comment'],
            'rating'             => $validated['rating'],
        ]);

        // Update review count
        $profile->increment('review_count');
        $profile->rating = $profile->reviews()->avg('rating');
        $profile->save();

        return response()->json([
            'message' => 'Avis ajouté avec succès',
            'review'  => [
                'id'           => 'r' . $review->id,
                'clientName'   => $review->client_name,
                'clientAvatar' => $review->client_avatar ?? '',
                'date'         => 'À l\'instant',
                'comment'      => $review->comment,
                'rating'       => $review->rating,
            ],
        ], 201);
    }

    /**
     * GET /api/my-profile — Get authenticated artisan's profile
     */
    public function myProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = ArtisanProfile::with(['user', 'category', 'services', 'skills', 'portfolioItems', 'reviews'])
            ->where('user_id', $user->id)
            ->first();

        if (!$profile) {
            // Create a default profile if none exists
            $profile = ArtisanProfile::create([
                'user_id' => $user->id,
                'category_id' => null,
                'specialty' => 'Artisan',
                'description' => '',
                'rating' => 0,
                'review_count' => 0,
                'is_certified' => false,
                'experience_years' => 0,
                'availability' => 'available',
            ]);
        }

        return response()->json($this->formatProfile($profile));
    }

    /**
     * PUT /api/my-profile — Update authenticated artisan's profile
     */
    public function updateMyProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = ArtisanProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profil artisan non trouvé'], 404);
        }

        $validated = $request->validate([
            'name'            => 'nullable|string|max:255',
            'phone'           => 'nullable|string|max:50',
            'city'            => 'nullable|string|max:100',
            'specialty'       => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'experience_years'=> 'nullable|integer|min:0',
            'availability'    => 'nullable|in:available,busy',
            'avatar'          => 'nullable|file|mimes:jpeg,png,jpg,webp|max:5120',
            'coverPhoto'      => 'nullable|file|mimes:jpeg,png,jpg,webp|max:5120',
            'busyDays'        => 'nullable|string',
            'services'        => 'nullable|string',
            'skills'          => 'nullable|string',
        ]);

        // Update user info
        if ($request->has('name'))  $user->name  = $validated['name'] ?? $user->name;
        if ($request->has('phone')) $user->phone = $validated['phone'] ?? null;
        if ($request->has('city'))  $user->city  = $validated['city'] ?? null;
        $user->save();

        // Update profile info
        if ($request->has('specialty'))        $profile->specialty        = $validated['specialty'] ?? $profile->specialty;
        if ($request->has('description'))      $profile->description      = $validated['description'] ?? null;
        if ($request->has('experience_years')) $profile->experience_years = $validated['experience_years'] ?? 0;
        if ($request->has('availability'))     $profile->availability     = $validated['availability'] ?? 'available';

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_avatar_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/profiles'), $filename);
            $profile->avatar = url('/uploads/profiles/' . $filename);
        }

        if ($request->hasFile('coverPhoto')) {
            $file = $request->file('coverPhoto');
            $filename = time() . '_cover_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/profiles'), $filename);
            $profile->cover_photo = url('/uploads/profiles/' . $filename);
        }

        if ($request->has('busyDays')) {
            $busyDaysData = json_decode($validated['busyDays'] ?? '[]', true);
            $profile->busy_days = is_array($busyDaysData) ? $busyDaysData : [];
        }

        $profile->save();

        if ($request->has('services')) {
            $servicesData = json_decode($validated['services'] ?? '[]', true);
            if (is_array($servicesData)) {
                $profile->services()->delete();
                foreach($servicesData as $srv) {
                    $profile->services()->create([
                        'name' => $srv['name'] ?? '',
                        'price_range' => $srv['priceRange'] ?? null,
                        'description' => $srv['description'] ?? null,
                    ]);
                }
            }
        }

        if ($request->has('skills')) {
            $skillsData = json_decode($validated['skills'] ?? '[]', true);
            if (is_array($skillsData)) {
                $profile->skills()->delete();
                foreach($skillsData as $sk) {
                    $profile->skills()->create([
                        'name' => $sk['name'] ?? '',
                        'percentage' => $sk['percentage'] ?? 0,
                    ]);
                }
            }
        }

        $profile->load(['user', 'category', 'services', 'skills', 'portfolioItems', 'reviews']);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'profile' => $this->formatProfile($profile),
        ]);
    }
    /**
     * POST /api/my-profile/portfolio — Upload a portfolio image
     */
    public function addPortfolioItem(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = ArtisanProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profil artisan non trouvé'], 404);
        }

        if ($profile->portfolioItems()->count() >= 4) {
            return response()->json(['message' => 'Limite de 4 photos atteinte'], 400);
        }

        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,webp|max:5120',
            'caption' => 'nullable|string|max:255'
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/portfolio'), $filename);

        $url = url('/uploads/portfolio/' . $filename);

        $item = \App\Models\PortfolioItem::create([
            'artisan_profile_id' => $profile->id,
            'url' => $url,
            'caption' => $request->caption ?? '',
        ]);

        return response()->json([
            'message' => 'Image ajoutée au portfolio',
            'item' => [
                'id'      => 'p' . $item->id,
                'url'     => $item->url,
                'caption' => $item->caption,
            ]
        ], 201);
    }

    /**
     * DELETE /api/my-profile/portfolio/{itemId}
     */
    public function removePortfolioItem(Request $request, $itemId): JsonResponse
    {
        $user = $request->user();
        $profile = ArtisanProfile::where('user_id', $user->id)->first();
        if (!$profile) {
            return response()->json(['message' => 'Profil artisan non trouvé'], 404);
        }

        // Clean itemId since frontend might prefix with 'p'
        $id = str_replace('p', '', $itemId);
        $item = \App\Models\PortfolioItem::where('id', $id)->where('artisan_profile_id', $profile->id)->first();
        
        if ($item) {
            // Delete file if exists
            $path = public_path(str_replace(url('/'), '', $item->url));
            if (file_exists($path) && is_file($path)) {
                @unlink($path);
            }
            $item->delete();
        }

        return response()->json(['message' => 'Image supprimée']);
    }
    /**
     * Format an ArtisanProfile to match the frontend Artisan interface.
     */
    private function formatProfile(ArtisanProfile $p): array
    {
        // Get busy dates from accepted client requests for this artisan
        $busyDates = ClientRequest::where('artisan_id', $p->user_id)
            ->whereIn('status', ['pending', 'accepted'])
            ->pluck('requested_date')
            ->map(fn ($d) => \Carbon\Carbon::parse($d)->format('Y-m-d'))
            ->unique()
            ->values()
            ->toArray();

        return [
            'id'              => 'artisan-' . $p->id,
            'name'            => $p->user->name ?? 'Artisan',
            'specialty'       => $p->specialty,
            'city'            => $p->user->city ?? '',
            'rating'          => (float) $p->rating,
            'reviewCount'     => (int) $p->review_count,
            'isCertified'     => (bool) $p->is_certified,
            'experienceYears' => (int) $p->experience_years,
            'avatar'          => $p->avatar ?? '',
            'coverPhoto'      => $p->cover_photo ?? '',
            'phone'           => $p->user->phone ?? '',
            'availability'    => $p->availability,
            'busyUntil'       => $p->busy_until,
            'busyDays'        => $p->busy_days ?? [],
            'busyDates'       => $busyDates,
            'description'     => $p->description ?? '',
            'services'        => $p->services->map(fn ($s) => [
                'name'        => $s->name,
                'priceRange'  => $s->price_range,
                'description' => $s->description ?? '',
            ])->toArray(),
            'skills'          => $p->skills->map(fn ($s) => [
                'name'       => $s->name,
                'percentage' => (int) $s->percentage,
            ])->toArray(),
            'portfolio'       => $p->portfolioItems->map(fn ($pi) => [
                'id'      => 'p' . $pi->id,
                'url'     => $pi->url,
                'caption' => $pi->caption ?? '',
            ])->toArray(),
            'reviews'         => $p->reviews->map(fn ($r) => [
                'id'           => 'r' . $r->id,
                'clientName'   => $r->client_name,
                'clientAvatar' => $r->client_avatar ?? '',
                'date'         => $r->created_at?->diffForHumans() ?? '',
                'comment'      => $r->comment,
                'rating'       => (int) $r->rating,
            ])->toArray(),
            'lat'             => (float) $p->lat,
            'lng'             => (float) $p->lng,
            'distanceKm'      => (float) $p->distance_km,
        ];
    }
}
