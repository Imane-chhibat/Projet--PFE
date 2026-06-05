<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Announcement;

class StatsController extends Controller
{
    public function public()
    {
        try {
            $artisansCount = User::where('role', 'artisan')->count();
            $clientsCount  = User::where('role', 'client')->count();
            $citiesCount   = User::where('role', 'artisan')
                                 ->whereNotNull('city')
                                 ->distinct('city')
                                 ->count('city');

            return response()->json([
                'artisans_count' => $artisansCount,
                'clients_count'  => $clientsCount,
                'cities_count'   => $citiesCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'artisans_count' => 0,
                'clients_count'  => 0,
                'cities_count'   => 0,
            ], 200);
        }
    }
}
