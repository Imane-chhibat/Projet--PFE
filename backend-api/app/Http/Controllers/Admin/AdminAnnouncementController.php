<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AdminAnnouncementController extends Controller
{
    /**
     * Liste les annonces de l'utilisateur connecté
     */
    public function index()
    {
        $announcements = Announcement::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('admin.announcements.index', compact('announcements'));
    }

    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        return view('admin.announcements.create', [
            'announcement' => null,
            'categories'   => $this->categories(),
        ]);
    }

    /**
     * Sauvegarde la nouvelle annonce
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'company_name'    => 'required|string|max:255',
            'category'        => 'required|string|max:100',
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'contact_email'   => 'required|email|max:255',
            'contact_phone'   => 'required|string|max:30',
            'contact_address' => 'required|string|max:255',
            'city'            => 'required|string|max:100',
            'expires_at'      => 'required|date|after:today',
            'website'         => 'nullable|url|max:255',
            'company'         => 'nullable|string|max:255',
        ]);

        $data['user_id'] = auth()->id();

        // Par sécurité, on peut mapper company sur company_name
        if (empty($data['company'])) {
            $data['company'] = $data['company_name'];
        }

        Announcement::create($data);

        return redirect()->route('admin.announcements.index')
                         ->with('success', 'Annonce publiée avec succès !');
    }

    /**
     * Affiche le formulaire de modification
     */
    public function edit($id)
    {
        $announcement = Announcement::findOrFail($id);

        if ($announcement->user_id !== auth()->id()) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier cette annonce.');
        }

        return view('admin.announcements.edit', [
            'announcement' => $announcement,
            'categories'   => $this->categories(),
        ]);
    }

    /**
     * Met à jour l'annonce
     */
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        if ($announcement->user_id !== auth()->id()) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier cette annonce.');
        }

        $data = $request->validate([
            'company_name'    => 'required|string|max:255',
            'category'        => 'required|string|max:100',
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'contact_email'   => 'required|email|max:255',
            'contact_phone'   => 'required|string|max:30',
            'contact_address' => 'required|string|max:255',
            'city'            => 'required|string|max:100',
            'expires_at'      => 'required|date|after:today',
            'website'         => 'nullable|url|max:255',
            'company'         => 'nullable|string|max:255',
        ]);

        if (empty($data['company'])) {
            $data['company'] = $data['company_name'];
        }

        $announcement->update($data);

        return redirect()->route('admin.announcements.index')
                         ->with('success', 'Annonce modifiée avec succès !');
    }

    /**
     * Supprime l'annonce
     */
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        if ($announcement->user_id !== auth()->id()) {
            abort(403, 'Vous n\'êtes pas autorisé à supprimer cette annonce.');
        }

        $announcement->delete();

        return redirect()->route('admin.announcements.index')
                         ->with('success', 'Annonce supprimée avec succès !');
    }

    /**
     * Fournit les catégories pour les formulaires
     */
    private function categories(): array
    {
        return [
            'Électricité', 'Menuiserie', 'Plomberie', 'Climatisation',
            'Maçonnerie', 'Peinture', 'Carrelage', 'Ferronnerie',
            'Jardinage', 'Autre'
        ];
    }
}
