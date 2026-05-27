<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientRequest;
use App\Models\User;
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
            'artisan_id' => 'required|exists:users,id',
            'requested_date' => 'required|date',
        ]);

        // Check if the date is already booked (accepted) for this artisan
        $alreadyBooked = ClientRequest::where('artisan_id', $validated['artisan_id'])
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
            'artisan_id' => $validated['artisan_id'],
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
}
