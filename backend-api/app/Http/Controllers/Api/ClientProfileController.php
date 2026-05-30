<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Favorite;
use App\Models\SavedPortfolio;
use App\Models\ArtisanProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClientProfileController extends Controller
{
    /**
     * Return the authenticated client's profile data.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Update the client's profile, including avatar upload.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->has('name')) {
            $user->name = $validated['name'];
        }
        if ($request->has('phone')) {
            $user->phone = $validated['phone'];
        }
        if ($request->has('city')) {
            $user->city = $validated['city'];
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
            ]
        ]);
    }

    /**
     * Get client's favorite artisans.
     */
    public function getFavorites(Request $request)
    {
        $user = $request->user();
        $favorites = $user->favorites()->with('user')->get();

        $transformed = $favorites->map(function ($artisan) {
            return [
                'id' => $artisan->id,
                'artisan' => [
                    'id' => $artisan->id,
                    'name' => $artisan->user->name,
                    'specialty' => $artisan->specialty,
                    'city' => $artisan->city,
                    'avatar' => $artisan->avatar ? url('storage/' . $artisan->avatar) : null,
                ]
            ];
        });

        return response()->json([
            'favorites' => $transformed
        ]);
    }

    /**
     * Add a favorite artisan.
     */
    public function addFavorite(Request $request)
    {
        $validated = $request->validate([
            'artisan_id' => 'required|exists:artisan_profiles,id',
        ]);

        $user = $request->user();
        $artisanId = $validated['artisan_id'];

        $exists = $user->favorites()->where('artisan_profile_id', $artisanId)->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in favorites'], 400);
        }

        $user->favorites()->attach($artisanId);

        return response()->json(['message' => 'Added to favorites']);
    }

    /**
     * Remove a favorite artisan.
     */
    public function removeFavorite(Request $request, $artisanId)
    {
        $user = $request->user();
        
        $user->favorites()->where('artisan_profile_id', $artisanId)->delete();

        return response()->json(['message' => 'Removed from favorites']);
    }
}
