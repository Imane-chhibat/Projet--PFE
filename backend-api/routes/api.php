<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ArtisanController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\ClientRequestController;
use App\Http\Controllers\Api\ClientProfileController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\StatsController;

/*
|--------------------------------------------------------------------------
| HandPro API Routes
|--------------------------------------------------------------------------
*/

// ── Endpoints Publics ────────────────────────────────────────
Route::get('/categories',    [CategoryController::class,    'index']);
Route::get('/artisans',      [ArtisanController::class,     'index']);
Route::get('/artisans/nearby', [ArtisanController::class,   'nearby']);
Route::get('/artisans/{id}', [ArtisanController::class,     'show']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/testimonials',  [TestimonialController::class, 'index']);
Route::get('/comments',      [CommentController::class,     'index']);
Route::get('/comments/all',  [CommentController::class,     'all']);
Route::get('/cities',        [CategoryController::class,    'cities']); // Using CategoryController for now or maybe a DataController
Route::get('/statistics',    [ArtisanController::class,     'statistics']);
Route::get('/stats/public',  [StatsController::class,       'public']);
Route::get('/debug/admin',   [AuthController::class,         'debugAdmin']);
Route::post('/verify-diploma', [App\Http\Controllers\DiplomaController::class, 'verify']);

// ── Authentification ─────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ── Endpoints Protégés (Sanctum) ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/artisans/{id}/reviews', [ArtisanController::class, 'addReview']);
    Route::post('/comments', [CommentController::class, 'store']);

    // ── Mon Profil Artisan ──
    Route::get('/my-profile',  [ArtisanController::class, 'myProfile']);
    Route::post('/my-profile', [ArtisanController::class, 'updateMyProfile']);
    Route::post('/my-profile/update', [ArtisanController::class, 'updateMyProfile']);
    Route::post('/my-profile/portfolio', [ArtisanController::class, 'addPortfolioItem']);
    Route::delete('/my-profile/portfolio/{itemId}', [ArtisanController::class, 'removePortfolioItem']);

    // ── Demandes Clients ──
    Route::post('/requests', [ClientRequestController::class, 'store']);
    Route::get('/artisan/requests', [ClientRequestController::class, 'indexArtisan']);
    Route::get('/client/requests', [ClientRequestController::class, 'indexClient']);
    Route::get('/artisan/notifications', [ClientRequestController::class, 'notifications']);
    Route::put('/artisan/requests/mark-read', [ClientRequestController::class, 'markAsRead']);
    Route::put('/requests/{id}/accept', [ClientRequestController::class, 'accept']);
    Route::put('/requests/{id}/reject', [ClientRequestController::class, 'reject']);
    Route::put('/requests/{id}/cancel', [ClientRequestController::class, 'cancel']);

    // ── Profil Client ──
    Route::get('/client/profile', [ClientProfileController::class, 'getProfile']);
    Route::post('/client/profile/update', [ClientProfileController::class, 'updateProfile']);
    Route::get('/client/favorites', [ClientProfileController::class, 'getFavorites']);
    Route::post('/client/favorites', [ClientProfileController::class, 'addFavorite']);
    Route::delete('/client/favorites/{artisanId}', [ClientProfileController::class, 'removeFavorite']);

    Route::get('/client/reviews', [ClientProfileController::class, 'getMyReviews']);
    Route::delete('/client/reviews/{id}', [ClientProfileController::class, 'deleteMyReview']);
    Route::get('/client/comments', [ClientProfileController::class, 'getMyComments']);
    Route::delete('/client/comments/{id}', [ClientProfileController::class, 'deleteMyComment']);

    // ── Admin Dashboard ──
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::get('/admin/announcements/{id}/applications', [AdminController::class, 'getAnnouncementApplications']);
    Route::put('/admin/applications/{id}/status', [AdminController::class, 'updateApplicationStatus']);

    // ── Admin Protected Routes ──
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

    // ── Applications aux annonces ──
    Route::post('/announcements/{id}/apply', [AdminController::class, 'applyToAnnouncement']);
});
