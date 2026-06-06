<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

header('Content-Type: application/json');

try {
    // 1) Count all rows
    $total = DB::table('announcements')->count();
    
    // 2) Fetch all raw rows
    $all = DB::table('announcements')->get();
    
    // 3) Check expires_at filter
    $today = Carbon::today()->toDateString();
    $active = DB::table('announcements')
        ->where(function($q) use ($today) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>=', $today);
        })
        ->get();

    echo json_encode([
        'total_rows' => $total,
        'today' => $today,
        'active_count' => count($active),
        'all_rows' => $all,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (\Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
