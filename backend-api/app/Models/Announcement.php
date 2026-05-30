<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Announcement extends Model
{
    protected $fillable = ['title', 'company', 'category', 'city', 'date', 'description'];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
