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
                      ->orWhere('expires_at', '>=', Carbon::today());
            })->orderBy('created_at', 'desc')->get();

            return response()->json($announcements);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
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

            // Log all columns
            $columns = \DB::select("DESCRIBE announcements");
            \Log::info('Announcements columns', (array)$columns);

            $data = $request->only([
                'company_name', 'category', 'title', 'description',
                'contact_email', 'contact_phone', 'contact_address',
                'website', 'city', 'expires_at'
            ]);

            \Log::info('Data to insert', $data);

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

            $data = $request->only([
                'company_name', 'category', 'title', 'description',
                'contact_email', 'contact_phone', 'contact_address',
                'website', 'city', 'expires_at'
            ]);

            if (empty($data['expires_at']))      $data['expires_at']      = null;
            if (empty($data['website']))          $data['website']          = null;
            if (empty($data['contact_address']))  $data['contact_address']  = null;

            $announcement->update($data);
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
