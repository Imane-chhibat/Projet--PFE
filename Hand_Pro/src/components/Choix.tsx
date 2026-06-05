import React from "react";
import { DestinationCard } from "./ui/card-21";

export default function Choix({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div 
      className="flex flex-1 w-full flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-4 md:p-8 overflow-hidden" 
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="w-full max-w-[280px] h-[35vh] min-h-[250px] md:h-[400px]">
        <DestinationCard
          imageUrl="https://i.pinimg.com/736x/4d/ee/3d/4dee3dc24bb0820fe21a6c06ce7665de.jpg"
          location="Client"
          stats="Trouver un artisan"
          onClick={() => onNavigate('inscription_client')}
          themeColor="35 70% 35%" 
          buttonText="Inscription"
        />
      </div>
      
      <div className="w-full max-w-[280px] h-[35vh] min-h-[250px] md:h-[400px]">
        <DestinationCard
          imageUrl="https://i.pinimg.com/1200x/39/b4/cd/39b4cd8cd318773c16c58f0e58ce81b8.jpg"
          location="Artisan"
          stats="Mettre en valeur votre savoir-faire"
          onClick={() => onNavigate('inscription_artisan')}
          themeColor="250 50% 30%"
          buttonText="Inscription"
        />
      </div>
    </div>
  );
}
