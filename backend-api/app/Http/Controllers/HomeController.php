<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $announcements = Announcement::where(function($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>=', Carbon::today());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(8);

        return view('home', compact('announcements'));
    }

    public function show($id)
    {
        $announcement = Announcement::findOrFail($id);
        return view('show', compact('announcement'));
    }
}
