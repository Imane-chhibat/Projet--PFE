<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class MoreAnnouncementsSeeder extends Seeder
{
    public function run(): void
    {
        $announcements = [
            // ── Électricité ──
            [
                'company_name' => 'ElectroPro Maroc',
                'company' => 'ElectroPro Maroc',
                'category' => 'Électricité',
                'title' => 'Électricien Industriel pour Usine Textile',
                'description' => 'Nous recherchons un électricien industriel expérimenté pour la maintenance et l\'installation des systèmes électriques d\'une usine textile de 5000 m². Contrat CDI avec avantages sociaux.',
                'city' => 'Tanger',
                'contact_email' => 'rh@electropro.ma',
                'contact_phone' => '+212 5 39 12 34 56',
                'contact_address' => 'Zone Industrielle Tanger Free Zone, Lot 45',
            ],
            [
                'company_name' => 'Lumière & Habitat',
                'company' => 'Lumière & Habitat',
                'category' => 'Électricité',
                'title' => 'Technicien Domotique Smart Home',
                'description' => 'Spécialiste en domotique et maisons intelligentes recherché pour projets résidentiels haut de gamme. Maîtrise des systèmes KNX et Zigbee exigée. Salaire attractif.',
                'city' => 'Casablanca',
                'contact_email' => 'contact@lumierehabitat.ma',
                'contact_phone' => '+212 5 22 45 67 89',
                'contact_address' => 'Bd Anfa, Résidence Al Firdaws, Bureau 302',
            ],

            // ── Plomberie ──
            [
                'company_name' => 'AquaService Pro',
                'company' => 'AquaService Pro',
                'category' => 'Plomberie',
                'title' => 'Chef Plombier pour Projet Hôtelier 5 Étoiles',
                'description' => 'Grand projet hôtelier à Marrakech recrute un chef plombier avec minimum 10 ans d\'expérience. Supervision d\'une équipe de 8 plombiers. Hébergement fourni sur chantier.',
                'city' => 'Marrakech',
                'contact_email' => 'recrutement@aquaservice.ma',
                'contact_phone' => '+212 5 24 33 22 11',
                'contact_address' => 'Route de Fès, Km 12, Marrakech',
            ],
            [
                'company_name' => 'HydroClean SARL',
                'company' => 'HydroClean SARL',
                'category' => 'Plomberie',
                'title' => 'Plombier Chauffagiste Certifié',
                'description' => 'Recherche plombier chauffagiste pour installation de systèmes de chauffage central dans des villas à Ifrane et Azrou. Expérience en chaudières à gaz requise.',
                'city' => 'Ifrane',
                'contact_email' => 'emploi@hydroclean.ma',
                'contact_phone' => '+212 5 35 56 78 90',
                'contact_address' => 'Avenue Hassan II, Ifrane',
            ],

            // ── Menuiserie ──
            [
                'company_name' => 'Bois Noble Artisanat',
                'company' => 'Bois Noble Artisanat',
                'category' => 'Menuiserie',
                'title' => 'Maître Menuisier Ébéniste – Mobilier de Luxe',
                'description' => 'Atelier de menuiserie haut de gamme à Essaouira recrute un maître ébéniste spécialisé en thuya et cèdre. Fabrication de meubles sur mesure pour clientèle internationale.',
                'city' => 'Essaouira',
                'contact_email' => 'atelier@boisnoble.ma',
                'contact_phone' => '+212 5 24 78 45 12',
                'contact_address' => 'Quartier Industriel, Lot 18, Essaouira',
            ],
            [
                'company_name' => 'ModernWood Design',
                'company' => 'ModernWood Design',
                'category' => 'Menuiserie',
                'title' => 'Menuisier Poseur de Cuisines Équipées',
                'description' => 'Entreprise spécialisée en agencement de cuisines modernes recrute un menuisier poseur. Lecture de plans 3D et maîtrise des machines CNC appréciées.',
                'city' => 'Kénitra',
                'contact_email' => 'rh@modernwood.ma',
                'contact_phone' => '+212 5 37 31 22 44',
                'contact_address' => 'Zone Industrielle Bir Rami, Kénitra',
            ],

            // ── Peinture & Déco ──
            [
                'company_name' => 'Couleurs du Riad',
                'company' => 'Couleurs du Riad',
                'category' => 'Peinture',
                'title' => 'Artisan Tadelakt & Stucco pour Restauration de Riad',
                'description' => 'Projet de restauration d\'un riad historique dans la médina de Fès. Recherche artisan maîtrisant les techniques traditionnelles du tadelakt et du stucco sculpté.',
                'city' => 'Fès',
                'contact_email' => 'restauration@couleursriad.ma',
                'contact_phone' => '+212 5 35 63 78 90',
                'contact_address' => 'Derb Sidi Ahmed, Médina de Fès',
            ],
            [
                'company_name' => 'Déco Premium',
                'company' => 'Déco Premium',
                'category' => 'Peinture',
                'title' => 'Peintre en Bâtiment – Chantier Résidentiel',
                'description' => 'Recrutement de 5 peintres qualifiés pour un grand projet résidentiel de 120 appartements. Expérience en finitions haut de gamme et travail en hauteur.',
                'city' => 'Rabat',
                'contact_email' => 'chantier@decopremium.ma',
                'contact_phone' => '+212 5 37 72 11 33',
                'contact_address' => 'Hay Riad, Secteur 21, Rabat',
            ],

            // ── Climatisation ──
            [
                'company_name' => 'FroidTech Solutions',
                'company' => 'FroidTech Solutions',
                'category' => 'Climatisation',
                'title' => 'Technicien CVC pour Centre Commercial',
                'description' => 'Maintenance préventive et curative des systèmes CVC d\'un centre commercial. Habilitation fluides frigorigènes obligatoire. Travail en équipe 3x8.',
                'city' => 'Casablanca',
                'contact_email' => 'technique@froidtech.ma',
                'contact_phone' => '+212 5 22 98 76 54',
                'contact_address' => 'Morocco Mall, Ain Diab, Casablanca',
            ],

            // ── Maçonnerie & Zellige ──
            [
                'company_name' => 'Heritage Bâtisseurs',
                'company' => 'Heritage Bâtisseurs',
                'category' => 'Maçonnerie',
                'title' => 'Maçon Spécialisé en Pierre Taillée',
                'description' => 'Entreprise de restauration du patrimoine recrute des maçons spécialisés en pierre taillée pour la réhabilitation d\'un palais historique à Meknès.',
                'city' => 'Meknès',
                'contact_email' => 'patrimoine@heritagebat.ma',
                'contact_phone' => '+212 5 35 51 23 45',
                'contact_address' => 'Place El Hedim, Meknès',
            ],
            [
                'company_name' => 'Zellige Art Tradition',
                'company' => 'Zellige Art Tradition',
                'category' => 'Maçonnerie',
                'title' => 'Apprenti Zelligeur – Formation Incluse',
                'description' => 'Opportunité unique pour jeunes artisans : formation complète en art du zellige traditionnel avec un maître artisan. Durée : 6 mois avec rémunération.',
                'city' => 'Fès',
                'contact_email' => 'formation@zelligeart.ma',
                'contact_phone' => '+212 5 35 74 56 78',
                'contact_address' => 'Ain Nokbi, Route de Sefrou, Fès',
            ],

            // ── Aluminium & Verre ──
            [
                'company_name' => 'VitroAlu Prestige',
                'company' => 'VitroAlu Prestige',
                'category' => 'Aluminium',
                'title' => 'Poseur de Murs Rideaux en Aluminium',
                'description' => 'Projet de tour de bureaux de 15 étages. Recherche poseurs de murs rideaux expérimentés. Travail en hauteur avec nacelle. Prime de risque incluse.',
                'city' => 'Casablanca',
                'contact_email' => 'projets@vitroalu.ma',
                'contact_phone' => '+212 5 22 30 40 50',
                'contact_address' => 'Sidi Maarouf, Casablanca Finance City',
            ],

            // ── Mécanique ──
            [
                'company_name' => 'AutoExpert Garage',
                'company' => 'AutoExpert Garage',
                'category' => 'Mécanique',
                'title' => 'Mécanicien Diesel Poids Lourds',
                'description' => 'Garage spécialisé poids lourds recrute mécanicien diesel expérimenté. Diagnostic électronique Bosch et Delphi. Poste stable avec mutuelle.',
                'city' => 'Berrechid',
                'contact_email' => 'garage@autoexpert.ma',
                'contact_phone' => '+212 5 22 33 44 55',
                'contact_address' => 'Route Nationale 9, Km 3, Berrechid',
            ],
            [
                'company_name' => 'FleetCare Maroc',
                'company' => 'FleetCare Maroc',
                'category' => 'Mécanique',
                'title' => 'Responsable Atelier Mécanique Automobile',
                'description' => 'Gestion d\'un atelier de 6 postes de travail. Planification des interventions, contrôle qualité et gestion des stocks pièces. Management d\'une équipe de 8 techniciens.',
                'city' => 'Agadir',
                'contact_email' => 'carriere@fleetcare.ma',
                'contact_phone' => '+212 5 28 23 45 67',
                'contact_address' => 'Zone Industrielle Ait Melloul, Agadir',
            ],

            // ── Carrelage ──
            [
                'company_name' => 'Mosaïque Royale',
                'company' => 'Mosaïque Royale',
                'category' => 'Carrelage',
                'title' => 'Carreleur Mosaïste pour Hammam Traditionnel',
                'description' => 'Construction d\'un hammam traditionnel de luxe. Recherche carreleur mosaïste maîtrisant la pose de zellige et marbre sur surfaces courbes. Projet de 3 mois.',
                'city' => 'Marrakech',
                'contact_email' => 'direction@mosaiqueroyal.ma',
                'contact_phone' => '+212 5 24 44 55 66',
                'contact_address' => 'Palmeraie, Route de Fès, Marrakech',
            ],

            // ── Ferronnerie ──
            [
                'company_name' => 'Forge & Design',
                'company' => 'Forge & Design',
                'category' => 'Ferronnerie',
                'title' => 'Ferronnier d\'Art – Mobilier Contemporain',
                'description' => 'Atelier de ferronnerie d\'art recherche un artisan créatif pour la conception de mobilier contemporain en acier et laiton. Portfolio requis.',
                'city' => 'Safi',
                'contact_email' => 'atelier@forgedesign.ma',
                'contact_phone' => '+212 5 24 62 33 44',
                'contact_address' => 'Zone Artisanale, Route de Marrakech, Safi',
            ],

            // ── Jardinage ──
            [
                'company_name' => 'Oasis Paysages',
                'company' => 'Oasis Paysages',
                'category' => 'Jardinage',
                'title' => 'Paysagiste pour Aménagement de Golf',
                'description' => 'Aménagement paysager d\'un parcours de golf 18 trous. Recherche paysagiste expérimenté en gazon sportif et systèmes d\'irrigation automatique.',
                'city' => 'El Jadida',
                'contact_email' => 'green@oasispaysages.ma',
                'contact_phone' => '+212 5 23 34 56 78',
                'contact_address' => 'Mazagan Beach Resort, El Jadida',
            ],
        ];

        foreach ($announcements as $ann) {
            Announcement::create($ann);
        }
    }
}
