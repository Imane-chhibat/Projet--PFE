import { ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  userType: 'Visitor' | 'Registered User' | 'Artisan';
  setUserType: (type: 'Visitor' | 'Registered User' | 'Artisan') => void;
  onOpenLogin?: () => void;
}

export const Navbar = ({
  activePage,
  setActivePage,
  userType,
  setUserType,
  onOpenLogin
}: NavbarProps) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (userType === 'Artisan') {
      api.getMyProfile()
        .then(profile => setAvatar(profile.avatar || null))
        .catch(() => setAvatar(null));
    } else {
      setAvatar(null);
    }
  }, [userType, activePage]); // Re-fetch if activePage changes, to stay updated

  return (
    <header className="sticky top-0 z-50 bg-[#2A1B15]/95 backdrop-blur-md border-b border-[#CDB58E]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#603A2A] border-2 border-[#CDB58E] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span className="text-[#CDB58E] font-display font-bold text-xl">H</span>
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-wider text-[#CDB58E] block leading-none">
                HandPro
              </span>
              <span className="text-[10px] text-[#8E887F] uppercase tracking-widest font-sans block mt-1">
                Artisanat Premium
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <button
              onClick={() => setActivePage('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'home' 
                  ? 'text-[#CDB58E] bg-[#603A2A] font-semibold shadow-sm' 
                  : 'text-[#F5EDE0] hover:text-[#CDB58E]'
              }`}
            >
              Accueil
            </button>
            
            <button
              onClick={() => setActivePage('search')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'search' 
                  ? 'text-[#CDB58E] bg-[#603A2A] font-semibold shadow-sm' 
                  : 'text-[#F5EDE0] hover:text-[#CDB58E]'
              }`}
            >
              Trouver un Artisan
            </button>

            <button
              onClick={() => setActivePage('gps')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                activePage === 'gps' 
                  ? 'text-[#CDB58E] bg-[#603A2A] font-semibold shadow-sm' 
                  : 'text-[#F5EDE0] hover:text-[#CDB58E]'
              }`}
            >
              Carte GPS
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CDB58E] rounded-full animate-pulse" />
            </button>

            <button
              onClick={() => {
                setActivePage('home');
                setTimeout(() => {
                  const el = document.getElementById('annonces-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-md text-sm font-medium text-[#F5EDE0] hover:text-[#CDB58E] transition-colors"
            >
              Annonces Pro
            </button>

            <button
              onClick={() => {
                setActivePage('home');
                setTimeout(() => {
                  const el = document.getElementById('ofppt-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-md text-sm font-medium text-[#CDB58E] hover:underline flex items-center gap-1"
            >
              <ShieldCheck size={16} />
              <span>Artisans Certifiés</span>
            </button>
          </nav>

          {/* User Type selector simulation & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Simulation controls for premium interactivity */}
           
            {userType === 'Visitor' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLogin ? onOpenLogin() : setUserType('Registered User')}
                  className="px-4 py-1.5 text-xs sm:text-sm font-bold rounded-md bg-[#CDB58E] text-[#2A1B15] border border-[#CDB58E] hover:bg-transparent hover:text-[#CDB58E] transition-all duration-300 shadow-md"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setActivePage('choix')}
                  className="hidden sm:inline-flex px-4 py-1.5 text-xs sm:text-sm font-bold rounded-md border border-[#CDB58E] text-[#CDB58E] hover:bg-[#CDB58E] hover:text-[#2A1B15] transition-all duration-300 shadow-md"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#603A2A]/40 px-3 py-1.5 rounded-full border border-[#CDB58E]/30">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[#2A1B15] font-bold text-xs overflow-hidden ${userType === 'Artisan' ? 'cursor-pointer hover:ring-2 hover:ring-[#CDB58E] transition-all bg-[#2A1B15]' : 'bg-[#CDB58E]'}`}
                  onClick={() => userType === 'Artisan' && setActivePage('mon_profil')}
                  title={userType === 'Artisan' ? "Voir mon profil" : ""}
                >
                  {userType === 'Artisan' && avatar ? (
                    <img src={avatar} alt="Mon Profil" className="w-full h-full object-cover" />
                  ) : (
                    <span className={userType === 'Artisan' && !avatar ? 'text-[#CDB58E]' : ''}>{userType === 'Artisan' ? 'A' : 'U'}</span>
                  )}
                </div>
                <span 
                  className={`text-xs text-[#F5EDE0] hidden md:inline ${userType === 'Artisan' ? 'cursor-pointer hover:text-[#CDB58E] transition-colors' : ''}`}
                  onClick={() => userType === 'Artisan' && setActivePage('mon_profil')}
                >
                  {userType === 'Artisan' ? 'Espace Maâlem' : 'Mon Compte'}
                </span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    setUserType('Visitor');
                    setActivePage('home');
                  }}
                  className="text-[10px] text-[#8E887F] hover:text-[#CDB58E] ml-1 underline"
                  title="Se déconnecter"
                >
                  Quitter
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#8E887F]/20 text-xs">
          <button 
            onClick={() => setActivePage('home')}
            className={`py-1 px-2 rounded ${activePage === 'home' ? 'text-[#CDB58E] font-bold' : 'text-[#8E887F]'}`}
          >
            Accueil
          </button>
          <button 
            onClick={() => setActivePage('search')}
            className={`py-1 px-2 rounded ${activePage === 'search' ? 'text-[#CDB58E] font-bold' : 'text-[#8E887F]'}`}
          >
            Recherche
          </button>
          <button 
            onClick={() => setActivePage('gps')}
            className={`py-1 px-2 rounded ${activePage === 'gps' ? 'text-[#CDB58E] font-bold' : 'text-[#8E887F]'}`}
          >
            GPS
          </button>
          <button 
            onClick={() => {
              setActivePage('profile');
            }}
            className={`py-1 px-2 rounded ${activePage === 'profile' ? 'text-[#CDB58E] font-bold' : 'text-[#8E887F]'}`}
          >
            Ex. Profil
          </button>
        </div>

      </div>
    </header>
  );
};
