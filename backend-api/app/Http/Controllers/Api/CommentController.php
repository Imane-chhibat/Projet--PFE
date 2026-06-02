<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        // Get the latest 20 comments with user details
        $comments = Comment::with('user')->orderBy('created_at', 'desc')->take(20)->get();
        return response()->json($comments);
    }

    public function all()
    {
        // Get all comments with user details
        $comments = Comment::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        // Get the authenticated user's name as the author
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $comment = Comment::create([
            'author' => $user->name,
            'body' => $request->body,
            'user_id' => $user->id,
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }
}
