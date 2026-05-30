import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, useAnimation } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Award,
  Hammer,
  Zap,
  Droplet,
  Layers,
  Wrench,
  Brush,
  Compass,
  Wind,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Clock,
  CalendarCheck,
  MessageSquareHeart,
  UserCheck,
  Building,
  Calendar
} from 'lucide-react';
import { api } from '../utils/api';
// Remove mock data import completely

// --- Sub-Components for Testimonials ---
interface PremiumTestimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

const premiumTestimonials: PremiumTestimonial[] = [
  {
    text: "Grâce à HandPro, j'ai trouvé un électricien diplômé de l'OFPPT en 10 minutes pour mon cabinet médical. Ponctuel et d'une compétence rare.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
    name: "Dr. Amina Tazi",
    role: "Casablanca",
  },
  {
    text: "La rénovation de notre maison d'hôtes était un défi. HandPro nous a permis de comparer les portfolios et trouver notre Maâlem Youssef.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
    name: "Laurent & Myriam",
    role: "Marrakech",
  },
  {
    text: "Le suivi GPS est formidable. Mon chauffe-eau a lâché un samedi soir, j'ai pu repérer le plombier le plus proche instantanément.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    name: "Omar Chraibi",
    role: "Rabat",
  },
  {
    text: "Un travail exceptionnel de peinture décorative stuc. Chantier extrêmement propre et finition haut de gamme. Je recommande vivement !",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
    name: "Nadia El Alami",
    role: "Tanger",
  },
  {
    text: "J'ai fait refaire toutes les portes en bois sculpté de mon riad par un menuisier qualifié de l'OFPPT. Magnifique travail d'art traditionnel.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
    name: "Karim Bensouda",
    role: "Fès",
  },
  {
    text: "Enfin une plateforme au Maroc qui valorise le travail bien fait avec des profils vérifiés et des assurances réelles sur les chantiers.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150",
    name: "Yassine Belkhayat",
    role: "Casablanca",
  },
  {
    text: "La zelligeuse Fatima a transformé notre fontaine murale en véritable chef-d'œuvre. Une patience et une précision incroyables.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150",
    name: "Sofia Mansouri",
    role: "Marrakech",
  },
  {
    text: "Recherche de fuite thermique faite sans aucune casse grâce au matériel infrarouge moderne de l'artisan. Très professionnel.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    name: "Mehdi Saidi",
    role: "Rabat",
  },
  {
    text: "Installation domotique complète de ma villa en un temps record. Ponctuel, transparent et très de confiance dans ses interventions.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150",
    name: "Hassan El Idrissi",
    role: "Casablanca",
  }
];

