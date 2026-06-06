<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

try {
    $now = Carbon::now();
    
    $announcements = [
        [
            'company_name' => 'BricoMaroc SA',
            'category'     => 'Électricité',
            'title'        => 'Recherche Électricien Qualifié',
            'description'  => "Nous recherchons un électricien expérimenté pour des chantiers résidentiels sur Casablanca. CDI à la clé après période d'essai. Minimum 3 ans d'expérience.",
            'contact_email'   => 'rh@bricomaroc.ma',
            'contact_phone'   => '+212 6 11 22 33 44',
            'contact_address' => 'Z.I. Sidi Maarouf, Casablanca',
            'city'            => 'Casablanca',
            'expires_at'      => $now->copy()->addDays(30)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(2)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(2)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'Artisans du Nord',
            'category'     => 'Menuiserie',
            'title'        => 'Menuisier Bois Polyvalent – CDI',
            'description'  => "Atelier de menuiserie à Tanger recrute un menuisier spécialisé dans le bois massif et sur mesure. Minimum 3 ans d'expérience. Bonne rémunération.",
            'contact_email'   => 'contact@artisansnord.ma',
            'contact_phone'   => '+212 6 99 88 77 66',
            'contact_address' => 'Quartier Industriel, Tanger',
            'city'            => 'Tanger',
            'expires_at'      => $now->copy()->addDays(15)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(3)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(3)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'PlombExpress',
            'category'     => 'Plomberie',
            'title'        => 'Plombiers Auto-entrepreneurs Recherchés',
            'description'  => "PlombExpress cherche des plombiers auto-entrepreneurs pour des interventions d'urgence sur Rabat et Salé. Partenariat à long terme.",
            'contact_email'   => 'partenaires@plombexpress.ma',
            'contact_phone'   => '+212 5 37 12 34 56',
            'contact_address' => 'Agdal, Rabat',
            'city'            => 'Rabat',
            'expires_at'      => $now->copy()->addDays(45)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(5)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(5)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'DécoMarrakech',
            'category'     => 'Peinture',
            'title'        => 'Peintre Décorateur / Maître Tadelakt',
            'description'  => "Projet de rénovation de 3 Riad à Marrakech. Nous cherchons un maître peintre maîtrisant le Tadelakt et la peinture décorative traditionnelle.",
            'contact_email'   => 'jobs@decomarrakech.com',
            'contact_phone'   => '+212 6 55 44 33 22',
            'contact_address' => 'Gueliz, Marrakech',
            'city'            => 'Marrakech',
            'expires_at'      => $now->copy()->addDays(20)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(1)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(1)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'TechBat Agadir',
            'category'     => 'Maçonnerie',
            'title'        => 'Maçon Qualifié BTP – Projet Hôtelier',
            'description'  => "Entreprise de BTP cherche des maçons qualifiés pour un nouveau complexe hôtelier à Taghazout. Mission longue durée. Rémunération motivante.",
            'contact_email'   => 'recrutement@techbat.ma',
            'contact_phone'   => '+212 5 28 88 99 00',
            'contact_address' => 'Centre Ville, Agadir',
            'city'            => 'Agadir',
            'expires_at'      => $now->copy()->addDays(60)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(10)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(10)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'ClimaTech Maroc',
            'category'     => 'Climatisation',
            'title'        => 'Technicien Climatisation / Froid',
            'description'  => "Société spécialisée en HVAC cherche un technicien pour installation et maintenance de climatiseurs à Fès. Diplôme technique requis.",
            'contact_email'   => 'emploi@climatechma.com',
            'contact_phone'   => '+212 6 70 60 50 40',
            'contact_address' => 'Route Imouzzer, Fès',
            'city'            => 'Fès',
            'expires_at'      => $now->copy()->addDays(25)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(4)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(4)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'SolCarrelage',
            'category'     => 'Carrelage',
            'title'        => 'Carreleur Expérimenté – Villa Privée',
            'description'  => "Particulier cherche un maître carreleur pour revêtement sol et mur d'une villa neuve à Kénitra. 300 m² à faire en zellige et carrelage moderne.",
            'contact_email'   => 'villa.kenitra@gmail.com',
            'contact_phone'   => '+212 6 64 73 82 91',
            'contact_address' => 'Lotissement Al Wifaq, Kénitra',
            'city'            => 'Kénitra',
            'expires_at'      => $now->copy()->addDays(12)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(6)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(6)->format('Y-m-d H:i:s'),
        ],
        [
            'company_name' => 'FerroArt Fer',
            'category'     => 'Ferronnerie',
            'title'        => 'Ferronnier Artisan – Portails & Garde-Corps',
            'description'  => "Atelier artisanal de ferronnerie à Meknès recherche un ferronnier talentueux pour réaliser des portails, grilles et garde-corps sur mesure.",
            'contact_email'   => 'atelier@ferroartfer.ma',
            'contact_phone'   => '+212 5 35 46 57 68',
            'contact_address' => 'Zone Artisanale, Meknès',
            'city'            => 'Meknès',
            'expires_at'      => $now->copy()->addDays(35)->format('Y-m-d H:i:s'),
            'created_at'      => $now->copy()->subDays(7)->format('Y-m-d H:i:s'),
            'updated_at'      => $now->copy()->subDays(7)->format('Y-m-d H:i:s'),
        ],
    ];

    // Direct DB insert to bypass any model issues
    $count = DB::table('announcements')->insert($announcements);

    echo "✅ " . count($announcements) . " annonces insérées avec succès dans la base de données!";
} catch (\Exception $e) {
    echo "ERREUR: " . $e->getMessage();
}
