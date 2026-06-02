import React from 'react';
import { X } from 'lucide-react';

interface ConditionsGeneralesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConditionsGeneralesModal({ isOpen, onClose }: ConditionsGeneralesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-[#ffffff] text-[#603A2A] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-[#603A2A]">Conditions Générales d'Utilisation</h2>
          <button 
            onClick={onClose}
            className="text-[#603A2A]/60 hover:text-[#603A2A] transition p-1"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-[#603A2A]/30 scrollbar-track-transparent">
          
          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">1. Objet du Service</h3>
            <p className="text-[#603A2A]/90">
              HandPro est une plateforme de mise en relation entre des clients cherchant des services artisanaux et des professionnels qualifiés (artisans). HandPro agit uniquement en tant qu'intermédiaire numérique et ne fournit aucun service d'artisanat directement.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">2. Inscription et Compte Utilisateur</h3>
            <p className="text-[#603A2A]/90">
              Pour utiliser HandPro, vous devez créer un compte. Vous vous engagez à fournir des informations exactes, à jour et complètes lors de votre inscription (qu'il s'agisse de votre identité, diplômes ou contacts). Vous êtes seul responsable de la sécurité de votre mot de passe et de l'utilisation de votre compte.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">3. Engagements de l'Artisan</h3>
            <p className="text-[#603A2A]/90">
              Les artisans inscrits sur la plateforme s'engagent à :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#603A2A]/90">
              <li>Posséder les qualifications, certifications et assurances requises pour exercer leur métier.</li>
              <li>Fournir des devis honnêtes et respecter les délais convenus.</li>
              <li>Garantir la qualité des prestations fournies au client.</li>
              <li>Mettre à jour leur disponibilité et leurs informations professionnelles.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">4. Engagements du Client</h3>
            <p className="text-[#603A2A]/90">
              Les clients utilisant HandPro s'engagent à :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#603A2A]/90">
              <li>Fournir des descriptions précises de leurs besoins pour obtenir des devis réalistes.</li>
              <li>Payer l'artisan selon les modalités convenues entre les deux parties.</li>
              <li>Adopter un comportement respectueux et courtois envers les artisans.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">5. Responsabilité et Litiges</h3>
            <p className="text-[#603A2A]/90">
              HandPro n'intervient pas dans la relation contractuelle entre le client et l'artisan. Par conséquent, HandPro décline toute responsabilité concernant la qualité du travail, les retards, les annulations ou tout litige financier. En cas de différend, les utilisateurs sont invités à trouver une solution à l'amiable.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">6. Protection des Données (RGPD)</h3>
            <p className="text-[#603A2A]/90">
              Les données personnelles collectées lors de l'inscription sont utilisées uniquement dans le cadre du fonctionnement de la plateforme (mise en relation, notifications). HandPro s'engage à ne pas revendre vos données à des tiers sans votre consentement explicite. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles à tout moment.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#603A2A] mb-2">7. Modification des Conditions</h3>
            <p className="text-[#603A2A]/90">
              HandPro se réserve le droit de modifier les présentes Conditions Générales à tout moment. Les utilisateurs seront informés de toute mise à jour significative par e-mail ou via une notification sur la plateforme.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#603A2A] hover:bg-[#4B2E2A] text-white font-bold rounded-full transition-colors shadow-lg"
          >
            J'ai compris
          </button>
        </div>

      </div>
    </div>
  );
}
