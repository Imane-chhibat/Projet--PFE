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
    $today = Carbon::today()->toDateString();
    echo "Today: $today\n\n";
    
    $rows = DB::table('announcements')
        ->where(function($q) use ($today) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>=', $today);
        })
        ->orderBy('created_at', 'desc')
        ->get();
    
    echo "Count: " . count($rows) . "\n\n";
    
    $result = $rows->map(function($ann) {
        return [
            'id'              => $ann->id,
            'company_name'    => $ann->company_name,
            'company'         => $ann->company_name,
            'category'        => $ann->category,
            'specialty'       => $ann->category,
            'title'           => $ann->title,
            'description'     => $ann->description,
            'contact_email'   => $ann->contact_email,
            'email'           => $ann->contact_email,
            'contact_phone'   => $ann->contact_phone,
            'phone'           => $ann->contact_phone,
            'contact_address' => $ann->contact_address,
            'address'         => $ann->contact_address,
            'website'         => $ann->website,
            'city'            => $ann->city,
            'expires_at'      => $ann->expires_at,
            'created_at'      => $ann->created_at,
            'date'            => $ann->created_at ? substr($ann->created_at, 0, 10) : null,
        ];
    })->values();

    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
