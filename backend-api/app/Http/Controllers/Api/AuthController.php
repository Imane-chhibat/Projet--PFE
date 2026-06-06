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
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'role'   => $validated['role'],
                'avatar' => null,
                'phone'  => $user->phone,
                'city'   => $user->city,
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

        if (!$user) {
            \Illuminate\Support\Facades\Log::error('User not found', ['email' => $request->email]);
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects'],
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            \Illuminate\Support\Facades\Log::error('Password incorrect', ['email' => $request->email]);
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
            'admin'   => 'Admin',
            default   => 'Registered User',
        };

        return response()->json([
            'message' => 'Connexion réussie',
            'user'    => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'role'   => $frontendRole,
                'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
                'phone'  => $user->phone,
                'city'   => $user->city,
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

    /**
     * POST /api/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'Email introuvable'
            ], 404);
        }

        // Generate a secure random token
        $token = bin2hex(random_bytes(32));

        // Store token in password_reset_tokens table
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // Build the reset link pointing to the React frontend
        $resetLink = "http://localhost:3000/reset-password?token={$token}&email=" . urlencode($email);

        // Send email via Laravel Mail (Gmail SMTP)
        try {
            \Illuminate\Support\Facades\Mail::to($email)->send(
                new \App\Mail\ResetPasswordMail($resetLink, $user->name)
            );

            \Illuminate\Support\Facades\Log::info('Password reset email sent', ['email' => $email]);

            return response()->json([
                'message' => 'Email envoyé'
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send password reset email', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * POST /api/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $email = $request->email;
        $token = $request->token;
        $newPassword = $request->password;

        // Retrieve the stored token record
        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Le lien est invalide ou a expiré.'], 400);
        }

        // Verify token and expiration (60 minutes)
        if (!Hash::check($token, $record->token) ||
            now()->diffInMinutes($record->created_at) > 60) {
            return response()->json(['message' => 'Le lien est invalide ou a expiré.'], 400);
        }

        // Find the user and update password
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        // Remove used token
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }

    /**
     * POST /api/verify-otp
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'method' => 'required|in:email,phone',
            'value'  => 'required|string',
            'code'   => 'required|string',
        ]);

        $field = $request->method;
        $value = $request->value;
        $code  = $request->code;

        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $value)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Le code est invalide ou a expiré.'], 400);
        }

        // Verify OTP (10‑minute validity)
        if (!Hash::check($code, $record->token) || now()->diffInMinutes($record->created_at) > 10) {
            return response()->json(['message' => 'Le code est invalide ou a expiré.'], 400);
        }

        return response()->json(['message' => 'Code vérifié avec succès.']);
    }



    /**
     * GET /api/debug/admin
     * Debug endpoint to check admin user
     */
    public function debugAdmin(Request $request): JsonResponse
    {
        $admin = User::where('email', 'admin@handpro.ma')->first();

        if (!$admin) {
            return response()->json([
                'exists' => false,
                'message' => 'Admin user does not exist',
            ]);
        }

        return response()->json([
            'exists' => true,
            'user' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'city' => $admin->city,
                'password_hash' => $admin->password,
            ],
        ]);
    }
}
