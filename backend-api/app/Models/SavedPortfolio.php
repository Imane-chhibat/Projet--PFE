<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedPortfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'portfolio_item_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function portfolioItem()
    {
        return $this->belongsTo(PortfolioItem::class);
    }
}
