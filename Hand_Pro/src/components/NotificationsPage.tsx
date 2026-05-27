import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { ArrowLeft } from 'lucide-react';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'upcoming' | 'history'>('notifications');
  const [pending, setPending] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // Load data once – you can replace with real endpoints later
  useEffect(() => {
    // Pending client requests (new notifications)
    api.getArtisanRequests().then(setPending).catch(console.error);
    // Accepted requests (upcoming appointments)
    api.getArtisanRequests().then((all: any[]) => {
      const now = new Date();
      setUpcoming(all.filter(r => r.status === 'accepted' && new Date(r.requested_date) >= now));
      setHistory(all.filter(r => r.status === 'accepted' && new Date(r.requested_date) < now));
    }).catch(console.error);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <p className="text-[#8E887F]">Aucune nouvelle demande.</p>
            ) : (
              pending.map(req => (
                <div key={req.id} className="p-4 bg-[#F5EDE0]/30 rounded-lg border border-[#CDB58E]/20">
                  <p className="font-bold text-[#603A2A]">{req.client?.name || 'Client'}</p>
                  <p className="text-sm text-[#8E887F]">Date demandée : <span className="text-[#2A1B15]">{req.requested_date}</span></p>
                  {/* Accept / Refuse buttons could be added here */}
                </div>
              ))
            )}
          </div>
        );
      case 'upcoming':
        return (
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-[#8E887F]">Aucun rendez‑vous à venir.</p>
            ) : (
              upcoming.map(r => (
                <div key={r.id} className="p-4 bg-[#F5EDE0]/30 rounded-lg border border-[#CDB58E]/20">
                  <p className="font-bold text-[#603A2A]">{r.client?.name || 'Client'}</p>
                  <p className="text-sm text-[#8E887F]">Le : <span className="text-[#2A1B15]">{r.requested_date}</span></p>
                </div>
              ))
            )}
          </div>
        );
      case 'history':
        return (
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-[#8E887F]">Aucun rendez‑vous passé.</p>
            ) : (
              history.map(r => (
                <div key={r.id} className="p-4 bg-[#F5EDE0]/30 rounded-lg border border-[#CDB58E]/20">
                  <p className="font-bold text-[#603A2A]">{r.client?.name || 'Client'}</p>
                  <p className="text-sm text-[#8E887F]">Le : <span className="text-[#2A1B15]">{r.requested_date}</span></p>
                </div>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#2A1B15] text-[#F5EDE0] font-sans">
      {/* Header */}
      <header className="bg-[#603A2A] py-4 px-6 flex items-center justify-between">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-[#F5EDE0] hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="font-display text-xl font-bold">Notifications & Rendez‑vous</h1>
        <div></div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
        {/* Right side navbar */}
        <aside className="w-64 bg-[#111B2F] border-l border-[#CDB58E]/20 flex flex-col">
          <nav className="flex flex-col mt-4 space-y-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 text-left ${activeTab === 'notifications' ? 'bg-[#603A2A] text-[#F5EDE0]' : 'text-[#8E887F] hover:bg-[#603A2A]/50'}`}
            >
              🔔 Notifications
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-4 py-2 text-left ${activeTab === 'upcoming' ? 'bg-[#603A2A] text-[#F5EDE0]' : 'text-[#8E887F] hover:bg-[#603A2A]/50'}`}
            >
              📅 Mes rendez‑vous
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 text-left ${activeTab === 'history' ? 'bg-[#603A2A] text-[#F5EDE0]' : 'text-[#8E887F] hover:bg-[#603A2A]/50'}`}
            >
              📜 Ancien rendez‑vous
            </button>
          </nav>
        </aside>
      </div>
    </div>
  );
};
