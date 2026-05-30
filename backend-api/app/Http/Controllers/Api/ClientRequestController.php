<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientRequest;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientRequestController extends Controller
{
    /**
     * POST /api/requests
     * Create a new client request
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'artisan_id' => 'required|exists:artisan_profiles,id',
            'requested_date' => 'required|date',
        ]);

        // Get the artisan profile to get the user_id
        $artisanProfile = \App\Models\ArtisanProfile::findOrFail($validated['artisan_id']);
        $artisanUserId = $artisanProfile->user_id;

        // Check if the date is already booked (accepted) for this artisan
        $alreadyBooked = ClientRequest::where('artisan_id', $artisanUserId)
            ->where('requested_date', $validated['requested_date'])
            ->where('status', 'accepted')
            ->exists();

        if ($alreadyBooked) {
            return response()->json([
                'message' => 'Ce jour est déjà réservé. Veuillez choisir une autre date.',
            ], 422);
        }

        $clientRequest = ClientRequest::create([
            'client_id' => $request->user()->id,
            'artisan_id' => $artisanUserId,
            'requested_date' => $validated['requested_date'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Demande envoyée avec succès',
            'request' => $clientRequest,
        ], 201);
    }

    /**
     * GET /api/artisan/requests
     * Get all requests for the logged-in artisan
     */
    public function indexArtisan(Request $request): JsonResponse
    {
        $requests = ClientRequest::with('client')
            ->where('artisan_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'requests' => $requests,
        ]);
    }

    /**
     * PUT /api/requests/{id}/accept
     * Accept a client request
     */
    public function accept(Request $request, $id): JsonResponse
    {
        $clientRequest = ClientRequest::with('client')->findOrFail($id);

        if ($clientRequest->artisan_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clientRequest->update([
            'status' => 'accepted',
        ]);

        // Send WhatsApp message to client
        try {
            $whatsappService = new WhatsAppService();
            $artisanName = $request->user()->name;
            $requestedDate = date('d/m/Y', strtotime($clientRequest->requested_date));
            $clientPhone = $clientRequest->client->phone;

            if ($clientPhone) {
                $whatsappService->sendAcceptanceMessage($clientPhone, $artisanName, $requestedDate);
            }
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('WhatsApp message failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Demande acceptée avec succès',
            'request' => $clientRequest,
        ]);
    }

    /**
     * PUT /api/artisan/requests/mark-read
     * Mark all requests as read for the logged-in artisan
     */
    public function markAsRead(Request $request): JsonResponse
    {
        ClientRequest::where('artisan_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Notifications marquées comme lues',
        ]);
    }

    /**
     * GET /api/client/requests
     * Get all requests for the logged-in client
     */
    public function indexClient(Request $request): JsonResponse
    {
        $requests = ClientRequest::with('artisan.artisanProfile')
            ->where('client_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform requests to include artisan profile info
        $transformed = $requests->map(function ($request) {
            $artisanProfile = $request->artisan->artisanProfile;
            $artisanUser = $request->artisan;
            return [
                'id' => $request->id,
                'artisan' => [
                    'id' => $artisanProfile->id,
                    'name' => $artisanUser->name,
                    'specialty' => $artisanProfile->specialty,
                    'city' => $artisanProfile->city,
                    'avatar' => $artisanProfile->avatar ? $artisanProfile->avatar : null,
                ],
                'requested_date' => $request->requested_date,
                'status' => $request->status,
                'created_at' => $request->created_at,
            ];
        });

        return response()->json([
            'requests' => $transformed,
        ]);
    }

    /**
     * PUT /api/requests/{id}/reject
     * Reject a client request
     */
    public function reject(Request $request, $id): JsonResponse
    {
        $clientRequest = ClientRequest::with('client')->findOrFail($id);

        if ($clientRequest->artisan_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clientRequest->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Demande refusée',
            'request' => $clientRequest,
        ]);
    }
}
