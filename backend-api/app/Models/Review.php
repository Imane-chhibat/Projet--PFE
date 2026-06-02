<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['artisan_profile_id', 'client_name', 'client_avatar', 'comment', 'rating', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artisanProfile()
    {
        return $this->belongsTo(ArtisanProfile::class);
    }
}
