<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('announcements', 'date')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->dropColumn('date');
            });
        }
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->string('date')->nullable();
        });
    }
};
