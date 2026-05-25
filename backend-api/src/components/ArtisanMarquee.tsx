import React, { useMemo } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

/* ─── Types ─────────────────────────────────────────────── */

type CardT = {
  image: string;
  name: string;
  specialty: string;
  city: string;
  rating: number;
  reviewsCount: number;
  experience: string;
};

/* ─── Data ───────────────────────────────────────────────── */

const ROW_1: CardT[] = [
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    name: "Hamid Bensouda",
    specialty: "Menuiserie & Ébénisterie",
    city: "Fès",
    rating: 4.9,
    reviewsCount: 142,
    experience: "18 ans d'exp.",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    name: "Youssef El Fassi",
    specialty: "Plomberie & Sanitaire",
    city: "Casablanca",
    rating: 4.7,
    reviewsCount: 98,
    experience: "12 ans d'exp.",
  },
  {
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&auto=format&fit=crop&q=80",
    name: "Rachid Amrani",
    specialty: "Électricité & Domotique",
    city: "Rabat",
    rating: 4.8,
    reviewsCount: 211,
    experience: "20 ans d'exp.",
  },
  {
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&auto=format&fit=crop&q=80",
    name: "Karim Ouazzani",
    specialty: "Zellige & Décoration",
    city: "Marrakech",
    rating: 5.0,
    reviewsCount: 87,
    experience: "25 ans d'exp.",
  },
];

const ROW_2: CardT[] = [
  {
    image: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&auto=format&fit=crop&q=80",
    name: "Omar Tazi",
    specialty: "Peinture & Enduit",
    city: "Tanger",
    rating: 4.6,
    reviewsCount: 73,
    experience: "10 ans d'exp.",
  },
  {
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
    name: "Said Lahrichi",
    specialty: "Carrelage & Faïence",
    city: "Meknès",
    rating: 4.8,
    reviewsCount: 130,
    experience: "15 ans d'exp.",
  },
  {
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&auto=format&fit=crop&q=80",
    name: "Hassan Moufid",
    specialty: "Serrurerie & Ferronnerie",
    city: "Agadir",
    rating: 4.7,
    reviewsCount: 59,
    experience: "9 ans d'exp.",
  },
  {
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
    name: "Nabil Benhida",
    specialty: "Climatisation & Froid",
    city: "Oujda",
    rating: 4.9,
    reviewsCount: 106,
    experience: "14 ans d'exp.",
  },
];

/* ─── Sub-components ─────────────────────────────────────── */

/** Filled star icon using lucide-react */
const FilledStar: React.FC<{ className?: string }> = ({ className }) => (
  <Star size={13} className={cn("fill-amber-400 text-amber-400", className)} />
);

/** Individual artisan card */
const ArtisanCard: React.FC<{ card: CardT }> = ({ card }) => (
  <div
    className={cn(
      "mx-3 w-72 shrink-0 rounded-3xl p-6 flex flex-col items-center",
      "bg-[#FAF6EE]",
      "shadow-[0_4px_24px_rgba(92,61,46,0.12)]",
      "border border-amber-100/60",
      "transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(92,61,46,0.2)]"
    )}
  >
    {/* ── Avatar + certified badge ── */}
    <div className="relative mb-1">
      <img
        src={card.image}
        alt={card.name}
        className="w-20 h-20 rounded-full object-cover border-4 border-[#CDB58E] shadow-md"
        loading="lazy"
      />
      {/* Arabic certified badge */}
      <span
        className={cn(
          "absolute -bottom-3 left-1/2 -translate-x-1/2",
          "bg-gradient-to-r from-[#C6A75E] to-[#a8873a]",
          "text-white text-[9px] font-bold whitespace-nowrap",
          "px-2 py-0.5 rounded-full shadow-sm",
          "leading-none"
        )}
        style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", direction: "rtl" }}
      >
        مهني معتمد
      </span>
    </div>

    {/* ── Name ── */}
    <h3 className="mt-6 text-[17px] font-bold text-[#2A1B15] text-center leading-tight tracking-tight">
      {card.name}
    </h3>

    {/* ── Specialty & City ── */}
    <p className="mt-1 text-[11px] text-amber-900/70 text-center font-medium">
      {card.specialty}
      <span className="mx-1 opacity-40">•</span>
      {card.city}
    </p>

    {/* ── Stars & Rating ── */}
    <div className="flex items-center gap-1 mt-3">
      {[...Array(5)].map((_, i) => (
        <FilledStar
          key={i}
          className={
            i < Math.floor(card.rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-amber-200 text-amber-200"
          }
        />
      ))}
      <span className="text-[11px] font-semibold text-[#2A1B15] ml-1">
        {card.rating.toFixed(1)}
      </span>
      <span className="text-[10px] text-stone-400 font-normal">
        ({card.reviewsCount})
      </span>
    </div>

    {/* ── Badges ── */}
    <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
      <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
        {card.experience}
      </span>
      <span className="text-[10px] font-semibold bg-amber-100/70 text-amber-800 px-2.5 py-1 rounded-full">
        ✓ Vérifié
      </span>
    </div>

    {/* ── CTA Button ── */}
    <button
      type="button"
      className={cn(
        "mt-5 w-full py-2.5 rounded-xl",
        "bg-[#5C3D2E] hover:bg-[#4a2f22]",
        "text-white text-sm font-semibold",
        "transition-colors duration-200",
        "shadow-sm"
      )}
    >
      Voir profil complet
    </button>
  </div>
);

/** One scrolling row */
const MarqueeRow: React.FC<{
  data: CardT[];
  reverse?: boolean;
  speed?: number;
}> = ({ data, reverse = false, speed = 30 }) => {
  const doubled = useMemo(() => [...data, ...data], [data]);

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden isolate">
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#FAF6EE] to-transparent md:w-28" />

      <div
        className={cn(
          "flex min-w-[200%] transform-gpu",
          reverse ? "pt-2 pb-8" : "pt-8 pb-2"
        )}
        style={{
          animation: `marqueeScroll ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((c, i) => (
          <ArtisanCard key={`${c.name}-${i}`} card={c} />
        ))}
      </div>

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#FAF6EE] to-transparent md:w-28" />
    </div>
  );
};

/* ─── Main exported component ────────────────────────────── */

const ArtisanMarquee: React.FC<{ className?: string }> = ({ className }) => (
  <section
    className={cn(
      "w-full py-16 px-4 overflow-hidden",
      "bg-[#FAF6EE]",
      className
    )}
  >
    {/* Section header */}
    <div className="mx-auto mb-10 flex flex-col items-center text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-[#CDB58E] mb-2">
        Nos Maâlems
      </span>
      <h2 className="text-3xl font-bold text-[#2A1B15] leading-tight">
        Des artisans certifiés, partout au Maroc
      </h2>
      <p className="mt-2 max-w-md text-sm text-stone-500">
        Chaque professionnel est vérifié, noté et recommandé par notre communauté.
      </p>
    </div>

    {/* Two scrolling rows */}
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      <MarqueeRow data={ROW_1} reverse={false} speed={28} />
      <MarqueeRow data={ROW_2} reverse={true} speed={32} />
    </div>
  </section>
);

export default ArtisanMarquee;
