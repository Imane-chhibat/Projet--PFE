import React from "react";
import { DestinationCard } from "./ui/card-21";

export default function Choix({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div 
      className="flex min-h-screen w-full flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-8" 
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="w-full max-w-[280px] h-[400px]">
        <DestinationCard
          imageUrl="https://i.pinimg.com/736x/4d/ee/3d/4dee3dc24bb0820fe21a6c06ce7665de.jpg"
          location="Client"
          flag="👤"
          stats="Trouver un artisan"
          onClick={() => onNavigate('inscription_client')}
          themeColor="150 50% 25%" 
          buttonText="Inscription"
        />
      </div>
      
      <div className="w-full max-w-[280px] h-[400px]">
        <DestinationCard
          imageUrl="https://i.pinimg.com/1200x/39/b4/cd/39b4cd8cd318773c16c58f0e58ce81b8.jpg"
          location="Artisan"
          flag="🛠️"
          stats="Mettre en valeur votre savoir-faire"
          onClick={() => onNavigate('inscription_artisan')}
          themeColor="250 50% 30%"
          buttonText="Inscription"
        />
      </div>
    </div>
  );
}
