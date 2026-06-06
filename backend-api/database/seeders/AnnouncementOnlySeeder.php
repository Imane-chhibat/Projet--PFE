<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementOnlySeeder extends Seeder
{
    public function run(): void
    {
        // 7 Nouvelles annonces ajoutées
        Announcement::create(['title'=>'Plombier pour installation sanitaire','company'=>'Sanitaire Plus','category'=>'Plomberie','city'=>'Tanger','date'=>"Aujourd'hui",'description'=>'Besoin urgent d\'un plombier pour un chantier résidentiel de 5 étages.']);
        Announcement::create(['title'=>'Peintre Décorateur Intérieur','company'=>'Déco Maison','category'=>'Peinture','city'=>'Casablanca','date'=>'Hier','description'=>'Recherche peintre qualifié pour décoration de salles de réception.']);
        Announcement::create(['title'=>'Ferronnier d\'art pour balcons','company'=>'Acier & Fer','category'=>'Ferronnerie','city'=>'Agadir','date'=>'Il y a 2 jours','description'=>'Conception et installation de garde-corps et portes en fer forgé.']);
        Announcement::create(['title'=>'Jardinier Paysagiste','company'=>'Espaces Verts Maroc','category'=>'Jardinage','city'=>'Rabat','date'=>'Il y a 4 jours','description'=>'Entretien et création de jardins pour résidences de luxe.']);
        Announcement::create(['title'=>'Spécialiste en Aluminium','company'=>'AluPro','category'=>'Aluminium','city'=>'Marrakech','date'=>'Il y a 6 jours','description'=>'Montage de baies vitrées et fenêtres coulissantes.']);
        Announcement::create(['title'=>'Carreleur Expérimenté','company'=>'Céramique Design','category'=>'Carrelage','city'=>'Oujda','date'=>'Il y a 1 semaine','description'=>'Pose de carrelage grand format et marbre.']);
        Announcement::create(['title'=>'Mécanicien Auto Qualifié','company'=>'Auto Garage Centre','category'=>'Mécanique','city'=>'Meknès','date'=>'Il y a 1 semaine','description'=>'Recherche mécanicien pour diagnostic et réparations générales.']);
    }
}
