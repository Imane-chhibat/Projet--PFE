import { MapPin, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface FooterProps {
  setActivePage: (page: 'home' | 'search' | 'gps' | 'profile') => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer = ({ setActivePage, onSelectCategory }: FooterProps) => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <footer className="bg-[#111B2F] text-white pt-16 pb-8 border-t-2 border-[#CDB58E]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#603A2A] border border-[#CDB58E] flex items-center justify-center">
                <span className="text-[#CDB58E] font-display font-bold text-lg">H</span>
              </div>
              <span className="font-display text-2xl font-bold text-[#CDB58E] tracking-wide">
                HandPro
              </span>
            </div>
            <p className="text-sm text-[#8E887F] font-subtitle text-base leading-relaxed">
              La plateforme premium de l'artisanat d'excellence au Maroc. Connectant le savoir-faire authentique des Maâlems certifiés avec les exigences modernes.
            </p>
            <div className="flex space-x-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-[#2A1B15] flex items-center justify-center text-[#8E887F] hover:text-[#CDB58E] hover:bg-[#603A2A] transition-all cursor-pointer font-bold text-xs">
                FB
              </span>
              <span className="w-8 h-8 rounded-full bg-[#2A1B15] flex items-center justify-center text-[#8E887F] hover:text-[#CDB58E] hover:bg-[#603A2A] transition-all cursor-pointer font-bold text-xs">
                IG
              </span>
              <span className="w-8 h-8 rounded-full bg-[#2A1B15] flex items-center justify-center text-[#8E887F] hover:text-[#CDB58E] hover:bg-[#603A2A] transition-all cursor-pointer font-bold text-xs">
                IN
              </span>
              <span className="w-8 h-8 rounded-full bg-[#2A1B15] flex items-center justify-center text-[#8E887F] hover:text-[#CDB58E] hover:bg-[#603A2A] transition-all cursor-pointer font-bold text-xs">
                X
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-display text-lg text-[#CDB58E] mb-4 border-b border-[#2A1B15] pb-2 inline-block">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-[#8E887F]">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">
                  Accueil de la plateforme
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('search')} className="hover:text-white transition-colors">
                  Annuaire des Artisans
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('gps')} className="hover:text-white transition-colors">
                  Recherche à proximité (GPS)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActivePage('home');
                    setTimeout(() => {
                      document.getElementById('annonces-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-white transition-colors"
                >
                  Offres d'emploi & Recrutement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActivePage('home');
                    setTimeout(() => {
                      document.getElementById('ofppt-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-white transition-colors text-[#CDB58E]"
                >
                  Diplômés التكوين المهني
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Catégories */}
          <div>
            <h3 className="font-display text-lg text-[#CDB58E] mb-4 border-b border-[#2A1B15] pb-2 inline-block">
              Spécialités Majeures
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#8E887F]">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setActivePage('search');
                    }}
                    className="hover:text-white transition-colors text-left truncate block w-full"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-display text-lg text-[#CDB58E] mb-4 border-b border-[#2A1B15] pb-2 inline-block">
              Contact & Siège
            </h3>
            <ul className="space-y-3 text-sm text-[#8E887F]">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#CDB58E] shrink-0 mt-0.5" />
                <span>Espace Premium Riad Al-Omrane, Angle Bd Anfa, Casablanca, Maroc</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#CDB58E] shrink-0" />
                <span className="text-white">+212 5 22 00 11 22</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#CDB58E] shrink-0" />
                <a href="mailto:contact@handpro.ma" className="hover:text-white transition-colors">
                  contact@handpro.ma
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Ligne de séparation */}
        <div className="h-px bg-[#2A1B15] my-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E887F]">
          <p>© 2026 HandPro Maroc. Tous droits réservés. Inspiré du patrimoine marocain.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#terms" className="hover:underline">Mentions Légales</a>
            <span>•</span>
            <a href="#privacy" className="hover:underline">Confidentialité</a>
            <span>•</span>
            <a href="#charter" className="hover:underline">Charte des Artisans</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
