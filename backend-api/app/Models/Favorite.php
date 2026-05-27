<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'artisan_profile_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artisanProfile()
    {
        return $this->belongsTo(ArtisanProfile::class);
    }
}
