<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $table = 'announcements';

    protected $fillable = [
        'company_name',
        'category',
        'title',
        'description',
        'contact_email',
        'contact_phone',
        'contact_address',
        'website',
        'city',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
