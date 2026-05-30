// src/App.tsx  — version avec Login intégré
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { GpsPage } from './components/GpsPage';
import { ProfilePage } from './components/ProfilePage';
import Login from './components/Login';
import Choix from './components/Choix';
import InscriptionArtisan from './components/InscriptionArtisan';
import InscriptionClient from './components/InscriptionClient';
import { NotificationsPage } from './components/NotificationsPage';
import { ProfilClient } from './components/ProfilClient';
import ForgotPassword from './components/ForgotPassword';
import { ProfilAdmin } from './components/ProfilAdmin';
import MonProfilArtisan from './components/MonProfilArtisan';
import { ChangePassword } from './components/ChangePassword';
import { api } from './utils/api';
export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'search' | 'gps' | 'profile' | 'login' | 'forgot_password' | 'choix' | 'inscription_artisan' | 'inscription_client' | 'mon_profil' | 'change_password' | 'notifications' | 'client_profile' | 'admin_profile'>('home');
  const [userType, setUserType] = useState<'Visitor' | 'Registered User' | 'Artisan' | 'Admin'>('Visitor');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Auto-login au démarrage si token existe
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      if (user.role === 'artisan' || user.role === 'Artisan') {
        setUserType('Artisan');
        setActivePage('mon_profil');
      } else if (user.role === 'admin' || user.role === 'Admin') {
        setUserType('Admin');
        setActivePage('home');
      } else {
        setUserType('Registered User');
        setActivePage('home');
      }
    }
  }, []);

  // Data routing state
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>('artisan-1');
  const [searchParams, setSearchParams] = useState<{ city: string; specialty: string }>({
    city: '',
    specialty: '',
  });

  // Handlers de navigation existants
  const handleHomeSearch = (city: string, specialty: string) => {
    setSearchParams({ city, specialty });
    setActivePage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArtisan = (id: string) => {
    setSelectedArtisanId(id);
    setActivePage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setSearchParams({ city: '', specialty: cat });
    setActivePage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setActivePage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Appelé par Login après succès ───────────────
  const handleLoginSuccess = () => {
    const stored = localStorage.getItem('auth_user');
    const user = stored ? JSON.parse(stored) : null;
    if (user?.role === 'Artisan' || user?.role === 'artisan') {
      setUserType('Artisan');
      setActivePage('mon_profil');
    } else if (user?.role === 'Admin' || user?.role === 'admin') {
      setUserType('Admin');
      setActivePage('admin_profile');
    } else {
      setUserType('Registered User');
      setActivePage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Appelé après inscription artisan réussie ───────────────
  const handleArtisanRegistered = () => {
    setUserType('Artisan');
    setActivePage('mon_profil');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Appelé après inscription client réussie ───────────────
  const handleClientRegistered = () => {
    setUserType('Registered User');
    setActivePage('client_profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#2A1B15] text-[#F5EDE0] font-sans selection:bg-[#CDB58E] selection:text-[#2A1B15]">

      {/* NAVBAR — reçoit onOpenLogin pour que "Se connecter" ouvre la modale */}
      {activePage !== 'change_password' && (
        <Navbar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          userType={userType}
          setUserType={setUserType}
          onOpenLogin={() => setActivePage('login')} // ← Ouvre la page de connexion
        />
      )}

      {/* PAGES */}
      <div className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <HomePage
            onSearch={handleHomeSearch}
            onSelectArtisan={handleSelectArtisan}
            onSelectCategory={handleSelectCategory}
          />
        )}
        {activePage === 'search' && (
          <SearchPage
            initialCity={searchParams.city}
            initialSpecialty={searchParams.specialty}
            onSelectArtisan={handleSelectArtisan}
            onRequireRegistration={() => {
              setActivePage('choix');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {activePage === 'gps' && (
          <GpsPage onSelectArtisan={handleSelectArtisan} />
        )}
        {activePage === 'profile' && (
          <ProfilePage
            artisanId={selectedArtisanId}
            userType={userType}
            setUserType={setUserType}
            onBackToSearch={handleBackToSearch}
            onRequireRegistration={() => {
              setActivePage('choix');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {activePage === 'login' && (
          <Login 
            onLogin={handleLoginSuccess} 
            onForgotPassword={() => { setActivePage('forgot_password'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          />
        )}
        {activePage === 'forgot_password' && (
          <ForgotPassword 
            onBack={() => { setActivePage('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onResetSuccess={() => { setActivePage('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}
        {activePage === 'choix' && (
          <Choix onNavigate={setActivePage} />
        )}
        {activePage === 'inscription_artisan' && (
          <InscriptionArtisan onSuccess={handleArtisanRegistered} />
        )}
        {activePage === 'inscription_client' && (
          <InscriptionClient onSuccess={handleClientRegistered} />
        )}
        {activePage === 'notifications' && (
          <NotificationsPage />
        )}
        {activePage === 'client_profile' && (
          <ProfilClient
            onNavigateToInscription={() => setActivePage('inscription_client')}
            onNavigateToArtisanProfile={handleSelectArtisan}
          />
        )}
        {activePage === 'admin_profile' && (
          <ProfilAdmin />
        )}
        {activePage === 'mon_profil' && (
          <MonProfilArtisan onBack={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}
        {activePage === 'change_password' && (
          <ChangePassword onBack={() => { setActivePage('mon_profil'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}
      </div>

      {/* FOOTER */}
      {activePage !== 'login' && activePage !== 'forgot_password' && activePage !== 'choix' && activePage !== 'inscription_artisan' && activePage !== 'inscription_client' && activePage !== 'mon_profil' && activePage !== 'change_password' && (
        <Footer
          setActivePage={(page) => {
            setActivePage(page as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectCategory={handleSelectCategory}
        />
      )}

    </div>
  );
}