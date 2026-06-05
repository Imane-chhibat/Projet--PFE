<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            if (!Schema::hasColumn('announcements', 'company_name'))
                $table->string('company_name')->after('id');
            if (!Schema::hasColumn('announcements', 'category'))
                $table->string('category')->after('company_name');
            if (!Schema::hasColumn('announcements', 'title'))
                $table->string('title')->after('category');
            if (!Schema::hasColumn('announcements', 'description'))
                $table->text('description')->after('title');
            if (!Schema::hasColumn('announcements', 'contact_email'))
                $table->string('contact_email')->after('description');
            if (!Schema::hasColumn('announcements', 'contact_phone'))
                $table->string('contact_phone')->after('contact_email');
            if (!Schema::hasColumn('announcements', 'contact_address'))
                $table->string('contact_address')->nullable()->after('contact_phone');
            if (!Schema::hasColumn('announcements', 'website'))
                $table->string('website')->nullable()->after('contact_address');
            if (!Schema::hasColumn('announcements', 'city'))
                $table->string('city')->after('website');
            if (!Schema::hasColumn('announcements', 'expires_at'))
                $table->date('expires_at')->nullable()->after('city');
        });
    }

    public function down(): void {}
};
