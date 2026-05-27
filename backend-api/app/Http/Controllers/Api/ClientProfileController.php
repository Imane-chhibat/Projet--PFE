<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Favorite;
use App\Models\SavedPortfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ClientProfileController extends Controller
{
    /**
     * Return the authenticated client's profile data.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        // eager load relationships
        $user->load(['favorites.artisanProfile', 'savedPortfolios.portfolioItem']);

        // Transform favorites
        $favorites = $user->favorites->map(function ($fav) {
            $artisan = $fav->artisanProfile;
            return [
                'id' => $artisan->id,
                'name' => $artisan->name ?? $artisan->user->name ?? 'Artisan',
                'specialty' => $artisan->specialty,
                'rating' => $artisan->rating,
                'imageUrl' => $artisan->avatar ? url('storage/' . $artisan->avatar) : null,
                'imageAlt' => $artisan->specialty,
            ];
        });

        // Transform saved portfolios
        $savedPortfolios = $user->savedPortfolios->map(function ($sp) {
            $item = $sp->portfolioItem;
            return [
                'id' => $item->id,
                'title' => $item->caption ?? 'Inspiration',
                'category' => 'Inspiration',
                'imageUrl' => url('storage/' . $item->image_url),
                'imageAlt' => $item->caption ?? 'Portfolio image',
                'colSpan' => 1,
                'rowSpan' => 1,
            ];
        });

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
            'favorites' => $favorites,
            'savedPortfolios' => $savedPortfolios,
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
            'avatar' => 'nullable|image|max:2048', // 2MB
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
        }
        if (isset($validated['city'])) {
            $user->city = $validated['city'];
        }

        if ($request->hasFile('avatar')) {
            // Delete old avatar
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
            ],
        ]);
    }

    /**
     * Toggle a favorite artisan for the client.
     */
    public function toggleFavorite(Request $request)
    {
        $validated = $request->validate([
            'artisan_id' => 'required|exists:artisan_profiles,id',
        ]);

        $user = $request->user();
        $artisanId = $validated['artisan_id'];

        $exists = $user->favorites()->where('artisan_profile_id', $artisanId)->exists();

        if ($exists) {
            $user->favorites()->detach($artisanId);
            $action = 'removed';
        } else {
            $user->favorites()->attach($artisanId);
            $action = 'added';
        }

        return response()->json(['message' => "Favori {$action}"]);
    }

    /**
     * Toggle a saved portfolio item for the client.
     */
    public function toggleSavedPortfolio(Request $request)
    {
        $validated = $request->validate([
            'portfolio_item_id' => 'required|exists:portfolio_items,id',
        ]);

        $user = $request->user();
        $portfolioItemId = $validated['portfolio_item_id'];

        $exists = $user->savedPortfolios()->where('portfolio_item_id', $portfolioItemId)->exists();

        if ($exists) {
            $user->savedPortfolios()->detach($portfolioItemId);
            $action = 'removed';
        } else {
            $user->savedPortfolios()->attach($portfolioItemId);
            $action = 'added';
        }

        return response()->json(['message' => "Enregistrement {$action}"]);
    }
}


namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Favorite;
use App\Models\SavedPortfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ClientProfileController extends Controller
{
    /**
     * Return the authenticated client's profile data.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $user->load(['favorites.artisanProfile', 'savedPortfolios.portfolioItem']);
        return response()->json([
            'user' => $user,
            'favorites' => $user->favorites,
            'savedPortfolios' => $user->savedPortfolios,
        ]);
    }

    /**
     * Update the client's profile, including avatar upload.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->only(['name', 'email', 'phone', 'city']);
        $validator = Validator::make($data, [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20',
            'city' => 'sometimes|string|max:100',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }
        $user->update($validator->validated());

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
            $user->save();
        }
        return response()->json(['message' => 'Profil mis à jour', 'user' => $user]);
    }

    /**
     * Toggle a favorite artisan for the client.
     */
    public function toggleFavorite(Request $request)
    {
        $user = $request->user();
        $artisanId = $request->input('artisan_id');
        $favorite = Favorite::where('user_id', $user->id)
            ->where('artisan_profile_id', $artisanId)
            ->first();
        if ($favorite) {
            $favorite->delete();
            $action = 'removed';
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'artisan_profile_id' => $artisanId,
            ]);
            $action = 'added';
        }
        return response()->json(['message' => "Favori {$action}"]);
    }

    /**
     * Toggle a saved portfolio item for the client.
     */
    public function toggleSavedPortfolio(Request $request)
    {
        $user = $request->user();
        $portfolioItemId = $request->input('portfolio_item_id');
        $saved = SavedPortfolio::where('user_id', $user->id)
            ->where('portfolio_item_id', $portfolioItemId)
            ->first();
        if ($saved) {
            $saved->delete();
            $action = 'removed';
        } else {
            SavedPortfolio::create([
                'user_id' => $user->id,
                'portfolio_item_id' => $portfolioItemId,
            ]);
            $action = 'added';
        }
        return response()->json(['message' => "Enregistrement {$action}"]);
    }
}


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ClientProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        // Load relationships
        $user->load([
            'favorites', 
            'savedPortfolios'
        ]);

        // Transform favorites to match Artisan frontend interface
        $favorites = $user->favorites->map(function ($artisan) {
            return [
                'id' => $artisan->id,
                'name' => $artisan->name ?? $artisan->user->name ?? 'Artisan',
                'specialty' => $artisan->specialty,
                'rating' => $artisan->rating,
                'imageUrl' => $artisan->avatar ? url('storage/' . $artisan->avatar) : null,
                'imageAlt' => $artisan->specialty,
            ];
        });

        // Transform saved portfolios
        $savedPortfolios = $user->savedPortfolios->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->caption ?? 'Inspiration',
                'category' => 'Inspiration', // Default category
                'imageUrl' => url('storage/' . $item->image_url),
                'imageAlt' => $item->caption ?? 'Portfolio image',
                'colSpan' => 1,
                'rowSpan' => 1,
            ];
        });

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
            'favorites' => $favorites,
            'savedPortfolios' => $savedPortfolios,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'avatar' => 'nullable|image|max:2048', // 2MB max
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
            // Delete old avatar if exists
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

    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'artisan_id' => 'required|exists:artisan_profiles,id',
        ]);

        $user = $request->user();
        $artisanId = $request->artisan_id;

        $favorites = $user->favorites();
        
        if ($favorites->where('artisan_profile_id', $artisanId)->exists()) {
            $favorites->detach($artisanId);
            $isFavorited = false;
        } else {
            $favorites->attach($artisanId);
            $isFavorited = true;
        }

        return response()->json([
            'success' => true,
            'is_favorited' => $isFavorited,
        ]);
    }

    public function toggleSavedPortfolio(Request $request)
    {
        $request->validate([
            'portfolio_item_id' => 'required|exists:portfolio_items,id',
        ]);

        $user = $request->user();
        $portfolioItemId = $request->portfolio_item_id;

        $savedPortfolios = $user->savedPortfolios();
        
        if ($savedPortfolios->where('portfolio_item_id', $portfolioItemId)->exists()) {
            $savedPortfolios->detach($portfolioItemId);
            $isSaved = false;
        } else {
            $savedPortfolios->attach($portfolioItemId);
            $isSaved = true;
        }

        return response()->json([
            'success' => true,
            'is_saved' => $isSaved,
        ]);
    }
}
