<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'city',
        'avatar',
    ];

    /**
     * Get the artisan profile associated with this user.
     */
    public function artisanProfile()
    {
        return $this->hasOne(ArtisanProfile::class);
    }

    /**
     * Get the favorite artisans for the user.
     */
    public function favorites()
    {
        return $this->belongsToMany(ArtisanProfile::class, 'favorites', 'user_id', 'artisan_profile_id')
                    ->withTimestamps();
    }

    /**
     * Get the saved portfolio items for the user.
     */
    public function savedPortfolios()
    {
        return $this->belongsToMany(PortfolioItem::class, 'saved_portfolios', 'user_id', 'portfolio_item_id')
                    ->withTimestamps();
    }

    /**
     * Get the applications for the artisan.
     */
    public function applications()
    {
        return $this->hasMany(Application::class, 'artisan_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
