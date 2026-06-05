<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class DiplomaController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'diploma' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'diploma_type' => 'required|string',
        ]);

        $path = $request->file('diploma')->store('temp_diplomas');
        $fullPath = storage_path('app/' . $path);
        $scriptPath = storage_path('app/scripts/verify_diploma.py');

        $result = Process::run("python \"{$scriptPath}\" \"{$fullPath}\"");

        @unlink($fullPath);

        // Clean outputs to prevent UTF-8 json_encode errors on Windows
        $rawOutput = mb_convert_encoding($result->output(), 'UTF-8', 'UTF-8');
        $errorOutput = mb_convert_encoding($result->errorOutput(), 'UTF-8', 'UTF-8');

        // Check for Python execution error
        if ($result->failed() || empty(trim($rawOutput))) {
            return response()->json([
                'valid' => false,
                'message' => 'Erreur lors de l\'exécution de la vérification. Python ou Tesseract non installé.',
                'debug' => $errorOutput // remove this line in production
            ]);
        }

        $output = json_decode(trim($rawOutput), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'valid' => false,
                'message' => 'Erreur de parsing du résultat',
                'raw' => $rawOutput
            ]);
        }

        return response()->json($output);
    }
}
