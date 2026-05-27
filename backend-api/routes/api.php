<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ArtisanController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\ClientRequestController;
use App\Http\Controllers\Api\ClientProfileController;

/*
|--------------------------------------------------------------------------
| HandPro API Routes
|--------------------------------------------------------------------------
*/

// ── Endpoints Publics ────────────────────────────────────────
Route::get('/categories',    [CategoryController::class,    'index']);
Route::get('/artisans',      [ArtisanController::class,     'index']);
Route::get('/artisans/{id}', [ArtisanController::class,     'show']);
Route::get('/announcements', [AnnouncementController::class,'index']);
Route::get('/testimonials',  [TestimonialController::class, 'index']);
Route::get('/cities',        [CategoryController::class,    'cities']); // Using CategoryController for now or maybe a DataController
Route::get('/statistics',    [ArtisanController::class,     'statistics']);

// ── Authentification ─────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Endpoints Protégés (Sanctum) ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/artisans/{id}/reviews', [ArtisanController::class, 'addReview']);

    // ── Mon Profil Artisan ──
    Route::get('/my-profile',  [ArtisanController::class, 'myProfile']);
    Route::put('/my-profile',  [ArtisanController::class, 'updateMyProfile']);
    Route::post('/my-profile/portfolio', [ArtisanController::class, 'addPortfolioItem']);
    Route::delete('/my-profile/portfolio/{itemId}', [ArtisanController::class, 'removePortfolioItem']);

    // ── Demandes Clients ──
    Route::post('/requests', [ClientRequestController::class, 'store']);
    Route::get('/artisan/requests', [ClientRequestController::class, 'indexArtisan']);
    Route::put('/artisan/requests/mark-read', [ClientRequestController::class, 'markAsRead']);
    Route::put('/requests/{id}/accept', [ClientRequestController::class, 'accept']);

    // ── Profil Client ──
    Route::get('/client/profile', [ClientProfileController::class, 'getProfile']);
    Route::post('/client/profile/update', [ClientProfileController::class, 'updateProfile']);
    Route::post('/client/favorites/toggle', [ClientProfileController::class, 'toggleFavorite']);
    Route::post('/client/saved-portfolios/toggle', [ClientProfileController::class, 'toggleSavedPortfolio']);
});