const firstColumn = premiumTestimonials.slice(0, 3);
const secondColumn = premiumTestimonials.slice(3, 6);
const thirdColumn = premiumTestimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: PremiumTestimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{ 
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 20px 40px -10px rgba(96, 58, 42, 0.15), 0 10px 10px -5px rgba(96, 58, 42, 0.05), 0 0 0 1px rgba(205, 181, 142, 0.2)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{ 
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 20px 40px -10px rgba(96, 58, 42, 0.15), 0 10px 10px -5px rgba(96, 58, 42, 0.05), 0 0 0 1px rgba(205, 181, 142, 0.2)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-6 rounded-2xl border border-[#CDB58E]/30 shadow-md max-w-xs w-full bg-[#fff8f0] transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-[#603A2A]/30 list-none" 
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-xs sm:text-sm text-[#8E887F] font-sans leading-relaxed italic m-0 transition-colors duration-300">
                      "{text}"
                    </p>
                    <footer className="flex items-center gap-3 mt-5 pt-4 border-t border-[#8E887F]/10">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-10 w-10 rounded-full object-cover border border-[#CDB58E] group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                      <div className="flex flex-col text-left">
                        <cite className="font-sans font-bold text-xs text-[#2A1B15] not-italic leading-none">
                          {name}
                        </cite>
                        <span className="text-[10px] text-[#603A2A] font-semibold mt-1">
                          Client vérifié • {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};


interface HomePageProps {
  onSearch: (city: string, specialty: string) => void;
  onSelectArtisan: (id: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const HomePage = ({
  onSearch,
  onSelectArtisan,
  onSelectCategory
}: HomePageProps) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [appliedAnnouncements, setAppliedAnnouncements] = useState<string[]>([]);

  // State variables for dynamic data
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [statistics, setStatistics] = useState({ artisans: '...', cities: '...', rating: '...' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, categoriesData, artisansData, announcementsData, statsData] = await Promise.all([
          api.getCities(),
          api.getCategories(),
          api.getArtisans(),
          api.getAnnouncements().catch(() => []), // Ignore announcements error if missing
          api.getStatistics()
        ]);
        setCities(citiesData);
        setCategories(categoriesData);
        setArtisans(artisansData);
        setAnnouncements(announcementsData);
        setStatistics(statsData);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedCity, selectedSpecialty);
  };

  const handleApply = async (id: string) => {
    try {
      // Extract numeric ID from formatted announcement ID (e.g. "ann-2" → 2)
      const numericId = id.replace('ann-', '');
      await api.applyToAnnouncement(numericId);
      setAppliedAnnouncements([...appliedAnnouncements, id]);
      alert("Candidature envoyée avec succès");
    } catch (err: any) {
      alert(err.message || "Erreur lors de la candidature");
    }
  };

  // Helper to render Category Icon dynamically
  const renderCategoryIcon = (iconName: string) => {
    const props = { size: 28, className: "text-[#603A2A] group-hover:text-[#CDB58E] stroke-[1.5] group-hover:scale-110 transition-all duration-300" };
    switch (iconName) {
      case 'Hammer': return <Hammer {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Droplet': return <Droplet {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'Brush': return <Brush {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Wind': return <Wind {...props} />;
      default: return <Hammer {...props} />;
    }
  };

  // Only certified artisans for Section 2
  const certifiedArtisans = artisans.filter(a => a.isCertified);
  const duplicatedArtisans = [...certifiedArtisans, ...certifiedArtisans];

  // --- Auto-scroll and manual slider logic for certified artisans ---
  const sliderRef = useRef<HTMLDivElement>(null);
  const [halfScrollWidth, setHalfScrollWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(isHovered);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Technical requirements: useMotionValue and useAnimation
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (sliderRef.current) {
      setHalfScrollWidth(sliderRef.current.scrollWidth / 2);
    }
  }, [certifiedArtisans]);

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        setHalfScrollWidth(sliderRef.current.scrollWidth / 2);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous loop animation
  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      if (!isHoveredRef.current && halfScrollWidth > 0) {
        const currentX = x.get();
        const nextX = currentX - 0.75; // Smooth continuous scroll
        if (nextX <= -halfScrollWidth) {
          x.set(0);
        } else {
          x.set(nextX);
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [halfScrollWidth]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Resume auto-scroll after a delay of 1 second
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 1000);
  };

  // Manual navigation buttons
  const scrollSlider = (direction: "left" | "right") => {
    handleMouseEnter(); // Pause auto-scroll immediately
    
    const currentX = x.get();
    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8;

    let targetX = direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    // Loop boundaries gracefully
    if (targetX > 0) {
      targetX = -halfScrollWidth + targetX;
    } else if (targetX < -halfScrollWidth) {
      targetX = targetX + halfScrollWidth;
    }

    animate(x, targetX, {
      type: "spring",
      stiffness: 120,
      damping: 20,
    });

    handleMouseLeave(); // Resume auto-scroll after 1 second delay
  };

  return (
    <div className="w-full animate-fadeIn">

      {/* SECTION 1 : HERO */}
      <section className="relative bg-[#E8DCC8] text-[#F5EDE0] overflow-hidden border-b border-[#CDB58E]/10">

        {/* Subtle background grain texture / zellige background */}
        <div className="absolute inset-0 zellige-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Split layout — texte à gauche (60%) */}
            <div className="lg:col-span-7 z-10 space-y-4 text-center lg:text-left">
              <span className="inline-block px-3 py-1 bg-[#603A2A]/60 border border-[#CDB58E]/30 rounded-full text-xs font-badge tracking-wider text-[#2A1B15] uppercase">
                Artisanat Premium & Savoir-Faire d'Excellence
              </span>

              <h1 className="font-display text-4xl sm:text-5xl md:text-5xl font-bold text-[#2A1B15] leading-tight">
                Trouvez l'artisan qu'il vous faut,<br />près de chez vous
              </h1>

              <p className="font-sans text-[#8E887F] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                Connectez-vous instantanément avec des menuisiers, électriciens, plombiers et spécialistes marocains hautement qualifiés. Certifiés par l'État et évalués par vos pairs.
              </p>

              {/* Barre de recherche (montée ici) */}
              <div className="pt-4 w-full">
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-[#111B2F] p-3 rounded-xl sm:rounded-full shadow-2xl border border-[#CDB58E]/40 flex flex-col sm:flex-row items-center gap-3 w-full"
                >
                  <div className="flex items-center gap-2 px-3 w-full sm:w-auto sm:flex-1 border-b sm:border-b-0 sm:border-r border-[#8E887F]/30 pb-2 sm:pb-0">
                    <MapPin size={20} className="text-[#CDB58E] shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-[#F5EDE0] text-sm w-full focus:outline-none cursor-pointer py-1"
                    >
                      <option value="" className="bg-[#2A1B15] text-[#8E887F]">Toutes les Villes</option>
                      {cities.map(c => (
                        <option key={c} value={c} className="bg-[#2A1B15] text-[#F5EDE0]">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-3 w-full sm:w-auto sm:flex-1 pb-2 sm:pb-0">
                    <Search size={20} className="text-[#CDB58E] shrink-0" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="bg-transparent text-[#F5EDE0] text-sm w-full focus:outline-none cursor-pointer py-1"
                    >
                      <option value="" className="bg-[#2A1B15] text-[#8E887F]">Quel type d'artisan ?</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name} className="bg-[#2A1B15] text-[#F5EDE0]">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#603A2A] text-white hover:bg-[#603A2A]/90 transition-all font-medium rounded-lg sm:rounded-full text-sm shrink-0 shadow flex items-center justify-center gap-2 border border-[#CDB58E]/20"
                  >
                    <span>Rechercher</span>
                    <ChevronRight size={16} className="text-[#CDB58E]" />
                  </button>
                </form>
              </div>
            </div>

            {/* Image floue artisan à droite avec overlay #603A2A à 40% d'opacité */}
            <div className="lg:col-span-5 relative flex justify-center hidden sm:flex">
              <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#CDB58E]/30">
                <img
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan marocain travaillant le bois"
                  className="w-full h-full object-cover filter blur-[0.5px] scale-105"
                />
                {/* Overlay #603A2A à 40% d'opacité */}
                <div className="absolute inset-0 bg-[#603A2A] opacity-40 mix-blend-multiply" />
                {/* Decorative border frames */}
                <div className="absolute inset-3 border border-[#CDB58E]/40 rounded-xl pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#2A1B15]/90 backdrop-blur-sm p-4 rounded-xl border border-[#CDB58E]/30 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={16} className="text-[#CDB58E]" />
                    <span className="text-xs font-badge tracking-wider text-[#CDB58E] uppercase">Sceau d'Authenticité</span>
                  </div>
                  <p className="text-xs text-[#F5EDE0] italic font-subtitle">
                    "La rigueur de nos pères, sublimée par les exigences d'aujourd'hui."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Stats rapides centrées en bas du hero (descendues ici) */}
          <div className="mt-8 relative z-20 max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-12 bg-[#111B2F]/5 p-4 rounded-2xl border border-[#CDB58E]/20 backdrop-blur-sm">
            <div className="text-center">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#111B2F] block">{statistics.artisans}</span>
              <span className="text-sm text-[#8E887F] font-badge uppercase tracking-wider mt-1 block">Artisans Vérifiés</span>
            </div>
            <div className="text-center border-l-0 sm:border-l border-[#8E887F]/20 pl-0 sm:pl-16">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#111B2F] block">{statistics.cities}</span>
              <span className="text-sm text-[#8E887F] font-badge uppercase tracking-wider mt-1 block">Villes Couvertes</span>
            </div>
            <div className="text-center border-l-0 sm:border-l border-[#8E887F]/20 pl-0 sm:pl-16">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#111B2F] block">{statistics.rating}</span>
              <span className="text-sm text-[#8E887F] font-badge uppercase tracking-wider mt-1 block">Satisfaction</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 : ARTISANS CERTIFIÉS - DRAGGABLE CARDS SLIDER */}
      <section id="ofppt-section" className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-b border-[#CDB58E]/30 relative overflow-hidden">
        {/* Subtle background grain / zellige background */}
        <div className="absolute inset-0 zellige-pattern opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Titre section */}
          <div className="text-center max-w-3xl mx-auto mb-4">
            <div className="inline-flex items-center justify-center gap-2 bg-[#603A2A] text-[#CDB58E] px-4 py-1.5 rounded-full text-xs font-badge tracking-widest uppercase mb-3 shadow">
              <Award size={15} className="fill-[#CDB58E] text-[#603A2A]" />
              <span>Garantie de Qualification</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1B15] flex items-center justify-center gap-3 flex-wrap">
              <span>Artisans Certifiés</span>
            </h2>
            <p className="text-sm text-[#8E887F] font-sans mt-2">
              Découvrez nos lauréats des instituts spécialisés de l'OFPPT, arborant fièrement le badge de certification d'État pour une sécurité absolue sur vos chantiers.
            </p>
          </div>

          {/* Automatic Infinite Carousel */}
          <div className="w-full relative overflow-hidden py-2 group/slider">
            {/* Left and Right beautiful premium glassmorphism fades */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#F5EDE0] to-transparent md:w-32" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#F5EDE0] to-transparent md:w-32" />

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hidden md:block">
              <button
                onClick={() => scrollSlider("left")}
                className="h-12 w-12 rounded-full bg-[#fff8f0]/95 backdrop-blur-md border border-[#CDB58E]/40 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-95 text-[#603A2A] cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hidden md:block">
              <button
                onClick={() => scrollSlider("right")}
                className="h-12 w-12 rounded-full bg-[#fff8f0]/95 backdrop-blur-md border border-[#CDB58E]/40 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-95 text-[#603A2A] cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <motion.div
              ref={sliderRef}
              style={{ x }}
              className="flex gap-5 w-max transform-gpu"
            >
              {duplicatedArtisans.map((artisan, index) => (
                <motion.div
                  key={`${artisan.id}-${index}`}
                  className="min-w-[240px] sm:min-w-[260px] max-w-[260px] h-[310px]"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10, 
                    transition: { duration: 0.2 } 
                  }}
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-[#CDB58E]/30 bg-[#fff8f0] shadow-md transition-all duration-500 hover:border-[#603A2A]/50 hover:shadow-2xl hover:shadow-[#603A2A]/10 flex flex-col justify-between">
                    {/* Image Section */}
                    <div className="relative h-36 overflow-hidden shrink-0">
                      <motion.img
                        src={artisan.coverPhoto}
                        alt={artisan.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B15]/90 via-[#2A1B15]/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-[#603A2A]/85 backdrop-blur-md border border-[#CDB58E]/30 text-[#CDB58E] text-[9px] font-badge tracking-wider uppercase px-2 py-0.5 rounded-full">
                          {artisan.specialty}
                        </span>
                      </div>

                      {/* Hover Overlay Action */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSelectArtisan(artisan.id)}
                          className="flex items-center gap-1.5 rounded-full bg-[#603A2A] px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-lg border border-[#CDB58E]/30"
                        >
                          Voir profil complet
                        </motion.button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3.5 sm:p-4 flex flex-col h-[calc(100%-9rem)] justify-between text-left">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-display font-bold leading-tight tracking-tight text-[#2A1B15] transition-colors group-hover:text-[#603A2A] line-clamp-1">
                          {artisan.name}
                        </h3>
                        
                        {/* Note étoiles (#CDB58E) */}
                        <div className="flex items-center justify-start gap-1">
                          <div className="flex text-[#CDB58E]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                className={i < Math.floor(artisan.rating) ? "fill-[#CDB58E] text-[#CDB58E]" : "opacity-30"}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#2A1B15]">{artisan.rating}</span>
                          <span className="text-[9px] text-[#8E887F]">({artisan.reviewCount} avis)</span>
                        </div>

                        <p className="line-clamp-2 text-[11px] text-[#8E887F] leading-snug font-sans mt-0.5">
                          {artisan.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-auto border-t border-[#8E887F]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden border border-[#CDB58E]/50 ring-2 ring-[#F5EDE0] shrink-0">
                            <img
                              src={artisan.avatar}
                              alt={artisan.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#2A1B15] leading-none">
                              {artisan.city}
                            </span>
                            <span className="text-[9px] text-[#8E887F] mt-1">
                              مهني معتمد
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[9px] font-medium text-[#603A2A] bg-[#F5EDE0] px-2 py-0.5 rounded-full">
                          <Clock className="h-2.5 w-2.5 text-[#603A2A]" />
                          <span>{artisan.experienceYears} ans exp.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 3 : CATÉGORIES D'ARTISANS */}
      <section className="bg-[#F5EDE0] py-8 md:py-10 text-[#2A1B15] border-b border-[#CDB58E]/30 relative overflow-hidden">
        {/* Subtle decorative zellige pattern overlay */}
        <div className="absolute inset-0 zellige-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Titre centré */}
          <div className="text-center mb-6">
            <span className="text-[10px] sm:text-xs font-badge tracking-widest text-[#8E887F] uppercase block mb-1">
              Expertise Ciblée
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2A1B15]">
              Explorez par Spécialité
            </h2>
            <div className="w-12 h-0.5 bg-[#603A2A] mx-auto mt-2" />
          </div>

          {/* Grille de catégories avec icône personnalisée */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group bg-white hover:bg-[#603A2A] p-4 rounded-xl border border-[#CDB58E]/30 hover:border-[#603A2A] transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5EDE0] group-hover:bg-[#2A1B15] flex items-center justify-center border border-[#CDB58E]/30 transition-colors">
                  <div className="scale-75 group-hover:text-white text-[#603A2A] transition-colors">
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                </div>
                <span className="font-sans font-medium text-xs sm:text-sm text-[#2A1B15] group-hover:text-white transition-colors block">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4 : COMMENT ÇA MARCHE */}
      <section className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-b border-[#CDB58E]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#603A2A]">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-[#8E887F] mt-2">
              Une démarche simplifiée et sécurisée pour concrétiser vos projets en toute confiance.
            </p>
          </div>

          {/* 4 étapes en timeline horizontale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">

            {/* Step 1 */}
            <div className="text-center relative p-4">
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#CDB58E]/40 hidden lg:block -z-0" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <Search className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                01
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Recherchez l'artisan
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Filtrez par ville, spécialité ou proximité immédiate par GPS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative p-4">
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#CDB58E]/40 hidden lg:block -z-0" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <UserCheck className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                02
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Consultez le profil
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Vérifiez les certifications, le portfolio de réalisations et les avis clients réels.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative p-4">
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#CDB58E]/40 hidden lg:block -z-0" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <CalendarCheck className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                03
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Prenez rendez-vous
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Contactez directement le Maâlem par téléphone ou réservez un créneau sur son calendrier.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center relative p-4">
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-[#CDB58E] flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageSquareHeart className="text-[#603A2A]" size={24} />
              </div>
              <span className="font-display text-4xl font-bold text-[#CDB58E] block leading-none mb-1">
                04
              </span>
              <h3 className="font-sans font-bold text-base text-[#2A1B15]">
                Évaluez le service
              </h3>
              <p className="text-xs text-[#8E887F] mt-1">
                Contribuez à l'excellence en laissant une note et des commentaires constructifs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5 : ANNONCES & OFFRES D'EMPLOI */}
      <section id="annonces-section" className="bg-[#CDB58E] py-10 md:py-12 text-[#2A1B15] border-b border-[#603A2A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center text-center mb-10 gap-6">
            <div>
              <div className="flex items-center justify-center gap-2 text-[#603A2A] text-xs font-badge tracking-wider uppercase mb-1">
                <Briefcase size={14} />
                <span>Espace B2B & Recrutement Pro</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2A1B15]">
                Offres & Recrutement
              </h2>
              <p className="text-xs text-[#603A2A] mt-1 font-medium">
                Opportunités publiées par les entreprises du bâtiment et de l'artisanat marocain.
              </p>
            </div>

            <button
              onClick={() => setShowAllAnnouncements(!showAllAnnouncements)}
              className="px-6 py-2 bg-[#2A1B15] text-[#CDB58E] hover:bg-[#2A1B15]/90 rounded-full text-xs font-bold shrink-0 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <span>{showAllAnnouncements ? "Voir moins d'annonces" : "Voir toutes les annonces"}</span>
              {showAllAnnouncements ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          {/* Cartes d'annonces (3 en ligne) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(showAllAnnouncements ? announcements : announcements.slice(0, 3)).map((ann) => {
              const isApplied = appliedAnnouncements.includes(ann.id);
              return (
                <div
                  key={ann.id}
                  className="bg-[#111B2F] rounded-xl p-4 sm:p-5 border border-[#8E887F]/30 hover:border-[#CDB58E] transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Tag de catégorie coloré */}
                    <span className="inline-block px-2 py-0.5 bg-[#603A2A] text-[#CDB58E] text-[9px] font-badge tracking-wider uppercase rounded mb-2.5">
                      {ann.category}
                    </span>

                    {/* Titre de l'annonce */}
                    <h3 className="font-sans font-bold text-sm text-white line-clamp-2 mb-1.5 hover:text-[#CDB58E] transition-colors leading-tight">
                      {ann.title}
                    </h3>

                    {/* Entreprise */}
                    <p className="text-[11px] text-[#CDB58E] font-medium mb-2.5 flex items-center gap-1">
                      <Building size={12} />
                      {ann.company}
                    </p>

                    {/* Description */}
                    <p className="text-[11px] text-[#8E887F] line-clamp-2 mb-3 leading-relaxed font-sans">
                      {ann.description}
                    </p>
                  </div>

                  <div>
                    {/* Ville + date */}
                    <div className="flex items-center justify-between text-[10px] text-[#8E887F] pt-2.5 border-t border-[#8E887F]/10 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-[#603A2A]" />
                        {ann.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {ann.date}
                      </span>
                    </div>

                    {/* Bouton "Postuler" */}
                    <button
                      onClick={() => handleApply(ann.id)}
                      disabled={isApplied}
                      className={`w-full py-1.5 rounded text-[11px] font-medium transition-all ${isApplied
                        ? 'bg-green-900/40 text-green-300 border border-green-700/50 cursor-default'
                        : 'bg-[#603A2A] text-white hover:bg-[#603A2A]/90 font-bold shadow hover:shadow-md'
                        }`}
                    >
                      {isApplied ? '✓ Candidature Transmise' : 'Postuler à l\'offre'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 6 : TÉMOIGNAGES ANIMÉS */}
      <section className="bg-[#F5EDE0] py-16 text-[#2A1B15] border-t border-[#CDB58E]/20 overflow-hidden relative">
        {/* Decorative background zellige opacity */}
        <div className="absolute inset-0 zellige-pattern opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[#2A1B15]">
              La Voix de Nos Clients
            </h2>
            <p className="text-xs text-[#8E887F] mt-1 uppercase font-badge tracking-widest">
              Expériences authentiques certifiées
            </p>
            <div className="w-12 h-0.5 bg-[#CDB58E] mx-auto mt-2" />
          </div>

          {/* Grille de colonnes de témoignages défilants */}
          <div 
            className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[640px] overflow-hidden"
            role="region"
            aria-label="Témoignages défilants"
          >
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>

        </div>
      </section>

    </div>
  );
};
