<?php
namespace App\Http\Controllers;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AnnouncementController extends Controller
{
    public function index()
    {
        try {
            $announcements = Announcement::where(function($query) {
                    $query->whereNull('expires_at')
                          ->orWhere('expires_at', '>=', \Carbon\Carbon::today());
                })
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($ann) {
                    return [
                        'id'              => $ann->id,
                        'company_name'    => $ann->company_name ?? $ann->company,
                        'company'         => $ann->company_name ?? $ann->company,
                        'category'        => $ann->category,
                        'specialty'       => $ann->category,
                        'title'           => $ann->title,
                        'description'     => $ann->description,
                        'contact_email'   => $ann->contact_email ?? $ann->email,
                        'email'           => $ann->contact_email ?? $ann->email,
                        'contact_phone'   => $ann->contact_phone ?? $ann->phone,
                        'phone'           => $ann->contact_phone ?? $ann->phone,
                        'contact_address' => $ann->contact_address ?? $ann->address,
                        'address'         => $ann->contact_address ?? $ann->address,
                        'website'         => $ann->website,
                        'city'            => $ann->city,
                        'expires_at'      => $ann->expires_at?->format('Y-m-d'),
                        'created_at'      => $ann->created_at->format('Y-m-d H:i:s'),
                        'date'            => $ann->created_at->format('Y-m-d'),
                    ];
                });

            return response()->json($announcements);

        } catch (\Exception $e) {
            \Log::error('Announcements index error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    public function store(Request $request)
    {
        \Log::info('Announcement store called', $request->all());

        try {
            // Check table exists
            if (!\Schema::hasTable('announcements')) {
                \Log::error('Table announcements does not exist');
                return response()->json(['error' => 'Table not found'], 500);
            }

            // AUTO-FIX DATABASE SCHEMAS
            $missingColumns = [];
            foreach (['company_name', 'category', 'title', 'description', 'contact_email', 'contact_phone', 'contact_address', 'website', 'city', 'expires_at'] as $col) {
                if (!\Schema::hasColumn('announcements', $col)) {
                    $missingColumns[] = $col;
                }
            }

            if (!empty($missingColumns)) {
                \Schema::table('announcements', function ($table) use ($missingColumns) {
                    foreach ($missingColumns as $col) {
                        if ($col === 'description') {
                            $table->text($col)->nullable();
                        } elseif ($col === 'expires_at') {
                            $table->date($col)->nullable();
                        } else {
                            $table->string($col)->nullable();
                        }
                    }
                });
            }

            // Log all columns
            $columns = \DB::select("DESCRIBE announcements");
            \Log::info('Announcements columns', (array)$columns);

            $data = $request->only([
                'company_name', 'category', 'title', 'description',
                'contact_email', 'contact_phone', 'contact_address',
                'website', 'city', 'expires_at'
            ]);

            // MAP COMPANY_NAME TO COMPANY to fix the 1364 Error
            if (isset($data['company_name'])) {
                $data['company'] = $data['company_name'];
            }

            // Clean nullable fields
            if (empty($data['expires_at'])) {
                $data['expires_at'] = null;
            }
            if (empty($data['website'])) {
                $data['website'] = null;
            }
            if (empty($data['contact_address'])) {
                $data['contact_address'] = null;
            }

            $announcement = Announcement::create($data);

            \Log::info('Announcement created', ['id' => $announcement->id]);

            return response()->json($announcement, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error', $e->errors());
            return response()->json([
                'error'   => 'Validation failed',
                'details' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Store error: ' . $e->getMessage(), [
                'line'  => $e->getLine(),
                'file'  => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
                'file'  => $e->getFile(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $announcement = Announcement::findOrFail($id);

            // AUTO-FIX DATABASE SCHEMAS
            $missingColumns = [];
            foreach (['company_name', 'category', 'title', 'description', 'contact_email', 'contact_phone', 'contact_address', 'website', 'city', 'expires_at'] as $col) {
                if (!\Schema::hasColumn('announcements', $col)) {
                    $missingColumns[] = $col;
                }
            }

            if (!empty($missingColumns)) {
                \Schema::table('announcements', function ($table) use ($missingColumns) {
                    foreach ($missingColumns as $col) {
                        if ($col === 'description') {
                            $table->text($col)->nullable();
                        } elseif ($col === 'expires_at') {
                            $table->date($col)->nullable();
                        } else {
                            $table->string($col)->nullable();
                        }
                    }
                });
            }

            $data = $request->only([
                'company_name', 'category', 'title', 'description',
                'contact_email', 'contact_phone', 'contact_address',
                'website', 'city', 'expires_at'
            ]);

            // MAP COMPANY_NAME TO COMPANY to fix the 1364 Error
            if (isset($data['company_name'])) {
                $data['company'] = $data['company_name'];
            }

            if (empty($data['expires_at']))      $data['expires_at']      = null;
            if (empty($data['website']))          $data['website']          = null;
            if (empty($data['contact_address']))  $data['contact_address']  = null;

            $announcement->update($data);
            $announcement->save(); // Force save to be absolutely sure

            \Log::info('Announcement updated in DB: ', $announcement->toArray());

            return response()->json($announcement);

        } catch (\Exception $e) {
            \Log::error('Update error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
