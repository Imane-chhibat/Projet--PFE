<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        $announcements = Announcement::whereNull('expires_at')
            ->orWhere('expires_at', '>=', now()->toDateString())
            ->get()
            ->map(fn ($a) => [
                'id'          => 'ann-' . $a->id,
                'title'       => $a->title,
                'company'     => $a->company,
                'category'    => $a->category,
                'city'        => $a->city,
                'website'     => $a->website,
                'date'        => $a->date,
                'description' => $a->description,
                'email'       => $a->email,
                'phone'       => $a->phone,
                'address'     => $a->address,
                'expires_at'  => $a->expires_at,
                'created_at'  => $a->created_at,
            ]);

        return response()->json($announcements);
    }
}
