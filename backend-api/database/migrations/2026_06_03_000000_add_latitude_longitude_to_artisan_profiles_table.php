<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('artisan_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('artisan_profiles', 'latitude')) {
                $table->double('latitude')->nullable()->after('availability');
            }
            if (!Schema::hasColumn('artisan_profiles', 'longitude')) {
                $table->double('longitude')->nullable()->after('latitude');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artisan_profiles', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
