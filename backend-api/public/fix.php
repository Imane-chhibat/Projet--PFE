<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    if (!Schema::hasColumn('announcements', 'user_id')) {
        Schema::table('announcements', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        echo "✅ Colonne 'user_id' ajoutée avec succès !";
    } else {
        echo "✅ Colonne 'user_id' existe déjà.";
    }
} catch (\Exception $e) {
    echo "ERREUR: " . $e->getMessage();
}
