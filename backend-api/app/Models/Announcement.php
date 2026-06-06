<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $table = 'announcements';

    protected $fillable = [
        'user_id',
        'company_name',
        'company',
        'category',
        'title',
        'description',
        'contact_email',
        'contact_phone',
        'contact_address',
        'website',
        'city',
        'expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
