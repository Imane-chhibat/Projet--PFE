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

    /**
     * POST /api/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'method' => 'required|in:email,phone',
            'value'  => 'required|string',
        ]);

        $field = $request->method;
        $value = $request->value;

        $user = User::where($field, $value)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Aucun compte trouvé avec ces informations.'
            ], 404);
        }

        // Generate a 6‑digit OTP
        $otp = random_int(100000, 999999);

        // Store hashed OTP (expire after 10 minutes)
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $value],
            ['token' => Hash::make($otp), 'created_at' => now()]
        );

        // Send OTP via email (you can replace with your preferred mail view)
        \Illuminate\Support\Facades\Mail::to($value)->send(new \App\Mail\OtpMail($otp));

        // Return a generic success response (do not expose OTP in production)
        return response()->json([
            'message' => 'Code de vérification envoyé avec succès',
            // 'simulated_code' => $otp // uncomment for local debugging
        ]);

    }

    /**
     * POST /api/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'method'   => 'required|in:email,phone',
            'value'    => 'required|string',
            'code'     => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $field = $request->method;
        $value = $request->value;
        $code  = $request->code;
        $newPassword = $request->password;

        // Retrieve the stored OTP record
        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $value)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Le code est invalide ou a expiré.'], 400);
        }

        // Verify OTP and expiration (10 minutes)
        if (!\Illuminate\Support\Facades\Hash::check($code, $record->token) ||
            now()->diffInMinutes($record->created_at) > 10) {
            return response()->json(['message' => 'Le code est invalide ou a expiré.'], 400);
        }

        // Find the user and update password
        $user = User::where($field, $value)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($newPassword);
        $user->save();

        // Remove used token
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $value)
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
