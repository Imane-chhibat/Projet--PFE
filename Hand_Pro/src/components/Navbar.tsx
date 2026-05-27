import { ShieldCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import logoHand from '../images/logo_hand.png';

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
  const [userName, setUserName] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (userType === 'Artisan') {
      api.getMyProfile()
        .then(profile => {
          setAvatar(profile.avatar || null);
          setUserName(profile.name || null);
        })
        .catch(() => {
          setAvatar(null);
          setUserName(null);
        });
      
      api.getArtisanRequests()
        .then(res => setNotifications(res.requests || []))
        .catch(err => console.error(err));
    } else {
      setAvatar(null);
      setUserName(null);
      setNotifications([]);
    }
  }, [userType, activePage]); // Re-fetch if activePage changes, to stay updated

  const handleOpenNotifications = async () => {
    setShowNotifications(true);
    if (notifications.some(n => !n.is_read)) {
      try {
        await api.markRequestsAsRead();
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAcceptRequest = async (id: number) => {
    try {
      const res = await api.acceptClientRequest(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'accepted' } : n));
      const clientPhone = res.request?.client?.phone || "";
      if (clientPhone) {
        window.open(`https://wa.me/${clientPhone}`, '_blank');
      } else {
        alert("Demande acceptée !");
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors de la validation");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2A1B15]/95 backdrop-blur-md border-b border-[#CDB58E]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={logoHand} 
              alt="HandPro Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
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
            ) : userType === 'Artisan' ? (
              <div className="relative z-30 group flex justify-center items-center">
                <div className="text-[#CDB58E] hover:text-white cursor-pointer flex items-center gap-2 font-bold text-sm bg-[#603A2A]/40 px-4 py-2 rounded-full border border-[#CDB58E]/30 transition-colors">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-[#2A1B15] flex items-center justify-center border border-[#CDB58E]">
                    {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : (userName?.charAt(0).toUpperCase() || 'A')}
                  </div>
                  Profil
                  {notifications.some(n => !n.is_read) && (
                    <div className="relative flex items-center justify-center ml-1">
                      <span className="absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-75"></span>
                      <span className="relative flex items-center justify-center bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full">
                        +{notifications.filter(n => !n.is_read).length >= 9 ? 9 : notifications.filter(n => !n.is_read).length}
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform z-40 border border-[#CDB58E]/30 overflow-hidden">
                  <button 
                    onClick={() => setActivePage('mon_profil')}
                    className="w-full text-left px-4 py-3 text-sm text-[#2A1B15] hover:bg-[#F5EDE0] flex items-center gap-2 transition-colors border-b border-[#F5EDE0]"
                  >
                    <span>Aller au Profil</span>
                  </button>
                  <button 
                    onClick={handleOpenNotifications}
                    className="w-full text-left px-4 py-3 text-sm text-[#2A1B15] hover:bg-[#F5EDE0] flex items-center justify-between transition-colors border-b border-[#F5EDE0]"
                  >
                    <span>Notifications</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActivePage('change_password');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-[#2A1B15] hover:bg-[#F5EDE0] flex items-center gap-2 transition-colors border-b border-[#F5EDE0]"
                  >
                    <span>Changer mot de passe</span>
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      localStorage.removeItem('auth_user');
                      setUserType('Visitor');
                      setActivePage('home');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-30 group flex justify-center items-center">
                <div className="text-[#CDB58E] hover:text-white cursor-pointer flex items-center gap-2 font-bold text-sm bg-[#603A2A]/40 px-4 py-2 rounded-full border border-[#CDB58E]/30 transition-colors">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#2A1B15] font-bold text-xs bg-[#CDB58E]">
                    U
                  </div>
                  Mon Compte
                </div>

                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform z-40 border border-[#CDB58E]/30 overflow-hidden">
                  <button 
                    onClick={() => setActivePage('client_profile')}
                    className="w-full text-left px-4 py-3 text-sm text-[#2A1B15] hover:bg-[#F5EDE0] flex items-center gap-2 transition-colors border-b border-[#F5EDE0]"
                  >
                    <span>Mon Profil</span>
                  </button>
                  <button 
                    onClick={() => setActivePage('change_password')}
                    className="w-full text-left px-4 py-3 text-sm text-[#2A1B15] hover:bg-[#F5EDE0] flex items-center gap-2 transition-colors border-b border-[#F5EDE0]"
                  >
                    <span>Changer mot de passe</span>
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      localStorage.removeItem('auth_user');
                      setUserType('Visitor');
                      setActivePage('home');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
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

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-[100] bg-[#2A1B15]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col text-[#2A1B15] shadow-2xl border-2 border-[#CDB58E] relative">
            <div className="p-4 border-b border-[#F5EDE0] flex justify-between items-center bg-[#F5EDE0]/30">
              <h3 className="font-display font-bold text-xl text-[#2A1B15]">Mes Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-[#8E887F]">
                  <p>Aucune notification pour le moment.</p>
                </div>
              ) : (
                notifications.map((notif: any) => (
                  <div key={notif.id} className="bg-white rounded-xl p-4 border border-[#CDB58E]/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#603A2A]">{notif.client?.name || "Client"}</span>
                        {notif.status === 'pending' && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Nouveau</span>}
                        {notif.status === 'accepted' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Accepté</span>}
                      </div>
                      <p className="text-xs text-[#8E887F]">
                        Souhaite un rendez-vous le : <strong className="text-[#2A1B15]">{notif.requested_date}</strong>
                      </p>
                      {notif.client?.phone && notif.status === 'accepted' && (
                        <p className="text-xs mt-1">
                          📞 <a href={`tel:${notif.client.phone}`} className="text-[#603A2A] hover:underline font-bold">{notif.client.phone}</a>
                        </p>
                      )}
                    </div>
                    {notif.status === 'pending' && (
                      <button 
                        onClick={() => handleAcceptRequest(notif.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-all font-bold rounded text-xs uppercase tracking-wider"
                      >
                        Valider
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};
