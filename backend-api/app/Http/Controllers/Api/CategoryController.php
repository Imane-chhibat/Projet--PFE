<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::all()->map(fn ($cat) => [
            'id'       => $cat->slug,
            'name'     => $cat->name,
            'iconName' => $cat->icon_name,
        ]);

        return response()->json($categories);
    }

    public function cities(): JsonResponse
    {
        // For now, return a static list of Moroccan cities
        $cities = [
            'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
            'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida',
            'Béni Mellal', 'Nador', 'Khouribga', 'Settat', 'Ouarzazate'
        ];

        return response()->json($cities);
    }
}
