<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('announcements');
        Schema::enableForeignKeyConstraints();

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('category')->default('Autre');
            $table->string('title');
            $table->text('description');
            $table->string('contact_email');
            $table->string('contact_phone', 50);
            $table->string('contact_address')->nullable();
            $table->string('website')->nullable();
            $table->string('city', 100);
            $table->date('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
