<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ArtisanProfile;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/register
     */
    public function register(Request $request): JsonResponse
    {
        \Illuminate\Support\Facades\Log::info('Register attempt', $request->all());
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|string|min:6',
            'role'        => 'required|in:Registered User,Artisan,Visitor',
            'specialty'   => 'nullable|string',
            'category_id' => 'nullable|string',
            'city'        => 'nullable|string',
            'phone'       => 'nullable|string',
            'cin'         => 'nullable|string',
            'is_certified'=> 'nullable|boolean',
            'attestation' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        // Map frontend role names to backend
        $role = match ($validated['role']) {
            'Artisan' => 'artisan',
            default   => 'client',
        };

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $role,
            'city'     => $validated['city'] ?? null,
            'phone'    => $validated['phone'] ?? null,
        ]);
        
        \Illuminate\Support\Facades\Log::info('User created', ['id' => $user->id]);

        // If registering as artisan, create the profile
        if ($role === 'artisan') {
            $categoryId = null;
            if (!empty($validated['category_id'])) {
                $cat = Category::where('slug', $validated['category_id'])->first();
                $categoryId = $cat?->id;
            }

            $attestationPath = null;
            if ($request->hasFile('attestation')) {
                $path = $request->file('attestation')->store('attestations', 'public');
                $attestationPath = asset('storage/' . $path);
            }

            ArtisanProfile::create([
                'user_id'      => $user->id,
                'category_id'  => $categoryId,
                'specialty'    => $validated['specialty'] ?? 'Artisan',
                'description'  => $validated['description'] ?? '',
                'rating'       => 0,
                'review_count' => 0,
                'is_certified' => $validated['is_certified'] ?? false,
                'experience_years' => 0,
                'availability' => 'available',
                'attestation_path' => $attestationPath,
            ]);
            \Illuminate\Support\Facades\Log::info('Artisan Profile created');
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $validated['role'], // Return frontend role name
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * POST /api/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects'],
            ]);
        }

        // Revoke old tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        // Map backend role to frontend
        $frontendRole = match ($user->role) {
            'artisan' => 'Artisan',
            'admin'   => 'Registered User',
            default   => 'Registered User',
        };

        return response()->json([
            'message' => 'Connexion réussie',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $frontendRole,
            ],
            'token' => $token,
        ]);
    }

    /**
     * POST /api/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /**
     * PUT /api/change-password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'L\'ancien mot de passe est incorrect.'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
}
