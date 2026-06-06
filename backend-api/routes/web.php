<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\AdminAnnouncementController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/announcements/{id}', [HomeController::class, 'show'])->name('announcements.show');

// Route de login requise par le middleware 'auth'
Route::get('/login', function () {
    // Si la base de données est vide, renvoyer une erreur
    if (\App\Models\User::count() === 0) {
        return "Aucun utilisateur dans la base de données. Exécutez le seeder.";
    }
    
    // Connecte automatiquement le premier utilisateur (Admin) pour faciliter les tests
    $user = \App\Models\User::first();
    auth()->login($user);
    
    return redirect()->route('admin.announcements.index')
        ->with('success', 'Connecté automatiquement en tant que ' . $user->name . ' pour tester l\'interface admin !');
})->name('login');

// Routes admin protégées par le middleware 'auth'
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('announcements', AdminAnnouncementController::class)->except(['show']);
});

// TEMPORARY ROUTE TO RUN MIGRATIONS
Route::get('/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        if (\Illuminate\Support\Facades\Schema::hasColumn('announcements', 'date')) {
            \Illuminate\Support\Facades\Schema::table('announcements', function ($table) {
                $table->dropColumn('date');
            });
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
            return '✅ SUCCÈS : La colonne DATE a été supprimée avec succès ! Vous pouvez maintenant ajouter vos annonces.';
        }
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        return '✅ INFO : La colonne DATE n\'existe déjà plus. Tout est bon !';
    } catch (\Exception $e) {
        return '❌ ERREUR : ' . $e->getMessage();
    }
});
